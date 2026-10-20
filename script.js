// ==========================================
// 1. СПРАВОЧНИК ГРУПП ПО КУРСАМ
// ==========================================
const groupsData = {
    "1": ["АВ-2616Б", "АД-2616Б", "АМ-2616Б", "АМ-2626Б", "БУР-2616Б", "БУР-262Б", "БУХ-261Б", "ВЕБ-261Б", "ИИ-2616Б", "МЕХ-2616Б", "ПО-2616Б", "ПО-2626Б", "СА-2616Б", "СТ-2616Б", "СТ-2626Б", "СТ-2636Б", "ЭКС-2616Б", "ЭКС-2626Б", "ЭКС-263Б", "ЭКС1-264Б", "ЭЛ-2616Б", "ЭЛ-262Б"],
    "2": ["АВ-2516Б", "АД-2516Б", "АМ-2516Б", "АМ-2526Б", "БУР-2516Б", "БУР-252Б", "БУХ-251Б", "ГФ-2516Б", "ИС-2516Б", "ИС-2526Б", "ИС-253Б", "МЕХ-2516Б", "СА-2516Б", "СТ-2516Б", "СТ-2526Б", "СТ-2536Б", "ЭКС-2516Б", "ЭКС-252Б", "ЭЛ-2516Б", "ЭЛ-252Б"],
    "3": ["АВ-2416Б", "АВ-242Б", "АД-2416Б", "АМ-2416Б", "АМ-2426Б", "БУР-2416Б", "БУР-242Б", "БУХ-241Б", "ГФ-2416Б", "ИС-2416Б", "ИС-2426Б", "ИС-243Б", "МЕХ-2416Б", "СА-2416Б", "СТ-2416Б", "СТ-2426Б", "СТ-2436Б", "ЭКС-2416Б", "ЭКС-242Б", "ЭКС1-243Б", "ЭЛ-2416Б", "ЭЛ-242Б"],
    "4": ["АВ-2316Б", "АД-2316Б", "АМ-2316Б", "АМ-2326Б", "БУР-2316Б", "БУР-232Б", "ГФ-2316Б", "ИС-2316Б", "ИС-2326Б", "МЕХ-2316Б", "СА-2316Б", "СМ-2316Б", "СТ-2316Б", "СТ-2326Б", "СТ-2336Б", "ЭКС-2316Б", "ЭКС-232Б", "ЭЛ-2316Б", "ЭЛ-232Б"]
};

// ==========================================
// 2. БАЗА ВОПРОСОВ
// ==========================================
const originalQuestions = [
    { type: "input", question: "Россия — [ ... ] наша держава,\nРоссия — любимая наша страна.", correct: ["священная"] },
    { type: "input", question: "Могучая воля, [ ... ] слава —\nТвоё достоянье на все времена!", correct: ["великая"] },
    { type: "input", question: "Славься, Отечество наше [ ... ],\nБратских народов союз вековой,", correct: ["свободное"] },
    { type: "input", question: "Братских народов союз [ ... ],\nПредками данная мудрость народная!", correct: ["вековой"] },
    { type: "input", question: "От южных морей до [ ... ] края\nРаскинулись наши леса и поля.", correct: ["полярного"] },
    { type: "input", question: "Предками данная [ ... ] народная!\nСлавься, страна! Мы гордимся тобой!", correct: ["мудрость"] },
    { 
        type: "sort", 
        question: "Расположите строки финального куплета в правильном порядке:", 
        options: ["Широкий простор для мечты и для жизни", "Нам силу даёт наша верность Отчизне.", "Грядущие нам открывают года.", "Так было, так есть и так будет всегда!"] 
    },
    { type: "choice", question: "Кто является автором современного текста гимна?", options: ["Александр Пушкин", "Сергей Михалков", "Владимир Маяковский"], correct: 1 },
    { type: "choice", question: "Кто написал музыку к гимну?", options: ["Михаил Глинка", "Пётр Чайковский", "Александр Александров"], correct: 2 }
];

let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let selectedGroup = "";
let userAnswers = []; 

// DOM Элементы
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const courseSelect = document.getElementById('course-select');
const groupSelect = document.getElementById('group-select');
const startBtn = document.getElementById('start-btn');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const nextBtn = document.getElementById('next-btn');
const backBtn = document.getElementById('back-btn');
const progress = document.getElementById('progress');
const scoreSpan = document.getElementById('score');
const totalSpan = document.getElementById('total');
const resultMessage = document.getElementById('result-message');

// ==========================================
// 3. УТИЛИТЫ
// ==========================================
function shuffleArray(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

// ==========================================
// 4. ЛОГИКА СТАРТА
// ==========================================
courseSelect.addEventListener('change', (e) => {
    const course = e.target.value;
    groupSelect.innerHTML = "";
    
    if (!course) {
        groupSelect.disabled = true;
        groupSelect.innerHTML = '<option value="" hidden selected>-- Сначала выберите курс --</option>';
    } else {
        groupSelect.disabled = false;
        groupSelect.innerHTML = '<option value="" hidden selected>-- Выберите группу --</option>';
        groupsData[course].forEach(groupName => {
            const option = document.createElement('option');
            option.value = groupName;
            option.textContent = groupName;
            groupSelect.appendChild(option);
        });
    }
});

startBtn.addEventListener('click', () => {
    selectedGroup = groupSelect.value;
    if (!courseSelect.value || !selectedGroup) {
        alert("Пожалуйста, выберите курс и группу!");
        return;
    }

    questions = [...originalQuestions]; 
    shuffleArray(questions); 
    
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = [];

    startScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    loadQuestion();
});

// ==========================================
// 5. ОТОБРАЖЕНИЕ ВОПРОСОВ
// ==========================================
function loadQuestion() {
    const q = questions[currentQuestionIndex];
    optionsContainer.innerHTML = "";
    
    nextBtn.classList.add('hidden');
    if (currentQuestionIndex > 0) {
        backBtn.classList.remove('hidden');
    } else {
        backBtn.classList.add('hidden');
    }

    questionText.innerHTML = q.question.replace(/\n/g, '<br>');
    
    if (q.type === "input") {
        renderInputQuestion(q);
    } else if (q.type === "choice") {
        renderChoiceQuestion(q);
    } else if (q.type === "sort") {
        renderSortQuestion(q);
    }

    const progressPercent = (currentQuestionIndex / questions.length) * 100;
    progress.style.width = progressPercent + "%";
}

function renderInputQuestion(q) {
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'text-input';
    input.placeholder = 'Впишите слово...';
    
    if (userAnswers[currentQuestionIndex]) {
        input.value = userAnswers[currentQuestionIndex];
        nextBtn.classList.remove('hidden');
    }

    input.addEventListener('input', (e) => {
        // ИСПРАВЛЕНИЕ: Приводим к нижнему регистру сразу при вводе для сохранения
        const val = e.target.value.trim().toLowerCase();
        userAnswers[currentQuestionIndex] = val;
        if (val.length > 0) {
            nextBtn.classList.remove('hidden');
        } else {
            nextBtn.classList.add('hidden');
        }
    });

    optionsContainer.appendChild(input);
    setTimeout(() => input.focus(), 100);
}

function renderChoiceQuestion(q) {
    q.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.classList.add('option-btn');
        btn.textContent = option;
        
        if (userAnswers[currentQuestionIndex] === index) {
            btn.classList.add('selected');
            nextBtn.classList.remove('hidden');
        }

        btn.onclick = () => {
            document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            userAnswers[currentQuestionIndex] = index;
            nextBtn.classList.remove('hidden');
        };
        optionsContainer.appendChild(btn);
    });
}

function renderSortQuestion(q) {
    let currentOptions = [];
    
    if (userAnswers[currentQuestionIndex] === undefined) {
        currentOptions = [...q.options].sort(() => Math.random() - 0.5);
        userAnswers[currentQuestionIndex] = [...currentOptions];
    } else {
        currentOptions = [...userAnswers[currentQuestionIndex]];
    }

    const listContainer = document.createElement('div');
    listContainer.className = 'sort-list';

    const drawList = () => {
        listContainer.innerHTML = "";
        currentOptions.forEach((text, index) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'sort-item-wrapper';
            wrapper.draggable = true;
            wrapper.dataset.index = index;

            const textSpan = document.createElement('span');
            textSpan.className = 'sort-item-text';
            textSpan.textContent = text;

            const controls = document.createElement('div');
            controls.className = 'sort-controls';
            
            const btnUp = document.createElement('button');
            btnUp.className = 'sort-arrow';
            btnUp.innerHTML = '↑';
            btnUp.disabled = index === 0;
            btnUp.onclick = (e) => {
                e.preventDefault();
                [currentOptions[index - 1], currentOptions[index]] = [currentOptions[index], currentOptions[index - 1]];
                userAnswers[currentQuestionIndex] = [...currentOptions];
                drawList();
            };

            const btnDown = document.createElement('button');
            btnDown.className = 'sort-arrow';
            btnDown.innerHTML = '↓';
            btnDown.disabled = index === currentOptions.length - 1;
            btnDown.onclick = (e) => {
                e.preventDefault();
                [currentOptions[index + 1], currentOptions[index]] = [currentOptions[index], currentOptions[index + 1]];
                userAnswers[currentQuestionIndex] = [...currentOptions];
                drawList();
            };

            controls.appendChild(btnUp);
            controls.appendChild(btnDown);

            wrapper.appendChild(textSpan);
            wrapper.appendChild(controls);

            wrapper.addEventListener('dragstart', function(e) {
                window.draggedItem = this;
                window.draggedIndex = parseInt(this.dataset.index);
                this.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
            });
            
            wrapper.addEventListener('dragover', e => e.preventDefault());
            
            wrapper.addEventListener('drop', function(e) {
                e.stopPropagation();
                const targetIndex = parseInt(this.dataset.index);
                if (window.draggedItem !== this) {
                    const movedItem = currentOptions.splice(window.draggedIndex, 1)[0];
                    currentOptions.splice(targetIndex, 0, movedItem);
                    userAnswers[currentQuestionIndex] = [...currentOptions];
                    drawList();
                }
            });
            
            wrapper.addEventListener('dragend', function() {
                this.classList.remove('dragging');
            });
            
            listContainer.appendChild(wrapper);
        });
    };

    drawList();
    optionsContainer.appendChild(listContainer);
    nextBtn.classList.remove('hidden');
}

// ==========================================
// 6. НАВИГАЦИЯ
// ==========================================
nextBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        finishQuiz();
    }
});

backBtn.addEventListener('click', () => {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuestion();
    }
});

// ==========================================
// 7. ИТОГИ И СОХРАНЕНИЕ (С ИСПРАВЛЕНИЕМ РЕГИСТРА)
// ==========================================
function finishQuiz() {
    score = 0;
    questions.forEach((q, index) => {
        const answer = userAnswers[index];

        if (q.type === "input") {
            // ИСПРАВЛЕНИЕ: Приводим и введенный ответ, и правильный к нижнему регистру перед проверкой
            if (answer && q.correct.includes(answer.toLowerCase())) {
                score++;
            }
        } else if (q.type === "choice") {
            if (answer === q.correct) score++;
        } else if (q.type === "sort") {
            const isCorrect = answer.every((val, i) => val === q.options[i]);
            if (isCorrect) score++;
        }
    });

    quizScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    
    progress.style.width = "100%";
    scoreSpan.textContent = score;
    totalSpan.textContent = questions.length;

    if (score === questions.length) {
        resultMessage.textContent = "Знаток символики! Вы отлично знаете главную песню страны.";
    } else if (score >= 7) {
        resultMessage.textContent = "Хороший результат, но стоит еще раз перечитать текст.";
    } else {
        resultMessage.textContent = "Рекомендуем выучить гимн, ведь это важный символ нашего государства!";
    }

    saveResult(selectedGroup, score, questions.length);
}

function saveResult(group, score, total) {
    const resultData = {
        group: group,
        score: score,
        total: total,
        percentage: Math.round((score / total) * 100),
        date: new Date().toLocaleString('ru-RU')
    };

    let localResults = JSON.parse(localStorage.getItem('gimn_results')) || [];
    localResults.push(resultData);
    localStorage.setItem('gimn_results', JSON.stringify(localResults));

    if (window.addResultToFirebase) {
        window.addResultToFirebase(resultData);
    } else {
        console.warn("Функция Firebase не найдена. Проверьте index.html");
    }
}

// ==========================================
// 8. ИНТЕРАКТИВНЫЙ ФОН
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const bgContainer = document.querySelector('.bg-container');
    
    if (bgContainer) {
        setTimeout(() => { bgContainer.classList.add('wind-active'); }, 100);

        function isInteractiveElement(target) {
            return target.closest('button') || target.closest('input') || target.closest('select') || 
                   target.closest('a') || target.closest('.sort-item-wrapper') || target.closest('.card');
        }

        document.addEventListener('mousemove', (e) => {
            if (isInteractiveElement(e.target)) return;
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;
            bgContainer.style.transform = `translate(${x * -15}px, ${y * -15}px) scale(1.05)`;
        });
    }
});
