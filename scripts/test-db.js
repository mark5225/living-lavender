// scripts/test-db.js

require('dotenv').config(); // Ensure this is present
console.log("MONGODB_URI:", process.env.MONGODB_URI); // Check if loaded

const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

(async () => {
  if (!uri) {
    console.error("MONGODB_URI environment variable is not set");
    process.exit(1);
  }

  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log("Connected successfully to MongoDB");
    const db = client.db(dbName);
    console.log("Database:", db.databaseName);
    await client.close();
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
})();
