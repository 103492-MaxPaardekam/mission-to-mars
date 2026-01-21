// Snake - AstroTech Mission to Mars
// With Menu System like Tetris, Tower Run, and Flappy Bird

const SnakeApp = (function () {
  "use strict";

  // ============================================
  // Storage Manager
  // ============================================

  const StorageManager = {
    KEYS: {
      BEST_SCORE: "snake_best_score",
    },

    getBestScore() {
      try {
        return parseInt(localStorage.getItem(this.KEYS.BEST_SCORE)) || 0;
      } catch (e) {
        return 0;
      }
    },

    setBestScore(score) {
      try {
        const current = this.getBestScore();
        if (score > current) {
          localStorage.setItem(this.KEYS.BEST_SCORE, score);
          return true;
        }
        return false;
      } catch (e) {
        return false;
      }
    },
  };

  // ============================================
  // UI Controller
  // ============================================

  const UIController = {
    screens: {},
    overlays: {},

    init() {
      this.screens = {
        menu: document.getElementById("screen-menu"),
        howto: document.getElementById("screen-howto"),
        game: document.getElementById("screen-game"),
      };

      this.overlays = {
        pause: document.getElementById("overlay-pause"),
        gameover: document.getElementById("overlay-gameover"),
      };
    },

    showScreen(screenName) {
      Object.values(this.screens).forEach((screen) => {
        screen.classList.remove("active");
      });

      const screen = this.screens[screenName];
      if (screen) {
        screen.classList.add("active");
      }
    },

    showOverlay(overlayName) {
      const overlay = this.overlays[overlayName];
      if (overlay) {
        overlay.classList.add("active");
      }
    },

    hideOverlay(overlayName) {
      const overlay = this.overlays[overlayName];
      if (overlay) {
        overlay.classList.remove("active");
      }
    },

    hideAllOverlays() {
      Object.values(this.overlays).forEach((overlay) => {
        overlay.classList.remove("active");
      });
    },

    updateMenuBestScore(score) {
      document.getElementById("menu-best-score").textContent = score;
    },

    updateScore(score) {
      document.getElementById("score").textContent = score;
    },

    updateHighScore(score) {
      document.getElementById("high_score").textContent = score;
    },

    updateLength(length) {
      document.getElementById("length").textContent = length;
    },

    showGameOver(score, isNewBest) {
      document.getElementById("final-score").textContent = score;

      const newHighscoreEl = document.getElementById("new-highscore");
      if (isNewBest) {
        newHighscoreEl.classList.remove("hidden");
      } else {
        newHighscoreEl.classList.add("hidden");
      }

      this.showOverlay("gameover");
    },
  };

  // ============================================
  // Game Engine
  // ============================================

  const GameEngine = {
    canvas: null,
    ctx: null,

    grid: 16,
    canvasSize: 400,

    snake: null,
    apple: null,

    running: false,
    paused: false,
    gameOver: false,
    score: 0,

    frameCount: 0,
    gameLoopId: null,

    // Colors matching AstroTech theme
    colors: {
      snakeHead: "#33afff",
      snakeBody: "#6b4cff",
      apple: "#10b981",
      grid: "rgba(51, 175, 255, 0.1)",
    },

    init() {
      this.canvas = document.getElementById("game");
      this.ctx = this.canvas.getContext("2d");
    },

    reset() {
      this.snake = {
        x: 160,
        y: 160,
        dx: this.grid,
        dy: 0,
        cells: [],
        maxCells: 4,
      };

      this.apple = {
        x: this.getRandomInt(0, 25) * this.grid,
        y: this.getRandomInt(0, 25) * this.grid,
      };

      this.score = 0;
      this.gameOver = false;
      this.frameCount = 0;

      UIController.updateScore(0);
      UIController.updateHighScore(StorageManager.getBestScore());
      UIController.updateLength(4);
    },

    getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    },

    start() {
      this.reset();
      this.running = true;
      this.paused = false;
      this.gameLoop();
    },

    gameLoop() {
      if (!this.running) return;

      this.gameLoopId = requestAnimationFrame(() => this.gameLoop());

      if (this.paused || this.gameOver) return;

      // Slow game loop to ~10 fps (slower movement)
      if (++this.frameCount < 6) {
        return;
      }
      this.frameCount = 0;

      this.update();
      this.draw();
    },

    update() {
      // Move snake
      this.snake.x += this.snake.dx;
      this.snake.y += this.snake.dy;

      // Wrap snake position on edges
      if (this.snake.x < 0) {
        this.snake.x = this.canvasSize - this.grid;
      } else if (this.snake.x >= this.canvasSize) {
        this.snake.x = 0;
      }

      if (this.snake.y < 0) {
        this.snake.y = this.canvasSize - this.grid;
      } else if (this.snake.y >= this.canvasSize) {
        this.snake.y = 0;
      }

      // Track snake positions
      this.snake.cells.unshift({ x: this.snake.x, y: this.snake.y });

      // Remove tail
      if (this.snake.cells.length > this.snake.maxCells) {
        this.snake.cells.pop();
      }

      // Check apple collision
      if (this.snake.x === this.apple.x && this.snake.y === this.apple.y) {
        this.snake.maxCells++;
        this.score += 10;
        UIController.updateScore(this.score);
        UIController.updateLength(this.snake.maxCells);

        // New apple position
        this.apple.x = this.getRandomInt(0, 25) * this.grid;
        this.apple.y = this.getRandomInt(0, 25) * this.grid;
      }

      // Check self collision (skip head)
      for (let i = 1; i < this.snake.cells.length; i++) {
        if (
          this.snake.cells[0].x === this.snake.cells[i].x &&
          this.snake.cells[0].y === this.snake.cells[i].y
        ) {
          this.endGame();
          return;
        }
      }
    },

    draw() {
      // Clear canvas
      this.ctx.clearRect(0, 0, this.canvasSize, this.canvasSize);

      // Draw grid
      this.ctx.strokeStyle = this.colors.grid;
      this.ctx.lineWidth = 1;
      for (let i = 0; i <= this.canvasSize; i += this.grid) {
        this.ctx.beginPath();
        this.ctx.moveTo(i, 0);
        this.ctx.lineTo(i, this.canvasSize);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(0, i);
        this.ctx.lineTo(this.canvasSize, i);
        this.ctx.stroke();
      }

      // Draw apple with glow
      this.ctx.shadowColor = this.colors.apple;
      this.ctx.shadowBlur = 15;
      this.ctx.fillStyle = this.colors.apple;
      this.ctx.beginPath();
      this.ctx.arc(
        this.apple.x + this.grid / 2,
        this.apple.y + this.grid / 2,
        this.grid / 2 - 2,
        0,
        Math.PI * 2,
      );
      this.ctx.fill();
      this.ctx.shadowBlur = 0;

      // Draw snake
      this.snake.cells.forEach((cell, index) => {
        // Head is brighter
        if (index === 0) {
          this.ctx.shadowColor = this.colors.snakeHead;
          this.ctx.shadowBlur = 10;
          this.ctx.fillStyle = this.colors.snakeHead;
        } else {
          this.ctx.shadowBlur = 5;
          // Gradient from head to tail
          const alpha = 1 - (index / this.snake.cells.length) * 0.5;
          this.ctx.fillStyle = `rgba(107, 76, 255, ${alpha})`;
        }

        // Draw rounded rectangle for each cell
        this.roundRect(
          this.ctx,
          cell.x + 1,
          cell.y + 1,
          this.grid - 2,
          this.grid - 2,
          4,
        );
        this.ctx.fill();
      });

      this.ctx.shadowBlur = 0;
    },

    roundRect(ctx, x, y, width, height, radius) {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(
        x + width,
        y + height,
        x + width - radius,
        y + height,
      );
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
    },

    setDirection(dx, dy) {
      // Prevent reversing
      if (dx !== 0 && this.snake.dx === 0) {
        this.snake.dx = dx;
        this.snake.dy = 0;
      } else if (dy !== 0 && this.snake.dy === 0) {
        this.snake.dy = dy;
        this.snake.dx = 0;
      }
    },

    endGame() {
      this.gameOver = true;
      this.running = false;

      if (this.gameLoopId) {
        cancelAnimationFrame(this.gameLoopId);
      }

      const isNewBest = StorageManager.setBestScore(this.score);
      UIController.updateMenuBestScore(StorageManager.getBestScore());
      UIController.showGameOver(this.score, isNewBest);
    },

    pause() {
      this.paused = true;
    },

    resume() {
      this.paused = false;
    },

    stop() {
      this.running = false;
      this.paused = false;

      if (this.gameLoopId) {
        cancelAnimationFrame(this.gameLoopId);
      }
    },
  };

  // ============================================
  // Game Manager
  // ============================================

  const GameManager = {
    state: "menu",

    init() {
      UIController.init();
      GameEngine.init();
      this.bindEvents();
      UIController.updateMenuBestScore(StorageManager.getBestScore());
      UIController.showScreen("menu");
    },

    bindEvents() {
      // Menu buttons
      document.getElementById("btn-start").addEventListener("click", () => {
        this.startGame();
      });

      document.getElementById("btn-howto").addEventListener("click", () => {
        this.state = "howto";
        UIController.showScreen("howto");
      });

      document
        .getElementById("btn-back-games")
        .addEventListener("click", () => {
          window.location.href = "/games.html";
        });

      document
        .getElementById("btn-howto-back")
        .addEventListener("click", () => {
          this.state = "menu";
          UIController.showScreen("menu");
        });

      // Pause button
      document.getElementById("btn-pause").addEventListener("click", () => {
        this.pauseGame();
      });

      // Pause overlay
      document.getElementById("btn-resume").addEventListener("click", () => {
        this.resumeGame();
      });

      document.getElementById("btn-restart").addEventListener("click", () => {
        UIController.hideAllOverlays();
        this.startGame();
      });

      document.getElementById("btn-quit").addEventListener("click", () => {
        this.quitToMenu();
      });

      // Game over overlay
      document
        .getElementById("btn-play-again")
        .addEventListener("click", () => {
          UIController.hideAllOverlays();
          this.startGame();
        });

      document.getElementById("btn-to-menu").addEventListener("click", () => {
        this.quitToMenu();
      });

      // Keyboard controls
      document.addEventListener("keydown", (e) => this.handleKeyDown(e));
    },

    handleKeyDown(e) {
      // Escape to pause/resume
      if (e.code === "Escape") {
        if (this.state === "playing" && !GameEngine.gameOver) {
          this.pauseGame();
        } else if (this.state === "paused") {
          this.resumeGame();
        }
        return;
      }

      // Movement controls
      if (this.state === "playing" && !GameEngine.paused) {
        const grid = GameEngine.grid;

        // Arrow keys
        if (e.which === 37 || e.code === "KeyA") {
          e.preventDefault();
          GameEngine.setDirection(-grid, 0);
        } else if (e.which === 38 || e.code === "KeyW") {
          e.preventDefault();
          GameEngine.setDirection(0, -grid);
        } else if (e.which === 39 || e.code === "KeyD") {
          e.preventDefault();
          GameEngine.setDirection(grid, 0);
        } else if (e.which === 40 || e.code === "KeyS") {
          e.preventDefault();
          GameEngine.setDirection(0, grid);
        }
      }
    },

    startGame() {
      this.state = "playing";
      UIController.showScreen("game");
      UIController.hideAllOverlays();
      GameEngine.start();
    },

    pauseGame() {
      if (this.state !== "playing" || GameEngine.gameOver) return;
      this.state = "paused";
      GameEngine.pause();
      UIController.showOverlay("pause");
    },

    resumeGame() {
      if (this.state !== "paused") return;
      this.state = "playing";
      UIController.hideOverlay("pause");
      GameEngine.resume();
    },

    quitToMenu() {
      GameEngine.stop();
      GameEngine.reset();
      UIController.hideAllOverlays();
      this.state = "menu";
      UIController.showScreen("menu");
    },
  };

  // ============================================
  // Initialize
  // ============================================

  function init() {
    GameManager.init();
    console.log("Snake initialized");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  return {
    GameManager,
    GameEngine,
    UIController,
    StorageManager,
  };
})();
