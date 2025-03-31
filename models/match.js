// models/match.js
import { ObjectId } from 'mongodb';
import { connectDB } from '@/lib/mongodb';

class Match {
  /**
   * Find a match by ID
   * @param {string} matchId Match ID
   * @returns {Promise<Object|null>} Match object or null if not found
   */
  static async findById(matchId) {
    try {
      const db = await connectDB();
      const match = await db.collection('matches').findOne({
        _id: new ObjectId(matchId)
      });
      
      return match;
    } catch (error) {
      console.error('Error finding match by ID:', error);
      return null;
    }
  }
  
  /**
   * Get matches for a user
   * @param {string} userId User ID
   * @returns {Promise<Array>} Array of match objects
   */
  static async findByUser(userId) {
    try {
      const db = await connectDB();
      
      // Find matches where this user is a participant
      const matches = await db.collection('matches')
        .find({
          users: { $in: [new ObjectId(userId)] }
        })
        .sort({ createdAt: -1 })
        .toArray();
      
      return matches;
    } catch (error) {
      console.error('Error finding matches for user:', error);
      return [];
    }
  }
  
  /**
   * Add a message to a match
   * @param {string} matchId Match ID
   * @param {string} senderId Sender user ID
   * @param {string} content Message content
   * @returns {Promise<Object|null>} Updated match or null if failed
   */
  static async addMessage(matchId, senderId, content) {
    try {
      const db = await connectDB();
      
      // Validate the match exists and user is a participant
      const match = await this.findById(matchId);
      
      if (!match) {
        throw new Error('Match not found');
      }
      
      // Check if sender is part of the match
      const isSenderInMatch = match.users.some(id => 
        id.toString() === senderId.toString()
      );
      
      if (!isSenderInMatch) {
        throw new Error('User is not part of this match');
      }
      
      // Create message object
      const message = {
        id: new ObjectId().toString(),
        senderId: new ObjectId(senderId),
        content,
        timestamp: new Date(),
        isRead: false
      };
      
      // Add message to match
      const result = await db.collection('matches').updateOne(
        { _id: new ObjectId(matchId) },
        { $push: { messages: message } }
      );
      
      if (result.modifiedCount === 0) {
        throw new Error('Failed to add message');
      }
      
      // Return updated match
      return await this.findById(matchId);
    } catch (error) {
      console.error('Error adding message:', error);
      return null;
    }
  }
  
  /**
   * Mark all messages in a match as read for a user
   * @param {string} matchId Match ID
   * @param {string} userId User ID of the reader
   * @returns {Promise<boolean>} Success status
   */
  static async markMessagesAsRead(matchId, userId) {
    try {
      const db = await connectDB();
      
      // Mark all messages from other users as read
      const result = await db.collection('matches').updateOne(
        { _id: new ObjectId(matchId) },
        { 
          $set: { 
            'messages.$[elem].isRead': true 
          } 
        },
        { 
          arrayFilters: [
            { 'elem.senderId': { $ne: new ObjectId(userId) } }
          ]
        }
      );
      
      return result.modifiedCount > 0;
    } catch (error) {
      console.error('Error marking messages as read:', error);
      return false;
    }
  }
}

export default Match;