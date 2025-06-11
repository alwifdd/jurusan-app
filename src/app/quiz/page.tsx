// src/app/quiz/page.tsx (INI YANG PERLU DIPASTIKAN BENAR)

import { Suspense } from "react";
import QuizSection from "@/components/QuizSection/QuizSection";

// Komponen loading sederhana sebagai fallback
const QuizLoading = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <p>Mempersiapkan kuis...</p>
    </div>
  );
};

export default function QuizPage() {
  return (
    <main>
      <Suspense fallback={<QuizLoading />}>
        <QuizSection />
      </Suspense>
    </main>
  );
}
