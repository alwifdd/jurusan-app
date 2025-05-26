import React from "react";
import Image from "next/image";
import styles from "@/components/styles/TeamSection.module.css";

// Interface tidak berubah
interface TeamMember {
  name: string;
  role: string;
  imageUrl?: string;
  bgColor: string;
}

// Data tim tidak berubah
const teamData: TeamMember[] = [
  {
    name: "Naufal",
    role: "Machine Learning",
    imageUrl: "/Tim/naufal.png",
    bgColor: "#4CAF50",
  },
  {
    name: "Alwi",
    role: "Fullstack Dev",
    imageUrl: "/Tim/alwi.png",
    bgColor: "#FF9800",
  },
  {
    name: "Chandra",
    role: "Machine Learning",
    imageUrl: "",
    bgColor: "#CDDC39",
  },
  {
    name: "Elang",
    role: "Fullstack Dev",
    imageUrl: "/Tim/Elang.png",
    bgColor: "#607D8B",
  },
  {
    name: "Raden",
    role: "Machine Learning",
    imageUrl: "",
    bgColor: "#FFEB3B",
  },
  {
    name: "Rafa",
    role: "Fullstack Dev",
    imageUrl: "/Tim/rafa.png",
    bgColor: "#E91E63",
  },
];

const TeamSection = () => {
  return (
    // Section utama tetap sama
    <section className={styles.teamSection}>
      {/* === PERUBAHAN STRUKTUR DI SINI === */}

      {/* 1. Judul sekarang dibungkus oleh container-nya sendiri agar tetap di tengah */}
      <div className="container">
        <h2 className={styles.sectionTitle}>Tim Kami</h2>
      </div>

      {/* 2. Wrapper untuk scroller sekarang berada di luar container */}
      {/* Ini membuatnya bisa membentang 100% selebar layar */}
      <div className={styles.horizontalScrollWrapper}>
        <div className={styles.horizontalScrollContent}>
          {[...teamData, ...teamData].map((member, index) => (
            <div
              key={`${member.name}-${index}`}
              className={styles.teamCard}
              style={{ backgroundColor: member.bgColor }}
            >
              {member.imageUrl ? (
                <Image
                  src={member.imageUrl}
                  alt={`Foto ${member.name}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className={styles.teamPhoto}
                />
              ) : null}
              <div className={styles.teamInfoOverlay}>
                <h4>{member.name}</h4>
                <p>{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
