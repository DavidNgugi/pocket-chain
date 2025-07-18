import { Flow } from 'pocketflow-node';
import { SearchNode, ExtractNode, AnswerNode } from './nodes';

export function createSearchFlow(): Flow {
  // Create nodes
  const searchNode = new SearchNode();
  const extractNode = new ExtractNode();
  const answerNode = new AnswerNode();
  
  // Connect nodes with natural syntax
  searchNode.then(extractNode).then(answerNode);
  
  // Create flow starting with search node
  return new Flow(searchNode);
} 