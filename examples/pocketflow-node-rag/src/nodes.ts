import { Node, BatchNode, SharedStore } from '../../../src/index';
import { getEmbedding, createIndex, searchIndex } from './utils/embedding';
import { readFile, chunkText } from './utils/documents';

/**
 * Node to chunk documents into smaller pieces
 */
export class ChunkDocs extends BatchNode {
  prep(shared: SharedStore): string[] {
    return shared.files || [];
  }

  exec(filepath: string): string[] {
    const content = readFile(filepath);
    return chunkText(content, 200); // 200 character chunks
  }

  post(shared: SharedStore, prepRes: string[], execResList: string[][]): void {
    // Flatten all chunks from all files
    const allChunks: string[] = [];
    for (const chunkList of execResList) {
      allChunks.push(...chunkList);
    }
    shared.allChunks = allChunks;
    console.log(`Created ${allChunks.length} chunks from ${prepRes.length} files`);
  }
}

/**
 * Node to embed document chunks
 */
export class EmbedDocs extends BatchNode {
  prep(shared: SharedStore): string[] {
    return shared.allChunks || [];
  }

  async exec(chunk: string): Promise<number[]> {
    return await getEmbedding(chunk);
  }

  post(shared: SharedStore, prepRes: string[], execResList: number[][]): void {
    shared.allEmbeddings = execResList;
    console.log(`Generated ${execResList.length} embeddings`);
  }
}

/**
 * Node to store embeddings in a vector index
 */
export class StoreIndex extends Node {
  prep(shared: SharedStore): number[][] {
    return shared.allEmbeddings || [];
  }

  exec(embeddings: number[][]): any {
    return createIndex(embeddings);
  }

  post(shared: SharedStore, prepRes: number[][], execRes: any): void {
    shared.index = execRes;
    shared.allChunks = shared.allChunks || [];
    console.log('Vector index created successfully');
  }
}

/**
 * Node to embed user queries
 */
export class EmbedQuery extends Node {
  prep(shared: SharedStore): string {
    return shared.question || '';
  }

  async exec(question: string): Promise<number[]> {
    return await getEmbedding(question);
  }

  post(shared: SharedStore, prepRes: string, execRes: number[]): void {
    shared.queryEmbedding = execRes;
  }
}

/**
 * Node to retrieve relevant document chunks
 */
export class RetrieveDocs extends Node {
  prep(shared: SharedStore): [number[], any, string[]] {
    return [
      shared.queryEmbedding || [],
      shared.index,
      shared.allChunks || []
    ];
  }

  exec(inputs: [number[], any, string[]]): string {
    const [queryEmbedding, index, chunks] = inputs;
    
    if (!index || !chunks.length) {
      throw new Error('No index or chunks available');
    }
    
    const results = searchIndex(index, queryEmbedding, 1);
    const bestIndex = results.indices[0][0];
    return chunks[bestIndex] || 'No relevant content found';
  }

  post(shared: SharedStore, prepRes: [number[], any, string[]], execRes: string): void {
    shared.retrievedChunk = execRes;
    console.log('Retrieved chunk:', execRes.substring(0, 100) + '...');
  }
}

/**
 * Node to generate answers using retrieved context
 */
export class GenerateAnswer extends Node {
  prep(shared: SharedStore): [string, string] {
    return [
      shared.question || '',
      shared.retrievedChunk || ''
    ];
  }

  async exec(inputs: [string, string]): Promise<string> {
    const [question, context] = inputs;
    
    const prompt = `Based on the following context, answer the question.

Context: ${context}

Question: ${question}

Answer:`;
    
    // In a real implementation, call your LLM here
    // For now, return a mock response
    return `Based on the provided context, here's what I found: ${context.substring(0, 50)}... This information should help answer your question about "${question}".`;
  }

  post(shared: SharedStore, prepRes: [string, string], execRes: string): void {
    shared.answer = execRes;
    console.log('Generated answer:', execRes);
  }
} 