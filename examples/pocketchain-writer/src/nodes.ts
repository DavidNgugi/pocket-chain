import { Node, SharedStore } from 'pocketchain';

export interface ContentRequest {
  topic: string;
  type: 'article' | 'blog' | 'tutorial' | 'news';
  targetAudience: string;
  tone: 'professional' | 'casual' | 'academic' | 'conversational';
  length: 'short' | 'medium' | 'long';
  keywords: string[];
}

export interface ContentOutline {
  title: string;
  sections: {
    heading: string;
    keyPoints: string[];
    estimatedWords: number;
  }[];
  totalEstimatedWords: number;
}

export interface ContentSection {
  heading: string;
  content: string;
  wordCount: number;
  keywords: string[];
}

export interface SEOAnalysis {
  score: number;
  suggestions: string[];
  keywordDensity: Record<string, number>;
  readabilityScore: number;
}

/**
 * Node to analyze content requirements and create outline
 */
export class AnalyzeRequirements extends Node {
  prep(shared: SharedStore): ContentRequest {
    return shared.contentRequest || {
      topic: '',
      type: 'article',
      targetAudience: 'general',
      tone: 'professional',
      length: 'medium',
      keywords: []
    };
  }

  async exec(request: ContentRequest): Promise<ContentOutline> {
    // In a real implementation, use LLM to generate outline
    // For now, create a structured outline based on content type
    
    const wordCounts = {
      short: 500,
      medium: 1000,
      long: 2000
    };
    
    const targetWords = wordCounts[request.length];
    const sections = Math.ceil(targetWords / 300); // ~300 words per section
    
    const outline: ContentOutline = {
      title: `${request.topic} - Complete Guide`,
      sections: [],
      totalEstimatedWords: targetWords
    };
    
    // Generate sections based on content type
    if (request.type === 'tutorial') {
      outline.sections = [
        {
          heading: 'Introduction',
          keyPoints: ['What is ' + request.topic, 'Why it matters', 'What you\'ll learn'],
          estimatedWords: 200
        },
        {
          heading: 'Prerequisites',
          keyPoints: ['Required knowledge', 'Tools needed', 'Setup instructions'],
          estimatedWords: 250
        },
        {
          heading: 'Step-by-Step Guide',
          keyPoints: ['Detailed instructions', 'Code examples', 'Best practices'],
          estimatedWords: 400
        },
        {
          heading: 'Common Issues and Solutions',
          keyPoints: ['Troubleshooting tips', 'Error handling', 'Debugging advice'],
          estimatedWords: 200
        },
        {
          heading: 'Conclusion',
          keyPoints: ['Summary', 'Next steps', 'Additional resources'],
          estimatedWords: 150
        }
      ];
    } else {
      // Generic article structure
      outline.sections = [
        {
          heading: 'Introduction',
          keyPoints: ['Hook the reader', 'Present the topic', 'Outline the article'],
          estimatedWords: 200
        },
        {
          heading: 'Main Content',
          keyPoints: ['Key points', 'Supporting evidence', 'Examples'],
          estimatedWords: 600
        },
        {
          heading: 'Conclusion',
          keyPoints: ['Summarize key points', 'Call to action', 'Final thoughts'],
          estimatedWords: 200
        }
      ];
    }
    
    return outline;
  }

  post(shared: SharedStore, prepRes: ContentRequest, execRes: ContentOutline): void {
    shared.outline = execRes;
    console.log(`📋 Created outline with ${execRes.sections.length} sections`);
  }
}

/**
 * Node to generate content for each section
 */
export class GenerateContent extends Node {
  prep(shared: SharedStore): { outline: ContentOutline; request: ContentRequest } {
    return {
      outline: shared.outline || { title: '', sections: [], totalEstimatedWords: 0 },
      request: shared.contentRequest || { topic: '', type: 'article', targetAudience: 'general', tone: 'professional', length: 'medium', keywords: [] }
    };
  }

  async exec(inputs: { outline: ContentOutline; request: ContentRequest }): Promise<ContentSection[]> {
    const { outline, request } = inputs;
    const sections: ContentSection[] = [];
    
    for (const section of outline.sections) {
      // In a real implementation, use LLM to generate content
      // For now, create mock content based on section type
      
      let content = '';
      if (section.heading.toLowerCase().includes('introduction')) {
        content = `Welcome to our comprehensive guide on ${request.topic}. In this ${request.type}, we'll explore everything you need to know about this fascinating subject. Whether you're a beginner or an experienced professional, this guide will provide valuable insights and practical knowledge.`;
      } else if (section.heading.toLowerCase().includes('conclusion')) {
        content = `In conclusion, ${request.topic} represents a significant opportunity for growth and innovation. By following the principles and practices outlined in this guide, you'll be well-equipped to succeed in this field. Remember, continuous learning and adaptation are key to long-term success.`;
      } else {
        content = `This section covers the essential aspects of ${section.heading.toLowerCase()}. We'll dive deep into the key concepts, provide practical examples, and share expert insights. Our goal is to make this information accessible and actionable for ${request.targetAudience}.`;
      }
      
      // Add more content to reach target word count
      while (content.split(' ').length < section.estimatedWords * 0.8) {
        content += ` Additional details and insights about ${request.topic} will help readers understand the nuances and practical applications. This includes real-world examples, case studies, and expert recommendations.`;
      }
      
      sections.push({
        heading: section.heading,
        content,
        wordCount: content.split(' ').length,
        keywords: request.keywords
      });
    }
    
    return sections;
  }

  post(shared: SharedStore, prepRes: { outline: ContentOutline; request: ContentRequest }, execRes: ContentSection[]): void {
    shared.contentSections = execRes;
    const totalWords = execRes.reduce((sum, section) => sum + section.wordCount, 0);
    console.log(`✍️  Generated ${execRes.length} content sections (${totalWords} words total)`);
  }
}

/**
 * Node to optimize content for SEO
 */
export class OptimizeSEO extends Node {
  prep(shared: SharedStore): { sections: ContentSection[]; request: ContentRequest } {
    return {
      sections: shared.contentSections || [],
      request: shared.contentRequest || { topic: '', type: 'article', targetAudience: 'general', tone: 'professional', length: 'medium', keywords: [] }
    };
  }

  async exec(inputs: { sections: ContentSection[]; request: ContentRequest }): Promise<SEOAnalysis> {
    const { sections, request } = inputs;
    
    // Analyze keyword density
    const allContent = sections.map(s => s.content).join(' ').toLowerCase();
    const keywordDensity: Record<string, number> = {};
    
    for (const keyword of request.keywords) {
      const regex = new RegExp(keyword.toLowerCase(), 'g');
      const matches = allContent.match(regex) || [];
      keywordDensity[keyword] = matches.length;
    }
    
    // Calculate readability score (simplified)
    const avgWordsPerSentence = allContent.split('.').length / allContent.split(' ').length;
    const readabilityScore = Math.max(0, 100 - (avgWordsPerSentence * 10));
    
    // Generate SEO suggestions
    const suggestions: string[] = [];
    if (readabilityScore < 70) {
      suggestions.push('Consider using shorter sentences to improve readability');
    }
    if (Object.values(keywordDensity).some(count => count < 2)) {
      suggestions.push('Include target keywords more naturally throughout the content');
    }
    if (sections.length < 3) {
      suggestions.push('Add more sections to improve content structure');
    }
    
    const score = Math.min(100, readabilityScore + (suggestions.length === 0 ? 20 : 0));
    
    return {
      score,
      suggestions,
      keywordDensity,
      readabilityScore
    };
  }

  post(shared: SharedStore, prepRes: { sections: ContentSection[]; request: ContentRequest }, execRes: SEOAnalysis): void {
    shared.seoAnalysis = execRes;
    console.log(`🔍 SEO Analysis: Score ${execRes.score}/100`);
  }
}

/**
 * Node to adapt content style and tone
 */
export class AdaptStyle extends Node {
  prep(shared: SharedStore): { sections: ContentSection[]; request: ContentRequest } {
    return {
      sections: shared.contentSections || [],
      request: shared.contentRequest || { topic: '', type: 'article', targetAudience: 'general', tone: 'professional', length: 'medium', keywords: [] }
    };
  }

  async exec(inputs: { sections: ContentSection[]; request: ContentRequest }): Promise<ContentSection[]> {
    const { sections, request } = inputs;
    const adaptedSections: ContentSection[] = [];
    
    for (const section of sections) {
      let adaptedContent = section.content;
      
      // Adapt tone based on request
      switch (request.tone) {
        case 'casual':
          adaptedContent = adaptedContent.replace(/In conclusion/g, 'To wrap things up');
          adaptedContent = adaptedContent.replace(/Furthermore/g, 'Plus');
          adaptedContent = adaptedContent.replace(/Additionally/g, 'Also');
          break;
        case 'academic':
          adaptedContent = adaptedContent.replace(/Welcome to/g, 'This paper examines');
          adaptedContent = adaptedContent.replace(/In conclusion/g, 'In summary');
          break;
        case 'conversational':
          adaptedContent = adaptedContent.replace(/Welcome to/g, 'Hey there! Let\'s talk about');
          adaptedContent = adaptedContent.replace(/In conclusion/g, 'So there you have it');
          break;
      }
      
      // Adapt for target audience
      if (request.targetAudience === 'beginners') {
        adaptedContent = adaptedContent.replace(/complex/g, 'detailed');
        adaptedContent = adaptedContent.replace(/advanced/g, 'in-depth');
      }
      
      adaptedSections.push({
        ...section,
        content: adaptedContent
      });
    }
    
    return adaptedSections;
  }

  post(shared: SharedStore, prepRes: { sections: ContentSection[]; request: ContentRequest }, execRes: ContentSection[]): void {
    shared.finalContent = execRes;
    console.log(`🎨 Adapted content style for ${prepRes.request.tone} tone`);
  }
}

/**
 * Node to create final formatted output
 */
export class CreateFinalOutput extends Node {
  prep(shared: SharedStore): { 
    sections: ContentSection[]; 
    outline: ContentOutline; 
    seoAnalysis: SEOAnalysis; 
    request: ContentRequest 
  } {
    return {
      sections: shared.finalContent || [],
      outline: shared.outline || { title: '', sections: [], totalEstimatedWords: 0 },
      seoAnalysis: shared.seoAnalysis || { score: 0, suggestions: [], keywordDensity: {}, readabilityScore: 0 },
      request: shared.contentRequest || { topic: '', type: 'article', targetAudience: 'general', tone: 'professional', length: 'medium', keywords: [] }
    };
  }

  async exec(inputs: { 
    sections: ContentSection[]; 
    outline: ContentOutline; 
    seoAnalysis: SEOAnalysis; 
    request: ContentRequest 
  }): Promise<string> {
    const { sections, outline, seoAnalysis, request } = inputs;
    
    let output = `# ${outline.title}\n\n`;
    output += `**Content Type:** ${request.type}\n`;
    output += `**Target Audience:** ${request.targetAudience}\n`;
    output += `**Tone:** ${request.tone}\n`;
    output += `**SEO Score:** ${seoAnalysis.score}/100\n\n`;
    
    for (const section of sections) {
      output += `## ${section.heading}\n\n`;
      output += `${section.content}\n\n`;
    }
    
    output += `---\n\n`;
    output += `**Word Count:** ${sections.reduce((sum, s) => sum + s.wordCount, 0)}\n`;
    output += `**Readability Score:** ${seoAnalysis.readabilityScore}/100\n\n`;
    
    if (seoAnalysis.suggestions.length > 0) {
      output += `**SEO Suggestions:**\n`;
      seoAnalysis.suggestions.forEach(suggestion => {
        output += `- ${suggestion}\n`;
      });
      output += `\n`;
    }
    
    return output;
  }

  post(shared: SharedStore, prepRes: any, execRes: string): void {
    shared.finalOutput = execRes;
    console.log('📄 Final content generated successfully!');
  }
} 