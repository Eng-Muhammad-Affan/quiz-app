        const test = [
            {
                id: 1,
                question: "Who is the founder of Pakistan?",
                options: ["Quaid-e-Azam", "Allama Iqbal", "Liaquat Ali Khan", "Sir Syed Ahmed Khan"],
                correctOption: 0
            },
            {
                id: 2,
                question: "What is the capital of Pakistan?",
                options: ["Karachi", "Lahore", "Islamabad", "Peshawar"],
                correctOption: 2
            },
            {
                id: 3,
                question: "Which city is known as the 'City of Lights' in Pakistan?",
                options: ["Lahore", "Karachi", "Islamabad", "Rawalpindi"],
                correctOption: 1
            },
            {
                id: 4,
                question: "What is the national language of Pakistan?",
                options: ["Urdu", "English", "Punjabi", "Sindhi"],
                correctOption: 0
            }
        ];

        let currentQuestionIndex = 0;
        let userAnswers = new Array(test.length).fill(null);
        let score = 0;
        let totalQuestions = test.length;
        let isQuizStarted = false;
        let quizCompleted = false;

        const startButton = document.querySelector("#start-quiz-button");
        const questionContainer = document.querySelector("#question-container");
        const resultContainer = document.querySelector("#result-container");
        const questionNumber = document.querySelector("#question-number");
        const questionParagraph = document.querySelector("#question");
        const optionsContainer = document.querySelector("#question-options-container");
        const nextButton = document.querySelector("#next-button");
        const prevButton = document.querySelector("#prev-button");
        const scoreDisplay = document.querySelector("#score-display");
        const finalScore = document.querySelector("#final-score");
        const correctCount = document.querySelector("#correct-count");
        const totalQuestionsSpan = document.querySelector("#total-questions");
        const restartButton = document.querySelector("#restart-button");
        const reviewButton = document.querySelector("#review-button");
        const reviewContainer = document.querySelector("#review-container");
        const reviewQuestionsContainer = document.querySelector("#review-questions-container");

        function updateScoreDisplay() {
            scoreDisplay.textContent = `Score: ${score}`;
        }

        function updateNextButtonState() {
            nextButton.disabled = userAnswers[currentQuestionIndex] === null;
        }

        function updatePrevButtonState() {
            prevButton.disabled = currentQuestionIndex === 0;
        }

        function evaluateResult(optionValue) {
            if (quizCompleted) return;
            
            const currentQuestion = test[currentQuestionIndex];
            const correctAnswer = currentQuestion.options[currentQuestion.correctOption];

            userAnswers[currentQuestionIndex] = optionValue;

            score = 0;
            for (let i = 0; i < test.length; i++) {
                if (userAnswers[i] !== null) {
                    const question = test[i];
                    const correctAns = question.options[question.correctOption];
                    if (userAnswers[i] === correctAns) {
                        score++;
                    }
                }
            }

            const radioButtons = optionsContainer.querySelectorAll('input[type="radio"]');
            radioButtons.forEach(radio => {
                radio.disabled = true;
            });

            const labels = optionsContainer.querySelectorAll('.option-label');
            labels.forEach(label => {
                label.classList.add('opacity-75', 'cursor-default');
            });

            updateScoreDisplay();
            updateNextButtonState();
        }

        function displayQuestion() {
            if (quizCompleted) return;
            
            const currentQuestion = test[currentQuestionIndex];
            const { question, options } = currentQuestion;

            questionNumber.textContent = `Question ${currentQuestionIndex + 1} of ${totalQuestions}`;
            questionParagraph.textContent = question;

            let optionsHTML = "";
            options.forEach((optn, index) => {
                const isChecked = userAnswers[currentQuestionIndex] === optn;
                const isDisabled = userAnswers[currentQuestionIndex] !== null;
                
                optionsHTML += `
                    <label class="option-label bg-gray-50 hover:bg-gray-100 p-3 text-sm flex justify-start items-center gap-3 rounded-lg border-2 border-gray-200 transition duration-200 ${isDisabled ? 'opacity-75 cursor-default' : 'cursor-pointer'}" for="option-${currentQuestionIndex}-${index}">
                        <input type="radio" 
                               id="option-${currentQuestionIndex}-${index}" 
                               name="question-${currentQuestionIndex}" 
                               value="${optn.replace(/"/g, '&quot;')}" 
                               ${isChecked ? 'checked' : ''}
                               ${isDisabled ? 'disabled' : ''}
                               onchange="evaluateResult(this.value)">
                        <span>${optn}</span>
                    </label>
                `;
            });

            optionsContainer.innerHTML = optionsHTML;

            updateNextButtonState();
            updatePrevButtonState();
        }

        function showResult() {
            quizCompleted = true;
            questionContainer.style.display = 'none';
            resultContainer.style.display = 'block';
            finalScore.textContent = `${score} / ${totalQuestions}`;
            correctCount.textContent = score;
            totalQuestionsSpan.textContent = totalQuestions;
            reviewContainer.style.display = 'none';
        }

        function generateReview() {
            reviewQuestionsContainer.innerHTML = '';
            
            test.forEach((question, index) => {
                const userAnswer = userAnswers[index];
                const correctAnswer = question.options[question.correctOption];
                const isCorrect = userAnswer === correctAnswer;
                const answered = userAnswer !== null;
                
                const questionDiv = document.createElement('div');
                questionDiv.className = 'border-2 border-gray-200 rounded-lg p-4';
                
                let optionsHTML = '';
                question.options.forEach((optn) => {
                    let labelClasses = 'p-2 rounded flex items-center justify-between gap-2';
                    
                    if (optn === correctAnswer) {
                        labelClasses += ' bg-green-100 border-2 border-green-500';
                    }
                    
                    if (answered && optn === userAnswer && optn !== correctAnswer) {
                        labelClasses += ' bg-red-100 border-2 border-red-500';
                    } else if (answered && optn === userAnswer && optn === correctAnswer) {
                        labelClasses += ' bg-green-200 border-2 border-green-600';
                    }
                    
                    let statusHTML = '';
                    if (optn === correctAnswer) {
                        statusHTML = `<span class="text-sm font-semibold text-green-700">✓ Correct Answer</span>`;
                    }
                    
                    if (answered && optn === userAnswer && optn !== correctAnswer) {
                        statusHTML = `<span class="text-sm font-semibold text-red-700">✗ Your Answer</span>`;
                    } else if (answered && optn === userAnswer && optn === correctAnswer) {
                        statusHTML = `<span class="text-sm font-semibold text-green-700">✓ Your Answer</span>`;
                    }
                    
                    optionsHTML += `
                        <div class="${labelClasses}">
                            <span>${optn}</span>
                            ${statusHTML}
                        </div>
                    `;
                });
                
                const statusIcon = answered ? (isCorrect ? '✅' : '❌') : '❓';
                const statusText = answered ? (isCorrect ? 'Correct' : 'Wrong') : 'Not Answered';
                const statusColor = answered ? (isCorrect ? 'text-green-600' : 'text-red-600') : 'text-gray-500';
                
                questionDiv.innerHTML = `
                    <div class="flex justify-between items-start mb-3">
                        <h4 class="font-semibold text-gray-800">${index + 1}. ${question.question}</h4>
                        <span class="${statusColor} font-semibold">${statusIcon} ${statusText}</span>
                    </div>
                    <div class="space-y-2">
                        ${optionsHTML}
                    </div>
                `;
                
                reviewQuestionsContainer.appendChild(questionDiv);
            });
            
            reviewContainer.style.display = 'block';
            reviewButton.textContent = 'Hide Review';
        }

        function resetQuiz() {
            currentQuestionIndex = 0;
            score = 0;
            userAnswers = new Array(test.length).fill(null);
            quizCompleted = false;

            resultContainer.style.display = 'none';
            questionContainer.style.display = 'block';

            updateScoreDisplay();
            displayQuestion();
        }

        // Event Listeners
        startButton.addEventListener("click", () => {
            isQuizStarted = !isQuizStarted;
            
            if (isQuizStarted) {
                startButton.textContent = "Stop Quiz";
                startButton.classList.remove('bg-blue-500', 'hover:bg-blue-700');
                startButton.classList.add('bg-red-500', 'hover:bg-red-700');
                questionContainer.style.display = "block";
                resultContainer.style.display = "none";
                resetQuiz();
            } else {
                startButton.textContent = "Start Quiz";
                startButton.classList.remove('bg-red-500', 'hover:bg-red-700');
                startButton.classList.add('bg-blue-500', 'hover:bg-blue-700');
                questionContainer.style.display = "none";
                resultContainer.style.display = "none";
            }
        });

        nextButton.addEventListener("click", () => {
            if (currentQuestionIndex < totalQuestions - 1) {
                currentQuestionIndex += 1;
                displayQuestion();
            } else {
                showResult();
            }
        });

        prevButton.addEventListener("click", () => {
            if (currentQuestionIndex > 0) {
                currentQuestionIndex -= 1;
                displayQuestion();
            }
        });

        restartButton.addEventListener("click", () => {
            resetQuiz();
            isQuizStarted = true;
            startButton.textContent = "Stop Quiz";
            startButton.classList.remove('bg-blue-500', 'hover:bg-blue-700');
            startButton.classList.add('bg-red-500', 'hover:bg-red-700');
            reviewButton.textContent = 'Review Answers';
        });

        reviewButton.addEventListener("click", () => {
            if (reviewContainer.style.display === 'none' || reviewContainer.style.display === '') {
                generateReview();
            } else {
                reviewContainer.style.display = 'none';
                reviewButton.textContent = 'Review Answers';
            }
        });

        totalQuestionsSpan.textContent = totalQuestions;
        updateScoreDisplay();
        updateNextButtonState();
        updatePrevButtonState();
