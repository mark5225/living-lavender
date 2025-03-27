import styles from '../OnboardingWizard.module.css';

const BasicInfoStep = ({ formData, handleInputChange }) => {
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 100;
  const maxYear = currentYear - 18;
  
  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeader}>
        <h2 className={styles.stepTitle}>Tell us about yourself</h2>
        <p className={styles.stepDescription}>
          Let's start with some basic information to set up your profile.
        </p>
      </div>
      
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
            placeholder="Your first name"
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
            placeholder="Your last name"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label" htmlFor="birthdate">Date of Birth</label>
          <input
            type="date"
            id="birthdate"
            name="birthdate"
            className="form-control"
            value={formData.birthdate}
            onChange={handleInputChange}
            required
            min={`${minYear}-01-01`}
            max={`${maxYear}-12-31`}
          />
        </div>
        
        <div className="form-group">
          <label className="form-label" htmlFor="gender">Gender</label>
          <select
            id="gender"
            name="gender"
            className="form-control"
            value={formData.gender}
            onChange={handleInputChange}
            required
          >
            <option value="">Select your gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="non-binary">Non-binary</option>
            <option value="other">Other</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </div>
        
        <div className="form-group">
          <label className="form-label" htmlFor="location">City</label>
          <input
            type="text"
            id="location"
            name="location"
            className="form-control"
            value={formData.location}
            onChange={handleInputChange}
            required
            placeholder="Where do you live?"
          />
        </div>
      </div>
      
      <div className={styles.formNote}>
        <p>
          Your precise location is never shared with other members. 
          We only use this to show you matches in your area.
        </p>
      </div>
    </div>
  );
};

export default BasicInfoStep;