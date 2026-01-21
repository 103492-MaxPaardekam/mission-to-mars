/**
 * ============================================
 * AstroTech Tower Run - Main Application
 * ============================================
 *
 * A tower climb game with 8 tiers of skill-based challenges.
 * Built with vanilla JS, no external dependencies.
 *
 * Architecture:
 * - App: Main application controller
 * - RunManager: Game state machine
 * - FloorGenerator: Creates floor options per tier
 * - FloorEngine: Handles individual floor gameplay (Canvas)
 * - UIController: DOM manipulation and screen transitions
 * - AudioManager: Sound effects (placeholder)
 * - StorageManager: localStorage persistence
 *
 * TODO: Add more floor templates
 * TODO: Implement sound effects
 * TODO: Add particle effects system
 * TODO: Mobile touch controls
 */

const App = (function () {
  "use strict";

  // ============================================
  // Constants & Configuration
  // ============================================

  const CONFIG = {
    TIERS: 8,
    OPTIONS_PER_TIER: 3,
    BASE_FLOOR_TIME: 25, // seconds
    COUNTDOWN_DURATION: 3,

    // Difficulty scaling (multiplied by tier)
    DIFFICULTY: {
      speedBase: 1.0,
      speedScale: 0.2, // +20% per tier
      obstacleBase: 3,
      obstacleScale: 1.2,
      safeZoneBase: 80,
      safeZoneScale: -5, // shrinks per tier
      timingBase: 1000,
      timingScale: -75, // ms, tighter per tier
    },

    // Scoring
    SCORE: {
      basePerTier: 100,
      timeBonus: 10, // per second remaining
      noDamageBonus: 50,
      collectAllBonus: 25,
    },

    // Risk multipliers
    RISK_MULTIPLIERS: {
      safe: 1.0,
      moderate: 1.5,
      dangerous: 2.0,
    },
  };

  // Floor template definitions
  const FLOOR_TEMPLATES = [
    {
      id: "laser_lattice",
      name: "Laser Lattice",
      icon: "⚡",
      description: "Navigate timed laser patterns",
      mechanic: "dodge",
    },
    {
      id: "pulse_gates",
      name: "Pulse Gates",
      icon: "🚪",
      description: "Time movement through barriers",
      mechanic: "timing",
    },
    {
      id: "drift_drones",
      name: "Drift Drones",
      icon: "🤖",
      description: "Avoid roaming obstacles",
      mechanic: "dodge",
    },
    {
      id: "gravity_shift",
      name: "Gravity Shift",
      icon: "🌀",
      description: "Adapt to momentum changes",
      mechanic: "control",
    },
    {
      id: "arc_mines",
      name: "Arc Mines",
      icon: "💣",
      description: "Evade proximity triggers",
      mechanic: "dodge",
    },
    {
      id: "data_stream",
      name: "Data Stream",
      icon: "📡",
      description: "Collect data, avoid corruption",
      mechanic: "collect",
    },
    {
      id: "shield_matrix",
      name: "Shield Matrix",
      icon: "🛡️",
      description: "Destroy barriers quickly",
      mechanic: "destroy",
    },
    {
      id: "void_walker",
      name: "Void Walker",
      icon: "🌑",
      description: "Platform on vanishing tiles",
      mechanic: "platform",
    },
  ];

  // Risk level definitions with rewards
  const RISK_LEVELS = [
    {
      level: "safe",
      label: "Safe",
      multiplier: 1.0,
      rewards: ["+5 seconds", "Standard score"],
    },
    {
      level: "moderate",
      label: "Moderate",
      multiplier: 1.5,
      rewards: ["1.5x multiplier", "+Shield charge"],
    },
    {
      level: "dangerous",
      label: "Dangerous",
      multiplier: 2.0,
      rewards: ["2x multiplier", "+Time freeze"],
    },
  ];

  // ============================================
  // Storage Manager
  // ============================================

  const StorageManager = {
    KEYS: {
      BEST_SCORE: "towerrun_best_score",
      FASTEST_TIME: "towerrun_fastest_time",
      SETTINGS: "towerrun_settings",
    },

    get(key) {
      try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
      } catch (e) {
        console.warn("Storage read error:", e);
        return null;
      }
    },

    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.warn("Storage write error:", e);
      }
    },

    getBestScore() {
      return this.get(this.KEYS.BEST_SCORE) || 0;
    },

    setBestScore(score) {
      const current = this.getBestScore();
      if (score > current) {
        this.set(this.KEYS.BEST_SCORE, score);
        return true; // New best!
      }
      return false;
    },

    getSettings() {
      return (
        this.get(this.KEYS.SETTINGS) || {
          reduceMotion: false,
          sound: true,
          showFps: false,
        }
      );
    },

    setSettings(settings) {
      this.set(this.KEYS.SETTINGS, settings);
    },

    clearAll() {
      Object.values(this.KEYS).forEach((key) => {
        localStorage.removeItem(key);
      });
    },
  };

  // ============================================
  // UI Controller
  // ============================================

  const UIController = {
    screens: {},
    overlays: {},
    currentScreen: null,

    init() {
      // Cache screen elements
      this.screens = {
        menu: document.getElementById("screen-menu"),
        howto: document.getElementById("screen-howto"),
        settings: document.getElementById("screen-settings"),
        tower: document.getElementById("screen-tower"),
        game: document.getElementById("screen-game"),
        result: document.getElementById("screen-result"),
        summary: document.getElementById("screen-summary"),
        gameover: document.getElementById("screen-gameover"),
      };

      this.overlays = {
        pause: document.getElementById("overlay-pause"),
      };

      this.floorIntro = document.getElementById("floor-intro");
      this.fpsCounter = document.getElementById("fps-counter");
    },

    showScreen(screenName) {
      // Hide current screen
      Object.values(this.screens).forEach((screen) => {
        screen.classList.remove("active");
      });

      // Show new screen
      const screen = this.screens[screenName];
      if (screen) {
        screen.classList.add("active");
        this.currentScreen = screenName;
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

    showFloorIntro(show) {
      if (show) {
        this.floorIntro.classList.add("active");
      } else {
        this.floorIntro.classList.remove("active");
      }
    },

    updateFloorIntro(name, desc, countdown) {
      document.getElementById("intro-floor-name").textContent = name;
      document.getElementById("intro-floor-desc").textContent = desc;
      document.getElementById("intro-countdown").textContent = countdown;
    },

    setReduceMotion(enabled) {
      document.body.classList.toggle("reduce-motion", enabled);
    },

    showFps(show) {
      this.fpsCounter.classList.toggle("visible", show);
    },

    updateFps(fps) {
      this.fpsCounter.textContent = `${fps} FPS`;
    },

    // HUD updates
    updateHUD(data) {
      if (data.tier !== undefined) {
        document.getElementById("hud-tier").textContent = data.tier;
      }
      if (data.floor !== undefined) {
        document.getElementById("hud-floor").textContent = data.floor;
      }
      if (data.timer !== undefined) {
        const timerEl = document.getElementById("hud-timer");
        timerEl.textContent = data.timer.toFixed(1);

        const timerDisplay = timerEl.parentElement;
        timerDisplay.classList.remove("warning", "critical");
        if (data.timer <= 5) {
          timerDisplay.classList.add("critical");
        } else if (data.timer <= 10) {
          timerDisplay.classList.add("warning");
        }
      }
      if (data.score !== undefined) {
        document.getElementById("hud-score").textContent = data.score;
      }
    },

    // Tower map rendering
    renderTowerMap(currentTier, completedTiers, tierChoices) {
      const container = document.getElementById("tower-map");
      container.innerHTML = "";

      for (let tier = CONFIG.TIERS; tier >= 1; tier--) {
        const row = document.createElement("div");
        row.className = "tier-row";

        if (tier === currentTier) {
          row.classList.add("active");
        } else if (completedTiers.includes(tier)) {
          row.classList.add("completed");
        }

        // Tier indicator
        const indicator = document.createElement("div");
        indicator.className = "tier-indicator";
        indicator.textContent = `T${tier}`;
        row.appendChild(indicator);

        // Floor cards
        const options =
          tierChoices[tier] || FloorGenerator.generateTierOptions(tier);
        tierChoices[tier] = options;

        options.forEach((option, index) => {
          const card = this.createFloorCard(option, tier, index);
          row.appendChild(card);
        });

        container.appendChild(row);
      }

      return tierChoices;
    },

    createFloorCard(option, tier, index) {
      const card = document.createElement("div");
      card.className = "floor-card";
      card.dataset.tier = tier;
      card.dataset.index = index;

      const riskClass = `risk-${option.risk.level}`;

      card.innerHTML = `
        <div class="floor-card-header">
          <div class="floor-card-icon">${option.template.icon}</div>
          <span class="floor-card-risk ${riskClass}">${option.risk.label}</span>
        </div>
        <div class="floor-card-name">${option.template.name}</div>
        <div class="floor-card-desc">${option.template.description}</div>
        <div class="floor-card-reward">+${option.risk.multiplier}x score</div>
      `;

      return card;
    },

    markCardSelected(tier, index) {
      const cards = document.querySelectorAll(
        `.floor-card[data-tier="${tier}"]`,
      );
      cards.forEach((card, i) => {
        card.classList.toggle("selected", i === index);
      });
    },

    // Result screen
    updateResultScreen(data) {
      document.getElementById("result-title").textContent = data.success
        ? "Floor Complete!"
        : "Floor Failed";
      document
        .getElementById("result-title")
        .classList.toggle("failed", !data.success);
      document.getElementById("result-status").textContent = data.success
        ? "✓"
        : "✗";

      document.getElementById("result-base").textContent = data.baseScore;
      document.getElementById("result-time").textContent = `+${data.timeBonus}`;
      document.getElementById("result-performance").textContent =
        `+${data.performanceBonus}`;
      document.getElementById("result-multiplier").textContent =
        `×${data.multiplier.toFixed(1)}`;
      document.getElementById("result-total").textContent = data.total;

      document.getElementById("next-tier-num").textContent = data.nextTier;

      // Show rewards
      const rewardsContainer = document.getElementById("result-rewards");
      rewardsContainer.innerHTML = "";
      if (data.rewards && data.rewards.length > 0) {
        data.rewards.forEach((reward) => {
          const badge = document.createElement("div");
          badge.className = "reward-badge";
          badge.textContent = reward;
          rewardsContainer.appendChild(badge);
        });
      }
    },

    // Summary screen
    updateSummaryScreen(data) {
      document.getElementById("summary-score").textContent = data.score;
      document.getElementById("summary-floors").textContent =
        data.floorsCleared;
      document.getElementById("summary-time").textContent = data.totalTime;
      document.getElementById("summary-multiplier").textContent =
        `${data.highestMultiplier.toFixed(1)}x`;

      const bestComparison = document.getElementById("summary-best");
      bestComparison.classList.toggle("hidden", !data.isNewBest);
    },

    // Game over screen
    updateGameOverScreen(data) {
      document.getElementById("gameover-score").textContent = data.score;
      document.getElementById("gameover-tier").textContent = data.tier;
      document.getElementById("gameover-floors").textContent =
        data.floorsCleared;
    },

    // Menu best score
    updateMenuBestScore(score) {
      document.getElementById("menu-best-score").textContent = score;
    },

    // Tower stats
    updateTowerStats(score, multiplier) {
      document.getElementById("tower-score").textContent = score;
      document.getElementById("tower-multiplier").textContent =
        `${multiplier.toFixed(1)}x`;
    },
  };

  // ============================================
  // Floor Generator
  // ============================================

  const FloorGenerator = {
    generateTierOptions(tier) {
      // Shuffle templates and pick 3 unique ones
      const shuffled = [...FLOOR_TEMPLATES].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, CONFIG.OPTIONS_PER_TIER);

      // Assign risk levels (ensure variety)
      const riskLevels = [...RISK_LEVELS].sort(() => Math.random() - 0.5);

      return selected.map((template, index) => ({
        template,
        risk: riskLevels[index],
        tier,
        difficulty: this.calculateDifficulty(tier, riskLevels[index]),
      }));
    },

    calculateDifficulty(tier, risk) {
      const d = CONFIG.DIFFICULTY;
      const riskMultiplier = risk.multiplier;

      return {
        speed: (d.speedBase + (tier - 1) * d.speedScale) * riskMultiplier,
        obstacleCount: Math.floor(
          (d.obstacleBase + (tier - 1) * d.obstacleScale) * riskMultiplier,
        ),
        safeZone: Math.max(
          30,
          d.safeZoneBase + ((tier - 1) * d.safeZoneScale) / riskMultiplier,
        ),
        timingWindow: Math.max(
          300,
          d.timingBase + ((tier - 1) * d.timingScale) / riskMultiplier,
        ),
        floorTime: CONFIG.BASE_FLOOR_TIME - (tier - 1) * 1.5,
      };
    },
  };

  // ============================================
  // Floor Engine (Canvas Game)
  // ============================================

  const FloorEngine = {
    canvas: null,
    ctx: null,
    animationId: null,
    running: false,
    paused: false,

    // Game state
    player: null,
    obstacles: [],
    collectibles: [],
    floorData: null,

    // Timing
    lastTime: 0,
    deltaTime: 0,
    timeRemaining: 0,

    // Performance
    frameCount: 0,
    fpsTime: 0,
    currentFps: 60,

    // Results
    damageTaken: 0,
    itemsCollected: 0,
    totalItems: 0,

    // Input state
    keys: {},

    init() {
      this.canvas = document.getElementById("game-canvas");
      this.ctx = this.canvas.getContext("2d");

      // Handle resize
      this.resize();
      window.addEventListener("resize", () => this.resize());

      // Input handlers
      window.addEventListener("keydown", (e) => this.handleKeyDown(e));
      window.addEventListener("keyup", (e) => this.handleKeyUp(e));
    },

    resize() {
      const container = this.canvas.parentElement;
      this.canvas.width = container.clientWidth;
      this.canvas.height = container.clientHeight - 70; // Account for HUD
    },

    handleKeyDown(e) {
      this.keys[e.code] = true;

      if (e.code === "Escape" && this.running && !this.paused) {
        RunManager.pauseGame();
      }
    },

    handleKeyUp(e) {
      this.keys[e.code] = false;
    },

    startFloor(floorData, onComplete) {
      this.floorData = floorData;
      this.onComplete = onComplete;

      // Reset state
      this.damageTaken = 0;
      this.itemsCollected = 0;
      this.totalItems = 0;
      this.obstacles = [];
      this.collectibles = [];
      this.timeRemaining = floorData.difficulty.floorTime;

      // Initialize player
      this.player = {
        x: this.canvas.width / 2,
        y: this.canvas.height - 100,
        width: 40,
        height: 40,
        speed: 300 * floorData.difficulty.speed,
        color: "#33AFFF",
      };

      // Generate obstacles/collectibles based on floor type
      this.generateFloorContent();

      // Start game loop
      this.running = true;
      this.paused = false;
      this.lastTime = performance.now();
      this.loop();
    },

    generateFloorContent() {
      const { template, difficulty } = this.floorData;
      const w = this.canvas.width;
      const h = this.canvas.height;

      // Generate based on mechanic type
      switch (template.mechanic) {
        case "dodge":
          this.generateDodgeObstacles(difficulty);
          break;
        case "timing":
          this.generateTimingGates(difficulty);
          break;
        case "collect":
          this.generateCollectibles(difficulty);
          break;
        case "control":
          this.generateControlChallenges(difficulty);
          break;
        case "destroy":
          this.generateDestroyTargets(difficulty);
          break;
        case "platform":
          this.generatePlatforms(difficulty);
          break;
        default:
          this.generateDodgeObstacles(difficulty);
      }
    },

    generateDodgeObstacles(difficulty) {
      const count = difficulty.obstacleCount;
      const w = this.canvas.width;
      const h = this.canvas.height;

      for (let i = 0; i < count; i++) {
        const isVertical = Math.random() > 0.5;
        const size = Math.random() * 30 + 20;

        this.obstacles.push({
          x: Math.random() * (w - size),
          y: Math.random() * (h - 200),
          width: isVertical ? size : w * 0.3,
          height: isVertical ? h * 0.2 : size,
          vx: (Math.random() - 0.5) * 100 * difficulty.speed,
          vy: (Math.random() - 0.5) * 100 * difficulty.speed,
          color: "#EF4444",
          type: "moving",
        });
      }
    },

    generateTimingGates(difficulty) {
      const count = Math.min(4, Math.floor(difficulty.obstacleCount / 2));
      const h = this.canvas.height;
      const gateHeight = 60;
      const spacing = (h - 200) / (count + 1);

      for (let i = 0; i < count; i++) {
        const y = spacing * (i + 1);
        const gapWidth = difficulty.safeZone;

        this.obstacles.push({
          x: 0,
          y: y,
          gapX: Math.random() * (this.canvas.width - gapWidth),
          gapWidth: gapWidth,
          height: gateHeight,
          phase: Math.random() * Math.PI * 2,
          frequency: 0.002 * difficulty.speed,
          color: "#6B4CFF",
          type: "gate",
        });
      }
    },

    generateCollectibles(difficulty) {
      // Add some obstacles
      this.generateDodgeObstacles({
        ...difficulty,
        obstacleCount: Math.floor(difficulty.obstacleCount / 2),
      });

      // Add collectibles
      const collectCount = difficulty.obstacleCount + 5;
      this.totalItems = collectCount;

      for (let i = 0; i < collectCount; i++) {
        this.collectibles.push({
          x: Math.random() * (this.canvas.width - 30) + 15,
          y: Math.random() * (this.canvas.height - 250) + 50,
          radius: 12,
          color: "#10B981",
          collected: false,
        });
      }
    },

    generateControlChallenges(difficulty) {
      // Moving platforms with gravity shifts
      const count = difficulty.obstacleCount;

      for (let i = 0; i < count; i++) {
        this.obstacles.push({
          x: Math.random() * (this.canvas.width - 100),
          y: Math.random() * (this.canvas.height - 200),
          width: 100 + Math.random() * 100,
          height: 20,
          vx: (Math.random() - 0.5) * 80 * difficulty.speed,
          color: "#F59E0B",
          type: "platform",
        });
      }
    },

    generateDestroyTargets(difficulty) {
      const count = difficulty.obstacleCount + 3;
      this.totalItems = count;

      for (let i = 0; i < count; i++) {
        this.collectibles.push({
          x: Math.random() * (this.canvas.width - 50) + 25,
          y: Math.random() * (this.canvas.height - 250) + 50,
          radius: 20,
          color: "#EF4444",
          collected: false,
          health: 1,
          type: "target",
        });
      }
    },

    generatePlatforms(difficulty) {
      const rows = 4;
      const cols = 5;
      const platformWidth = this.canvas.width / cols - 20;
      const platformHeight = 30;
      const rowSpacing = (this.canvas.height - 200) / rows;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          if (Math.random() > 0.3) {
            // 70% chance of platform
            this.obstacles.push({
              x: col * (platformWidth + 20) + 10,
              y: row * rowSpacing + 100,
              width: platformWidth,
              height: platformHeight,
              phase: Math.random() * Math.PI * 2,
              blinkRate: 0.001 * difficulty.speed,
              visible: true,
              color: "#33AFFF",
              type: "blinking",
            });
          }
        }
      }
    },

    loop() {
      if (!this.running) return;

      const currentTime = performance.now();
      this.deltaTime = (currentTime - this.lastTime) / 1000;
      this.lastTime = currentTime;

      // FPS calculation
      this.frameCount++;
      this.fpsTime += this.deltaTime;
      if (this.fpsTime >= 1) {
        this.currentFps = this.frameCount;
        UIController.updateFps(this.currentFps);
        this.frameCount = 0;
        this.fpsTime = 0;
      }

      if (!this.paused) {
        this.update();
        this.render();

        // Update timer
        this.timeRemaining -= this.deltaTime;
        UIController.updateHUD({ timer: Math.max(0, this.timeRemaining) });

        // Check win/lose conditions
        if (this.timeRemaining <= 0) {
          this.endFloor(false);
          return;
        }

        // Check if collected all items (for collect/destroy modes)
        if (this.totalItems > 0 && this.itemsCollected >= this.totalItems) {
          this.endFloor(true);
          return;
        }
      }

      this.animationId = requestAnimationFrame(() => this.loop());
    },

    update() {
      const dt = this.deltaTime;

      // Player movement
      let dx = 0;
      let dy = 0;

      if (this.keys["ArrowLeft"] || this.keys["KeyA"]) dx -= 1;
      if (this.keys["ArrowRight"] || this.keys["KeyD"]) dx += 1;
      if (this.keys["ArrowUp"] || this.keys["KeyW"]) dy -= 1;
      if (this.keys["ArrowDown"] || this.keys["KeyS"]) dy += 1;

      // Normalize diagonal movement
      if (dx !== 0 && dy !== 0) {
        const len = Math.sqrt(dx * dx + dy * dy);
        dx /= len;
        dy /= len;
      }

      this.player.x += dx * this.player.speed * dt;
      this.player.y += dy * this.player.speed * dt;

      // Clamp to bounds
      this.player.x = Math.max(
        0,
        Math.min(this.canvas.width - this.player.width, this.player.x),
      );
      this.player.y = Math.max(
        0,
        Math.min(this.canvas.height - this.player.height, this.player.y),
      );

      // Update obstacles
      this.obstacles.forEach((obs) => {
        if (obs.type === "moving") {
          obs.x += obs.vx * dt;
          obs.y += obs.vy * dt;

          // Bounce off walls
          if (obs.x <= 0 || obs.x + obs.width >= this.canvas.width) {
            obs.vx *= -1;
            obs.x = Math.max(0, Math.min(this.canvas.width - obs.width, obs.x));
          }
          if (obs.y <= 0 || obs.y + obs.height >= this.canvas.height - 100) {
            obs.vy *= -1;
            obs.y = Math.max(
              0,
              Math.min(this.canvas.height - 100 - obs.height, obs.y),
            );
          }
        } else if (obs.type === "gate") {
          obs.phase += obs.frequency * dt * 1000;
          obs.gapX =
            ((Math.sin(obs.phase) + 1) / 2) *
            (this.canvas.width - obs.gapWidth);
        } else if (obs.type === "platform") {
          obs.x += obs.vx * dt;
          if (obs.x <= 0 || obs.x + obs.width >= this.canvas.width) {
            obs.vx *= -1;
          }
        } else if (obs.type === "blinking") {
          obs.phase += obs.blinkRate * dt * 1000;
          obs.visible = Math.sin(obs.phase) > 0;
        }
      });

      // Collision detection
      this.checkCollisions();
    },

    checkCollisions() {
      const p = this.player;
      const playerRect = { x: p.x, y: p.y, width: p.width, height: p.height };

      // Check obstacle collisions
      this.obstacles.forEach((obs) => {
        if (obs.type === "gate") {
          // Check if player is in gate row but not in gap
          if (
            this.rectIntersect(playerRect, {
              x: 0,
              y: obs.y,
              width: obs.gapX,
              height: obs.height,
            }) ||
            this.rectIntersect(playerRect, {
              x: obs.gapX + obs.gapWidth,
              y: obs.y,
              width: this.canvas.width - obs.gapX - obs.gapWidth,
              height: obs.height,
            })
          ) {
            this.takeDamage();
          }
        } else if (obs.type === "blinking") {
          if (!obs.visible && this.rectIntersect(playerRect, obs)) {
            // Player falls through - push down
            this.player.y += 5;
          }
        } else if (obs.type !== "platform") {
          if (this.rectIntersect(playerRect, obs)) {
            this.takeDamage();
          }
        }
      });

      // Check collectible collisions
      this.collectibles.forEach((col) => {
        if (!col.collected) {
          const dist = Math.sqrt(
            Math.pow(p.x + p.width / 2 - col.x, 2) +
              Math.pow(p.y + p.height / 2 - col.y, 2),
          );

          if (dist < col.radius + p.width / 2) {
            col.collected = true;
            this.itemsCollected++;
          }
        }
      });
    },

    rectIntersect(a, b) {
      return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
      );
    },

    takeDamage() {
      this.damageTaken++;
      // Brief invincibility/flash effect would go here
    },

    render() {
      const ctx = this.ctx;
      const w = this.canvas.width;
      const h = this.canvas.height;

      // Clear
      ctx.fillStyle = "#0A0F1A";
      ctx.fillRect(0, 0, w, h);

      // Draw grid lines for visual reference
      ctx.strokeStyle = "rgba(51, 175, 255, 0.1)";
      ctx.lineWidth = 1;
      const gridSize = 50;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Draw collectibles
      this.collectibles.forEach((col) => {
        if (!col.collected) {
          ctx.beginPath();
          ctx.arc(col.x, col.y, col.radius, 0, Math.PI * 2);
          ctx.fillStyle = col.color;
          ctx.fill();

          // Glow effect
          ctx.shadowColor = col.color;
          ctx.shadowBlur = 15;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // Draw obstacles
      this.obstacles.forEach((obs) => {
        if (obs.type === "gate") {
          ctx.fillStyle = obs.color;
          // Left part
          ctx.fillRect(0, obs.y, obs.gapX, obs.height);
          // Right part
          ctx.fillRect(
            obs.gapX + obs.gapWidth,
            obs.y,
            w - obs.gapX - obs.gapWidth,
            obs.height,
          );

          // Gate glow
          ctx.shadowColor = obs.color;
          ctx.shadowBlur = 10;
          ctx.fillRect(0, obs.y, obs.gapX, obs.height);
          ctx.fillRect(
            obs.gapX + obs.gapWidth,
            obs.y,
            w - obs.gapX - obs.gapWidth,
            obs.height,
          );
          ctx.shadowBlur = 0;
        } else if (obs.type === "blinking") {
          if (obs.visible) {
            ctx.fillStyle = obs.color;
            ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
          } else {
            ctx.strokeStyle = "rgba(51, 175, 255, 0.3)";
            ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);
          }
        } else {
          ctx.fillStyle = obs.color;
          ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

          // Glow
          ctx.shadowColor = obs.color;
          ctx.shadowBlur = 10;
          ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
          ctx.shadowBlur = 0;
        }
      });

      // Draw player
      const p = this.player;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.width, p.height);

      // Player glow
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 20;
      ctx.fillRect(p.x, p.y, p.width, p.height);
      ctx.shadowBlur = 0;

      // Player inner detail
      ctx.fillStyle = "#0A0F1A";
      ctx.fillRect(p.x + 8, p.y + 8, p.width - 16, p.height - 16);

      // Draw damage indicator
      if (this.damageTaken > 0) {
        ctx.fillStyle = `rgba(239, 68, 68, ${Math.min(0.3, this.damageTaken * 0.1)})`;
        ctx.fillRect(0, 0, w, h);
      }

      // Draw progress for collect modes
      if (this.totalItems > 0) {
        const progress = this.itemsCollected / this.totalItems;
        ctx.fillStyle = "rgba(16, 185, 129, 0.3)";
        ctx.fillRect(10, h - 30, (w - 20) * progress, 10);
        ctx.strokeStyle = "#10B981";
        ctx.strokeRect(10, h - 30, w - 20, 10);
      }
    },

    endFloor(success) {
      this.running = false;
      cancelAnimationFrame(this.animationId);

      const results = {
        success,
        timeRemaining: Math.max(0, this.timeRemaining),
        damageTaken: this.damageTaken,
        itemsCollected: this.itemsCollected,
        totalItems: this.totalItems,
      };

      if (this.onComplete) {
        this.onComplete(results);
      }
    },

    pause() {
      this.paused = true;
    },

    resume() {
      this.paused = false;
      this.lastTime = performance.now();
    },

    stop() {
      this.running = false;
      this.paused = false;
      cancelAnimationFrame(this.animationId);
    },
  };

  // ============================================
  // Run Manager (State Machine)
  // ============================================

  const RunManager = {
    state: "menu", // menu, choosing, countdown, playing, paused, result, summary, gameover

    // Run data
    currentTier: 1,
    currentScore: 0,
    currentMultiplier: 1.0,
    highestMultiplier: 1.0,
    completedTiers: [],
    tierChoices: {},
    selectedFloor: null,
    runStartTime: 0,
    floorsCleared: 0,

    init() {
      this.state = "menu";
    },

    startNewRun() {
      // Reset run state
      this.currentTier = 1;
      this.currentScore = 0;
      this.currentMultiplier = 1.0;
      this.highestMultiplier = 1.0;
      this.completedTiers = [];
      this.tierChoices = {};
      this.selectedFloor = null;
      this.runStartTime = Date.now();
      this.floorsCleared = 0;

      this.state = "choosing";
      this.showTowerMap();
    },

    showTowerMap() {
      this.tierChoices = UIController.renderTowerMap(
        this.currentTier,
        this.completedTiers,
        this.tierChoices,
      );
      UIController.updateTowerStats(this.currentScore, this.currentMultiplier);
      UIController.showScreen("tower");

      // Add click handlers to active tier cards
      const activeCards = document.querySelectorAll(
        ".tier-row.active .floor-card",
      );
      activeCards.forEach((card) => {
        card.onclick = () =>
          this.selectFloor(
            parseInt(card.dataset.tier),
            parseInt(card.dataset.index),
          );
      });
    },

    selectFloor(tier, index) {
      if (this.state !== "choosing" || tier !== this.currentTier) return;

      this.selectedFloor = this.tierChoices[tier][index];
      UIController.markCardSelected(tier, index);

      // Brief delay then start floor
      setTimeout(() => this.startFloor(), 500);
    },

    startFloor() {
      this.state = "countdown";
      UIController.showScreen("game");

      // Update HUD
      UIController.updateHUD({
        tier: this.currentTier,
        floor: this.selectedFloor.template.name,
        score: this.currentScore,
        timer: this.selectedFloor.difficulty.floorTime,
      });

      // Show countdown
      UIController.showFloorIntro(true);
      UIController.updateFloorIntro(
        this.selectedFloor.template.name,
        this.selectedFloor.template.description,
        3,
      );

      let countdown = CONFIG.COUNTDOWN_DURATION;
      const countdownInterval = setInterval(() => {
        countdown--;
        UIController.updateFloorIntro(
          this.selectedFloor.template.name,
          this.selectedFloor.template.description,
          countdown,
        );

        if (countdown <= 0) {
          clearInterval(countdownInterval);
          UIController.showFloorIntro(false);
          this.state = "playing";

          FloorEngine.startFloor(this.selectedFloor, (results) => {
            this.onFloorComplete(results);
          });
        }
      }, 1000);
    },

    onFloorComplete(results) {
      this.state = "result";

      // Calculate score
      const baseScore = CONFIG.SCORE.basePerTier * this.currentTier;
      const timeBonus = Math.floor(
        results.timeRemaining * CONFIG.SCORE.timeBonus,
      );
      let performanceBonus = 0;

      if (results.damageTaken === 0) {
        performanceBonus += CONFIG.SCORE.noDamageBonus;
      }
      if (
        results.totalItems > 0 &&
        results.itemsCollected === results.totalItems
      ) {
        performanceBonus += CONFIG.SCORE.collectAllBonus;
      }

      const multiplier = this.selectedFloor.risk.multiplier;
      const floorTotal = Math.floor(
        (baseScore + timeBonus + performanceBonus) * multiplier,
      );

      // Update run state
      if (results.success) {
        this.currentScore += floorTotal;
        this.currentMultiplier = Math.max(this.currentMultiplier, multiplier);
        this.highestMultiplier = Math.max(this.highestMultiplier, multiplier);
        this.completedTiers.push(this.currentTier);
        this.floorsCleared++;
      }

      // Gather rewards
      const rewards = [];
      if (results.damageTaken === 0) rewards.push("No Damage!");
      if (
        results.totalItems > 0 &&
        results.itemsCollected === results.totalItems
      )
        rewards.push("All Collected!");

      // Show result screen
      UIController.updateResultScreen({
        success: results.success,
        baseScore,
        timeBonus,
        performanceBonus,
        multiplier,
        total: floorTotal,
        nextTier: this.currentTier + 1,
        rewards,
      });

      UIController.showScreen("result");
    },

    proceedToNextTier() {
      if (this.currentTier >= CONFIG.TIERS) {
        // Run complete!
        this.endRun(true);
      } else {
        this.currentTier++;
        this.state = "choosing";
        this.showTowerMap();
      }
    },

    endRun(success) {
      const totalTime = Math.floor((Date.now() - this.runStartTime) / 1000);
      const minutes = Math.floor(totalTime / 60);
      const seconds = totalTime % 60;
      const timeString = `${minutes}:${seconds.toString().padStart(2, "0")}`;

      const isNewBest = StorageManager.setBestScore(this.currentScore);

      if (success) {
        this.state = "summary";
        UIController.updateSummaryScreen({
          score: this.currentScore,
          floorsCleared: this.floorsCleared,
          totalTime: timeString,
          highestMultiplier: this.highestMultiplier,
          isNewBest,
        });
        UIController.showScreen("summary");
      } else {
        this.state = "gameover";
        UIController.updateGameOverScreen({
          score: this.currentScore,
          tier: this.currentTier,
          floorsCleared: this.floorsCleared,
        });
        UIController.showScreen("gameover");
      }

      // Update menu best score
      UIController.updateMenuBestScore(StorageManager.getBestScore());
    },

    pauseGame() {
      if (this.state !== "playing") return;

      this.state = "paused";
      FloorEngine.pause();
      UIController.showOverlay("pause");

      // Sync pause settings
      document.getElementById("pause-reduce-motion").checked =
        document.getElementById("setting-reduce-motion").checked;
    },

    resumeGame() {
      if (this.state !== "paused") return;

      this.state = "playing";
      UIController.hideOverlay("pause");
      FloorEngine.resume();
    },

    restartRun() {
      FloorEngine.stop();
      UIController.hideAllOverlays();
      this.startNewRun();
    },

    quitToMenu() {
      FloorEngine.stop();
      UIController.hideAllOverlays();
      this.state = "menu";
      UIController.showScreen("menu");
    },
  };

  // ============================================
  // Settings Manager
  // ============================================

  const SettingsManager = {
    settings: {},

    init() {
      this.settings = StorageManager.getSettings();
      this.applySettings();
      this.bindEvents();
    },

    applySettings() {
      UIController.setReduceMotion(this.settings.reduceMotion);
      UIController.showFps(this.settings.showFps);

      // Sync checkboxes
      document.getElementById("setting-reduce-motion").checked =
        this.settings.reduceMotion;
      document.getElementById("setting-sound").checked = this.settings.sound;
      document.getElementById("setting-fps").checked = this.settings.showFps;
    },

    bindEvents() {
      // Reduce motion
      document
        .getElementById("setting-reduce-motion")
        .addEventListener("change", (e) => {
          this.settings.reduceMotion = e.target.checked;
          UIController.setReduceMotion(this.settings.reduceMotion);
          StorageManager.setSettings(this.settings);
        });

      document
        .getElementById("pause-reduce-motion")
        .addEventListener("change", (e) => {
          this.settings.reduceMotion = e.target.checked;
          document.getElementById("setting-reduce-motion").checked =
            e.target.checked;
          UIController.setReduceMotion(this.settings.reduceMotion);
          StorageManager.setSettings(this.settings);
        });

      // Sound
      document
        .getElementById("setting-sound")
        .addEventListener("change", (e) => {
          this.settings.sound = e.target.checked;
          StorageManager.setSettings(this.settings);
        });

      // FPS
      document.getElementById("setting-fps").addEventListener("change", (e) => {
        this.settings.showFps = e.target.checked;
        UIController.showFps(this.settings.showFps);
        StorageManager.setSettings(this.settings);
      });

      // Clear data
      document
        .getElementById("btn-clear-data")
        .addEventListener("click", () => {
          if (confirm("Clear all save data? This cannot be undone.")) {
            StorageManager.clearAll();
            UIController.updateMenuBestScore(0);
          }
        });
    },
  };

  // ============================================
  // Event Bindings
  // ============================================

  function bindEvents() {
    // Menu buttons
    document.getElementById("btn-start").addEventListener("click", () => {
      RunManager.startNewRun();
    });

    document.getElementById("btn-howto").addEventListener("click", () => {
      UIController.showScreen("howto");
    });

    document.getElementById("btn-settings").addEventListener("click", () => {
      UIController.showScreen("settings");
    });

    // How to Play
    document.getElementById("btn-howto-back").addEventListener("click", () => {
      UIController.showScreen("menu");
    });

    // Settings
    document
      .getElementById("btn-settings-back")
      .addEventListener("click", () => {
        UIController.showScreen("menu");
      });

    // Pause overlay
    document.getElementById("btn-pause").addEventListener("click", () => {
      RunManager.pauseGame();
    });

    document.getElementById("btn-resume").addEventListener("click", () => {
      RunManager.resumeGame();
    });

    document.getElementById("btn-restart-run").addEventListener("click", () => {
      RunManager.restartRun();
    });

    document.getElementById("btn-quit-run").addEventListener("click", () => {
      RunManager.quitToMenu();
    });

    // Result screen
    document.getElementById("btn-next-tier").addEventListener("click", () => {
      RunManager.proceedToNextTier();
    });

    // Summary screen
    document.getElementById("btn-new-run").addEventListener("click", () => {
      RunManager.startNewRun();
    });

    document
      .getElementById("btn-summary-menu")
      .addEventListener("click", () => {
        RunManager.quitToMenu();
      });

    // Game over screen
    document.getElementById("btn-retry").addEventListener("click", () => {
      RunManager.startNewRun();
    });

    document
      .getElementById("btn-gameover-menu")
      .addEventListener("click", () => {
        RunManager.quitToMenu();
      });
  }

  // ============================================
  // Initialization
  // ============================================

  function init() {
    UIController.init();
    FloorEngine.init();
    RunManager.init();
    SettingsManager.init();
    bindEvents();

    // Load best score
    UIController.updateMenuBestScore(StorageManager.getBestScore());

    // Show menu
    UIController.showScreen("menu");

    console.log("Tower Run initialized");
  }

  // Start when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Public API (for debugging)
  return {
    RunManager,
    FloorEngine,
    UIController,
    StorageManager,
    CONFIG,
  };
})();
