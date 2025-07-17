# PocketChain

```

▗▄▄▖  ▗▄▖  ▗▄▄▖▗▖ ▗▖▗▄▄▄▖▗▄▄▄▖ ▗▄▄▖▗▖ ▗▖ ▗▄▖ ▗▄▄▄▖▗▖  ▗▖
▐▌ ▐▌▐▌ ▐▌▐▌   ▐▌▗▞▘▐▌     █  ▐▌   ▐▌ ▐▌▐▌ ▐▌  █  ▐▛▚▖▐▌
▐▛▀▘ ▐▌ ▐▌▐▌   ▐▛▚▖ ▐▛▀▀▘  █  ▐▌   ▐▛▀▜▌▐▛▀▜▌  █  ▐▌ ▝▜▌
▐▌   ▝▚▄▞▘▝▚▄▄▖▐▌ ▐▌▐▙▄▄▖  █  ▝▚▄▄▖▐▌ ▐▌▐▌ ▐▌▗▄█▄▖▐▌  ▐▌
                                                        

```

A [300-line](src/index.ts) minimalist LLM framework for TypeScript/Node.js

- **Lightweight**: Just 300 lines. Zero bloat, zero dependencies, zero vendor lock-in.
  
- **Expressive**: Everything you love—Agents, Workflows, RAG, Batch processing, and more.

- **[Agentic Coding](https://zacharyhuang.substack.com/p/agentic-coding-the-most-fun-way-to)**: Let AI Agents build Agents—10x productivity boost!

## 🙏 Acknowledgments

**PocketChain is inspired by [PocketFlow](https://github.com/The-Pocket/PocketFlow) by [Zachary Huang](https://github.com/The-Pocket/PocketFlow).** 

This TypeScript/Node.js version maintains the same minimalist philosophy and core abstractions as the original Python framework, bringing the power of agentic LLM development to the Node.js ecosystem.

## Installation

```bash
npm install pocketchain
```

Or install directly from GitHub:

```bash
npm install github:DavidNgugi/pocketchain
```

## Quick Start

```typescript
import { Node, Flow, SharedStore } from 'pocketchain';

// Define a simple node
class GreetNode extends Node {
  prep(shared: SharedStore) {
    return shared.name || 'World';
  }
  
  exec(name: string) {
    return `Hello, ${name}!`;
  }
  
  post(shared: SharedStore, prepRes: string, execRes: string) {
    shared.greeting = execRes;
    console.log(execRes);
  }
}

// Create and run a flow
const greetNode = new GreetNode();
const flow = new Flow(greetNode);

const shared: SharedStore = { name: 'Alice' };
flow.run(shared);
// Output: Hello, Alice!
```

## Core Concepts

### 1. Node
The smallest building block with three steps: `prep` → `exec` → `post`

```typescript
class MyNode extends Node {
  prep(shared: SharedStore) {
    // Read and preprocess data
    return shared.data;
  }
  
  exec(prepRes: any) {
    // Execute compute logic (LLM calls, APIs, etc.)
    return processData(prepRes);
  }
  
  post(shared: SharedStore, prepRes: any, execRes: any) {
    // Write results back to shared store
    shared.result = execRes;
    return 'default'; // Action to determine next node
  }
}
```

### 2. Flow
Orchestrates a graph of nodes with action-based transitions

```typescript
const nodeA = new NodeA();
const nodeB = new NodeB();
const nodeC = new NodeC();

// Connect nodes
nodeA >> nodeB;  // Default transition
nodeA - "error" >> nodeC;  // Conditional transition

const flow = new Flow(nodeA);
flow.run(shared);
```

### 3. Shared Store
Global data structure for communication between nodes

```typescript
const shared: SharedStore = {
  input: "Hello world",
  processed: null,
  result: null
};
```

## Advanced Features

### Async Support

```typescript
class AsyncNode extends AsyncNode {
  async prepAsync(shared: SharedStore) {
    return await fetchData(shared.url);
  }
  
  async execAsync(data: any) {
    return await callLLM(data);
  }
  
  async postAsync(shared: SharedStore, prepRes: any, execRes: any) {
    shared.result = execRes;
  }
}

const asyncFlow = new AsyncFlow(asyncNode);
await asyncFlow.runAsync(shared);
```

### Batch Processing

```typescript
class BatchProcessor extends BatchNode {
  prep(shared: SharedStore) {
    return shared.items; // Array of items to process
  }
  
  exec(item: any) {
    return processItem(item);
  }
  
  post(shared: SharedStore, prepRes: any[], execRes: any[]) {
    shared.results = execRes;
  }
}
```

### Parallel Execution

```typescript
class ParallelProcessor extends AsyncParallelBatchNode {
  async prepAsync(shared: SharedStore) {
    return shared.tasks;
  }
  
  async execAsync(task: any) {
    return await executeTask(task);
  }
}
```

## Design Patterns

### Agent Pattern
```typescript
class AgentNode extends Node {
  exec(context: any) {
    const action = decideAction(context);
    return action;
  }
  
  post(shared: SharedStore, prepRes: any, execRes: any) {
    return execRes.action; // 'search', 'answer', etc.
  }
}
```

### RAG Pattern
```typescript
// Offline: Index documents
const indexFlow = new Flow(
  new ChunkDocs() >> 
  new EmbedDocs() >> 
  new StoreIndex()
);

// Online: Query and answer
const queryFlow = new Flow(
  new EmbedQuery() >> 
  new RetrieveDocs() >> 
  new GenerateAnswer()
);
```

### Workflow Pattern
```typescript
const writingFlow = new Flow(
  new GenerateOutline() >> 
  new WriteContent() >> 
  new ReviewAndRefine()
);
```

## Error Handling & Retries

```typescript
class RobustNode extends Node {
  constructor() {
    super(3, 1000); // maxRetries=3, wait=1s
  }
  
  execFallback(prepRes: any, exc: Error) {
    // Graceful fallback when all retries fail
    return `Error processing: ${exc.message}`;
  }
}
```

## TypeScript Support

Full TypeScript support with comprehensive type definitions:

```typescript
import { 
  BaseNode, 
  Node, 
  Flow, 
  AsyncNode, 
  AsyncFlow,
  SharedStore, 
  Params, 
  Action 
} from 'pocketchain';
```

## Examples

Check out the [examples directory](./examples/) for complete working examples:

- [Basic Chat](./examples/chat.ts)
- [Document Summarization](./examples/summarization.ts)
- [Web Search Agent](./examples/agent.ts)
- [RAG System](./examples/rag.ts)
- [Batch Processing](./examples/batch.ts)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Community

- **Discord**: Join our [Discord server](https://discord.gg/hUHHE9Sa6T)
- **Issues**: Report bugs and request features on [GitHub](https://github.com/DavidNgugi/pocketchain/issues)
- **Discussions**: Share ideas and ask questions in [GitHub Discussions](https://github.com/DavidNgugi/pocketchain/discussions)

## Related Projects

- **[PocketFlow](https://github.com/The-Pocket/PocketFlow)** - Original Python version by Zachary Huang
- **[PocketFlow-Java](https://github.com/The-Pocket/PocketFlow-Java)** - Java version
- **[PocketFlow-CPP](https://github.com/The-Pocket/PocketFlow-CPP)** - C++ version
- **[PocketFlow-Go](https://github.com/The-Pocket/PocketFlow-Go)** - Go version

---

**Built with ❤️ by the PocketChain community, inspired by Zachary Huang's PocketFlow.**
