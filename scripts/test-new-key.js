import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testModels() {
  console.log('Testing available models with your API key...\n');
  
  // Test embedding
  try {
    console.log('✅ Testing: gemini-embedding-001');
    const embModel = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });
    await embModel.embedContent('test');
    console.log('   ✅ WORKS!\n');
  } catch (e) {
    console.log('   ❌ FAILED:', e.message.substring(0, 80), '\n');
  }
  
  // Test chat models
  const chatModels = [
    'gemini-1.5-flash-latest',
    'gemini-1.5-flash',
    'gemini-1.5-pro-latest',
    'gemini-1.5-pro',
    'gemini-pro',
    'gemini-1.0-pro',
    'models/gemini-1.5-flash-latest',
    'models/gemini-1.5-flash',
    'models/gemini-pro'
  ];
  
  for (const modelName of chatModels) {
    try {
      console.log(`Testing: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent('Say hello in 3 words');
      const text = result.response.text();
      console.log(`   ✅ WORKS! Response: "${text}"\n`);
      console.log(`\n🎉 SUCCESS! Use this model: ${modelName}\n`);
      break;
    } catch (e) {
      console.log(`   ❌ Failed: ${e.message.substring(0, 100)}\n`);
    }
  }
}

testModels();
