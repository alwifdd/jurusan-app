import React from "react";
import styles from "@/components/styles/Navbar.module.css";

const Navbar = () => {
  return (
    // Kita tambahkan <div className="container"> di sini
    <div className="container">
      <nav className={styles.navbar}>
        <div className={styles.navLogo}>
          <span className={styles.logoMbti}>MBTI</span>
          <span className={styles.logoText}>
            KENALI DIRIMU, TEMUKAN JURUSANMU
          </span>
        </div>
        <div className={styles.navLinks}>
          <a href="#">Home</a>
          <a href="#">About</a>
          <a href="#">Contact Us</a>
        </div>
        <a href="#" className={styles.navButton}>
          Sign In
        </a>
      </nav>
    </div>
  );
};

export default Navbar;
