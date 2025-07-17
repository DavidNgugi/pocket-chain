import fs from 'fs-extra';
import path from 'path';

export interface Document {
  id: string;
  filename: string;
  content: string;
  chunks: string[];
}

export interface Chunk {
  id: string;
  documentId: string;
  content: string;
  embedding: number[];
}

export interface SearchIndex {
  chunks: Chunk[];
  documents: Document[];
}

// Simple cosine similarity function
export function cosineSimilarity(a: number[], b: number[]): number {
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

// Chunk text into smaller pieces
export function chunkText(text: string, chunkSize: number = 1000): string[] {
  const chunks: string[] = [];
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  let currentChunk = '';
  
  for (const sentence of sentences) {
    const trimmedSentence = sentence.trim();
    if (currentChunk.length + trimmedSentence.length > chunkSize) {
      if (currentChunk.length > 0) {
        chunks.push(currentChunk.trim());
        currentChunk = trimmedSentence;
      } else {
        // If a single sentence is too long, split it
        chunks.push(trimmedSentence.substring(0, chunkSize));
        currentChunk = trimmedSentence.substring(chunkSize);
      }
    } else {
      currentChunk += (currentChunk ? '. ' : '') + trimmedSentence;
    }
  }
  
  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks;
}

// Load documents from the documents directory
export async function loadDocuments(documentsDir: string): Promise<Document[]> {
  const documents: Document[] = [];
  
  try {
    const files = await fs.readdir(documentsDir);
    
    for (const file of files) {
      if (file.endsWith('.txt')) {
        const filePath = path.join(documentsDir, file);
        const content = await fs.readFile(filePath, 'utf-8');
        
        documents.push({
          id: path.basename(file, '.txt'),
          filename: file,
          content,
          chunks: []
        });
      }
    }
    
    console.log(`Loaded ${documents.length} documents`);
    return documents;
  } catch (error) {
    console.error('Error loading documents:', error);
    return [];
  }
}

// Save search index to file
export async function saveIndex(index: SearchIndex, indexPath: string): Promise<void> {
  try {
    await fs.ensureDir(path.dirname(indexPath));
    await fs.writeJson(indexPath, index, { spaces: 2 });
    console.log(`Index saved to ${indexPath}`);
  } catch (error) {
    console.error('Error saving index:', error);
    throw error;
  }
}

// Load search index from file
export async function loadIndex(indexPath: string): Promise<SearchIndex | null> {
  try {
    if (await fs.pathExists(indexPath)) {
      const index = await fs.readJson(indexPath);
      console.log(`Index loaded from ${indexPath}`);
      return index;
    }
    return null;
  } catch (error) {
    console.error('Error loading index:', error);
    return null;
  }
}

// Test the utilities
if (require.main === module) {
  const testText = "This is a test document. It contains multiple sentences. We want to chunk it into smaller pieces. Each chunk should be manageable for processing.";
  const chunks = chunkText(testText, 50);
  console.log('Chunks:', chunks);
} 