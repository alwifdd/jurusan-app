// File: src/app/quiz/page.tsx

import QuizSection from "@/components/QuizSection/QuizSection"; // Impor komponen kuis dari folder components

export default function QuizPage() {
  // Halaman ini hanya bertugas untuk menampilkan komponen QuizSection.
  // Semua logika sudah ada di dalam QuizSection itu sendiri.
  return (
    <main>
      <QuizSection />
    </main>
  );
}
