"use client";
import React from "react";
import Image from "next/image";
import { TypeAnimation } from "react-type-animation";
import { motion } from "framer-motion"; // <-- IMPORT MOTION
import styles from "@/components/styles/HeroSection.module.css";

// --- VARIAN ANIMASI BARU ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Memberi jeda antar animasi anak-anaknya
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 }, // Mulai dari 20px di bawah dan transparan
  visible: { y: 0, opacity: 1 }, // Kembali ke posisi asli dan terlihat
};
// ----------------------------

const HeroSection = () => {
  return (
    <div className="container">
      {/* Bungkus dengan motion.div dan terapkan varian animasi */}
      <motion.div
        className={styles.heroWrapper}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className={styles.userCount}>
          <div className={styles.avatarStack}>
            <Image
              src="/ava1.png"
              alt="user 1"
              width={32}
              height={32}
              className={styles.avatarImage}
            />
            <Image
              src="/ava2.png"
              alt="user 2"
              width={32}
              height={32}
              className={styles.avatarImage}
            />
            <Image
              src="/ava3.png"
              alt="user 3"
              width={32}
              height={32}
              className={styles.avatarImage}
            />
          </div>
          <span>8000+ orang menggunakan produk kami</span>
        </motion.div>

        <motion.h1 variants={itemVariants} className={styles.heroTitle}>
          Bingung nentuin arah{" "}
          <TypeAnimation
            sequence={[
              "minat dan potensimu?",
              2000,
              "karir masa depanmu?",
              2000,
              "jurusan kuliahmu?",
              2000,
            ]}
            wrapper="span"
            speed={50}
            repeat={Infinity}
            cursor={true}
          />
        </motion.h1>

        <motion.p variants={itemVariants} className={styles.heroSubtitle}>
          Ikuti tes minat dan bakat untuk membantumu menemukan jurusan yang
          paling sesuai dengan kepribadian, minat, dan kemampuanmu!
        </motion.p>

        <motion.div variants={itemVariants}>
          <a href="#" className={styles.heroButton}>
            Tes Sekarang!
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HeroSection;
