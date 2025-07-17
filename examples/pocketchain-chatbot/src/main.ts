import * as readline from 'readline';
import { SharedStore, disableLogging } from 'pocketchain';
import { createChatbotFlow } from './flow';
import dotenv from 'dotenv';

dotenv.config();
disableLogging();

async function main(): Promise<void> {
  console.log('🤖 PocketChain Chatbot');
  console.log('Type "quit" or "exit" to end the conversation\n');

  const shared: SharedStore = {
    conversationHistory: [],
    currentMessage: '',
    context: '',
    botResponse: ''
  };

  const chatbotFlow = createChatbotFlow();
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const askQuestion = (): Promise<string> => {
    return new Promise((resolve) => {
      rl.question('You: ', (answer) => {
        resolve(answer);
      });
    });
  };

  try {
    while (true) {
      const userInput = await askQuestion();
      
      if (userInput.toLowerCase() === 'quit' || userInput.toLowerCase() === 'exit') {
        console.log('\nGoodbye! 👋');
        break;
      }

      if (userInput.trim() === '') {
        continue;
      }

      // Set the current message in shared store
      shared.currentMessage = userInput;

      // Run the chatbot flow
      await chatbotFlow.runAsync(shared);

      // Display the response
      console.log(`Bot: ${shared.botResponse}\n`);
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