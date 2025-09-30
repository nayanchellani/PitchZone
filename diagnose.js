// Diagnostic script to check system status
const fs = require('fs');
const path = require('path');

console.log('🔍 PitchZone System Diagnostic\n');

// Check if we're in the right directory
console.log('📁 Current Directory:', process.cwd());

// Check if server directory exists
const serverExists = fs.existsSync('./server');
const clientExists = fs.existsSync('./client');

console.log('📂 Server directory exists:', serverExists ? '✅' : '❌');
console.log('📂 Client directory exists:', clientExists ? '✅' : '❌');

if (serverExists) {
  // Check server files
  const serverFiles = [
    './server/package.json',
    './server/server.js',
    './server/.env',
    './server/models/User.js',
    './server/models/Pitch.js',
    './server/routes/auth.js',
    './server/routes/pitches.js'
  ];

  console.log('\n📋 Server Files Check:');
  serverFiles.forEach(file => {
    const exists = fs.existsSync(file);
    console.log(`   ${path.basename(file)}: ${exists ? '✅' : '❌'}`);
  });

  // Check .env content
  if (fs.existsSync('./server/.env')) {
    const envContent = fs.readFileSync('./server/.env', 'utf8');
    console.log('\n🔧 Environment Variables:');
    console.log('   MONGO_URI:', envContent.includes('MONGO_URI') ? '✅' : '❌');
    console.log('   JWT_SECRET:', envContent.includes('JWT_SECRET') ? '✅' : '❌');
    console.log('   PORT:', envContent.includes('PORT') ? '✅' : '❌');
  }

  // Check if node_modules exists
  const nodeModulesExists = fs.existsSync('./server/node_modules');
  console.log('\n📦 Dependencies:');
  console.log('   node_modules installed:', nodeModulesExists ? '✅' : '❌');
  
  if (!nodeModulesExists) {
    console.log('   ⚠️  Run: cd server && npm install');
  }
}

if (clientExists) {
  const clientNodeModules = fs.existsSync('./client/node_modules');
  console.log('   client node_modules:', clientNodeModules ? '✅' : '❌');
  
  if (!clientNodeModules) {
    console.log('   ⚠️  Run: cd client && npm install');
  }
}

console.log('\n🚀 Next Steps:');
console.log('1. Make sure MongoDB is running');
console.log('2. cd server && npm install && npm run dev');
console.log('3. cd client && npm install && npm run dev');
console.log('4. Test: http://localhost:5000 (should show JSON)');
console.log('5. Open: http://localhost:5173 (frontend)');

// Test if ports are available
const net = require('net');

function checkPort(port, callback) {
  const server = net.createServer();
  server.listen(port, () => {
    server.once('close', () => callback(true));
    server.close();
  });
  server.on('error', () => callback(false));
}

console.log('\n🔌 Port Availability:');
checkPort(5000, (available) => {
  console.log(`   Port 5000 (backend): ${available ? '✅ Available' : '❌ In Use'}`);
});

checkPort(5173, (available) => {
  console.log(`   Port 5173 (frontend): ${available ? '✅ Available' : '❌ In Use'}`);
});