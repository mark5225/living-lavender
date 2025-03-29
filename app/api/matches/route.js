import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import User from '@/models/User';
import { connectDB } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Get potential matches for the user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    
    // Get the user with their preferences
    const user = await User.findById(userId);
    
    if (!user || !user.profile || !user.profile.preferences) {
      return NextResponse.json(
        { message: 'User profile or preferences not found' },
        { status: 404 }
      );
    }
    
    const { preferences } = user.profile;
    
    const db = await connectDB();
    
    // Build the query based on user preferences
    const query = {
      _id: { $ne: new ObjectId(userId) }, // Exclude current user
    };
    
    // Filter by gender if set
    if (preferences.lookingFor && preferences.lookingFor.length > 0) {
      // Case-insensitive gender search
      const genderRegexes = preferences.lookingFor.map(gender => 
        new RegExp(`^${gender}$`, 'i')
      );
      
      query['profile.gender'] = { $in: genderRegexes };
    }
    
    // Filter by age range if set
    if (preferences.ageRange) {
      // Calculate birth date range from age range
      const today = new Date();
      const minBirthYear = today.getFullYear() - preferences.ageRange.max;
      const maxBirthYear = today.getFullYear() - preferences.ageRange.min;
      
      const minBirthDate = new Date(minBirthYear, today.getMonth(), today.getDate());
      const maxBirthDate = new Date(maxBirthYear, today.getMonth(), today.getDate());
      
      query['profile.birthdate'] = { 
        $gte: minBirthDate.toISOString().split('T')[0],
        $lte: maxBirthDate.toISOString().split('T')[0]
      };
    }
    
    // In a real application, you would filter by distance using geospatial queries
    // This would require storing user locations as coordinates and using $near operator
    
    // Limit to 20 potential matches
    const potentialMatches = await db.collection('users')
      .find(query)
      .project({ password: 0 }) // Exclude password
      .limit(20)
      .toArray();
    
    return NextResponse.json(
      { matches: potentialMatches },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error finding matches:', error);
    return NextResponse.json(
      { message: 'Error finding matches', error: error.message },
      { status: 500 }
    );
  }
}

// Express interest in another user
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { targetUserId, isInterested } = await req.json();
    
    if (!targetUserId) {
      return NextResponse.json(
        { message: 'Target user ID is required' },
        { status: 400 }
      );
    }
    
    const db = await connectDB();
    
    // Add the interest to the database
    await db.collection('interests').updateOne(
      { userId: new ObjectId(session.user.id) },
      { 
        $set: {
          [`interests.${targetUserId}`]: {
            interested: !!isInterested,
            timestamp: new Date()
          }
        }
      },
      { upsert: true }
    );
    
    // Check if there's a mutual match
    const targetUserInterests = await db.collection('interests')
      .findOne({ 
        userId: new ObjectId(targetUserId),
        [`interests.${session.user.id}.interested`]: true
      });
    
    const isMatch = !!targetUserInterests && isInterested;
    
    // If there's a match, create a match record
    if (isMatch) {
      await db.collection('matches').insertOne({
        users: [
          new ObjectId(session.user.id),
          new ObjectId(targetUserId)
        ],
        createdAt: new Date(),
        messages: []
      });
      
      return NextResponse.json(
        { 
          message: 'Match created!',
          isMatch: true
        },
        { status: 200 }
      );
    }
    
    return NextResponse.json(
      { 
        message: 'Interest recorded',
        isMatch: false
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error recording interest:', error);
    return NextResponse.json(
      { message: 'Error recording interest', error: error.message },
      { status: 500 }
    );
  }
}