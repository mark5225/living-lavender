'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './help-center.module.css';

// FAQ data
const faqCategories = [
  {
    id: 'account',
    name: 'Account & Settings',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    ),
    questions: [
      {
        id: 'account-1',
        question: 'How do I change my email address?',
        answer: 'To change your email address, go to Settings > Account > Email. Enter your new email address and confirm with your password. We\'ll send a verification link to your new email that you\'ll need to click to complete the change.'
      },
      {
        id: 'account-2',
        question: 'How do I reset my password?',
        answer: 'If you\'re logged in, go to Settings > Account > Password to reset your password. If you\'re unable to log in, click "Forgot Password" on the login page. We\'ll send a password reset link to your registered email address.'
      },
      {
        id: 'account-3',
        question: 'How do I delete my account?',
        answer: 'We\'re sad to see you go! To delete your account, go to Settings > Account > Delete Account. You\'ll need to confirm your password. Note that this action is permanent and will delete all your data, including matches and messages.'
      },
      {
        id: 'account-4',
        question: 'Can I temporarily disable my profile?',
        answer: 'Yes, you can temporarily hide your profile from matches by going to Settings > Privacy > Visibility and toggling "Hide Profile". Your profile will be hidden until you toggle it back, but you\'ll still be able to log in and access your account.'
      }
    ]
  },
  {
    id: 'matching',
    name: 'Matchmaking',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
    ),
    questions: [
      {
        id: 'matching-1',
        question: 'How does the matching algorithm work?',
        answer: 'Our matching algorithm considers multiple factors including your preferences, interests, values, and behavioral patterns on the platform. We use these data points to suggest compatible matches who share similar lifestyle preferences and relationship goals.'
      },
      {
        id: 'matching-2',
        question: 'How can I improve my match quality?',
        answer: 'Complete your profile thoroughly, including detailed interests and preferences. Be specific in your bio about what you\'re looking for. Regularly update your preferences and actively interact with matches to help our algorithm better understand your preferences.'
      },
      {
        id: 'matching-3',
        question: 'Why am I not getting many matches?',
        answer: 'This could be due to several factors: your preferences may be too restrictive, your profile might need more information, or there may be fewer users in your area. Try expanding your distance or age range preferences, adding more photos, or enhancing your bio.'
      }
    ]
  },
  {
    id: 'messaging',
    name: 'Messaging & Communication',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    ),
    questions: [
      {
        id: 'messaging-1',
        question: 'Why can\'t I message someone?',
        answer: 'To message someone, you need to have matched with them first. Both parties must express interest by "liking" each other before messaging is unlocked. If you\'ve matched but still can\'t message, check if the user has deactivated their account or unmatched with you.'
      },
      {
        id: 'messaging-2',
        question: 'Can I send photos in messages?',
        answer: 'Yes, you can send photos in messages after you\'ve exchanged at least 5 messages with your match. This policy helps ensure a respectful communication environment. Note that all images are reviewed according to our community guidelines.'
      },
      {
        id: 'messaging-3',
        question: 'How do I know if someone has read my message?',
        answer: 'Message read receipts are available for all users. When your message has been read, you\'ll see a small checkmark next to the message timestamp. If there\'s no checkmark, your message has been delivered but not yet read.'
      }
    ]
  },
  {
    id: 'safety',
    name: 'Safety & Privacy',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
      </svg>
    ),
    questions: [
      {
        id: 'safety-1',
        question: 'How do I report inappropriate behavior?',
        answer: 'You can report a user by navigating to their profile and clicking the "..." menu, then selecting "Report". Alternatively, in a message conversation, tap the menu icon in the top right and select "Report". Please provide as much detail as possible about the issue.'
      },
      {
        id: 'safety-2',
        question: 'Can other users see my location?',
        answer: 'Users cannot see your exact location. By default, they can only see your general location (city level). You can further restrict this in Settings > Privacy > Location Information to show only your region or country if preferred.'
      },
      {
        id: 'safety-3',
        question: 'What safety features does Living Lavender offer?',
        answer: 'We offer several safety features including profile verification, block and report tools, photo moderation, and message filtering for inappropriate content. We also provide an emergency contact feature and safety tips for online dating and meeting in person.'
      },
      {
        id: 'safety-4',
        question: 'Who can see my profile?',
        answer: 'By default, only other Living Lavender members within your search criteria can see your profile. You can further restrict profile visibility in Settings > Privacy > Profile Visibility. Options include "Standard" (default), "Selective" (only shown to users you\'ve liked), or "Private" (only shown to users you\'ve matched with).'
      }
    ]
  },
  {
    id: 'subscription',
    name: 'Subscription & Billing',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
        <line x1="1" y1="10" x2="23" y2="10"></line>
      </svg>
    ),
    questions: [
      {
        id: 'subscription-1',
        question: 'What are the different subscription plans?',
        answer: 'Living Lavender offers three subscription tiers: Basic (free), Premium ($19.99/month), and Platinum ($29.99/month). Premium includes unlimited matches, advanced filters, and read receipts. Platinum adds profile boosting, priority matching, and exclusive events access.'
      },
      {
        id: 'subscription-2',
        question: 'How do I cancel my subscription?',
        answer: 'To cancel your subscription, go to Settings > Account > Subscription > Manage Subscription > Cancel. Your premium features will remain active until the end of your current billing period. There are no refunds for partial months.'
      },
      {
        id: 'subscription-3',
        question: 'Is my payment information secure?',
        answer: 'Yes, we use industry-standard encryption for all payment processing. We partner with trusted payment processors like Stripe and PayPal and never store your full credit card information on our servers.'
      }
    ]
  }
];

export default function HelpCenter() {
  const [activeCategory, setActiveCategory] = useState('account');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const searchResultsRef = useRef(null);
  const activeTabRef = useRef(null);
  
  // Handle category tab click
  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    setExpandedQuestions({});
    
    // Smooth scroll to bring active tab into view on mobile
    setTimeout(() => {
      if (activeTabRef.current) {
        activeTabRef.current.scrollIntoView({ behavior: 'smooth', inline: 'center' });
      }
    }, 100);
  };
  
  // Toggle FAQ answer visibility
  const toggleQuestion = (questionId) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };
  
  // Handle search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    
    // Scroll to search results when typing
    if (e.target.value.length > 2 && searchResultsRef.current) {
      setTimeout(() => {
        searchResultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  };
  
  // Handle contact form input
  const handleContactInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle contact form submission
  const handleContactSubmit = (e) => {
    e.preventDefault();
    // Form submission logic would go here
    
    // For now, just show a success message
    alert('Thank you for your message! Our support team will get back to you soon.');
    
    // Reset form
    setContactForm({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };
  
  // Filter questions based on search query
  const getSearchResults = () => {
    if (!searchQuery || searchQuery.length < 3) return [];
    
    const results = [];
    
    faqCategories.forEach(category => {
      category.questions.forEach(question => {
        if (
          question.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          question.answer.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          results.push({
            ...question,
            category: category.name,
            categoryId: category.id
          });
        }
      });
    });
    
    return results;
  };
  
  const searchResults = getSearchResults();
  const currentCategory = faqCategories.find(cat => cat.id === activeCategory);
  
  return (
    <div className={styles.helpCenter}>
      <div className={styles.helpHero}>
        <div className="container">
          <h1 className={styles.helpTitle}>How can we help you?</h1>
          
          <div className={`${styles.searchContainer} ${isSearchFocused ? styles.focused : ''}`}>
            <svg className={styles.searchIcon} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search for help topics..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
            {searchQuery && (
              <button 
                className={styles.clearSearch}
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>
          
          <div className={styles.helpCards}>
            <Link href="/help/safety-tips" className={styles.helpCard}>
              <div className={styles.helpCardIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h3>Safety Tips</h3>
              <p>Learn how to stay safe while dating online and meeting in person</p>
            </Link>
            
            <Link href="/help/getting-started" className={styles.helpCard}>
              <div className={styles.helpCardIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="16"></line>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
              </div>
              <h3>Getting Started</h3>
              <p>New to Living Lavender? Learn how to set up your profile and find matches</p>
            </Link>
            
            <Link href="/contact" className={styles.helpCard}>
              <div className={styles.helpCardIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <h3>Contact Support</h3>
              <p>Need more help? Our support team is here for you</p>
            </Link>
          </div>
        </div>
      </div>
      
      {searchQuery.length >= 3 ? (
        <div className={styles.searchResults} ref={searchResultsRef}>
          <div className="container">
            <h2 className={styles.searchResultsTitle}>
              Search Results ({searchResults.length})
            </h2>
            
            {searchResults.length === 0 ? (
              <div className={styles.noResults}>
                <div className={styles.noResultsIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    <line x1="8" y1="11" x2="14" y2="11"></line>
                  </svg>
                </div>
                <h3>No results found</h3>
                <p>
                  We couldn't find any matches for "{searchQuery}". 
                  Please try another search term or browse our FAQ categories below.
                </p>
              </div>
            ) : (
              <ul className={styles.searchResultsList}>
                {searchResults.map((result) => (
                  <li key={result.id} className={styles.searchResultItem}>
                    <button
                      className={`${styles.faqQuestion} ${expandedQuestions[result.id] ? styles.expanded : ''}`}
                      onClick={() => toggleQuestion(result.id)}
                    >
                      <div className={styles.faqQuestionContent}>
                        <span className={styles.searchResultCategory}>{result.category}</span>
                        <h3>{result.question}</h3>
                      </div>
                      <div className={styles.faqToggle}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          {expandedQuestions[result.id] ? (
                            <polyline points="18 15 12 9 6 15"></polyline>
                          ) : (
                            <polyline points="6 9 12 15 18 9"></polyline>
                          )}
                        </svg>
                      </div>
                    </button>
                    
                    {expandedQuestions[result.id] && (
                      <div className={styles.faqAnswer}>
                        <p>{result.answer}</p>
                        <div className={styles.faqActions}>
                          <button 
                            className={styles.faqActionBtn}
                            onClick={() => {
                              setSearchQuery('');
                              setActiveCategory(result.categoryId);
                              setExpandedQuestions({ [result.id]: true });
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10"></circle>
                              <polyline points="12 16 16 12 12 8"></polyline>
                              <line x1="8" y1="12" x2="16" y2="12"></line>
                            </svg>
                            View in category
                          </button>
                          <button className={styles.faqActionBtn}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                            Was this helpful?
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : (
        <div className={styles.faqSection}>
          <div className="container">
            <div className={styles.faqContainer}>
              <div className={styles.faqSidebar}>
                <h2 className={styles.faqSidebarTitle}>FAQ Categories</h2>
                <ul className={styles.faqCategories}>
                  {faqCategories.map((category) => (
                    <li key={category.id}>
                      <button
                        className={`${styles.faqCategoryBtn} ${activeCategory === category.id ? styles.active : ''}`}
                        onClick={() => handleCategoryClick(category.id)}
                        ref={activeCategory === category.id ? activeTabRef : null}
                      >
                        <span className={styles.faqCategoryIcon}>{category.icon}</span>
                        <span className={styles.faqCategoryName}>{category.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
                
                <div className={styles.contactSidebar}>
                  <h3>Still need help?</h3>
                  <p>If you can't find what you're looking for, our support team is here to help.</p>
                  <Link href="#contact-form" className={`${styles.contactSidebarBtn} btn btn-primary`}>
                    Contact Us
                  </Link>
                </div>
              </div>
              
              <div className={styles.faqContent}>
                <div className={styles.faqContentHeader}>
                  <h2 className={styles.categoryTitle}>
                    <span className={styles.categoryIcon}>{currentCategory.icon}</span>
                    {currentCategory.name}
                  </h2>
                </div>
                
                <ul className={styles.faqList}>
                  {currentCategory.questions.map((question) => (
                    <li key={question.id} className={styles.faqItem}>
                      <button
                        className={`${styles.faqQuestion} ${expandedQuestions[question.id] ? styles.expanded : ''}`}
                        onClick={() => toggleQuestion(question.id)}
                      >
                        <h3>{question.question}</h3>
                        <div className={styles.faqToggle}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            {expandedQuestions[question.id] ? (
                              <polyline points="18 15 12 9 6 15"></polyline>
                            ) : (
                              <polyline points="6 9 12 15 18 9"></polyline>
                            )}
                          </svg>
                        </div>
                      </button>
                      
                      {expandedQuestions[question.id] && (
                        <div className={styles.faqAnswer}>
                          <p>{question.answer}</p>
                          <div className={styles.faqActions}>
                            <button className={styles.faqActionBtn}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                              </svg>
                              Was this helpful?
                            </button>
                            <button className={styles.faqActionBtn}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                              </svg>
                              Submit feedback
                            </button>
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className={styles.contactSection} id="contact-form">
        <div className="container">
          <div className={styles.contactContainer}>
            <div className={styles.contactInfo}>
              <h2>Get in Touch</h2>
              <p>
                Can't find what you're looking for? We're here to help.
                Our support team typically responds within 24 hours.
              </p>
              
              <ul className={styles.contactMethods}>
                <li>
                  <div className={styles.contactMethodIcon}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </div>
                  <div className={styles.contactMethodContent}>
                    <h3>Email</h3>
                    <p>support@livinglavender.com</p>
                  </div>
                </li>
                <li>
                  <div className={styles.contactMethodIcon}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                  </div>
                  <div className={styles.contactMethodContent}>
                    <h3>Phone</h3>
                    <p>+1 (800) 555-0123</p>
                    <p className={styles.contactHours}>Monday-Friday, 9am-5pm EST</p>
                  </div>
                </li>
                <li>
                  <div className={styles.contactMethodIcon}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M12 6l0 6l4 2"></path>
                    </svg>
                  </div>
                  <div className={styles.contactMethodContent}>
                    <h3>Response Time</h3>
                    <p>We typically respond within 24 hours</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className={styles.contactForm}>
              <h2>Send us a Message</h2>
              <form onSubmit={handleContactSubmit}>
                <div className={styles.formGridTwo}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="name">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="form-control"
                      value={contactForm.name}
                      onChange={handleContactInputChange}
                      required
                      placeholder="Your name"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label" htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-control"
                      value={contactForm.email}
                      onChange={handleContactInputChange}
                      required
                      placeholder="Your email address"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label" htmlFor="subject">Subject</label>
                  <select
                    id="subject"
                    name="subject"
                    className="form-control"
                    value={contactForm.subject}
                    onChange={handleContactInputChange}
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="account">Account Issues</option>
                    <option value="billing">Billing & Subscription</option>
                    <option value="technical">Technical Problems</option>
                    <option value="feedback">Feedback & Suggestions</option>
                    <option value="safety">Safety Concerns</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label" htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    className="form-control"
                    value={contactForm.message}
                    onChange={handleContactInputChange}
                    required
                    rows={5}
                    placeholder="Please describe your issue or question in detail"
                  ></textarea>
                </div>
                
                <button type="submit" className="btn btn-primary">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}