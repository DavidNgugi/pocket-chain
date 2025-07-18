# PocketFlow-Node Search Agent

A web search agent that can search the internet and provide answers based on current information using PocketFlow-Node.

## What it does

This search agent can:
- Search the web for current information
- Extract relevant content from search results
- Generate comprehensive answers based on search results
- Handle multiple search queries in a single session
- Provide source citations for information

## Architecture

The search agent uses a three-node flow:
1. **SearchNode**: Performs web searches using a search API
2. **ExtractNode**: Extracts and summarizes relevant content
3. **AnswerNode**: Generates comprehensive answers with citations

```mermaid
flowchart LR
    A[SearchNode] --> B[ExtractNode]
    B --> C[AnswerNode]
```

## Features

- **Web Search**: Uses DuckDuckGo API for web searches
- **Content Extraction**: Extracts relevant information from search results
- **Answer Generation**: Creates comprehensive answers with citations
- **Error Handling**: Graceful fallbacks for search failures
- **Rate Limiting**: Built-in rate limiting to respect API limits

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment**:
   ```bash
   cp env.example .env
   # Edit .env and add your OpenAI API key
   ```

3. **Run the search agent**:
   ```bash
   npm start
   ```

4. **Start searching**:
   ```
   Search: What is the latest news about AI?
   Agent: Based on recent search results, here are the latest developments in AI...
   
   Search: How does quantum computing work?
   Agent: Quantum computing is a revolutionary technology that...
   ```

## Usage Examples

### Current Events
```
Search: What happened in the stock market today?
Agent: Based on today's market data, the major indices showed mixed results...
```

### Technical Information
```
Search: What is the difference between React and Vue?
Agent: React and Vue are both popular JavaScript frameworks, but they differ in...
```

### Fact Checking
```
Search: Is it true that coffee helps with weight loss?
Agent: According to recent research, coffee may have some effects on metabolism...
```

## Configuration

### Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key (required)
- `OPENAI_MODEL`: Model to use (default: "gpt-3.5-turbo")
- `SEARCH_RESULTS_LIMIT`: Number of search results to process (default: 5)

### Customization

You can modify the search behavior by editing:
- `src/nodes.ts`: Change how searches are performed and answers generated
- `src/flow.ts`: Modify the search flow
- `src/utils/search.ts`: Switch to a different search provider

## Project Structure

```
pocketflow-node-search/
├── README.md              # This file
├── package.json           # Dependencies and scripts
├── env.example           # Environment variables template
├── src/
│   ├── main.ts           # Entry point
│   ├── nodes.ts          # Node definitions
│   ├── flow.ts           # Flow orchestration
│   └── utils/
│       ├── llm.ts        # LLM utility functions
│       └── search.ts     # Search API utilities
└── data/
    └── sample_queries.json # Sample search queries
```

## API Reference

### SearchNode
- **Purpose**: Performs web searches
- **Input**: Search query from user
- **Output**: Raw search results

### ExtractNode
- **Purpose**: Extracts relevant content from search results
- **Input**: Raw search results
- **Output**: Summarized relevant content

### AnswerNode
- **Purpose**: Generates comprehensive answers
- **Input**: Extracted content and original query
- **Output**: Final answer with citations

## Troubleshooting

### Common Issues

1. **"Search API rate limit exceeded"**
   - The agent includes rate limiting, but you may need to wait between searches

2. **"No search results found"**
   - Try rephrasing your query or using different keywords

3. **"API key not found"**
   - Make sure you've set `OPENAI_API_KEY` in your `.env` file

### Debug Mode

Run with debug logging:
```bash
DEBUG=true npm start
```

## Extending the Search Agent

### Adding New Features

1. **Multiple search engines**: Add support for Google, Bing, or other search APIs
2. **Image search**: Extend to search for and analyze images
3. **News filtering**: Add filters for recent news vs. general information
4. **Language support**: Add support for searching in different languages

### Example: Adding News Search

```typescript
// In src/nodes.ts
class NewsSearchNode extends Node {
  async exec(query: string): Promise<any> {
    // Use a news-specific API
    const newsResults = await searchNews(query);
    return newsResults;
  }
}
```

## License

This example is provided under the MIT license. 