import { MongoClient } from 'mongodb';

// Using environment variables for database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/living-lavender';
const MONGODB_DB = process.env.MONGODB_DB || 'living-lavender';

let cachedClient = null;
let cachedDb = null;

export async function connectDB() {
  // If we already have a connection, use it
  if (cachedClient && cachedDb) {
    return {
      client: cachedClient,
      db: cachedDb,
    };
  }

  // If no connection, create a new one
  if (!global._mongoClientPromise) {
    const client = new MongoClient(MONGODB_URI);
    global._mongoClientPromise = client.connect();
  }

  try {
    const client = await global._mongoClientPromise;
    const db = client.db(MONGODB_DB);
    
    // Cache the client and db connections
    cachedClient = client;
    cachedDb = db;
    
    return { client, db };
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    throw error;
  }
}