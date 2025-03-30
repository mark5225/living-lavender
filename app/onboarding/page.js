// app/onboarding/page.js
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import OnboardingWizard from '@/components/onboarding/OnboardingWizard';
import { useAuth } from '@/contexts/AuthContext';
import styles from './onboarding.module.css';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Add a class to the body for this page
    document.body.classList.add('onboarding-page');
    
    // If not authenticated after loading, redirect to signup
    if (!loading && !user) {
      router.push('/signup/basic');
    }
    
    return () => {
      // Clean up by removing the class when navigating away
      document.body.classList.remove('onboarding-page');
    };
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className={styles.onboardingContainer}>
      <OnboardingWizard />
    </div>
  );
}