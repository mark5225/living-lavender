// components/onboarding/OnboardingWizard.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import styles from './OnboardingWizard.module.css';

// Import step components
import BasicInfoStep from './steps/BasicInfoStep';
import AboutYouStep from './steps/AboutYouStep';
import PreferencesStep from './steps/PreferencesStep';
import PhotoUploadStep from './steps/PhotoUploadStep';
import CompleteStep from './steps/CompleteStep';

const OnboardingWizard = () => {
  const router = useRouter();
  const { user, updateProfile } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  const [formData, setFormData] = useState({
    // Basic Info
    firstName: '',
    lastName: '',
    birthdate: '',
    gender: '',
    location: '',
    
    // About You
    bio: '',
    interests: [],
    occupation: '',
    education: '',
    
    // Preferences
    lookingFor: [],
    ageRange: { min: 18, max: 50 },
    distance: 50,
    relationshipType: '',
    
    // Photos
    photos: []
  });

  // Pre-fill form data with user info
  useEffect(() => {
    if (user) {
      setFormData(prevData => ({
        ...prevData,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        ...(user.profile || {})
      }));
    }
  }, [user]);

  const totalSteps = 5;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleMultipleSelectChange = (name, selectedOptions) => {
    setFormData({
      ...formData,
      [name]: selectedOptions
    });
  };

  const handleRangeChange = (name, values) => {
    setFormData({
      ...formData,
      [name]: values
    });
  };

  const handlePhotoUpload = (photos) => {
    setFormData({
      ...formData,
      photos: [...formData.photos, ...photos]
    });
  };

  const handlePhotoRemove = (index) => {
    const updatedPhotos = [...formData.photos];
    updatedPhotos.splice(index, 1);
    setFormData({
      ...formData,
      photos: updatedPhotos
    });
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (currentStep === totalSteps) {
      try {
        setIsSubmitting(true);
        setSubmitError('');
        
        // Update the user profile using our context
        const result = updateProfile(formData);
        
        if (result) {
          // Add artificial delay to simulate API call
          setTimeout(() => {
            router.push('/dashboard');
          }, 1000);
        } else {
          throw new Error('Failed to update profile');
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        setSubmitError(error.message || 'Something went wrong. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      nextStep();
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfoStep 
            formData={formData} 
            handleInputChange={handleInputChange} 
          />
        );
      case 2:
        return (
          <AboutYouStep 
            formData={formData} 
            handleInputChange={handleInputChange}
            handleMultipleSelectChange={handleMultipleSelectChange}
          />
        );
      case 3:
        return (
          <PreferencesStep 
            formData={formData} 
            handleInputChange={handleInputChange}
            handleMultipleSelectChange={handleMultipleSelectChange}
            handleRangeChange={handleRangeChange}
          />
        );
      case 4:
        return (
          <PhotoUploadStep 
            formData={formData} 
            handlePhotoUpload={handlePhotoUpload}
            handlePhotoRemove={handlePhotoRemove}
          />
        );
      case 5:
        return (
          <CompleteStep formData={formData} />
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.wizardContainer}>
      <div className={styles.wizardHeader}>
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
          <span>Living Lavender</span>
        </div>
        <div className={styles.progressContainer}>
          {Array.from({ length: totalSteps }, (_, i) => (
            <div 
              key={i} 
              className={`${styles.progressStep} ${currentStep > i + 1 ? styles.completed : ''} ${currentStep === i + 1 ? styles.active : ''}`}
            >
              <div className={styles.progressDot}>{i + 1}</div>
              <div className={styles.progressLabel}>
                {i === 0 && 'Basic Info'}
                {i === 1 && 'About You'}
                {i === 2 && 'Preferences'}
                {i === 3 && 'Photos'}
                {i === 4 && 'Complete'}
              </div>
            </div>
          ))}
          <div className={styles.progressBar}>
            <div 
              className={styles.progressIndicator} 
              style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className={styles.wizardContent}>
        {submitError && (
          <div className={styles.errorMessage}>
            {submitError}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {renderStep()}
          
          <div className={styles.wizardNavigation}>
            {currentStep > 1 && (
              <button 
                type="button" 
                className={`btn btn-outline ${styles.wizardBtn}`} 
                onClick={prevStep}
                disabled={isSubmitting}
              >
                Back
              </button>
            )}
            
            <button 
              type="submit" 
              className={`btn btn-primary ${styles.wizardBtn}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : (currentStep === totalSteps ? 'Complete Profile' : 'Continue')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OnboardingWizard;