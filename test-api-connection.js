#!/usr/bin/env node

/**
 * API Connection Test Script
 * Tests if the GeoIntel AI backend and frontend are properly connected
 */

const http = require('http');
const path = require('path');

const API_URL = 'http://localhost:3000/api/ai/chat';
const TEST_TIMEOUT = 10000;

console.log('🧪 GeoIntel AI API Connection Test\n');
console.log('=' .repeat(50));

// Test 1: Check if server is running
console.log('\n[1/3] Checking if server is running...');
console.log(`     Testing: ${API_URL}`);

const testRequest = () => {
  const postData = JSON.stringify({
    message: 'Test message: Is the API working?'
  });

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/ai/chat',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    },
    timeout: TEST_TIMEOUT
  };

  const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      if (res.statusCode === 200) {
        console.log('✅ Server is running!');
        console.log(`   Status Code: ${res.statusCode}`);
        
        try {
          const response = JSON.parse(data);
          console.log('\n[2/3] Testing API response format...');
          
          if (response.success === true) {
            console.log('✅ API response format is correct!');
            console.log(`   Response has "success" field: ✓`);
            console.log(`   Response has "data" field: ${response.data ? '✓' : '✗'}`);
            
            if (response.data && response.data.response) {
              console.log(`   Response has "data.response" field: ✓`);
              console.log('\n[3/3] API Response Content:');
              console.log('     ' + '='.repeat(40));
              console.log(response.data.response.split('\n').map(line => '     ' + line).join('\n'));
              console.log('     ' + '='.repeat(40));
              
              if (response.data.usingFallback) {
                console.log('\n⚠️  Using fallback response (no API keys configured)');
                console.log('   Set COHERE_API_KEY or OPENAI_API_KEY in .env.local to enable real AI');
              } else {
                console.log('\n✅ Using real AI API response!');
              }
            }
          } else {
            console.log('❌ API response indicates failure');
            console.log(`   Error: ${response.error}`);
          }
        } catch (e) {
          console.log('❌ Could not parse API response as JSON');
          console.log(`   Response: ${data.substring(0, 200)}`);
        }
        
        console.log('\n' + '='.repeat(50));
        console.log('\n✅ Connection test completed!\n');
        process.exit(0);
      } else {
        console.log(`❌ Server returned status ${res.statusCode}`);
        console.log(`   Response: ${data.substring(0, 200)}`);
        process.exit(1);
      }
    });
  });

  req.on('error', (e) => {
    console.log('❌ Cannot connect to server!');
    console.log(`   Error: ${e.message}`);
    console.log('\n   Make sure:');
    console.log('   1. You\'ve run "npm install"');
    console.log('   2. The dev server is running: npm run dev');
    console.log('   3. Server is running on http://localhost:3000\n');
    process.exit(1);
  });

  req.on('timeout', () => {
    console.log('❌ Server request timed out!');
    console.log('   Make sure the dev server is running: npm run dev\n');
    req.destroy();
    process.exit(1);
  });

  req.write(postData);
  req.end();
};

// Wait a moment then run test
console.log('⏳ Attempting connection...\n');
setTimeout(testRequest, 1000);
