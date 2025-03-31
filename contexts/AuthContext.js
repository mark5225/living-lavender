'use client';

import { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync user state with session
  useEffect(() => {
    if (status === 'loading') {
      setLoading(true);
      return;
    }

    if (session && session.user) {
      setUser(session.user);
    } else {
      setUser(null);
    }
    
    setLoading(false);
  }, [session, status]);

  // Login function - uses NextAuth signIn
  const login = async (credentials) => {
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: credentials.email,
        password: credentials.password
      });

      if (result.error) {
        throw new Error(result.error);
      }

      // Refresh session
      router.push('/dashboard');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Signup function - creates a new user then logs in
  const signup = async (userData) => {
    try {
      // Call API to create user
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error creating account');
      }

      // Auto login after signup
      await login({
        email: userData.email,
        password: userData.password
      });

      return true;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  // Logout function - uses NextAuth signOut
  const logout = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  // Update profile function - sends changes to API
  const updateProfile = async (profileData) => {
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error updating profile');
      }

      // Update local user state with the new profile data
      const updatedData = await response.json();
      setUser(prev => ({
        ...prev,
        ...updatedData.user
      }));

      return true;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  // Check if user is admin
  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      signup,
      logout,
      updateProfile,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);