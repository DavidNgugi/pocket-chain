import * as readline from 'readline';
import { SharedStore } from 'pocketflow-node';
import { createSearchFlow } from './flow';
import dotenv from 'dotenv';

dotenv.config();

async function main(): Promise<void> {
  console.log('🔍 PocketFlow-Node Search Agent');
  console.log('Type "quit" or "exit" to end the session\n');

  const shared: SharedStore = {
    searchQuery: '',
    searchResults: [],
    extractedContent: '',
    answer: ''
  };

  const searchFlow = createSearchFlow();
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const askQuestion = (): Promise<string> => {
    return new Promise((resolve) => {
      rl.question('Search: ', (answer) => {
        resolve(answer);
      });
    });
  };

  try {
    while (true) {
      const userQuery = await askQuestion();
      
      if (userQuery.toLowerCase() === 'quit' || userQuery.toLowerCase() === 'exit') {
        console.log('\nGoodbye! 👋');
        break;
      }

      if (userQuery.trim() === '') {
        continue;
      }

      // Set the search query in shared store
      shared.searchQuery = userQuery;

      console.log('\nProcessing your search...\n');

      // Run the search flow
      await searchFlow.run(shared);

      // Display the answer
      console.log(`Agent: ${shared.answer}\n`);
      console.log('─'.repeat(50) + '\n');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    rl.close();
  }
}

if (require.main === module) {
  main().catch(console.error);
} 