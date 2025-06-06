// src/app/login/page.tsx
"use client";

import React, { useState, FormEvent } from "react";
import { signIn } from "next-auth/react"; // signIn sudah diimport
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./login.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
        router.push("/");
      } else {
        setError("Login gagal. Silakan coba lagi.");
      }
    } catch (err) {
      setIsLoading(false);
      console.error("Login catch error:", err);
      setError("Terjadi kesalahan. Silakan coba lagi.");
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    // Panggil signIn dengan provider 'google'
    // NextAuth.js akan menangani redirect ke Google dan callback-nya
    try {
      const result = await signIn("google", { callbackUrl: "/" }); // Redirect ke home setelah sukses
      // Jika ada error saat proses signIn (misalnya user cancel atau popup diblock), result.error akan terisi
      // Untuk OAuth, jika redirect berhasil, halaman akan berganti, jadi setIsLoading(false) mungkin tidak tereksekusi di sini
      // jika redirect terjadi. Error biasanya ditangani di halaman error NextAuth atau callbackUrl.
      if (result?.error) {
        setError("Gagal login dengan Google: " + result.error);
        setIsLoading(false); // Set false jika ada error dan tidak redirect
      } else if (result?.ok && !result.url) {
        // Jika ok tapi tidak ada url (artinya tidak redirect, mungkin jarang terjadi untuk Google OAuth flow standar)
        setIsLoading(false);
      }
      // Jika result.ok dan ada result.url, redirect akan terjadi otomatis oleh signIn
      // Jika tidak, dan result.ok, maka sudah berhasil dan setIsLoading(false) di atas sudah cukup
    } catch (err) {
      setIsLoading(false);
      console.error("Google Sign-In catch error:", err);
      setError("Terjadi kesalahan saat mencoba login dengan Google.");
    }
  };

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
              {isLoading && email && password ? "Memproses..." : "Login"}{" "}
              {/* Sedikit penyesuaian teks loading */}
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
