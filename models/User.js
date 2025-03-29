import { ObjectId } from 'mongodb';
import { connectDB } from '../lib/mongodb';
import bcrypt from 'bcryptjs';

class User {
  static async findById(id) {
    try {
      const { db } = await connectDB();
      const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
      return user;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      return null;
    }
  }

  static async findByEmail(email) {
    try {
      const { db } = await connectDB();
      const user = await db.collection('users').findOne({ email: email.toLowerCase() });
      return user;
    } catch (error) {
      console.error('Error finding user by email:', error);
      return null;
    }
  }

  static async create(userData) {
    try {
      const { db } = await connectDB();
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      // Create new user object
      const newUser = {
        email: userData.email.toLowerCase(),
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        createdAt: new Date(),
        profile: {
          photos: [],
          preferences: {
            lookingFor: [],
            ageRange: { min: 18, max: 50 },
            distance: 50
          }
        }
      };
      
      // Insert into database
      const result = await db.collection('users').insertOne(newUser);
      
      // Return the created user with the generated ID
      return { ...newUser, _id: result.insertedId };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async updateProfile(userId, profileData) {
    try {
      const { db } = await connectDB();
      
      // Prepare update object
      const updateData = {};
      
      // Handle different profile properties
      if (profileData.firstName) updateData.firstName = profileData.firstName;
      if (profileData.lastName) updateData.lastName = profileData.lastName;
      
      // Update profile object properties
      if (profileData.birthdate) updateData['profile.birthdate'] = profileData.birthdate;
      if (profileData.gender) updateData['profile.gender'] = profileData.gender;
      if (profileData.location) updateData['profile.location'] = profileData.location;
      if (profileData.bio) updateData['profile.bio'] = profileData.bio;
      if (profileData.occupation) updateData['profile.occupation'] = profileData.occupation;
      if (profileData.education) updateData['profile.education'] = profileData.education;
      if (profileData.interests) updateData['profile.interests'] = profileData.interests;
      
      // Update preferences if provided
      if (profileData.preferences) {
        if (profileData.preferences.lookingFor) updateData['profile.preferences.lookingFor'] = profileData.preferences.lookingFor;
        if (profileData.preferences.ageRange) updateData['profile.preferences.ageRange'] = profileData.preferences.ageRange;
        if (profileData.preferences.distance) updateData['profile.preferences.distance'] = profileData.preferences.distance;
        if (profileData.preferences.relationshipType) updateData['profile.preferences.relationshipType'] = profileData.preferences.relationshipType;
      }
      
      // Update photos if provided
      if (profileData.photos) updateData['profile.photos'] = profileData.photos;
      
      // Update user
      const result = await db.collection('users').updateOne(
        { _id: new ObjectId(userId) },
        { $set: updateData }
      );
      
      return result.modifiedCount > 0;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    }
  }
}

export default User;