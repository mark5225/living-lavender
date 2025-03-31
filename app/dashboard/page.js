// app/dashboard/page.js
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import styles from './dashboard.module.css';

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout, loading } = useAuth();

  useEffect(() => {
    // If not authenticated after loading, redirect to login
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Handle logout
  const handleLogout = () => {
    logout();
    // Redirect happens in the logout function
  };

  // If still checking authentication status, show loading state
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  // If not authenticated, don't render the dashboard (will redirect via useEffect)
  if (!user) {
    return null;
  }

  return (
    <div className={styles.dashboardContainer}>
      <div className="container">
        <div className={styles.dashboardHeader}>
          <h1>Welcome, {user.firstName || 'User'}</h1>
          <p>Your profile is now set up and you're ready to start connecting!</p>
        </div>
        
        <div className={styles.dashboardContent}>
          <div className={styles.matchesHighlight}>
            <div className={styles.highlightContent}>
              <h2>Find Your Perfect Match Today!</h2>
              <p>Browse through potential matches and start meaningful conversations.</p>
              <Link href="/matches" className="btn btn-primary btn-lg">Discover Matches</Link>
            </div>
            <div className={styles.highlightImage}>
              <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="100" cy="100" r="100" fill="#f8f5ff" />
                <path d="M135 60C123.1 60 112.5 65.9 107 75.3C101.5 65.9 90.9 60 79 60C60.2 60 45 75.2 45 94C45 116.7 64.3 135.2 92.3 160.4L107 174L121.7 160.4C149.7 135.2 169 116.7 169 94C169 75.2 153.8 60 135 60Z" fill="#7464A0"/>
              </svg>
            </div>
          </div>
          
          <div className={styles.cardGrid}>
            <div className={styles.card}>
              <div className={styles.cardIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <h2>Complete Your Profile</h2>
              <p>Add more details to your profile to increase your chances of finding a match.</p>
              <Link href="/profile/edit" className="btn btn-outline">Edit Profile</Link>
            </div>
            
            <div className={styles.card}>
              <div className={styles.cardIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <h2>Messages</h2>
              <p>Check your messages and start conversations with your matches.</p>
              <Link href="/messages" className="btn btn-outline">View Messages</Link>
            </div>
            
            <div className={styles.card}>
              <div className={styles.cardIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <h2>Help Center</h2>
              <p>Get answers to common questions and learn how to use all features.</p>
              <Link href="/help" className="btn btn-outline">Visit Help Center</Link>
            </div>
          </div>
          
          <button onClick={handleLogout} className={styles.logoutButton}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}