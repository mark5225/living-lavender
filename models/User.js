// models/user.js
import { connectDB } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

class User {
  /**
   * Find a user by ID
   * @param {string} id - User ID
   * @returns {Promise<Object|null>} User object or null if not found
   */
  static async findById(id) {
    try {
      const db = await connectDB();
      
      // Convert string ID to ObjectId
      const objectId = typeof id === 'string' ? new ObjectId(id) : id;
      
      const user = await db.collection('users').findOne({ _id: objectId });
      return user;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      return null;
    }
  }
  
  /**
   * Find a user by email
   * @param {string} email - User email
   * @returns {Promise<Object|null>} User object or null if not found
   */
  static async findByEmail(email) {
    try {
      const db = await connectDB();
      const user = await db.collection('users').findOne({ email: email.toLowerCase() });
      return user;
    } catch (error) {
      console.error('Error finding user by email:', error);
      return null;
    }
  }
  
  /**
   * Create a new user
   * @param {Object} userData - User data including email, password, firstName, lastName
   * @returns {Promise<Object>} Created user object
   */
  static async create(userData) {
    try {
      const db = await connectDB();
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      // Create user object
      const newUser = {
        email: userData.email.toLowerCase(),
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: 'user', // Default role
        membershipType: 'basic', // Default membership type
        createdAt: new Date(),
        updatedAt: new Date(),
        profile: {} // Empty profile by default
      };
      
      // Insert into database
      const result = await db.collection('users').insertOne(newUser);
      
      // Return user with ID
      return { 
        _id: result.insertedId, 
        ...newUser 
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }
  
  /**
   * Update user profile
   * @param {string} userId - User ID
   * @param {Object} profileData - Profile data to update
   * @returns {Promise<boolean>} Success status
   */
  static async updateProfile(userId, profileData) {
    try {
      const db = await connectDB();
      
      // Convert string ID to ObjectId
      const objectId = typeof userId === 'string' ? new ObjectId(userId) : userId;
      
      // Update user profile
      const result = await db.collection('users').updateOne(
        { _id: objectId },
        { 
          $set: { 
            profile: profileData,
            updatedAt: new Date()
          } 
        }
      );
      
      return result.modifiedCount > 0;
    } catch (error) {
      console.error('Error updating user profile:', error);
      return false;
    }
  }
  
  /**
   * Create demo users with random data
   * @param {number} count - Number of demo users to create
   * @returns {Promise<Array>} Array of created demo users
   */
  static async createDemoUsers(count) {
    try {
      const db = await connectDB();
      
      // Sample data for generating demo users
      const firstNames = ['John', 'Emma', 'Michael', 'Olivia', 'William', 'Sophia', 'James', 'Ava', 'Robert', 'Mia'];
      const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
      const locations = ['New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ', 'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA', 'Dallas, TX', 'San Jose, CA'];
      const interests = ['Hiking', 'Cooking', 'Reading', 'Travel', 'Photography', 'Music', 'Movies', 'Art', 'Sports', 'Yoga', 'Dancing', 'Gaming', 'Fitness', 'Wine Tasting', 'Writing', 'Gardening', 'Technology', 'Fashion', 'Pets', 'Volunteering'];
      const genders = ['male', 'female', 'non-binary'];
      const lookingFor = [['male'], ['female'], ['male', 'female'], ['male', 'female', 'non-binary']];
      const relationshipTypes = ['Long-term relationship', 'Short-term relationship', 'Casual dating', 'Friendship', 'Not sure yet'];
      
      // Generate random date of birth (25-45 years old)
      const getRandomBirthdate = () => {
        const today = new Date();
        const minAge = 25;
        const maxAge = 45;
        const age = Math.floor(Math.random() * (maxAge - minAge + 1)) + minAge;
        
        const year = today.getFullYear() - age;
        const month = Math.floor(Math.random() * 12) + 1;
        const day = Math.floor(Math.random() * 28) + 1; // Avoid edge cases with month lengths
        
        return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      };
      
      // Generate random interests (3-6 interests)
      const getRandomInterests = () => {
        const shuffled = [...interests].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, Math.floor(Math.random() * 4) + 3);
      };
      
      const getRandomLookingFor = () => {
        return lookingFor[Math.floor(Math.random() * lookingFor.length)];
      };
      
      // Create hash for demo password (same for all demo users)
      const salt = await bcrypt.genSalt(10);
      const demoPassword = await bcrypt.hash('demo123', salt);
      
      // Create demo users
      const demoUsers = [];
      
      for (let i = 0; i < count; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const gender = genders[Math.floor(Math.random() * genders.length)];
        
        const demoUser = {
          email: `demo${Date.now()}-${i}@example.com`,
          password: demoPassword,
          firstName,
          lastName,
          role: 'user',
          membershipType: 'demo', // Mark as demo user
          createdAt: new Date(),
          updatedAt: new Date(),
          profile: {
            birthdate: getRandomBirthdate(),
            gender,
            location: locations[Math.floor(Math.random() * locations.length)],
            bio: `Hi, I'm ${firstName}! This is a demo profile generated for testing purposes.`,
            interests: getRandomInterests(),
            occupation: ['Engineer', 'Designer', 'Teacher', 'Doctor', 'Artist', 'Writer', 'Entrepreneur'][Math.floor(Math.random() * 7)],
            education: ['High School', 'Bachelor\'s Degree', 'Master\'s Degree', 'PhD'][Math.floor(Math.random() * 4)],
            lookingFor: getRandomLookingFor(),
            ageRange: { 
              min: 25 + Math.floor(Math.random() * 10), 
              max: 35 + Math.floor(Math.random() * 10) 
            },
            distance: 10 + Math.floor(Math.random() * 90),
            relationshipType: relationshipTypes[Math.floor(Math.random() * relationshipTypes.length)],
            photos: [
              {
                url: `https://placehold.co/400x600/7464a0/ffffff?text=${firstName}`,
                isMain: true
              }
            ]
          }
        };
        
        const result = await db.collection('users').insertOne(demoUser);
        demoUsers.push({ _id: result.insertedId, ...demoUser });
      }
      
      return demoUsers;
    } catch (error) {
      console.error('Error creating demo users:', error);
      throw error;
    }
  }
}

export default User;