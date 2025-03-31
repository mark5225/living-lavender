import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <h1>Find Your Perfect Match with Living Lavender</h1>
              <p>
                Join our community of like-minded individuals looking for meaningful connections. 
                Our matching algorithm helps you find compatible partners based on your values, 
                interests, and lifestyle.
              </p>
              <div className={styles.heroButtons}>
                <Link href="/matches" className="btn btn-primary btn-lg">
                  Browse Matches
                </Link>
                <Link href="/signup/basic" className="btn btn-outline btn-lg">
                  Sign Up Free
                </Link>
              </div>
            </div>
            <div className={styles.heroImage}>
              <Image 
                src="/images/hero-image.svg" 
                alt="Happy couple illustration" 
                width={500} 
                height={400}
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>Why Choose Living Lavender?</h2>
            <p>Our dating platform is designed with your happiness in mind</p>
          </div>

          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </div>
              <h3>Advanced Matching</h3>
              <p>Our compatibility algorithm matches you with people who share your values and interests.</p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <h3>Privacy First</h3>
              <p>Your data is secure with us. We never share your personal information with third parties.</p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3>Community</h3>
              <p>Join a supportive community of singles who are serious about finding meaningful relationships.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className={styles.howItWorks}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>How Living Lavender Works</h2>
            <p>Your journey to finding love is just a few steps away</p>
          </div>

          <div className={styles.stepsContainer}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <h3>Create Your Profile</h3>
              <p>Sign up and complete our detailed personality assessment to help us understand who you are.</p>
            </div>
            
            <div className={styles.stepConnector}></div>
            
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <h3>Discover Matches</h3>
              <p>Our algorithm will suggest compatible matches based on your preferences and personality.</p>
            </div>
            
            <div className={styles.stepConnector}></div>
            
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <h3>Connect</h3>
              <p>Start conversations with your matches and build meaningful connections.</p>
            </div>
          </div>
          
          <div className={styles.ctaContainer}>
            <Link href="/matches" className="btn btn-primary btn-lg">
              Start Your Journey
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonials}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>Success Stories</h2>
            <p>Hear from couples who found love on Living Lavender</p>
          </div>

          <div className={styles.testimonialGrid}>
            <div className={styles.testimonialCard}>
              <div className={styles.testimonialImage}>
                <Image 
                  src="/images/testimonial-1.jpg" 
                  alt="Sarah and Michael" 
                  width={100} 
                  height={100}
                />
              </div>
              <div className={styles.testimonialContent}>
                <p className={styles.testimonialText}>
                  "We matched on Living Lavender and instantly connected over our shared love for hiking. Six months later, he proposed on top of our favorite mountain!"
                </p>
                <p className={styles.testimonialAuthor}>Sarah & Michael</p>
                <p className={styles.testimonialInfo}>Together for 2 years</p>
              </div>
            </div>

            <div className={styles.testimonialCard}>
              <div className={styles.testimonialImage}>
                <Image 
                  src="/images/testimonial-2.jpg" 
                  alt="David and Jennifer" 
                  width={100} 
                  height={100}
                />
              </div>
              <div className={styles.testimonialContent}>
                <p className={styles.testimonialText}>
                  "I was skeptical about online dating until I tried Living Lavender. The personality matching really works! We're now planning our wedding."
                </p>
                <p className={styles.testimonialAuthor}>David & Jennifer</p>
                <p className={styles.testimonialInfo}>Engaged after 1 year</p>
              </div>
            </div>
          </div>
          
          <div className={styles.ctaContainer}>
            <Link href="/success-stories" className="btn btn-outline">
              Read More Stories
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className="container">
          <div className={styles.ctaInner}>
            <h2>Ready to Find Your Perfect Match?</h2>
            <p>Join thousands of singles already on Living Lavender and start your journey to finding love today.</p>
            <div className={styles.ctaButtons}>
              <Link href="/matches" className="btn btn-primary btn-lg">
                Browse Matches
              </Link>
              <Link href="/signup/basic" className="btn btn-outline btn-lg btn-light">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}