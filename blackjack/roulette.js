/**
 * Roulette - Space Casino
 * AstroTech Mission to Mars
 */

// Roulette numbers with their colors (European wheel order)
const WHEEL_NUMBERS = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24,
  16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
];

const RED_NUMBERS = [
  1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
];
const BLACK_NUMBERS = [
  2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35,
];

// Game State
const state = {
  balance: parseInt(localStorage.getItem("casino_balance")) || 1000,
  selectedChip: 10,
  bets: {}, // { betType: amount }
  totalBet: 0,
  isSpinning: false,
  wheelRotation: 0,
  ballRotation: 0,
};

// DOM Elements
const screens = {
  menu: document.getElementById("screen-menu"),
  howto: document.getElementById("screen-howto"),
  game: document.getElementById("screen-game"),
};

const elements = {
  menuBalance: document.getElementById("menu-balance"),
  headerBalance: document.getElementById("header-balance"),
  totalBet: document.getElementById("total-bet"),
  wheel: document.getElementById("wheel"),
  ballTrack: document.getElementById("ball-track"),
  ball: document.getElementById("ball"),
  resultDisplay: document.getElementById("result-display"),
  resultNumber: document.getElementById("result-number"),
  resultText: document.getElementById("result-text"),
  btnSpin: document.getElementById("btn-spin"),
  btnClear: document.getElementById("btn-clear"),
};

// Screen Navigation
function showScreen(screenName) {
  Object.values(screens).forEach((s) => s.classList.remove("active"));
  screens[screenName].classList.add("active");
  updateBalanceDisplays();
}

// Balance Management
function updateBalanceDisplays() {
  elements.menuBalance.textContent = state.balance;
  elements.headerBalance.textContent = state.balance;
  localStorage.setItem("casino_balance", state.balance);
}

function updateTotalBet() {
  state.totalBet = Object.values(state.bets).reduce(
    (sum, bet) => sum + bet.amount,
    0,
  );
  elements.totalBet.textContent = state.totalBet;
  elements.btnSpin.disabled = state.totalBet === 0 || state.isSpinning;
}

// Chip Selection
function initChipSelector() {
  document.querySelectorAll(".chip-select").forEach((chip) => {
    chip.addEventListener("click", () => {
      document
        .querySelectorAll(".chip-select")
        .forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      state.selectedChip = parseInt(chip.dataset.value);
    });
  });
}

// Betting
function initBettingTable() {
  document.querySelectorAll(".bet-cell").forEach((cell) => {
    cell.addEventListener("click", () => {
      if (state.isSpinning) return;

      const betKey = cell.dataset.bet;
      const betType = cell.dataset.type;
      const chipValue = state.selectedChip;

      // Check if player has enough balance
      if (state.balance - state.totalBet < chipValue) {
        showNotification("Niet genoeg balans!", "error");
        return;
      }

      // Add bet - store both amount and type
      if (!state.bets[betKey]) {
        state.bets[betKey] = { amount: 0, type: betType };
      }
      state.bets[betKey].amount += chipValue;

      // Update visual
      updateCellChip(cell, state.bets[betKey].amount);
      updateTotalBet();
    });

    // Right click to remove bet
    cell.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      if (state.isSpinning) return;

      const betKey = cell.dataset.bet;
      if (state.bets[betKey]) {
        delete state.bets[betKey];
        removeCellChip(cell);
        updateTotalBet();
      }
    });
  });
}

function updateCellChip(cell, amount) {
  let marker = cell.querySelector(".chip-marker");
  if (!marker) {
    marker = document.createElement("span");
    marker.className = "chip-marker";
    cell.appendChild(marker);
  }
  marker.textContent = amount;
  cell.classList.add("selected");
}

function removeCellChip(cell) {
  const marker = cell.querySelector(".chip-marker");
  if (marker) marker.remove();
  cell.classList.remove("selected");
}

function clearAllBets() {
  state.bets = {};
  state.totalBet = 0;
  document.querySelectorAll(".bet-cell").forEach((cell) => {
    removeCellChip(cell);
  });
  updateTotalBet();
  elements.resultDisplay.classList.add("hidden");
}

// Spin Wheel
function spin() {
  if (state.isSpinning || state.totalBet === 0) return;
  if (state.totalBet > state.balance) {
    showNotification("Niet genoeg balans!", "error");
    return;
  }

  state.isSpinning = true;
  elements.btnSpin.disabled = true;
  elements.btnClear.disabled = true;
  elements.resultDisplay.classList.add("hidden");

  // Deduct bet from balance
  state.balance -= state.totalBet;
  updateBalanceDisplays();

  // Generate random result
  const resultIndex = Math.floor(Math.random() * WHEEL_NUMBERS.length);
  const resultNumber = WHEEL_NUMBERS[resultIndex];

  // Calculate rotation
  const degreesPerSlot = 360 / WHEEL_NUMBERS.length;
  const targetDegree = resultIndex * degreesPerSlot;
  const spins = 5 + Math.floor(Math.random() * 3); // 5-7 full spins
  const totalRotation = spins * 360 + (360 - targetDegree);

  state.wheelRotation += totalRotation;

  // Show ball
  elements.ball.classList.add("visible");

  // Animate wheel
  elements.wheel.style.transition =
    "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)";
  elements.wheel.style.transform = `rotate(${state.wheelRotation}deg)`;

  // After spin completes
  setTimeout(() => {
    showResult(resultNumber);
    state.isSpinning = false;
    elements.btnClear.disabled = false;
    updateTotalBet();
  }, 4200);
}

// Show Result
function showResult(number) {
  elements.ball.classList.remove("visible");

  // Determine color
  let colorClass = "green";
  if (RED_NUMBERS.includes(number)) colorClass = "red";
  else if (BLACK_NUMBERS.includes(number)) colorClass = "black";

  // Calculate winnings
  const winnings = calculateWinnings(number);

  // Update result display
  elements.resultNumber.textContent = number;
  elements.resultNumber.className = "result-number " + colorClass;

  if (winnings > 0) {
    state.balance += winnings;
    elements.resultText.textContent = `GEWONNEN! +${winnings}`;
    elements.resultText.className = "result-text win";
    showNotification(`Je hebt ${winnings} gewonnen!`, "success");
  } else {
    elements.resultText.textContent = "VERLOREN";
    elements.resultText.className = "result-text lose";
  }

  elements.resultDisplay.classList.remove("hidden");
  updateBalanceDisplays();

  // Clear bets for next round
  setTimeout(() => {
    clearAllBets();
  }, 2000);
}

// Calculate Winnings
function calculateWinnings(number) {
  let totalWin = 0;
  const isRed = RED_NUMBERS.includes(number);
  const isBlack = BLACK_NUMBERS.includes(number);
  const isEven = number !== 0 && number % 2 === 0;
  const isOdd = number !== 0 && number % 2 !== 0;

  for (const [betKey, bet] of Object.entries(state.bets)) {
    const betType = bet.type;
    const betAmount = bet.amount;

    switch (betType) {
      case "number":
        if (parseInt(betKey) === number) {
          totalWin += betAmount * 36; // 35:1 + original
        }
        break;

      case "color":
        if ((betKey === "red" && isRed) || (betKey === "black" && isBlack)) {
          totalWin += betAmount * 2;
        }
        break;

      case "parity":
        if ((betKey === "even" && isEven) || (betKey === "odd" && isOdd)) {
          totalWin += betAmount * 2;
        }
        break;

      case "half":
        if (number !== 0) {
          if (
            (betKey === "1-18" && number >= 1 && number <= 18) ||
            (betKey === "19-36" && number >= 19 && number <= 36)
          ) {
            totalWin += betAmount * 2;
          }
        }
        break;

      case "dozen":
        if (number !== 0) {
          if (
            (betKey === "dozen1" && number >= 1 && number <= 12) ||
            (betKey === "dozen2" && number >= 13 && number <= 24) ||
            (betKey === "dozen3" && number >= 25 && number <= 36)
          ) {
            totalWin += betAmount * 3;
          }
        }
        break;

      case "row":
        if (number !== 0) {
          const row = number % 3;
          if (
            (betKey === "row1" && row === 1) ||
            (betKey === "row2" && row === 2) ||
            (betKey === "row3" && row === 0)
          ) {
            totalWin += betAmount * 3;
          }
        }
        break;
    }
  }

  return totalWin;
}
function showNotification(message, type = "info") {
  const existing = document.querySelector(".notification");
  if (existing) existing.remove();

  const notif = document.createElement("div");
  notif.className = `notification notification-${type}`;
  notif.textContent = message;
  notif.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 1rem 2rem;
    border-radius: 8px;
    font-family: 'Orbitron', sans-serif;
    font-size: 0.9rem;
    z-index: 1000;
    animation: slideDown 0.3s ease;
    background: ${type === "success" ? "#10b981" : type === "error" ? "#ef4444" : "#6b4cff"};
    color: white;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  `;

  document.body.appendChild(notif);
  setTimeout(() => notif.remove(), 2500);
}

// Initialize
function init() {
  updateBalanceDisplays();
  initChipSelector();
  initBettingTable();

  // Menu buttons
  document
    .getElementById("btn-start")
    .addEventListener("click", () => showScreen("game"));
  document
    .getElementById("btn-howto")
    .addEventListener("click", () => showScreen("howto"));
  document
    .getElementById("btn-howto-back")
    .addEventListener("click", () => showScreen("menu"));
  document.getElementById("btn-back").addEventListener("click", () => {
    window.location.href = "index.html";
  });
  document
    .getElementById("btn-to-menu")
    .addEventListener("click", () => showScreen("menu"));

  // Game buttons
  elements.btnSpin.addEventListener("click", spin);
  elements.btnClear.addEventListener("click", clearAllBets);
}

// Add CSS for notification animation
const style = document.createElement("style");
style.textContent = `
  @keyframes slideDown {
    from { opacity: 0; transform: translate(-50%, -20px); }
    to { opacity: 1; transform: translate(-50%, 0); }
  }
`;
document.head.appendChild(style);

// Start
document.addEventListener("DOMContentLoaded", init);
