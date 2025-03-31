// components/layout/Header.js
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import styles from './Header.module.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    // Close menu if open
    setIsMenuOpen(false);
  };

  const isActive = (path) => {
    return pathname === path;
  };

  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.navbar}>
          <div className={styles.logo}>
            <Link href="/">
              <div className={styles.logoWrapper}>
                <svg 
                  width="40" 
                  height="40" 
                  viewBox="0 0 40 40" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="40" height="40" rx="8" fill="#7464A0" />
                  <path d="M20 10C14.486 10 10 14.486 10 20C10 25.514 14.486 30 20 30C25.514 30 30 25.514 30 20C30 14.486 25.514 10 20 10ZM20 28C15.589 28 12 24.411 12 20C12 15.589 15.589 12 20 12C24.411 12 28 15.589 28 20C28 24.411 24.411 28 20 28Z" fill="white"/>
                  <path d="M20 15C18.346 15 17 16.346 17 18C17 19.654 18.346 21 20 21C21.654 21 23 19.654 23 18C23 16.346 21.654 15 20 15Z" fill="white"/>
                  <path d="M20 22C16.667 22 14 24.239 14 27H26C26 24.239 23.333 22 20 22Z" fill="white"/>
                </svg>
                <span className={styles.logoText}>Living Lavender</span>
              </div>
            </Link>
          </div>

          <nav className={`${styles.nav} ${isMenuOpen ? styles.active : ''}`}>
            <ul className={styles.navLinks}>
              <li>
                <Link 
                  href="/" 
                  className={`${styles.navLink} ${isActive('/') ? styles.activeLink : ''}`} 
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/matches" 
                  className={`${styles.navLink} ${isActive('/matches') ? styles.activeLink : ''}`} 
                  onClick={() => setIsMenuOpen(false)}
                >
                  Matches
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className={`${styles.navLink} ${isActive('/about') ? styles.activeLink : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
              </li>
              <li>
                <Link 
                  href="/success-stories" 
                  className={`${styles.navLink} ${isActive('/success-stories') ? styles.activeLink : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Success Stories
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className={`${styles.navLink} ${isActive('/contact') ? styles.activeLink : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
              </li>
            </ul>
            <div className={styles.navButtons}>
              {user ? (
                <>
                  <Link 
                    href="/dashboard" 
                    className={`${styles.dashboardLink} ${isActive('/dashboard') ? styles.activeLink : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <div className={styles.userMenu}>
                    <Link 
                      href="/profile" 
                      className="btn btn-outline"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button 
                      onClick={handleLogout} 
                      className="btn btn-primary"
                    >
                      Log Out
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link 
                    href="/login" 
                    className="btn btn-outline"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Log In
                  </Link>
                  <Link 
                    href="/signup/basic" 
                    className="btn btn-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
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