// src/app/login/page.tsx
import React from "react";
import styles from "./login.module.css";

export default function LoginPage() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.content}>
        {/* =========== LEFT SIDE =========== */}
        <div className={styles.left}>
          <h1 className={styles.title}>Welcome back!</h1>
          <p className={styles.subtitle}>
            Enter your Credentials to access your account
          </p>

          <form className={styles.form}>
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

            {/* Password + Forgot Password */}
            <div className={styles.formGroup}>
              <div className={styles.passwordLabelWrapper}>
                <label htmlFor="password" className={styles.label}>
                  Password
                </label>
                <a href="#" className={styles.forgotLink}>
                  forgot password
                </a>
              </div>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                className={styles.input}
              />
            </div>

            {/* Checkbox Remember me */}
            <div className={styles.checkboxGroup}>
              <input
                type="checkbox"
                id="remember"
                name="remember"
                className={styles.checkbox}
              />
              <label htmlFor="remember" className={styles.checkboxLabel}>
                Remember me for 30 days
              </label>
            </div>

            {/* Login Button */}
            <button type="submit" className={styles.primaryButton}>
              Login
            </button>

            {/* Separator */}
            <div className={styles.separator}>
              <span>or</span>
            </div>

            {/* Google Sign-in Button */}
            <button type="button" className={styles.googleButton}>
              <span className={styles.googleIcon}>G</span>
              <span>Sign in with Google</span>
            </button>
          </form>

          {/* Link to Register */}
          <p className={styles.bottomText}>
            Don&apos;t have an account?{" "}
            <a href="/register" className={styles.link}>
              Sign Up
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
