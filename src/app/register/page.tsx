// src/app/register/page.tsx
import React from "react";
import styles from "./register.module.css";

export default function RegisterPage() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.content}>
        {/* =========== LEFT SIDE =========== */}
        <div className={styles.left}>
          <h1 className={styles.title}>Get Started Now</h1>

          <form className={styles.form}>
            {/* Name */}
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your name"
                className={styles.input}
              />
            </div>

            {/* Email Address */}
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                className={styles.input}
              />
            </div>

            {/* Password */}
            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                className={styles.input}
              />
            </div>

            {/* Checkbox Terms & Policy */}
            <div className={styles.checkboxGroup}>
              <input
                type="checkbox"
                id="agree"
                name="agree"
                className={styles.checkbox}
              />
              <label htmlFor="agree" className={styles.checkboxLabel}>
                I agree to the terms &amp; policy
              </label>
            </div>

            {/* Signup Button */}
            <button type="submit" className={styles.primaryButton}>
              Signup
            </button>

            {/* Separator */}
            <div className={styles.separator}>
              <span>or</span>
            </div>

            {/* Google Sign-in Button */}
            <button type="button" className={styles.googleButton}>
              {/* Jika ingin menambahkan icon Google, letakkan di sini */}
              <span className={styles.googleIcon}>G</span>
              <span>Sign in with Google</span>
            </button>
          </form>

          {/* Link to Login */}
          <p className={styles.bottomText}>
            Have an account?{" "}
            <a href="/login" className={styles.link}>
              Sign in
            </a>
          </p>
        </div>

        {/* =========== RIGHT SIDE (Ilustrasi) =========== */}
        <div className={styles.right}>
          <img
            src="/illustration.png"
            alt="Illustration"
            className={styles.illustration}
          />
        </div>
      </div>
    </div>
  );
}
