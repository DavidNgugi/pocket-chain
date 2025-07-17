import { AsyncFlow } from 'pocketchain';
import { ContextNode, ResponseNode } from './nodes';

export function createChatbotFlow(): AsyncFlow {
  // Create nodes
  const contextNode = new ContextNode();
  const responseNode = new ResponseNode();
  
  // Connect nodes with natural syntax
  contextNode.then(responseNode);
  
  // Create flow starting with context node
  return new AsyncFlow(contextNode);
} 