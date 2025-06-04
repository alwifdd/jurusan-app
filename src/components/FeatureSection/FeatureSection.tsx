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
            initial={{ opacity: 0, y: 50 }} // State awal (tersembunyi, sedikit di bawah)
            whileInView={{ opacity: 1, y: 0 }} // State ketika elemen terlihat di viewport
            transition={{ duration: 0.5, delay: index * 0.2 }}
            viewport={{
              amount: 0.5, // Elemen dianggap 'in view' jika 50% terlihat. Sesuaikan jika perlu.
              // once: true, // <--- BARIS INI DIHAPUS atau dijadikan false
            }}
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
