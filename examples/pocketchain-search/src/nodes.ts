import { Node, SharedStore } from 'pocketchain';
import { callLLM } from './utils/llm';
import { rateLimitedSearch, extractContent } from './utils/search';

export class SearchNode extends Node {
  constructor() {
    super(2, 2000); // 2 retries, 2 second wait
  }

  prep(shared: SharedStore): string {
    return shared.searchQuery || '';
  }

  async exec(query: string): Promise<any> {
    if (!query.trim()) {
      throw new Error('Search query cannot be empty');
    }

    console.log(`🔍 Searching for: ${query}`);
    const results = await rateLimitedSearch(query);
    return results;
  }

  execFallback(prepRes: string, exc: Error): any {
    console.error('Search failed, using fallback:', exc.message);
    return [{
      title: 'Search unavailable',
      link: 'https://example.com',
      snippet: 'Search service is currently unavailable. Please try again later.'
    }];
  }

  post(shared: SharedStore, prepRes: string, execRes: any): void {
    shared.searchResults = execRes;
    console.log(`📊 Found ${execRes.length} search results`);
  }
}

export class ExtractNode extends Node {
  prep(shared: SharedStore): any {
    return shared.searchResults || [];
  }

  exec(results: any[]): string {
    const limit = parseInt(process.env.SEARCH_RESULTS_LIMIT || '5');
    const limitedResults = results.slice(0, limit);
    return extractContent(limitedResults);
  }

  post(shared: SharedStore, prepRes: any[], execRes: string): void {
    shared.extractedContent = execRes;
  }
}

export class AnswerNode extends Node {
  constructor() {
    super(3, 1000); // 3 retries, 1 second wait
  }

  prep(shared: SharedStore): string {
    const query = shared.searchQuery || '';
    const content = shared.extractedContent || '';
    return `${query}\n\n${content}`;
  }

  async exec(input: string): Promise<string> {
    const prompt = `Based on the search results below, provide a comprehensive and accurate answer to the user's question. Include relevant details and cite sources when possible.

Search Query and Results:
${input}

Please provide a well-structured answer that directly addresses the user's question:`;

    return await callLLM(prompt);
  }

  execFallback(prepRes: string, exc: Error): string {
    console.error('Answer generation failed:', exc.message);
    return "I'm sorry, I couldn't generate a proper answer based on the search results. Please try rephrasing your question or try again later.";
  }

  post(shared: SharedStore, prepRes: string, execRes: string): void {
    shared.answer = execRes;
  }
} 