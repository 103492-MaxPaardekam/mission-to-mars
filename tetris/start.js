// Tetris Game with Menu System - AstroTech
// Mission to Mars Project

const TetrisApp = (function () {
  "use strict";

  // ============================================
  // Storage Manager
  // ============================================

  const StorageManager = {
    KEYS: {
      BEST_SCORE: "tetris_best_score",
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
          return true; // New best!
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

    showGameOver(score, level, lines, isNewBest) {
      document.getElementById("final-score").textContent = score;
      document.getElementById("final-level").textContent = level;
      document.getElementById("final-lines").textContent = lines;

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
    context: null,
    previewCanvas: null,
    previewContext: null,
    holdCanvas: null,
    holdContext: null,

    // Game state
    running: false,
    paused: false,
    board: null,
    currentPiece: null,
    currentPiecePos: { x: 0, y: 0 },
    currentColor: "",
    currentPieceIndex: 0,
    nextPiece: null,
    nextColor: "",
    nextPieceIndex: 0,
    holdPiece: null,
    holdColor: "",
    holdPieceIndex: -1,
    canHold: true,

    // Stats
    score: 0,
    level: 1,
    linesCleared: 0,

    // Timing
    dropCounter: 0,
    lastTime: 0,
    dropInterval: 1000,
    animationId: null,

    // Constants
    blockSize: 20,
    cols: 12,
    rows: 20,

    pieces: [
      [[1, 1, 1, 1]], // I
      [
        [1, 1],
        [1, 1],
      ], // O
      [
        [1, 1, 1],
        [0, 1, 0],
      ], // T
      [
        [1, 1, 1],
        [1, 0, 0],
      ], // L
      [
        [1, 1, 1],
        [0, 0, 1],
      ], // J
      [
        [1, 1, 0],
        [0, 1, 1],
      ], // S
      [
        [0, 1, 1],
        [1, 1, 0],
      ], // Z
    ],

    colors: [
      "#FF0D72",
      "#0DC2FF",
      "#0DFF72",
      "#F538FF",
      "#FF8E0D",
      "#FFE138",
      "#3877FF",
    ],

    init() {
      this.canvas = document.getElementById("tetris");
      this.context = this.canvas.getContext("2d");
      this.previewCanvas = document.getElementById("preview");
      this.previewContext = this.previewCanvas.getContext("2d");
      this.holdCanvas = document.getElementById("hold");
      this.holdContext = this.holdCanvas.getContext("2d");

      this.cols = this.canvas.width / this.blockSize;
      this.rows = this.canvas.height / this.blockSize;
    },

    reset() {
      this.board = Array(this.rows)
        .fill()
        .map(() => Array(this.cols).fill(0));
      this.score = 0;
      this.level = 1;
      this.linesCleared = 0;
      this.currentPiece = null;
      this.nextPiece = null;
      this.holdPiece = null;
      this.holdColor = "";
      this.holdPieceIndex = -1;
      this.canHold = true;
      this.dropCounter = 0;
      this.lastTime = 0;

      document.getElementById("score").textContent = "0";
      document.getElementById("level").textContent = "1";

      this.drawHold();
    },

    start() {
      this.reset();
      this.running = true;
      this.paused = false;
      this.createPiece();
      this.lastTime = performance.now();
      this.update();
    },

    pause() {
      this.paused = true;
    },

    resume() {
      this.paused = false;
      this.lastTime = performance.now();
      this.update();
    },

    stop() {
      this.running = false;
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
      }
    },

    createPiece() {
      if (this.nextPiece === null) {
        this.nextPieceIndex = Math.floor(Math.random() * this.pieces.length);
        this.nextPiece = this.pieces[this.nextPieceIndex];
        this.nextColor = this.colors[this.nextPieceIndex];
      }

      this.currentPiece = this.nextPiece;
      this.currentColor = this.nextColor;
      this.currentPieceIndex = this.nextPieceIndex;

      const pieceIndex = Math.floor(Math.random() * this.pieces.length);
      this.nextPiece = this.pieces[pieceIndex];
      this.nextColor = this.colors[pieceIndex];
      this.nextPieceIndex = pieceIndex;

      this.currentPiecePos = {
        x: Math.floor((this.cols - this.currentPiece[0].length) / 2),
        y: 0,
      };

      this.canHold = true;
      this.drawPreview();
      this.drawHold();
    },

    drawPieceOnCanvas(context, piece, color, canvas) {
      const previewBlockSize = 20;
      const offsetX = (canvas.width - piece[0].length * previewBlockSize) / 2;
      const offsetY = (canvas.height - piece.length * previewBlockSize) / 2;

      context.fillStyle = color;
      piece.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value) {
            context.fillRect(
              offsetX + x * previewBlockSize,
              offsetY + y * previewBlockSize,
              previewBlockSize - 1,
              previewBlockSize - 1,
            );
          }
        });
      });
    },

    drawPreview() {
      this.previewContext.fillStyle = "#000";
      this.previewContext.fillRect(
        0,
        0,
        this.previewCanvas.width,
        this.previewCanvas.height,
      );
      if (this.nextPiece) {
        this.drawPieceOnCanvas(
          this.previewContext,
          this.nextPiece,
          this.nextColor,
          this.previewCanvas,
        );
      }
    },

    drawHold() {
      this.holdContext.fillStyle = "#000";
      this.holdContext.fillRect(
        0,
        0,
        this.holdCanvas.width,
        this.holdCanvas.height,
      );
      if (this.holdPiece) {
        this.drawPieceOnCanvas(
          this.holdContext,
          this.holdPiece,
          this.holdColor,
          this.holdCanvas,
        );
      }
    },

    holdCurrentPiece() {
      if (!this.canHold) return;

      if (this.holdPiece === null) {
        this.holdPiece = this.currentPiece;
        this.holdColor = this.currentColor;
        this.holdPieceIndex = this.currentPieceIndex;
        this.createPiece();
      } else {
        const tempPiece = this.currentPiece;
        const tempColor = this.currentColor;
        const tempIndex = this.currentPieceIndex;

        this.currentPiece = this.holdPiece;
        this.currentColor = this.holdColor;
        this.currentPieceIndex = this.holdPieceIndex;

        this.holdPiece = tempPiece;
        this.holdColor = tempColor;
        this.holdPieceIndex = tempIndex;

        this.currentPiecePos = {
          x: Math.floor((this.cols - this.currentPiece[0].length) / 2),
          y: 0,
        };
      }

      this.canHold = false;
      this.drawHold();
    },

    collide(piece = this.currentPiece, pos = this.currentPiecePos) {
      for (let y = 0; y < piece.length; y++) {
        for (let x = 0; x < piece[y].length; x++) {
          if (piece[y][x]) {
            const boardX = pos.x + x;
            const boardY = pos.y + y;

            if (
              boardX < 0 ||
              boardX >= this.cols ||
              boardY >= this.rows ||
              (boardY >= 0 && this.board[boardY][boardX])
            ) {
              return true;
            }
          }
        }
      }
      return false;
    },

    getGhostPosition() {
      const ghostPos = { ...this.currentPiecePos };
      while (
        !this.collide(this.currentPiece, { ...ghostPos, y: ghostPos.y + 1 })
      ) {
        ghostPos.y++;
      }
      return ghostPos;
    },

    rotate() {
      const rotated = this.currentPiece[0].map((_, i) =>
        this.currentPiece.map((row) => row[i]).reverse(),
      );
      const prevPiece = this.currentPiece;
      this.currentPiece = rotated;
      if (this.collide()) {
        this.currentPiece = prevPiece;
      }
    },

    merge() {
      this.currentPiece.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value) {
            const boardY = this.currentPiecePos.y + y;
            if (boardY >= 0) {
              this.board[boardY][this.currentPiecePos.x + x] =
                this.currentColor;
            }
          }
        });
      });
    },

    clearLines() {
      let lines = 0;
      outer: for (let y = this.rows - 1; y >= 0; y--) {
        for (let x = 0; x < this.cols; x++) {
          if (!this.board[y][x]) continue outer;
        }

        const row = this.board.splice(y, 1)[0];
        this.board.unshift(row.fill(0));
        y++;
        lines++;
      }
      if (lines > 0) {
        this.linesCleared += lines;
        this.score += lines * 100 * this.level;
        document.getElementById("score").textContent = this.score;

        const newLevel = Math.floor(this.linesCleared / 10) + 1;
        if (newLevel !== this.level) {
          this.level = newLevel;
          document.getElementById("level").textContent = this.level;
        }
      }
    },

    draw() {
      const ctx = this.context;

      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      // Draw board
      this.board.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value) {
            ctx.fillStyle = value;
            ctx.fillRect(
              x * this.blockSize,
              y * this.blockSize,
              this.blockSize - 1,
              this.blockSize - 1,
            );
          }
        });
      });

      // Draw ghost piece
      if (this.currentPiece) {
        const ghostPos = this.getGhostPosition();
        ctx.fillStyle = `${this.currentColor}33`;
        this.currentPiece.forEach((row, y) => {
          row.forEach((value, x) => {
            if (value) {
              ctx.fillRect(
                (ghostPos.x + x) * this.blockSize,
                (ghostPos.y + y) * this.blockSize,
                this.blockSize - 1,
                this.blockSize - 1,
              );
            }
          });
        });
      }

      // Draw current piece
      if (this.currentPiece) {
        ctx.fillStyle = this.currentColor;
        this.currentPiece.forEach((row, y) => {
          row.forEach((value, x) => {
            if (value) {
              ctx.fillRect(
                (this.currentPiecePos.x + x) * this.blockSize,
                (this.currentPiecePos.y + y) * this.blockSize,
                this.blockSize - 1,
                this.blockSize - 1,
              );
            }
          });
        });
      }
    },

    update(time = 0) {
      if (!this.running || this.paused) return;

      const deltaTime = time - this.lastTime;
      this.lastTime = time;
      this.dropCounter += deltaTime;

      this.dropInterval = Math.max(100, 1000 - (this.level - 1) * 100);

      if (this.dropCounter > this.dropInterval) {
        this.drop();
      }

      this.draw();
      this.animationId = requestAnimationFrame((t) => this.update(t));
    },

    drop() {
      this.currentPiecePos.y++;
      if (this.collide()) {
        this.currentPiecePos.y--;
        this.merge();
        this.clearLines();
        this.createPiece();
        if (this.collide()) {
          // Game Over
          this.gameOver();
          return;
        }
      }
      this.dropCounter = 0;
    },

    gameOver() {
      this.running = false;
      const isNewBest = StorageManager.setBestScore(this.score);
      UIController.updateMenuBestScore(StorageManager.getBestScore());
      UIController.showGameOver(
        this.score,
        this.level,
        this.linesCleared,
        isNewBest,
      );
    },

    moveLeft() {
      if (!this.currentPiece || this.paused) return;
      this.currentPiecePos.x--;
      if (this.collide()) this.currentPiecePos.x++;
    },

    moveRight() {
      if (!this.currentPiece || this.paused) return;
      this.currentPiecePos.x++;
      if (this.collide()) this.currentPiecePos.x--;
    },

    hardDrop() {
      if (!this.currentPiece || this.paused) return;
      while (!this.collide()) {
        this.currentPiecePos.y++;
      }
      this.currentPiecePos.y--;
      this.drop();
    },
  };

  // ============================================
  // Game Manager
  // ============================================

  const GameManager = {
    state: "menu", // menu, howto, playing, paused, gameover

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

      // Touch controls
      this.bindTouchControls();
    },

    bindTouchControls() {
      const buttons = document.querySelectorAll("#touch-controls button");

      buttons.forEach((btn) => {
        const handleAction = (e) => {
          e.preventDefault();
          if (this.state !== "playing") return;

          const action = btn.getAttribute("data-action");

          switch (action) {
            case "left":
              GameEngine.moveLeft();
              break;
            case "right":
              GameEngine.moveRight();
              break;
            case "rotate":
              GameEngine.rotate();
              break;
            case "down":
              GameEngine.drop();
              break;
            case "hard":
              GameEngine.hardDrop();
              break;
            case "hold":
              GameEngine.holdCurrentPiece();
              break;
          }
        };

        btn.addEventListener("touchstart", handleAction);
        btn.addEventListener("click", handleAction);
      });
    },

    handleKeyDown(e) {
      // Escape to pause/resume
      if (e.code === "Escape") {
        if (this.state === "playing") {
          this.pauseGame();
        } else if (this.state === "paused") {
          this.resumeGame();
        }
        return;
      }

      if (this.state !== "playing") return;

      switch (e.keyCode) {
        case 37: // Left
          GameEngine.moveLeft();
          break;
        case 39: // Right
          GameEngine.moveRight();
          break;
        case 40: // Down
          GameEngine.drop();
          break;
        case 38: // Up (rotate)
          GameEngine.rotate();
          break;
        case 32: // Space (hard drop)
          GameEngine.hardDrop();
          break;
        case 16: // Shift (hold)
          GameEngine.holdCurrentPiece();
          break;
      }
    },

    startGame() {
      this.state = "playing";
      UIController.showScreen("game");
      UIController.hideAllOverlays();
      GameEngine.start();
    },

    pauseGame() {
      if (this.state !== "playing") return;
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
    console.log("Tetris initialized");
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
