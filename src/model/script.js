// Full script MBTI Test (versi dengan skala -1, 0, 1)
let questions = [];
let mbtiMajors = {};
let currentQuestion = 0;
let answers = [];
let model = null;
let scalerMean = [];
let scalerScale = [];
let labelClasses = [];

// MBTI Type Descriptions
const mbtiDescriptions = {
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

// Load all assets
async function startTest() {
  document.getElementById("welcome-screen").classList.add("hidden");
  document.getElementById("test-screen").classList.remove("hidden");

  questions = await loadQuestions();
  await loadMajors();
  await loadModel();
  await loadScaler();
  await loadLabelEncoder();

  showQuestion();
}

async function loadQuestions() {
  const response = await fetch("./questions.json");
  const data = await response.json();
  return [...data.E_I, ...data.S_N, ...data.T_F, ...data.J_P];
}

async function loadMajors() {
  const response = await fetch("./major_mapping.json");
  mbtiMajors = await response.json();

  // Replace reasoning with explanations
  for (const type in mbtiMajors) {
    const majors = mbtiMajors[type].majors;
    mbtiMajors[type].reasoning = majors.map((major) => {
      switch (major) {
        case "Teknik Informatika":
          return "Jurusan Teknik Informatika cocok untuk Anda yang suka problem solving dan tertarik dengan teknologi masa depan.";
        case "Matematika":
          return "Jurusan Matematika ideal bagi Anda yang memiliki kemampuan analitis tinggi dan gemar dengan tantangan logika.";
        case "Arsitektur":
          return "Jurusan Arsitektur sempurna untuk Anda yang kreatif dan ingin menciptakan ruang yang bermakna bagi masyarakat.";
        case "Fisika":
          return "Jurusan Fisika cocok untuk Anda yang penasaran dengan cara kerja alam semesta dan suka eksperimen.";
        case "Teknik Sipil":
          return "Jurusan Teknik Sipil tepat bagi Anda yang ingin berkontribusi membangun infrastruktur negara.";
        case "Ilmu Komputer":
          return "Jurusan Ilmu Komputer ideal untuk Anda yang passionate dengan AI dan ingin menjadi bagian revolusi digital.";
        case "Hukum":
          return "Jurusan Hukum cocok bagi Anda yang memiliki jiwa keadilan dan kemampuan berargumentasi yang kuat.";
        case "Manajemen":
          return "Jurusan Manajemen sempurna untuk Anda yang memiliki jiwa leadership dan ingin memimpin organisasi.";
        case "Akuntansi":
          return "Jurusan Akuntansi tepat bagi Anda yang teliti, terorganisir, dan tertarik dengan dunia keuangan.";
        case "Teknik Industri":
          return "Jurusan Teknik Industri cocok untuk Anda yang suka mengoptimalkan sistem dan meningkatkan efisiensi kerja.";
        case "Marketing":
          return "Jurusan Marketing ideal bagi Anda yang kreatif, komunikatif, dan memahami psikologi konsumen.";
        case "Psikologi":
          return "Jurusan Psikologi sempurna untuk Anda yang empatis dan ingin membantu orang mengatasi masalah mental.";
        case "Filsafat":
          return "Jurusan Filsafat cocok bagi Anda yang suka berpikir mendalam dan mempertanyakan esensi kehidupan.";
        case "Penelitian":
          return "Jurusan Penelitian tepat untuk Anda yang ingin berkontribusi menciptakan pengetahuan baru bagi dunia.";
        case "Konseling":
          return "Jurusan Konseling ideal bagi Anda yang memiliki kemampuan mendengarkan dan ingin membantu sesama.";
        case "Pendidikan":
          return "Jurusan Pendidikan cocok untuk Anda yang sabar, inspiratif, dan ingin mencerdaskan generasi masa depan.";
        case "Komunikasi":
          return "Jurusan Komunikasi sempurna bagi Anda yang pandai berbicara dan ingin berkarir di media atau PR.";
        case "Administrasi":
          return "Jurusan Administrasi tepat untuk Anda yang detail-oriented dan suka mengatur sistem kerja yang efisien.";
        case "Keperawatan":
          return "Jurusan Keperawatan ideal bagi Anda yang caring, tahan stress, dan ingin langsung membantu kesembuhan pasien.";
        case "Sastra":
          return "Jurusan Sastra cocok untuk Anda yang memiliki jiwa artistik dan passion terhadap keindahan bahasa.";
        case "Seni Rupa":
          return "Jurusan Seni Rupa sempurna bagi Anda yang kreatif dan ingin mengekspresikan ide melalui karya visual.";
        case "Desain Interior":
          return "Jurusan Desain Interior tepat untuk Anda yang estetis dan ingin menciptakan ruang yang nyaman dan indah.";
        case "Musik":
          return "Jurusan Musik ideal bagi Anda yang berbakat musik dan ingin mengembangkan kemampuan bermusik.";
        case "Olahraga":
          return "Jurusan Olahraga cocok untuk Anda yang aktif, disiplin, dan ingin menjaga kesehatan tubuh optimal.";
        case "Bisnis":
          return "Jurusan Bisnis sempurna bagi Anda yang memiliki jiwa entrepreneur dan ingin membangun usaha sendiri.";
        default:
          return "Jurusan ini bisa menjadi pilihan tepat sesuai dengan minat dan bakat unik Anda.";
      }
    });
  }
}

async function loadModel() {
  try {
    model = await tf.loadLayersModel("./tfjs_model/model.json");
    console.log("Model loaded successfully");
  } catch (error) {
    console.error("Error loading model:", error);
  }
}

async function loadScaler() {
  const response = await fetch("./scaler.json");
  const data = await response.json();
  scalerMean = data.mean;
  scalerScale = data.scale;
}

async function loadLabelEncoder() {
  const response = await fetch("./label_encoder.json");
  const data = await response.json();
  labelClasses = data.classes;
}

function showQuestion() {
  const questionElement = document.getElementById("question-text");
  const questionNumberElement = document.getElementById("question-number");
  const optionsContainer = document.getElementById("options-container");
  const progressFill = document.getElementById("progress-fill");

  questionNumberElement.textContent = `Pertanyaan ${currentQuestion + 1} dari ${
    questions.length
  }`;
  questionElement.textContent = questions[currentQuestion];

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  progressFill.style.width = progress + "%";

  optionsContainer.innerHTML = "";
  const options = [
    { text: "Tidak Setuju", value: -1 },
    { text: "Netral", value: 0 },
    { text: "Setuju", value: 1 },
  ];

  options.forEach((option) => {
    const optionElement = document.createElement("div");
    optionElement.className = "option";
    optionElement.textContent = option.text;
    optionElement.onclick = () => selectOption(optionElement, option.value);
    optionsContainer.appendChild(optionElement);
  });

  document.getElementById("prev-btn").disabled = currentQuestion === 0;
  document.getElementById("next-btn").disabled = true;
  document.getElementById("next-btn").textContent =
    currentQuestion === questions.length - 1 ? "Selesai" : "Selanjutnya";
}

function selectOption(element, value) {
  document
    .querySelectorAll(".option")
    .forEach((opt) => opt.classList.remove("selected"));
  element.classList.add("selected");
  answers[currentQuestion] = value;
  document.getElementById("next-btn").disabled = false;
}

function previousQuestion() {
  if (currentQuestion > 0) {
    currentQuestion--;
    showQuestion();
    if (answers[currentQuestion] !== undefined) {
      const options = document.querySelectorAll(".option");
      const selectedIndex = answers[currentQuestion] + 1;
      if (options[selectedIndex]) {
        options[selectedIndex].classList.add("selected");
        document.getElementById("next-btn").disabled = false;
      }
    }
  }
}

function nextQuestion() {
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    showQuestion();
    if (answers[currentQuestion] !== undefined) {
      const options = document.querySelectorAll(".option");
      const selectedIndex = answers[currentQuestion] + 1;
      if (options[selectedIndex]) {
        options[selectedIndex].classList.add("selected");
        document.getElementById("next-btn").disabled = false;
      }
    }
  } else {
    finishTest();
  }
}

function finishTest() {
  document.getElementById("test-screen").classList.add("hidden");
  document.getElementById("loading-screen").classList.remove("hidden");
  setTimeout(() => processResults(), 2000);
}

function processResults() {
  let mbtiType = model ? predictWithModel() : calculateMBTIRuleBased();
  displayResults(mbtiType);
}

function predictWithModel() {
  try {
    const input = answers.map(
      (ans, i) => (ans - scalerMean[i]) / scalerScale[i]
    );
    const inputTensor = tf.tensor2d([input]);
    const prediction = model.predict(inputTensor);
    const predictionData = prediction.dataSync();
    const predictedIndex = predictionData.indexOf(Math.max(...predictionData));
    return labelClasses[predictedIndex] || calculateMBTIRuleBased();
  } catch (error) {
    console.error("Prediction error:", error);
    return calculateMBTIRuleBased();
  }
}

function calculateMBTIRuleBased() {
  const eScore = calcAvg(0, 15);
  const sScore = calcAvg(15, 30);
  const tScore = calcAvg(30, 45);
  const jScore = calcAvg(45, 60);
  return (
    (eScore > 0 ? "E" : "I") +
    (sScore > 0 ? "S" : "N") +
    (tScore > 0 ? "T" : "F") +
    (jScore > 0 ? "J" : "P")
  );
}

function calcAvg(start, end) {
  let total = 0,
    count = 0;
  for (let i = start; i < end && i < answers.length; i++) {
    if (answers[i] !== undefined) {
      total += answers[i];
      count++;
    }
  }
  return count > 0 ? total / count : 0;
}

function displayResults(mbtiType) {
  document.getElementById("loading-screen").classList.add("hidden");
  document.getElementById("result-screen").classList.remove("hidden");

  const resultMBTI = document.getElementById("result-mbti");
  const resultDescription = document.getElementById("result-description");
  const mbtiExplanation = document.getElementById("mbti-explanation");
  const majorList = document.getElementById("major-list");

  resultMBTI.textContent = mbtiType;

  // Add MBTI type explanation
  const mbtiDesc =
    mbtiDescriptions[mbtiType] ||
    "Tipe kepribadian yang unik dengan karakteristik yang menarik.";
  if (mbtiExplanation) {
    mbtiExplanation.textContent = mbtiDesc;
  }

  const mbtiData = mbtiMajors[mbtiType] || {
    majors: ["Psikologi", "Manajemen", "Komunikasi"],
    confidences: [],
    reasoning: [],
  };
  resultDescription.textContent =
    "Ini dia rekomendasi jurusan yang cocok buat anda! Disusun berdasarkan karakter dan preferensi anda, semoga bisa jadi referensi yang pas dan membantu anda menentukan arah ke depan.";
  majorList.innerHTML = "";

  mbtiData.majors.forEach((major, i) => {
    const majorElement = document.createElement("div");
    majorElement.className = "major-item";
    majorElement.innerHTML = `<strong>${major}</strong><br><small>${
      mbtiData.reasoning?.[i] || ""
    }</small>`;
    majorList.appendChild(majorElement);
  });
}

function restartTest() {
  currentQuestion = 0;
  answers = [];
  document.getElementById("result-screen").classList.add("hidden");
  document.getElementById("welcome-screen").classList.remove("hidden");
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("MBTI Test initialized");
});
