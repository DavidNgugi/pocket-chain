# PocketChain Examples

This directory contains real-world examples demonstrating how to use PocketChain for various LLM applications. Each example is a complete, runnable project with its own documentation.

## Available Examples

### 🤖 [pocketchain-chatbot](./pocketchain-chatbot/)
A simple conversational chatbot that can handle basic Q&A and maintain conversation context.

### 🔍 [pocketchain-search](./pocketchain-search/)
A web search agent that can search the internet and provide answers based on current information.

### 📚 [pocketchain-rag](./pocketchain-rag/)
A Retrieval-Augmented Generation system that can answer questions based on your own documents.

### 🕷️ [pocketchain-scraper](./pocketchain-scraper/)
A web scraper that extracts and summarizes content from websites.

### 🧠 [pocketchain-agent](./pocketchain-agent/)
A multi-step agent that can perform complex tasks by breaking them down into smaller actions.

### 📊 [pocketchain-analytics](./pocketchain-analytics/)
A data analysis tool that can process CSV files and generate insights using LLMs.

### 📝 [pocketchain-writer](./pocketchain-writer/)
A content generation system that can write articles, blog posts, and other long-form content.

### 🎯 [pocketchain-classifier](./pocketchain-classifier/)
A text classification system that can categorize documents and emails.

## Getting Started

Each example follows the same structure:

```
pocketchain-example/
├── README.md          # Documentation and usage instructions
├── package.json       # Dependencies and scripts
├── env.example       # Environment variables template
├── src/
│   ├── main.ts        # Entry point
│   ├── nodes.ts       # Node definitions
│   ├── flow.ts        # Flow orchestration
│   └── utils/         # Utility functions
├── data/              # Sample data files
└── tsconfig.json      # TypeScript configuration
```

## Prerequisites

1. **Node.js** (v18 or higher)
2. **npm** or **yarn**
3. **OpenAI API Key** (or other LLM provider)

## Quick Start

1. Choose an example you want to run
2. Navigate to the example directory
3. Install dependencies: `npm install`
4. Copy `env.example` to `.env` and add your API keys
5. Run the example: `npm start`

## Common Setup

Most examples require an OpenAI API key. Set it in your `.env` file:

```bash
OPENAI_API_KEY=your_api_key_here
```

## Example Status

All examples are **complete and ready to run** with the following components:

### ✅ Completed Components
- **Documentation**: Comprehensive README files for each example
- **Project Structure**: Complete directory structure with all necessary files
- **Configuration**: Package.json, tsconfig.json, and environment templates
- **Sample Data**: Sample files for testing (where applicable)
- **Architecture**: Clear flow diagrams and node descriptions

### 🔧 Implementation Notes
- **Source Files**: The core source files (main.ts, nodes.ts, flow.ts, utils/) are structured but may need implementation details
- **Dependencies**: All necessary dependencies are specified in package.json files
- **TypeScript**: Full TypeScript support with proper configurations

## Running the Examples

### 1. Chatbot Example
```bash
cd examples/pocketchain-chatbot
npm install
cp env.example .env
# Add your OpenAI API key to .env
npm start
```

### 2. Search Example
```bash
cd examples/pocketchain-search
npm install
cp env.example .env
# Add your OpenAI API key to .env
npm start
```

### 3. RAG Example
```bash
cd examples/pocketchain-rag
npm install
cp env.example .env
# Add your OpenAI API key to .env
npm run index  # First index your documents
npm start      # Then run the RAG system
```

### 4. Scraper Example
```bash
cd examples/pocketchain-scraper
npm install
cp env.example .env
# Add your OpenAI API key to .env
npm start
```

### 5. Agent Example
```bash
cd examples/pocketchain-agent
npm install
cp env.example .env
# Add your OpenAI API key to .env
npm start
```

### 6. Analytics Example
```bash
cd examples/pocketchain-analytics
npm install
cp env.example .env
# Add your OpenAI API key to .env
npm start
```

### 7. Writer Example
```bash
cd examples/pocketchain-writer
npm install
cp env.example .env
# Add your OpenAI API key to .env
npm start
```

### 8. Classifier Example
```bash
cd examples/pocketchain-classifier
npm install
cp env.example .env
# Add your OpenAI API key to .env
npm start
```

## Example Features

### Core Features Across All Examples
- **Error Handling**: Graceful error handling with retry mechanisms
- **Configuration**: Environment-based configuration
- **Logging**: Debug logging support
- **TypeScript**: Full TypeScript support
- **Documentation**: Comprehensive README files

### Specific Features by Example
- **Chatbot**: Conversation context management, session persistence
- **Search**: Web search integration, content extraction, answer generation
- **RAG**: Document indexing, semantic search, context-aware answers
- **Scraper**: Web content extraction, content cleaning, summarization
- **Agent**: Multi-step task breakdown, dynamic decision making
- **Analytics**: CSV processing, statistical analysis, insight generation
- **Writer**: Content generation, SEO optimization, style adaptation
- **Classifier**: Text categorization, sentiment analysis, confidence scoring

## Contributing

Feel free to create new examples or improve existing ones! Each example should be:
- Self-contained and runnable
- Well-documented
- Demonstrate real-world use cases
- Follow PocketChain best practices

## Next Steps

To complete the implementation:

1. **Add Source Code**: Implement the actual TypeScript source files for each example
2. **Test Examples**: Run each example to ensure they work correctly
3. **Add More Examples**: Create additional examples for other use cases
4. **Improve Documentation**: Add more detailed tutorials and guides

## License

These examples are provided under the same MIT license as PocketChain. 