// test-db.mjs
import dotenv from 'dotenv';
import { connectDB, disconnectDB } from './lib/mongodb.js';
import User from './models/user.js';

dotenv.config();

async function testDatabaseConnection() {
  try {
    console.log('Testing MongoDB connection...');
    
    // Test database connection
    const db = await connectDB();
    console.log('✅ Successfully connected to MongoDB');
    
    // Test collection access
    const collections = await db.listCollections().toArray();
    console.log(`Found ${collections.length} collections:`);
    collections.forEach(col => console.log(`- ${col.name}`));
    
    // Count users
    const userCount = await db.collection('users').countDocuments();
    console.log(`Total users in database: ${userCount}`);
    
    // Create a test user
    const testUserEmail = `test-${Date.now()}@example.com`;
    console.log(`Creating test user with email: ${testUserEmail}`);
    
    const testUser = await User.create({
      email: testUserEmail,
      password: 'password123',
      firstName: 'Test',
      lastName: 'User'
    });
    
    console.log('✅ Test user created successfully:', testUser._id.toString());
    
    // Find the user we just created
    console.log('Looking up test user by email...');
    const foundUser = await User.findByEmail(testUserEmail);
    
    if (foundUser) {
      console.log('✅ Test user found by email:', foundUser._id.toString());
    } else {
      console.log('❌ Failed to find test user by email!');
    }
    
    // Delete the test user
    await db.collection('users').deleteOne({ _id: testUser._id });
    console.log('✅ Test user deleted');
    
    // Close the connection
    await disconnectDB();
    console.log('Connection closed');
    
    console.log('All tests completed successfully! Your MongoDB setup is working properly.');
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

// Run the test
testDatabaseConnection();