import { SharedStore } from 'pocketchain';
import { createWritingFlow } from './flow';
import { ContentRequest } from './nodes';

async function main(): Promise<void> {
  console.log('✍️  PocketChain Content Writer Example');
  console.log('======================================\n');

  // Initialize shared store
  const shared: SharedStore = {};

  try {
    // Define sample content requests
    const contentRequests: ContentRequest[] = [
      {
        topic: 'Machine Learning Basics',
        type: 'tutorial',
        targetAudience: 'beginners',
        tone: 'conversational',
        length: 'medium',
        keywords: ['machine learning', 'AI', 'beginners', 'tutorial']
      },
      {
        topic: 'Data Science Best Practices',
        type: 'article',
        targetAudience: 'professionals',
        tone: 'professional',
        length: 'long',
        keywords: ['data science', 'best practices', 'professional', 'analytics']
      },
      {
        topic: 'Web Development Trends 2024',
        type: 'blog',
        targetAudience: 'developers',
        tone: 'casual',
        length: 'short',
        keywords: ['web development', 'trends', '2024', 'technology']
      }
    ];

    console.log(`📝 Generating ${contentRequests.length} pieces of content`);
    console.log();

    // Run the writing flow for each request
    const writingFlow = createWritingFlow();
    
    for (let i = 0; i < contentRequests.length; i++) {
      const request = contentRequests[i];
      console.log(`\n🚀 Generating Content ${i + 1}: ${request.topic}`);
      console.log('─'.repeat(60));
      console.log(`Type: ${request.type} | Audience: ${request.targetAudience} | Tone: ${request.tone} | Length: ${request.length}`);
      console.log('─'.repeat(60));
      
      shared.contentRequest = request;
      await writingFlow.run(shared);
      
      console.log('\n📄 Generated Content:');
      console.log('─'.repeat(60));
      console.log(shared.finalOutput);
      console.log('\n' + '─'.repeat(60));
    }
    
    console.log('\n🎉 Content writing demonstration completed!');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run the example
if (require.main === module) {
  main().catch(console.error);
} 