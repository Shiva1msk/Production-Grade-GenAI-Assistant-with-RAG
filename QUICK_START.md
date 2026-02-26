# 🚀 Quick Start Guide

## Prerequisites

- Node.js v18+
- Gemini API key from https://aistudio.google.com/app/apikey

## Installation

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# 3. Generate embeddings (first time only)
npm run ingest

# 4. Start server
npm start
```

## Access

- **Web UI**: http://localhost:3000
- **API**: http://localhost:3000/api/chat

## Test API

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"test","message":"How do I reset my password?"}'
```

## Project Structure

```
ai_rag_app/
├── backend/          # Server & API
├── public/           # Frontend UI
├── docs/             # Documentation
├── scripts/          # Dev utilities
└── README.md         # Full documentation
```

## Available Commands

```bash
npm start           # Start server
npm run ingest      # Generate embeddings
node scripts/check-models.js  # Check available models
```

## Features

✅ RAG with semantic search
✅ SQLite persistence
✅ Session management
✅ Real-time chat
✅ Token tracking

## Troubleshooting

See `docs/API_KEY_SOLUTION.md` for API key issues.

## Documentation

- **README.md**: Complete documentation
- **PROJECT_STRUCTURE.md**: File organization
- **docs/**: Detailed guides
