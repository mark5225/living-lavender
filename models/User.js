// models/user.js
import { connectDB } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';

// User model with methods for database operations
class User {
  // Find user by ID
  static async findById(id) {
    try {
      const db = await connectDB();
      const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
      return user;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      return null;
    }
  }

  // Find user by email
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

  // Create new user
  static async create(userData) {
    try {
      const db = await connectDB();
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      // Create user object with membership type
      const newUser = {
        email: userData.email.toLowerCase(),
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        createdAt: new Date(),
        updatedAt: new Date(),
        role: 'user', // Default role
        membershipType: userData.membershipType || 'basic', // Default to basic
        membershipExpires: null, // For premium memberships
        profile: {
          birthdate: null,
          gender: null,
          location: null,
          bio: null,
          interests: [],
          photos: [],
          occupation: null,
          education: null,
          preferences: {
            lookingFor: [],
            ageRange: { min: 18, max: 50 },
            distance: 50,
            relationshipType: null
          }
        },
        settings: {
          emailNotifications: true,
          profileVisibility: 'public'
        },
        stats: {
          profileViews: 0,
          totalMatches: 0,
          lastActive: new Date()
        }
      };
      
      // Insert user into database
      const result = await db.collection('users').insertOne(newUser);
      
      // Return created user without password
      const { password, ...userWithoutPassword } = newUser;
      userWithoutPassword._id = result.insertedId;
      
      return userWithoutPassword;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Create demo user
  static async createDemoUser() {
    try {
      const db = await connectDB();
      
      // Generate random demo data
      const gender = Math.random() > 0.5 ? 'male' : 'female';
      const firstName = gender === 'male' 
        ? ['James', 'John', 'Robert', 'Michael', 'William'][Math.floor(Math.random() * 5)]
        : ['Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth'][Math.floor(Math.random() * 5)];
      
      const lastName = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'][Math.floor(Math.random() * 5)];
      
      // Random age between 21 and 45
      const age = 21 + Math.floor(Math.random() * 25);
      const today = new Date();
      const birthYear = today.getFullYear() - age;
      const birthMonth = Math.floor(Math.random() * 12) + 1;
      const birthDay = Math.floor(Math.random() * 28) + 1;
      const birthdate = `${birthYear}-${birthMonth.toString().padStart(2, '0')}-${birthDay.toString().padStart(2, '0')}`;
      
      // Random location
      const locations = ['New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ', 
                     'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA', 'Dallas, TX', 'San Jose, CA'];
      const location = locations[Math.floor(Math.random() * locations.length)];
      
      // Random interests (3-6 interests)
      const allInterests = [
        'Travel', 'Reading', 'Fitness', 'Cooking', 'Photography', 'Music', 'Movies', 'Art', 'Dance', 'Hiking', 
        'Yoga', 'Technology', 'Gaming', 'Sports', 'Fashion', 'Writing', 'Volunteering', 'Food', 'Animals', 'Spirituality'
      ];
      
      const interestCount = 3 + Math.floor(Math.random() * 4);
      const shuffledInterests = [...allInterests].sort(() => 0.5 - Math.random());
      const selectedInterests = shuffledInterests.slice(0, interestCount);
      
      // Random bio templates
      const bioTemplates = [
        `Love exploring new ${selectedInterests[0].toLowerCase()} spots and enjoying ${selectedInterests[1].toLowerCase()} in my free time.`,
        `Passionate about ${selectedInterests[0].toLowerCase()} and ${selectedInterests[1].toLowerCase()}. Looking for someone to share adventures with.`,
        `${selectedInterests[0]} enthusiast who enjoys ${selectedInterests[1].toLowerCase()} on weekends. Let's chat!`,
        `When I'm not working, you'll find me doing ${selectedInterests[0].toLowerCase()} or exploring ${selectedInterests[1].toLowerCase()}.`,
        `Life is too short not to enjoy ${selectedInterests[0].toLowerCase()}! Also into ${selectedInterests[1].toLowerCase()} and ${selectedInterests[2].toLowerCase()}.`
      ];
      
      const bio = bioTemplates[Math.floor(Math.random() * bioTemplates.length)];
      
      // Create user object
      const demoUser = {
        email: `demo_${Date.now()}@example.com`, // Unique email
        password: await bcrypt.hash('demopassword', 10),
        firstName,
        lastName,
        createdAt: new Date(),
        updatedAt: new Date(),
        role: 'user',
        membershipType: 'demo', // Mark as demo account
        membershipExpires: null,
        profile: {
          birthdate,
          gender,
          location,
          bio,
          interests: selectedInterests,
          photos: [], // Demo photos would be generated separately
          occupation: gender === 'male' 
            ? ['Software Engineer', 'Teacher', 'Marketing Manager', 'Doctor', 'Graphic Designer'][Math.floor(Math.random() * 5)]
            : ['Nurse', 'Teacher', 'Marketing Specialist', 'Designer', 'Accountant'][Math.floor(Math.random() * 5)],
          education: educationOptions[Math.floor(Math.random() * educationOptions.length)],
          preferences: {
            lookingFor: gender === 'male' ? ['Female'] : ['Male'],
            ageRange: { 
              min: Math.max(18, age - 5), 
              max: age + 5 
            },
            distance: 25 + Math.floor(Math.random() * 50),
            relationshipType: relationshipOptions[Math.floor(Math.random() * relationshipOptions.length)]
          }
        },
        settings: {
          emailNotifications: false, // No notifications for demo accounts
          profileVisibility: 'demo' // Special visibility for demo accounts
        },
        stats: {
          profileViews: Math.floor(Math.random() * 100),
          totalMatches: Math.floor(Math.random() * 20),
          lastActive: new Date()
        },
        isDemo: true // Flag to easily identify demo accounts
      };
      
      // Insert demo user into database
      const result = await db.collection('users').insertOne(demoUser);
      
      // Return created user without password
      const { password, ...userWithoutPassword } = demoUser;
      userWithoutPassword._id = result.insertedId;
      
      return userWithoutPassword;
    } catch (error) {
      console.error('Error creating demo user:', error);
      throw error;
    }
  }

  // Create multiple demo users
  static async createDemoUsers(count) {
    try {
      const demoUsers = [];
      
      for (let i = 0; i < count; i++) {
        const demoUser = await User.createDemoUser();
        demoUsers.push(demoUser);
      }
      
      return demoUsers;
    } catch (error) {
      console.error('Error creating multiple demo users:', error);
      throw error;
    }
  }

  // Update user profile
  static async updateProfile(userId, profileData) {
    try {
      const db = await connectDB();
      
      // Build update object
      const updateData = {
        updatedAt: new Date()
      };
      
      // Update profile fields if provided
      if (profileData) {
        updateData['profile'] = profileData;
      }
      
      // Update user in database
      const result = await db.collection('users').updateOne(
        { _id: new ObjectId(userId) },
        { $set: updateData }
      );
      
      return result.modifiedCount > 0;
    } catch (error) {
      console.error('Error updating user profile:', error);
      return false;
    }
  }

  // Update membership type
  static async updateMembership(userId, membershipType, expiryDate = null) {
    try {
      const db = await connectDB();
      
      const updateData = {
        membershipType,
        updatedAt: new Date()
      };
      
      if (expiryDate) {
        updateData.membershipExpires = new Date(expiryDate);
      } else if (membershipType !== 'premium') {
        // Clear expiry date for non-premium memberships
        updateData.membershipExpires = null;
      }
      
      const result = await db.collection('users').updateOne(
        { _id: new ObjectId(userId) },
        { $set: updateData }
      );
      
      return result.modifiedCount > 0;
    } catch (error) {
      console.error('Error updating user membership:', error);
      return false;
    }
  }

  // Delete user
  static async delete(userId) {
    try {
      const db = await connectDB();
      
      const result = await db.collection('users').deleteOne({ _id: new ObjectId(userId) });
      
      return result.deletedCount > 0;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }

  // Get all users (for admin)
  static async getAll(limit = 100, skip = 0) {
    try {
      const db = await connectDB();
      
      const users = await db.collection('users')
        .find({})
        .project({ password: 0 }) // Exclude password
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray();
      
      return users;
    } catch (error) {
      console.error('Error getting all users:', error);
      return [];
    }
  }
}

// Constants for membership types
export const MEMBERSHIP_TYPES = {
  BASIC: 'basic',
  PREMIUM: 'premium',
  DEMO: 'demo'
};

// Constants for education options
export const educationOptions = [
  "High School", "Some College", "Associate's Degree", 
  "Bachelor's Degree", "Master's Degree", "PhD", "Trade School"
];

// Constants for relationship types
export const relationshipOptions = [
  "Long-term relationship",
  "Short-term relationship",
  "Casual dating",
  "Friendship",
  "Not sure yet"
];

export default User;