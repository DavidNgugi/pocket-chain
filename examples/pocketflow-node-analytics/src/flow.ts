import { Flow } from '../../../src/index';
import { 
  LoadData, 
  CalculateStatistics, 
  GenerateInsights, 
  CreateVisualizations, 
  GenerateRecommendations 
} from './nodes';

/**
 * Create the data analytics flow
 * This flow processes CSV data and generates insights
 */
export function createAnalyticsFlow(): Flow {
  const loadNode = new LoadData();
  const statsNode = new CalculateStatistics();
  const insightsNode = new GenerateInsights();
  const vizNode = new CreateVisualizations();
  const recommendationsNode = new GenerateRecommendations();

  // Connect nodes with natural syntax
  loadNode.then(statsNode).then(insightsNode);
  insightsNode.then(vizNode);
  insightsNode.then(recommendationsNode);

  return new Flow(loadNode);
} 