// app/matches/page.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import styles from './matches.module.css';

export default function MatchesPage() {
  const { user, loading } = useAuth();
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [lastAction, setLastAction] = useState(null);
  
  // Fetch matches
  useEffect(() => {
    // If user is authenticated, fetch real matches from API
    if (user && !loading) {
      setIsLoading(true);
      
      // In a real app, you'd fetch from your API
      // For demo, we'll use sample data
      fetchSampleMatches()
        .then(data => {
          setMatches(data);
          setIsLoading(false);
        })
        .catch(err => {
          console.error('Error fetching matches:', err);
          setError('Failed to load matches. Please try again.');
          setIsLoading(false);
        });
    } else if (!loading) {
      // For non-logged in users, just show sample profiles
      setMatches(getSampleProfiles());
      setIsLoading(false);
    }
  }, [user, loading]);
  
  // Sample data fetch - replace with real API call
  const fetchSampleMatches = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getSampleProfiles());
      }, 1000);
    });
  };
  
  // Sample profiles for demo
  const getSampleProfiles = () => {
    return [
      {
        id: 1,
        name: 'Emily',
        age: 28,
        location: 'Seattle, WA',
        bio: 'Nature lover, coffee enthusiast, and amateur photographer. Looking for someone to share adventures with.',
        interests: ['Hiking', 'Photography', 'Travel', 'Coffee'],
        photoUrl: 'https://placehold.co/400x600/7464a0/ffffff?text=Emily'
      },
      {
        id: 2,
        name: 'Michael',
        age: 32,
        location: 'Portland, OR',
        bio: 'Software developer by day, musician by night. I love trying new restaurants and going to concerts.',
        interests: ['Music', 'Coding', 'Food', 'Concerts'],
        photoUrl: 'https://placehold.co/400x600/7464a0/ffffff?text=Michael'
      },
      {
        id: 3,
        name: 'Sophia',
        age: 26,
        location: 'San Francisco, CA',
        bio: 'Yoga instructor and avid reader. I enjoy deep conversations and exploring new cities.',
        interests: ['Yoga', 'Reading', 'Travel', 'Art'],
        photoUrl: 'https://placehold.co/400x600/7464a0/ffffff?text=Sophia'
      },
      {
        id: 4,
        name: 'James',
        age: 30,
        location: 'Chicago, IL',
        bio: 'Chef who loves to experiment with flavors. When I\'m not in the kitchen, I\'m probably at a sporting event or hiking.',
        interests: ['Cooking', 'Sports', 'Hiking', 'Movies'],
        photoUrl: 'https://placehold.co/400x600/7464a0/ffffff?text=James'
      }
    ];
  };
  
  // Handle match interaction
  const handleMatchAction = (action) => {
    if (!user) {
      // Prompt non-logged in users to login/register
      setError('Please sign in or create an account to connect with matches');
      return;
    }
    
    // In a real app, send action to API
    console.log(`Match action: ${action} for profile ID ${matches[currentIndex].id}`);
    
    // Save the action
    setLastAction({
      action,
      profile: matches[currentIndex]
    });
    
    // Show confirmation
    setShowConfirmation(true);
    
    // Move to next profile after a short delay
    setTimeout(() => {
      if (currentIndex < matches.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // No more profiles
        setError('You\'ve viewed all available profiles. Check back later for more matches!');
      }
      setShowConfirmation(false);
    }, 1500);
  };
  
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Finding your perfect matches...</p>
      </div>
    );
  }
  
  if (matches.length === 0) {
    return (
      <div className={styles.noMatches}>
        <h2>No matches found</h2>
        <p>We couldn't find any matches based on your preferences. Try adjusting your preferences or check back later.</p>
        <Link href="/profile/edit" className="btn btn-primary">Update Preferences</Link>
      </div>
    );
  }
  
  const currentMatch = matches[currentIndex];
  
  return (
    <div className={styles.matchesContainer}>
      <div className="container">
        <div className={styles.matchesHeader}>
          <h1>Find Your Match</h1>
          <p>Discover people who share your interests and values</p>
        </div>
        
        {error && (
          <div className={styles.errorMessage}>
            {error}
            {!user && (
              <div className={styles.authActions}>
                <Link href="/login" className="btn btn-primary">Log In</Link>
                <Link href="/signup/basic" className="btn btn-outline">Sign Up</Link>
              </div>
            )}
          </div>
        )}
        
        <div className={styles.matchCardContainer}>
          <div className={styles.matchCard}>
            <div className={styles.matchPhoto}>
              <Image
                src={currentMatch.photoUrl}
                alt={currentMatch.name}
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>
            
            <div className={styles.matchInfo}>
              <h2>{currentMatch.name}, {currentMatch.age}</h2>
              <p className={styles.matchLocation}>{currentMatch.location}</p>
              
              <div className={styles.matchBio}>
                <p>{currentMatch.bio}</p>
              </div>
              
              <div className={styles.matchInterests}>
                <h3>Interests</h3>
                <div className={styles.interestTags}>
                  {currentMatch.interests.map((interest, index) => (
                    <span key={index} className={styles.interestTag}>
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className={styles.matchActions}>
                <button 
                  className={styles.passButton}
                  onClick={() => handleMatchAction('pass')}
                  aria-label="Pass"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
                
                <button 
                  className={styles.likeButton}
                  onClick={() => handleMatchAction('like')}
                  aria-label="Like"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          {/* Action Confirmation */}
          {showConfirmation && lastAction && (
            <div className={`${styles.actionConfirmation} ${lastAction.action === 'like' ? styles.likeConfirmation : styles.passConfirmation}`}>
              <div className={styles.confirmationIcon}>
                {lastAction.action === 'like' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                )}
              </div>
              <p>{lastAction.action === 'like' ? 'Liked!' : 'Passed'}</p>
            </div>
          )}
          
          {!user && (
            <div className={styles.signupPrompt}>
              <h3>Ready to connect?</h3>
              <p>Create an account to like profiles and start meaningful conversations.</p>
              <Link href="/signup/basic" className="btn btn-primary">Sign Up Now</Link>
            </div>
          )}
        </div>
        
        <div className={styles.matchCounter}>
          Profile {currentIndex + 1} of {matches.length}
        </div>
      </div>
    </div>
  );