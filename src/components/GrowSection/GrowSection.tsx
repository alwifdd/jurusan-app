"use client";
import React from "react";
import Image from "next/image";
import styles from "@/components/styles/GrowSection.module.css";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// PERBAIKAN UTAMA DI SINI: Teks deskripsi sudah dilengkapi
const growData = [
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
  return (
    <section className={styles.growSection}>
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>Tumbuh dan kembangkan dirimu</h2>
      </div>

      <Swiper
        modules={[Navigation, Pagination]}
        slidesPerView={1}
        spaceBetween={30}
        centeredSlides={true}
        loop={true}
        pagination={{
          el: `.${styles.swiperPagination}`,
          clickable: true,
          renderBullet: (index, className) => {
            return `<span class="${className} ${styles.swiperBullet}"></span>`;
          },
        }}
        navigation={{
          nextEl: `.${styles.swiperButtonNext}`,
          prevEl: `.${styles.swiperButtonPrev}`,
        }}
        className={styles.mySwiper}
      >
        {growData.map((card, index) => (
          <SwiperSlide key={index}>
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
              </div>
              <a href="#" className={styles.cardButton}>
                Mulai
              </a>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigasi & Pagination Custom */}
      <div className={styles.controls}>
        <div className={`${styles.navButton} ${styles.swiperButtonPrev}`}>
          &lt;
        </div>
        <div className={styles.swiperPagination}></div>
        <div className={`${styles.navButton} ${styles.swiperButtonNext}`}>
          &gt;
        </div>
      </div>
    </section>
  );
};

export default GrowSection;
