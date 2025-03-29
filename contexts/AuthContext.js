// contexts/AuthContext.js
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') {
      return;
    }

    if (session) {
      setUser(session.user);
    } else {
      setUser(null);
    }

    setLoading(false);
  }, [session, status]);

  const logout = async () => {
    await signOut({ redirect: false });
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    if (!user) return { success: false };

    try {
      // For demo/test purposes, we'll just update the local state without API call
      // In production, you should make an API call to update the profile
      setUser(prev => ({
        ...prev,
        profile: profileData
      }));
      
      return { success: true };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    logout,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}