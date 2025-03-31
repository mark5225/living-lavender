import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
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
    const db = await connectDB();
    
    // Get the user with their preferences
    const user = await db.collection('users').findOne(
      { _id: new ObjectId(userId) }
    );
    
    if (!user || !user.profile || !user.profile.preferences) {
      return NextResponse.json(
        { message: 'User profile or preferences not found' },
        { status: 404 }
      );
    }
    
    const { preferences } = user.profile;
    
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
    
    // Get user's existing interests and matches to exclude
    const userInterests = await db.collection('interests').findOne(
      { userId: new ObjectId(userId) }
    );
    
    // Exclude users the current user has already swiped on
    if (userInterests && userInterests.interests) {
      const alreadySwipedIds = Object.keys(userInterests.interests)
        .filter(id => id.match(/^[0-9a-fA-F]{24}$/)) // Valid ObjectId strings
        .map(id => new ObjectId(id));
      
      if (alreadySwipedIds.length > 0) {
        query._id.$nin = alreadySwipedIds;
      }
    }
    
    // Get existing matches
    const existingMatches = await db.collection('matches').find({
      users: new ObjectId(userId)
    }).toArray();
    
    // Extract other user IDs from matches
    const matchedUserIds = [];
    existingMatches.forEach(match => {
      match.users.forEach(uid => {
        if (!uid.equals(new ObjectId(userId))) {
          matchedUserIds.push(uid);
        }
      });
    });
    
    // Exclude matched users from potential matches
    if (matchedUserIds.length > 0) {
      if (query._id.$nin) {
        query._id.$nin = [...query._id.$nin, ...matchedUserIds];
      } else {
        query._id.$nin = matchedUserIds;
      }
    }
    
    // Limit to 20 potential matches
    const potentialMatches = await db.collection('users')
      .find(query)
      .project({ 
        password: 0,
        email: 0,
        role: 0,
        membershipType: 0
      })
      .limit(20)
      .toArray();
    
    // Format the matches for the frontend
    const formattedMatches = potentialMatches.map(match => {
      // Calculate age from birthdate
      let age = null;
      if (match.profile && match.profile.birthdate) {
        const birthdate = new Date(match.profile.birthdate);
        const today = new Date();
        age = today.getFullYear() - birthdate.getFullYear();
        
        // Adjust age if birthday hasn't occurred yet this year
        if (
          today.getMonth() < birthdate.getMonth() || 
          (today.getMonth() === birthdate.getMonth() && today.getDate() < birthdate.getDate())
        ) {
          age--;
        }
      }
      
      return {
        id: match._id.toString(),
        name: `${match.firstName} ${match.lastName}`,
        age: age,
        location: match.profile?.location || null,
        bio: match.profile?.bio || null,
        interests: match.profile?.interests || [],
        photoUrl: match.profile?.photos && match.profile.photos.length > 0 
          ? (match.profile.photos.find(p => p.isMain)?.url || match.profile.photos[0].url)
          : `https://placehold.co/400x600/7464a0/ffffff?text=${match.firstName}`
      };
    });
    
    return NextResponse.json(
      { matches: formattedMatches },
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