
🤖 Production-Grade GenAI Assistant with RAG

A production-ready AI support assistant powered by Google Gemini 2.5 Flash and Retrieval-Augmented Generation (RAG).
The system delivers grounded, context-aware responses using semantic search and SQLite session persistence.

🚀 Built with modern Gemini 2.5 models (2025)

✅ System Status: FULLY OPERATIONAL

Backend: Node.js + Express ✅

Database: SQLite ✅

Embeddings: gemini-embedding-001 ✅

Chat Model: gemini-2.5-flash ✅

Vector Store: 10 chunks loaded ✅

RAG Pipeline: Complete ✅

Session Management: SQLite ✅

🏗 Architecture

User → Express API → Query Embedding → Similarity Search → Context Retrieval → Gemini 2.5 Flash → Response

🔄 RAG Workflow
1️⃣ Document Ingestion

Load documents from docs.json

Chunk content (300 words + overlap)

Generate embeddings using gemini-embedding-001

Store in vector database

2️⃣ Query Processing

Convert user question → embedding

Cosine similarity search

Retrieve top-K relevant chunks

Apply similarity threshold (0.7)

3️⃣ Response Generation

Inject retrieved context into prompt

Include conversation history

Generate grounded response with Gemini 2.5 Flash

Low temperature (0.2) to reduce hallucinations

📊 Embedding Strategy

Model: gemini-embedding-001

Dimensions: 3072

Chunk size: 300 words

Overlap: 50 words

Similarity: Cosine similarity

Threshold: 0.7

Retrieval: Top-3

💬 Grounding Prompt Strategy

The assistant is forced to:

✅ Answer only from retrieved context

✅ Refuse when info missing

✅ Maintain conversation memory

✅ Avoid hallucinations

Fallback message triggers when similarity is low.

🚀 Quick Start
1. Install dependencies
npm install
2. Configure environment
cp .env.example .env

Add your key:

GEMINI_API_KEY=your_key_here
PORT=3000
3. Generate vector store
npm run ingest
4. Start server
npm start

Open:

http://localhost:3000
📡 API Endpoints
POST /api/chat
{
  "sessionId": "session_123",
  "message": "How can I reset my password?"
}
GET /api/health

Returns system status and model info.

🛠 Tech Stack

Backend: Node.js + Express

LLM: Gemini 2.5 Flash

Embeddings: gemini-embedding-001

Vector Store: JSON (in-memory)

Database: SQLite

Frontend: Vanilla JS

🔒 Security

API keys stored in environment variables

.env excluded via .gitignore

API key restricted to Generative Language API

Input validation on all endpoints

🚀 Production Improvements (Future)

Vector DB (Pinecone / Weaviate)

Redis session store

Streaming responses

Auth layer

Monitoring

⭐ If you like this project, give it a star!
