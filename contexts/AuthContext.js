'use client';

import { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const AuthContext = createContext();

// Mock user data for demo purposes
const mockUser = {
  id: '123456',
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane.doe@example.com',
  profile: {
    bio: 'I love hiking, reading, and trying new restaurants. Looking for someone who shares my passion for adventure!',
    location: 'San Francisco, CA',
    birthdate: '1990-01-15',
    gender: 'female',
    occupation: 'Software Engineer',
    education: 'Master\'s Degree',
    interests: ['Hiking', 'Reading', 'Cooking', 'Travel', 'Photography'],
    photos: [
      { url: '/images/demo-profile.jpg', isMain: true }
    ],
    preferences: {
      lookingFor: ['Male'],
      ageRange: { min: 25, max: 40 },
      distance: 25,
      relationshipType: 'Long-term relationship'
    }
  }
};

// Provider component that wraps your app and makes auth object available to any child component that calls useAuth().
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is stored in local storage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);
  
  // Login function - for demo, we'll use a mock user
  const login = async (email, password) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, hardcode credentials check
      if (email === 'demo@example.com' && password === 'password') {
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
        return { success: true };
      }
      
      return { 
        success: false, 
        error: 'Invalid email or password' 
      };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: 'An error occurred during login' 
      };
    }
  };
  
  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };
  
  // Register function - for demo, we'll just return success
  const register = async (userData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a demo user based on registration data
      const newUser = {
        ...mockUser,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
      };
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: 'An error occurred during registration' 
      };
    }
  };
  
  // Update profile function - for demo, we'll just update the local state
  const updateProfile = (profileData) => {
    if (!user) return { success: false };
    
    const updatedUser = {
      ...user,
      profile: {
        ...user.profile,
        ...profileData
      }
    };
    
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    return { success: true };
  };
  
  // Make the context object:
  const value = {
    user,
    loading,
    login,
    logout,
    register,
    updateProfile
  };
  
  // Return the provider with the value:
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook for child components to get the auth object and re-render when it changes.
export const useAuth = () => {
  return useContext(AuthContext);
};