import axios from 'axios';

interface SearchResult {
  title: string;
  link: string;
  snippet: string;
}

// Simple mock search function - in a real implementation, you'd use a proper search API
export async function searchWeb(query: string): Promise<SearchResult[]> {
  try {
    // For demo purposes, we'll return mock results
    // In production, you'd use DuckDuckGo, Google Custom Search, or similar APIs
    
    const mockResults: SearchResult[] = [
      {
        title: `Search results for: ${query}`,
        link: `https://example.com/search?q=${encodeURIComponent(query)}`,
        snippet: `This is a mock search result for "${query}". In a real implementation, this would contain actual search results from a search engine API.`
      },
      {
        title: `Information about ${query}`,
        link: `https://wikipedia.org/wiki/${encodeURIComponent(query)}`,
        snippet: `Wikipedia article about ${query}. This would contain actual content from the search results.`
      },
      {
        title: `Latest news on ${query}`,
        link: `https://news.example.com/${encodeURIComponent(query)}`,
        snippet: `Recent news and updates about ${query}. This would be real-time information from news sources.`
      }
    ];

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return mockResults;
  } catch (error) {
    console.error('Search error:', error);
    throw new Error('Failed to perform web search');
  }
}

// Extract content from search results
export function extractContent(results: SearchResult[]): string {
  return results.map(result => 
    `Title: ${result.title}\nURL: ${result.link}\nContent: ${result.snippet}\n`
  ).join('\n---\n');
}

// Rate limiting utility
let lastSearchTime = 0;
const SEARCH_DELAY = 1000; // 1 second between searches

export async function rateLimitedSearch(query: string): Promise<SearchResult[]> {
  const now = Date.now();
  const timeSinceLastSearch = now - lastSearchTime;
  
  if (timeSinceLastSearch < SEARCH_DELAY) {
    await new Promise(resolve => setTimeout(resolve, SEARCH_DELAY - timeSinceLastSearch));
  }
  
  lastSearchTime = Date.now();
  return await searchWeb(query);
}

// Test the utility
if (require.main === module) {
  rateLimitedSearch('artificial intelligence')
    .then(results => {
      console.log('Search results:', results);
      console.log('\nExtracted content:', extractContent(results));
    })
    .catch(console.error);
} 