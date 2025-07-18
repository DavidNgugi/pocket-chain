import { SharedStore } from 'pocketflow-node';
import { createOfflineFlow, createOnlineFlow } from './flow';
import * as fs from 'fs';
import * as path from 'path';

async function main(): Promise<void> {
  console.log('🤖 PocketFlow-Node RAG Example');
  console.log('==========================\n');

  // Initialize shared store
  const shared: SharedStore = {};

  try {
    // Stage 1: Offline Indexing
    console.log('📚 Stage 1: Building Document Index');
    console.log('-----------------------------------');
    
    // Get sample documents
    const sampleDir = path.join(__dirname, '../sample-documents');
    const files = fs.readdirSync(sampleDir)
      .filter(file => file.endsWith('.txt'))
      .map(file => path.join(sampleDir, file));
    
    shared.files = files;
    console.log(`Found ${files.length} documents to index`);
    
    // Run offline indexing flow
    const offlineFlow = createOfflineFlow();
    await offlineFlow.run(shared);
    
    console.log('✅ Indexing completed successfully!\n');

    // Stage 2: Online Querying
    console.log('🔍 Stage 2: Query the Knowledge Base');
    console.log('------------------------------------');
    
    // Example questions
    const questions = [
      'What is artificial intelligence?',
      'How does machine learning work?',
      'What are the benefits of AI?'
    ];
    
    const onlineFlow = createOnlineFlow();
    
    for (const question of questions) {
      console.log(`\n❓ Question: ${question}`);
      console.log('─'.repeat(50));
      
      shared.question = question;
      await onlineFlow.run(shared);
      
      console.log(`\n💡 Answer: ${shared.answer}`);
    }
    
    console.log('\n🎉 RAG system demonstration completed!');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run the example
if (require.main === module) {
  main().catch(console.error);
} 