        // Data pertanyaan MBTI
        let questions = [];
        let mbtiMajors = {};
        let currentQuestion = 0;
        let answers = [];
        let model = null;
        let scalerMean = [];
        let scalerScale = [];
        let labelClasses = [];

        // Load TensorFlow.js model
        async function startTest() {
            document.getElementById('welcome-screen').classList.add('hidden');
            document.getElementById('test-screen').classList.remove('hidden');

            questions = await loadQuestions();
            await loadMajors();
            await loadModel();
            await loadScaler();
            await loadLabelEncoder();

            showQuestion();
        }

        async function loadQuestions() {
            const response = await fetch('./questions.json');
            const data = await response.json();
            return [...data.E_I, ...data.S_N, ...data.T_F, ...data.J_P];
        }

        async function loadMajors() {
            const response = await fetch('./major_mapping.json');
            mbtiMajors = await response.json();
        }

        async function loadModel() {
            try {
                model = await tf.loadLayersModel('./tfjs_model/model.json');
                console.log('Model loaded successfully');
            } catch (error) {
                console.error('Error loading model:', error);
            }
        }

        async function loadScaler() {
            const response = await fetch('./scaler.json');
            const data = await response.json();
            scalerMean = data.mean;
            scalerScale = data.scale;
        }

        async function loadLabelEncoder() {
            const response = await fetch('./label_encoder.json');
            const data = await response.json();
            labelClasses = data.classes;
        }

        function showQuestion() {
            const questionElement = document.getElementById('question-text');
            const questionNumberElement = document.getElementById('question-number');
            const optionsContainer = document.getElementById('options-container');
            const progressFill = document.getElementById('progress-fill');

            questionNumberElement.textContent = `Pertanyaan ${currentQuestion + 1} dari ${questions.length}`;
            questionElement.textContent = questions[currentQuestion];

            const progress = ((currentQuestion + 1) / questions.length) * 100;
            progressFill.style.width = progress + '%';

            optionsContainer.innerHTML = '';
            const options = [
                { text: "Tidak Setuju", value: -1 },
                { text: "Netral", value: 0 },
                { text: "Setuju", value: 1 }
            ];

            options.forEach(option => {
                const optionElement = document.createElement('div');
                optionElement.className = 'option';
                optionElement.textContent = option.text;
                optionElement.onclick = () => selectOption(optionElement, option.value);
                optionsContainer.appendChild(optionElement);
            });

            document.getElementById('prev-btn').disabled = currentQuestion === 0;
            document.getElementById('next-btn').disabled = true;
            document.getElementById('next-btn').textContent = currentQuestion === questions.length - 1 ? 'Selesai' : 'Selanjutnya';
        }

        function selectOption(element, value) {
            document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
            element.classList.add('selected');
            answers[currentQuestion] = value;
            document.getElementById('next-btn').disabled = false;
        }

        function previousQuestion() {
            if (currentQuestion > 0) {
                currentQuestion--;
                showQuestion();
                if (answers[currentQuestion] !== undefined) {
                    const options = document.querySelectorAll('.option');
                    const selectedIndex = answers[currentQuestion] + 1;
                    if (options[selectedIndex]) {
                        options[selectedIndex].classList.add('selected');
                        document.getElementById('next-btn').disabled = false;
                    }
                }
            }
        }

        function nextQuestion() {
            if (currentQuestion < questions.length - 1) {
                currentQuestion++;
                showQuestion();
                if (answers[currentQuestion] !== undefined) {
                    const options = document.querySelectorAll('.option');
                    const selectedIndex = answers[currentQuestion] + 1;
                    if (options[selectedIndex]) {
                        options[selectedIndex].classList.add('selected');
                        document.getElementById('next-btn').disabled = false;
                    }
                }
            } else {
                finishTest();
            }
        }

        function finishTest() {
            document.getElementById('test-screen').classList.add('hidden');
            document.getElementById('loading-screen').classList.remove('hidden');
            setTimeout(() => processResults(), 2000);
        }

        function processResults() {
            let mbtiType = model ? predictWithModel() : calculateMBTIRuleBased();
            displayResults(mbtiType);
        }

        function predictWithModel() {
            try {
                const input = answers.map((ans, i) => ((ans) - scalerMean[i]) / scalerScale[i]);
                const inputTensor = tf.tensor2d([input]);
                const prediction = model.predict(inputTensor);
                const predictionData = prediction.dataSync();
                const predictedIndex = predictionData.indexOf(Math.max(...predictionData));
                return labelClasses[predictedIndex] || calculateMBTIRuleBased();
            } catch (error) {
                console.error('Prediction error:', error);
                return calculateMBTIRuleBased();
            }
        }

        function calculateMBTIRuleBased() {
            const eScore = calcAvg(0, 15);
            const sScore = calcAvg(15, 30);
            const tScore = calcAvg(30, 45);
            const jScore = calcAvg(45, 60);
            return (eScore > 0 ? 'E' : 'I') + (sScore > 0 ? 'S' : 'N') + (tScore > 0 ? 'T' : 'F') + (jScore > 0 ? 'J' : 'P');
        }

        function calcAvg(start, end) {
            let total = 0, count = 0;
            for (let i = start; i < end && i < answers.length; i++) {
                if (answers[i] !== undefined) {
                    total += answers[i];
                    count++;
                }
            }
            return count > 0 ? total / count : 0;
        }

        function displayResults(mbtiType) {
            document.getElementById('loading-screen').classList.add('hidden');
            document.getElementById('result-screen').classList.remove('hidden');

            const resultMBTI = document.getElementById('result-mbti');
            const resultDescription = document.getElementById('result-description');
            const majorList = document.getElementById('major-list');

            resultMBTI.textContent = mbtiType;

            const mbtiData = mbtiMajors[mbtiType] || { majors: ["Psikologi", "Manajemen", "Komunikasi"], confidences: [], reasoning: [] };
            resultDescription.textContent = `Direkomendasikan berdasarkan data ${mbtiType}`;
            majorList.innerHTML = '';

            mbtiData.majors.forEach((major, i) => {
                const majorElement = document.createElement('div');
                majorElement.className = 'major-item';
                majorElement.innerHTML = `<strong>${major}</strong><br><small>${mbtiData.reasoning?.[i] || ''}</small>`;
                majorList.appendChild(majorElement);
            });
        }

        function restartTest() {
            currentQuestion = 0;
            answers = [];
            document.getElementById('result-screen').classList.add('hidden');
            document.getElementById('welcome-screen').classList.remove('hidden');
        }

        document.addEventListener('DOMContentLoaded', () => {
            console.log('MBTI Test initialized');
        });