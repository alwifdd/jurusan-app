// src/app/register/page.tsx
"use client";

import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./register.module.css"; // Pastikan file CSS ini ada dan sesuai

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State untuk toggle password utama
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State untuk toggle konfirmasi password
  // const [agree, setAgree] = useState(false); // Jika Anda ingin validasi checkbox
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok.");
      setIsLoading(false);
      return;
    }
    // TODO: Tambahkan validasi untuk checkbox 'agree' jika diperlukan
    // if (!agree) {
    //   setError("Anda harus menyetujui syarat dan kebijakan.");
    //   setIsLoading(false);
    //   return;
    // }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registrasi gagal. Silakan coba lagi.");
      } else {
        setSuccess(
          "Registrasi berhasil! Anda akan diarahkan ke halaman login."
        );
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        // setAgree(false);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (err) {
      console.error("Registration catch error:", err);
      setError("Terjadi kesalahan. Periksa koneksi Anda dan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    alert("Fitur Sign in with Google akan segera hadir!");
    setIsLoading(false);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formWrapper}>
        {" "}
        {/* Menggunakan .formWrapper dari CSS Anda */}
        <h1 className={styles.title}>Get Started Now</h1>{" "}
        {/* Menggunakan .title dari CSS Anda */}
        {/* Anda bisa menambahkan subtitle di sini jika mau */}
        {/* <p className={styles.subtitle}>Daftarkan diri Anda...</p> */}
        <form onSubmit={handleSubmit} className={styles.form}>
          {success && <p className={styles.successMessage}>{success}</p>}
          {error && <p className={styles.errorMessage}>{error}</p>}

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
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

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

          {/* Password */}
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <div className={styles.passwordInputContainer}>
              {" "}
              {/* Wrapper untuk input dan tombol mata */}
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
              {password.length > 0 && ( // Tombol mata muncul jika ada isi
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className={styles.togglePasswordButton}
                  aria-label={
                    showPassword ? "Sembunyikan password" : "Tampilkan password"
                  }
                  disabled={isLoading}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              )}
            </div>
          </div>

          {/* Konfirmasi Password */}
          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>
              Confirm Password
            </label>
            <div className={styles.passwordInputContainer}>
              {" "}
              {/* Wrapper untuk input dan tombol mata */}
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
                className={styles.input}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
              />
              {confirmPassword.length > 0 && ( // Tombol mata muncul jika ada isi
                <button
                  type="button"
                  onClick={toggleShowConfirmPassword}
                  className={styles.togglePasswordButton}
                  aria-label={
                    showConfirmPassword
                      ? "Sembunyikan konfirmasi password"
                      : "Tampilkan konfirmasi password"
                  }
                  disabled={isLoading}
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>
              )}
            </div>
          </div>

          {/* Checkbox Terms & Policy */}
          <div className={styles.checkboxGroup}>
            <input
              type="checkbox"
              id="agree"
              name="agree"
              className={styles.checkbox}
              // checked={agree} // Jika menggunakan state untuk 'agree'
              // onChange={(e) => setAgree(e.target.checked)} // Jika menggunakan state
              required
              disabled={isLoading}
            />
            <label htmlFor="agree" className={styles.checkboxLabel}>
              I agree to the terms &amp; policy
            </label>
          </div>

          <button
            type="submit"
            className={styles.primaryButton}
            disabled={isLoading}
          >
            {isLoading ? "Signing up..." : "Signup"}
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
          Have an account?{" "}
          <Link href="/login" className={styles.link}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
