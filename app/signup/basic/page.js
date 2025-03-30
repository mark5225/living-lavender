// app/signup/basic/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import styles from '../signup.module.css';

export default function BasicSignupPage() {
  const router = useRouter();
  const { user, login } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
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
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // For demonstration, we'll simulate creating an account
      // In a real app, you'd call your API endpoint here
      
      // Create a user object
      const userData = {
        id: 'user-' + Date.now(),
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        profile: {}
      };
      
      // Login the user using our context
      login(userData);
      
      // Navigate to onboarding
      router.push('/onboarding');
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'An error occurred during registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // If already authenticated, don't render the form (will redirect via useEffect)
  if (user) {
    return null;
  }

  return (
    <div className={styles.signupContainer}>
      <div className="container">
        <div className={styles.signupCard}>
          <div className={styles.signupHeader}>
            <Link href="/" className="inline-block">
              <div className={styles.logo}>
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
              </div>
            </Link>
            <p>Create your account</p>
          </div>
          
          {error && (
            <div className={styles.errorMessage}>{error}</div>
          )}
          
          <form className={styles.signupForm} onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
              <div className="form-group">
                <label className="form-label" htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  className="form-control"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label" htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className="form-control"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
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
                minLength={8}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="form-control"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <button
              type="submit"
              className="btn btn-primary w-full mt-4"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>
          
          <div className={styles.loginPrompt}>
            <p>Already have an account? <Link href="/login" className="text-primary">Log In</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}