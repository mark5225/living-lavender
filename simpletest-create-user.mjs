// simpletest-create-user.mjs
import { connectDB } from './lib/mongodb.js';
import bcrypt from 'bcryptjs';

async function createTestUser() {
  try {
    console.log('Creating test user...');
    
    // Connect to the database
    const db = await connectDB();
    console.log('Connected to MongoDB');
    
    // Hash password
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    // Create a test user
    const testUser = {
      email: 'test@example.com',
      password: hashedPassword,
      firstName: 'Test',
      lastName: 'User',
      createdAt: new Date(),
      profile: {
        birthdate: null,
        gender: 'male',
        location: 'Test City',
        bio: 'This is a test user',
        occupation: 'Tester',
        education: 'Test University',
        interests: ['Testing'],
        photos: [],
        preferences: {
          lookingFor: ['female'],
          ageRange: { min: 18, max: 50 },
          distance: 50,
          relationshipType: 'Long-term relationship'
        }
      }
    };
    
    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email: 'test@example.com' });
    
    if (existingUser) {
      console.log('User already exists');
    } else {
      const result = await db.collection('users').insertOne(testUser);
      console.log('Test user created with ID:', result.insertedId);
    }
    
    console.log('Test completed successfully');
  } catch (error) {
    console.error('Error during test:', error);
  } finally {
    process.exit(0);
  }
}

createTestUser();