# 🤖 Production-Grade GenAI Assistant with RAG

A scalable, production-ready AI support assistant powered by **Google Gemini 2.5 Flash** and **Retrieval-Augmented Generation (RAG)**. The system delivers grounded, context-aware responses using semantic search, conversation memory, and a modular backend architecture.

---

# 🚀 Live Demo

🌐 **Deployed URL:** [https://production-grade-genai-assistant-with.onrender.com](https://production-grade-genai-assistant-with.onrender.com)

---

# ✨ Key Features

✅ End-to-end RAG pipeline
✅ Semantic search with cosine similarity
✅ Conversation memory using SQLite
✅ Grounded responses (anti‑hallucination prompt)
✅ Production deployment on Render
✅ Modular backend architecture
✅ Environment‑secure API key handling

---

# 🏗️ System Architecture

```
User Query
   ↓
Express API
   ↓
Query Embedding (gemini-embedding-001)
   ↓
Similarity Search (Top‑K)
   ↓
Context Retrieval
   ↓
Gemini 2.5 Flash
   ↓
Grounded Response
```

---

# 🔄 RAG Workflow

## 1️⃣ Document Ingestion

* Load documents from `docs.json`
* Chunk content (300 words + 50 overlap)
* Generate embeddings
* Store vectors in local vector store

## 2️⃣ Query Processing

* Convert user query → embedding
* Perform cosine similarity search
* Retrieve top‑K relevant chunks
* Apply similarity threshold (0.7)

## 3️⃣ Response Generation

* Inject retrieved context into prompt
* Include conversation history
* Generate grounded response
* Low temperature (0.2) to reduce hallucinations

---

# 📊 Embedding Strategy

| Parameter  | Value                |
| ---------- | -------------------- |
| Model      | gemini-embedding-001 |
| Dimensions | 3072                 |
| Chunk Size | 300 words            |
| Overlap    | 50 words             |
| Similarity | Cosine               |
| Threshold  | 0.7                  |
| Retrieval  | Top‑3                |

---

# 🛠 Tech Stack

**Backend**

* Node.js
* Express.js

**LLM & AI**

* Gemini 2.5 Flash
* gemini-embedding-001

**Database**

* SQLite (session memory)

**Vector Store**

* JSON (in‑memory)

**Frontend**

* Vanilla JavaScript
* HTML/CSS

**Deployment**

* Render

---

# 🔌 API Endpoints

## POST `/api/chat`

**Request**

```json
{
  "sessionId": "session_123",
  "message": "How can I reset my password?"
}
```

**Response**

```json
{
  "reply": "...grounded answer..."
}
```

---

## GET `/api/health`

Returns system status, model info, and vector store stats.

---

# ⚙️ Local Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/Shiva1msk/Production-Grade-GenAI-Assistant-with-RAG
cd Production-Grade-GenAI-Assistant-with-RAG
```

## 2️⃣ Install Dependencies

```bash
npm install
```

## 3️⃣ Configure Environment

```bash
cp .env.example .env
```

Add your key:

```
GEMINI_API_KEY=your_key_here
PORT=3000
```

## 4️⃣ Generate Vector Store

```bash
npm run ingest
```

## 5️⃣ Start Server

```bash
npm start
```

Open:

👉 [http://localhost:3000](http://localhost:3000)

---

# 🔒 Security

* API keys stored in environment variables
* `.env` excluded via `.gitignore`
* Input validation on all endpoints
* No hard‑coded secrets

---

# 📈 Current System Status

✅ Backend: Operational
✅ RAG Pipeline: Functional
✅ Embeddings: Working
✅ Gemini Chat: Working
✅ Deployment: Live on Render

---

# 🚀 Production Roadmap

## 🥇 High Priority

* [ ] Migrate to Pinecone / Qdrant
* [ ] Increase knowledge base size
* [ ] Add streaming responses
* [ ] Add source citations

## 🥈 Medium Priority

* [ ] Hybrid search (BM25 + vector)
* [ ] Authentication layer (JWT)
* [ ] Redis session store
* [ ] Improved chat UI

## 🥉 Advanced Enhancements

* [ ] Multi‑document upload
* [ ] Reranking model
* [ ] Observability & tracing
* [ ] Tool‑calling agents

---

# 🎯 Use Cases

* AI customer support bot
* Knowledge base assistant
* Internal company chatbot
* Documentation Q&A system
* Helpdesk automation

---

# ⭐ Contributing

Contributions, issues, and feature requests are welcome!

If you like this project, please ⭐ the repo.

---

# 👨‍💻 Author

**Shiva Kumar Maidam**
DevSecOps & Software Engineer

---

# 📜 License

This project is open-source and available under the MIT License.

---

> 🚀 Built to demonstrate production-grade RAG architecture with modern Gemini models.
