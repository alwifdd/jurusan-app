// File: src/components/QuizSection/QuizSection.tsx

"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "../styles/QuizSection.module.css";
import Modal from "../Modal/Modal";

// Tipe data
interface Question {
  id: number;
  text: string;
}
interface QuizResult {
  mbtiType: string;
  recommendations: string;
}
interface ProgressAnswers {
  [questionId: number]: string;
}

const QuizSection: React.FC = () => {
  const { status } = useSession();
  const router = useRouter();

  // State
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<ProgressAnswers>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isQuizComplete, setIsQuizComplete] = useState(false);

  // Ref untuk menandai apakah ini pemuatan data awal
  const isInitialMount = useRef(true);

  // Efek untuk memuat data awal
  useEffect(() => {
    if (status === "authenticated") {
      const loadInitialData = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const [questionsRes, progressRes] = await Promise.all([
            fetch("/api/test/questions"),
            fetch("/api/test/get-progress"),
          ]);

          if (!questionsRes.ok) throw new Error("Gagal memuat pertanyaan.");
          const questionsData = await questionsRes.json();
          const loadedQuestions = questionsData.questions || [];
          setQuestions(loadedQuestions);

          if (progressRes.ok) {
            const progressData = await progressRes.json();
            const savedAnswers = progressData.answers || {};
            setAnswers(savedAnswers);

            if (loadedQuestions.length > 0) {
              const answeredCount = Object.keys(savedAnswers).length;
              setCurrentQuestionIndex(
                Math.min(answeredCount, loadedQuestions.length)
              );
              if (answeredCount === loadedQuestions.length) {
                setIsQuizComplete(true);
              }
            }
          }
        } catch (err) {
          setError((err as Error).message);
        } finally {
          setIsLoading(false);
        }
      };
      loadInitialData();
    }
  }, [status]);

  // Efek untuk menangani logika SETELAH jawaban berubah
  useEffect(() => {
    // Abaikan saat pemuatan awal
    if (isLoading) return;
    // Abaikan jika tidak ada jawaban sama sekali (misal: setelah di-reset)
    if (Object.keys(answers).length === 0 && !isInitialMount.current) return;

    // Tandai pemuatan awal sudah selesai
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Logika untuk menyimpan dan pindah pertanyaan
    const answeredCount = Object.keys(answers).length;

    // Pindah ke pertanyaan berikutnya jika belum selesai
    if (answeredCount < questions.length) {
      setTimeout(() => {
        setCurrentQuestionIndex(answeredCount);
      }, 300);
    } else if (answeredCount === questions.length) {
      // Tandai kuis selesai jika semua sudah dijawab
      setIsQuizComplete(true);
    }

    // Ambil ID pertanyaan terakhir yang dijawab untuk disimpan
    const lastAnsweredQuestionId = questions[answeredCount - 1]?.id;
    if (lastAnsweredQuestionId) {
      const answerValue = answers[lastAnsweredQuestionId];
      fetch("/api/test/save-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: lastAnsweredQuestionId,
          answerValue,
        }),
      }).catch((error) =>
        console.error("Gagal menyimpan progres ke DB:", error)
      );
    }
  }, [answers, questions.length, isLoading]);

  // Fungsi handleAnswer sekarang hanya memperbarui state
  const handleAnswer = (questionId: number, value: string) => {
    if (isQuizComplete) return; // Jangan lakukan apa-apa jika kuis sudah selesai
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleExitConfirm = async () => {
    setIsExitModalOpen(false);
    try {
      await fetch("/api/test/clear-progress", { method: "POST" });
    } catch (error) {
      console.error("Gagal menghapus progres:", error);
    }
    router.push("/");
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch("/api/test/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal mendapatkan hasil.");
      }
      const resultData: QuizResult = await response.json();
      setResult(resultData);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Logika Tampilan (Render) ---
  if (status === "loading") {
    return (
      <div className={styles.container}>
        <p>Memeriksa sesi...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className={`${styles.container} ${styles.hasilContainer}`}>
        <div className={styles.hasilSection}>
          <h3>Akses Ditolak</h3>
          <p>Anda harus login terlebih dahulu untuk dapat mengerjakan kuis.</p>
          <Link href="/login?callbackUrl=/quiz" className={styles.submitButton}>
            Login Sekarang
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.container}>
        <p>Memuat kuis...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <p className={styles.errorMessage}>{error}</p>
      </div>
    );
  }

  if (result) {
    return (
      <div className={`${styles.container} ${styles.hasilContainer}`}>
        <div className={styles.hasilSection}>
          <h3>
            Hasil MBTI kamu: <strong>{result.mbtiType}</strong>
          </h3>
          <p>
            Rekomendasi jurusan:{" "}
            <strong>{result.recommendations || "Belum tersedia"}</strong>
          </p>
          <button
            className={styles.submitButton}
            onClick={() => window.location.reload()}
          >
            Ulangi Kuis
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className={styles.container}>
      <div className={styles.headerQuiz}>
        <h2 className={styles.quizTitle}>
          Kuis MBTI ({Object.keys(answers).length}/{questions.length})
        </h2>
        {!isQuizComplete && !result && (
          <button
            onClick={() => setIsExitModalOpen(true)}
            className={styles.exitButton}
          >
            Keluar
          </button>
        )}
      </div>

      <Modal
        isOpen={isExitModalOpen}
        onClose={() => setIsExitModalOpen(false)}
        onConfirm={handleExitConfirm}
        title="Peringatan"
      >
        Keluar dari sesi tes akan mereset semua progress dan pertanyaan yang
        sudah di jawab, kamu perlu mengulang tes dari awal.
      </Modal>

      <progress
        className={styles.progressBar}
        value={Object.keys(answers).length}
        max={questions.length}
      ></progress>

      {!isQuizComplete && currentQuestion && (
        <div key={currentQuestion.id} className={styles.pertanyaan}>
          <p className={styles.questionText}>{currentQuestion.text}</p>
          <div className={styles.opsiJawaban}>
            <button
              className={
                answers[currentQuestion.id] === "setuju" ? styles.dipilih : ""
              }
              onClick={() => handleAnswer(currentQuestion.id, "setuju")}
            >
              Setuju
            </button>
            <button
              className={
                answers[currentQuestion.id] === "netral" ? styles.dipilih : ""
              }
              onClick={() => handleAnswer(currentQuestion.id, "netral")}
            >
              Netral
            </button>
            <button
              className={
                answers[currentQuestion.id] === "tidak_setuju"
                  ? styles.dipilih
                  : ""
              }
              onClick={() => handleAnswer(currentQuestion.id, "tidak_setuju")}
            >
              Tidak Setuju
            </button>
          </div>
        </div>
      )}

      {isQuizComplete && (
        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <p
            style={{
              fontSize: "1.2rem",
              color: "#334155",
              marginBottom: "1.5rem",
            }}
          >
            Semua pertanyaan telah dijawab!
          </p>
          <button
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Memproses..." : "Lihat Hasil"}
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizSection;
