// lib/mongodb.js
import { MongoClient } from 'mongodb';

// Cache the MongoDB connection for better performance
let cachedClient = null;
let cachedDb = null;

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

/**
 * Connect to MongoDB
 * @returns {Promise<object>} MongoDB database instance
 */
export async function connectDB() {
  // If we already have a connection, use it
  if (cachedDb) {
    return cachedDb;
  }

  if (!cachedClient) {
    cachedClient = new MongoClient(process.env.MONGODB_URI);
    await cachedClient.connect();
  }

  const db = cachedClient.db(process.env.MONGODB_DB || 'living-lavender');
  cachedDb = db;
  return db;
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
  }
}