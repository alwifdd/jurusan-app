"use client";

import React, { useState } from "react";
import styles from "@/components/styles/Navbar.module.css";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="container">
      <nav className={styles.navbar}>
        <div className={styles.navLogo}>
          <span className={styles.logoMbti}>MBTI</span>
          <span className={styles.logoText}>
            KENALI DIRIMU, TEMUKAN JURUSANMU
          </span>
        </div>

        {/* Ikon Hamburger (hanya tampil di mobile) */}
        <button
          className={styles.hamburgerButton}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? "✕" : "☰"}
        </button>

        {/* Wrapper untuk Navigasi Desktop & Mobile */}
        <div
          className={`${styles.navLinksWrapper} ${
            isMobileMenuOpen ? styles.mobileMenuOpen : ""
          }`}
        >
          <div className={styles.navLinks}>
            <a href="#">Home</a>
            <a href="#">About</a>
            <a href="#">Contact Us</a>
          </div>
          <a
            href="#"
            className={`${styles.navButton} ${styles.navButtonMobile}`}
          >
            Sign In
          </a>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
