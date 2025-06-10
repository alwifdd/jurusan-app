// File: src/components/QuizSection/QuizSection.tsx (FINAL LENGKAP)

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
  description: string;
  recommendations: {
    major: string;
    reasoning: string;
  }[];
}
interface ProgressAnswers {
  [questionId: number]: string;
}

const QuizSection: React.FC = () => {
  const { status } = useSession();
  const router = useRouter();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<ProgressAnswers>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const prevAnswersRef = useRef<ProgressAnswers | undefined>(undefined);

  // useEffect untuk memuat data awal
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
            prevAnswersRef.current = savedAnswers;

            const answeredCount = Object.keys(savedAnswers).length;
            if (answeredCount < loadedQuestions.length) {
              setCurrentQuestionIndex(answeredCount);
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
    if (status === "unauthenticated") {
      setIsLoading(false);
    }
  }, [status]);

  // useEffect untuk menyimpan progres
  useEffect(() => {
    if (
      isLoading ||
      status !== "authenticated" ||
      answers === prevAnswersRef.current
    ) {
      return;
    }
    const prevKeys = Object.keys(prevAnswersRef.current || {});
    const currentKeys = Object.keys(answers);
    const newKey = currentKeys.find(
      (key) =>
        !prevKeys.includes(key) ||
        prevAnswersRef.current?.[parseInt(key)] !== answers[parseInt(key)]
    );
    if (newKey) {
      const questionId = Number(newKey);
      const answerValue = answers[questionId];
      fetch("/api/test/save-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId, answerValue }),
      }).catch((error) =>
        console.error("Gagal menyimpan progres ke DB:", error)
      );
    }
    prevAnswersRef.current = answers;
  }, [answers, status, isLoading]);

  const restartQuiz = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setResult(null);
    setError(null);
    prevAnswersRef.current = {};
  };

  const handleAnswer = (questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
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

  const handleExitConfirm = async () => {
    setIsExitModalOpen(false);
    if (status === "authenticated") {
      try {
        await fetch("/api/test/clear-progress", { method: "POST" });
        restartQuiz();
      } catch (error) {
        console.error("Gagal menghapus progres:", error);
      }
    }
    router.push("/");
  };

  const handleRestartFromSummary = async () => {
    if (status === "authenticated") {
      await fetch("/api/test/clear-progress", { method: "POST" });
    }
    restartQuiz();
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
      // Ambil data termasuk ID dari respons API
      const resultData = await response.json();

      // Alihkan pengguna ke halaman hasil yang baru
      if (resultData.id) {
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
  //if result di hps
  const currentQuestion = questions[currentQuestionIndex];
  const isQuizComplete =
    Object.keys(answers).length === questions.length && questions.length > 0;

  return (
    <div className={styles.container}>
      <div className={styles.quizBox}>
        <div className={styles.headerQuiz}>
          <h2 className={styles.quizTitle}>
            Kuis MBTI ({Object.keys(answers).length}/{questions.length})
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
          value={Object.keys(answers).length}
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
                !answers[currentQuestion?.id] ||
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
        Keluar dari sesi tes akan mereset semua progress dan pertanyaan yang
        sudah di jawab, kamu perlu mengulang tes dari awal.
      </Modal>
    </div>
  );
};

export default QuizSection;
