// simpletest-user.mjs
import { connectDB } from './lib/mongodb.js';
import { ObjectId } from 'mongodb';

async function testUserCollection() {
  try {
    console.log('Testing User collection...');
    
    // Connect to the database
    const db = await connectDB();
    console.log('Connected to MongoDB');
    
    // Check if users collection exists
    const collections = await db.listCollections().toArray();
    const hasUsersCollection = collections.some(col => col.name === 'users');
    
    console.log(`Users collection exists: ${hasUsersCollection}`);
    
    if (hasUsersCollection) {
      // Count documents in the users collection
      const count = await db.collection('users').countDocuments();
      console.log(`Number of users in collection: ${count}`);
      
      // Get a sample user (first in the collection)
      if (count > 0) {
        const sampleUser = await db.collection('users').findOne({});
        console.log('Sample user (without password):', { 
          ...sampleUser, 
          password: sampleUser.password ? '[REDACTED]' : undefined 
        });
      }
    } else {
      // Create a test user to check write access
      console.log('Creating a test user...');
      const testUser = {
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        password: 'hashed_password_would_go_here',
        createdAt: new Date()
      };
      
      const result = await db.collection('users').insertOne(testUser);
      console.log('Test user created with ID:', result.insertedId);
    }
    
    console.log('Test completed successfully');
  } catch (error) {
    console.error('Error during test:', error);
  } finally {
    // Close the connection
    process.exit(0);
  }
}

testUserCollection();