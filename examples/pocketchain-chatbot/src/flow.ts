import { Flow } from 'pocketchain';
import { ContextNode, ResponseNode } from './nodes';

export function createChatbotFlow(): Flow {
  // Create nodes
  const contextNode = new ContextNode();
  const responseNode = new ResponseNode();
  
  // Connect nodes in sequence
  contextNode >> responseNode;
  
  // Create flow starting with context node
  return new Flow(contextNode);
} 