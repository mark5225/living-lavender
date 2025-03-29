'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If session exists, set user data
    if (session?.user) {
      setUser(session.user);
    } else {
      setUser(null);
    }
    
    setLoading(status === 'loading');
  }, [session, status]);

  // Login function
  const login = async (email, password) => {
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password
      });
      
      if (result?.error) {
        return { success: false, error: result.error };
      }
      
      // Reload session to get updated user data
      // (Fetch user profile if needed)
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.message || 'An error occurred during login.' 
      };
    }
  };

  // Logout function
  const logout = async () => {
    await signOut({ redirect: false });
  };

  // Update profile function
  const updateProfile = async (profileData) => {
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }
      
      // Update local user state with new profile data
      setUser(prevUser => ({
        ...prevUser,
        profile: profileData
      }));
      
      return { success: true };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { 
        success: false, 
        error: error.message || 'An error occurred while updating your profile.' 
      };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}