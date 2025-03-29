'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();

  // Redirect to basic signup page
  useEffect(() => {
    router.push('/signup/basic');
  }, [router]);

  return null; // This component doesn't render anything
}