// src/app/components/Navbar/Navbar.tsx (COMBINED VERSION)
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
    if (isProfileDropdownOpen) {
      setIsProfileDropdownOpen(false);
    }
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen((prevState) => !prevState);
  };

  // Handle click outside dropdown
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

  // Handle body overflow when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu when clicking on navigation links
  const handleNavLinkClick = () => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      <header className={styles.header}>
        <div className="container">
          <nav className={styles.navbar}>
            <div className={styles.navLogo}>
              <Link href="/" className={styles.logoLinkInternal}>
                {/* Logo untuk Desktop */}
                <Image
                  src="/logodesktop.png"
                  alt="JurusanKu Logo Desktop"
                  height={52}
                  width={177}
                  className={styles.logoDesktop}
                  priority
                />
                {/* Logo untuk Mobile */}
                <Image
                  src="/logomobile.png"
                  alt="JurusanKu Logo Mobile"
                  height={36}
                  width={36}
                  className={styles.logoMobile}
                  priority
                />
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
                <Link href="#/" onClick={handleNavLinkClick}>
                  Beranda
                </Link>
                <Link href="#about" onClick={handleNavLinkClick}>
                  Tentang
                </Link>
                <Link href="#contact" onClick={handleNavLinkClick}>
                  Hubungi kami
                </Link>
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
                          setIsProfileDropdownOpen(false);
                          // Close mobile menu if open
                          if (isMobileMenuOpen) setIsMobileMenuOpen(false);
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
                          setIsProfileDropdownOpen(false);
                          // Close mobile menu if open
                          if (isMobileMenuOpen) setIsMobileMenuOpen(false);
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
                    <a
                      className={`${styles.navButton} ${styles.navButtonMobile}`}
                      onClick={handleNavLinkClick}
                    >
                      Sign In
                    </a>
                  </Link>
                )}
              </div>
            </div>
          </nav>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className={styles.overlay} onClick={toggleMobileMenu} />
      )}
    </>
  );
};

export default Navbar;
