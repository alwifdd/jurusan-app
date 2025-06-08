// src/app/register/page.tsx
"use client";

import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./register.module.css";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // State untuk visibilitas password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    try {
      const response = await fetch("/api/account/register", {
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

  // Tidak ada perubahan logika, hanya penambahan JSX di bawah

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Buat Akun Baru</h1>
        <p className={styles.subtitle}>
          Daftarkan diri Anda untuk memulai perjalanan menemukan jurusan.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {success && <p className={styles.successMessage}>{success}</p>}
          {error && <p className={styles.errorMessage}>{error}</p>}

          {/* ... (Input untuk Nama Lengkap dan Email tidak berubah) ... */}
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>
              Nama Lengkap
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama lengkap Anda"
              className={styles.input}
              required
              disabled={isLoading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Alamat Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contoh@email.com"
              className={styles.input}
              required
              disabled={isLoading}
            />
          </div>

          {/* ===== PERUBAHAN PADA INPUT PASSWORD ===== */}
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <div className={styles.passwordInputContainer}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className={styles.input}
                required
                disabled={isLoading}
              />
              {/* Tombol mata hanya muncul jika ada isi di kolom password */}
              {password && (
                <button
                  type="button"
                  className={styles.togglePasswordButton}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              )}
            </div>
          </div>

          {/* ===== PERUBAHAN PADA INPUT KONFIRMASI PASSWORD ===== */}
          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>
              Konfirmasi Password
            </label>
            <div className={styles.passwordInputContainer}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi password Anda"
                className={styles.input}
                required
                disabled={isLoading}
              />
              {/* Tombol mata hanya muncul jika ada isi di kolom konfirmasi password */}
              {confirmPassword && (
                <button
                  type="button"
                  className={styles.togglePasswordButton}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>
              )}
            </div>
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? "Mendaftar..." : "Daftar Sekarang"}
          </button>
        </form>

        <p className={styles.bottomText}>
          Sudah punya akun?{" "}
          <Link href="/login" className={styles.link}>
            Login di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
