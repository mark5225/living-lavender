import { useState, useEffect } from 'react';
import styles from '../OnboardingWizard.module.css';

const PreferencesStep = ({ 
  formData, 
  handleInputChange, 
  handleMultipleSelectChange,
  handleRangeChange 
}) => {
  const [selectedGenders, setSelectedGenders] = useState(formData.lookingFor || []);
  const [ageRange, setAgeRange] = useState(formData.ageRange || { min: 18, max: 50 });
  const [distance, setDistance] = useState(formData.distance || 50);
  
  const genderOptions = ["Male", "Female", "Non-binary"];
  
  const relationshipOptions = [
    "Long-term relationship",
    "Short-term relationship",
    "Casual dating",
    "Friendship",
    "Not sure yet"
  ];
  
  useEffect(() => {
    // Initialize state from formData on first render
    if (formData.lookingFor) setSelectedGenders(formData.lookingFor);
    if (formData.ageRange) setAgeRange(formData.ageRange);
    if (formData.distance) setDistance(formData.distance);
  }, []);
  
  const handleGenderToggle = (gender) => {
    let updatedGenders;
    
    if (selectedGenders.includes(gender)) {
      updatedGenders = selectedGenders.filter(g => g !== gender);
    } else {
      updatedGenders = [...selectedGenders, gender];
    }
    
    setSelectedGenders(updatedGenders);
    handleMultipleSelectChange('lookingFor', updatedGenders);
  };
  
  const handleAgeRangeChange = (e) => {
    const { name, value } = e.target;
    const newValue = parseInt(value);
    
    let updatedRange = { ...ageRange };
    
    if (name === 'minAge') {
      updatedRange.min = Math.min(newValue, ageRange.max - 1);
    } else if (name === 'maxAge') {
      updatedRange.max = Math.max(newValue, ageRange.min + 1);
    }
    
    setAgeRange(updatedRange);
    handleRangeChange('ageRange', updatedRange);
  };
  
  const handleDistanceChange = (e) => {
    const newDistance = parseInt(e.target.value);
    setDistance(newDistance);
    handleInputChange({
      target: {
        name: 'distance',
        value: newDistance
      }
    });
  };
  
  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeader}>
        <h2 className={styles.stepTitle}>Set your preferences</h2>
        <p className={styles.stepDescription}>
          Tell us what you're looking for to help us find your perfect match.
        </p>
      </div>
      
      <div className="form-group">
        <label className="form-label">I'm interested in</label>
        <div className={styles.genderToggleGroup}>
          {genderOptions.map(gender => (
            <div 
              key={gender}
              className={`${styles.genderToggle} ${
                selectedGenders.includes(gender) ? styles.selected : ''
              }`}
              onClick={() => handleGenderToggle(gender)}
            >
              {gender}
            </div>
          ))}
        </div>
        {selectedGenders.length === 0 && (
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
              value={ageRange.min}
              onChange={handleAgeRangeChange}
            />
            <span className={styles.ageRangeSeparator}>to</span>
            <input
              type="number"
              name="maxAge"
              className={`form-control ${styles.ageInput}`}
              min="19"
              max="100"
              value={ageRange.max}
              onChange={handleAgeRangeChange}
            />
          </div>
          <div className={styles.ageRangeSlider}>
            <div className={styles.sliderTrack}>
              <div 
                className={styles.sliderFill}
                style={{
                  left: `${((ageRange.min - 18) / 82) * 100}%`,
                  width: `${((ageRange.max - ageRange.min) / 82) * 100}%`
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="form-group">
        <label className="form-label">Maximum Distance</label>
        <div className={styles.distanceContainer}>
          <input
            type="range"
            className={styles.distanceSlider}
            min="5"
            max="100"
            step="5"
            value={distance}
            onChange={handleDistanceChange}
          />
          <div className={styles.distanceValue}>{distance} miles</div>
        </div>
      </div>
      
      <div className="form-group">
        <label className="form-label">Looking for</label>
        <select
          name="relationshipType"
          className="form-control"
          value={formData.relationshipType}
          onChange={handleInputChange}
        >
          <option value="">Select what you're looking for</option>
          {relationshipOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default PreferencesStep;