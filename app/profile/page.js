'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import ProtectedRoute from '../../components/routing/ProtectedRoute';
import styles from './profile.module.css';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('about');
  
  // Handle logout
  const handleLogout = () => {
    logout();
    router.push('/login');
  };
  
  // Format date of birth to age
  const calculateAge = (birthdate) => {
    if (!birthdate) return null;
    
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };
  
  const userAge = user?.profile?.birthdate ? calculateAge(user.profile.birthdate) : null;
  
  return (
    <ProtectedRoute>
      <div className={styles.profileContainer}>
        <div className="container">
          <div className={styles.profileHeader}>
            <h1>Your Profile</h1>
            <p>View and manage your profile information</p>
          </div>
          
          <div className={styles.profileGrid}>
            <div className={styles.profileSidebar}>
              <div className={styles.profileCard}>
                {user?.profile?.photos && user.profile.photos.length > 0 ? (
                  <div className={styles.profileImageContainer}>
                    <Image 
                      src={user.profile.photos.find(p => p.isMain)?.url || user.profile.photos[0].url}
                      alt="Profile"
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                ) : (
                  <div className={styles.profileInitial}>
                    {user?.firstName?.charAt(0) || '?'}
                  </div>
                )}
                
                <div className={styles.profileInfo}>
                  <div className={styles.verifiedBadge}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <span>Verified Profile</span>
                  </div>
                  
                  <h2>{user?.firstName} {user?.lastName}{userAge ? `, ${userAge}` : ''}</h2>
                  
                  <div className={styles.profileMeta}>
                    <span>{user?.profile?.location || 'No location'}</span>
                    <span>·</span>
                    <span>{user?.profile?.occupation || 'No occupation'}</span>
                  </div>
                </div>
                
                <div className={styles.profileActions}>
                  <Link href="/profile/edit" className="btn btn-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    Edit Profile
                  </Link>
                  
                  <button 
                    type="button" 
                    className="btn btn-outline"
                    onClick={handleLogout}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Log Out
                  </button>
                </div>
              </div>
              
              <div className={styles.profileCard}>
                <h3>Profile Stats</h3>
                <div className={styles.detailsGrid}>
                  <div className={styles.detailItem}>
                    <h4>Profile Views</h4>
                    <div className={styles.detailContent}>152</div>
                  </div>
                  <div className={styles.detailItem}>
                    <h4>Active Matches</h4>
                    <div className={styles.detailContent}>3</div>
                  </div>
                  <div className={styles.detailItem}>
                    <h4>Completion</h4>
                    <div className={styles.detailContent}>92%</div>
                  </div>
                  <div className={styles.detailItem}>
                    <h4>Member Since</h4>
                    <div className={styles.detailContent}>Jan 2025</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={styles.detailsCard}>
              <div className={styles.detailsNav}>
                <div 
                  className={`${styles.detailsNavItem} ${activeTab === 'about' ? styles.active : ''}`}
                  onClick={() => setActiveTab('about')}
                >
                  About
                </div>
                <div 
                  className={`${styles.detailsNavItem} ${activeTab === 'preferences' ? styles.active : ''}`}
                  onClick={() => setActiveTab('preferences')}
                >
                  Preferences
                </div>
                <div 
                  className={`${styles.detailsNavItem} ${activeTab === 'photos' ? styles.active : ''}`}
                  onClick={() => setActiveTab('photos')}
                >
                  Photos
                </div>
              </div>
              
              <div className={styles.detailsContent}>
                {/* About Tab */}
                <div className={`${styles.detailsTab} ${activeTab === 'about' ? styles.active : ''}`}>
                  <div className={styles.detailsSection}>
                    <h3>Bio</h3>
                    {user?.profile?.bio ? (
                      <p className={styles.bioText}>{user.profile.bio}</p>
                    ) : (
                      <p className={styles.emptyContent}>No bio information added yet.</p>
                    )}
                  </div>
                  
                  <div className={styles.detailsSection}>
                    <h3>Basic Information</h3>
                    <div className={styles.detailsGrid}>
                      <div className={styles.detailItem}>
                        <h4>Gender</h4>
                        <div className={styles.detailContent}>
                          {user?.profile?.gender ? (
                            user.profile.gender.charAt(0).toUpperCase() + user.profile.gender.slice(1)
                          ) : (
                            'Not specified'
                          )}
                        </div>
                      </div>
                      
                      <div className={styles.detailItem}>
                        <h4>Birthday</h4>
                        <div className={styles.detailContent}>
                          {user?.profile?.birthdate ? (
                            new Date(user.profile.birthdate).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })
                          ) : (
                            'Not specified'
                          )}
                        </div>
                      </div>
                      
                      <div className={styles.detailItem}>
                        <h4>Location</h4>
                        <div className={styles.detailContent}>
                          {user?.profile?.location || 'Not specified'}
                        </div>
                      </div>
                      
                      <div className={styles.detailItem}>
                        <h4>Occupation</h4>
                        <div className={styles.detailContent}>
                          {user?.profile?.occupation || 'Not specified'}
                        </div>
                      </div>
                      
                      <div className={styles.detailItem}>
                        <h4>Education</h4>
                        <div className={styles.detailContent}>
                          {user?.profile?.education || 'Not specified'}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.detailsSection}>
                    <h3>Interests</h3>
                    {user?.profile?.interests && user.profile.interests.length > 0 ? (
                      <div className={styles.interestsTags}>
                        {user.profile.interests.map((interest, index) => (
                          <span key={index} className={styles.interestTag}>
                            {interest}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className={styles.emptyContent}>No interests added yet.</p>
                    )}
                  </div>
                </div>
                
                {/* Preferences Tab */}
                <div className={`${styles.detailsTab} ${activeTab === 'preferences' ? styles.active : ''}`}>
                  <div className={styles.detailsSection}>
                    <h3>Looking For</h3>
                    <div className={styles.detailsGrid}>
                      <div className={styles.detailItem}>
                        <h4>Interested In</h4>
                        <div className={styles.detailContent}>
                          {user?.profile?.preferences?.lookingFor && 
                           user.profile.preferences.lookingFor.length > 0 ? (
                            user.profile.preferences.lookingFor.join(', ')
                          ) : (
                            'Not specified'
                          )}
                        </div>
                      </div>
                      
                      <div className={styles.detailItem}>
                        <h4>Age Range</h4>
                        <div className={styles.detailContent}>
                          {user?.profile?.preferences?.ageRange ? (
                            `${user.profile.preferences.ageRange.min} - ${user.profile.preferences.ageRange.max} years`
                          ) : (
                            'Not specified'
                          )}
                        </div>
                      </div>
                      
                      <div className={styles.detailItem}>
                        <h4>Maximum Distance</h4>
                        <div className={styles.detailContent}>
                          {user?.profile?.preferences?.distance ? (
                            `${user.profile.preferences.distance} miles`
                          ) : (
                            'Not specified'
                          )}
                        </div>
                      </div>
                      
                      <div className={styles.detailItem}>
                        <h4>Relationship Type</h4>
                        <div className={styles.detailContent}>
                          {user?.profile?.preferences?.relationshipType || 'Not specified'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Photos Tab */}
                <div className={`${styles.detailsTab} ${activeTab === 'photos' ? styles.active : ''}`}>
                  {user?.profile?.photos && user.profile.photos.length > 0 ? (
                    <div className={styles.photoTab}>
                      {user.profile.photos.map((photo, index) => (
                        <div key={index} className={styles.photoItem}>
                          <Image 
                            src={photo.url} 
                            alt={`Photo ${index + 1}`} 
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                          {photo.isMain && (
                            <div className={styles.mainPhotoLabel}>Main</div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className={styles.emptyContent}>No photos uploaded yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}