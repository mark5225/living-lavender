'use client';

import { SessionProvider } from 'next-auth/react';
import { AuthProvider } from '../contexts/AuthContext';

export function Providers({ children }) {
  return (
    <AuthProvider>
      <SessionProvider>{children}</SessionProvider>
    </AuthProvider>
  );
}