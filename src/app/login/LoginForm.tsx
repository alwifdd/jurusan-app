// File: src/app/login/LoginForm.tsx (BARU)

"use client";

import React, { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import styles from "./login.module.css";

// Ganti nama komponen menjadi LoginForm
export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

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
        router.push(callbackUrl);
      }
    } catch (_err) {
      setIsLoading(false);
      setError("Terjadi kesalahan. Silakan coba lagi.");
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    signIn("google", { callbackUrl: callbackUrl });
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    // Seluruh JSX dari halaman login dipindahkan ke sini
    <div className={styles.pageContainer}>
      <div className={styles.content}>
        <div className={styles.left}>
          {/* ... dan seterusnya, seluruh kode JSX Anda ... */}
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
          <Image
            src="/illustration.png"
            alt="Illustration"
            className={styles.illustration}
            width={500}
            height={500}
            priority
          />
        </div>
      </div>
    </div>
  );
}
