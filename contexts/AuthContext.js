'use client';

import { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Create the auth context
const AuthContext = createContext({});

// Export the provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Mock authentication functions for demonstration purposes
  const login = async (credentials) => {
    try {
      // Simulate API call
      console.log('Logging in with:', credentials);
      
      // Mock successful response
      const mockUser = {
        id: '123',
        email: credentials.email,
        firstName: 'Test',
        lastName: 'User',
        profile: {
          birthdate: '1990-01-01',
          gender: 'female',
          location: 'New York, NY',
          bio: 'This is a test bio',
          interests: ['Travel', 'Reading', 'Cooking'],
          photos: [
            {
              url: '/images/sample-photo-1.jpg',
              isMain: true
            }
          ],
          preferences: {
            lookingFor: ['Male'],
            ageRange: { min: 25, max: 40 },
            distance: 25,
            relationshipType: 'Long-term relationship'
          }
        }
      };
      
      // Set user in state
      setUser(mockUser);
      
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.message || 'Login failed' 
      };
    }
  };

  const logout = () => {
    // Remove user from state
    setUser(null);
    
    // Remove from localStorage
    localStorage.removeItem('user');
    
    // Redirect to login
    router.push('/login');
  };

  const updateProfile = (profileData) => {
    try {
      if (!user) {
        throw new Error('User not logged in');
      }
      
      // Update profile in state
      const updatedUser = {
        ...user,
        profile: {
          ...user.profile,
          ...profileData
        }
      };
      
      setUser(updatedUser);
      
      // Update in localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      return { 
        success: false,
        error: error.message || 'Failed to update profile'
      };
    }
  };

  // Check for existing user on initial load
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auth context value
  const contextValue = {
    user,
    loading,
    login,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;