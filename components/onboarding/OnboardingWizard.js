'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './OnboardingWizard.module.css';

// Import step components
import BasicInfoStep from './steps/BasicInfoStep';
import AboutYouStep from './steps/AboutYouStep';
import PreferencesStep from './steps/PreferencesStep';
import PhotoUploadStep from './steps/PhotoUploadStep';
import CompleteStep from './steps/CompleteStep';

const OnboardingWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
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
        // Here you would typically send the data to your API
        console.log('Submitting data:', formData);
        // If successful, you'd navigate to the dashboard or profile page
      } catch (error) {
        console.error('Error submitting form:', error);
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
          <Image 
            src="/images/logo.svg" 
            alt="Living Lavender Logo" 
            width={40} 
            height={40} 
          />
          <span>Living Lavender</span>
        </div>
        <div className={styles.progressContainer}>
          {Array.from({ length: totalSteps }, (_, i) => (
            <div 
              key={i} 
              className={`${styles.progressStep} ${currentStep > i ? styles.completed : ''} ${currentStep === i + 1 ? styles.active : ''}`}
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
        <form onSubmit={handleSubmit}>
          {renderStep()}
          
          <div className={styles.wizardNavigation}>
            {currentStep > 1 && (
              <button 
                type="button" 
                className={`btn btn-outline ${styles.wizardBtn}`} 
                onClick={prevStep}
              >
                Back
              </button>
            )}
            
            <button 
              type="submit" 
              className={`btn btn-primary ${styles.wizardBtn}`}
            >
              {currentStep === totalSteps ? 'Complete Profile' : 'Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OnboardingWizard;