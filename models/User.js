import { ObjectId } from 'mongodb';
import { connectDB } from '../lib/mongodb';

class User {
  static async findById(id) {
    const db = await connectDB();
    return db.collection('users').findOne({ _id: new ObjectId(id) });
  }

  static async findByEmail(email) {
    const db = await connectDB();
    return db.collection('users').findOne({ email: email.toLowerCase() });
  }

  static async create(userData) {
    const db = await connectDB();
    const result = await db.collection('users').insertOne({
      ...userData,
      email: userData.email.toLowerCase(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return result.insertedId;
  }

  static async updateProfile(userId, profileData) {
    const db = await connectDB();
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: {
          profile: profileData,
          updatedAt: new Date()
        }
      }
    );
    return result.modifiedCount > 0;
  }
}

export default User;