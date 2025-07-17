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
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content || 'No response generated';
  } catch (error) {
    console.error('Error calling LLM:', error);
    throw error;
  }
}

// Test the utility
if (require.main === module) {
  callLLM('Hello, how are you?')
    .then(console.log)
    .catch(console.error);
} 