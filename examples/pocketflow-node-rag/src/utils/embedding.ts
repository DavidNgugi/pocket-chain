/**
 * Mock embedding utility for RAG example
 * In production, use a real embedding service like OpenAI, Cohere, or HuggingFace
 */

export interface Embedding {
  vector: number[];
  text: string;
}

export interface VectorIndex {
  embeddings: Embedding[];
  search(queryEmbedding: number[], topK: number): { indices: number[][]; distances: number[][] };
}

/**
 * Generate a mock embedding for text
 * In production, replace with actual embedding API call
 */
export async function getEmbedding(text: string): Promise<number[]> {
  // Mock implementation - generates a deterministic "embedding" based on text
  const hash = text.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  // Generate a 384-dimensional vector (common embedding size)
  const vector: number[] = [];
  for (let i = 0; i < 384; i++) {
    vector.push(Math.sin(hash + i) * 0.1);
  }
  
  return vector;
}

/**
 * Create a simple vector index for similarity search
 */
export function createIndex(embeddings: number[][]): VectorIndex {
  return {
    embeddings: embeddings.map((embedding, index) => ({
      vector: embedding,
      text: `chunk_${index}` // In real implementation, store actual text
    })),
    
    search(queryEmbedding: number[], topK: number) {
      // Simple cosine similarity search
      const similarities = this.embeddings.map((embedding, index) => {
        const similarity = cosineSimilarity(queryEmbedding, embedding.vector);
        return { index, similarity };
      });
      
      // Sort by similarity and return top K
      similarities.sort((a, b) => b.similarity - a.similarity);
      const topResults = similarities.slice(0, topK);
      
      return {
        indices: [topResults.map(r => r.index)],
        distances: [topResults.map(r => 1 - r.similarity)] // Convert similarity to distance
      };
    }
  };
}

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same length');
  }
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Search the index for similar vectors
 */
export function searchIndex(index: VectorIndex, queryEmbedding: number[], topK: number = 1) {
  return index.search(queryEmbedding, topK);
}

// Test the utility
if (require.main === module) {
  async function test() {
    const text = "Hello world";
    const embedding = await getEmbedding(text);
    console.log(`Generated embedding for "${text}":`, embedding.slice(0, 5), '...');
    
    const index = createIndex([embedding]);
    const results = searchIndex(index, embedding, 1);
    console.log('Search results:', results);
  }
  
  test().catch(console.error);
} 