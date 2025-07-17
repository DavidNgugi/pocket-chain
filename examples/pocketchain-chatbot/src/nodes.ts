import { AsyncNode, SharedStore } from 'pocketchain';
import { callLLM } from './utils/llm';

export class ContextNode extends AsyncNode {
  async prepAsync(shared: SharedStore): Promise<string> {
    const history = shared.conversationHistory || [];
    const currentMessage = shared.currentMessage || '';
    
    // Format conversation history
    let context = '';
    if (history.length > 0) {
      context = 'Previous conversation:\n';
      history.forEach((entry: any) => {
        context += `User: ${entry.user}\nBot: ${entry.bot}\n\n`;
      });
    }
    
    context += `Current message: ${currentMessage}`;
    return context;
  }

  async execAsync(context: string): Promise<string> {
    return context;
  }

  async postAsync(shared: SharedStore, prepRes: string, execRes: string): Promise<void> {
    shared.context = execRes;
  }
}

export class ResponseNode extends AsyncNode {
  constructor() {
    super(3, 1000); // 3 retries, 1 second wait
  }

  async prepAsync(shared: SharedStore): Promise<string> {
    return shared.context || '';
  }

  async execAsync(context: string): Promise<string> {
    const prompt = `You are a helpful and friendly chatbot. Respond naturally to the user's message.

Context: ${context}

Provide a helpful, conversational response:`;

    return await callLLM(prompt);
  }

  async execFallbackAsync(prepRes: string, exc: Error): Promise<string> {
    console.error('LLM call failed, using fallback response:', exc.message);
    return "I'm sorry, I'm having trouble processing your request right now. Could you try again?";
  }

  async postAsync(shared: SharedStore, prepRes: string, execRes: string): Promise<void> {
    // Store the response
    shared.botResponse = execRes;
    
    // Update conversation history
    const history = shared.conversationHistory || [];
    history.push({
      user: shared.currentMessage,
      bot: execRes,
      timestamp: new Date().toISOString()
    });
    
    // Keep only last 10 messages to manage context length
    if (history.length > 10) {
      shared.conversationHistory = history.slice(-10);
    } else {
      shared.conversationHistory = history;
    }
    
    // Clear current message
    shared.currentMessage = '';
  }
} 