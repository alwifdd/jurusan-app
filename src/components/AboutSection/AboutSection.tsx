import React from "react";
import Image from "next/image";
import styles from "@/components/styles/AboutSection.module.css";

const AboutSection = () => {
  return (
    <section className={styles.section}>
      <div className={`container ${styles.aboutContainer}`}>
        <div className={styles.textContainer}>
          <h2 className={styles.sectionTitle}>Tentang JurusanKu</h2>
          <p>
            JurusanKu lahir dari keprihatinan melihat banyaknya pelajar
            Indonesia yang bingung memilih jurusan kuliah. Kami percaya bahwa
            setiap individu memiliki keunikan dan potensi yang berbeda-beda.
          </p>
          <p>
            Dengan menggunakan tes kepribadian MBTI yang telah terbukti akurat,
            kami membantu setiap individu memahami diri mereka sendiri dan
            menemukan jalur pendidikan yang sesuai dengan karakteristik, minat,
            dan bakat mereka.
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
