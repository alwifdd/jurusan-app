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
interface MajorMapping {
  [key: string]: {
    majors: string[];
  };
}

// --- PERUBAHAN UTAMA: MENGGUNAKAN globalThis UNTUK CACHE MODEL ---

// Mendefinisikan tipe untuk variabel global agar TypeScript tidak error
declare global {
  var JurusanAppModel: tf.LayersModel | null;
}

async function loadModel() {
  // Cek cache dari objek global, bukan dari variabel biasa
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
    // Simpan model yang dimuat ke variabel global
    globalThis.JurusanAppModel = await tf.loadLayersModel(customIOHandler);
    console.log("Model TFJS berhasil dimuat dan disimpan di global cache.");
    return globalThis.JurusanAppModel;
  } catch (e) {
    console.error("Gagal memuat model TFJS:", e);
    throw new Error("Gagal memuat model machine learning.");
  }
}

// --- Handler POST (TIDAK ADA PERUBAHAN LOGIKA) ---
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const loadedModel = await loadModel();
    if (!loadedModel) {
      throw new Error("Model tidak tersedia.");
    }

    const { answers } = await request.json();

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

    const allQuestions = await prisma.question.findMany({
      orderBy: { id: "asc" },
    });

    const answerMap: { [key: string]: number } = {
      setuju: 1,
      netral: 0,
      tidak_setuju: -1,
    };

    const orderedNumericAnswers = allQuestions.map((question) => {
      const answerString = answers[question.id];
      return answerMap[answerString] ?? 0;
    });

    const scaledAnswers = orderedNumericAnswers.map(
      (ans, i) => (ans - scalerData.mean[i]) / scalerData.scale[i]
    );

    const inputTensor = tf.tensor2d([scaledAnswers]);
    const prediction = loadedModel.predict(inputTensor) as tf.Tensor;
    const predictionData = await prediction.data();
    const predictedIndex = tf.argMax(predictionData).dataSync()[0];
    const mbtiType = labelEncoderData.classes[predictedIndex];

    const recommendations =
      majorMappingData[mbtiType]?.majors.join(", ") ||
      "Rekomendasi tidak ditemukan";

    await prisma.quizResult.create({
      data: {
        userId: Number((session.user as any).id),
        mbtiType: mbtiType,
        recommendations: JSON.stringify(majorMappingData[mbtiType]),
      },
    });

    return NextResponse.json({
      mbtiType,
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
