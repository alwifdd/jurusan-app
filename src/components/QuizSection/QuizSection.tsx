// File: src/components/QuizSection/QuizSection.tsx (VERSI FINAL & BENAR)

"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "../styles/QuizSection.module.css";
import Modal from "../Modal/Modal";

// Tipe data
interface Question {
  id: number;
  text: string;
}

interface ProgressAnswers {
  [questionId: string]: string;
}

const QuizSection: React.FC = () => {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<ProgressAnswers>({});
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const prevAnswersRef = useRef<ProgressAnswers | undefined>(undefined);

  const restartQuiz = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setError(null);
    prevAnswersRef.current = {};
  };

  useEffect(() => {
    const isNewStart = searchParams.get("start") === "new";

    const loadInitialData = async () => {
      if (status !== "authenticated") {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      // --- PERBAIKAN SINTAKS PADA BLOK INI ---
      if (isNewStart) {
        try {
          await fetch("/api/test/clear-progress", { method: "POST" });
          restartQuiz();
          // Ganti URL menjadi /quiz tanpa me-reload halaman
          router.replace("/quiz", { scroll: false });
        } catch (e) {
          console.error("Failed to clear progress for new test", e);
        }
      }
      // --- AKHIR PERBAIKAN SINTAKS ---

      try {
        const [questionsRes, progressRes] = await Promise.all([
          fetch("/api/test/questions"),
          !isNewStart
            ? fetch("/api/test/get-progress", { cache: "no-store" })
            : Promise.resolve(null),
        ]);

        if (!questionsRes.ok) throw new Error("Gagal memuat pertanyaan.");

        const questionsData = await questionsRes.json();
        const loadedQuestions = questionsData.questions || [];
        setQuestions(loadedQuestions);

        if (progressRes && progressRes.ok) {
          const progressData = await progressRes.json();
          const savedAnswers = progressData.answers || {};
          setAnswers(savedAnswers);
          prevAnswersRef.current = savedAnswers;

          const answeredCount = Object.keys(savedAnswers).length;
          if (
            answeredCount > 0 &&
            answeredCount < loadedQuestions.length &&
            loadedQuestions.length > 0
          ) {
            setCurrentQuestionIndex(answeredCount);
          }
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    if (status !== "loading") {
      loadInitialData();
    }
  }, [status, searchParams, router]); // Tambahkan router ke dependency array

  useEffect(() => {
    if (
      isLoading ||
      status !== "authenticated" ||
      JSON.stringify(answers) === JSON.stringify(prevAnswersRef.current)
    ) {
      return;
    }

    const prevAnswers = prevAnswersRef.current || {};
    const currentAnswers = answers;

    const changedKey = Object.keys(currentAnswers).find(
      (key) => currentAnswers[key] !== prevAnswers[key]
    );

    if (changedKey) {
      const questionId = Number(changedKey);
      const answerValue = currentAnswers[questionId];
      fetch("/api/test/save-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId, answerValue }),
      }).catch(console.error);
    }

    prevAnswersRef.current = { ...answers };
  }, [answers, status, isLoading]);

  const handleAnswer = (questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId.toString()]: value }));
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // --- PERBAIKAN LOGIKA KELUAR ---
  // Sekarang hanya menutup modal dan kembali ke home, progress tetap aman tersimpan.
  const handleExitConfirm = () => {
    setIsExitModalOpen(false);
    router.push("/");
  };
  // --- AKHIR PERBAIKAN ---

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
      const resultData = await response.json();
      if (resultData.id) {
        if (status === "authenticated") {
          await fetch("/api/test/clear-progress", { method: "POST" });
        }
        router.push(`/quiz/hasil/${resultData.id}`);
      } else {
        throw new Error("Gagal mendapatkan ID hasil tes.");
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className={styles.container}>
        <p>Memuat...</p>
      </div>
    );
  }
  if (status === "unauthenticated") {
    return (
      <div className={`${styles.container} ${styles.hasilContainer}`}>
        <div className={styles.quizBox}>
          <h3>Akses Ditolak</h3>
          <p>Anda harus login terlebih dahulu untuk dapat mengerjakan kuis.</p>
          <Link href="/login?callbackUrl=/quiz" className={styles.submitButton}>
            Login Sekarang
          </Link>
        </div>
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

  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = Object.keys(answers).length;
  const isQuizComplete =
    answeredCount === questions.length && questions.length > 0;

  return (
    <div className={styles.container}>
      <div className={styles.quizBox}>
        <div className={styles.headerQuiz}>
          <h2 className={styles.quizTitle}>
            Kuis MBTI (
            {isQuizComplete ? questions.length : currentQuestionIndex + 1}/
            {questions.length})
          </h2>
          <button
            onClick={() => setIsExitModalOpen(true)}
            className={styles.exitButton}
          >
            Keluar
          </button>
        </div>

        <progress
          className={styles.progressBar}
          value={answeredCount}
          max={questions.length}
        ></progress>

        {currentQuestion && (
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

        <div className={styles.navigationContainer}>
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className={styles.navButton}
          >
            Kembali
          </button>
          {isQuizComplete ? (
            <button
              className={styles.submitButton}
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Memproses..." : "Lihat Hasil"}
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              disabled={
                !answers[questions[currentQuestionIndex]?.id] ||
                currentQuestionIndex === questions.length - 1
              }
              className={styles.navButton}
            >
              Selanjutnya
            </button>
          )}
        </div>
      </div>

      <Modal
        isOpen={isExitModalOpen}
        onClose={() => setIsExitModalOpen(false)}
        onConfirm={handleExitConfirm}
        title="Peringatan"
      >
        <p>Apakah Anda yakin ingin keluar? Progres Anda akan tersimpan.</p>
      </Modal>
    </div>
  );
};

export default QuizSection;
