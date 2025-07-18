import { Flow } from 'pocketflow-node';
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
  preprocessNode.then(featuresNode);
  
  // Branch to classification and sentiment analysis
  featuresNode.then(classifyNode);
  preprocessNode.then(sentimentNode);
  
  // Combine results for metrics and reporting
  classifyNode.then(metricsNode);
  sentimentNode.then(metricsNode);
  metricsNode.then(reportNode);

  return new Flow(preprocessNode);
} 