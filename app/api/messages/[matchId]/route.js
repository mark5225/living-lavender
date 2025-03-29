import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Get messages for a specific match
export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { matchId } = params;
    
    if (!matchId) {
      return NextResponse.json(
        { message: 'Match ID is required' },
        { status: 400 }
      );
    }
    
    const userId = new ObjectId(session.user.id);
    const db = await connectDB();
    
    // Find the match and verify the user is part of it
    const match = await db.collection('matches').findOne({
      _id: new ObjectId(matchId),
      users: userId
    });
    
    if (!match) {
      return NextResponse.json(
        { message: 'Match not found or you are not a participant' },
        { status: 404 }
      );
    }
    
    // Get the other user's details
    const otherUserId = match.users.find(id => !id.equals(userId));
    const otherUser = await db.collection('users').findOne(
      { _id: otherUserId },
      { projection: { firstName: 1, lastName: 1, 'profile.photos': 1 } }
    );
    
    // Mark unread messages as read
    if (match.messages && match.messages.length > 0) {
      await db.collection('matches').updateOne(
        { 
          _id: new ObjectId(matchId),
          'messages.senderId': { $ne: userId },
          'messages.isRead': false
        },
        { $set: { 'messages.$[elem].isRead': true } },
        { 
          arrayFilters: [
            { 'elem.senderId': { $ne: userId }, 'elem.isRead': false }
          ]
        }
      );
    }
    
    return NextResponse.json({
      match: {
        id: match._id,
        createdAt: match.createdAt,
        messages: match.messages || [],
        otherUser: {
          id: otherUserId,
          firstName: otherUser.firstName,
          lastName: otherUser.lastName,
          photo: otherUser.profile?.photos?.find(p => p.isMain)?.url || null
        }
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { message: 'Error fetching messages', error: error.message },
      { status: 500 }
    );
  }
}

// Mark messages as read
export async function PUT(req, { params }) {
    try {
      const session = await getServerSession(authOptions);
      
      if (!session) {
        return NextResponse.json(
          { message: 'Unauthorized' },
          { status: 401 }
        );
      }
      
      const { matchId } = params;
      
      if (!matchId) {
        return NextResponse.json(
          { message: 'Match ID is required' },
          { status: 400 }
        );
      }
      
      const userId = new ObjectId(session.user.id);
      const db = await connectDB();
      
      // Find the match and verify the user is part of it
      const match = await db.collection('matches').findOne({
        _id: new ObjectId(matchId),
        users: userId
      });
      
      if (!match) {
        return NextResponse.json(
          { message: 'Match not found or you are not a participant' },
          { status: 404 }
        );
      }
      
      // Mark all messages from the other user as read
      const result = await db.collection('matches').updateOne(
        { _id: new ObjectId(matchId) },
        { 
          $set: { 
            'messages.$[elem].isRead': true 
          } 
        },
        { 
          arrayFilters: [
            { 'elem.senderId': { $ne: userId } }
          ]
        }
      );
      
      return NextResponse.json({
        message: 'Messages marked as read',
        updatedCount: result.modifiedCount
      }, { status: 200 });
    } catch (error) {
      console.error('Error marking messages as read:', error);
      return NextResponse.json(
        { message: 'Error marking messages as read', error: error.message },
        { status: 500 }
      );
    }
  }