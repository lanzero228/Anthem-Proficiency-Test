document.addEventListener('DOMContentLoaded', async () => {
    let results = [];

    // Пытаемся загрузить данные из Firebase
    if (window.getResultsFromFirebase) {
        try {
            results = await window.getResultsFromFirebase();
            console.log("Данные из Firebase:", results); // Для отладки
        } catch (e) {
            console.error("Ошибка загрузки из облака:", e);
            // Если Firebase не ответил, берем локальные данные
            results = JSON.parse(localStorage.getItem('gimn_results')) || [];
        }
    } else {
        console.warn("Функция Firebase не найдена в stats.html!");
        results = JSON.parse(localStorage.getItem('gimn_results')) || [];
    }
    
    // Отрисовка
    calculateGlobalStats(results);
    calculateGroupStats(results);
});

function calculateGlobalStats(data) {
    const globalContainer = document.getElementById('global-stats');
    
    if (!data || data.length === 0) {
        globalContainer.innerHTML = "<p>Пока нет данных о прохождении теста.</p>";
        return;
    }

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

    if (!data || data.length === 0) {
        tbody.innerHTML = "<tr><td colspan='4'>Нет данных</td></tr>";
        return;
    }

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
