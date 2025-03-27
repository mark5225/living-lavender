import { useState, useRef } from 'react';
import Image from 'next/image';
import styles from '../OnboardingWizard.module.css';

const PhotoUploadStep = ({ formData, handlePhotoUpload, handlePhotoRemove }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);
  
  const MAX_PHOTOS = 6;
  const MAX_SIZE_MB = 10;
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];
  
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
    if (formData.photos.length >= MAX_PHOTOS) {
      setUploadError(`You can only upload a maximum of ${MAX_PHOTOS} photos.`);
      return;
    }
    
    // Check how many more we can add
    const remainingSlots = MAX_PHOTOS - formData.photos.length;
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
      const newPhotos = validFiles.map(file => ({
        file,
        url: URL.createObjectURL(file),
        name: file.name
      }));
      
      handlePhotoUpload(newPhotos);
    }
  };
  
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepHeader}>
        <h2 className={styles.stepTitle}>Upload your photos</h2>
        <p className={styles.stepDescription}>
          Add up to {MAX_PHOTOS} photos to your profile. Your first photo will be your main profile picture.
        </p>
      </div>
      
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
      
      <div className={styles.uploadedPhotos}>
        <h3 className={styles.uploadedTitle}>
          Uploaded Photos {formData.photos.length > 0 && `(${formData.photos.length}/${MAX_PHOTOS})`}
        </h3>
        
        {formData.photos.length === 0 ? (
          <p className={styles.noPhotos}>No photos uploaded yet</p>
        ) : (
          <div className={styles.photoGrid}>
            {formData.photos.map((photo, index) => (
              <div key={index} className={styles.photoItem}>
                <div className={styles.photoContainer}>
                  <Image 
                    src={photo.url} 
                    alt={`Uploaded photo ${index + 1}`} 
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                  {index === 0 && (
                    <div className={styles.mainPhotoLabel}>Main</div>
                  )}
                </div>
                <button 
                  type="button" 
                  className={styles.removePhoto}
                  onClick={() => handlePhotoRemove(index)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            ))}
            
            {formData.photos.length < MAX_PHOTOS && (
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
      </div>
      
      <div className={styles.photoTips}>
        <h3>Photo Tips</h3>
        <ul>
          <li>Choose a clear, well-lit photo of your face for your main picture</li>
          <li>Include full-body photos to give a complete impression</li>
          <li>Add photos of you doing things you enjoy</li>
          <li>Higher quality photos get more attention</li>
        </ul>
      </div>
    </div>
  );
};

export default PhotoUploadStep;