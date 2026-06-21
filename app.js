// app.js - Massive Testing & Smart Shuffle

class AppState {
    constructor() {
        this.categories = {
            G1: "Auto Maintenance and Light Repair", A1: "Engine Repair", A2: "Automatic Transmission/Transaxle",
            A3: "Manual Drive Train & Axles", A4: "Suspension & Steering", A5: "Brakes",
            A6: "Electrical/Electronic Systems", A7: "Heating & Air Conditioning", A8: "Engine Performance",
            A9: "Light Vehicle Diesel Engines", F1: "Alternate Fuels"
        };
        this.allQuestions = [];
        this.currentTest = {
            questions: [],
            index: 0,
            score: 0,
            mode: 'quiz', // 'quiz' | 'exam' | 'baseline' | 'qotd'
            category: null,
            userAnswers: [] // To track what they picked for review
        };
        this.loadHistory();
    }

    loadHistory() {
        this.seenQuestions = JSON.parse(localStorage.getItem('seenQuestions') || '[]');
        this.probabilities = JSON.parse(localStorage.getItem('probabilities') || '{}');
        this.scoreStats = JSON.parse(localStorage.getItem('scoreStats') || '{}');
        this.streak = parseInt(localStorage.getItem('qotdStreak') || '0');
        this.lastQotdDate = localStorage.getItem('lastQotdDate') || null;
    }

    saveHistory() {
        localStorage.setItem('seenQuestions', JSON.stringify(this.seenQuestions));
        localStorage.setItem('probabilities', JSON.stringify(this.probabilities));
        localStorage.setItem('scoreStats', JSON.stringify(this.scoreStats));
        localStorage.setItem('qotdStreak', this.streak.toString());
        localStorage.setItem('lastQotdDate', this.lastQotdDate || '');
    }

    markSeen(qId) {
        if (!this.seenQuestions.includes(qId)) {
            this.seenQuestions.push(qId);
            this.saveHistory();
        }
    }

    updateProbability(category, isCorrect) {
        if (!category) return;
        
        // Track absolute score
        if (!this.scoreStats[category]) {
            this.scoreStats[category] = { correct: 0, wrong: 0 };
        }
        if (isCorrect) {
            this.scoreStats[category].correct++;
        } else {
            this.scoreStats[category].wrong++;
        }

        let currentProb = this.probabilities[category] || 30; // Base start if no baseline taken
        if (isCorrect) {
            currentProb += 1; // Increase by 1%
        } else {
            currentProb -= 1.5; // Decrease slightly more to penalize
        }
        currentProb = Math.max(10, Math.min(99, currentProb)); // Clamp between 10% and 99%
        this.probabilities[category] = parseFloat(currentProb.toFixed(1));
        this.saveHistory();
    }

    // Smart Shuffle: Prioritize unseen questions, scramble options
    smartShuffle(questions, count) {
        // Separate into unseen and seen
        let unseen = questions.filter(q => !this.seenQuestions.includes(q.id));
        let seen = questions.filter(q => this.seenQuestions.includes(q.id));

        // Shuffle both
        unseen.sort(() => Math.random() - 0.5);
        seen.sort(() => Math.random() - 0.5);

        // Combine, taking unseen first
        let selected = [...unseen, ...seen].slice(0, count);

        // Scramble options for selected questions to prevent visual memorization
        return selected.map(q => {
            const scrambledOptions = q.options.map((opt, index) => ({ text: opt, isCorrect: index === q.correct }))
                                             .sort(() => Math.random() - 0.5);
            
            const newCorrectIndex = scrambledOptions.findIndex(o => o.isCorrect);
            return {
                ...q,
                options: scrambledOptions.map(o => o.text),
                correct: newCorrectIndex
            };
        });
    }

    buildTest(categoryId, mode) {
        let pool = this.allQuestions;
        let count = 20;

        if (categoryId) {
            pool = this.allQuestions.filter(q => q.category_id === categoryId);
            if (mode === 'exam') {
                // Official lengths
                const lengths = { A3: 40, A4: 40, G1: 55 };
                count = lengths[categoryId] || 50; 
            } else {
                count = 20; // Short quiz
            }
        }

        this.currentTest.category = categoryId;
        this.currentTest.mode = mode;
        this.currentTest.questions = this.smartShuffle(pool, count);
        this.currentTest.index = 0;
        this.currentTest.score = 0;
        this.currentTest.userAnswers = [];
    }

    buildBaseline() {
        this.currentTest.mode = 'baseline';
        this.currentTest.category = null;
        let selected = [];
        
        Object.keys(this.categories).forEach(cat => {
            let pool = this.allQuestions.filter(q => q.category_id === cat);
            selected = selected.concat(this.smartShuffle(pool, 5)); // 5 per category
        });

        this.currentTest.questions = selected.sort(() => Math.random() - 0.5); // Final shuffle
        this.currentTest.index = 0;
        this.currentTest.score = 0;
        this.currentTest.userAnswers = [];
    }

    buildQOTD() {
        this.currentTest.mode = 'qotd';
        this.currentTest.category = null;
        
        // Seed based on date so it's the same all day
        const todayStr = new Date().toISOString().split('T')[0];
        
        // Pick a random question that isn't seen if possible
        let pool = this.allQuestions;
        let q = this.smartShuffle(pool, 1)[0];
        
        this.currentTest.questions = [q];
        this.currentTest.index = 0;
        this.currentTest.score = 0;
        this.currentTest.userAnswers = [];
    }
}

class UIController {
    constructor(state) {
        this.state = state;
        this.cacheDOM();
        this.bindEvents();
    }

    cacheDOM() {
        this.views = {
            dashboard: document.getElementById('dashboard-view'),
            config: document.getElementById('config-view'),
            quiz: document.getElementById('quiz-view'),
            score: document.getElementById('score-view')
        };
        this.els = {
            homeBtn: document.getElementById('home-btn'),
            catGrid: document.getElementById('category-grid'),
            btnBaseline: document.getElementById('btn-baseline'),
            btnQotd: document.getElementById('btn-qotd'),
            qotdStreak: document.getElementById('qotd-streak'),
            backToDash: document.getElementById('back-to-dash-btn'),
            configTitle: document.getElementById('config-title'),
            btnShortQuiz: document.getElementById('btn-short-quiz'),
            btnFullExam: document.getElementById('btn-full-exam'),
            resetBtn: document.getElementById('reset-btn'),
            
            quizModeBadge: document.getElementById('quiz-mode-badge'),
            questionCounter: document.getElementById('question-counter'),
            progressBar: document.getElementById('progress-bar'),
            questionText: document.getElementById('question-text'),
            optionsContainer: document.getElementById('options-container'),
            expDrawer: document.getElementById('explanation-drawer'),
            resTitle: document.getElementById('result-title'),
            expText: document.getElementById('explanation-text'),
            nextBtn: document.getElementById('next-btn'),

            scoreText: document.getElementById('score-text'),
            scoreDetails: document.getElementById('score-details'),
            probUpdateMsg: document.getElementById('probability-update-msg'),
            reviewContainer: document.getElementById('review-container'),
            reviewList: document.getElementById('review-list'),
            finishBtn: document.getElementById('finish-btn')
        };
    }

    bindEvents() {
        this.els.homeBtn.addEventListener('click', () => this.showDashboard());
        this.els.backToDash.addEventListener('click', () => this.showDashboard());
        this.els.finishBtn.addEventListener('click', () => this.showDashboard());
        this.els.btnBaseline.addEventListener('click', () => this.startBaseline());
        this.els.btnQotd.addEventListener('click', () => this.startQOTD());
        
        this.els.btnShortQuiz.addEventListener('click', () => this.startTest('quiz'));
        this.els.btnFullExam.addEventListener('click', () => this.startTest('exam'));
        
        this.els.nextBtn.addEventListener('click', () => this.handleNext());

        if (this.els.resetBtn) {
            this.els.resetBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to completely erase all your passing probabilities, score tracking, streaks, and seen questions?')) {
                    localStorage.clear();
                    location.reload();
                }
            });
        }
    }

    showView(viewName) {
        Object.values(this.views).forEach(v => v.classList.add('hidden'));
        this.views[viewName].classList.remove('hidden');
        this.els.homeBtn.classList.toggle('hidden', viewName === 'dashboard');
    }

    showDashboard() {
        this.renderDashboard();
        this.showView('dashboard');
    }

    renderDashboard() {
        this.els.qotdStreak.textContent = `🔥 Streak: ${this.state.streak}`;
        const todayStr = new Date().toISOString().split('T')[0];
        
        if (this.state.lastQotdDate === todayStr) {
            this.els.btnQotd.textContent = "Done for Today! Come back tomorrow.";
            this.els.btnQotd.disabled = true;
        } else {
            this.els.btnQotd.textContent = "Take Daily Challenge";
            this.els.btnQotd.disabled = false;
        }

        this.els.catGrid.innerHTML = '';
        Object.entries(this.state.categories).forEach(([id, name]) => {
            const prob = this.state.probabilities[id] || '--';
            const stats = this.state.scoreStats[id] || { correct: 0, wrong: 0 };
            const card = document.createElement('div');
            card.className = 'category-card';
            card.innerHTML = `
                <h3>${id}</h3>
                <p>${name}</p>
                <div class="stats-row">
                    <span class="stat-correct">✓ ${stats.correct}</span>
                    <span class="stat-wrong">✗ ${stats.wrong}</span>
                </div>
                <div class="prob-badge">Chance to Pass: <strong>${prob}%</strong></div>
            `;
            card.addEventListener('click', () => this.showConfig(id));
            this.els.catGrid.appendChild(card);
        });
    }

    showConfig(categoryId) {
        this.state.currentTest.category = categoryId;
        this.els.configTitle.textContent = `${categoryId} - ${this.state.categories[categoryId]}`;
        this.showView('config');
    }

    startBaseline() {
        this.state.buildBaseline();
        this.beginTestingUI();
    }

    startQOTD() {
        this.state.buildQOTD();
        this.beginTestingUI();
    }

    startTest(mode) {
        this.state.buildTest(this.state.currentTest.category, mode);
        this.beginTestingUI();
    }

    beginTestingUI() {
        this.showView('quiz');
        this.els.quizModeBadge.textContent = this.state.currentTest.mode.toUpperCase();
        this.loadQuestion();
    }

    loadQuestion() {
        const q = this.state.currentTest.questions[this.state.currentTest.index];
        const total = this.state.currentTest.questions.length;
        const current = this.state.currentTest.index;

        this.els.questionCounter.textContent = `${current + 1} / ${total}`;
        this.els.progressBar.style.width = `${(current / total) * 100}%`;
        
        this.els.questionText.textContent = q.question;
        this.els.optionsContainer.innerHTML = '';
        this.els.expDrawer.classList.add('hidden');
        
        q.options.forEach((opt, index) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = opt;
            btn.addEventListener('click', () => this.handleAnswer(index, btn));
            this.els.optionsContainer.appendChild(btn);
        });
    }

    handleAnswer(selectedIndex, selectedBtn) {
        const q = this.state.currentTest.questions[this.state.currentTest.index];
        const isCorrect = selectedIndex === q.correct;
        
        this.state.markSeen(q.id);
        
        // Record answer for review
        this.state.currentTest.userAnswers.push({
            question: q,
            selected: selectedIndex,
            isCorrect: isCorrect
        });

        if (isCorrect) this.state.currentTest.score++;

        // Update probability in background
        this.state.updateProbability(q.category_id, isCorrect);

        const btns = this.els.optionsContainer.querySelectorAll('.option-btn');
        btns.forEach((btn, i) => {
            btn.disabled = true;
            if (i === q.correct) btn.classList.add('correct');
        });

        if (!isCorrect) {
            selectedBtn.classList.add('wrong');
        }

        // Exam Mode vs Practice Mode
        if (this.state.currentTest.mode === 'exam' || this.state.currentTest.mode === 'baseline') {
            // Exam Simulator: No instant explanation, jump immediately or show a silent next button
            // To simulate exactly, let's just show a "Next" button without revealing right/wrong.
            // Wait, we already added .correct and .wrong classes above. 
            // In true exam mode, we shouldn't even show what was right or wrong!
            btns.forEach(btn => btn.classList.remove('correct', 'wrong'));
            selectedBtn.classList.add('selected-neutral');
            
            this.els.expDrawer.classList.remove('hidden');
            this.els.resTitle.textContent = "Answer Recorded";
            this.els.resTitle.className = "";
            this.els.expText.textContent = "Explanations are withheld in Exam Simulator mode until final submission.";
        } else {
            // Practice/Quiz/QOTD: Instant feedback
            this.els.expDrawer.classList.remove('hidden');
            if (isCorrect) {
                this.els.resTitle.textContent = "Correct!";
                this.els.resTitle.className = "correct-text";
            } else {
                this.els.resTitle.textContent = "Incorrect";
                this.els.resTitle.className = "wrong-text";
            }
            this.els.expText.textContent = q.explanation;
        }
    }

    handleNext() {
        this.state.currentTest.index++;
        if (this.state.currentTest.index >= this.state.currentTest.questions.length) {
            this.showScore();
        } else {
            this.loadQuestion();
        }
    }

    showScore() {
        this.showView('score');
        const score = this.state.currentTest.score;
        const total = this.state.currentTest.questions.length;
        const percentage = Math.round((score / total) * 100);
        
        this.els.scoreText.textContent = `${percentage}%`;
        this.els.scoreDetails.textContent = `You answered ${score} out of ${total} correctly.`;

        if (this.state.currentTest.mode === 'qotd') {
            const todayStr = new Date().toISOString().split('T')[0];
            this.state.lastQotdDate = todayStr;
            if (score === 1) {
                this.state.streak++;
                this.els.probUpdateMsg.textContent = `Great job! Your daily streak is now ${this.state.streak}!`;
            } else {
                this.state.streak = 0;
                this.els.probUpdateMsg.textContent = `Incorrect! Your daily streak has been reset to 0.`;
            }
            this.state.saveHistory();
        } else if (this.state.currentTest.mode === 'baseline') {
            this.els.probUpdateMsg.textContent = "Baseline recorded. Check the dashboard to see your new passing probabilities!";
        } else {
            this.els.probUpdateMsg.textContent = "Your category probabilities have been updated!";
        }

        // Exam Review
        if (this.state.currentTest.mode === 'exam' || this.state.currentTest.mode === 'baseline') {
            this.els.reviewContainer.classList.remove('hidden');
            this.els.reviewList.innerHTML = '';
            
            this.state.currentTest.userAnswers.forEach((ans, i) => {
                const item = document.createElement('div');
                item.className = `review-item ${ans.isCorrect ? 'review-correct' : 'review-wrong'}`;
                item.innerHTML = `
                    <p><strong>Q${i+1}:</strong> ${ans.question.question}</p>
                    <p class="review-yours">Your Answer: ${ans.question.options[ans.selected]}</p>
                    ${!ans.isCorrect ? `<p class="review-correct-ans">Correct Answer: ${ans.question.options[ans.question.correct]}</p>` : ''}
                    <p class="review-exp">${ans.question.explanation}</p>
                `;
                this.els.reviewList.appendChild(item);
            });
        } else {
            this.els.reviewContainer.classList.add('hidden');
        }
    }
}

// App Bootstrapper
document.addEventListener('DOMContentLoaded', async () => {
    // Register Service Worker for Offline PWA Support
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js').then(reg => {
                console.log('ServiceWorker registration successful with scope: ', reg.scope);
            }).catch(err => {
                console.warn('ServiceWorker registration failed: ', err);
            });
        });
    }

    const state = new AppState();
    const ui = new UIController(state);
    
    try {
        if (!window.ALL_QUESTIONS) {
            throw new Error('data.js is missing or ALL_QUESTIONS is undefined.');
        }
        
        state.allQuestions = window.ALL_QUESTIONS;
        
        // Provide ID to questions if missing
        state.allQuestions.forEach((q, i) => {
            if(!q.id) q.id = `q_${q.category_id}_${i}`;
            
            // Parse options if it's a string from SQLite legacy, or if it's already an array
            if (typeof q.options === 'string') {
                try {
                    q.options = JSON.parse(q.options);
                } catch(e) {}
            }
        });

        ui.showDashboard();
    } catch (error) {
        console.error('Failed to load initial data:', error);
        alert('Could not load the offline question database. Ensure data.js exists.');
    }
});
