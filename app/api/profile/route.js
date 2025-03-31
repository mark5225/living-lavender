import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// API route for updating user profile
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    const profileData = await request.json();
    
    const db = await connectDB();
    
    // Update user profile in the database
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: {
          'profile': profileData,
          'updatedAt': new Date()
        }
      }
    );
    
    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { message: 'Failed to update profile' },
        { status: 400 }
      );
    }
    
    // Get updated user to return
    const updatedUser = await db.collection('users').findOne(
      { _id: new ObjectId(userId) },
      { projection: { password: 0 } } // Exclude password
    );
    
    return NextResponse.json({
      message: 'Profile updated successfully',
      user: updatedUser
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { message: 'Error updating profile', error: error.message },
      { status: 500 }
    );
  }
}

// Get user profile
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
    
    // Get user from database
    const user = await db.collection('users').findOne(
      { _id: new ObjectId(userId) },
      { projection: { password: 0 } } // Exclude password
    );
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      user
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { message: 'Error fetching profile', error: error.message },
      { status: 500 }
    );
  }
}