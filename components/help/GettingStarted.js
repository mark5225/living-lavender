'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import styles from './getting-started.module.css';

// List of steps for getting started
const steps = [
  {
    id: 'create-account',
    title: 'Create Your Account',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="8.5" cy="7" r="4"></circle>
        <line x1="20" y1="8" x2="20" y2="14"></line>
        <line x1="23" y1="11" x2="17" y2="11"></line>
      </svg>
    ),
    content: "Sign up for Living Lavender by providing your email address and creating a secure password. You can also sign up using your Google or Facebook account for convenience. After signing up, verify your email to activate your account.",
    tips: [
      "Use a strong, unique password that you don't use on other sites",
      "Make sure to use a current email address that you check regularly",
      "If you sign up with social media, review which permissions you're granting"
    ],
    buttonText: "Create Account",
    buttonLink: "/signup"
  },
  {
    id: 'complete-profile',
    title: 'Complete Your Profile',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    ),
    content: "Fill out your profile information including basic details, interests, and what you're looking for in a relationship. Upload clear, recent photos that show your face and represent your personality. Profiles with complete information receive significantly more matches!",
    tips: [
      "Add at least 3-5 photos, including one clear headshot",
      "Be specific and authentic in your bio and interests",
      "Take your time with the personality assessment for better matches",
      "Mention some conversation starters in your profile"
    ],
    buttonText: "Edit Profile",
    buttonLink: "/profile/edit"
  },
  {
    id: 'set-preferences',
    title: 'Set Your Preferences',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9"></path>
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
      </svg>
    ),
    content: "Define your match preferences including age range, distance, relationship goals, and other important criteria. Our algorithm uses these preferences along with your personality profile to suggest compatible matches. You can adjust these preferences at any time.",
    tips: [
      "Be open to a reasonable age range for more potential matches",
      "Consider setting your distance higher if you live in a less populated area",
      "Prioritize your deal-breakers, but try to be flexible with preferences",
      "Update your preferences periodically based on your dating experiences"
    ],
    buttonText: "Update Preferences",
    buttonLink: "/settings/preferences"
  },
  {
    id: 'discover-matches',
    title: 'Discover Matches',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
    ),
    content: "Browse through your suggested matches and express interest in people you'd like to connect with. Our algorithm learns from your preferences over time to suggest more compatible matches. New matches are added regularly, so check back often!",
    tips: [
      "Take time to read profiles before making a decision",
      "Don't rely solely on photos – compatibility factors matter for long-term connections",
      "Give people a chance if they match most of your important criteria",
      "Check your matches daily for the best results – new people join all the time"
    ],
    buttonText: "See Matches",
    buttonLink: "/matches"
  },
  {
    id: 'start-conversations',
    title: 'Start Conversations',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    ),
    content: "Once you match with someone, you can start messaging them through our secure platform. Begin with thoughtful messages that reference specific details from their profile to show you've taken an interest in who they are. Quality conversations lead to meaningful connections!",
    tips: [
      "Start with a personalized message that references their profile",
      "Ask open-ended questions that can't be answered with just 'yes' or 'no'",
      "Be genuine and authentic in your conversations",
      "Respond within a reasonable timeframe to maintain momentum",
      "Move at a comfortable pace – don't rush or pressure for personal information"
    ],
    buttonText: "View Messages",
    buttonLink: "/messages"
  },
  {
    id: 'meet-safely',
    title: 'Meet Safely',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      </svg>
    ),
    content: "When you're ready to meet in person, follow our safety guidelines. Always meet in public places, tell someone where you're going, and use your own transportation. Take time to get to know someone before sharing personal information or meeting in private.",
    tips: [
      "Video chat before meeting in person to verify identity",
      "Choose a public location with plenty of people around for your first few dates",
      "Tell a friend or family member about your plans, including who you're meeting and where",
      "Use your own transportation so you can leave if you feel uncomfortable",
      "Trust your instincts – if something feels off, it probably is"
    ],
    buttonText: "Safety Tips",
    buttonLink: "/help/safety-tips"
  }
];

export default function GettingStarted() {
  const [activeStep, setActiveStep] = useState(0);
  
  const handleNextStep = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
      // Scroll to top of content on mobile
      if (window.innerWidth < 768) {
        document.getElementById('step-content')?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };
  
  const handlePrevStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
      // Scroll to top of content on mobile
      if (window.innerWidth < 768) {
        document.getElementById('step-content')?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className={styles.gettingStarted}>
      <div className={styles.guideHero}>
        <div className="container">
          <h1 className={styles.guideTitle}>Getting Started with Living Lavender</h1>
          <p className={styles.guideSubtitle}>
            Welcome to our community! Follow these easy steps to set up your profile and start making meaningful connections.
          </p>
          
          <Link href="/help" className={styles.backLink}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Help Center
          </Link>
        </div>
      </div>
      
      <div className={styles.guideContent}>
        <div className="container">
          <div className={styles.guideContainer}>
            <div className={styles.guideSidebar}>
              <div className={styles.stepsList}>
                {steps.map((step, index) => (
                  <button
                    key={step.id}
                    className={`${styles.stepItem} ${index === activeStep ? styles.active : ''} ${index < activeStep ? styles.completed : ''}`}
                    onClick={() => setActiveStep(index)}
                  >
                    <div className={styles.stepNumber}>
                      {index < activeStep ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      ) : (
                        index + 1
                      )}
                    </div>
                    <div className={styles.stepInfo}>
                      <span className={styles.stepTitle}>{step.title}</span>
                      <span className={styles.stepIcon}>{step.icon}</span>
                    </div>
                  </button>
                ))}
              </div>
              
              <div className={styles.sidebarHelp}>
                <h3>Need More Help?</h3>
                <p>Our support team is available to assist you with any questions.</p>
                <Link href="/contact" className="btn btn-outline">Contact Support</Link>
              </div>
            </div>
            
            <div className={styles.stepContent} id="step-content">
              <div className={styles.stepHeader}>
                <div className={styles.stepHeaderIcon}>
                  {steps[activeStep].icon}
                </div>
                <h2>{steps[activeStep].title}</h2>
              </div>
              
              <div className={styles.stepBody}>
                <p className={styles.stepDescription}>
                  {steps[activeStep].content}
                </p>
                
                <div className={styles.tipsList}>
                  <h3>Helpful Tips:</h3>
                  <ul>
                    {steps[activeStep].tips.map((tip, index) => (
                      <li key={index} className={styles.tipItem}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="9 11 12 14 22 4"></polyline>
                          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                        </svg>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className={styles.stepAction}>
                  <Link href={steps[activeStep].buttonLink} className="btn btn-primary">
                    {steps[activeStep].buttonText}
                  </Link>
                </div>
              </div>
              
              <div className={styles.stepNavigation}>
                <button 
                  className={`btn btn-outline ${styles.prevBtn} ${activeStep === 0 ? styles.disabled : ''}`}
                  onClick={handlePrevStep}
                  disabled={activeStep === 0}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                  Previous
                </button>
                
                <div className={styles.stepIndicator}>
                  {activeStep + 1} of {steps.length}
                </div>
                
                <button 
                  className={`btn btn-primary ${styles.nextBtn} ${activeStep === steps.length - 1 ? styles.disabled : ''}`}
                  onClick={handleNextStep}
                  disabled={activeStep === steps.length - 1}
                >
                  Next
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          <div className={styles.faqs}>
            <h2 className={styles.faqsTitle}>Frequently Asked Questions</h2>
            
            <div className={styles.faqsGrid}>
              <div className={styles.faqCard}>
                <h3>How long does it take to get matches?</h3>
                <p>
                  Most users start seeing matches within 24-48 hours after completing their profile. 
                  The number of matches depends on your location, preferences, and profile completeness.
                </p>
              </div>
              
              <div className={styles.faqCard}>
                <h3>Is Living Lavender free to use?</h3>
                <p>
                  Living Lavender offers both free and premium subscription options. Free members can create a profile,
                  browse matches, and send a limited number of messages. Premium members enjoy unlimited messaging, 
                  advanced filters, and more.
                </p>
              </div>
              
              <div className={styles.faqCard}>
                <h3>How do I get better matches?</h3>
                <p>
                  Complete your profile fully, upload quality photos, be specific about your interests, and engage 
                  actively on the platform. Our algorithm learns from your interactions to improve match quality over time.
                </p>
              </div>
              
              <div className={styles.faqCard}>
                <h3>Can I change my preferences later?</h3>
                <p>
                  Yes! You can update your preferences anytime through your account settings. 
                  Feel free to adjust your preferences as you learn more about what you're looking for.
                </p>
              </div>
            </div>
          </div>
          
          <div className={styles.successBanner}>
            <div className={styles.successIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                <path d="M8 12l2 2 4-4"></path>
              </svg>
            </div>
            <div className={styles.successContent}>
              <h2>Ready to Find Your Perfect Match?</h2>
              <p>
                Thousands of singles are already connecting on Living Lavender. 
                Follow these steps and you'll be making meaningful connections in no time!
              </p>
            </div>
            <Link href="/signup" className="btn btn-primary btn-lg">
              Get Started Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}