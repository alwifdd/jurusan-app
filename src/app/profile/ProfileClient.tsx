// src/app/profile/ProfileClient.tsx (DENGAN PERBAIKAN JSX)
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./profile.module.css";

// Tipe data ini perlu didefinisikan agar sesuai
type UserWithHistory = {
  id: number;
  name: string | null;
  email: string;
  quizResults: {
    id: number;
    mbtiType: string;
    createdAt: Date;
  }[];
};

function formatDate(dateString: Date) {
  return new Date(dateString).toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ProfileClient({ user }: { user: UserWithHistory }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name || "");
  const [history, setHistory] = useState(user.quizResults);
  const [isLoading, setIsLoading] = useState(false);

  const handleNameUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const response = await fetch("/api/profile/update-name", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newName: name }),
    });

    setIsLoading(false);
    if (response.ok) {
      setIsEditing(false);
      router.refresh(); // Memuat ulang data dari server
    } else {
      alert("Gagal memperbarui nama.");
    }
  };

  const handleDeleteHistory = async (resultId: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus riwayat ini?")) {
      const response = await fetch("/api/history/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resultId }),
      });
      if (response.ok) {
        setHistory((prev) => prev.filter((item) => item.id !== resultId));
      } else {
        alert("Gagal menghapus riwayat.");
      }
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.profileHeader}>
        <h1>Akun Saya</h1>
        <p>Kelola informasi akun dan lihat riwayat tes Anda.</p>
      </div>

      <div className={styles.profileCard}>
        <h2>Informasi Profil</h2>
        {isEditing ? (
          <form onSubmit={handleNameUpdate} className={styles.editForm}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.editInput}
              disabled={isLoading}
            />
            <button
              type="submit"
              className={styles.saveButton}
              disabled={isLoading}
            >
              {isLoading ? "Menyimpan..." : "Simpan"}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className={styles.cancelButton}
              disabled={isLoading}
            >
              Batal
            </button>
          </form>
        ) : (
          <div className={styles.infoRow}>
            <strong>Nama:</strong>
            <div className={styles.infoValue}>
              <span>{user.name || "Belum diatur"}</span>
              <button
                onClick={() => setIsEditing(true)}
                className={styles.editButton}
              >
                Ubah
              </button>
            </div>
          </div>
        )}
        <div className={styles.infoRow}>
          <strong>Email:</strong>
          <span>{user.email}</span>
        </div>
      </div>

      <div className={styles.historyCard}>
        <h2>Riwayat Tes Anda</h2>
        {history.length > 0 ? (
          <ul className={styles.historyList}>
            {history.map((result) => (
              <li key={result.id} className={styles.historyItem}>
                <div className={styles.historyInfo}>
                  <span className={styles.historyMbti}>{result.mbtiType}</span>
                  <span className={styles.historyDate}>
                    Tes diambil pada {formatDate(result.createdAt)}
                  </span>
                </div>
                <div className={styles.historyActions}>
                  <Link
                    href={`/quiz/hasil/${result.id}`}
                    className={styles.viewResultButton}
                  >
                    Lihat
                  </Link>
                  <button
                    onClick={() => handleDeleteHistory(result.id)}
                    className={styles.deleteButton}
                  >
                    Hapus
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.noHistory}>Anda belum memiliki riwayat tes.</p>
        )}
      </div>
    </div>
  );
}
