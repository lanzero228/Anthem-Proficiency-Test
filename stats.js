document.addEventListener('DOMContentLoaded', async () => {
    console.log("Скрипт stats.js запущен");
    
    let results = [];

    if (window.getResultsFromFirebase) {
        console.log("Функция Firebase найдена, пробуем загрузить данные...");
        try {
            results = await window.getResultsFromFirebase();
            console.log("Успешно загружено записей:", results.length);
        } catch (e) {
            console.error("ОШИБКА при загрузке из Firebase:", e);
        }
    } else {
        console.error("Функция getResultsFromFirebase НЕ НАЙДЕНА! Проверьте stats.html");
    }
    
    // Если данных нет, пробуем взять локальные (на случай, если Firebase недоступен)
    if (!results || results.length === 0) {
        console.warn("Данных из Firebase нет, проверяем LocalStorage...");
        results = JSON.parse(localStorage.getItem('gimn_results')) || [];
        console.log("Локальные данные:", results);
    }
    
    // Отрисовка
    if (results.length > 0) {
        calculateGlobalStats(results);
        calculateGroupStats(results);
    } else {
        document.getElementById('global-stats').innerHTML = "<p>Пока нет данных о прохождении теста.</p>";
        document.getElementById('group-stats-body').innerHTML = "<tr><td colspan='4'>Нет данных</td></tr>";
    }
});

function calculateGlobalStats(data) {
    const globalContainer = document.getElementById('global-stats');
    
    const totalAttempts = data.length;
    const avgScore = Math.round(data.reduce((sum, item) => sum + item.percentage, 0) / totalAttempts);
    const bestScore = Math.max(...data.map(item => item.percentage));

    globalContainer.innerHTML = `
        <div class="stat-box">
            <h3>${totalAttempts}</h3>
            <p>Всего попыток</p>
        </div>
        <div class="stat-box">
            <h3>${avgScore}%</h3>
            <p>Средний балл по колледжу</p>
        </div>
        <div class="stat-box">
            <h3>${bestScore}%</h3>
            <p>Лучший результат</p>
        </div>
    `;
}

function calculateGroupStats(data) {
    const tbody = document.getElementById('group-stats-body');
    tbody.innerHTML = "";

    const groupedData = {};
    data.forEach(item => {
        if (!groupedData[item.group]) {
            groupedData[item.group] = [];
        }
        groupedData[item.group].push(item);
    });

    const sortedGroups = Object.keys(groupedData).sort();

    sortedGroups.forEach(groupName => {
        const groupResults = groupedData[groupName];
        const attempts = groupResults.length;
        const avg = Math.round(groupResults.reduce((sum, item) => sum + item.percentage, 0) / attempts);
        const best = Math.max(...groupResults.map(item => item.percentage));

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${groupName}</strong></td>
            <td>${attempts}</td>
            <td>${avg}%</td>
            <td>${best}%</td>
        `;
        tbody.appendChild(tr);
    });
}
