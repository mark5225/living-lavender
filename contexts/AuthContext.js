'use client';

import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

// Mock auth service directly in this file to avoid import issues
const mockUsers = [
  {
    id: '1',
    email: 'demo@example.com',
    password: 'password123',
    firstName: 'Demo',
    lastName: 'User',
    profile: {
      bio: 'This is a demo user profile.',
      photos: [{ url: '/images/demo-profile.jpg' }],
      interests: ['Travel', 'Music', 'Cooking'],
      location: 'New York',
      gender: 'non-binary',
      birthdate: '1990-01-01',
    }
  }
];

const mockAuthService = {
  login: async (email, password) => {
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return { success: true, user: userWithoutPassword };
    }
    return { success: false, error: 'Invalid email or password' };
  },
  
  register: async (userData) => {
    // Check if user already exists
    if (mockUsers.some(u => u.email === userData.email)) {
      return { success: false, error: 'Email already in use' };
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      profile: {
        // Default profile
      }
    };
    
    mockUsers.push(newUser);
    const { password, ...userWithoutPassword } = newUser;
    return { success: true, user: userWithoutPassword };
  },
  
  updateProfile: async (userId, profileData) => {
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      mockUsers[userIndex].profile = {
        ...mockUsers[userIndex].profile,
        ...profileData
      };
      return { success: true, profile: mockUsers[userIndex].profile };
    }
    return { success: false, error: 'User not found' };
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check local storage for saved user
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setLoading(false);
    }
  }, []);
  
  const login = async (email, password) => {
    setLoading(true);
    try {
      const result = await mockAuthService.login(email, password);
      if (result.success) {
        setUser(result.user);
        localStorage.setItem('user', JSON.stringify(result.user));
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };
  
  const register = async (userData) => {
    setLoading(true);
    try {
      const result = await mockAuthService.register(userData);
      if (result.success) {
        setUser(result.user);
        localStorage.setItem('user', JSON.stringify(result.user));
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };
  
  const updateProfile = async (profileData) => {
    if (!user) return { success: false, error: 'Not authenticated' };
    
    try {
      const result = await mockAuthService.updateProfile(user.id, profileData);
      if (result.success) {
        setUser({ ...user, profile: result.profile });
        localStorage.setItem('user', JSON.stringify({ ...user, profile: result.profile }));
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  
  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);