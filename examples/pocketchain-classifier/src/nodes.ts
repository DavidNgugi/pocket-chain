import { Node, BatchNode, SharedStore } from 'pocketchain';

export interface TextDocument {
  id: string;
  text: string;
  metadata?: Record<string, any>;
}

export interface ClassificationResult {
  documentId: string;
  category: string;
  confidence: number;
  keywords: string[];
  reasoning: string;
}

export interface SentimentResult {
  documentId: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
  confidence: number;
  keyPhrases: string[];
}

export interface ClassificationMetrics {
  accuracy: number;
  precision: Record<string, number>;
  recall: Record<string, number>;
  f1Score: Record<string, number>;
  confusionMatrix: Record<string, Record<string, number>>;
}

/**
 * Node to preprocess and clean text documents
 */
export class PreprocessDocuments extends BatchNode {
  prep(shared: SharedStore): TextDocument[] {
    return shared.documents || [];
  }

  exec(document: TextDocument): TextDocument {
    // Clean and normalize text
    const cleanedText = document.text
      .toLowerCase()
      .replace(/[^\w\s.,!?-]/g, '') // Remove special characters
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
    
    return {
      ...document,
      text: cleanedText
    };
  }

  post(shared: SharedStore, prepRes: TextDocument[], execResList: TextDocument[]): void {
    shared.processedDocuments = execResList;
    console.log(`🧹 Preprocessed ${execResList.length} documents`);
  }
}

/**
 * Node to extract features from documents
 */
export class ExtractFeatures extends BatchNode {
  prep(shared: SharedStore): TextDocument[] {
    return shared.processedDocuments || [];
  }

  exec(document: TextDocument): { document: TextDocument; features: Record<string, number> } {
    const words = document.text.split(' ');
    const features: Record<string, number> = {};
    
    // Simple feature extraction (in production, use NLP libraries)
    const wordCount = words.length;
    const uniqueWords = new Set(words).size;
    const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / wordCount;
    
    // Keyword-based features
    const keywords = {
      'technical': ['algorithm', 'code', 'programming', 'software', 'system', 'data', 'analysis'],
      'business': ['strategy', 'market', 'customer', 'revenue', 'growth', 'management', 'sales'],
      'academic': ['research', 'study', 'analysis', 'methodology', 'theory', 'hypothesis', 'conclusion'],
      'casual': ['hello', 'thanks', 'great', 'awesome', 'cool', 'nice', 'good']
    };
    
    for (const [category, categoryKeywords] of Object.entries(keywords)) {
      features[`${category}_keywords`] = categoryKeywords.filter(keyword => 
        document.text.includes(keyword)
      ).length;
    }
    
    features.wordCount = wordCount;
    features.uniqueWords = uniqueWords;
    features.avgWordLength = avgWordLength;
    features.vocabularyDiversity = uniqueWords / wordCount;
    
    return { document, features };
  }

  post(shared: SharedStore, prepRes: TextDocument[], execResList: any[]): void {
    shared.features = execResList;
    console.log(`🔍 Extracted features from ${execResList.length} documents`);
  }
}

/**
 * Node to classify documents based on features
 */
export class ClassifyDocuments extends BatchNode {
  prep(shared: SharedStore): any[] {
    return shared.features || [];
  }

  exec(featureData: any): ClassificationResult {
    const { document, features } = featureData;
    
    // Simple classification logic (in production, use ML models)
    const scores = {
      technical: features.technical_keywords * 2 + (features.avgWordLength > 6 ? 1 : 0),
      business: features.business_keywords * 2 + (features.wordCount > 100 ? 1 : 0),
      academic: features.academic_keywords * 2 + (features.vocabularyDiversity > 0.8 ? 1 : 0),
      casual: features.casual_keywords * 3 + (features.wordCount < 50 ? 2 : 0)
    };
    
    // Find the category with highest score
    const category = Object.entries(scores).reduce((a, b) => scores[a[0]] > scores[b[0]] ? a : b)[0];
    const maxScore = scores[category as keyof typeof scores];
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    const confidence = totalScore > 0 ? maxScore / totalScore : 0.25;
    
    // Extract relevant keywords
    const keywords = Object.entries(features)
      .filter(([key, value]) => key.includes('keywords') && value > 0)
      .map(([key, value]) => `${key.replace('_keywords', '')}: ${value}`)
      .slice(0, 3);
    
    const reasoning = `Classified as ${category} based on keyword presence and text characteristics. Confidence: ${(confidence * 100).toFixed(1)}%`;
    
    return {
      documentId: document.id,
      category,
      confidence,
      keywords,
      reasoning
    };
  }

  post(shared: SharedStore, prepRes: any[], execResList: ClassificationResult[]): void {
    shared.classifications = execResList;
    console.log(`🏷️  Classified ${execResList.length} documents`);
  }
}

/**
 * Node to perform sentiment analysis
 */
export class AnalyzeSentiment extends BatchNode {
  prep(shared: SharedStore): TextDocument[] {
    return shared.processedDocuments || [];
  }

  exec(document: TextDocument): SentimentResult {
    // Simple sentiment analysis (in production, use NLP libraries)
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'like', 'happy', 'success'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'dislike', 'problem', 'issue', 'error', 'fail', 'poor'];
    
    const words = document.text.toLowerCase().split(' ');
    const positiveCount = positiveWords.filter(word => words.includes(word)).length;
    const negativeCount = negativeWords.filter(word => words.includes(word)).length;
    
    let sentiment: 'positive' | 'negative' | 'neutral';
    let score: number;
    
    if (positiveCount > negativeCount) {
      sentiment = 'positive';
      score = positiveCount / (positiveCount + negativeCount + 1);
    } else if (negativeCount > positiveCount) {
      sentiment = 'negative';
      score = negativeCount / (positiveCount + negativeCount + 1);
    } else {
      sentiment = 'neutral';
      score = 0.5;
    }
    
    const confidence = Math.abs(positiveCount - negativeCount) / (positiveCount + negativeCount + 1);
    const keyPhrases = [...positiveWords, ...negativeWords].filter(word => words.includes(word)).slice(0, 5);
    
    return {
      documentId: document.id,
      sentiment,
      score,
      confidence,
      keyPhrases
    };
  }

  post(shared: SharedStore, prepRes: TextDocument[], execResList: SentimentResult[]): void {
    shared.sentiments = execResList;
    console.log(`😊 Analyzed sentiment for ${execResList.length} documents`);
  }
}

/**
 * Node to calculate classification metrics
 */
export class CalculateMetrics extends Node {
  prep(shared: SharedStore): { classifications: ClassificationResult[]; sentiments: SentimentResult[] } {
    return {
      classifications: shared.classifications || [],
      sentiments: shared.sentiments || []
    };
  }

  async exec(inputs: { classifications: ClassificationResult[]; sentiments: SentimentResult[] }): Promise<ClassificationMetrics> {
    const { classifications, sentiments } = inputs;
    
    // Calculate basic metrics
    const categories = [...new Set(classifications.map(c => c.category))];
    const totalDocs = classifications.length;
    
    // Mock ground truth for demonstration (in production, use actual labels)
    const groundTruth = classifications.map(c => ({
      documentId: c.documentId,
      category: categories[Math.floor(Math.random() * categories.length)] // Random for demo
    }));
    
    // Calculate confusion matrix
    const confusionMatrix: Record<string, Record<string, number>> = {};
    for (const category of categories) {
      confusionMatrix[category] = {};
      for (const otherCategory of categories) {
        confusionMatrix[category][otherCategory] = 0;
      }
    }
    
    let correct = 0;
    for (let i = 0; i < classifications.length; i++) {
      const predicted = classifications[i].category;
      const actual = groundTruth[i].category;
      
      confusionMatrix[actual][predicted]++;
      if (predicted === actual) correct++;
    }
    
    const accuracy = correct / totalDocs;
    
    // Calculate precision, recall, and F1 for each category
    const precision: Record<string, number> = {};
    const recall: Record<string, number> = {};
    const f1Score: Record<string, number> = {};
    
    for (const category of categories) {
      const tp = confusionMatrix[category][category] || 0;
      const fp = Object.values(confusionMatrix).reduce((sum, row) => sum + (row[category] || 0), 0) - tp;
      const fn = Object.values(confusionMatrix[category]).reduce((sum, count) => sum + count, 0) - tp;
      
      precision[category] = tp + fp > 0 ? tp / (tp + fp) : 0;
      recall[category] = tp + fn > 0 ? tp / (tp + fn) : 0;
      f1Score[category] = precision[category] + recall[category] > 0 
        ? 2 * (precision[category] * recall[category]) / (precision[category] + recall[category]) 
        : 0;
    }
    
    return {
      accuracy,
      precision,
      recall,
      f1Score,
      confusionMatrix
    };
  }

  post(shared: SharedStore, prepRes: { classifications: ClassificationResult[]; sentiments: SentimentResult[] }, execRes: ClassificationMetrics): void {
    shared.metrics = execRes;
    console.log(`📊 Calculated classification metrics (Accuracy: ${(execRes.accuracy * 100).toFixed(1)}%)`);
  }
}

/**
 * Node to generate classification report
 */
export class GenerateReport extends Node {
  prep(shared: SharedStore): { 
    classifications: ClassificationResult[]; 
    sentiments: SentimentResult[]; 
    metrics: ClassificationMetrics 
  } {
    return {
      classifications: shared.classifications || [],
      sentiments: shared.sentiments || [],
      metrics: shared.metrics || { accuracy: 0, precision: {}, recall: {}, f1Score: {}, confusionMatrix: {} }
    };
  }

  async exec(inputs: { 
    classifications: ClassificationResult[]; 
    sentiments: SentimentResult[]; 
    metrics: ClassificationMetrics 
  }): Promise<string> {
    const { classifications, sentiments, metrics } = inputs;
    
    let report = '📊 Classification Report\n';
    report += '========================\n\n';
    
    // Overall statistics
    report += `📈 Overall Statistics:\n`;
    report += `   Total Documents: ${classifications.length}\n`;
    report += `   Overall Accuracy: ${(metrics.accuracy * 100).toFixed(1)}%\n\n`;
    
    // Category breakdown
    const categoryCounts: Record<string, number> = {};
    for (const classification of classifications) {
      categoryCounts[classification.category] = (categoryCounts[classification.category] || 0) + 1;
    }
    
    report += `🏷️  Category Distribution:\n`;
    for (const [category, count] of Object.entries(categoryCounts)) {
      const percentage = (count / classifications.length * 100).toFixed(1);
      report += `   ${category}: ${count} (${percentage}%)\n`;
    }
    report += '\n';
    
    // Sentiment analysis
    const sentimentCounts: Record<string, number> = {};
    for (const sentiment of sentiments) {
      sentimentCounts[sentiment.sentiment] = (sentimentCounts[sentiment.sentiment] || 0) + 1;
    }
    
    report += `😊 Sentiment Analysis:\n`;
    for (const [sentiment, count] of Object.entries(sentimentCounts)) {
      const percentage = (count / sentiments.length * 100).toFixed(1);
      report += `   ${sentiment}: ${count} (${percentage}%)\n`;
    }
    report += '\n';
    
    // Performance metrics
    report += `📊 Performance Metrics:\n`;
    for (const category of Object.keys(metrics.precision)) {
      report += `   ${category}:\n`;
      report += `     Precision: ${(metrics.precision[category] * 100).toFixed(1)}%\n`;
      report += `     Recall: ${(metrics.recall[category] * 100).toFixed(1)}%\n`;
      report += `     F1-Score: ${(metrics.f1Score[category] * 100).toFixed(1)}%\n`;
    }
    
    return report;
  }

  post(shared: SharedStore, prepRes: any, execRes: string): void {
    shared.finalReport = execRes;
    console.log('📄 Classification report generated');
  }
} 