import { SharedStore } from 'pocketchain';
import { createAgentFlow } from './flow';
import * as fs from 'fs';
import * as path from 'path';

async function main(): Promise<void> {
  console.log('🤖 PocketChain Multi-Step Agent Example');
  console.log('=======================================\n');

  // Initialize shared store
  const shared: SharedStore = {};

  try {
    // Load sample tasks
    const tasksFile = path.join(__dirname, '../sample-tasks.txt');
    const tasksText = fs.readFileSync(tasksFile, 'utf-8');
    const tasks = tasksText.split('\n').filter(task => task.trim().length > 0);
    
    console.log(`📋 Loaded ${tasks.length} sample tasks`);
    console.log('Tasks:', tasks);
    console.log();

    // Run the agent flow for each task
    const agentFlow = createAgentFlow();
    
    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      console.log(`\n🚀 Processing Task ${i + 1}: ${task}`);
      console.log('─'.repeat(60));
      
      shared.task = task;
      await agentFlow.run(shared);
      
      console.log('\n📄 Task Summary:');
      console.log(shared.finalSummary);
      console.log('\n' + '─'.repeat(60));
    }
    
    console.log('\n🎉 Multi-step agent demonstration completed!');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run the example
if (require.main === module) {
  main().catch(console.error);
} 