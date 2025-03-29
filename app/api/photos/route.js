import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import User from '@/models/User';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    const formData = await req.formData();
    const files = formData.getAll('photos');
    const isMainArray = formData.getAll('isMain');
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No photos uploaded' },
        { status: 400 }
      );
    }
    
    const photosData = [];
    
    // Get user to access current photos
    const user = await User.findById(session.user.id);
    
    if (!user || !user.profile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }
    
    // Current photos or empty array if none
    const currentPhotos = user.profile.photos || [];
    
    // Process each uploaded file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isMain = isMainArray[i] === 'true';
      
      // Generate unique filename
      const fileName = `${uuidv4()}_${file.name.replace(/\s+/g, '_')}`;
      const uploadDir = path.join(process.cwd(), 'public/uploads');
      const filePath = path.join(uploadDir, fileName);
      
      // Save file to disk
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(filePath, buffer);
      
      // Create URL
      const url = `/uploads/${fileName}`;
      
      photosData.push({
        url,
        isMain
      });
    }
    
    // Update isMain flags if needed
    if (photosData.some(photo => photo.isMain)) {
      // Set all existing photos to not main
      for (let photo of currentPhotos) {
        photo.isMain = false;
      }
    }
    
    // Combine existing and new photos
    const updatedPhotos = [...currentPhotos, ...photosData];
    
    // If no main photo is set, make the first one main
    if (!updatedPhotos.some(photo => photo.isMain) && updatedPhotos.length > 0) {
      updatedPhotos[0].isMain = true;
    }
    
    // Update user profile with new photos
    const updatedProfile = {
      ...user.profile,
      photos: updatedPhotos
    };
    
    await User.updateProfile(session.user.id, updatedProfile);
    
    return NextResponse.json(
      { photos: updatedPhotos },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error uploading photos:', error);
    return NextResponse.json(
      { error: 'Failed to upload photos', details: error.message },
      { status: 500 }
    );
  }
}

// Handle photo deletion or updates
export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    const { photoUpdates } = await req.json();
    
    if (!photoUpdates || !Array.isArray(photoUpdates)) {
      return NextResponse.json(
        { error: 'Invalid photo update data' },
        { status: 400 }
      );
    }
    
    // Get user with current photos
    const user = await User.findById(session.user.id);
    
    if (!user || !user.profile || !user.profile.photos) {
      return NextResponse.json(
        { error: 'User photos not found' },
        { status: 404 }
      );
    }
    
    // Update user profile with updated photos
    const updatedProfile = {
      ...user.profile,
      photos: photoUpdates
    };
    
    await User.updateProfile(session.user.id, updatedProfile);
    
    return NextResponse.json(
      { photos: photoUpdates },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating photos:', error);
    return NextResponse.json(
      { error: 'Failed to update photos', details: error.message },
      { status: 500 }
    );
  }
}