/**
 * Document Ingestion Script
 * Processes documents, generates embeddings, and creates vector store
 * 
 * Usage: node backend/scripts/ingest.js
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
import { chunkTextByWords, getChunkStats } from '../utils/chunking.js';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const EMBEDDING_MODEL = 'gemini-embedding-001';

/**
 * Generate embedding for a text chunk
 */
async function generateEmbedding(text) {
  try {
    const model = genAI.getGenerativeModel({ model: EMBEDDING_MODEL });
    const result = await model.embedContent(text);
    return result.embedding.values;
  } catch (error) {
    console.error('❌ Embedding generation failed:', error.message);
    throw error;
  }
}

/**
 * Process a single document
 */
async function processDocument(doc) {
  console.log(`\n📄 Processing: ${doc.title}`);
  
  // Chunk the document with 300 words per chunk and 50 word overlap
  const chunks = chunkTextByWords(doc.content, 300, 50);
  console.log(`   ✂️  Created ${chunks.length} chunk(s)`);
  
  const processedChunks = [];
  
  for (let i = 0; i < chunks.length; i++) {
    const chunkText = chunks[i];
    console.log(`   🔄 Generating embedding for chunk ${i + 1}/${chunks.length}...`);
    
    const embedding = await generateEmbedding(chunkText);
    
    processedChunks.push({
      id: `${doc.id}_chunk_${i}`,
      docId: doc.id,
      title: doc.title,
      content: chunkText,
      chunkIndex: i,
      embedding: embedding,
      embeddingDimensions: embedding.length
    });
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return processedChunks;
}

/**
 * Main ingestion function
 */
async function ingestDocuments() {
  console.log('🚀 Starting document ingestion process...\n');
  
  try {
    // Read documents
    const docsPath = path.join(process.cwd(), 'backend', 'data', 'docs.json');
    const docsData = await fs.readFile(docsPath, 'utf-8');
    const documents = JSON.parse(docsData);
    
    console.log(`📚 Loaded ${documents.length} documents from docs.json`);
    
    // Process all documents
    const allChunks = [];
    
    for (const doc of documents) {
      const chunks = await processDocument(doc);
      allChunks.push(...chunks);
    }
    
    // Get statistics
    const chunkTexts = allChunks.map(c => c.content);
    const stats = getChunkStats(chunkTexts);
    
    console.log('\n📊 Chunking Statistics:');
    console.log(`   Total chunks: ${stats.totalChunks}`);
    console.log(`   Avg words per chunk: ${stats.avgWords}`);
    console.log(`   Avg chars per chunk: ${stats.avgChars}`);
    console.log(`   Word range: ${stats.minWords} - ${stats.maxWords}`);
    console.log(`   Char range: ${stats.minChars} - ${stats.maxChars}`);
    
    // Save vector store
    const vectorStorePath = path.join(process.cwd(), 'backend', 'data', 'vector_store.json');
    await fs.writeFile(vectorStorePath, JSON.stringify(allChunks, null, 2));
    
    console.log(`\n✅ Vector store created successfully!`);
    console.log(`   Location: ${vectorStorePath}`);
    console.log(`   Total vectors: ${allChunks.length}`);
    console.log(`   Embedding dimensions: ${allChunks[0].embeddingDimensions}`);
    
  } catch (error) {
    console.error('\n❌ Ingestion failed:', error.message);
    process.exit(1);
  }
}

// Run ingestion
ingestDocuments();
