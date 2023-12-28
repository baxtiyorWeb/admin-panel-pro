document.addEventListener('DOMContentLoaded', function () {
    fetchData(); // Вызовем fetchData при загрузке страницы

    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', searchQuestions);
});

async function fetchData() {
    try {
        const response = await fetch('/questions');
        const data = await response.json();

        if (Array.isArray(data)) {
            displayQuestions(data);
        } else {
            console.error('Error: No data or unexpected data format');
        }

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function searchQuestions() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    try {
        const response = await fetch('/questions');
        const data = await response.json();

        if (Array.isArray(data)) {
            const filteredQuestions = data.filter(question =>
                question.title.toLowerCase().includes(searchInput) ||
                question.number.toString().includes(searchInput)
            );

            const questionBoxes = document.getElementById('questionBoxes');
            questionBoxes.innerHTML = '';

            displayQuestions(filteredQuestions);
        } else {
            console.error('Error: No data or unexpected data format');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function displayQuestions(questionsToDisplay) {
    const questionBoxes = document.getElementById('questionBoxes');
    questionBoxes.innerHTML = '';

    questionsToDisplay.forEach(question => {
        const box = document.createElement('div');
        box.classList.add('question-box');

        // Преобразуем difficulty в число (убираем % и преобразуем в число)
        const difficultyValue = parseFloat(question.difficulty.replace('%', ''));

        const difficultyClass = getDifficultyClass(difficultyValue);

        if (difficultyClass) {
            box.classList.add(...difficultyClass.split(' '));
        }

        const cover = document.createElement('div');
        cover.classList.add('cover');

        const title = document.createElement('div');
        title.classList.add('question-title');
        title.textContent = question.title;

        const details = document.createElement('div');
        details.classList.add('question-details');
        details.textContent = `Raqam: ${question.number} | Qiyinchiligi: ${difficultyValue} | Dasturlash Tili: ${question.language}`;

        const answerCode = document.createElement('pre');
        answerCode.classList.add('answer-code');

        const codeElement = document.createElement('code');
        codeElement.classList.add(...question.language.toLowerCase().split(' '));
        codeElement.textContent = question.answer;

        answerCode.appendChild(codeElement);

        cover.appendChild(title);
        cover.appendChild(details);
        cover.appendChild(answerCode);

        box.appendChild(cover);
        questionBoxes.appendChild(box);

        box.addEventListener('click', function () {
            copyAnswer(question.answer);
        });
    });

    questionBoxes.querySelectorAll('code').forEach((block) => {
        hljs.highlightBlock(block);
    });
}



function copyAnswer(answer) {
    navigator.clipboard.writeText(answer)
        .then(() => {
            console.log('Answer copied to clipboard');
            alert('Javob nusxalandi');
        })
        .catch(err => {
            console.error('Unable to copy answer to clipboard', err);
            alert('Javob nusxalashda muammo paydo boldi');
        });
}

function getDifficultyClass(difficulty) {
    const category = Math.ceil(difficulty / 25);
console.log(difficulty)
    
    return `difficulty${category}`;
}
// ... (existing code)


//snow js
var embedimSnow = document.getElementById("embedim--snow");
if (!embedimSnow) {
    function embRand(a, b) {
        return Math.floor(Math.random() * (b - a + 1)) + a;
    }

    var embCSS = '.embedim-snow{position: absolute;width: 5px;height: 5px;background: white;border-radius: 50%;margin-top: -10px}';
    var embHTML = '';

    for (i = 1; i < 200; i++) {
        embHTML += '<i class="embedim-snow"></i>';
        var rndX = (embRand(0, 1000000) * 0.0001),
            rndO = embRand(-100000, 100000) * 0.0001,
            rndT = (embRand(3, 8) * 10).toFixed(2),
            rndS = (embRand(0, 10000) * 0.0001).toFixed(2);

        embCSS += '.embedim-snow:nth-child(' + i + '){' +
            'opacity:' + (embRand(1, 10000) * 0.0001).toFixed(2) + ';' +
            'transform:translate(' + rndX.toFixed(2) + 'vw,-10px) scale(' + rndS + ');' +
            'animation:fall-' + i + ' ' + embRand(10, 30) + 's -' + embRand(0, 30) + 's linear infinite' +
            '}' +
            '@keyframes fall-' + i + '{' +
            rndT + '%{' +
            'transform:translate(' + (rndX + rndO).toFixed(2) + 'vw,' + rndT + 'vh) scale(' + rndS + ')' +
            '}' +
            'to{' +
            'transform:translate(' + (rndX + (rndO / 2)).toFixed(2) + 'vw, 105vh) scale(' + rndS + ')' +
            '}' +
            '}';
    }

    embedimSnow = document.createElement('div');
    embedimSnow.id = 'embedim--snow';
    embedimSnow.innerHTML = '<style>#embedim--snow{position:fixed;left:0;top:0;bottom:0;width:100vw;height:100vh;overflow:hidden;z-index:9999999;pointer-events:none}' + embCSS + '</style>' + embHTML;
    document.body.appendChild(embedimSnow);
}