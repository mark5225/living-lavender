// components/routing/AdminRoute.js
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import styles from './protected-route.module.css';

export default function AdminRoute({ children }) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not logged in, redirect to login
        router.push('/login');
      } else if (!isAdmin()) {
        // Not admin, redirect to dashboard
        router.push('/dashboard');
      }
    }
  }, [user, loading, router, isAdmin]);

  if (loading) {
    return (
      <div className={styles.loaderContainer}>
        <div className={styles.spinner}></div>
        <p className={styles.loaderText}>Loading...</p>
      </div>
    );
  }

  if (!user || !isAdmin()) {
    return null; // Will redirect from useEffect
  }

  return <>{children}</>;
}