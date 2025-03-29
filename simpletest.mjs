// simpletest.mjs
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { connectDB, disconnectDB } from './lib/mongodb.js';

// Load environment variables
dotenv.config();

async function testConnection() {
  try {
    console.log('Environment check:');
    console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
    
    console.log('Testing connection...');
    const db = await connectDB();
    console.log('✅ Connected successfully!');
    console.log('Database name:', db.databaseName);
    await disconnectDB();
  } catch (error) {
    console.error('❌ Connection failed:', error);
  }
}

testConnection();