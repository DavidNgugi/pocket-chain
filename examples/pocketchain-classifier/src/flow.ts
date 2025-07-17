import { Flow } from 'pocketchain';
import { 
  PreprocessDocuments, 
  ExtractFeatures, 
  ClassifyDocuments, 
  AnalyzeSentiment, 
  CalculateMetrics, 
  GenerateReport 
} from './nodes';

/**
 * Create the text classification flow
 * This flow processes documents and performs classification and sentiment analysis
 */
export function createClassificationFlow(): Flow {
  const preprocessNode = new PreprocessDocuments();
  const featuresNode = new ExtractFeatures();
  const classifyNode = new ClassifyDocuments();
  const sentimentNode = new AnalyzeSentiment();
  const metricsNode = new CalculateMetrics();
  const reportNode = new GenerateReport();

  // Connect preprocessing and feature extraction
  preprocessNode >> featuresNode;
  
  // Branch to classification and sentiment analysis
  featuresNode >> classifyNode;
  preprocessNode >> sentimentNode;
  
  // Combine results for metrics and reporting
  classifyNode >> metricsNode;
  sentimentNode >> metricsNode;
  metricsNode >> reportNode;

  return new Flow(preprocessNode);
} 