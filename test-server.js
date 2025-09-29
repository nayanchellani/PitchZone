// Simple test script to check if the server is working
const fetch = require('node-fetch');

async function testServer() {
  try {
    console.log('Testing server connection...');
    
    // Test basic server endpoint
    const response = await fetch('http://localhost:5000/');
    const data = await response.json();
    
    console.log('✅ Server is running!');
    console.log('Response:', data);
    
    // Test API endpoints
    const apiTest = await fetch('http://localhost:5000/api/pitches');
    console.log('✅ API endpoints accessible!');
    console.log('Status:', apiTest.status);
    
  } catch (error) {
    console.log('❌ Server connection failed:');
    console.log('Error:', error.message);
    console.log('\nMake sure to:');
    console.log('1. cd server');
    console.log('2. npm install');
    console.log('3. npm run dev');
  }
}

testServer();