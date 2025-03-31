// app/about/page.js
import Link from 'next/link';
import Image from 'next/image';
import styles from './about.module.css';

// Add metadata for SEO
export const metadata = {
  title: 'About Living Lavender | Understanding Lavender Marriages & Our Mission',
  description: 'Learn about Living Lavender, a modern matchmaking platform for lavender marriages. Discover our history, mission, safety measures, and membership benefits.',
  keywords: 'lavender marriage, modern matchmaking, LGBTQ+ allies, mutual support, companionship, privacy focused, safety first, premium features',
  openGraph: {
    title: 'About Living Lavender | Understanding Lavender Marriages & Our Mission',
    description: 'Learn about Living Lavender, a modern matchmaking platform for lavender marriages. Discover our history, mission, safety measures, and membership benefits.',
    url: 'https://livinglavender.com/about',
    siteName: 'Living Lavender',
    images: [
      {
        url: '/images/about-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Living Lavender - Modern Lavender Marriages',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <div className={styles.aboutContainer}>
      {/* Hero Section */}
      <section className={styles.aboutHero}>
        <div className="container">
          <div className={styles.aboutHeroContent}>
            <h1>About Living Lavender</h1>
            <p className={styles.aboutSubtitle}>
              Creating meaningful connections through modern lavender marriages
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className={styles.aboutSection}>
        <div className="container">
          <div className={styles.sectionGrid}>
            <div className={styles.textContent}>
              <h2>Our Story</h2>
              <p>
                Founded in 2023, Living Lavender emerged from a recognition that many individuals 
                seek companionship, support, and connection outside of traditional romantic relationships. 
                Our founders noticed a resurgence of interest in the historical concept of "lavender 
                marriages" but reimagined for the modern world.
              </p>
              <p>
                What began as a small community of like-minded individuals has grown into a 
                comprehensive platform dedicated to helping people find compatible companions for 
                mutually supportive partnerships based on shared values, life goals, and needs.
              </p>
            </div>
            <div className={styles.imageContent}>
              <Image 
                src="/images/our-story.jpg" 
                alt="Living Lavender founding team" 
                width={500} 
                height={400}
                className={styles.aboutImage}
              />
            </div>
          </div>
        </div>
      </section>

      {/* What Is a Lavender Marriage Section */}
      <section className={styles.aboutSection + ' ' + styles.altBackground}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>Understanding Lavender Marriages</h2>
            <p>A modern approach to companionship and mutual support</p>
          </div>
          
          <div className={styles.sectionGrid + ' ' + styles.reverse}>
            <div className={styles.textContent}>
              <h3>Historical Context</h3>
              <p>
                Historically, "lavender marriages" were arrangements between LGBTQ+ individuals who married 
                partners of the opposite sex to conform with societal expectations while providing mutual 
                support and understanding. These arrangements were particularly common in the early-to-mid 
                20th century among public figures in the entertainment industry.
              </p>
              <h3>Modern Interpretation</h3>
              <p>
                Today's lavender marriages build on this history but serve a much broader purpose. Modern 
                lavender marriages are intentional partnerships between consenting adults who seek companionship, 
                practical support, and shared life goals outside of traditional romantic or sexual relationships.
              </p>
              <p>
                These arrangements can benefit many people: those who prioritize career or personal pursuits 
                over romance, individuals who experience little or no romantic attraction, those seeking 
                stable co-parenting partnerships, or people looking for companionship and support as they age.
              </p>
            </div>
            <div className={styles.imageContent}>
              <Image 
                src="/images/lavender-meaning.jpg" 
                alt="Modern lavender marriage concept" 
                width={500} 
                height={400}
                className={styles.aboutImage}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className={styles.aboutSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>Our Mission</h2>
            <p>Creating meaningful connections that enhance lives</p>
          </div>
          
          <div className={styles.missionPoints}>
            <div className={styles.missionItem}>
              <div className={styles.missionIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </div>
              <h3>Foster Understanding</h3>
              <p>
                We aim to educate the public about the concept of lavender marriages and 
                create a space where these relationships are understood and respected.
              </p>
            </div>
            
            <div className={styles.missionItem}>
              <div className={styles.missionIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3>Facilitate Connections</h3>
              <p>
                We provide a sophisticated platform where individuals can find compatible partners 
                based on shared values, life goals, and complementary needs.
              </p>
            </div>
            
            <div className={styles.missionItem}>
              <div className={styles.missionIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <h3>Ensure Safety</h3>
              <p>
                We prioritize the safety, privacy, and well-being of our members through 
                rigorous security measures and comprehensive educational resources.
              </p>
            </div>
            
            <div className={styles.missionItem}>
              <div className={styles.missionIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h3>Build Community</h3>
              <p>
                We create a supportive community where members can share experiences, 
                offer mutual support, and advocate for wider recognition of diverse relationship models.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Safety First Section */}
      <section className={styles.aboutSection + ' ' + styles.altBackground}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>Safety First</h2>
            <p>How we protect our members and ensure secure connections</p>
          </div>
          
          <div className={styles.safetyGrid}>
            <div className={styles.safetyItem}>
              <h3>Profile Verification</h3>
              <p>
                All profiles undergo manual review by our team before being approved. 
                We have a multi-step verification process to ensure members are who they claim to be.
              </p>
            </div>
            
            <div className={styles.safetyItem}>
              <h3>Data Protection</h3>
              <p>
                Your personal information is encrypted and securely stored. We never share your 
                data with third parties and give you full control over your privacy settings.
              </p>
            </div>
            
            <div className={styles.safetyItem}>
              <h3>Communication Safety</h3>
              <p>
                Our messaging system includes safety features like message filtering, 
                reporting tools, and the ability to block unwanted contacts instantly.
              </p>
            </div>
            
            <div className={styles.safetyItem}>
              <h3>Educational Resources</h3>
              <p>
                We provide comprehensive resources on safe meeting practices, recognizing 
                red flags, and establishing healthy boundaries in lavender marriages.
              </p>
            </div>
            
            <div className={styles.safetyItem}>
              <h3>Support Team</h3>
              <p>
                Our dedicated support team is available to assist with any concerns. 
                We respond quickly to reports and take appropriate action to maintain community standards.
              </p>
            </div>
            
            <div className={styles.safetyItem}>
              <h3>Legal Resources</h3>
              <p>
                We provide information about legal considerations for lavender marriages, 
                including cohabitation agreements, financial planning, and legal protections.
              </p>
            </div>
          </div>
          
          <div className={styles.safetyCTA}>
            <Link href="/help/safety-tips" className="btn btn-primary">
              Learn More About Our Safety Measures
            </Link>
          </div>
        </div>
      </section>

      {/* Membership Benefits */}
      <section className={styles.aboutSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>Membership Benefits</h2>
            <p>Discover the advantages of joining Living Lavender</p>
          </div>
          
          <div className={styles.membershipTiers}>
            <div className={styles.membershipCard}>
              <div className={styles.membershipHeader}>
                <h3>Basic</h3>
                <p className={styles.price}>Free</p>
              </div>
              <ul className={styles.benefitsList}>
                <li>Create and customize your profile</li>
                <li>Browse potential matches</li>
                <li>Send up to 5 messages per day</li>
                <li>Access to basic matching algorithm</li>
                <li>Community forum access</li>
                <li>Basic safety features</li>
              </ul>
              <Link href="/signup/basic" className="btn btn-outline">
                Sign Up Free
              </Link>
            </div>
            
            <div className={styles.membershipCard + ' ' + styles.featured}>
              <div className={styles.membershipHeader}>
                <h3>Premium</h3>
                <p className={styles.price}>$19.99<span>/month</span></p>
              </div>
              <ul className={styles.benefitsList}>
                <li>All Basic features</li>
                <li>Unlimited messaging</li>
                <li>Advanced matching algorithm</li>
                <li>See who liked your profile</li>
                <li>Priority profile visibility</li>
                <li>Advanced filters and search options</li>
                <li>Message read receipts</li>
                <li>Enhanced privacy controls</li>
                <li>Virtual meeting tools</li>
              </ul>
              <Link href="/signup/premium" className="btn btn-primary">
                Upgrade to Premium
              </Link>
            </div>
            
            <div className={styles.membershipCard}>
              <div className={styles.membershipHeader}>
                <h3>Platinum</h3>
                <p className={styles.price}>$29.99<span>/month</span></p>
              </div>
              <ul className={styles.benefitsList}>
                <li>All Premium features</li>
                <li>Profile boost (3x visibility)</li>
                <li>Priority customer support</li>
                <li>Compatibility reports</li>
                <li>Access to exclusive events</li>
                <li>Legal resources for partnerships</li>
                <li>Relationship coaching sessions</li>
                <li>Background verification badge</li>
              </ul>
              <Link href="/signup/platinum" className="btn btn-outline">
                Upgrade to Platinum
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Serve Section */}
      <section className={styles.aboutSection + ' ' + styles.altBackground}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>Who We Serve</h2>
            <p>Living Lavender welcomes a diverse community with various needs</p>
          </div>
          
          <div className={styles.personasGrid}>
            <div className={styles.personaCard}>
              <div className={styles.personaIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <h3>Career-Focused Individuals</h3>
              <p>
                People who prioritize professional growth but still desire companionship, 
                support, and the stability of a committed partnership.
              </p>
            </div>
            
            <div className={styles.personaCard}>
              <div className={styles.personaIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3>Companionship Seekers</h3>
              <p>
                Those seeking meaningful companionship without traditional romantic 
                expectations, including older adults looking to share their lives.
              </p>
            </div>
            
            <div className={styles.personaCard}>
              <div className={styles.personaIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </div>
              <h3>Co-Parenting Partners</h3>
              <p>
                Individuals seeking stable, supportive partnerships focused on raising 
                children together, whether through adoption or other means.
              </p>
            </div>
            
            <div className={styles.personaCard}>
              <div className={styles.personaIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                  <line x1="8" y1="21" x2="16" y2="21"></line>
                  <line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
              </div>
              <h3>Digital Nomads</h3>
              <p>
                People with location-independent careers seeking partners with compatible 
                lifestyles who value mutual independence while sharing life experiences.
              </p>
            </div>
          </div>
          
          <div className={styles.inclusivityStatement}>
            <h3>Our Commitment to Inclusivity</h3>
            <p>
              At Living Lavender, we welcome people of all backgrounds, identities, and beliefs. 
              We are committed to creating a platform where everyone feels respected, valued, and 
              empowered to form authentic connections based on mutual understanding and support.
            </p>
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className={styles.joinSection}>
        <div className="container">
          <div className={styles.joinContent}>
            <h2>Begin Your Journey Today</h2>
            <p>
              Join thousands of individuals who have found meaningful connections 
              through Living Lavender. Whether you're seeking companionship, mutual support, 
              or a partnership based on shared values and goals, we're here to help you 
              find your perfect match.
            </p>
            <div className={styles.joinButtons}>
              <Link href="/signup/basic" className="btn btn-primary btn-lg">
                Create Your Free Profile
              </Link>
              <Link href="/success-stories" className="btn btn-outline btn-lg">
                Read Success Stories
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}