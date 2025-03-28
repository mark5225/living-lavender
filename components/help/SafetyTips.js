'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import styles from './safety-tips.module.css';

// Safety tips data
const safetyTips = [
  {
    id: 'online',
    title: 'Online Safety',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      </svg>
    ),
    tips: [
      {
        id: 'tip-1',
        heading: 'Protect Your Personal Information',
        content: 'Never share sensitive information like your full name, address, workplace, financial details, or other identifying information in your profile or in early conversations.'
      },
      {
        id: 'tip-2',
        heading: 'Use the Platform Messaging System',
        content: 'Keep conversations on the Living Lavender platform until you\'re comfortable moving to another messaging service. This helps our team assist if any issues arise.'
      },
      {
        id: 'tip-3',
        heading: 'Be Cautious About Sharing Social Media',
        content: 'Consider waiting to share social media profiles until you\'ve established trust. Your social accounts may contain personal information that could compromise your privacy.'
      },
      {
        id: 'tip-4',
        heading: 'Be Wary of Suspicious Behavior',
        content: 'Be alert if someone seems too perfect, rushes intimacy, avoids video calls, has inconsistent stories, or quickly asks to move communication off the platform.'
      },
      {
        id: 'tip-5',
        heading: 'Report Suspicious Behavior',
        content: 'If someone makes you uncomfortable, asks for money, or violates our community guidelines, use the report function immediately. Your report helps keep our community safe.'
      }
    ]
  },
  {
    id: 'meeting',
    title: 'Meeting In Person',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
        <line x1="6" y1="1" x2="6" y2="4"></line>
        <line x1="10" y1="1" x2="10" y2="4"></line>
        <line x1="14" y1="1" x2="14" y2="4"></line>
      </svg>
    ),
    tips: [
      {
        id: 'meet-1',
        heading: 'Meet in Public Places',
        content: 'Always meet in a public location with plenty of people around for your first few dates. Restaurants, coffee shops, and other public venues are ideal choices.'
      },
      {
        id: 'meet-2',
        heading: 'Tell Someone Your Plans',
        content: 'Let a trusted friend or family member know who you\'re meeting, where you\'ll be, and when you expect to return. Check in with them during the date.'
      },
      {
        id: 'meet-3',
        heading: 'Arrange Your Own Transportation',
        content: 'Plan to drive yourself or use public transportation/rideshare for your first few meetings. This ensures you can leave independently if you feel uncomfortable.'
      },
      {
        id: 'meet-4',
        heading: 'Stay Sober and Alert',
        content: 'Limit alcohol consumption and never leave your food or drinks unattended. Staying clear-headed helps you make better safety decisions.'
      },
      {
        id: 'meet-5',
        heading: 'Trust Your Instincts',
        content: 'If something feels wrong, it probably is. Don\'t worry about being polite – your safety comes first. Have an exit plan ready if you need to leave quickly.'
      },
      {
        id: 'meet-6',
        heading: 'Video Chat Before Meeting',
        content: 'Consider having a video call before meeting in person to verify your match is who they claim to be in their profile photos.'
      }
    ]
  },
  {
    id: 'financial',
    title: 'Financial Safety',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
        <line x1="12" y1="16" x2="12" y2="16"></line>
        <line x1="6" y1="8" x2="6" y2="8"></line>
        <line x1="18" y1="8" x2="18" y2="8"></line>
        <line x1="6" y1="16" x2="6" y2="16"></line>
        <line x1="18" y1="16" x2="18" y2="16"></line>
        <line x1="12" y1="8" x2="12" y2="8"></line>
      </svg>
    ),
    tips: [
      {
        id: 'fin-1',
        heading: 'Never Send Money',
        content: 'No matter how compelling the story, never send money to someone you\'ve met online. Legitimate matches will not ask you for financial assistance.'
      },
      {
        id: 'fin-2',
        heading: 'Beware of Investment Opportunities',
        content: 'Be extremely cautious if your match starts discussing investment opportunities, cryptocurrency deals, or get-rich-quick schemes.'
      },
      {
        id: 'fin-3',
        heading: 'Don\'t Share Financial Information',
        content: 'Never share credit card numbers, banking details, or any financial account information with your matches, regardless of how long you\'ve been talking.'
      },
      {
        id: 'fin-4',
        heading: 'Watch for Common Scam Patterns',
        content: 'Be alert to scenarios like unexpected emergencies requiring money, lucrative business opportunities, or requests to receive/transfer funds on someone\'s behalf.'
      }
    ]
  },
  {
    id: 'digital',
    title: 'Digital Security',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
      </svg>
    ),
    tips: [
      {
        id: 'dig-1',
        heading: 'Use Strong Passwords',
        content: 'Create a unique, strong password for your Living Lavender account that you don\'t use for other services. Consider using a password manager.'
      },
      {
        id: 'dig-2',
        heading: 'Enable Two-Factor Authentication',
        content: 'Add an extra layer of security to your account by enabling two-factor authentication in your account settings.'
      },
      {
        id: 'dig-3',
        heading: 'Be Cautious with Links',
        content: 'Avoid clicking on links sent by matches, especially early in your conversation. These could be phishing attempts or contain malware.'
      },
      {
        id: 'dig-4',
        heading: 'Use Privacy Settings',
        content: 'Review and adjust your privacy settings regularly in your account. Consider limiting the information visible on your profile until you build trust.'
      },
      {
        id: 'dig-5',
        heading: 'Protect Your Photos',
        content: 'Consider what information might be revealed in your photos, such as home address, workplace, or children\'s schools. Use photos that don\'t contain identifying details.'
      }
    ]
  }
];

// Warning signs data
const warningSigns = [
  {
    id: 'warning-1',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>
    ),
    heading: 'Requests for Money',
    content: 'They ask for financial help, cite emergencies, or propose business ventures.'
  },
  {
    id: 'warning-2',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>
    ),
    heading: 'Avoiding Video Calls',
    content: 'They consistently refuse or make excuses to avoid video chatting.'
  },
  {
    id: 'warning-3',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>
    ),
    heading: 'Moving Too Fast',
    content: 'They profess strong feelings very quickly or push to meet in person immediately.'
  },
  {
    id: 'warning-4',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>
    ),
    heading: 'Inconsistent Stories',
    content: 'Details about their life, work, or background frequently change or don\'t add up.'
  },
  {
    id: 'warning-5',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>
    ),
    heading: 'Vague or Evasive Answers',
    content: 'They avoid direct questions about themselves or give very generic answers.'
  },
  {
    id: 'warning-6',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>
    ),
    heading: 'Requesting Private Communication',
    content: 'They urgently want to move conversations off the Living Lavender platform.'
  }
];

export default function SafetyTips() {
  const [activeCategory, setActiveCategory] = useState('online');

  const currentCategory = safetyTips.find(cat => cat.id === activeCategory);

  return (
    <div className={styles.safetyPage}>
      <div className={styles.safetyHero}>
        <div className="container">
          <h1 className={styles.safetyTitle}>Dating Safety Tips</h1>
          <p className={styles.safetySubtitle}>
            Your safety is our priority. Review these important guidelines for a secure dating experience.
          </p>
        </div>
      </div>

      <div className={styles.safetyContent}>
        <div className="container">
          <div className={styles.safetyNavigation}>
            <div className={styles.safetyTabs}>
              {safetyTips.map(category => (
                <button 
                  key={category.id}
                  className={`${styles.safetyTab} ${activeCategory === category.id ? styles.active : ''}`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  <span className={styles.safetyTabIcon}>{category.icon}</span>
                  <span>{category.title}</span>
                </button>
              ))}
            </div>
            
            <Link href="/help" className={styles.backLink}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Back to Help Center
            </Link>
          </div>
          
          <div className={styles.tipsContainer}>
            <div className={styles.tipsCategoryHeader}>
              <div className={styles.tipsCategoryIcon}>{currentCategory.icon}</div>
              <h2>{currentCategory.title}</h2>
            </div>
            
            <div className={styles.tipsList}>
              {currentCategory.tips.map((tip, index) => (
                <div key={tip.id} className={styles.tipItem}>
                  <div className={styles.tipNumber}>{index + 1}</div>
                  <div className={styles.tipContent}>
                    <h3>{tip.heading}</h3>
                    <p>{tip.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className={styles.warningSigns}>
            <h2 className={styles.warningTitle}>Common Warning Signs to Watch For</h2>
            <div className={styles.warningGrid}>
              {warningSigns.map(warning => (
                <div key={warning.id} className={styles.warningCard}>
                  <div className={styles.warningIcon}>{warning.icon}</div>
                  <h3>{warning.heading}</h3>
                  <p>{warning.content}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className={styles.emergencyCard}>
            <div className={styles.emergencyIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0"></path>
              </svg>
            </div>
            <div className={styles.emergencyContent}>
              <h2>In Immediate Danger?</h2>
              <p>If you feel unsafe or are in an emergency situation:</p>
              <ul>
                <li>Call emergency services immediately at 911 (US) or your local emergency number</li>
                <li>Leave the situation if it's safe to do so</li>
                <li>Contact a trusted friend or family member</li>
              </ul>
              <div className={styles.emergencyButtons}>
                <Link href="/help/report" className="btn btn-primary">
                  Report a Concern
                </Link>
                <Link href="/help" className="btn btn-outline">
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}