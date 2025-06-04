"use client";
import React, { useState } from "react";
import Image from "next/image";
import styles from "@/components/styles/GrowSection.module.css";

interface GrowCardProps {
  title: string;
  description: string;
  imageSrc: string;
  cardClass: string;
}

const growData: GrowCardProps[] = [
  {
    imageSrc: "/sesi1.png",
    title: "Jangan Salah Pilih Jurusan.",
    description:
      "Temukan program studi yang paling sesuai dengan kepribadian dan potensi sejatimu. Ikuti tes MBTI kami yang dirancang untuk calon mahasiswa.",
    cardClass: styles.cardBlue,
  },
  {
    imageSrc: "/sesi2.png",
    title: "Pahami Kekuatan Super dalam Dirimu.",
    description:
      "Kepribadianmu adalah aset terbesarmu. Kenali kekuatan unikmu untuk membuat keputusan yang lebih baik untuk masa depan pendidikan dan karirmu.",
    cardClass: styles.cardPink,
  },
  {
    imageSrc: "/sesi3.png",
    title: "Rancang Masa Depan Karirmu, Hari Ini.",
    description:
      "Kepribadianmu adalah kompasmu. Temukan jalur karir yang paling memungkinkan kamu berkembang dan sukses. Buat pilihan pendidikan yang cerdas.",
    cardClass: styles.cardGreen,
  },
];

const GrowSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalSlides = growData.length;

  const handleNavClick = (direction: "prev" | "next") => {
    if (direction === "next") {
      setCurrentIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
    } else {
      setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
    }
  };

  return (
    <section className={styles.growSection}>
      <div className={`container ${styles.sliderAreaWrapper}`}>
        {" "}
        {/* .sliderAreaWrapper punya position: relative */}
        <div className={styles.header}>
          <h2 className={styles.sectionTitle}>Grow with your type</h2>
        </div>
        <div className={styles.sliderViewport}>
          <div
            className={styles.sliderContainer}
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {growData.map((card, index) => (
              <div key={index} className={styles.slide}>
                <div className={`${styles.growCard} ${card.cardClass}`}>
                  <div className={styles.imageContainer}>
                    <Image
                      src={card.imageSrc}
                      alt={card.title}
                      width={400}
                      height={250}
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                  <div className={styles.textContainer}>
                    <h3>{card.title}</h3>
                    <p>{card.description}</p>
                    <a href="#" className={styles.cardButton}>
                      Mulai
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Tombol navigasi sekarang di sini, sebagai anak langsung dari .sliderAreaWrapper */}
        <div className={styles.controls}>
          <button
            onClick={() => handleNavClick("prev")}
            className={styles.navButton}
          >
            {" "}
            &lt;{" "}
          </button>
          <span className={styles.counter}>
            {currentIndex + 1} / {totalSlides}
          </span>
          <button
            onClick={() => handleNavClick("next")}
            className={styles.navButton}
          >
            {" "}
            &gt;{" "}
          </button>
        </div>
      </div>
    </section>
  );
};

export default GrowSection;
