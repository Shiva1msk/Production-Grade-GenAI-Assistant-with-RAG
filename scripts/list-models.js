import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listAvailableModels() {
  try {
    console.log('Fetching available models with your API key...\n');
    
    const models = await genAI.listModels();
    
    console.log('📋 All Available Models:');
    console.log('========================\n');
    
    models.forEach(model => {
      console.log(`Name: ${model.name}`);
      console.log(`Display Name: ${model.displayName}`);
      console.log(`Supported Methods: ${model.supportedGenerationMethods?.join(', ') || 'N/A'}`);
      console.log('---');
    });
    
    console.log('\n🔍 Chat Models (generateContent):');
    const chatModels = models.filter(m => 
      m.supportedGenerationMethods?.includes('generateContent')
    );
    
    if (chatModels.length > 0) {
      chatModels.forEach(m => console.log(`  ✅ ${m.name}`));
      console.log(`\n🎉 Found ${chatModels.length} chat model(s)!`);
      console.log(`\nRecommended: ${chatModels[0].name}`);
    } else {
      console.log('  ❌ No chat models available with this API key');
    }
    
    console.log('\n🔍 Embedding Models (embedContent):');
    const embModels = models.filter(m => 
      m.supportedGenerationMethods?.includes('embedContent')
    );
    
    if (embModels.length > 0) {
      embModels.forEach(m => console.log(`  ✅ ${m.name}`));
    } else {
      console.log('  ❌ No embedding models available');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

listAvailableModels();
