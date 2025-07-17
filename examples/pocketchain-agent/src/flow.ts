import { Flow } from 'pocketchain';
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
export function createAgentFlow(): Flow {
  const analyzeNode = new AnalyzeTask();
  const decideNode = new DecideAction();
  const executeNode = new ExecuteStep();
  const completeNode = new CompleteTask();
  const errorNode = new HandleError();

  // Connect nodes with conditional branching
  analyzeNode >> decideNode;
  
  // Decision-based transitions
  decideNode - "start" >> executeNode;
  decideNode - "execute" >> executeNode;
  decideNode - "complete" >> completeNode;
  decideNode - "error" >> errorNode;
  
  // Loop back to decision after execution
  executeNode >> decideNode;
  
  // Error recovery loops back to decision
  errorNode >> decideNode;

  return new Flow(analyzeNode);
} 