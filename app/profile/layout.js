'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfileLayout({ children }) {
  const pathname = usePathname();
  
  useEffect(() => {
    // Add specific class to body based on the current route
    if (pathname.includes('/profile/edit')) {
      document.body.classList.add('profile-edit-page');
    } else {
      document.body.classList.add('profile-page');
    }
    
    // Cleanup function to remove classes
    return () => {
      document.body.classList.remove('profile-edit-page', 'profile-page');
    };
  }, [pathname]);
  
  return <>{children}</>;
}