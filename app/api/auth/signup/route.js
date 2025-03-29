import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import User from '@/models/User';

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
    
    const user = await User.findById(session.user.id);
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    
    const { password, ...userWithoutPassword } = user;
    
    return NextResponse.json(
      { user: userWithoutPassword },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { message: 'Error fetching profile', error: error.message },
      { status: 500 }
    );
  }
}

// Update user profile
export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const profileData = await req.json();
    
    const updated = await User.updateProfile(session.user.id, profileData);
    
    if (!updated) {
      return NextResponse.json(
        { message: 'Failed to update profile' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { message: 'Profile updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { message: 'Error updating profile', error: error.message },
      { status: 500 }
    );
  }
}