// scripts/test-db.js
const { MongoClient } = require('mongodb');

async function testConnection() {
  // Connection URI from environment variable
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('MONGODB_URI environment variable is not set');
    process.exit(1);
  }
  
  console.log('Attempting to connect to MongoDB...');
  
  // Create a new MongoClient
  const client = new MongoClient(uri);
  
  try {
    // Connect to the MongoDB cluster
    await client.connect();
    console.log('Successfully connected to MongoDB!');
    
    // Get database name from env or use default
    const dbName = process.env.MONGODB_DB || 'living-lavender';
    const db = client.db(dbName);
    
    // List collections to verify connection
    const collections = await db.listCollections().toArray();
    console.log(`\nCollections in "${dbName}" database:`);
    
    if (collections.length === 0) {
      console.log('No collections found. This might be a new database.');
    } else {
      collections.forEach(collection => {
        console.log(`- ${collection.name}`);
      });
    }
    
    // Check users collection
    const usersCount = await db.collection('users').countDocuments();
    console.log(`\nUsers collection has ${usersCount} documents`);
    
    console.log('\nDatabase connection test completed successfully!');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  } finally {
    // Close the connection
    await client.close();
  }
}

testConnection().catch(console.error);