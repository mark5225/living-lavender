// app/api/admin/demo-users/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import User from '@/models/user';

// Create demo users - POST /api/admin/demo-users
export async function POST(request) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Check if user is admin
    const user = await User.findById(session.user.id);
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }
    
    // Get count from request body
    const { count = 1 } = await request.json();
    
    // Validate count
    const demoCount = parseInt(count);
    if (isNaN(demoCount) || demoCount < 1 || demoCount > 50) {
      return NextResponse.json(
        { message: 'Invalid count. Must be between 1 and 50.' },
        { status: 400 }
      );
    }
    
    // Create demo users
    const demoUsers = await User.createDemoUsers(demoCount);
    
    return NextResponse.json({
      message: `Successfully created ${demoCount} demo users`,
      count: demoUsers.length
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating demo users:', error);
    return NextResponse.json(
      { message: 'Error creating demo users', error: error.message },
      { status: 500 }
    );
  }
}

// Get all demo users - GET /api/admin/demo-users
export async function GET(request) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Check if user is admin
    const user = await User.findById(session.user.id);
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }
    
    // Get query parameters
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const skip = parseInt(url.searchParams.get('skip') || '0');
    
    // Get all demo users
    const db = await connectDB();
    const demoUsers = await db.collection('users')
      .find({ membershipType: 'demo' })
      .project({ password: 0 }) // Exclude password
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    
    // Get total count
    const totalCount = await db.collection('users')
      .countDocuments({ membershipType: 'demo' });
    
    return NextResponse.json({
      users: demoUsers,
      total: totalCount,
      limit,
      skip
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching demo users:', error);
    return NextResponse.json(
      { message: 'Error fetching demo users', error: error.message },
      { status: 500 }
    );
  }
}

// Delete all demo users - DELETE /api/admin/demo-users
export async function DELETE(request) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Check if user is admin
    const user = await User.findById(session.user.id);
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }
    
    // Delete all demo users
    const db = await connectDB();
    const result = await db.collection('users')
      .deleteMany({ membershipType: 'demo' });
    
    return NextResponse.json({
      message: `Successfully deleted ${result.