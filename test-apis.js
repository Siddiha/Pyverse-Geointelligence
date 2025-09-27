// Simple API test script
const testAPIs = async () => {
  console.log('🧪 Testing APIs...\n');
  
  // Test Cohere API
  try {
    console.log('Testing Cohere API...');
    const cohereResponse = await fetch('http://localhost:3000/api/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: 'Hello, test message' })
    });
    
    if (cohereResponse.ok) {
      const data = await cohereResponse.json();
      console.log('✅ Cohere API working:', data.success ? 'SUCCESS' : 'FAILED');
      if (data.data?.response) {
        console.log('Response preview:', data.data.response.substring(0, 100) + '...');
      }
    } else {
      console.log('❌ Cohere API failed:', cohereResponse.status);
    }
  } catch (error) {
    console.log('❌ Cohere API error:', error.message);
  }
  
  // Test News API
  try {
    console.log('\nTesting News API...');
    const newsResponse = await fetch('http://localhost:3000/api/news');
    
    if (newsResponse.ok) {
      const data = await newsResponse.json();
      console.log('✅ News API working:', data.success ? 'SUCCESS' : 'FAILED');
      console.log('News count:', data.count || 0);
    } else {
      console.log('❌ News API failed:', newsResponse.status);
    }
  } catch (error) {
    console.log('❌ News API error:', error.message);
  }
  
  console.log('\n🎯 API Test Complete!');
};

// Run the test
testAPIs();
