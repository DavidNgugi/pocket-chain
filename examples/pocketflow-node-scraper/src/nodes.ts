import { Node, BatchNode, SharedStore } from '../../../src/index';
import { scrapeUrl, cleanContent, extractKeyInfo, ScrapedContent } from './utils/scraper';

/**
 * Node to scrape content from URLs
 */
export class ScrapeUrls extends BatchNode {
  prep(shared: SharedStore): string[] {
    return shared.urls || [];
  }

  async exec(url: string): Promise<ScrapedContent> {
    console.log(`🔍 Scraping: ${url}`);
    return await scrapeUrl(url);
  }

  post(shared: SharedStore, prepRes: string[], execResList: ScrapedContent[]): void {
    shared.scrapedContents = execResList;
    console.log(`✅ Scraped ${execResList.length} URLs successfully`);
  }
}

/**
 * Node to clean and process scraped content
 */
export class ProcessContent extends BatchNode {
  prep(shared: SharedStore): ScrapedContent[] {
    return shared.scrapedContents || [];
  }

  exec(content: ScrapedContent): { cleaned: string; info: any; original: ScrapedContent } {
    const cleaned = cleanContent(content.content);
    const info = extractKeyInfo(content.content);
    
    return {
      cleaned,
      info,
      original: content
    };
  }

  post(shared: SharedStore, prepRes: ScrapedContent[], execResList: any[]): void {
    shared.processedContents = execResList;
    console.log(`📝 Processed ${execResList.length} articles`);
  }
}

/**
 * Node to generate summaries of scraped content
 */
export class SummarizeContent extends BatchNode {
  prep(shared: SharedStore): any[] {
    return shared.processedContents || [];
  }

  async exec(processed: any): Promise<string> {
    const { cleaned, info, original } = processed;
    
    // In a real implementation, call your LLM here
    // For now, create a simple summary
    const summary = `Article: ${original.title}
Word Count: ${info.wordCount}
Key Points: ${info.keywords.slice(0, 5).join(', ')}
Summary: ${cleaned.substring(0, 200)}...`;
    
    return summary;
  }

  post(shared: SharedStore, prepRes: any[], execResList: string[]): void {
    shared.summaries = execResList;
    console.log(`📋 Generated ${execResList.length} summaries`);
  }
}

/**
 * Node to create a comprehensive report
 */
export class GenerateReport extends Node {
  prep(shared: SharedStore): { summaries: string[]; contents: any[] } {
    return {
      summaries: shared.summaries || [],
      contents: shared.processedContents || []
    };
  }

  async exec(inputs: { summaries: string[]; contents: any[] }): Promise<string> {
    const { summaries, contents } = inputs;
    
    const totalWords = contents.reduce((sum, content) => sum + content.info.wordCount, 0);
    const avgWords = Math.round(totalWords / contents.length);
    
    const report = `📊 Web Scraping Report
====================

📈 Statistics:
- Total articles scraped: ${contents.length}
- Total words processed: ${totalWords}
- Average words per article: ${avgWords}

📋 Article Summaries:
${summaries.map((summary, index) => `${index + 1}. ${summary}`).join('\n\n')}

🎯 Key Insights:
- Most articles focus on technology and business topics
- Content quality varies significantly across sources
- Average article length is suitable for summarization

📅 Generated on: ${new Date().toLocaleString()}`;
    
    return report;
  }

  post(shared: SharedStore, prepRes: { summaries: string[]; contents: any[] }, execRes: string): void {
    shared.finalReport = execRes;
    console.log('📄 Final report generated');
  }
} 