/**
 * Mock web scraping utility for scraper example
 * In production, use libraries like Puppeteer, Playwright, or Cheerio
 */

export interface ScrapedContent {
  url: string;
  title: string;
  content: string;
  timestamp: Date;
}

/**
 * Mock function to scrape content from a URL
 * In production, implement actual web scraping logic
 */
export async function scrapeUrl(url: string): Promise<ScrapedContent> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  
  // Mock content based on URL
  const mockContent = generateMockContent(url);
  
  return {
    url,
    title: mockContent.title,
    content: mockContent.content,
    timestamp: new Date()
  };
}

/**
 * Generate mock content based on URL
 */
function generateMockContent(url: string): { title: string; content: string } {
  const urlLower = url.toLowerCase();
  
  if (urlLower.includes('news')) {
    return {
      title: 'Breaking News: AI Breakthrough in Healthcare',
      content: `Scientists have announced a major breakthrough in artificial intelligence applications for healthcare. The new AI system can diagnose diseases with 95% accuracy, potentially revolutionizing medical diagnosis worldwide. The technology uses advanced machine learning algorithms to analyze medical images and patient data, providing faster and more accurate diagnoses than traditional methods. This development could significantly reduce healthcare costs and improve patient outcomes.`
    };
  } else if (urlLower.includes('tech')) {
    return {
      title: 'Latest Technology Trends 2024',
      content: `The technology landscape continues to evolve rapidly in 2024. Key trends include the rise of edge computing, increased adoption of quantum computing, and the growing importance of sustainable technology solutions. Companies are investing heavily in AI and machine learning, with particular focus on natural language processing and computer vision applications. The Internet of Things (IoT) is expanding into new domains, from smart cities to industrial automation.`
    };
  } else if (urlLower.includes('business')) {
    return {
      title: 'Business Strategy in the Digital Age',
      content: `Modern businesses must adapt to the digital transformation era. Successful companies are leveraging data analytics, cloud computing, and automation to gain competitive advantages. Customer experience has become paramount, with businesses investing in personalized marketing and seamless digital interactions. The rise of remote work has also changed how organizations structure their operations and manage their workforce.`
    };
  } else {
    return {
      title: 'General Article Content',
      content: `This is a sample article about various topics. It contains information that might be useful for research or general knowledge. The content covers multiple aspects of the subject matter, providing readers with comprehensive insights and perspectives. This type of content is commonly found across the web and serves as a good example for content analysis and summarization tasks.`
    };
  }
}

/**
 * Clean and normalize scraped content
 */
export function cleanContent(content: string): string {
  return content
    .replace(/\s+/g, ' ') // Normalize whitespace
    .replace(/[^\w\s.,!?-]/g, '') // Remove special characters
    .trim();
}

/**
 * Extract key information from content
 */
export function extractKeyInfo(content: string): {
  wordCount: number;
  sentences: number;
  paragraphs: number;
  keywords: string[];
} {
  const words = content.split(/\s+/).filter(word => word.length > 0);
  const sentences = content.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
  const paragraphs = content.split(/\n\s*\n/).filter(para => para.trim().length > 0);
  
  // Simple keyword extraction (in production, use NLP libraries)
  const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those']);
  const keywords = words
    .filter(word => word.length > 3 && !commonWords.has(word.toLowerCase()))
    .slice(0, 10);
  
  return {
    wordCount: words.length,
    sentences: sentences.length,
    paragraphs: paragraphs.length,
    keywords: [...new Set(keywords)]
  };
}

// Test the utility
if (require.main === module) {
  async function test() {
    const url = 'https://example.com/news';
    console.log(`Scraping: ${url}`);
    
    const content = await scrapeUrl(url);
    console.log('Scraped content:', content);
    
    const cleaned = cleanContent(content.content);
    console.log('Cleaned content:', cleaned.substring(0, 100) + '...');
    
    const info = extractKeyInfo(content.content);
    console.log('Content analysis:', info);
  }
  
  test().catch(console.error);
} 