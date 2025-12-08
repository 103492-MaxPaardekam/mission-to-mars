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
