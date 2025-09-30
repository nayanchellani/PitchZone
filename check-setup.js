// Complete setup checker for PitchZone
const fs = require('fs');
const path = require('path');

console.log('🔍 PitchZone Complete Setup Check\n');

// Check directory structure
const checks = {
  directories: [
    { path: './server', name: 'Server directory' },
    { path: './client', name: 'Client directory' },
    { path: './server/node_modules', name: 'Server dependencies' },
    { path: './client/node_modules', name: 'Client dependencies' }
  ],
  serverFiles: [
    { path: './server/package.json', name: 'Server package.json' },
    { path: './server/server.js', name: 'Server main file' },
    { path: './server/.env', name: 'Environment variables' },
    { path: './server/routes/auth.js', name: 'Auth routes' },
    { path: './server/models/User.js', name: 'User model' }
  ],
  clientFiles: [
    { path: './client/package.json', name: 'Client package.json' },
    { path: './client/src/App.jsx', name: 'Main App component' },
    { path: './client/src/App.css', name: 'Main CSS file' },
    { path: './client/src/config/api.js', name: 'API configuration' },
    { path: './client/src/Pages/Login.jsx', name: 'Login component' }
  ]
};

// Check directories
console.log('📁 Directory Structure:');
checks.directories.forEach(check => {
  const exists = fs.existsSync(check.path);
  console.log(`   ${check.name}: ${exists ? '✅' : '❌'}`);
  if (!exists && check.path.includes('node_modules')) {
    console.log(`      ⚠️  Run: cd ${check.path.includes('server') ? 'server' : 'client'} && npm install`);
  }
});

// Check server files
console.log('\n🖥️  Server Files:');
checks.serverFiles.forEach(check => {
  const exists = fs.existsSync(check.path);
  console.log(`   ${check.name}: ${exists ? '✅' : '❌'}`);
});

// Check client files
console.log('\n💻 Client Files:');
checks.clientFiles.forEach(check => {
  const exists = fs.existsSync(check.path);
  console.log(`   ${check.name}: ${exists ? '✅' : '❌'}`);
});

// Check API configuration
if (fs.existsSync('./client/src/config/api.js')) {
  const apiConfig = fs.readFileSync('./client/src/config/api.js', 'utf8');
  console.log('\n🔧 API Configuration:');
  
  if (apiConfig.includes('localhost:5000')) {
    console.log('   Port configuration: ✅ (localhost:5000)');
  } else if (apiConfig.includes('localhost:5001')) {
    console.log('   Port configuration: ❌ (Should be localhost:5000, not 5001)');
  } else {
    console.log('   Port configuration: ⚠️  (Check manually)');
  }
  
  console.log('   Login endpoint:', apiConfig.includes('login') ? '✅' : '❌');
  console.log('   Register endpoint:', apiConfig.includes('register') ? '✅' : '❌');
}

// Check environment variables
if (fs.existsSync('./server/.env')) {
  const envContent = fs.readFileSync('./server/.env', 'utf8');
  console.log('\n🌍 Environment Variables:');
  console.log('   MONGO_URI:', envContent.includes('MONGO_URI') ? '✅' : '❌');
  console.log('   JWT_SECRET:', envContent.includes('JWT_SECRET') ? '✅' : '❌');
  console.log('   PORT=5000:', envContent.includes('PORT=5000') ? '✅' : '❌');
}

// Check CSS classes in components
if (fs.existsSync('./client/src/Pages/Login.jsx')) {
  const loginContent = fs.readFileSync('./client/src/Pages/Login.jsx', 'utf8');
  console.log('\n🎨 CSS Classes Check:');
  console.log('   Login button classes:', loginContent.includes('auth-button') ? '✅' : '❌');
  console.log('   API endpoints import:', loginContent.includes('API_ENDPOINTS') ? '✅' : '❌');
}

console.log('\n🚀 Next Steps:');
console.log('1. Fix any ❌ items above');
console.log('2. Start backend: cd server && npm run dev');
console.log('3. Test backend: http://localhost:5000 (should show JSON)');
console.log('4. Start frontend: cd client && npm run dev');
console.log('5. Test app: http://localhost:5173');

console.log('\n📋 Quick Commands:');
console.log('Backend: cd server && npm install && npm run create-admin && npm run dev');
console.log('Frontend: cd client && npm install && npm run dev');

// Test network connectivity
console.log('\n🌐 Testing Network...');
const net = require('net');

function testPort(port, name) {
  const server = net.createServer();
  server.listen(port, () => {
    console.log(`   ${name} (${port}): ✅ Available`);
    server.close();
  });
  server.on('error', () => {
    console.log(`   ${name} (${port}): ❌ In use (this is OK if server is running)`);
  });
}

testPort(5000, 'Backend port');
testPort(5173, 'Frontend port');