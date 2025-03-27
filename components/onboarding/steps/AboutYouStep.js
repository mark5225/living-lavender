import { useState } from 'react';
import styles from '../OnboardingWizard.module.css';

const AboutYouStep = ({ formData, handleInputChange, handleMultipleSelectChange }) => {
  const [selectedInterests, setSelectedInterests] = useState(formData.interests || []);
  
  const interestOptions = [
    "Travel", "Reading", "Fitness", "Cooking", "Photography", 
    "Music", "Movies", "Art", "Dance", "Hiking", 
    "Yoga", "Technology", "Gaming", "Sports", "Fashion", 
    "Writing", "Volunteering", "Food", "Animals", "Spirituality"
  ];

  const educationOptions = [
    "High School", "Some College", "Associate's Degree", 
    "Bachelor's Degree", "Master's Degree", "PhD", "Trade School"
  ];
  
  const handleInterestChange = (interest) => {
    let updatedInterests;
    
    if (selectedInterests.includes(interest)) {
      updatedInterests = selectedInterests.filter(item => item !== interest);
    } else {
      updatedInterests = [...selectedInterests, interest];
    }
    
    setSelectedInterests(updatedInterests);
    handleMultipleSelectChange('interests', updatedInterests);
  };
  
  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeader}>
        <h2 className={styles.stepTitle}>Tell us more about you</h2>
        <p className={styles.stepDescription}>
          Help us understand your interests and background to find compatible matches.
        </p>
      </div>
      
      <div className="form-group">
        <label className="form-label">Bio</label>
        <textarea
          name="bio"
          className="form-control"
          value={formData.bio}
          onChange={handleInputChange}
          rows={4}
          placeholder="Tell potential matches about yourself..."
          maxLength={500}
        />
        <div className={styles.charCount}>
          {formData.bio ? formData.bio.length : 0}/500
        </div>
      </div>
      
      <div className="form-group">
        <label className="form-label">Occupation</label>
        <input
          type="text"
          name="occupation"
          className="form-control"
          value={formData.occupation}
          onChange={handleInputChange}
          placeholder="What do you do for work?"
        />
      </div>
      
      <div className="form-group">
        <label className="form-label">Education</label>
        <select
          name="education"
          className="form-control"
          value={formData.education}
          onChange={handleInputChange}
        >
          <option value="">Select your education level</option>
          {educationOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
      
      <div className="form-group">
        <label className="form-label">Interests</label>
        <p className={styles.interestNote}>Select all that apply (at least 3 recommended)</p>
        
        <div className={styles.interestsGrid}>
          {interestOptions.map(interest => (
            <div 
              key={interest}
              className={`${styles.interestItem} ${
                selectedInterests.includes(interest) ? styles.selected : ''
              }`}
              onClick={() => handleInterestChange(interest)}
            >
              {interest}
            </div>
          ))}
        </div>
        
        {selectedInterests.length < 3 && (
          <p className={styles.interestWarning}>
            Please select at least 3 interests to help us find the best matches for you.
          </p>
        )}
      </div>
    </div>
  );
};

export default AboutYouStep;