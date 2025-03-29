import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Get users who have shown interest in the current user
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
    const db = await connectDB();
    
    // Find users who have expressed interest in the current user
    const interests = await db.collection('interests')
      .find({
        [`interests.${userId}.interested`]: true
      })
      .toArray();
    
    // Get user profiles for the interested users
    const interestedUserIds = interests.map(interest => interest.userId);
    
    const interestedUsers = await db.collection('users')
      .find(
        { _id: { $in: interestedUserIds } },
        { 
          projection: { 
            _id: 1, 
            firstName: 1, 
            lastName: 1, 
            'profile.photos': 1,
            'profile.location': 1,
            'profile.bio': 1 
          } 
        }
      )
      .toArray();
    
    // Also find the current user's interests to check for mutual interest
    const userInterests = await db.collection('interests')
      .findOne({ userId: new ObjectId(userId) });
    
    // Format the data to show mutual interest
    const formattedUsers = interestedUsers.map(user => {
      const mutualInterest = userInterests && 
        userInterests.interests && 
        userInterests.interests[user._id.toString()] &&
        userInterests.interests[user._id.toString()].interested === true;
      
      return {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        photo: user.profile?.photos?.find(p => p.isMain)?.url || null,
        location: user.profile?.location || null,
        bio: user.profile?.bio || null,
        mutualInterest
      };
    });
    
    return NextResponse.json(
      { interestedUsers: formattedUsers },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching interested users:', error);
    return NextResponse.json(
      { message: 'Error fetching interested users', error: error.message },
      { status: 500 }
    );
  }
}