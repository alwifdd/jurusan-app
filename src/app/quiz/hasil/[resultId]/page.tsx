// src/app/quiz/hasil/[resultId]/page.tsx (FINAL TYPE FIX)

import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import styles from "./hasil.module.css";
import Image from "next/image";
import Link from "next/link";

// Objek deskripsi MBTI yang lengkap
const mbtiDescriptions: { [key: string]: string } = {
  ESTJ: "The Executive - Pemimpin yang praktis dan tegas. Anda suka mengorganisir orang dan proyek, sangat bertanggung jawab, dan berorientasi pada hasil yang nyata.",
  ESTP: "The Entrepreneur - Spontan dan energik. Anda suka beraksi langsung, fleksibel dalam menghadapi situasi, dan pandai beradaptasi dengan perubahan.",
  ESFJ: "The Consul - Hangat dan peduli terhadap orang lain. Anda sangat memperhatikan kebutuhan orang lain dan suka menciptakan harmoni dalam kelompok.",
  ESFP: "The Entertainer - Antusias dan kreatif. Anda suka bersosialisasi, menginspirasi orang lain, dan menikmati pengalaman baru yang menarik.",
  ENTJ: "The Commander - Pemimpin yang visioner dan tegas. Anda sangat strategis, ambisius, dan mampu mengorganisir orang untuk mencapai tujuan besar.",
  ENTP: "The Debater - Inovator yang penuh ide. Anda suka berdebat, mengeksplorasi kemungkinan baru, dan menemukan solusi kreatif untuk masalah kompleks.",
  ENFJ: "The Protagonist - Inspiratif dan empatis. Anda memiliki kemampuan natural untuk memotivasi dan membantu orang lain mencapai potensi terbaik mereka.",
  ENFP: "The Campaigner - Antusias dan imajinatif. Anda penuh energi, suka mengeksplorasi ide-ide baru, dan memiliki kemampuan memotivasi orang lain.",
  ISTJ: "The Logistician - Praktis dan dapat diandalkan. Anda sangat terorganisir, bertanggung jawab, dan suka bekerja dengan sistem yang jelas dan terstruktur.",
  ISTP: "The Virtuoso - Praktis dan adaptable. Anda suka bekerja dengan tangan, memecahkan masalah secara langsung, dan memiliki kemampuan teknis yang baik.",
  ISFJ: "The Protector - Hangat dan thoughtful. Anda sangat peduli terhadap orang lain, suka membantu, dan selalu siap mendukung orang-orang terdekat.",
  ISFP: "The Adventurer - Artistik dan sensitif. Anda memiliki nilai-nilai yang kuat, suka mengekspresikan kreativitas, dan menghargai kebebasan personal.",
  INTJ: "The Architect - Strategis dan independen. Anda memiliki visi jangka panjang yang kuat, suka merencanakan sistem yang efisien, dan berorientasi pada improvement.",
  INTP: "The Thinker - Analitis dan objektif. Anda suka mengeksplorasi ide-ide teoretis, memecahkan masalah kompleks, dan memahami cara kerja sistem.",
  INFJ: "The Advocate - Idealis dan organized. Anda memiliki visi yang kuat tentang bagaimana membantu orang lain dan membuat dunia menjadi tempat yang lebih baik.",
  INFP: "The Mediator - Idealis dan adaptable. Anda memiliki nilai-nilai yang mendalam, sangat kreatif, dan selalu mencari makna dalam segala yang Anda lakukan.",
};

async function getResultData(id: number) {
  const result = await prisma.quizResult.findUnique({ where: { id } });
  if (!result) {
    notFound();
  }

  const fullDescription =
    mbtiDescriptions[result.mbtiType] || "Tipe Kepribadian Unik";
  const descriptionParts = fullDescription.split(" - ");
  const title = descriptionParts[0] || result.mbtiType;
  const description = descriptionParts[1] || "Deskripsi tidak tersedia.";

  return {
    ...result,
    recommendations: JSON.parse(result.recommendations as string),
    mbtiTitle: title,
    mbtiDescription: description,
  };
}

// ==========================================================
// ===== PERBAIKAN UTAMA: CARA MENERIMA PROPS 'params' =====
// ==========================================================
export default async function ResultPage({
  params,
}: {
  params: { resultId: string };
}) {
  const result = await getResultData(Number(params.resultId));
  const imageUrl = `/mbti/${result.mbtiType}.png`;

  return (
    <div className={styles.pageContainer}>
      <div className={styles.resultHeader}>
        <h1 className={styles.mbtiType}>{result.mbtiType}</h1>
        <div className={styles.avatarContainer}>
          <div className={styles.avatarGlow}></div>
          <div className={styles.avatarWrapper}>
            <Image
              src={imageUrl}
              alt={result.mbtiType}
              width={280}
              height={280}
              priority
              className={styles.avatarImage}
            />
          </div>
        </div>
      </div>

      <div className={styles.contentWrapper}>
        <h2 className={styles.mbtiTitle}>{result.mbtiTitle}</h2>
        <p className={styles.mbtiDescription}>{result.mbtiDescription}</p>

        <h3 className={styles.recommendationHeading}>
          Rekomendasi Jurusan Untukmu!
        </h3>

        <div className={styles.recommendationGrid}>
          {result.recommendations.map((rec: any, index: number) => (
            <div key={index} className={styles.majorCard}>
              <h4>{rec.major}</h4>
              <p>{rec.reasoning}</p>
            </div>
          ))}
        </div>

        <Link href="/" className={styles.homeButton}>
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
