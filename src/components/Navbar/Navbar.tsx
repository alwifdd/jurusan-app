// src/app/components/Navbar/Navbar.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import styles from "@/components/styles/Navbar.module.css";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { data: session, status } = useSession();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // Jika dropdown profil terbuka saat menu mobile di-toggle, tutup dropdown profil. Ini sudah benar.
    if (isProfileDropdownOpen) {
      setIsProfileDropdownOpen(false);
    }
  };

  const toggleProfileDropdown = () => {
    // Toggle state untuk buka/tutup dropdown profil
    setIsProfileDropdownOpen((prevState) => !prevState); // Menggunakan functional update lebih aman

    // BARIS DI BAWAH INI YANG MENYEBABKAN MASALAH DI MOBILE.
    // SEHARUSNYA DIHAPUS ATAU DIKOMENTARI agar menu mobile tidak tertutup
    // saat membuka dropdown profil di dalamnya.
    // if (isMobileMenuOpen) setIsMobileMenuOpen((prevState) => !prevState);
    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    // HAPUS ATAU KOMENTARI BARIS DI ATAS INI
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
    }
    if (isProfileDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileDropdownOpen]);

  return (
    <div className="container">
      <nav className={styles.navbar}>
        <div className={styles.navLogo}>
          <Link href="/" className={styles.logoLinkInternal}>
            <span className={styles.logoMbti}>MBTI</span>
            <span className={styles.logoText}>
              KENALI DIRIMU, TEMUKAN JURUSANMU
            </span>
          </Link>
        </div>

        <button
          className={styles.hamburgerButton}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? "✕" : "☰"}
        </button>

        <div
          className={`${styles.navLinksWrapper} ${
            isMobileMenuOpen ? styles.mobileMenuOpen : ""
          }`}
        >
          <div className={styles.navLinks}>
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact Us</Link>
          </div>

          <div className={styles.authSection}>
            {status === "loading" && (
              <p className={styles.loadingText}>Loading...</p>
            )}

            {status === "authenticated" && session?.user && (
              <div className={styles.profileArea} ref={dropdownRef}>
                <button
                  onClick={toggleProfileDropdown}
                  className={styles.profileButton}
                  aria-label="User menu"
                  aria-expanded={isProfileDropdownOpen}
                >
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt="Profil"
                      width={32}
                      height={32}
                      className={styles.profileImage}
                    />
                  ) : (
                    <div className={styles.profilePlaceholder}>
                      {session.user.name?.charAt(0) ||
                        session.user.email?.charAt(0) ||
                        "U"}
                    </div>
                  )}
                </button>

                <div
                  className={`${styles.profileDropdown} ${
                    isProfileDropdownOpen ? styles.profileDropdownOpen : ""
                  }`}
                >
                  <div className={styles.dropdownHeader}>
                    {session.user.name && (
                      <p className={styles.dropdownUserName}>
                        {session.user.name}
                      </p>
                    )}
                    <p className={styles.dropdownUserEmail}>
                      {session.user.email}
                    </p>
                  </div>
                  <Link
                    href="/profile"
                    className={styles.dropdownLink}
                    onClick={() => {
                      setIsProfileDropdownOpen(false); // Tutup dropdown setelah klik
                      // Jika ingin menu mobile juga tertutup setelah klik link ini:
                      // if (isMobileMenuOpen) setIsMobileMenuOpen(false);
                    }}
                  >
                    <span role="img" aria-label="profile icon">
                      👤
                    </span>{" "}
                    Akun saya
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setIsProfileDropdownOpen(false); // Tutup dropdown setelah sign out
                      // Jika ingin menu mobile juga tertutup setelah sign out:
                      // if (isMobileMenuOpen) setIsMobileMenuOpen(false);
                    }}
                    className={styles.dropdownButton}
                  >
                    <span role="img" aria-label="logout icon">
                      ➔
                    </span>{" "}
                    Logout
                  </button>
                </div>
              </div>
            )}

            {status === "unauthenticated" && (
              <Link href="/login" legacyBehavior passHref>
                <a className={`${styles.navButton} ${styles.navButtonMobile}`}>
                  Sign In
                </a>
              </Link>
            )}
          </div>
        </div>
      </nav>
      {/* Jika Anda sebelumnya menghapus overlay karena tidak mau blur, pastikan elemennya juga sudah dihapus dari sini */}
    </div>
  );
};

export default Navbar;
