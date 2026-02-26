import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

async function checkModels() {
  try {
    console.log('Fetching available models...\n');
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    console.log('📋 Available Models:\n');
    
    const chatModels = [];
    const embeddingModels = [];
    
    data.models.forEach(model => {
      const methods = model.supportedGenerationMethods || [];
      
      if (methods.includes('generateContent')) {
        chatModels.push(model.name);
      }
      if (methods.includes('embedContent')) {
        embeddingModels.push(model.name);
      }
    });
    
    console.log('🤖 Chat Models (generateContent):');
    if (chatModels.length > 0) {
      chatModels.forEach(name => console.log(`  ✅ ${name}`));
      console.log(`\n🎉 Recommended: ${chatModels[0]}`);
    } else {
      console.log('  ❌ No chat models available');
    }
    
    console.log('\n📊 Embedding Models (embedContent):');
    if (embeddingModels.length > 0) {
      embeddingModels.forEach(name => console.log(`  ✅ ${name}`));
    } else {
      console.log('  ❌ No embedding models available');
    }
    
    console.log(`\n📝 Total models: ${data.models.length}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkModels();
