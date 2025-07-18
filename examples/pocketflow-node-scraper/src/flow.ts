import { Flow } from '../../../src/index';
import { 
  ScrapeUrls, 
  ProcessContent, 
  SummarizeContent, 
  GenerateReport 
} from './nodes';

/**
 * Create the web scraping flow
 * This flow scrapes URLs, processes content, and generates summaries
 */
export function createScrapingFlow(): Flow {
  const scrapeNode = new ScrapeUrls();
  const processNode = new ProcessContent();
  const summarizeNode = new SummarizeContent();
  const reportNode = new GenerateReport();

  // Connect nodes with natural syntax
  scrapeNode.then(processNode).then(summarizeNode).then(reportNode);

  return new Flow(scrapeNode);
} 