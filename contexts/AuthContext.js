// contexts/AuthContext.js
'use client';

import { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';

// Create the authentication context
const AuthContext = createContext();

// Create a provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      // Try to get user from localStorage
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          if (userData.isAuthenticated) {
            setUser(userData);
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        // Clear invalid user data
        localStorage.removeItem('user');
      }
    }
    
    // Set loading to false after checking authentication
    setLoading(false);
  }, []);

  // Login function
  const login = (userData) => {
    // Save user to state and localStorage
    setUser(userData);
    localStorage.setItem('user', JSON.stringify({
      ...userData,
      isAuthenticated: true
    }));
  };

  // Logout function
  const logout = () => {
    // Remove user from state and localStorage
    setUser(null);
    localStorage.removeItem('user');
    // Redirect to home page
    router.push('/');
  };

  // Update profile function
  const updateProfile = (profileData) => {
    if (!user) return false;
    
    const updatedUser = {
      ...user,
      profile: {
        ...user.profile,
        ...profileData
      }
    };
    
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return true;
  };

  // Context value
  const value = {
    user,
    loading,
    login,
    logout,
    updateProfile,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};