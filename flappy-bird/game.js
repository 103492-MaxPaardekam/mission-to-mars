// Flappy Bird - AstroTech Mission to Mars
// With Menu System like Tetris and Tower Run

const FlappyApp = (function () {
  "use strict";

  // ============================================
  // Storage Manager
  // ============================================

  const StorageManager = {
    KEYS: {
      BEST_SCORE: "flappy_best_score",
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
    gameEl: null,
    pipesEl: null,

    birds: [],
    pipes: [],
    bird: null,

    running: false,
    paused: false,
    gameOver: false,
    score: 0,

    gameLoopId: null,

    init() {
      this.gameEl = document.getElementById("game");
      this.pipesEl = document.getElementById("pipes");
    },

    reset() {
      // Clear existing birds
      this.birds.forEach((bird) => {
        if (bird.sketch) bird.sketch.remove();
      });
      this.birds = [];

      // Clear existing pipes
      this.pipes.forEach((pipe) => {
        if (pipe.sketch) pipe.sketch.remove();
      });
      this.pipes = [];

      this.bird = null;
      this.score = 0;
      this.gameOver = false;

      UIController.updateScore(0);
      UIController.updateHighScore(StorageManager.getBestScore());
    },

    start() {
      this.reset();
      this.running = true;
      this.paused = false;

      // Create bird
      this.bird = this.createBird();

      // Create initial pipes
      for (let i = 0; i < 4; i++) {
        this.createPipe({ initial: true });
      }

      // Start game loop
      this.gameLoop();
    },

    createBird() {
      const bird = {
        x: 100,
        y: 200,
        velocity: 0,
        isFlapping: false,
        sketch: document.createElement("div"),
      };

      bird.sketch.classList.add("bird");
      bird.sketch.style.left = bird.x + "px";
      bird.sketch.style.top = bird.y + "px";
      this.gameEl.appendChild(bird.sketch);

      this.birds.push(bird);
      return bird;
    },

    createPipe(options) {
      const gameHeight = 500;
      const passageHeight = 160;
      const minTop = 50;
      const maxTop = gameHeight - passageHeight - 50;

      const passageY = Math.random() * (maxTop - minTop) + minTop;

      const pipe = {
        x: options?.initial
          ? this.pipes.length * 300 + 600
          : this.pipes.length > 0
            ? this.pipes[this.pipes.length - 1].x + 300
            : 600,
        passageY: passageY,
        passed: false,
        sketch: document.createElement("div"),
      };

      pipe.sketch.classList.add("pipe");

      const topPipe = document.createElement("div");
      const passage = document.createElement("div");
      const bottomPipe = document.createElement("div");

      topPipe.classList.add("collision");
      topPipe.style.height = passageY + "px";

      passage.classList.add("passage");
      passage.style.height = passageHeight + "px";

      bottomPipe.classList.add("collision");
      bottomPipe.style.height = gameHeight - passageY - passageHeight + "px";

      pipe.sketch.appendChild(topPipe);
      pipe.sketch.appendChild(passage);
      pipe.sketch.appendChild(bottomPipe);

      pipe.sketch.style.left = pipe.x + "px";
      pipe.sketch.style.top = "0px";

      this.pipesEl.appendChild(pipe.sketch);
      this.pipes.push(pipe);

      return pipe;
    },

    flap() {
      if (!this.bird || this.paused || this.gameOver) return;

      this.bird.velocity = -8;
      this.bird.isFlapping = true;
      this.bird.sketch.classList.add("flapping");
      this.bird.sketch.classList.remove("falling");

      setTimeout(() => {
        if (this.bird) {
          this.bird.isFlapping = false;
          this.bird.sketch.classList.remove("flapping");
        }
      }, 150);
    },

    gameLoop() {
      if (!this.running) return;

      if (!this.paused && !this.gameOver) {
        this.update();
      }

      this.gameLoopId = requestAnimationFrame(() => this.gameLoop());
    },

    update() {
      if (!this.bird) return;

      // Apply gravity
      this.bird.velocity += 0.7;
      this.bird.y += this.bird.velocity;

      // Update bird visual
      this.bird.sketch.style.top = this.bird.y + "px";

      if (this.bird.velocity > 2) {
        this.bird.sketch.classList.add("falling");
      } else {
        this.bird.sketch.classList.remove("falling");
      }

      // Check boundaries
      if (this.bird.y < 0) {
        this.bird.y = 0;
        this.bird.velocity = 0;
      }

      if (this.bird.y > 460) {
        this.endGame();
        return;
      }

      // Update pipes
      const speed = 6 + Math.floor(this.score / 10) * 0.5; // Speed increases with score

      for (let i = this.pipes.length - 1; i >= 0; i--) {
        const pipe = this.pipes[i];
        pipe.x -= speed;
        pipe.sketch.style.left = pipe.x + "px";

        // Check if bird passed pipe
        if (!pipe.passed && pipe.x + 80 < this.bird.x) {
          pipe.passed = true;
          this.score++;
          UIController.updateScore(this.score);
        }

        // Remove off-screen pipes
        if (pipe.x < -100) {
          pipe.sketch.remove();
          this.pipes.splice(i, 1);
        }

        // Collision detection
        if (this.checkCollision(this.bird, pipe)) {
          this.endGame();
          return;
        }
      }

      // Add new pipes
      if (this.pipes.length < 4) {
        this.createPipe();
      }
    },

    checkCollision(bird, pipe) {
      const birdLeft = bird.x;
      const birdRight = bird.x + 50;
      const birdTop = bird.y;
      const birdBottom = bird.y + 40;

      const pipeLeft = pipe.x;
      const pipeRight = pipe.x + 80;
      const passageTop = pipe.passageY;
      const passageBottom = pipe.passageY + 160;

      // Check if bird is within pipe x range
      if (birdRight > pipeLeft && birdLeft < pipeRight) {
        // Check if bird is outside passage
        if (birdTop < passageTop || birdBottom > passageBottom) {
          return true;
        }
      }

      return false;
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

      // Mouse/touch controls for flapping
      document.getElementById("game").addEventListener("pointerdown", (e) => {
        if (this.state === "playing" && !GameEngine.paused) {
          e.preventDefault();
          GameEngine.flap();
        }
      });
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

      // Flap controls
      if (
        (e.code === "Space" || e.code === "KeyW") &&
        this.state === "playing" &&
        !GameEngine.paused
      ) {
        e.preventDefault();
        GameEngine.flap();
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
    console.log("Flappy Bird initialized");
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
