// File: src/app/api/test/submit/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import path from "path";
import fs from "fs/promises";
import * as tf from "@tensorflow/tfjs";

// --- INTERFACE (TIDAK BERUBAH) ---
interface Scaler {
  mean: number[];
  scale: number[];
}
interface LabelEncoder {
  classes: string[];
}
// Definisikan tipe yang lebih detail untuk major_mapping.json
interface MajorMapping {
  [key: string]: {
    majors: string[];
    reasoning: string[];
  };
}

// --- FUNGSI loadModel (TIDAK BERUBAH) ---
// (Fungsi ini sudah benar dari perbaikan kita sebelumnya)
declare global {
  var JurusanAppModel: tf.LayersModel | null;
}
async function loadModel() {
  if (globalThis.JurusanAppModel) {
    console.log("Model ditemukan di global cache. Menggunakan yang sudah ada.");
    return globalThis.JurusanAppModel;
  }
  try {
    const modelJsonPath = path.join(
      process.cwd(),
      "src/model/tfjs_model/model.json"
    );
    const modelWeightsPath = path.join(
      process.cwd(),
      "src/model/tfjs_model/group1-shard1of1.bin"
    );
    const modelJsonContent = await fs.readFile(modelJsonPath, "utf-8");
    const modelWeightsBuffer = await fs.readFile(modelWeightsPath);
    const modelJson = JSON.parse(modelJsonContent);
    const weightData = new Uint8Array(modelWeightsBuffer).buffer;
    const customIOHandler: tf.io.IOHandler = {
      load: async () => ({
        modelTopology: modelJson.modelTopology,
        weightSpecs: modelJson.weightsManifest[0].weights,
        weightData: weightData,
      }),
    };
    console.log("Memuat model TFJS untuk pertama kali ke global cache...");
    globalThis.JurusanAppModel = await tf.loadLayersModel(customIOHandler);
    console.log("Model TFJS berhasil dimuat dan disimpan di global cache.");
    return globalThis.JurusanAppModel;
  } catch (e) {
    console.error("Gagal memuat model TFJS:", e);
    throw new Error("Gagal memuat model machine learning.");
  }
}

// --- TAMBAHKAN DATA DESKRIPSI MBTI DI SINI ---
const mbtiDescriptions: { [key: string]: string } = {
  ESTJ: "The Executive - Pemimpin yang praktis dan tegas. Anda suka mengorganisir orang dan proyek, sangat bertanggung jawab, dan berorientasi pada hasil yang nyata.",
  ESTP: "The Entrepreneur - Spontan dan energik. Anda suka beraksi langsung, fleksibel dalam menghadapi situasi, dan pandai beradaptasi dengan perubahan.",
  ESFJ: "The Consul - Hangat dan peduli terhadap orang lain. Anda sangat memperhatikan kebutuhan orang lain dan suka menciptakan harmoni dalam kelompok.",
  ESFP: "The Entertainer - Antusias dan kreatif. Anda suka bersosialisasi, menginspirasi orang lain, dan menikmati pengalaman baru yang menarik.",
  ENTJ: "The Commander - Pemimpin yang visioner dan tegas. Anda sangat strategis, ambisius, dan mampu mengorganisir orang untuk mencapai tujuan besar.",
  ENTP: "The Debater - Inovator yang penuh ide. Anda suka berdebat, mengeksplorasi kemungkinan baru, dan menemukan solusi kreatif untuk masalah kompleks.",
  ENFJ: "The Protagonist - Inspiratif dan empatis. Anda memiliki kemampuan natural untuk memotivasi dan membantu orang lain mencapai potensi terbaik mereka.",
  ENFP: "The Campaigner - Antusias dan imajinatif. Anda penuh energi, suka mengeksplorasi ide-ide baru, dan memiliki kemampuan memotivasi orang lain.",
  ISTJ: "The Logistician - Praktis dan dapat diandalkan. Anda sangat terorganisir, bertanggung jawab, dan suka bekerja dengan sistem yang jelas dan terstruktur.",
  ISTP: "The Virtuoso - Praktis dan adaptable. Anda suka bekerja dengan tangan, memecahkan masalah secara langsung, dan memiliki kemampuan teknis yang baik.",
  ISFJ: "The Protector - Hangat dan thoughtful. Anda sangat peduli terhadap orang lain, suka membantu, dan selalu siap mendukung orang-orang terdekat.",
  ISFP: "The Adventurer - Artistik dan sensitif. Anda memiliki nilai-nilai yang kuat, suka mengekspresikan kreativitas, dan menghargai kebebasan personal.",
  INTJ: "The Architect - Strategis dan independen. Anda memiliki visi jangka panjang yang kuat, suka merencanakan sistem yang efisien, dan berorientasi pada improvement.",
  INTP: "The Thinker - Analitis dan objektif. Anda suka mengeksplorasi ide-ide teoretis, memecahkan masalah kompleks, dan memahami cara kerja sistem.",
  INFJ: "The Advocate - Idealis dan organized. Anda memiliki visi yang kuat tentang bagaimana membantu orang lain dan membuat dunia menjadi tempat yang lebih baik.",
  INFP: "The Mediator - Idealis dan adaptable. Anda memiliki nilai-nilai yang mendalam, sangat kreatif, dan selalu mencari makna dalam segala yang Anda lakukan.",
};

// --- Handler POST dengan Perubahan pada Respons ---
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const loadedModel = await loadModel();
    if (!loadedModel) throw new Error("Model tidak tersedia.");

    const { answers } = await request.json();

    // Membaca file-file pendukung (tidak berubah)
    const scalerPath = path.join(process.cwd(), "src/model/scaler.json");
    const labelEncoderPath = path.join(
      process.cwd(),
      "src/model/label_encoder.json"
    );
    const majorMappingPath = path.join(
      process.cwd(),
      "src/model/major_mapping.json"
    );

    const scalerData: Scaler = JSON.parse(
      await fs.readFile(scalerPath, "utf-8")
    );
    const labelEncoderData: LabelEncoder = JSON.parse(
      await fs.readFile(labelEncoderPath, "utf-8")
    );
    const majorMappingData: MajorMapping = JSON.parse(
      await fs.readFile(majorMappingPath, "utf-8")
    );

    // Proses jawaban (tidak berubah)
    const allQuestions = await prisma.question.findMany({
      orderBy: { id: "asc" },
    });
    const answerMap: { [key: string]: number } = {
      setuju: 1,
      netral: 0,
      tidak_setuju: -1,
    };
    const orderedNumericAnswers = allQuestions.map((question) =>
      answers[question.id] ? answerMap[answers[question.id]] : 0
    );
    const scaledAnswers = orderedNumericAnswers.map(
      (ans, i) => (ans - scalerData.mean[i]) / scalerData.scale[i]
    );

    // Prediksi (tidak berubah)
    const inputTensor = tf.tensor2d([scaledAnswers]);
    const prediction = loadedModel.predict(inputTensor) as tf.Tensor;
    const predictionData = await prediction.data();
    const predictedIndex = tf.argMax(predictionData).dataSync()[0];
    const mbtiType = labelEncoderData.classes[predictedIndex];

    // --- PERUBAHAN UTAMA PADA DATA YANG DIKEMBALIKAN ---

    // 1. Ambil deskripsi MBTI
    const description =
      mbtiDescriptions[mbtiType] ||
      "Tipe kepribadian yang unik dengan karakteristik menarik.";

    // 2. Siapkan data rekomendasi yang lebih terstruktur
    const recommendationData = majorMappingData[mbtiType];
    const recommendations = recommendationData
      ? recommendationData.majors.map((major, index) => ({
          major: major,
          reasoning:
            recommendationData.reasoning[index] ||
            "Jurusan ini cocok dengan preferensi Anda.",
        }))
      : [];

    // 3. Simpan data yang terstruktur ke database
    await prisma.quizResult.create({
      data: {
        userId: Number((session.user as any).id),
        mbtiType: mbtiType,
        recommendations: JSON.stringify(recommendations), // Simpan array objek
      },
    });

    // 4. Kembalikan data yang lebih kaya ke frontend
    return NextResponse.json({
      mbtiType,
      description,
      recommendations,
    });
  } catch (error) {
    console.error("Error di /api/test/submit:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server saat memproses hasil." },
      { status: 500 }
    );
  }
}
