'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
    
    if (status === 'authenticated') {
      fetchProfile();
    }
  }, [status, router]);
  
  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/profiles');
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      } else {
        // Profile not found or error
        console.log('Profile not found or error');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading your profile...</p>
        </div>
      </div>
    );
  }
  
  if (!session) {
    return null;
  }
  
  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Welcome, {session.user.firstName || session.user.name?.split(' ')[0]}</h1>
        <p className="text-text-light mt-2">Manage your profile and connections</p>
      </div>
      
      {profile ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-center mb-4">
                {profile.photos && profile.photos.length > 0 ? (
                  <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                    <Image 
                      src={profile.photos[0].url} 
                      alt="Profile" 
                      fill
                      style={{ objectFit: 'cover' }}

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
    
    if (status === 'authenticated') {
      fetchProfile();
    }
  }, [status, router]);
  
  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/profiles');
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      } else {
        // Profile not found or error
        console.log('Profile not found or error');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading your profile...</p>
        </div>
      </div>
    );
  }
  
  if (!session) {
    return null;
  }
  
  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Welcome, {session.user.firstName || session.user.name?.split(' ')[0]}</h1>
        <p className="text-text-light mt-2">Manage your profile and connections</p>
      </div>
      
      {profile ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-center mb-4">
                {profile.photos && profile.photos.length > 0 ? (
                  <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                    <Image 
                      src={profile.photos[0].url} 
                      alt="Profile" 
                      fill
                      style={{ objectFit: 'cover' }}
                      className="rounded-full"
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-primary flex items-center justify-center text-white text-4xl">
                    {session.user.name?.charAt(0) || '?'}
                  </div>
                )}
                <h2 className="text-xl font-semibold">{session.user.name}</h2>
                <p className="text-text-light">{profile.location}</p>
              </div>
              
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Profile Completion</h3>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-primary h-2.5 rounded-full" 
                    style={{ width: `${profile.isComplete ? 100 : 70}%` }}
                  ></div>
                </div>
                <p className="text-sm mt-2">
                  {profile.isComplete 
                    ? 'Your profile is complete!' 
                    : 'Your profile is almost complete. Add more details to increase your chances of finding a match.'}
                </p>
              </div>
              
              <div className="mt-6">
                <Link 
                  href="/profile/edit" 
                  className="btn btn-outline w-full"
                >
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <h2 className="text-xl font-semibold mb-4">About Me</h2>
              {profile.bio ? (
                <p>{profile.bio}</p>
              ) : (
                <p className="text-text-light italic">No bio added yet</p>
              )}
              
              {profile.interests && profile.interests.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((interest, index) => (
                      <span 
                        key={index} 
                        className="px-3 py-1 bg-background text-primary rounded-full text-sm"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Potential Matches</h2>
              <p className="text-text-light">
                We're working on finding your perfect matches based on your preferences.
                Check back soon to see your matches!
              </p>
              
              <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                <h3 className="font-semibold mb-2">Your Preferences</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-text-light">Looking for</p>
                    <p>
                      {profile.preferences?.lookingFor && profile.preferences.lookingFor.length > 0
                        ? profile.preferences.lookingFor.join(', ')
                        : 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-text-light">Age Range</p>
                    <p>
                      {profile.preferences?.ageRange
                        ? `${profile.preferences.ageRange.min} - ${profile.preferences.ageRange.max}`
                        : '18 - 50'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-text-light">Distance</p>
                    <p>
                      {profile.preferences?.distance
                        ? `${profile.preferences.distance} miles`
                        : '50 miles'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-text-light">Relationship Type</p>
                    <p>
                      {profile.preferences?.relationshipType || 'Not specified'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Complete Your Profile</h2>
          <p className="mb-4">
            You haven't completed your profile yet. Tell us more about yourself to start finding matches!
          </p>
          <Link
            href="/signup"
            className="btn btn-primary"
          >
            Complete Profile
          </Link>
        </div>
      )}
    </div>
  );
}