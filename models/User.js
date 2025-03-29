// models/user.js
import { connectDB } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

class User {
  /**
   * Find a user by email
   * @param {string} email 
   * @returns {Promise<Object|null>} User object or null
   */
  static async findByEmail(email) {
    try {
      const db = await connectDB();
      return await db.collection('users').findOne({ email: email.toLowerCase() });
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  /**
   * Find a user by ID
   * @param {string} id 
   * @returns {Promise<Object|null>} User object or null
   */
  static async findById(id) {
    try {
      const db = await connectDB();
      return await db.collection('users').findOne({ _id: new ObjectId(id) });
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  }

  /**
   * Create a new user
   * @param {Object} userData 
   * @returns {Promise<Object>} Created user object
   */
  static async create(userData) {
    try {
      const db = await connectDB();
      
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // Prepare user data
      const newUser = {
        email: userData.email.toLowerCase(),
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        createdAt: new Date(),
        profile: {
          birthdate: userData.birthdate || null,
          gender: userData.gender || null,
          location: userData.location || null,
          bio: userData.bio || null,
          occupation: userData.occupation || null,
          education: userData.education || null,
          interests: userData.interests || [],
          photos: userData.photos || [],
          preferences: {
            lookingFor: userData.lookingFor || [],
            ageRange: userData.ageRange || { min: 18, max: 50 },
            distance: userData.distance || 50,
            relationshipType: userData.relationshipType || null
          }
        }
      };
      
      // Insert user into database
      const result = await db.collection('users').insertOne(newUser);
      
      // Return created user
      return { 
        ...newUser, 
        _id: result.insertedId 
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   * @param {string} userId 
   * @param {Object} profileData 
   * @returns {Promise<boolean>} Success status
   */
  static async updateProfile(userId, profileData) {
    try {
      const db = await connectDB();
      
      // Update profile fields
      const result = await db.collection('users').updateOne(
        { _id: new ObjectId(userId) },
        { $set: { profile: profileData } }
      );
      
      return result.modifiedCount > 0;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  /**
   * Update user password
   * @param {string} userId 
   * @param {string} newPassword 
   * @returns {Promise<boolean>} Success status
   */
  static async updatePassword(userId, newPassword) {
    try {
      const db = await connectDB();
      
      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      // Update password
      const result = await db.collection('users').updateOne(
        { _id: new ObjectId(userId) },
        { $set: { password: hashedPassword } }
      );
      
      return result.modifiedCount > 0;
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  }
}

export default User;