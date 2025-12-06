function animateNumber(obj, prop, newValue, speed = 0.15) {
  if (!obj.current) obj.current = newValue; // init
  obj.current = obj.current + (newValue - obj.current) * speed;
  return obj.current;
}

/* ========= TRAJECTORY ROUTE + SHIP MOTION ========= */
const canvas = document.getElementById("trajectoryCanvas");
const ctx = canvas.getContext("2d");
const ship = document.getElementById("shipIcon");
const container = document.querySelector(".map-container");

function resizeCanvas() {
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let offset = 0;

function routeY(x) {
  const h = canvas.height;
  return h * 0.65 - Math.sin(x * 0.004) * 35 - Math.cos(x * 0.0025) * 20;
}

function drawTrajectory() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // SCHIP POSITIE
  const shipX = canvas.width * 0.5;
  const shipY = routeY(shipX + offset);

  // TEKEN LIJN ALLEEN ACHTER SCHIP
  ctx.strokeStyle = "#33afff";
  ctx.lineWidth = 3;
  ctx.shadowColor = "#33afff";
  ctx.shadowBlur = 14;

  ctx.beginPath();
  for (let x = 0; x < shipX; x++) {
    const y = routeY(x + offset);
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // SHIP POSITION UPDATES
  ship.style.left = shipX + "px";
  ship.style.top = shipY + "px";

  // ROTATIE VANUIT BASIS 90°
  const aheadY = routeY(shipX + offset + 4);
  const angle = Math.atan2(aheadY - shipY, 4);
  ship.style.transform = `translate(-50%, -50%) rotate(${
    angle + Math.PI / 2
  }rad)`;

  offset += 1.0;

  requestAnimationFrame(drawTrajectory);
}

drawTrajectory();

drawTrajectory();

/* ========= LIVE DATA: VELOCITY, DISTANCE, ETA ========= */

let velocity = 40000; // km/h
let etaHours = 141; // uren tot doel

let distance = velocity * etaHours; // wordt 5.640.000 km
let eta = etaHours * 3600; // seconden

function updateLiveData() {
  // ===== VELOCITY (schommelt licht) =====
  const velChange = (Math.random() - 0.5) * 300;
  velocity += velChange;

  // Smooth animation wrapper
  if (!window.velAnim) window.velAnim = { current: velocity };
  const smoothVel = animateNumber(window.velAnim, "current", velocity, 0.12);

  // UPDATE TEXT
  document.querySelector(".value-velocity").textContent =
    Math.round(smoothVel).toLocaleString();

  // ===== DISTANCE (neemt langzaam af) =====
  const delta = velocity * (0.3 / 360);
  distance -= delta;
  if (distance < 0) distance = 0;

  // Smooth value
  if (!window.distAnim) window.distAnim = { current: distance };
  const smoothDist = animateNumber(window.distAnim, "current", distance, 0.1);

  // UPDATE TEXT
  document.querySelector(".value-distance").textContent =
    Math.round(smoothDist).toLocaleString() + " km";

  // ===== ETA =====
  eta -= 3;
  if (eta < 0) eta = 0;

  // Smooth ETA
  if (!window.etaAnim) window.etaAnim = { current: eta };
  const smoothEta = animateNumber(window.etaAnim, "current", eta, 0.12);

  const etaHours = Math.floor(smoothEta / 3600);
  document.querySelector(".value-eta").textContent = etaHours;

  setTimeout(updateLiveData, 300); // smooth updates
}

updateLiveData();

if (!window.barVelAnim) window.barVelAnim = { current: 0 };
if (!window.barDistAnim) window.barDistAnim = { current: 0 };
if (!window.barEtaAnim) window.barEtaAnim = { current: 0 };

function updateBars() {
  const velPercent = Math.min((velocity / 50000) * 100, 100);
  const distPercent = Math.max((distance / ((velocity * eta) / 3600)) * 100, 0);
  const etaPercent = Math.max((eta / (141 * 3600)) * 100, 0);

  const smoothVelBar = animateNumber(
    window.barVelAnim,
    "current",
    velPercent,
    0.15
  );
  const smoothDistBar = animateNumber(
    window.barDistAnim,
    "current",
    distPercent,
    0.1
  );
  const smoothEtaBar = animateNumber(
    window.barEtaAnim,
    "current",
    etaPercent,
    0.15
  );

  document.querySelector(".bar-velocity .fill").style.width =
    smoothVelBar + "%";
  document.querySelector(".bar-distance .fill").style.width =
    smoothDistBar + "%";
  document.querySelector(".bar-eta .fill").style.width = smoothEtaBar + "%";
}

updateBars();
