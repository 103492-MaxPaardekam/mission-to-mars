// Blackjack Casino - AstroTech Mission to Mars
// Full gambling experience with betting

const BlackjackApp = (function () {
  "use strict";

  // ============================================
  // Storage Manager
  // ============================================

  const StorageManager = {
    KEYS: {
      BALANCE: "casino_balance",
    },

    getBalance() {
      try {
        const balance = parseInt(localStorage.getItem(this.KEYS.BALANCE));
        return isNaN(balance) ? 1000 : balance;
      } catch (e) {
        return 1000;
      }
    },

    setBalance(amount) {
      try {
        localStorage.setItem(this.KEYS.BALANCE, amount);
      } catch (e) {}
    },

    resetBalance() {
      this.setBalance(1000);
      return 1000;
    },
  };

  // ============================================
  // UI Controller
  // ============================================

  const UIController = {
    screens: {},

    init() {
      this.screens = {
        menu: document.getElementById("screen-menu"),
        howto: document.getElementById("screen-howto"),
        game: document.getElementById("screen-game"),
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

    updateBalance(amount) {
      document.getElementById("menu-balance").textContent = amount;
      document.getElementById("header-balance").textContent = amount;
    },

    updateBet(amount) {
      document.getElementById("current-bet").textContent = amount;
    },

    updatePlayerScore(score) {
      document.getElementById("player-score").textContent = score;
    },

    updateDealerScore(score, hidden = false) {
      document.getElementById("dealer-score").textContent = hidden
        ? "?"
        : score;
    },

    clearCards() {
      document.getElementById("player-cards").innerHTML = "";
      document.getElementById("dealer-cards").innerHTML = "";
    },

    addCard(container, card, hidden = false) {
      const cardEl = document.createElement("div");
      cardEl.className = "card";

      if (hidden) {
        cardEl.classList.add("hidden-card");
      } else {
        const isRed = card.suit === "♥" || card.suit === "♦";
        cardEl.classList.add(isRed ? "red" : "black");

        cardEl.innerHTML = `
          <div class="card-corner top">
            <span class="card-value">${card.display}</span>
            <span class="card-suit">${card.suit}</span>
          </div>
          <div class="card-center">${card.suit}</div>
          <div class="card-corner bottom">
            <span class="card-value">${card.display}</span>
            <span class="card-suit">${card.suit}</span>
          </div>
        `;
      }

      document.getElementById(container).appendChild(cardEl);
      return cardEl;
    },

    revealDealerCard(card) {
      const dealerCards = document.getElementById("dealer-cards");
      const hiddenCard = dealerCards.querySelector(".hidden-card");

      if (hiddenCard) {
        const isRed = card.suit === "♥" || card.suit === "♦";
        hiddenCard.classList.remove("hidden-card");
        hiddenCard.classList.add(isRed ? "red" : "black");
        hiddenCard.innerHTML = `
          <div class="card-corner top">
            <span class="card-value">${card.display}</span>
            <span class="card-suit">${card.suit}</span>
          </div>
          <div class="card-center">${card.suit}</div>
          <div class="card-corner bottom">
            <span class="card-value">${card.display}</span>
            <span class="card-suit">${card.suit}</span>
          </div>
        `;
      }
    },

    showResult(text, amount, type) {
      const resultDisplay = document.getElementById("result-display");
      const resultText = document.getElementById("result-text");
      const resultAmount = document.getElementById("result-amount");

      resultDisplay.className = "result-display " + type;
      resultText.textContent = text;
      resultAmount.textContent = amount;
    },

    hideResult() {
      document.getElementById("result-display").classList.add("hidden");
    },

    showBettingSection() {
      document.getElementById("betting-section").style.display = "flex";
      document.getElementById("action-buttons").classList.add("hidden");
      document.getElementById("new-game-container").classList.add("hidden");
    },

    showActionButtons() {
      document.getElementById("betting-section").style.display = "none";
      document.getElementById("action-buttons").classList.remove("hidden");
      document.getElementById("new-game-container").classList.add("hidden");
    },

    showNewGameButtons() {
      document.getElementById("betting-section").style.display = "none";
      document.getElementById("action-buttons").classList.add("hidden");
      document.getElementById("new-game-container").classList.remove("hidden");
    },

    enableDouble(enabled) {
      document.getElementById("btn-double").disabled = !enabled;
    },

    enableDeal(enabled) {
      document.getElementById("btn-deal").disabled = !enabled;
    },

    updateChips(balance) {
      document.querySelectorAll(".chip").forEach((chip) => {
        const value = parseInt(chip.dataset.value);
        chip.disabled = value > balance;
      });
    },
  };

  // ============================================
  // Game Engine
  // ============================================

  const GameEngine = {
    deck: [],
    playerHand: [],
    dealerHand: [],
    gameOver: false,
    balance: 1000,
    currentBet: 0,

    suits: ["♠", "♥", "♦", "♣"],
    values: [
      { value: 2, display: "2" },
      { value: 3, display: "3" },
      { value: 4, display: "4" },
      { value: 5, display: "5" },
      { value: 6, display: "6" },
      { value: 7, display: "7" },
      { value: 8, display: "8" },
      { value: 9, display: "9" },
      { value: 10, display: "10" },
      { value: 10, display: "J" },
      { value: 10, display: "Q" },
      { value: 10, display: "K" },
      { value: 11, display: "A" },
    ],

    init() {
      this.balance = StorageManager.getBalance();
      UIController.updateBalance(this.balance);
    },

    createDeck() {
      this.deck = [];
      // Use 6 decks like real casinos
      for (let d = 0; d < 6; d++) {
        for (const suit of this.suits) {
          for (const val of this.values) {
            this.deck.push({
              suit: suit,
              value: val.value,
              display: val.display,
            });
          }
        }
      }
      this.shuffleDeck();
    },

    shuffleDeck() {
      for (let i = this.deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
      }
    },

    drawCard() {
      if (this.deck.length < 20) {
        this.createDeck();
      }
      return this.deck.pop();
    },

    calculateScore(hand) {
      let score = 0;
      let aces = 0;

      for (const card of hand) {
        score += card.value;
        if (card.display === "A") {
          aces++;
        }
      }

      while (score > 21 && aces > 0) {
        score -= 10;
        aces--;
      }

      return score;
    },

    isBlackjack(hand) {
      return hand.length === 2 && this.calculateScore(hand) === 21;
    },

    addToBet(amount) {
      if (amount > this.balance) return false;

      this.currentBet += amount;
      this.balance -= amount;

      UIController.updateBet(this.currentBet);
      UIController.updateBalance(this.balance);
      UIController.enableDeal(this.currentBet > 0);
      UIController.updateChips(this.balance);

      return true;
    },

    clearBet() {
      this.balance += this.currentBet;
      this.currentBet = 0;

      UIController.updateBet(0);
      UIController.updateBalance(this.balance);
      UIController.enableDeal(false);
      UIController.updateChips(this.balance);
    },

    resetRound() {
      this.playerHand = [];
      this.dealerHand = [];
      this.gameOver = false;
      this.currentBet = 0;

      UIController.clearCards();
      UIController.hideResult();
      UIController.updateBet(0);
      UIController.showBettingSection();
      UIController.enableDeal(false);
      UIController.updateChips(this.balance);

      // Check if player is broke
      if (this.balance <= 0) {
        this.balance = StorageManager.resetBalance();
        UIController.updateBalance(this.balance);
        alert("Je bent blut! Je krijgt 1000 credits om verder te spelen.");
      }
    },

    deal() {
      if (this.currentBet === 0) return;

      this.playerHand = [];
      this.dealerHand = [];
      this.gameOver = false;

      UIController.clearCards();
      UIController.hideResult();
      UIController.showActionButtons();
      UIController.enableDouble(this.balance >= this.currentBet);

      if (this.deck.length < 20) {
        this.createDeck();
      }

      // Deal initial cards with delay
      setTimeout(() => {
        this.playerHand.push(this.drawCard());
        UIController.addCard("player-cards", this.playerHand[0]);
        UIController.updatePlayerScore(this.calculateScore(this.playerHand));
      }, 100);

      setTimeout(() => {
        this.dealerHand.push(this.drawCard());
        UIController.addCard("dealer-cards", this.dealerHand[0]);
        UIController.updateDealerScore(this.dealerHand[0].value, true);
      }, 300);

      setTimeout(() => {
        this.playerHand.push(this.drawCard());
        UIController.addCard("player-cards", this.playerHand[1]);
        UIController.updatePlayerScore(this.calculateScore(this.playerHand));
      }, 500);

      setTimeout(() => {
        this.dealerHand.push(this.drawCard());
        UIController.addCard("dealer-cards", this.dealerHand[1], true);

        // Check for blackjack
        if (this.isBlackjack(this.playerHand)) {
          setTimeout(() => this.stand(), 300);
        }
      }, 700);
    },

    hit() {
      if (this.gameOver) return;

      const card = this.drawCard();
      this.playerHand.push(card);
      UIController.addCard("player-cards", card);

      const score = this.calculateScore(this.playerHand);
      UIController.updatePlayerScore(score);
      UIController.enableDouble(false);

      if (score > 21) {
        this.endGame("bust");
      }
    },

    stand() {
      if (this.gameOver) return;

      // Reveal dealer's hidden card
      UIController.revealDealerCard(this.dealerHand[1]);

      // Dealer draws until 17
      const dealerPlay = () => {
        const dealerScore = this.calculateScore(this.dealerHand);
        UIController.updateDealerScore(dealerScore);

        if (dealerScore < 17) {
          setTimeout(() => {
            const card = this.drawCard();
            this.dealerHand.push(card);
            UIController.addCard("dealer-cards", card);
            dealerPlay();
          }, 600);
        } else {
          setTimeout(() => this.determineWinner(), 300);
        }
      };

      dealerPlay();
    },

    double() {
      if (this.gameOver || this.playerHand.length !== 2) return;
      if (this.balance < this.currentBet) return;

      // Double the bet
      this.balance -= this.currentBet;
      this.currentBet *= 2;
      UIController.updateBet(this.currentBet);
      UIController.updateBalance(this.balance);

      // Take one card and stand
      const card = this.drawCard();
      this.playerHand.push(card);
      UIController.addCard("player-cards", card);

      const score = this.calculateScore(this.playerHand);
      UIController.updatePlayerScore(score);

      if (score > 21) {
        this.endGame("bust");
      } else {
        setTimeout(() => this.stand(), 500);
      }
    },

    determineWinner() {
      const playerScore = this.calculateScore(this.playerHand);
      const dealerScore = this.calculateScore(this.dealerHand);
      const playerBJ = this.isBlackjack(this.playerHand);
      const dealerBJ = this.isBlackjack(this.dealerHand);

      if (playerBJ && !dealerBJ) {
        this.endGame("blackjack");
      } else if (dealerBJ && !playerBJ) {
        this.endGame("dealer-blackjack");
      } else if (dealerScore > 21) {
        this.endGame("dealer-bust");
      } else if (playerScore > dealerScore) {
        this.endGame("win");
      } else if (dealerScore > playerScore) {
        this.endGame("lose");
      } else {
        this.endGame("push");
      }
    },

    endGame(result) {
      this.gameOver = true;
      UIController.showNewGameButtons();
      UIController.updateDealerScore(this.calculateScore(this.dealerHand));

      let text, type, amountText;
      let winnings = 0;

      switch (result) {
        case "blackjack":
          winnings = Math.floor(this.currentBet * 2.5);
          text = "🎰 BLACKJACK! 🎰";
          amountText = `+${winnings} 💰`;
          type = "blackjack";
          break;
        case "win":
        case "dealer-bust":
          winnings = this.currentBet * 2;
          text = result === "win" ? "JE WINT!" : "DEALER BUST!";
          amountText = `+${winnings} 💰`;
          type = "win";
          break;
        case "bust":
          text = "BUST!";
          amountText = `-${this.currentBet} 💰`;
          type = "lose";
          break;
        case "lose":
        case "dealer-blackjack":
          text = result === "lose" ? "JE VERLIEST" : "DEALER BLACKJACK";
          amountText = `-${this.currentBet} 💰`;
          type = "lose";
          break;
        case "push":
          winnings = this.currentBet;
          text = "PUSH";
          amountText = "Inzet terug";
          type = "push";
          break;
      }

      this.balance += winnings;
      StorageManager.setBalance(this.balance);
      UIController.updateBalance(this.balance);
      UIController.showResult(text, amountText, type);
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
      GameEngine.createDeck();
      this.bindEvents();
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
          window.location.href = "index.html";
        });

      document
        .getElementById("btn-howto-back")
        .addEventListener("click", () => {
          this.state = "menu";
          UIController.showScreen("menu");
        });

      // Chip buttons
      document.querySelectorAll(".chip").forEach((chip) => {
        chip.addEventListener("click", () => {
          const value = parseInt(chip.dataset.value);
          GameEngine.addToBet(value);
        });
      });

      // Betting buttons
      document.getElementById("btn-clear-bet").addEventListener("click", () => {
        GameEngine.clearBet();
      });

      document.getElementById("btn-deal").addEventListener("click", () => {
        GameEngine.deal();
      });

      // Game action buttons
      document.getElementById("btn-hit").addEventListener("click", () => {
        GameEngine.hit();
      });

      document.getElementById("btn-stand").addEventListener("click", () => {
        GameEngine.stand();
      });

      document.getElementById("btn-double").addEventListener("click", () => {
        GameEngine.double();
      });

      // New game buttons
      document.getElementById("btn-new-round").addEventListener("click", () => {
        GameEngine.resetRound();
      });

      document.getElementById("btn-quit").addEventListener("click", () => {
        this.quitToMenu();
      });

      // Casino back button
      document
        .getElementById("btn-casino-back")
        .addEventListener("click", () => {
          window.location.href = "index.html";
        });

      // Keyboard controls
      document.addEventListener("keydown", (e) => this.handleKeyDown(e));
    },

    handleKeyDown(e) {
      if (this.state !== "playing") return;

      if (
        !GameEngine.gameOver &&
        document
          .getElementById("action-buttons")
          .classList.contains("hidden") === false
      ) {
        if (e.code === "KeyH") {
          GameEngine.hit();
        } else if (e.code === "KeyS") {
          GameEngine.stand();
        } else if (e.code === "KeyD" && GameEngine.playerHand.length === 2) {
          GameEngine.double();
        }
      }
    },

    startGame() {
      this.state = "playing";
      UIController.showScreen("game");
      GameEngine.resetRound();
    },

    quitToMenu() {
      this.state = "menu";
      UIController.showScreen("menu");
    },
  };

  // ============================================
  // Initialize
  // ============================================

  function init() {
    GameManager.init();
    console.log("Blackjack Casino initialized");
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
