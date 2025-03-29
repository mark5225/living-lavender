// lib/mongodb.js
import { MongoClient } from 'mongodb';

// Cache the MongoDB connection for better performance
let cachedClient = null;
let cachedDb = null;

/**
 * Connect to MongoDB
 * @returns {Promise<object>} MongoDB database instance
 */
export async function connectDB() {
  if (!process.env.MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable in your .env file');
  }

  // If we already have a connection, use it
  if (cachedDb) {
    return cachedDb;
  }

  try {
    if (!cachedClient) {
      cachedClient = new MongoClient(process.env.MONGODB_URI);
      await cachedClient.connect();
      console.log('Created new connection to MongoDB');
    }

    const db = cachedClient.db(process.env.MONGODB_DB || 'living-lavender');
    cachedDb = db;
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

/**
 * Disconnect from MongoDB
 * @returns {Promise<void>}
 */
export async function disconnectDB() {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
    cachedDb = null;
    console.log('Disconnected from MongoDB');
  }
}