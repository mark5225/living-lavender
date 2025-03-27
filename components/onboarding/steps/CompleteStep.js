import Image from 'next/image';
import styles from '../OnboardingWizard.module.css';

const CompleteStep = ({ formData }) => {
  // Calculate profile completion percentage
  const calculateCompletion = () => {
    const requiredFields = [
      'firstName', 
      'lastName', 
      'birthdate', 
      'gender', 
      'location'
    ];
    
    const recommendedFields = [
      'bio',
      'occupation', 
      'education',
      'interests',
      'lookingFor',
      'relationshipType'
    ];
    
    // Check if photos are added
    const hasPhotos = formData.photos && formData.photos.length > 0;
    
    // Count required fields
    let requiredCount = 0;
    for (const field of requiredFields) {
      if (formData[field]) requiredCount++;
    }
    
    // Count recommended fields
    let recommendedCount = 0;
    for (const field of recommendedFields) {
      // Check if array has values or string is not empty
      if (Array.isArray(formData[field])) {
        if (formData[field].length > 0) recommendedCount++;
      } else if (formData[field]) {
        recommendedCount++;
      }
    }
    
    // Calculate weighted percentage
    const requiredPercentage = (requiredCount / requiredFields.length) * 50;
    const recommendedPercentage = (recommendedCount / recommendedFields.length) * 30;
    const photoPercentage = hasPhotos ? 20 : 0;
    
    return Math.round(requiredPercentage + recommendedPercentage + photoPercentage);
  };
  
  const completion = calculateCompletion();
  
  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeader}>
        <h2 className={styles.stepTitle}>You're all set!</h2>
        <p className={styles.stepDescription}>
          Your profile is ready to go. Here's a summary of your information.
        </p>
      </div>
      
      <div className={styles.completionSummary}>
        <div className={styles.completionCircle}>
          <svg viewBox="0 0 36 36" className={styles.completionChart}>
            <path
              className={styles.completionCircleBg}
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className={styles.completionCircleFill}
              strokeDasharray={`${completion}, 100`}
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <text x="18" y="20.35" className={styles.completionText}>
              {completion}%
            </text>
          </svg>
        </div>
        <p className={styles.completionMessage}>
          {completion < 50 && 'Your profile is just getting started. Consider adding more details to stand out!'}
          {completion >= 50 && completion < 80 && 'Your profile is looking good! A few more details will help you get better matches.'}
          {completion >= 80 && 'Excellent! Your profile is very complete and will make a great impression.'}
        </p>
      </div>
      
      <div className={styles.profilePreview}>
        <h3 className={styles.previewTitle}>Profile Preview</h3>
        
        <div className={styles.previewCard}>
          <div className={styles.previewHeader}>
            {formData.photos && formData.photos.length > 0 ? (
              <div className={styles.previewPhoto}>
                <Image 
                  src={formData.photos[0].url} 
                  alt="Profile Preview" 
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
            ) : (
              <div className={styles.previewPhotoPlaceholder}>
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
            )}
            
            <div className={styles.previewInfo}>
              <h2 className={styles.previewName}>
                {formData.firstName} {formData.lastName}
                {formData.age && `, ${formData.age}`}
              </h2>
              <p className={styles.previewLocation}>
                {formData.location}
              </p>
              {formData.occupation && (
                <p className={styles.previewOccupation}>
                  {formData.occupation}
                </p>
              )}
            </div>
          </div>
          
          <div className={styles.previewBody}>
            {formData.bio ? (
              <p className={styles.previewBio}>{formData.bio}</p>
            ) : (
              <p className={styles.previewBioEmpty}>No bio added yet</p>
            )}
            
            {formData.interests && formData.interests.length > 0 && (
              <div className={styles.previewInterests}>
                <h4>Interests</h4>
                <div className={styles.previewInterestsList}>
                  {formData.interests.map((interest, index) => (
                    <span key={index} className={styles.previewInterestTag}>
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className={styles.completeNote}>
        <h3>What's Next?</h3>
        <ul>
          <li>Your profile will be reviewed by our team (usually within 24 hours)</li>
          <li>You'll start receiving compatible matches once approved</li>
          <li>You can edit your profile anytime from your settings</li>
        </ul>
      </div>
    </div>
  );
};

export default CompleteStep;