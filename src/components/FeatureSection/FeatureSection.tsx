"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import styles from "@/components/styles/FeatureSection.module.css";

const features = [
  {
    image: "/ava4.png",
    title: "Kenali diri sendiri",
    description: "Pahami kepribadian dan cara berpikirmu secara mendalam.",
  },
  {
    image: "/ava5.png",
    title: "Temukan jurusan yang cocok",
    description: "Dapatkan rekomendasi jurusan berdasarkan tipe kepribadianmu.",
  },
  {
    image: "/ava6.png",
    title: "Ambil keputusan dengan percaya diri",
    description:
      "Gunakan hasil tes sebagai panduan memilih jurusan dan masa depanmu.",
  },
];

const FeatureSection = () => {
  return (
    <section className={styles.featuresSection}>
      <div className={`container ${styles.featuresContainer}`}>
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className={styles.featureCard}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            // --- DIUBAH DI SINI: `once: true` sudah dihapus ---
            viewport={{ amount: 0.3 }}
          >
            <div className={styles.imageContainer}>
              <Image
                src={feature.image}
                alt={feature.title}
                width={120}
                height={120}
              />
            </div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeatureSection;
