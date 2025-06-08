// File: prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import questionData from "../src/model/questions.json";

const prisma = new PrismaClient();

async function main() {
  console.log(`Mulai proses seeding...`);

  // Hapus data lama agar tidak duplikat jika dijalankan lagi
  await prisma.question.deleteMany({});
  console.log("Data pertanyaan lama berhasil dihapus.");

  for (const [dimension, questions] of Object.entries(questionData)) {
    for (const questionText of questions) {
      await prisma.question.create({
        data: {
          text: questionText,
          dimension: dimension, // 'E_I', 'S_N', 'T_F', atau 'J_P'
        },
      });
    }
  }
  console.log(
    `Seeding selesai. ${
      Object.values(questionData).flat().length
    } pertanyaan berhasil ditambahkan.`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
