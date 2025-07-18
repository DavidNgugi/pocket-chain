import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function callLLM(prompt: string): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY not found in environment variables');
  }

  try {
    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    });

    return response.choices[0]?.message?.content || 'No response generated';
  } catch (error) {
    console.error('Error calling LLM:', error);
    throw error;
  }
}

export async function getEmbedding(text: string): Promise<number[]> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY not found in environment variables');
  }

  try {
    const response = await client.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text,
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error('Error getting embedding:', error);
    throw error;
  }
}

// Test the utilities
if (require.main === module) {
  callLLM('What is the capital of France?')
    .then(console.log)
    .catch(console.error);
    
  getEmbedding('Hello world')
    .then(embedding => console.log('Embedding length:', embedding.length))
    .catch(console.error);
} 