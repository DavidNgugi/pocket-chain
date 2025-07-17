import { Flow } from 'pocketchain';
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
export function createWritingFlow(): Flow {
  const analyzeNode = new AnalyzeRequirements();
  const generateNode = new GenerateContent();
  const seoNode = new OptimizeSEO();
  const styleNode = new AdaptStyle();
  const outputNode = new CreateFinalOutput();

  // Connect nodes in sequence
  analyzeNode >> generateNode >> seoNode >> styleNode >> outputNode;

  return new Flow(analyzeNode);
} 