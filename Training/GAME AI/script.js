// Game variables
const canvas = document.getElementById('game-board');
const ctx = canvas.getContext('2d');
const snakeSize = 20; // Size of each snake block
let snake = [{ x: 200, y: 200 }]; // Snake starts with one block
let food = {};
let score = 0;
let direction = 'RIGHT'; // Default direction
let gameInterval;
let gameOver = false;

// Directions for the snake movement
const directions = {
  'UP': { x: 0, y: -snakeSize },
  'DOWN': { x: 0, y: snakeSize },
  'LEFT': { x: -snakeSize, y: 0 },
  'RIGHT': { x: snakeSize, y: 0 }
};

// Start the game
function startGame() {
  snake = [{ x: 200, y: 200 }]; // Reset snake position
  score = 0;
  direction = 'RIGHT'; // Reset direction
  gameOver = false;
  updateScore();
  clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, 100); // Game loop every 100ms
  spawnFood();
}

// Game loop function
function gameLoop() {
  if (gameOver) {
    clearInterval(gameInterval);
    document.getElementById('score').innerText = `Game Over! Final Score: ${score}`;
    return;
  }

  moveSnake();
  checkCollisions();
  drawGame();
}

// Handle snake movement
function moveSnake() {
  const head = { ...snake[0] };
  head.x += directions[direction].x;
  head.y += directions[direction].y;
  snake.unshift(head);

  // If snake eats food, grow the snake and increase score
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    spawnFood(); // Respawn food at a new location
  } else {
    snake.pop(); // Remove the tail if snake doesn't eat food
  }
}

// Draw everything on the canvas
function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous frames

  // Draw the grass field background (simple green)
  ctx.fillStyle = '#228B22'; // Grass green
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw snake (each block)
  for (let i = 0; i < snake.length; i++) {
    const segment = snake[i];
    ctx.fillStyle = i === 0 ? '#006400' : '#008000'; // Dark green for head, lighter for body
    ctx.fillRect(segment.x, segment.y, snakeSize, snakeSize);
    ctx.strokeStyle = '#004d00'; // Darker green border for each segment
    ctx.lineWidth = 2;
    ctx.strokeRect(segment.x, segment.y, snakeSize, snakeSize);
  }

  // Draw food (apple-like appearance)
  ctx.fillStyle = 'red'; // Apple color
  ctx.beginPath();
  ctx.arc(food.x + snakeSize / 2, food.y + snakeSize / 2, snakeSize / 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'darkred'; // Border of the apple
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Update score
  updateScore();
}

// Update the score display
function updateScore() {
  document.getElementById('score').innerText = `Score: ${score}`;
}

// Generate new food at a random location
function spawnFood() {
  const x = Math.floor(Math.random() * (canvas.width / snakeSize)) * snakeSize;
  const y = Math.floor(Math.random() * (canvas.height / snakeSize)) * snakeSize;
  food = { x, y };
}

// Handle key press for snake movement
document.addEventListener('keydown', (e) => {
  if (gameOver) return;

  // Change direction based on arrow key press
  if (e.key === 'ArrowUp' && direction !== 'DOWN') {
    direction = 'UP';
  } else if (e.key === 'ArrowDown' && direction !== 'UP') {
    direction = 'DOWN';
  } else if (e.key === 'ArrowLeft' && direction !== 'RIGHT') {
    direction = 'LEFT';
  } else if (e.key === 'ArrowRight' && direction !== 'LEFT') {
    direction = 'RIGHT';
  }
});

// Check for collisions with walls or the snake itself
function checkCollisions() {
  const head = snake[0];

  // Collision with walls
  if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
    gameOver = true;
    return;
  }

  // Collision with snake itself
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      gameOver = true;
      return;
    }
  }
}

// Start the game on load
startGame();
