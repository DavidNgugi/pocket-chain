import { SharedStore } from 'pocketflow-node';
import { createClassificationFlow } from './flow';
import { TextDocument } from './nodes';

async function main(): Promise<void> {
  console.log('🏷️  PocketFlow-Node Text Classifier Example');
  console.log('=======================================\n');

  // Initialize shared store
  const shared: SharedStore = {};

  try {
    // Sample documents for classification
    const sampleDocuments: TextDocument[] = [
      {
        id: 'doc1',
        text: 'This algorithm uses machine learning techniques to analyze large datasets and extract meaningful patterns. The implementation includes preprocessing steps and feature engineering.',
        metadata: { source: 'technical_blog' }
      },
      {
        id: 'doc2',
        text: 'Our quarterly revenue growth exceeded expectations by 15%. Customer satisfaction scores improved significantly, and market share expanded in key segments.',
        metadata: { source: 'business_report' }
      },
      {
        id: 'doc3',
        text: 'The research methodology employed a mixed-methods approach combining quantitative analysis with qualitative interviews. Statistical significance was achieved across all hypotheses.',
        metadata: { source: 'academic_paper' }
      },
      {
        id: 'doc4',
        text: 'Hey there! Thanks for the great feedback on our latest product. We really appreciate your support and are excited to share more awesome features soon!',
        metadata: { source: 'social_media' }
      },
      {
        id: 'doc5',
        text: 'The software development process involves multiple stages including requirements gathering, design, implementation, testing, and deployment. Each phase requires careful planning.',
        metadata: { source: 'technical_doc' }
      },
      {
        id: 'doc6',
        text: 'This is absolutely terrible! The product quality is poor and customer service is non-existent. I would never recommend this company to anyone.',
        metadata: { source: 'customer_review' }
      },
      {
        id: 'doc7',
        text: 'The study findings demonstrate significant correlations between variables. Further research is needed to establish causal relationships and validate the theoretical framework.',
        metadata: { source: 'research_paper' }
      },
      {
        id: 'doc8',
        text: 'Amazing experience with this service! The team was incredibly helpful and the results exceeded all expectations. Highly recommend!',
        metadata: { source: 'customer_feedback' }
      }
    ];

    shared.documents = sampleDocuments;
    console.log(`📄 Loaded ${sampleDocuments.length} documents for classification`);
    console.log();

    // Run the classification flow
    const classificationFlow = createClassificationFlow();
    await classificationFlow.run(shared);

    // Display results
    console.log('\n📊 Classification Results');
    console.log('========================');
    
    if (shared.classifications) {
      console.log('\n🏷️  Document Classifications:');
      shared.classifications.forEach((classification: any) => {
        console.log(`\nDocument ${classification.documentId}:`);
        console.log(`  Category: ${classification.category}`);
        console.log(`  Confidence: ${(classification.confidence * 100).toFixed(1)}%`);
        console.log(`  Keywords: ${classification.keywords.join(', ')}`);
        console.log(`  Reasoning: ${classification.reasoning}`);
      });
    }
    
    if (shared.sentiments) {
      console.log('\n😊 Sentiment Analysis:');
      shared.sentiments.forEach((sentiment: any) => {
        console.log(`\nDocument ${sentiment.documentId}:`);
        console.log(`  Sentiment: ${sentiment.sentiment}`);
        console.log(`  Score: ${sentiment.score.toFixed(2)}`);
        console.log(`  Confidence: ${(sentiment.confidence * 100).toFixed(1)}%`);
        console.log(`  Key Phrases: ${sentiment.keyPhrases.join(', ')}`);
      });
    }
    
    if (shared.finalReport) {
      console.log('\n📄 Final Report:');
      console.log(shared.finalReport);
    }
    
    console.log('\n🎉 Text classification demonstration completed!');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run the example
if (require.main === module) {
  main().catch(console.error);
} 