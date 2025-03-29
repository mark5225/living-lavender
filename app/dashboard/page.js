'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import ProtectedRoute from '../../components/routing/ProtectedRoute';
import styles from './dashboard.module.css';

export default function DashboardPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (user) {
      // User is already authenticated, we can use their profile from the context
      setProfile(user.profile || {});
      setLoading(false);
    }
  }, [user]);
  
  if (loading) {
    return (
      <div className={styles.loader}>
        <div className={styles.spinner}></div>
        <p>Loading your profile...</p>
      </div>
    );
  }
  
  return (
    <ProtectedRoute>
      <div className={styles.dashboardContainer}>
        <div className="container">
          <div className={styles.dashboardHeader}>
            <h1>Welcome, {user?.firstName || 'User'}</h1>
            <p>Manage your profile and connections</p>
          </div>
          
          {profile ? (
            <div className={styles.dashboardGrid}>
              <div>
                <div className={styles.profileCard}>
                  <div className={styles.profileInfo}>
                    {profile.photos && profile.photos.length > 0 ? (
                      <div className={styles.profileImageContainer}>
                        <Image 
                          src={profile.photos[0].url} 
                          alt="Profile" 
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    ) : (
                      <div className={styles.profileInitial}>
                        {user.firstName?.charAt(0) || '?'}
                      </div>
                    )}
                    <h2>{user.firstName} {user.lastName}</h2>
                    <p>{profile.location || 'No location set'}</p>
                  </div>
                  
                  <div className={styles.completionContainer}>
                    <h3>Profile Completion</h3>
                    <div className={styles.progressBar}>
                      <div 
                        className={styles.progressFill} 
                        style={{ width: `${profile.isComplete ? 100 : 70}%` }}
                      ></div>
                    </div>
                    <p className={styles.completionText}>
                      {profile.isComplete 
                        ? 'Your profile is complete!' 
                        : 'Your profile is almost complete. Add more details to increase your chances of finding a match.'}
                    </p>
                  </div>
                  
                  <Link 
                    href="/profile/edit" 
                    className={`btn btn-outline ${styles.editProfileBtn}`}
                  >
                    Edit Profile
                  </Link>
                </div>
              </div>
              
              <div>
                <div className={styles.contentCard}>
                  <h2>About Me</h2>
                  {profile.bio ? (
                    <p>{profile.bio}</p>
                  ) : (
                    <p className={styles.noBio}>No bio added yet</p>
                  )}
                  
                  {profile.interests && profile.interests.length > 0 && (
                    <div className={styles.interestsSection}>
                      <h3>Interests</h3>
                      <div className={styles.interestsTags}>
                        {profile.interests.map((interest, index) => (
                          <span 
                            key={index} 
                            className={styles.interestTag}
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className={styles.contentCard}>
                  <h2>Potential Matches</h2>
                  <p>
                    We're working on finding your perfect matches based on your preferences.
                    Check back soon to see your matches!
                  </p>
                  
                  <div className={styles.preferencesBox}>
                    <h3>Your Preferences</h3>
                    <div className={styles.preferencesGrid}>
                      <div className={styles.preferenceItem}>
                        <p>Looking for</p>
                        <p>
                          {profile.preferences?.lookingFor && profile.preferences.lookingFor.length > 0
                            ? profile.preferences.lookingFor.join(', ')
                            : 'Not specified'}
                        </p>
                      </div>
                      <div className={styles.preferenceItem}>
                        <p>Age Range</p>
                        <p>
                          {profile.preferences?.ageRange
                            ? `${profile.preferences.ageRange.min} - ${profile.preferences.ageRange.max}`
                            : '18 - 50'}
                        </p>
                      </div>
                      <div className={styles.preferenceItem}>
                        <p>Distance</p>
                        <p>
                          {profile.preferences?.distance
                            ? `${profile.preferences.distance} miles`
                            : '50 miles'}
                        </p>
                      </div>
                      <div className={styles.preferenceItem}>
                        <p>Relationship Type</p>
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
            <div className={styles.completeProfileCard}>
              <h2>Complete Your Profile</h2>
              <p>
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
      </div>
    </ProtectedRoute>
  );
}