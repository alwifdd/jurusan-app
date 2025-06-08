// File: src/app/login/page.tsx

"use client";

import React, { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation"; // <-- 1. IMPORT useSearchParams
import Link from "next/link";
import styles from "./login.module.css";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams(); // <-- 2. GUNAKAN useSearchParams
  const callbackUrl = searchParams.get("callbackUrl") || "/"; // <-- 3. AMBIL callbackUrl, JIKA TIDAK ADA, DEFAULT KE HOME ('/')

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // --- Logika untuk login dengan email/password ---
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      setIsLoading(false);

      if (result?.error) {
        setError(
          result.error === "CredentialsSignin"
            ? "Email atau password salah."
            : result.error
        );
      } else if (result?.ok) {
        // --- 4. PERUBAHAN DI SINI ---
        router.push(callbackUrl); // Arahkan ke callbackUrl, bukan ke "/"
        // -------------------------
      }
    } catch (err) {
      setIsLoading(false);
      setError("Terjadi kesalahan. Silakan coba lagi.");
    }
  };

  // --- Logika untuk login dengan Google ---
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    // --- 5. PERUBAHAN DI SINI ---
    // Gunakan callbackUrl yang sudah kita ambil dari URL
    signIn("google", { callbackUrl: callbackUrl });
    // -------------------------
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // --- Bagian JSX tidak ada perubahan, hanya menyalin ulang ---
  return (
    <div className={styles.pageContainer}>
      <div className={styles.content}>
        <div className={styles.left}>
          <h1 className={styles.title}>Welcome back!</h1>
          <p className={styles.subtitle}>
            Enter your Credentials to access your account
          </p>

          <form onSubmit={handleSubmit} className={styles.form}>
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className={styles.formGroup}>
              <div className={styles.passwordLabelWrapper}>
                <label htmlFor="password" className={styles.label}>
                  Password
                </label>
                <Link href="/forgot-password" className={styles.forgotLink}>
                  forgot password
                </Link>
              </div>
              <div className={styles.passwordInputContainer}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Password"
                  className={styles.input}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                {password.length > 0 && (
                  <button
                    type="button"
                    onClick={toggleShowPassword}
                    className={styles.togglePasswordButton}
                    aria-label={
                      showPassword
                        ? "Sembunyikan password"
                        : "Tampilkan password"
                    }
                    disabled={isLoading}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                )}
              </div>
            </div>
            {error && <p className={styles.errorMessage}>{error}</p>}
            <button
              type="submit"
              className={styles.primaryButton}
              disabled={isLoading}
            >
              {isLoading ? "Memproses..." : "Login"}
            </button>
            <div className={styles.separator}>
              <span>or</span>
            </div>
            <button
              type="button"
              className={styles.googleButton}
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <span className={styles.googleIcon}>G</span>
              <span>Sign in with Google</span>
            </button>
          </form>
          <p className={styles.bottomText}>
            Don&apos;t have an account?{" "}
            <Link href="/register" className={styles.link}>
              Sign Up
            </Link>
          </p>
        </div>
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
