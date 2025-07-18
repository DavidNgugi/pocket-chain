import { AsyncFlow } from 'pocketflow-node';
import { 
  AnalyzeRequirements, 
  GenerateContent, 
  OptimizeSEO, 
  AdaptStyle, 
  CreateFinalOutput 
} from './nodes';

/**
 * Create the content writing flow
 * This flow generates content with SEO optimization and style adaptation
 */
export function createWritingFlow(): AsyncFlow {
  const analyzeNode = new AnalyzeRequirements();
  const generateNode = new GenerateContent();
  const seoNode = new OptimizeSEO();
  const styleNode = new AdaptStyle();
  const outputNode = new CreateFinalOutput();

  // Connect nodes with natural syntax
  analyzeNode.then(generateNode).then(seoNode).then(styleNode).then(outputNode);

  return new AsyncFlow(analyzeNode);
} 