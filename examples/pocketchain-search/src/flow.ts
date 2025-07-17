import { Flow } from 'pocketchain';
import { SearchNode, ExtractNode, AnswerNode } from './nodes';

export function createSearchFlow(): Flow {
  // Create nodes
  const searchNode = new SearchNode();
  const extractNode = new ExtractNode();
  const answerNode = new AnswerNode();
  
  // Connect nodes in sequence
  searchNode >> extractNode >> answerNode;
  
  // Create flow starting with search node
  return new Flow(searchNode);
} 