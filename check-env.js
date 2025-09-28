// Check environment variables
console.log('🔍 Checking Environment Variables...\n');

// Check if .env.local exists
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');

if (fs.existsSync(envPath)) {
  console.log('✅ .env.local file exists');
  
  // Read and display (without showing actual keys)
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');
  
  lines.forEach(line => {
    if (line.trim() && !line.startsWith('#')) {
      const [key] = line.split('=');
      if (key) {
        console.log(`✅ ${key} is set`);
      }
    }
  });
} else {
  console.log('❌ .env.local file NOT found');
  console.log('💡 Create .env.local with your API keys');
}

console.log('\n🎯 Environment Check Complete!');
