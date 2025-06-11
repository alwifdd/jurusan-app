// File: src/app/login/LoginForm.tsx

"use client";

import React, { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import styles from "./login.module.css";

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
            ? "Email atau kata sandi salah."
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
    <div className={styles.pageContainer}>
      <div className={styles.content}>
        <div className={styles.left}>
          <h1 className={styles.title}>Selamat datang kembali</h1>
          <p className={styles.subtitle}>
            Masukkan kredensial Anda untuk mengakses akun
          </p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                Alamat email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Masukkan email Anda"
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
                  Kata sandi
                </label>
                <Link href="/lupa-kata-sandi" className={styles.forgotLink}>
                  lupa kata sandi?
                </Link>
              </div>
              <div className={styles.passwordInputContainer}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Masukkan kata sandi"
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
                        ? "Sembunyikan kata sandi"
                        : "Tampilkan kata sandi"
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
              {isLoading ? "Memproses..." : "Masuk"}
            </button>

            <div className={styles.separator}>
              <span>atau</span>
            </div>

            <button
              type="button"
              className={styles.googleButton}
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <span className={styles.googleIcon}></span>
              <span>Masuk dengan Google</span>
            </button>
          </form>

          <p className={styles.bottomText}>
            Belum punya akun?{" "}
            <Link href="/register" className={styles.link}>
              Daftar sekarang
            </Link>
          </p>
        </div>

        <div className={styles.right}>
          <Image
            src="/illustration.png"
            alt="Ilustrasi masuk"
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
