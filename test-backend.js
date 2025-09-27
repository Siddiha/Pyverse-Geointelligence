// Test backend APIs
const testBackend = async () => {
  console.log('🧪 Testing Backend APIs...\n');
  
  // Test if server is running
  try {
    const response = await fetch('http://localhost:3000/api/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        message: 'Hello, test message',
        country: 'United States'
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ AI Chat API Status:', response.status);
      console.log('✅ Success:', data.success);
      if (data.data?.response) {
        console.log('✅ AI Response:', data.data.response.substring(0, 100) + '...');
      }
    } else {
      console.log('❌ AI Chat API failed:', response.status);
      const errorText = await response.text();
      console.log('Error details:', errorText);
    }
  } catch (error) {
    console.log('❌ Connection failed:', error.message);
    console.log('💡 Make sure the server is running: npm run dev');
  }
  
  console.log('\n🎯 Backend Test Complete!');
};

// Run the test
testBackend();
