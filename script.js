// Game canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Score elements
const playerScoreEl = document.getElementById('playerScore');
const computerScoreEl = document.getElementById('computerScore');

// Game objects
const paddle = {
    width: 10,
    height: 80,
    x: 10,
    y: canvas.height / 2 - 40,
    dy: 0,
    speed: 6
};

const computer = {
    width: 10,
    height: 80,
    x: canvas.width - 20,
    y: canvas.height / 2 - 40,
    dy: 0,
    speed: 4
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 8,
    dx: 5,
    dy: 5,
    speed: 5
};

let playerScore = 0;
let computerScore = 0;
let gameRunning = true;

// Mouse tracking
let mouseY = canvas.height / 2;
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseY = e.clientY - rect.top;
});

// Keyboard controls
const keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});
window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Update player paddle position
function updatePlayerPaddle() {
    // Mouse control
    if (mouseY > paddle.y + paddle.height / 2 && paddle.y + paddle.height < canvas.height) {
        paddle.y += paddle.speed;
    } else if (mouseY < paddle.y + paddle.height / 2 && paddle.y > 0) {
        paddle.y -= paddle.speed;
    }

    // Arrow key control
    if ((keys['ArrowUp'] || keys['w']) && paddle.y > 0) {
        paddle.y -= paddle.speed;
    }
    if ((keys['ArrowDown'] || keys['s']) && paddle.y + paddle.height < canvas.height) {
        paddle.y += paddle.speed;
    }

    // Boundary checking
    if (paddle.y < 0) paddle.y = 0;
    if (paddle.y + paddle.height > canvas.height) paddle.y = canvas.height - paddle.height;
}

// Update computer AI
function updateComputerPaddle() {
    const computerCenter = computer.y + computer.height / 2;
    const ballCenter = ball.y;
    const difference = ballCenter - computerCenter;

    if (Math.abs(difference) > 35) {
        if (difference > 0 && computer.y + computer.height < canvas.height) {
            computer.y += computer.speed;
        } else if (difference < 0 && computer.y > 0) {
            computer.y -= computer.speed;
        }
    }

    // Boundary checking
    if (computer.y < 0) computer.y = 0;
    if (computer.y + computer.height > canvas.height) computer.y = canvas.height - computer.height;
}

// Update ball position
function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Top and bottom wall collision
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.dy = -ball.dy;
        ball.y = ball.y - ball.radius < 0 ? ball.radius : canvas.height - ball.radius;
    }

    // Paddle collision - Player
    if (
        ball.x - ball.radius < paddle.x + paddle.width &&
        ball.y > paddle.y &&
        ball.y < paddle.y + paddle.height
    ) {
        ball.dx = Math.abs(ball.dx);
        const deltaY = ball.y - (paddle.y + paddle.height / 2);
        ball.dy = (deltaY / (paddle.height / 2)) * ball.speed;
        ball.x = paddle.x + paddle.width + ball.radius;
    }

    // Paddle collision - Computer
    if (
        ball.x + ball.radius > computer.x &&
        ball.y > computer.y &&
        ball.y < computer.y + computer.height
    ) {
        ball.dx = -Math.abs(ball.dx);
        const deltaY = ball.y - (computer.y + computer.height / 2);
        ball.dy = (deltaY / (computer.height / 2)) * ball.speed;
        ball.x = computer.x - ball.radius;
    }

    // Scoring
    if (ball.x - ball.radius < 0) {
        computerScore++;
        computerScoreEl.textContent = computerScore;
        resetBall();
    }
    if (ball.x + ball.radius > canvas.width) {
        playerScore++;
        playerScoreEl.textContent = playerScore;
        resetBall();
    }
}

// Reset ball to center
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = (Math.random() > 0.5 ? 1 : -1) * ball.speed;
    ball.dy = (Math.random() - 0.5) * ball.speed;
}

// Draw functions
function drawPaddle(paddle) {
    ctx.fillStyle = '#00ff41';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.shadowColor = 'rgba(0, 255, 65, 0.8)';
    ctx.shadowBlur = 10;
}

function drawBall() {
    ctx.fillStyle = '#ffff00';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowColor = 'rgba(255, 255, 0, 0.8)';
    ctx.shadowBlur = 10;
}

function drawCenterLine() {
    ctx.strokeStyle = '#00ff41';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.shadowColor = 'transparent';

    // Draw center line
    drawCenterLine();

    // Draw paddles and ball
    drawPaddle(paddle);
    drawPaddle(computer);
    drawBall();
}

// Game loop
function gameLoop() {
    updatePlayerPaddle();
    updateComputerPaddle();
    updateBall();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();