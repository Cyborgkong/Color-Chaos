let score = 0;
let streak = 0;
let targetColor;
let lastChoice = null;
let colorOptions = [];
let mindGameMode = false;
let timer;
let roundTime = 5000;

const colorBox = document.getElementById('colorBox');
const colorOptionsContainer = document.getElementById('colorOptions');
const gameStatus = document.getElementById('gameStatus');
const scoreDisplay = document.getElementById('score');
const newGameButton = document.getElementById('newGameButton');
const mindGameButton = document.getElementById('mindGameMode');

function randomRGB() {
    return `rgb(${rand255()}, ${rand255()}, ${rand255()})`;
}

function rand255() {
    return Math.floor(Math.random() * 256);
}

function generateColorOptions() {
    clearTimeout(timer);
    colorOptions = [];

    for (let i = 0; i < 6; i++) {
        let color = randomRGB();
        colorOptions.push(color);
    }

    const targetIndex = Math.floor(Math.random() * 6);
    targetColor = colorOptions[targetIndex];

    colorBox.style.backgroundColor = targetColor;
    colorBox.classList.add('animate');
    setTimeout(() => colorBox.classList.remove('animate'), 300);

    colorOptionsContainer.innerHTML = '';
    colorOptions.forEach(color => {
        const colorOption = document.createElement('div');
        colorOption.classList.add('color-option');
        colorOption.style.backgroundColor = mindGameMode ? tweakColor(color) : color;
        colorOption.addEventListener('click', () => checkGuess(color));
        colorOptionsContainer.appendChild(colorOption);
    });

    startTimer();
}

function tweakColor(color) {
    let rgb = color.match(/\d+/g);
    return `rgb(${Math.max(0, rgb[0] - 20)}, ${Math.max(0, rgb[1] - 20)}, ${Math.max(0, rgb[2] - 20)})`;
}

function checkGuess(selectedColor) {
    clearTimeout(timer);
    
    if (selectedColor === lastChoice) {
        score -= 5;
        gameStatus.textContent = "You think you're smart? -5 points!";
        gameStatus.classList.remove('correct');
        gameStatus.classList.add('wrong');
    } else if (selectedColor === targetColor) {
        streak++;
        let points = streak * 10;
        score += points;
        gameStatus.textContent = `Correct! +${points} points`;
        gameStatus.classList.remove('wrong');
        gameStatus.classList.add('correct');
        increaseDifficulty();
    } else {
        streak = 0;
        score -= 10;
        gameStatus.textContent = getRandomInsult();
        gameStatus.classList.remove('correct');
        gameStatus.classList.add('wrong');
    }
    
    scoreDisplay.textContent = score;
    lastChoice = selectedColor;
    generateColorOptions();
}

function getRandomInsult() {
    const insults = [
        "Bro... you serious?",
        "I've seen pigeons with better color perception.",
        "Maybe take off your sunglasses?",
        "This ain't it, chief.",
        "Colorblind mode isn't on, you just suck.",
    ];
    return insults[Math.floor(Math.random() * insults.length)];
}

function increaseDifficulty() {
    if (streak % 3 === 0 && roundTime > 2000) {
        roundTime -= 500;
    }
}

function startTimer() {
    timer = setTimeout(() => {
        score -= 10;
        gameStatus.textContent = "Too slow! -10 points.";
        gameStatus.classList.remove('correct');
        gameStatus.classList.add('wrong');
        scoreDisplay.textContent = score;
        generateColorOptions();
    }, roundTime);
}

function newGame() {
    score = 0;
    streak = 0;
    roundTime = 5000;
    scoreDisplay.textContent = score;
    gameStatus.textContent = '';
    lastChoice = null;
    generateColorOptions();
}

mindGameButton.addEventListener('click', () => {
    mindGameMode = !mindGameMode;
    mindGameButton.textContent = mindGameMode ? "Mind Game Mode: ON" : "Mind Game Mode: OFF";
    generateColorOptions();
});

newGameButton.addEventListener('click', newGame);
newGame();
