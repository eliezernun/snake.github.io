const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
const tileCount = 800 / gridSize;
let snake = [{ x: 10, y: 10 }];
let direction = { x: 1, y: 0 };
let foodRed = { x: Math.floor(Math.random() * tileCount), y: Math.floor(Math.random() * tileCount) };
let foodYellow = null;
let foodBlue = null;
let foodWhite = null;
let gameOver = false;
let score = 0;
let speed = 100;
let speedTimer = null;
let time = 0; // Timer em segundos

// Função para desenhar a cobra e os alimentos
function draw() {
    // Limpa o canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenha a cobra
    ctx.fillStyle = 'lime';
    snake.forEach(part => {
        ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);
    });

    // Desenha a comida vermelha
    ctx.fillStyle = 'red';
    ctx.fillRect(foodRed.x * gridSize, foodRed.y * gridSize, gridSize, gridSize);

    // Desenha a comida verde amarela, se existir
    if (foodYellow) {
        ctx.fillStyle = 'yellowgreen';
        ctx.fillRect(foodYellow.x * gridSize, foodYellow.y * gridSize, gridSize, gridSize);
    }

    // Desenha a comida azul, se existir
    if (foodBlue) {
        ctx.fillStyle = 'blue';
        ctx.fillRect(foodBlue.x * gridSize, foodBlue.y * gridSize, gridSize, gridSize);
    }

    // Desenha a comida branca, se existir
    if (foodWhite) {
        ctx.fillStyle = 'white';
        ctx.fillRect(foodWhite.x * gridSize, foodWhite.y * gridSize, gridSize, gridSize);
    }

    // Desenha a pontuação
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 20);

    // Desenha o timer
    ctx.fillText('Time: ' + formatTime(time), 700, 20);
}

// Função para formatar o tempo em minutos e segundos
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// Função para atualizar o timer
function updateTimer() {
    if (!gameOver) {
        time++;
        setTimeout(updateTimer, 1000);
    }
}

function update() {
    if (gameOver) return;

    // Calcula a nova posição da cabeça da cobra
    const newHead = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };

    // Verifica colisões com paredes
    if (newHead.x < 0 || newHead.x >= tileCount || newHead.y < 0 || newHead.y >= tileCount) {
        gameOver = true;
        alert('Game Over!');
        return;
    }

    // Verifica colisões com o corpo
    if (snake.some(part => part.x === newHead.x && part.y === newHead.y)) {
        gameOver = true;
        alert('Game Over!');
        return;
    }

    // Verifica se a cobra comeu a comida vermelha
    if (newHead.x === foodRed.x && newHead.y === foodRed.y) {
        score += 10;
        snake.unshift(newHead);
        foodRed = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
    } else if (foodYellow && newHead.x === foodYellow.x && newHead.y === foodYellow.y) {
        // Verifica se comeu a comida verde amarela
        score += 20;
        snake.unshift(newHead);
        for (let i = 0; i < 2; i++) {
            snake.unshift({ ...snake[0] });
        }
        foodYellow = null;
    } else if (foodBlue && newHead.x === foodBlue.x && newHead.y === foodBlue.y) {
        // Verifica se comeu a comida azul
        score += 30;
        snake.unshift(newHead);
        for (let i = 0; i < 4; i++) {
            snake.unshift({ ...snake[0] });
        }
        speed = 50;
        clearTimeout(speedTimer);
        speedTimer = setTimeout(() => {
            speed = 100;
        }, 10000);
        foodBlue = null;
    } else if (foodWhite && newHead.x === foodWhite.x && newHead.y === foodWhite.y) {
        // Verifica se comeu a comida branca
        gameOver = true;
        alert('Game Over!');
        return;
    } else {
        // Remove a última parte da cobra
        snake.unshift(newHead);
        snake.pop();
    }
}

// Função para controlar a direção da cobra
function changeDirection(event) {
    switch (event.key) {
        case 'ArrowUp':
            if (direction.y === 0) direction = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
            if (direction.y === 0) direction = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
            if (direction.x === 0) direction = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
            if (direction.x === 0) direction = { x: 1, y: 0 };
            break;
    }
}

// Função para gerar alimentos especiais
function generateSpecialFood() {
    // Gera comida verde amarela
    if (!foodYellow) {
        foodYellow = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
    }

    // Gera comida azul aleatoriamente
    if (!foodBlue && Math.random() < 0.5) {
        foodBlue = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
    }

    // Gera comida branca aleatoriamente
    if (!foodWhite && Math.random() < 0.3) {
        foodWhite = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
    }

    setTimeout(generateSpecialFood, 60000); // Tenta gerar comidas especiais a cada 1 minuto
}

function gameLoop() {
    update();
    draw();
    if (!gameOver) {
        setTimeout(gameLoop, speed);
    }
}

// Eventos e inicialização
window.addEventListener('keydown', changeDirection);
generateSpecialFood();
updateTimer();
gameLoop();
