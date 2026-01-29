// Emergency System
let emergencyActive = false;

function toggleEmergency() {
  emergencyActive = !emergencyActive;
  const body = document.body;
  const overlay = document.getElementById('emergencyOverlay');
  const btn = document.getElementById('emergencyBtn');
  
  if (emergencyActive) {
    body.classList.add('emergency-mode');
    overlay.classList.add('active');
    btn.classList.add('active');
    btn.innerHTML = '🚨 DEACTIVATE';
    
    // Play alert sound effect (visual only if no audio)
    console.log('🚨 EMERGENCY PROTOCOL ACTIVATED');
  } else {
    body.classList.remove('emergency-mode');
    overlay.classList.remove('active');
    btn.classList.remove('active');
    btn.innerHTML = '🚨 EMERGENCY';
    
    console.log('✅ Emergency protocol deactivated');
  }
}

// Allow clicking overlay to deactivate emergency
document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('emergencyOverlay');
  if (overlay) {
    overlay.addEventListener('click', () => {
      if (emergencyActive) {
        toggleEmergency();
      }
    });
  }
});

// Jumpscare System - 10% chance on click
const JumpscareSystem = {
  chance: 0.1, // 10% chance
  active: false,

  init() {
    // Create jumpscare overlay
    const overlay = document.createElement("div");
    overlay.id = "jumpscare-overlay";
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      background: #000;
      z-index: 9999;
      display: none;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    `;

    const img = document.createElement("img");
    img.src = "assets/jumpscare.webp";
    img.style.cssText = `
      width: 100vw;
      height: 100vh;
      object-fit: cover;
      animation: jumpscareShake 0.05s infinite;
    `;

    overlay.appendChild(img);
    document.body.appendChild(overlay);

    // Add shake animation
    const style = document.createElement("style");
    style.textContent = `
      @keyframes jumpscareShake {
        0%, 100% { transform: translate(0, 0) scale(1.05); }
        25% { transform: translate(-5px, 5px) scale(1.05); }
        50% { transform: translate(5px, -5px) scale(1.05); }
        75% { transform: translate(-5px, -5px) scale(1.05); }
      }
    `;
    document.head.appendChild(style);

    // Click to dismiss
    overlay.addEventListener("click", () => this.hide());

    // Listen for clicks on interactive elements
    document.addEventListener(
      "click",
      (e) => {
        if (this.active) return;

        const target = e.target.closest("a, button, .module-card");
        if (target && Math.random() < this.chance) {
          e.preventDefault();
          e.stopPropagation();
          this.show();

          // Store original destination for links
          if (target.href) {
            this.pendingNavigation = target.href;
          }
        }
      },
      true,
    );
  },

  show() {
    this.active = true;
    const overlay = document.getElementById("jumpscare-overlay");
    overlay.style.display = "flex";

    // Auto-hide after 0.1 seconds
    setTimeout(() => this.hide(), 100);
  },

  hide() {
    this.active = false;
    const overlay = document.getElementById("jumpscare-overlay");
    overlay.style.display = "none";

    // Navigate if there was a pending link
    if (this.pendingNavigation) {
      window.location.href = this.pendingNavigation;
      this.pendingNavigation = null;
    }
  },
};

// Initialize jumpscare system
JumpscareSystem.init();

const canvas = document.getElementById("telemetryGraph");
if (canvas) {
  const ctx = canvas.getContext("2d");

  let x = 0;

  function drawGraph() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#33afff";
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (let i = 0; i < canvas.width; i++) {
      const y = 45 + Math.sin((x + i) * 0.05) * 25 + Math.random() * 8;
      if (i === 0) ctx.moveTo(i, y);
      else ctx.lineTo(i, y);
    }

    ctx.stroke();
    x += 2;

    requestAnimationFrame(drawGraph);
  }

  drawGraph();
}
