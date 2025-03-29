'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import OnboardingWizard from '@/components/onboarding/OnboardingWizard';
import styles from './onboarding.module.css';

export default function OnboardingPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Add a class to the body for this page
    document.body.classList.add('onboarding-page');
    
    // Check if user is logged in from localStorage
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        if (userData.isAuthenticated) {
          setIsLoggedIn(true);
        } else {
          // Not authenticated, redirect to signup
          router.push('/signup/basic');
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        router.push('/signup/basic');
      }
    } else {
      // No user found, redirect to signup
      router.push('/signup/basic');
    }
    
    setLoading(false);
    
    return () => {
      // Clean up by removing the class when navigating away
      document.body.classList.remove('onboarding-page');
    };
  }, [router]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className={styles.onboardingContainer}>
      <OnboardingWizard />
    </div>
  );
}