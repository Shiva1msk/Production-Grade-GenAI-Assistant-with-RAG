/**
 * SQLite Database Initialization
 * Creates tables for sessions and conversation history
 */

import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'rag_assistant.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

/**
 * Initialize database schema
 */
export function initDatabase() {
  // Sessions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      session_id TEXT PRIMARY KEY,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_activity DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Conversation history table
  db.exec(`
    CREATE TABLE IF NOT EXISTS conversations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('user', 'assistant')),
      content TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      tokens_used INTEGER DEFAULT 0,
      chunks_retrieved INTEGER DEFAULT 0,
      max_similarity REAL DEFAULT 0,
      FOREIGN KEY (session_id) REFERENCES sessions(session_id) ON DELETE CASCADE
    )
  `);

  // Index for faster queries
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_session_timestamp 
    ON conversations(session_id, timestamp)
  `);

  console.log('✅ Database initialized:', dbPath);
}

/**
 * Get or create session
 */
export function getOrCreateSession(sessionId) {
  const stmt = db.prepare(`
    INSERT OR IGNORE INTO sessions (session_id) VALUES (?)
  `);
  stmt.run(sessionId);
  
  // Update last activity
  const updateStmt = db.prepare(`
    UPDATE sessions SET last_activity = CURRENT_TIMESTAMP WHERE session_id = ?
  `);
  updateStmt.run(sessionId);
  
  return sessionId;
}

/**
 * Save conversation message
 */
export function saveMessage(sessionId, role, content, metadata = {}) {
  const stmt = db.prepare(`
    INSERT INTO conversations (session_id, role, content, tokens_used, chunks_retrieved, max_similarity)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  
  stmt.run(
    sessionId,
    role,
    content,
    metadata.tokensUsed || 0,
    metadata.chunksRetrieved || 0,
    metadata.maxSimilarity || 0
  );
}

/**
 * Get conversation history
 */
export function getConversationHistory(sessionId, limit = 10) {
  const stmt = db.prepare(`
    SELECT role, content, timestamp, tokens_used, chunks_retrieved, max_similarity
    FROM conversations
    WHERE session_id = ?
    ORDER BY timestamp DESC
    LIMIT ?
  `);
  
  const messages = stmt.all(sessionId, limit);
  return messages.reverse(); // Return in chronological order
}

/**
 * Get session statistics
 */
export function getSessionStats(sessionId) {
  const stmt = db.prepare(`
    SELECT 
      COUNT(*) as message_count,
      SUM(tokens_used) as total_tokens,
      AVG(max_similarity) as avg_similarity,
      MIN(timestamp) as first_message,
      MAX(timestamp) as last_message
    FROM conversations
    WHERE session_id = ?
  `);
  
  return stmt.get(sessionId);
}

/**
 * Delete old sessions (cleanup)
 */
export function cleanupOldSessions(daysOld = 30) {
  const stmt = db.prepare(`
    DELETE FROM sessions
    WHERE last_activity < datetime('now', '-' || ? || ' days')
  `);
  
  const result = stmt.run(daysOld);
  return result.changes;
}

/**
 * Get all active sessions
 */
export function getActiveSessions() {
  const stmt = db.prepare(`
    SELECT session_id, created_at, last_activity,
           (SELECT COUNT(*) FROM conversations WHERE session_id = sessions.session_id) as message_count
    FROM sessions
    ORDER BY last_activity DESC
  `);
  
  return stmt.all();
}

export { db };
