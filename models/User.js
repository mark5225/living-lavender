// models/User.js
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

// Import using the correct path
import { connectDB } from '@/lib/mongodb';

class User {
  static async findById(id) {
    try {
      const db = await connectDB();
      return await db.collection('users').findOne({ _id: new ObjectId(id) });
    } catch (error) {
      console.error('Error finding user by ID:', error);
      return null;
    }
  }

  static async findByEmail(email) {
    try {
      const db = await connectDB();
      return await db.collection('users').findOne({ email: email.toLowerCase() });
    } catch (error) {
      console.error('Error finding user by email:', error);
      return null;
    }
  }

  static async create(userData) {
    try {
      const db = await connectDB();
      
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // Prepare user object
      const newUser = {
        email: userData.email.toLowerCase(),
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        createdAt: new Date(),
        profile: {
          // Default empty profile
          photos: [],
          interests: [],
          preferences: {
            lookingFor: [],
            ageRange: { min: 18, max: 50 },
            distance: 50
          }
        }
      };
      
      const result = await db.collection('users').insertOne(newUser);
      return { ...newUser, _id: result.insertedId };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async updateProfile(userId, profileData) {
    try {
      const db = await connectDB();
      const result = await db.collection('users').updateOne(
        { _id: new ObjectId(userId) },
        { $set: { profile: profileData } }
      );
      
      return result.modifiedCount > 0;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    }
  }

  static async updateEmail(userId, newEmail) {
    try {
      const db = await connectDB();
      const result = await db.collection('users').updateOne(
        { _id: new ObjectId(userId) },
        { $set: { email: newEmail.toLowerCase() } }
      );
      
      return result.modifiedCount > 0;
    } catch (error) {
      console.error('Error updating email:', error);
      return false;
    }
  }

  static async updatePassword(userId, newPassword) {
    try {
      const db = await connectDB();
      
      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      const result = await db.collection('users').updateOne(
        { _id: new ObjectId(userId) },
        { $set: { password: hashedPassword } }
      );
      
      return result.modifiedCount > 0;
    } catch (error) {
      console.error('Error updating password:', error);
      return false;
    }
  }

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
}

export default User;