document.addEventListener("DOMContentLoaded", () => {
    const colorOptions = document.getElementById("colorOptions");
    const scoreDisplay = document.getElementById("score");
    const message = document.getElementById("message");
    const startButton = document.getElementById("startButton");
    const highScoreDisplay = document.createElement("div");
    highScoreDisplay.id = "highScore";
    highScoreDisplay.textContent = "High Score: 0";
    scoreDisplay.parentNode.insertBefore(highScoreDisplay, scoreDisplay.nextSibling);

    let score = 0;
    let highScore = 0;
    let currentColor = null;
    let gameActive = false;
    let hintGiven = false;

    const generateRandomColor = () => {
        const hex = "0123456789ABCDEF";
        return "#" + Array.from({ length: 6 }, () => hex[Math.floor(Math.random() * 16)]).join("");
    };

    const generateColors = (targetColor) => {
        let colors = new Set([targetColor]);
        while (colors.size < 6) colors.add(generateRandomColor());
        return [...colors].sort(() => Math.random() - 0.5);
    };

    const getColorHint = (color) => {
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);

        let hints = [];
        if (r > 200) hints.push("Think fire, think destruction, think... spicy red!");
        if (g > 200) hints.push("Green like interdimensional goo. Or toxic waste. Probably both.");
        if (b > 200) hints.push("As blue as a portal to another dimension. Or crippling existential crisis.");
        if (hints.length === 0) hints.push("Even I have no clue what this shade is. Good luck, genius.");
        
        return hints.join(" ");
    };

    const handleColorClick = (selectedColor) => {
        if (!gameActive) return;

        if (selectedColor === currentColor) {
            score++;
            if (score > highScore) highScore = score;
            scoreDisplay.textContent = `Score: ${score}`;
            highScoreDisplay.textContent = `High Score: ${highScore}`;
            message.textContent = "Whoa! You actually got it right. I'm almost impressed.";
            message.className = "success";
            hintGiven = false;
            setTimeout(startRound, 1500);
        } else if (!hintGiven) {
            message.textContent = `Nope! But hey, here's a hint: ${getColorHint(currentColor)}`;
            message.className = "warning";
            hintGiven = true;
        } else {
            message.textContent = `Wow, still wrong? Game Over! Final Score: ${score}. Maybe try paying attention next time.`;
            message.className = "error";
            gameActive = false;
            startButton.textContent = "Give it another shot";
            startButton.style.display = "block";
            hintGiven = false;

            document.querySelectorAll(".color-option").forEach(button => {
                if (button.style.backgroundColor.toUpperCase() === currentColor.toUpperCase()) {
                    button.style.animation = "levitate 1.5s infinite alternate";
                }
            });
        }
    };

    const startRound = () => {
        currentColor = generateRandomColor();
        message.textContent = "Alright, pick a color. Don't screw this up.";
        message.className = "";
        colorOptions.innerHTML = "";

        generateColors(currentColor).forEach(color => {
            let button = document.createElement("button");
            button.className = "color-option";
            button.style.backgroundColor = color;
            button.setAttribute("data-testid", "colorOption");
            button.onclick = () => handleColorClick(color);
            colorOptions.appendChild(button);
        });
    };

    const startGame = () => {
        score = 0;
        gameActive = true;
        scoreDisplay.textContent = "Score: 0";
        startButton.style.display = "none";
        hintGiven = false;
        startRound();
    };

    startButton.addEventListener("click", startGame);

    const style = document.createElement("style");
    style.textContent = `
        @keyframes levitate {
            0% { transform: translateY(0); }
            100% { transform: translateY(-10px); }
        }
    `;
    document.head.appendChild(style);
});