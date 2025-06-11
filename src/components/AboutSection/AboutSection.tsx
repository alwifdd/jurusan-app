// src/app/aboutSection/AboutSection.tsx
import React from "react";
import Image from "next/image";
import styles from "@/components/styles/AboutSection.module.css";

const AboutSection = () => {
  return (
    <section id="about" className={styles.section}>
      <div className={`container ${styles.aboutContainer}`}>
        <div className={styles.textContainer}>
          <h2 className={styles.sectionTitle}>Tentang JurusanKu</h2>
          <p>
            JurusanKu hadir sebagai solusi untuk membantu pelajar Indonesia yang
            masih bingung menentukan jurusan kuliah. Kami percaya bahwa setiap
            orang memiliki karakter dan potensi unik yang layak dikembangkan.
            Melalui tes kepribadian MBTI, JurusanKu membantu kamu mengenal diri
            lebih dalam, sehingga dapat memilih jurusan dan jalur pendidikan
            yang paling sesuai dengan kepribadian, minat, dan bakatmu.
          </p>
        </div>
        <div className={styles.imageContainer}>
          <Image
            src="/about-illustration.png"
            alt="Tentang JurusanKu"
            width={400}
            height={400}
          />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
