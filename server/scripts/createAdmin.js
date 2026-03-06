const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');


dotenv.config();

const createAdminUser = async () => {
  try {

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');


    const existingAdmin = await User.findOne({ role: 'admin' });

    if (existingAdmin) {
      console.log('Admin user already exists:');
      console.log('Email:', existingAdmin.email);
      console.log('Username:', existingAdmin.username);
      return;
    }


    const adminUser = new User({
      username: 'admin',
      email: 'admin@pitchzone.com',
      password: 'admin123',
      role: 'admin',
      fullName: 'System Administrator'
    });

    await adminUser.save();

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@pitchzone.com');
    console.log('🔑 Password: admin123');
    console.log('⚠️  Please change the password after first login!');

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  } finally {

    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  }
};


createAdminUser();