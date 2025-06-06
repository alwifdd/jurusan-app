import React, { useState } from 'react';
import styles from './QuizSection.module.css';

interface Question {
  id: number;
  text: string;
  dimensi: 'EI' | 'SN' | 'TF' | 'JP';
}

const pertanyaan: Question[] = [
  { id: 1, text: 'Saya senang bersosialisasi dan bertemu orang baru.', dimensi: 'EI' },
  { id: 2, text: 'Saya lebih suka menganalisis fakta daripada mengandalkan intuisi.', dimensi: 'SN' },
  { id: 3, text: 'Saya mengambil keputusan berdasarkan logika.', dimensi: 'TF' },
  { id: 4, text: 'Saya suka membuat rencana dan mengikuti jadwal.', dimensi: 'JP' },
];

const hasilJurusan: { [tipe: string]: string } = {
  INFP: 'Psikologi, Sastra, Ilmu Sosial',
  ESTJ: 'Manajemen, Hukum, Teknik Industri',
  ISTP: 'Teknik, Informatika, Otomotif',
  ENFP: 'Komunikasi, Desain, Pemasaran',
};

const QuizSection: React.FC = () => {
  const [jawaban, setJawaban] = useState<{ [key: number]: string }>({});
  const [hasilMBTI, setHasilMBTI] = useState<string | null>(null);

  const handleJawaban = (id: number, nilai: string) => {
    setJawaban(prev => ({ ...prev, [id]: nilai }));
  };

  const hitungHasil = () => {
    const skor: { [dimensi: string]: number } = { EI: 0, SN: 0, TF: 0, JP: 0 };

    pertanyaan.forEach((q) => {
      const nilai = jawaban[q.id];
      if (nilai === 'sangat_setuju') skor[q.dimensi]++;
      else if (nilai === 'tidak_setuju') skor[q.dimensi]--;
    });

    const tipeMBTI =
      (skor.EI >= 0 ? 'E' : 'I') +
      (skor.SN >= 0 ? 'S' : 'N') +
      (skor.TF >= 0 ? 'T' : 'F') +
      (skor.JP >= 0 ? 'J' : 'P');

    setHasilMBTI(tipeMBTI);
  };

  return (
    <div className={styles.container}>
      <h2>Kuis Penentuan Jurusan Berdasarkan MBTI</h2>
      {pertanyaan.map((q) => (
        <div key={q.id} className={styles.pertanyaan}>
          <p>{q.text}</p>
          <div className={styles.opsiJawaban}>
            <button
              className={jawaban[q.id] === 'sangat_setuju' ? styles.dipilih : ''}
              onClick={() => handleJawaban(q.id, 'sangat_setuju')}
            >
              Sangat Setuju
            </button>
            <button
              className={jawaban[q.id] === 'netral' ? styles.dipilih : ''}
              onClick={() => handleJawaban(q.id, 'netral')}
            >
              Netral
            </button>
            <button
              className={jawaban[q.id] === 'tidak_setuju' ? styles.dipilih : ''}
              onClick={() => handleJawaban(q.id, 'tidak_setuju')}
            >
              Tidak Setuju
            </button>
          </div>
        </div>
      ))}
      <button className={styles.submitButton} onClick={hitungHasil}>
        Lihat Hasil
      </button>

      {hasilMBTI && (
        <div className={styles.hasilSection}>
          <h3>Hasil MBTI kamu: <strong>{hasilMBTI}</strong></h3>
          <p>Rekomendasi jurusan: <strong>{hasilJurusan[hasilMBTI] || 'Belum tersedia'}</strong></p>
        </div>
      )}
    </div>
  );
};

export default QuizSection;
