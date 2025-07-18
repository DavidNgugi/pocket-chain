import { AsyncFlow } from 'pocketflow-node';

import { 
  AnalyzeTask, 
  DecideAction, 
  ExecuteStep, 
  CompleteTask, 
  HandleError 
} from './nodes';

/**
 * Create the multi-step agent flow
 * This flow implements dynamic decision making and error recovery
 */
export function createAgentFlow(): AsyncFlow {
  const analyzeNode = new AnalyzeTask();
  const decideNode = new DecideAction();
  const executeNode = new ExecuteStep();
  const completeNode = new CompleteTask();
  const errorNode = new HandleError();

  // Connect nodes with natural English-like syntax
  analyzeNode.then(decideNode);
  
  // Decision-based transitions
  decideNode.on("start", executeNode);
  decideNode.on("execute", executeNode);
  decideNode.on("complete", completeNode);
  decideNode.on("error", errorNode);
  
  // Loop back to decision after execution
  executeNode.then(decideNode);
  
  // Error recovery loops back to decision
  errorNode.then(decideNode);

  return new AsyncFlow(analyzeNode);
} 