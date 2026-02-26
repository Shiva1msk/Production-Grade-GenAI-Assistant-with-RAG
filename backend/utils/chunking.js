/**
 * Document Chunking Utilities
 * Splits large documents into smaller, overlapping chunks for better retrieval
 */

/**
 * Split text into chunks with word-based splitting and overlap
 * 
 * @param {string} text - Text to chunk
 * @param {number} maxWords - Maximum words per chunk (default: 300)
 * @param {number} overlapWords - Number of overlapping words between chunks (default: 50)
 * @returns {string[]} Array of text chunks
 */
export function chunkTextByWords(text, maxWords = 300, overlapWords = 50) {
  const words = text.trim().split(/\s+/);
  const chunks = [];
  
  if (words.length <= maxWords) {
    return [text];
  }
  
  let startIndex = 0;
  
  while (startIndex < words.length) {
    const endIndex = Math.min(startIndex + maxWords, words.length);
    const chunk = words.slice(startIndex, endIndex).join(' ');
    chunks.push(chunk);
    
    // Move forward by (maxWords - overlapWords) to create overlap
    startIndex += (maxWords - overlapWords);
    
    // Break if we've reached the end
    if (endIndex === words.length) {
      break;
    }
  }
  
  return chunks;
}

/**
 * Split text into chunks by character count
 * 
 * @param {string} text - Text to chunk
 * @param {number} maxChars - Maximum characters per chunk (default: 400)
 * @returns {string[]} Array of text chunks
 */
export function chunkTextByChars(text, maxChars = 400) {
  const words = text.split(' ');
  const chunks = [];
  let currentChunk = [];
  
  for (const word of words) {
    currentChunk.push(word);
    
    if (currentChunk.join(' ').length >= maxChars) {
      chunks.push(currentChunk.join(' '));
      currentChunk = [];
    }
  }
  
  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join(' '));
  }
  
  return chunks.length > 0 ? chunks : [text];
}

/**
 * Split text into semantic chunks (by sentences)
 * Better for maintaining context
 * 
 * @param {string} text - Text to chunk
 * @param {number} maxSentences - Maximum sentences per chunk (default: 5)
 * @returns {string[]} Array of text chunks
 */
export function chunkTextBySentences(text, maxSentences = 5) {
  // Split by sentence boundaries
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const chunks = [];
  
  for (let i = 0; i < sentences.length; i += maxSentences) {
    const chunk = sentences.slice(i, i + maxSentences).join(' ').trim();
    chunks.push(chunk);
  }
  
  return chunks;
}

/**
 * Get chunk statistics
 * 
 * @param {string[]} chunks - Array of chunks
 * @returns {object} Statistics about chunks
 */
export function getChunkStats(chunks) {
  const wordCounts = chunks.map(chunk => chunk.split(/\s+/).length);
  const charCounts = chunks.map(chunk => chunk.length);
  
  return {
    totalChunks: chunks.length,
    avgWords: Math.round(wordCounts.reduce((a, b) => a + b, 0) / chunks.length),
    avgChars: Math.round(charCounts.reduce((a, b) => a + b, 0) / chunks.length),
    minWords: Math.min(...wordCounts),
    maxWords: Math.max(...wordCounts),
    minChars: Math.min(...charCounts),
    maxChars: Math.max(...charCounts)
  };
}
