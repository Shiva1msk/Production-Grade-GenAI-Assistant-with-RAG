/**
 * Vector Math Utilities for RAG System
 * Implements cosine similarity for semantic search
 */

/**
 * Calculate cosine similarity between two vectors
 * Formula: cos(θ) = (A · B) / (||A|| × ||B||)
 * 
 * @param {number[]} vectorA - First embedding vector
 * @param {number[]} vectorB - Second embedding vector
 * @returns {number} Similarity score between -1 and 1 (1 = identical, 0 = orthogonal, -1 = opposite)
 */
export function calculateCosineSimilarity(vectorA, vectorB) {
  if (!vectorA || !vectorB || vectorA.length !== vectorB.length) {
    throw new Error('Vectors must be of equal length');
  }

  // Calculate dot product (A · B)
  const dotProduct = vectorA.reduce((sum, val, i) => sum + val * vectorB[i], 0);
  
  // Calculate magnitude of vector A (||A||)
  const magnitudeA = Math.sqrt(vectorA.reduce((sum, val) => sum + val * val, 0));
  
  // Calculate magnitude of vector B (||B||)
  const magnitudeB = Math.sqrt(vectorB.reduce((sum, val) => sum + val * val, 0));
  
  // Avoid division by zero
  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }
  
  // Return cosine similarity
  return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * Find most relevant documents based on query vector
 * 
 * @param {number[]} queryVector - Embedding vector of user query
 * @param {Array} allDocVectors - Array of document objects with vectors
 * @param {number} threshold - Minimum similarity score (default: 0.7)
 * @param {number} topK - Number of top results to return (default: 3)
 * @returns {Array} Top K most relevant documents with similarity scores
 */
export function findMostRelevant(queryVector, allDocVectors, threshold = 0.7, topK = 3) {
  return allDocVectors
    .map(doc => ({
      ...doc,
      score: calculateCosineSimilarity(queryVector, doc.embedding)
    }))
    .filter(doc => doc.score >= threshold) // Only keep relevant results
    .sort((a, b) => b.score - a.score)     // Sort by highest score first
    .slice(0, topK);                        // Take top K results
}

/**
 * Calculate Euclidean distance between two vectors
 * Alternative distance metric (lower is better)
 * 
 * @param {number[]} vectorA - First vector
 * @param {number[]} vectorB - Second vector
 * @returns {number} Euclidean distance
 */
export function euclideanDistance(vectorA, vectorB) {
  if (vectorA.length !== vectorB.length) {
    throw new Error('Vectors must be of equal length');
  }
  
  const sumSquaredDiff = vectorA.reduce((sum, val, i) => {
    const diff = val - vectorB[i];
    return sum + diff * diff;
  }, 0);
  
  return Math.sqrt(sumSquaredDiff);
}

/**
 * Normalize a vector to unit length
 * 
 * @param {number[]} vector - Input vector
 * @returns {number[]} Normalized vector
 */
export function normalizeVector(vector) {
  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  
  if (magnitude === 0) {
    return vector;
  }
  
  return vector.map(val => val / magnitude);
}
