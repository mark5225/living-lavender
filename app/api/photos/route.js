// app/api/photos/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    const formData = await req.formData();
    const photos = formData.getAll('photos');
    const isMainArray = formData.getAll('isMain');
    
    if (!photos || photos.length === 0) {
      return NextResponse.json(
        { error: 'No photos uploaded' },
        { status: 400 }
      );
    }
    
    const photosData = [];
    
    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      const isMain = isMainArray[i] === 'true';
      
      // Generate unique filename
      const fileName = `${uuidv4()}_${photo.name.replace(/\s+/g, '_')}`;
      const uploadDir = path.join(process.cwd(), 'public/uploads');
      const filePath = path.join(uploadDir, fileName);
      
      // Save file to disk
      const buffer = Buffer.from(await photo.arrayBuffer());
      await writeFile(filePath, buffer);
      
      // Create URL
      const url = `/uploads/${fileName}`;
      
      photosData.push({
        url,
        isMain: isMain || false,
      });
    }
    
    // Update user with photos
    const user = await User.findById(session.user.id);
    
    // If this is the first photo or one is marked as main, update existing photos
    if (photosData.some(photo => photo.isMain)) {
      user.photos.forEach(photo => {
        photo.isMain = false;
      });
    }
    
    // Add new photos
    user.photos.push(...photosData);
    await user.save();
    
    return NextResponse.json(
      { photos: user.photos },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error uploading photos:', error);
    return NextResponse.json(
      { error: 'Failed to upload photos' },
      { status: 500 }
    );
  }
}