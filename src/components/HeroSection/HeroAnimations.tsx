// File: src/components/HeroSection/HeroAnimations.tsx (BARU)
"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Link from "next/link";
import styles from "@/components/styles/HeroSection.module.css";

const DISPLAY_TEXTS = [
  "minat & potensimu?",
  "karir masa depanmu?",
  "passion sejatimu?",
  "kelebihan dirimu?",
  "jurusan kuliahmu?",
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export function HeroAnimations({ userCount }: { userCount: number }) {
  const [index, setIndex] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });

  useEffect(() => {
    if (isInView) {
      setIndex(0);
      const timer = setInterval(() => {
        setIndex((prevIndex) => {
          if (prevIndex >= DISPLAY_TEXTS.length - 1) {
            clearInterval(timer);
            return DISPLAY_TEXTS.length - 1;
          }
          return prevIndex + 1;
        });
      }, 2500);
      return () => clearInterval(timer);
    }
  }, [isInView]);

  return (
    <div ref={ref}>
      <motion.div
        className={styles.heroWrapper}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
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
          <span>
            Telah digunakan oleh {userCount.toLocaleString("id-ID")}+ Pengguna
          </span>
        </motion.div>

        <motion.h1 variants={itemVariants} className={styles.heroTitle}>
          <span className={styles.staticText}>Bingung nentuin arah</span>
          <div className={styles.rollingContainer}>
            <AnimatePresence mode="wait">
              <motion.span
                key={DISPLAY_TEXTS[index]}
                initial={{ filter: "blur(8px)", opacity: 0 }}
                animate={{ filter: "blur(0px)", opacity: 1 }}
                exit={{ filter: "blur(8px)", opacity: 0 }}
                transition={{ duration: 0.5 }}
                className={styles.rollingText}
              >
                {DISPLAY_TEXTS[index]}
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.h1>

        <motion.p variants={itemVariants} className={styles.heroSubtitle}>
          Ikuti tes minat dan bakat untuk membantumu menemukan jurusan yang
          paling sesuai dengan kepribadian, minat, dan kemampuanmu!
        </motion.p>

        <motion.div variants={itemVariants}>
          <Link href="/quiz" className={styles.heroButton}>
            Tes Sekarang!
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
