'use client';

import { usePathname } from 'next/navigation';

export default function ProfileLayout({ children }) {
  const pathname = usePathname();
  
  // Add specific class to body based on the current route
  // This helps with styling specific pages
  if (typeof document !== 'undefined') {
    if (pathname.includes('/profile/edit')) {
      document.body.classList.add('profile-edit-page');
    } else {
      document.body.classList.add('profile-page');
    }
    
    // Cleanup function to remove classes
    return () => {
      document.body.classList.remove('profile-edit-page', 'profile-page');
    };
  }
  
  return (
    <>
      {children}
    </>
  );
}