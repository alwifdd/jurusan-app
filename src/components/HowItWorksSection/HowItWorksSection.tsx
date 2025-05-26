import React from "react";
import styles from "@/components/styles/HowItWorksSection.module.css";

const steps = [
  {
    number: 1,
    title: "Siapkan Dirimu",
    description:
      "Cari tempat yang tenang dan nyaman agar kamu bisa fokus selama mengerjakan tes.",
  },
  {
    number: 2,
    title: "Selesaikan Tes",
    description:
      "Jawab pertanyaan yang dirancang untuk mengungkap kepribadianmu secara mendalam.",
  },
  {
    number: 3,
    title: "Dapatkan Insight",
    description:
      "Pelajari tipe kepribadianmu dan lihat jurusan yang paling sesuai dengan potensimu.",
  },
];

const HowItWorksSection = () => {
  return (
    <section className={styles.section}>
      <div className="container">
        <h2 className={styles.sectionTitle}>Bagaimana Cara Kerjanya?</h2>
        <div className={styles.stepsContainer}>
          {steps.map((step) => (
            <div key={step.number} className={styles.stepCard}>
              <div className={styles.stepNumber}>{step.number}</div>
              <div className={styles.stepText}>
                <h4>{step.title}</h4>
                <p>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <a href="#" className={styles.sectionButton}>
            Tes Sekarang Temukan Potensimu!
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
