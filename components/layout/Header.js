'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.navbar}>
          <div className={styles.logo}>
            <Link href="/">
              <div className={styles.logoWrapper}>
                <Image 
                  src="/images/logo.svg" 
                  alt="Living Lavender Logo" 
                  width={40} 
                  height={40} 
                />
                <span className={styles.logoText}>Living Lavender</span>
              </div>
            </Link>
          </div>

          <nav className={`${styles.nav} ${isMenuOpen ? styles.active : ''}`}>
            <ul className={styles.navLinks}>
              <li>
                <Link href="/" className={styles.navLink}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className={styles.navLink}>
                  About
                </Link>
              </li>
              <li>
                <Link href="/success-stories" className={styles.navLink}>
                  Success Stories
                </Link>
              </li>
              <li>
                <Link href="/contact" className={styles.navLink}>
                  Contact
                </Link>
              </li>
            </ul>
            <div className={styles.navButtons}>
              <Link href="/login" className="btn btn-outline">
                Log In
              </Link>
              <Link href="/signup" className="btn btn-primary">
                Sign Up
              </Link>
            </div>
          </nav>

          <button 
            className={`${styles.hamburger} ${isMenuOpen ? styles.active : ''}`} 
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;