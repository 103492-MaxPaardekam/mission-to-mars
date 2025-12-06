document.getElementById("start-screen").addEventListener("click", startBoot);

function startBoot() {
  document.getElementById("start-screen").style.display = "none";

  const boot = document.getElementById("boot-sequence");
  boot.classList.remove("hidden");
  boot.style.opacity = 1;

  typeLine(
    document.getElementById("line1"),
    "> Initializing flight core...",
    200
  );
  typeLine(
    document.getElementById("line2"),
    "> Running safety protocols...",
    900
  );
  typeLine(
    document.getElementById("line3"),
    "> Calibrating navigation systems...",
    1600
  );
  typeLine(
    document.getElementById("line4"),
    "> All systems operational [OK]",
    2500
  );

  setTimeout(() => {
    window.location.href = "index.html";
  }, 6000);
}

function typeLine(element, text, delay) {
  setTimeout(() => {
    element.style.opacity = 1;
    let i = 0;
    let typer = setInterval(() => {
      element.textContent = text.substring(0, i);
      i++;
      if (i > text.length) clearInterval(typer);
    }, 25);
  }, delay);
}
