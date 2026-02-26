import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  try {
    // Test embedding model
    console.log('Testing embedding model: gemini-embedding-001');
    const embModel = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });
    const embResult = await embModel.embedContent('test');
    console.log('✅ Embedding model works! Dimensions:', embResult.embedding.values.length);
    
    // Test chat models
    const chatModels = [
      'gemini-pro',
      'gemini-1.5-pro',
      'gemini-1.5-flash',
      'gemini-1.5-flash-latest'
    ];
    
    for (const modelName of chatModels) {
      try {
        console.log(`\nTesting chat model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Say hello');
        console.log(`✅ ${modelName} works!`);
        console.log('Response:', result.response.text().substring(0, 50));
        break; // Use the first working model
      } catch (error) {
        console.log(`❌ ${modelName} failed:`, error.message.substring(0, 100));
      }
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

listModels();
