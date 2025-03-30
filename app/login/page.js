// app/login/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import styles from './login.module.css';

export default function LoginPage() {
  const router = useRouter();
  const { user, login, loading } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      setIsLoading(false);
      return;
    }

    try {
      // For demonstration purposes, we'll simulate a login
      // In a real app, you'd call your API endpoint here
      
      // Demo login (success if email contains "@" and password length >= 6)
      if (formData.email.includes('@') && formData.password.length >= 6) {
        // Create a mock user object
        const userData = {
          id: 'user-' + Date.now(),
          email: formData.email,
          firstName: formData.email.split('@')[0], // Use part of email as name for demo
          lastName: '',
          profile: {}
        };
        
        // Login the user (updates context and localStorage)
        login(userData);
        
        // Redirect will happen automatically via the useEffect
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // If still checking authentication status, show loading state
  if (loading) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              border: '4px solid rgba(116, 100, 160, 0.1)', 
              borderRadius: '50%', 
              borderTopColor: '#7464A0', 
              animation: 'spin 1s linear infinite' 
            }}></div>
          </div>
        </div>
      </div>
    );
  }

  // If already authenticated, don't render the form (will redirect via useEffect)
  if (user) {
    return null;
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <Link href="/" className={styles.logo}>
            <svg 
              width="40" 
              height="40" 
              viewBox="0 0 40 40" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="40" height="40" rx="8" fill="#7464A0" />
              <path d="M20 10C14.486 10 10 14.486 10 20C10 25.514 14.486 30 20 30C25.514 30 30 25.514 30 20C30 14.486 25.514 10 20 10ZM20 28C15.589 28 12 24.411 12 20C12 15.589 15.589 12 20 12C24.411 12 28 15.589 28 20C28 24.411 24.411 28 20 28Z" fill="white"/>
              <path d="M20 15C18.346 15 17 16.346 17 18C17 19.654 18.346 21 20 21C21.654 21 23 19.654 23 18C23 16.346 21.654 15 20 15Z" fill="white"/>
              <path d="M20 22C16.667 22 14 24.239 14 27H26C26 24.239 23.333 22 20 22Z" fill="white"/>
            </svg>
            <h1 className={styles.logoText}>Living Lavender</h1>
          </Link>
          <p>Sign in to your account</p>
        </div>
        
        {error && (
          <div className={styles.errorMessage}>{error}</div>
        )}
        
        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className={styles.loginOptions}>
            <div className={styles.rememberMe}>
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
              />
              <label htmlFor="rememberMe">Remember me</label>
            </div>
            
            <Link href="/forgot-password" className={styles.forgotPassword}>
              Forgot password?
            </Link>
          </div>
          
          <button 
            type="submit" 
            className={`btn btn-primary ${styles.loginButton}`}
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div className={styles.signupPrompt}>
          <span>Don't have an account?</span>
          <Link href="/signup/basic" className="btn btn-outline">Sign Up</Link>
        </div>
        
        <div className={styles.socialLogin}>
          <p>Or login with</p>
          <div className={styles.socialButtons}>
            <button 
              className={styles.socialButton}
              onClick={() => {
                setError('Social login is not implemented in this demo');
              }}
              type="button"
              disabled={isLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
              Facebook
            </button>
            <button 
              className={styles.socialButton}
              onClick={() => {
                setError('Social login is not implemented in this demo');
              }}
              type="button"
              disabled={isLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"></path>
              </svg>
              Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}