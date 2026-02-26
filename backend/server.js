import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs/promises';
import path from 'path';
import { 
  initDatabase, 
  getOrCreateSession, 
  saveMessage, 
  getConversationHistory,
  getSessionStats,
  getActiveSessions 
} from './database/init.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('frontend'));

// Initialize Database
initDatabase();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const EMBEDDING_MODEL = 'models/gemini-embedding-001';
const CHAT_MODEL = 'models/gemini-2.5-flash';

// In-memory vector store
let vectorStore = [];
const SIMILARITY_THRESHOLD = 0.7;
const TOP_K = 3;

// Cosine similarity
function cosineSimilarity(a, b) {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

// Load vector store
async function loadVectorStore() {
  try {
    const vectorStorePath = path.join(process.cwd(), 'backend', 'data', 'vector_store.json');
    const data = await fs.readFile(vectorStorePath, 'utf-8');
    vectorStore = JSON.parse(data);
    console.log(`✅ Vector store loaded: ${vectorStore.length} chunks`);
  } catch (error) {
    console.error('❌ Failed to load vector store:', error.message);
    console.log('💡 Run: npm run ingest to create vector store');
    process.exit(1);
  }
}

// Generate embedding
async function generateQueryEmbedding(text) {
  try {
    const model = genAI.getGenerativeModel({ model: EMBEDDING_MODEL });
    const result = await model.embedContent(text);
    return result.embedding.values;
  } catch (error) {
    console.error('Embedding generation failed:', error.message);
    throw new Error('Failed to generate embedding');
  }
}

// Retrieve relevant chunks
async function retrieveRelevantChunks(query) {
  const queryEmbedding = await generateQueryEmbedding(query);
  
  const similarities = vectorStore.map(item => ({
    ...item,
    score: cosineSimilarity(queryEmbedding, item.embedding)
  }));
  
  similarities.sort((a, b) => b.score - a.score);
  
  const topChunks = similarities.slice(0, TOP_K);
  const relevantChunks = topChunks.filter(chunk => chunk.score >= SIMILARITY_THRESHOLD);
  
  return {
    chunks: relevantChunks,
    maxSimilarity: topChunks[0]?.score || 0
  };
}

// Generate response with fallback
async function generateResponse(query, context, history) {
  const systemPrompt = `You are a helpful support assistant. Answer the question using ONLY the context provided below.

If the context doesn't contain enough information, say "I don't have enough information to answer that question based on the available documentation."

Be concise, accurate, and helpful.`;

  const contextText = context.length > 0
    ? context.map((c, i) => `${i + 1}. ${c.content}`).join('\n\n')
    : 'No relevant context found.';

  const prompt = `${systemPrompt}

CONTEXT:
${contextText}

USER QUESTION: ${query}

ANSWER:`;

  try {
    const model = genAI.getGenerativeModel({ model: CHAT_MODEL });
    
    const chat = model.startChat({
      history: history.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      })),
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 500,
      }
    });

    const result = await chat.sendMessage(prompt);
    const response = result.response;
    const tokensUsed = response.usageMetadata?.totalTokenCount || 0;

    return {
      reply: response.text(),
      tokensUsed
    };
  } catch (error) {
    console.warn('⚠️  LLM generation failed, using fallback response');
    console.error('Error:', error.message);
    
    // Fallback: Return context directly
    const fallbackReply = context.length > 0
      ? `Based on the documentation:\n\n${context[0].content}\n\n(Note: AI response generation unavailable - showing retrieved context)`
      : "I don't have enough information to answer that question.";
    
    return {
      reply: fallbackReply,
      tokensUsed: 0
    };
  }
}

// POST /api/chat
app.post('/api/chat', async (req, res) => {
  try {
    const { sessionId, message } = req.body;
    
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Invalid message' });
    }
    
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID required' });
    }
    
    // Get or create session in database
    getOrCreateSession(sessionId);
    
    // Get conversation history from database
    const dbHistory = getConversationHistory(sessionId, 10);
    const history = dbHistory.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    // Retrieve relevant chunks
    const { chunks, maxSimilarity } = await retrieveRelevantChunks(message);
    
    console.log(`🔍 Query: "${message}"`);
    console.log(`📊 Retrieved ${chunks.length} chunks (max similarity: ${maxSimilarity.toFixed(3)})`);
    
    // Generate response
    let reply, tokensUsed;
    
    if (chunks.length === 0 || maxSimilarity < SIMILARITY_THRESHOLD) {
      reply = "I don't have enough information to answer that question based on the available documentation. Please ask about account management, payments, security, or support topics.";
      tokensUsed = 0;
    } else {
      const result = await generateResponse(message, chunks, history.slice(-5));
      reply = result.reply;
      tokensUsed = result.tokensUsed;
    }
    
    // Save to database
    saveMessage(sessionId, 'user', message);
    saveMessage(sessionId, 'assistant', reply, {
      tokensUsed,
      chunksRetrieved: chunks.length,
      maxSimilarity
    });
    
    res.json({
      reply,
      tokensUsed,
      retrievedChunks: chunks.length,
      maxSimilarity: maxSimilarity.toFixed(3),
      chunkDetails: chunks.map(c => ({
        title: c.title,
        score: c.score.toFixed(3)
      }))
    });
    
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// GET /api/health
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    vectorStoreSize: vectorStore.length,
    activeSessions: getActiveSessions().length,
    embeddingModel: EMBEDDING_MODEL,
    chatModel: CHAT_MODEL,
    database: 'SQLite'
  });
});

// GET /api/stats
app.get('/api/stats', (req, res) => {
  const uniqueDocs = [...new Set(vectorStore.map(v => v.docId))];
  
  res.json({
    totalChunks: vectorStore.length,
    totalDocuments: uniqueDocs.length,
    embeddingDimensions: vectorStore[0]?.embeddingDimensions || 0,
    similarityThreshold: SIMILARITY_THRESHOLD,
    topK: TOP_K
  });
});

// GET /api/sessions
app.get('/api/sessions', (req, res) => {
  const sessions = getActiveSessions();
  res.json({ sessions });
});

// GET /api/session/:sessionId
app.get('/api/session/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const history = getConversationHistory(sessionId, 50);
  const stats = getSessionStats(sessionId);
  
  res.json({
    sessionId,
    history,
    stats
  });
});

// Start server
await loadVectorStore();

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Vector store: ${vectorStore.length} chunks loaded`);
  console.log(`🤖 Models: ${EMBEDDING_MODEL} + ${CHAT_MODEL}`);
  console.log(`💾 Database: SQLite`);
});
