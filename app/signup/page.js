'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import OnboardingWizard from '@/components/onboarding/OnboardingWizard';
import styles from './signup.module.css';

export default function SignupPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Add a class to the body for this page
    document.body.classList.add('signup-page');
    
    // Check if user is already logged in
    if (status === 'authenticated') {
      setLoading(false);
    } else if (status === 'unauthenticated') {
      // If not logged in, redirect to basic signup
      router.push('/signup/basic');
    }
    
    return () => {
      // Clean up by removing the class when navigating away
      document.body.classList.remove('signup-page');
    };
  }, [status, router]);

  if (loading && status !== 'authenticated') {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.signupContainer}>
      <OnboardingWizard />
    </div>
  );
}