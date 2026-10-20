// ==========================================
// 1. СПРАВОЧНИК ГРУПП ПО КУРСАМ
// ==========================================
const groupsData = {
    "1": [
        "АВ-2616", "АД-2616", "АМ-2616", "АМ-2626", "БУР-2616", "БУР-262", 
        "БУХ-261", "ВЕБ-261", "ИИ-2616", "МЕХ-2616", "ПО-2616", "ПО-2626",
        "СА-2616", "СТ-2616", "СТ-2626", "СТ-2636", "ЭКС-2616", "ЭКС-2626", 
        "ЭКС-263", "ЭКС1-264", "ЭЛ-2616", "ЭЛ-262"
    ],
    "2": [
        "АВ-2516", "АД-2516", "АМ-2516", "АМ-2526", "БУР-2516", "БУР-252",
        "БУХ-251", "ГФ-2516", "ИС-2516", "ИС-2526", "ИС-253", "МЕХ-2516",
        "СА-2516", "СТ-2516", "СТ-2526", "СТ-2536", "ЭКС-2516", "ЭКС-252",
        "ЭЛ-2516", "ЭЛ-252"
    ],
    "3": [
        "АВ-2416", "АВ-242", "АД-2416", "АМ-2416", "АМ-2426", "БУР-2416",
        "БУР-242", "БУХ-241", "ГФ-2416", "ИС-2416", "ИС-2426", "ИС-243",
        "МЕХ-2416", "СА-2416", "СТ-2416", "СТ-2426", "СТ-2436", "ЭКС-2416",
        "ЭКС-242", "ЭКС1-243", "ЭЛ-2416", "ЭЛ-242"
    ],
    "4": [
        "АВ-2316", "АД-2316", "АМ-2316", "АМ-2326", "БУР-2316", "БУР-232",
        "ГФ-2316", "ИС-2316", "ИС-2326", "МЕХ-2316", "СА-2316", "СМ-2316",
        "СТ-2316", "СТ-2326", "СТ-2336", "ЭКС-2316", "ЭКС-232", "ЭЛ-2316", "ЭЛ-232"
    ]
};

// ==========================================
// 2. БАЗА ВОПРОСОВ
// ==========================================
const originalQuestions = [
    // --- Часть 1: Ввод пропущенных слов ---
    {
        type: "input",
        question: "Россия — [ ... ] наша держава,\nРоссия — любимая наша страна.",
        correct: ["священная"]
    },
    {
        type: "input",
        question: "Могучая воля, [ ... ] слава —\nТвоё достоянье на все времена!",
        correct: ["великая"]
    },
    {
        type: "input",
        question: "Славься, Отечество наше [ ... ],\nБратских народов союз вековой,",
        correct: ["свободное"]
    },
    {
        type: "input",
        question: "Братских народов союз [ ... ],\nПредками данная мудрость народная!",
        correct: ["вековой"]
    },
    {
        type: "input",
        question: "От южных морей до [ ... ] края\nРаскинулись наши леса и поля.",
        correct: ["полярного"]
    },
    {
        type: "input",
        question: "Предками данная [ ... ] народная!\nСлавься, страна! Мы гордимся тобой!",
        correct: ["мудрость"]
    },

    // --- Часть 2: Сортировка (Drag & Drop) ---
    {
        type: "sort",
        question: "Расположите строки финального куплета в правильном порядке:",
        options: [
            "Широкий простор для мечты и для жизни",
            "Нам силу даёт наша верность Отчизне.",
            "Грядущие нам открывают года.",
            "Так было, так есть и так будет всегда!"
        ]
    },

    // --- Часть 3: Выбор варианта ---
    {
        type: "choice",
        question: "Кто является автором современного текста гимна?",
        options: ["Александр Пушкин", "Сергей Михалков", "Владимир Маяковский"],
        correct: 1 
    },
    {
        type: "choice",
        question: "Кто написал музыку к гимну?",
        options: ["Михаил Глинка", "Пётр Чайковский", "Александр Александров"],
        correct: 2 
    }
];

let questions = [];

// ==========================================
// 3. ПЕРЕМЕННЫЕ И DOM ЭЛЕМЕНТЫ
// ==========================================
let currentQuestionIndex = 0;
let score = 0;
let selectedGroup = "";
let userAnswers = []; 

const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');

const courseSelect = document.getElementById('course-select');
const groupSelect = document.getElementById('group-select');
const startBtn = document.getElementById('start-btn');

const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const nextBtn = document.getElementById('next-btn');
const progress = document.getElementById('progress');
const scoreSpan = document.getElementById('score');
const totalSpan = document.getElementById('total');
const resultMessage = document.getElementById('result-message');

// ==========================================
// 4. ФУНКЦИЯ ПЕРЕМЕШИВАНИЯ (Алгоритм Фишера-Йетса)
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
// 5. ЛОГИКА ВЫБОРА КУРСА И ГРУППЫ
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
// 6. ОТОБРАЖЕНИЕ ВОПРОСОВ
// ==========================================
function loadQuestion() {
    const q = questions[currentQuestionIndex];
    optionsContainer.innerHTML = "";
    nextBtn.classList.add('hidden');
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

// --- Вопросы с вводом текста ---
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
        userAnswers[currentQuestionIndex] = e.target.value.trim();
        if (e.target.value.trim().length > 0) {
            nextBtn.classList.remove('hidden');
        } else {
            nextBtn.classList.add('hidden');
        }
    });

    optionsContainer.appendChild(input);
    setTimeout(() => input.focus(), 100);
}

// --- Вопросы с выбором ---
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

// --- Сортировка (Drag & Drop) ---
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
            const item = document.createElement('div');
            item.className = 'sort-item';
            item.draggable = true;
            item.dataset.index = index;
            item.innerHTML = `<span>${text}</span>`;

            item.addEventListener('dragstart', function(e) {
                window.draggedItem = this;
                window.draggedIndex = parseInt(this.dataset.index);
                this.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
            });
            
            item.addEventListener('dragover', e => e.preventDefault());
            
            item.addEventListener('drop', function(e) {
                e.stopPropagation();
                const targetIndex = parseInt(this.dataset.index);
                if (window.draggedItem !== this) {
                    const movedItem = currentOptions.splice(window.draggedIndex, 1)[0];
                    currentOptions.splice(targetIndex, 0, movedItem);
                    userAnswers[currentQuestionIndex] = [...currentOptions];
                    drawList();
                }
            });
            
            item.addEventListener('dragend', function() {
                this.classList.remove('dragging');
            });
            
            listContainer.appendChild(item);
        });
    };

    drawList();
    optionsContainer.appendChild(listContainer);
    nextBtn.classList.remove('hidden');
}

// ==========================================
// 7. ПЕРЕХОД К СЛЕДУЮЩЕМУ ВОПРОСУ
// ==========================================
nextBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        finishQuiz();
    }
});

// ==========================================
// 8. ПОДВЕДЕНИЕ ИТОГОВ
// ==========================================
function finishQuiz() {
    score = 0;
    questions.forEach((q, index) => {
        const answer = userAnswers[index];

        if (q.type === "input") {
            if (answer && q.correct.includes(answer.toLowerCase())) {
                score++;
            }
        } else if (q.type === "choice") {
            if (answer === q.correct) {
                score++;
            }
        } else if (q.type === "sort") {
            const isCorrect = answer.every((val, i) => val === q.options[i]);
            if (isCorrect) {
                score++;
            }
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

// ==========================================
// 9. СОХРАНЕНИЕ РЕЗУЛЬТАТОВ
// ==========================================
function saveResult(group, score, total) {
    let results = JSON.parse(localStorage.getItem('gimn_results')) || [];
    results.push({
        group: group,
        score: score,
        total: total,
        percentage: Math.round((score / total) * 100),
        date: new Date().toLocaleString('ru-RU')
    });
    localStorage.setItem('gimn_results', JSON.stringify(results));
}

// ==========================================
// 10. ИНТЕРАКТИВНЫЙ ФОН (Реакция на мышь)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const bgContainer = document.querySelector('.bg-container');
    
    if (bgContainer) {
        // Добавляем класс для плавного покачивания (ветер)
        setTimeout(() => {
            bgContainer.classList.add('wind-active');
        }, 100);

        // Функция проверки: находится ли курсор над интерактивным элементом
        function isInteractiveElement(target) {
            return target.closest('button') || 
                   target.closest('input') || 
                   target.closest('select') || 
                   target.closest('a') || 
                   target.closest('.sort-item') ||
                   target.closest('.card');
        }

        // Эффект параллакса при движении мыши
        document.addEventListener('mousemove', (e) => {
            // Если курсор над карточкой или кнопкой — фон не двигаем
            if (isInteractiveElement(e.target)) return;

            // Вычисляем смещение (от -1 до 1)
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;

            // Сдвигаем фон
            bgContainer.style.transform = `translate(${x * -20}px, ${y * -20}px) scale(1.1)`;
        });

        // При клике делаем "всплеск" ветра (только если кликнули по пустому месту)
        document.addEventListener('click', (e) => {
            // Если кликнули по кнопке или карточке — игнорируем
            if (isInteractiveElement(e.target)) return;

            bgContainer.style.transition = 'transform 0.1s ease-out';
            bgContainer.style.transform += ' scale(1.05)';
            
            setTimeout(() => {
                bgContainer.style.transform = bgContainer.style.transform.replace(' scale(1.05)', '');
                bgContainer.style.transition = 'transform 0.1s ease-out';
            }, 150);
        });
    }
});