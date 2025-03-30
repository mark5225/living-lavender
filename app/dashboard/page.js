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
          <div className={styles.cardGrid}>
            <div className={styles.card}>
              <div className={styles.cardIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </div>
              <h2>Discover Matches</h2>
              <p>Browse through potential matches and find your perfect connection.</p>
              <Link href="/matches" className="btn btn-primary">Start Browsing</Link>
            </div>
            
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