'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../../../contexts/AuthContext';
import ProtectedRoute from '../../../components/routing/ProtectedRoute';
import styles from './profile-edit.module.css';

// Interest options for selection
const interestOptions = [
  "Travel", "Reading", "Fitness", "Cooking", "Photography", 
  "Music", "Movies", "Art", "Dance", "Hiking", 
  "Yoga", "Technology", "Gaming", "Sports", "Fashion", 
  "Writing", "Volunteering", "Food", "Animals", "Spirituality"
];

// Education options for dropdown
const educationOptions = [
  "High School", "Some College", "Associate's Degree", 
  "Bachelor's Degree", "Master's Degree", "PhD", "Trade School"
];

// Relationship type options
const relationshipOptions = [
  "Long-term relationship",
  "Short-term relationship",
  "Casual dating",
  "Friendship",
  "Not sure yet"
];

export default function EditProfilePage() {
  const { user, updateProfile } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('basic');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  
  // Form data states
  const [basicInfo, setBasicInfo] = useState({
    firstName: '',
    lastName: '',
    birthdate: '',
    gender: '',
    location: '',
    bio: '',
    occupation: '',
    education: ''
  });
  
  const [interests, setInterests] = useState([]);
  
  const [preferences, setPreferences] = useState({
    lookingFor: [],
    ageRange: { min: 18, max: 50 },
    distance: 50,
    relationshipType: ''
  });
  
  const [photos, setPhotos] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState('');
  
  const fileInputRef = useRef(null);
  
  // Max values for photos
  const MAX_PHOTOS = 6;
  const MAX_SIZE_MB = 10;
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];
  
  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      // Basic info
      setBasicInfo({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        birthdate: user.profile?.birthdate || '',
        gender: user.profile?.gender || '',
        location: user.profile?.location || '',
        bio: user.profile?.bio || '',
        occupation: user.profile?.occupation || '',
        education: user.profile?.education || ''
      });
      
      // Interests
      if (user.profile?.interests) {
        setInterests(user.profile.interests);
      }
      
      // Preferences
      if (user.profile?.preferences) {
        setPreferences({
          lookingFor: user.profile.preferences.lookingFor || [],
          ageRange: user.profile.preferences.ageRange || { min: 18, max: 50 },
          distance: user.profile.preferences.distance || 50,
          relationshipType: user.profile.preferences.relationshipType || ''
        });
      }
      
      // Photos
      if (user.profile?.photos) {
        setPhotos(user.profile.photos);
      }
    }
  }, [user]);
  
  // Handle tab switching
  const switchTab = (tabName) => {
    setActiveTab(tabName);
    setMessage({ type: '', text: '' });
  };
  
  // Handle form input changes for basic info
  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target;
    setBasicInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle interest selection
  const handleInterestToggle = (interest) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter(item => item !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };
  
  // Handle looking for gender selection
  const handleGenderToggle = (gender) => {
    if (preferences.lookingFor.includes(gender)) {
      setPreferences({
        ...preferences,
        lookingFor: preferences.lookingFor.filter(g => g !== gender)
      });
    } else {
      setPreferences({
        ...preferences,
        lookingFor: [...preferences.lookingFor, gender]
      });
    }
  };
  
  // Handle age range input changes
  const handleAgeRangeChange = (e) => {
    const { name, value } = e.target;
    const newValue = parseInt(value);
    
    let updatedRange = { ...preferences.ageRange };
    
    if (name === 'minAge') {
      updatedRange.min = Math.min(newValue, preferences.ageRange.max - 1);
    } else if (name === 'maxAge') {
      updatedRange.max = Math.max(newValue, preferences.ageRange.min + 1);
    }
    
    setPreferences({
      ...preferences,
      ageRange: updatedRange
    });
  };
  
  // Handle distance slider change
  const handleDistanceChange = (e) => {
    const newDistance = parseInt(e.target.value);
    setPreferences({
      ...preferences,
      distance: newDistance
    });
  };
  
  // Handle relationship type selection
  const handleRelationshipTypeChange = (e) => {
    setPreferences({
      ...preferences,
      relationshipType: e.target.value
    });
  };
  
  // Photo upload handlers
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files) {
      const files = Array.from(e.dataTransfer.files);
      processFiles(files);
    }
  };
  
  const processFiles = (files) => {
    setUploadError('');
    
    // Check if we already have max photos
    if (photos.length >= MAX_PHOTOS) {
      setUploadError(`You can only upload a maximum of ${MAX_PHOTOS} photos.`);
      return;
    }
    
    // Check how many more we can add
    const remainingSlots = MAX_PHOTOS - photos.length;
    const filesToProcess = files.slice(0, remainingSlots);
    
    // Validate each file
    const validFiles = [];
    
    for (const file of filesToProcess) {
      // Check file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        setUploadError('Only JPG and PNG images are allowed.');
        return;
      }
      
      // Check file size
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setUploadError(`Images must be less than ${MAX_SIZE_MB}MB.`);
        return;
      }
      
      validFiles.push(file);
    }
    
    // If we have valid files, create URLs and add them
    if (validFiles.length > 0) {
      const newPhotos = validFiles.map((file, index) => ({
        file,
        url: URL.createObjectURL(file),
        isMain: photos.length === 0 && index === 0 // First photo as main if no photos exist
      }));
      
      setPhotos(prev => [...prev, ...newPhotos]);
    }
  };
  
  const handleRemovePhoto = (index) => {
    // If removing main photo, make the next one main
    const isRemovingMain = photos[index].isMain;
    
    const updatedPhotos = photos.filter((_, i) => i !== index);
    
    if (isRemovingMain && updatedPhotos.length > 0) {
      updatedPhotos[0].isMain = true;
    }
    
    setPhotos(updatedPhotos);
  };
  
  const setMainPhoto = (index) => {
    const updatedPhotos = photos.map((photo, i) => ({
      ...photo,
      isMain: i === index
    }));
    
    setPhotos(updatedPhotos);
  };
  
  // Save changes for the current tab
  const saveChanges = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      let updatedProfile = {};
      
      if (activeTab === 'basic') {
        updatedProfile = {
          ...user.profile,
          birthdate: basicInfo.birthdate,
          gender: basicInfo.gender,
          location: basicInfo.location,
          bio: basicInfo.bio,
          occupation: basicInfo.occupation,
          education: basicInfo.education
        };
      } else if (activeTab === 'interests') {
        updatedProfile = {
          ...user.profile,
          interests
        };
      } else if (activeTab === 'preferences') {
        updatedProfile = {
          ...user.profile,
          preferences
        };
      } else if (activeTab === 'photos') {
        updatedProfile = {
          ...user.profile,
          photos
        };
      }
      
      // For demo purposes, we'll just update the profile in local context
      const result = updateProfile(updatedProfile);
      
      if (result.success) {
        setMessage({ 
          type: 'success', 
          text: 'Profile updated successfully!' 
        });
      } else {
        setMessage({ 
          type: 'error', 
          text: 'Failed to update profile. Please try again.' 
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ 
        type: 'error', 
        text: 'An error occurred while updating your profile.' 
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <ProtectedRoute>
      <div className={styles.editProfileContainer}>
        <div className="container">
          <div className={styles.editHeader}>
            <h1>Edit Your Profile</h1>
            <p>Update your information to improve your matches</p>
          </div>
          
          <div className={styles.formContainer}>
            {/* Tab Navigation */}
            <div className={styles.formNavigation}>
              <button 
                className={`${styles.navTab} ${activeTab === 'basic' ? styles.active : ''}`}
                onClick={() => switchTab('basic')}
              >
                Basic Information
              </button>
              <button 
                className={`${styles.navTab} ${activeTab === 'interests' ? styles.active : ''}`}
                onClick={() => switchTab('interests')}
              >
                Interests
              </button>
              <button 
                className={`${styles.navTab} ${activeTab === 'preferences' ? styles.active : ''}`}
                onClick={() => switchTab('preferences')}
              >
                Preferences
              </button>
              <button 
                className={`${styles.navTab} ${activeTab === 'photos' ? styles.active : ''}`}
                onClick={() => switchTab('photos')}
              >
                Photos
              </button>
            </div>
            
            {/* Success/Error Messages */}
            {message.type && (
              <div className={message.type === 'success' ? styles.successMessage : styles.errorMessage}>
                {message.text}
              </div>
            )}
            
            {/* Basic Information Tab */}
            <div className={`${styles.tabContent} ${activeTab === 'basic' ? styles.active : ''}`}>
              <div className={styles.formSection}>
                <h2>Personal Details</h2>
                <div className={styles.formRow}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="firstName">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      className="form-control"
                      value={basicInfo.firstName}
                      onChange={handleBasicInfoChange}
                      disabled={true} // Name can't be changed
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label" htmlFor="lastName">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      className="form-control"
                      value={basicInfo.lastName}
                      onChange={handleBasicInfoChange}
                      disabled={true} // Name can't be changed
                    />
                  </div>
                </div>
                
                <div className={styles.formRow}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="birthdate">Date of Birth</label>
                    <input
                      type="date"
                      id="birthdate"
                      name="birthdate"
                      className="form-control"
                      value={basicInfo.birthdate}
                      onChange={handleBasicInfoChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label" htmlFor="gender">Gender</label>
                    <select
                      id="gender"
                      name="gender"
                      className="form-control"
                      value={basicInfo.gender}
                      onChange={handleBasicInfoChange}
                    >
                      <option value="">Select your gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="non-binary">Non-binary</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label" htmlFor="location">Location</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    className="form-control"
                    value={basicInfo.location}
                    onChange={handleBasicInfoChange}
                    placeholder="City, State"
                  />
                </div>
              </div>
              
              <div className={styles.formSection}>
                <h2>About You</h2>
                <div className="form-group">
                  <label className="form-label" htmlFor="bio">Bio</label>
                  <textarea
                    id="bio"
                    name="bio"
                    className="form-control"
                    value={basicInfo.bio}
                    onChange={handleBasicInfoChange}
                    rows={4}
                    placeholder="Tell potential matches about yourself..."
                    maxLength={500}
                  ></textarea>
                  <div className={styles.bioCharCount}>
                    {basicInfo.bio ? basicInfo.bio.length : 0}/500
                  </div>
                </div>
                
                <div className={styles.formRow}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="occupation">Occupation</label>
                    <input
                      type="text"
                      id="occupation"
                      name="occupation"
                      className="form-control"
                      value={basicInfo.occupation}
                      onChange={handleBasicInfoChange}
                      placeholder="What do you do for work?"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label" htmlFor="education">Education</label>
                    <select
                      id="education"
                      name="education"
                      className="form-control"
                      value={basicInfo.education}
                      onChange={handleBasicInfoChange}
                    >
                      <option value="">Select your education level</option>
                      {educationOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Interests Tab */}
            <div className={`${styles.tabContent} ${activeTab === 'interests' ? styles.active : ''}`}>
              <div className={styles.formSection}>
                <h2>Your Interests</h2>
                <p className={styles.interestNote}>Select all that apply (at least 3 recommended)</p>
                
                <div className={styles.interestsGrid}>
                  {interestOptions.map(interest => (
                    <div 
                      key={interest}
                      className={`${styles.interestItem} ${
                        interests.includes(interest) ? styles.selected : ''
                      }`}
                      onClick={() => handleInterestToggle(interest)}
                    >
                      {interest}
                    </div>
                  ))}
                </div>
                
                {interests.length < 3 && (
                  <p className={styles.errorText}>
                    Please select at least 3 interests to help us find the best matches for you.
                  </p>
                )}
              </div>
            </div>
            
            {/* Preferences Tab */}
            <div className={`${styles.tabContent} ${activeTab === 'preferences' ? styles.active : ''}`}>
              <div className={styles.formSection}>
                <h2>Dating Preferences</h2>
                
                <div className="form-group">
                  <label className="form-label">I'm interested in</label>
                  <div className={styles.genderToggleGroup}>
                    {["Male", "Female", "Non-binary"].map(gender => (
                      <div 
                        key={gender}
                        className={`${styles.genderToggle} ${
                          preferences.lookingFor.includes(gender) ? styles.selected : ''
                        }`}
                        onClick={() => handleGenderToggle(gender)}
                      >
                        {gender}
                      </div>
                    ))}
                  </div>
                  {preferences.lookingFor.length === 0 && (
                    <p className={styles.errorText}>Please select at least one option</p>
                  )}
                </div>
                
                <div className="form-group">
                  <label className="form-label">Age Range</label>
                  <div className={styles.ageRangeContainer}>
                    <div className={styles.ageInputGroup}>
                      <input
                        type="number"
                        name="minAge"
                        className={`form-control ${styles.ageInput}`}
                        min="18"
                        max="99"
                        value={preferences.ageRange.min}
                        onChange={handleAgeRangeChange}
                      />
                      <span className={styles.ageRangeSeparator}>to</span>
                      <input
                        type="number"
                        name="maxAge"
                        className={`form-control ${styles.ageInput}`}
                        min="19"
                        max="100"
                        value={preferences.ageRange.max}
                        onChange={handleAgeRangeChange}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Maximum Distance</label>
                  <div className={styles.distanceContainer}>
                    <input
                      type="range"
                      className={styles.rangeSlider}
                      min="5"
                      max="100"
                      step="5"
                      value={preferences.distance}
                      onChange={handleDistanceChange}
                    />
                    <div className={styles.rangeValue}>{preferences.distance} miles</div>
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Looking for</label>
                  <select
                    name="relationshipType"
                    className="form-control"
                    value={preferences.relationshipType}
                    onChange={handleRelationshipTypeChange}
                  >
                    <option value="">Select what you're looking for</option>
                    {relationshipOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            {/* Photos Tab */}
            <div className={`${styles.tabContent} ${activeTab === 'photos' ? styles.active : ''}`}>
              <div className={styles.photoUploadSection}>
                <h2>Profile Photos</h2>
                
                {uploadError && (
                  <div className={styles.errorMessage}>
                    {uploadError}
                  </div>
                )}
                
                <div 
                  className={`${styles.dropzone} ${isDragging ? styles.dragging : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={triggerFileInput}
                >
                  <input
                    type="file"
                    accept="image/jpeg, image/png"
                    multiple
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className={styles.fileInput}
                  />
                  <div className={styles.dropzoneContent}>
                    <div className={styles.uploadIcon}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                      </svg>
                    </div>
                    <p className={styles.dropzoneText}>
                      Drag and drop photos here, or <span className={styles.browseLink}>click to browse</span>
                    </p>
                    <p className={styles.dropzoneHint}>
                      JPG or PNG, max {MAX_SIZE_MB}MB each
                    </p>
                  </div>
                </div>
                
                <h3 className="mt-4 mb-2">
                  Your Photos {photos.length > 0 && `(${photos.length}/${MAX_PHOTOS})`}
                </h3>
                
                {photos.length === 0 ? (
                  <p className={styles.noBio}>No photos uploaded yet</p>
                ) : (
                  <div className={styles.photoGrid}>
                    {photos.map((photo, index) => (
                      <div key={index} className={styles.photoItem}>
                        <div className={styles.photoContainer}>
                          <Image 
                            src={photo.url} 
                            alt={`Profile photo ${index + 1}`} 
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                          {photo.isMain && (
                            <div className={styles.mainPhotoLabel}>Main</div>
                          )}
                        </div>
                        
                        <button 
                          type="button" 
                          className={styles.removePhoto}
                          onClick={() => handleRemovePhoto(index)}
                          title="Remove photo"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                        
                        {!photo.isMain && (
                          <button 
                            type="button" 
                            className={styles.makeMainPhoto}
                            onClick={() => setMainPhoto(index)}
                            title="Set as main photo"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                    
                    {photos.length < MAX_PHOTOS && (
                      <div 
                        className={styles.addMorePhotos}
                        onClick={triggerFileInput}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="5" x2="12" y2="19"></line>
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        <span>Add More</span>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="mt-4">
                  <p className={styles.interestNote}>
                    Profile photos tips:
                  </p>
                  <ul className="text-text-light">
                    <li>Choose a clear, well-lit photo of your face for your main picture</li>
                    <li>Include full-body photos to give a complete impression</li>
                    <li>Add photos of you doing things you enjoy</li>
                    <li>Higher quality photos get more attention</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Form Actions */}
            <div className={styles.formActions}>
              <Link href="/dashboard" className="btn btn-outline">
                Cancel
              </Link>
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={saveChanges}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}