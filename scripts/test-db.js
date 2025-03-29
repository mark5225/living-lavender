import { connectDB } from '../lib/mongodb';

async function testDbConnection() {
  try {
    const db = await connectDB();
    console.log('Connected to MongoDB successfully!');
    
    // Test a simple query
    const usersCount = await db.collection('users').countDocuments();
    console.log(`Number of users in the database: ${usersCount}`);
    
    console.log('Database connection test completed successfully.');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

testDbConnection();