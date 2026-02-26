# 🤖 Production-Grade GenAI Assistant with RAG

A production-ready chat assistant powered by Google Gemini embeddings, implementing Retrieval-Augmented Generation (RAG) for grounded, context-aware responses with SQLite persistence.

## ✅ System Status: FULLY OPERATIONAL

- Backend: Node.js + Express ✅
- Database: SQLite ✅  
- Embeddings: gemini-embedding-001 ✅
- Vector Store: 10 chunks loaded ✅
- RAG Pipeline: Complete ✅
- Session Management: SQLite ✅

## 🏗 Architecture

```
┌─────────────┐
│   User      │
│  (Frontend) │
└──────┬──────┘
       │ HTTP Request
       ▼
┌─────────────────────────────────────┐
│         Express Server              │
│  ┌───────────────────────────────┐  │
│  │  1. Query Embedding           │  │
│  │     (Gemini embedding-001)    │  │
│  └───────────┬───────────────────┘  │
│              ▼                       │
│  ┌───────────────────────────────┐  │
│  │  2. Similarity Search         │  │
│  │     (Cosine Similarity)       │  │
│  │     Vector Store (JSON)       │  │
│  └───────────┬───────────────────┘  │
│              ▼                       │
│  ┌───────────────────────────────┐  │
│  │  3. Context Retrieval         │  │
│  │     (Top 3 chunks, >0.7)      │  │
│  └───────────┬───────────────────┘  │
│              ▼                       │
│  ┌───────────────────────────────┐  │
│  │  4. LLM Generation            │  │
│  │     (Gemini 1.5 Flash)        │  │
│  │     Grounded Prompt           │  │
│  └───────────┬───────────────────┘  │
└──────────────┼─────────────────────┘
               ▼
         JSON Response
```

## 📁 Project Structure

```
rag-assistant/
├── backend/
│   ├── data/
│   │   ├── docs.json           # Raw knowledge base (10 documents)
│   │   └── vector_store.json   # Processed embeddings (generated)
│   ├── scripts/
│   │   └── ingest.js           # Document ingestion & embedding generation
│   ├── utils/
│   │   ├── chunking.js         # Text chunking with overlap
│   │   └── vector_math.js      # Cosine similarity implementation
│   └── server.js               # Express API server
├── public/
│   ├── index.html              # Chat UI
│   ├── styles.css              # Styling
│   └── app.js                  # Frontend logic
├── .env                        # Environment variables
├── package.json                # Dependencies
└── README.md                   # Documentation
```

## 🔄 RAG Workflow

1. **Document Ingestion**
   - Load documents from `docs.json`
   - Chunk content (300-500 tokens)
   - Generate embeddings using `text-embedding-3-small`
   - Store in vector database

2. **Query Processing**
   - User submits question
   - Generate query embedding
   - Calculate cosine similarity with all chunks
   - Retrieve top 3 most relevant chunks

3. **Response Generation**
   - Apply similarity threshold (0.7)
   - Inject retrieved context into prompt
   - Include conversation history (last 5 pairs)
   - Generate response with GPT-3.5 (temp: 0.2)

4. **Grounding Strategy**
   - If similarity < threshold → fallback response
   - System prompt enforces context-only answers
   - Low temperature prevents hallucination

## 📊 Embedding Strategy

- **Model**: `gemini-embedding-001` (768 dimensions)
- **Chunking**: 300 words per chunk with 50-word overlap
- **Overlap Rationale**: Maintains context across chunk boundaries
- **Similarity**: Cosine similarity (dot product / magnitude)
- **Threshold**: 0.7 (filters irrelevant results)
- **Retrieval**: Top-K (K=3)

## 🎯 Similarity Search

### Cosine Similarity Formula
```javascript
similarity = (A · B) / (||A|| × ||B||)

Where:
- A · B = dot product of vectors A and B
- ||A|| = magnitude (length) of vector A
- ||B|| = magnitude (length) of vector B
```

### Implementation
```javascript
function calculateCosineSimilarity(vectorA, vectorB) {
  // Dot product
  const dotProduct = vectorA.reduce((sum, val, i) => sum + val * vectorB[i], 0);
  
  // Magnitudes
  const magnitudeA = Math.sqrt(vectorA.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(vectorB.reduce((sum, val) => sum + val * val, 0));
  
  // Cosine similarity
  return dotProduct / (magnitudeA * magnitudeB);
}
```

### Retrieval Process
1. Convert user query to embedding vector
2. Calculate cosine similarity with all document chunks
3. Filter results with similarity >= 0.7
4. Sort by highest similarity
5. Return top 3 chunks

## 💬 Prompt Design

### Grounded Prompt Template
```
System: You are a helpful support assistant. Answer the question using 
ONLY the context provided below.

If the context doesn't contain enough information, say "I don't have 
enough information to answer that question based on the available 
documentation."

CONTEXT:
1. [Retrieved Chunk 1]
2. [Retrieved Chunk 2]
3. [Retrieved Chunk 3]

[Conversation History - Last 5 pairs]

USER QUESTION: [Current Question]

ANSWER:
```

**Design Rationale**:
- **Explicit grounding**: "ONLY the context provided" prevents hallucination
- **Fallback instruction**: Handles low-confidence scenarios gracefully
- **Numbered context**: Makes it clear what information is available
- **Low temperature (0.2)**: Ensures deterministic, factual responses
- **History inclusion**: Maintains conversation flow and context

## 🚀 Setup Instructions

### Prerequisites
- Node.js v18+
- Gemini API key from https://aistudio.google.com/app/apikey

### Installation

1. **Install Dependencies**
```bash
npm install
```

2. **Configure Environment**
```bash
cp .env.example .env
# Edit .env and add your Gemini API key
```

3. **Generate Vector Store** (Pre-processing step)
```bash
npm run ingest
```
This will:
- Read documents from `backend/data/docs.json`
- Split them into chunks (300 words with 50-word overlap)
- Generate embeddings for each chunk
- Save to `backend/data/vector_store.json`

4. **Start Server**
```bash
npm start
```

5. **Access Application**
```
http://localhost:3000
```

## 📡 API Documentation

### POST /api/chat

**Request**:
```json
{
  "sessionId": "session_123",
  "message": "How can I reset my password?"
}
```

**Response**:
```json
{
  "reply": "Users can reset their password from Settings > Security...",
  "tokensUsed": 120,
  "retrievedChunks": 3,
  "maxSimilarity": "0.856",
  "chunkDetails": [
    {"title": "Reset Password", "score": "0.856"}
  ]
}
```

### GET /api/health

**Response**:
```json
{
  "status": "ok",
  "vectorStoreSize": 10,
  "activeSessions": 5,
  "embeddingModel": "gemini-embedding-001",
  "chatModel": "gemini-1.5-flash",
  "database": "SQLite"
}
```

### GET /api/sessions

**Response**:
```json
{
  "sessions": [
    {
      "session_id": "session_123",
      "created_at": "2024-01-01 10:00:00",
      "last_activity": "2024-01-01 10:30:00",
      "message_count": 10
    }
  ]
}
```

### GET /api/session/:sessionId

**Response**:
```json
{
  "sessionId": "session_123",
  "history": [
    {
      "role": "user",
      "content": "How do I reset my password?",
      "timestamp": "2024-01-01 10:00:00"
    }
  ],
  "stats": {
    "message_count": 10,
    "total_tokens": 1500,
    "avg_similarity": 0.82
  }
}
```

**Error Handling**:
- 400: Invalid input
- 401: Invalid API key
- 429: Rate limit exceeded
- 500: Server error

## 🛠 Tech Stack

- **Backend**: Node.js + Express
- **LLM**: Google Gemini 1.5 Flash
- **Embeddings**: Google text-embedding-004
- **Vector Store**: In-memory (production: use Pinecone/Weaviate)
- **Frontend**: Vanilla JavaScript + HTML/CSS

## ✨ Features

- ✅ Real embedding-based retrieval (Google gemini-embedding-001)
- ✅ Cosine similarity search
- ✅ Similarity threshold filtering (0.7)
- ✅ Document chunking (300 words with 50-word overlap)
- ✅ Conversation history (SQLite persistence)
- ✅ Session management (SQLite)
- ✅ Token usage tracking
- ✅ Error handling (API failures, timeouts, rate limits)
- ✅ Fallback responses (when LLM unavailable)
- ✅ Loading states
- ✅ Responsive UI
- ✅ New chat functionality
- ✅ Multiple API endpoints
- ✅ Database persistence

## 📸 Screenshots

![Chat Interface](screenshot.png)

## 🎥 Demo Video

[Link to demo video]

## 📝 Notes

- Vector store initializes on server start
- Sessions stored in memory (use Redis for production)
- Embeddings cached (no regeneration needed)
- Supports 10 sample documents covering common topics

## 🔒 Security

- API key stored in environment variables
- Input validation on all endpoints
- Rate limiting handled by OpenAI
- No PII stored in logs

## 🚀 Production Considerations

- Replace in-memory storage with persistent vector DB
- Add authentication/authorization
- Implement request rate limiting
- Add monitoring and logging
- Use Redis for session management
- Deploy with PM2 or Docker
