'use client';

import { useEffect } from 'react';
import OnboardingWizard from '@/components/onboarding/OnboardingWizard';
import styles from './signup.module.css';

export default function SignupPage() {
  useEffect(() => {
    // Add a class to the body to change the background for this page
    document.body.classList.add('signup-page');
    
    return () => {
      // Clean up by removing the class when navigating away
      document.body.classList.remove('signup-page');
    };
  }, []);

  return (
    <div className={styles.signupContainer}>
      <OnboardingWizard />
    </div>
  );
}