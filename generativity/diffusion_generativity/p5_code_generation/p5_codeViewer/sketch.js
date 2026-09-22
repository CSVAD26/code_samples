// sketch.js
let socket;
let statusP;
let currentScene = null;

function setup() {
  createCanvas(500, 500);
  noLoop(); // we'll render on demand
  statusP = createP("Connect to server...");

  socket = new WebSocket("ws://localhost:5000");
  socket.onopen = () => {
    statusP.html("Connected. Enter a prompt below.");
  };

  socket.onmessage = (evt) => {
    let msg = JSON.parse(evt.data);
    if (msg.error) {
      statusP.html("Server error: " + msg.error);
      console.error(msg);
      return;
    }
    if (msg.scene) {
      currentScene = msg.scene;
      statusP.html("Scene received — drawing...");
      drawSceneSafely(currentScene);
    } else {
      statusP.html("Unknown response");
      console.log(msg);
    }
  };

  // simple UI
  const promptInput = createInput("a field of tulips, stylized, bright colors", 400);
  promptInput.position(10, 10);
  const btn = createButton("Generate");
  btn.position(promptInput.x + promptInput.width + 8, 10);
  btn.mousePressed(() => {
    const prompt = promptInput.value().trim();
    if (!prompt) {
      statusP.html("Prompt empty");
      return;
    }
    statusP.html("Sending prompt...");
    socket.send(prompt);
  });
}

function drawSceneSafely(scene) {
  // Basic safety: clamp canvas size to our canvas
  const canvasW = 500
  const canvasH = 500

  // background
  const bg = sanitizeColor(scene.canvas?.background) || "#ffffff";
  resizeCanvas(canvasW, canvasH);
  background(bg);

  // shapes
  const shapes = Array.isArray(scene.shapes) ? scene.shapes : [];
  for (const s of shapes) {
    try {
      drawShapeSafe(s, canvasW, canvasH);
    } catch (e) {
      console.error("Shape draw error:", e, s);
      // skip bad shapes
    }
  }
  // finished
  statusP.html("Draw complete");
}

function drawShapeSafe(s, canvasW, canvasH) {
  const type = s.type;
  if (typeof type !== "string") return;

  const fillCol = sanitizeColor(s.fill);
  const strokeCol = sanitizeColor(s.stroke);
  const sw = clampNumber(s.strokeWeight, 0, 50, 1);
  const opacity = clampNumber(s.opacity, 0, 1, 1);

  if (fillCol) {
    push();
    tint(255, opacity*255); // not used for fill() but kept for consistency
    fill(fillCol);
  } else {
    noFill();
  }

  if (strokeCol) {
    stroke(strokeCol);
    strokeWeight(sw);
  } else {
    noStroke();
  }

  // switch by type
  if (type === "ellipse") {
    const x = clampNumber(s.x, 0, canvasW, canvasW/2);
    const y = clampNumber(s.y, 0, canvasH, canvasH/2);
    const w = clampNumber(s.w, 0, canvasW, canvasW/4);
    const h = clampNumber(s.h, 0, canvasH, canvasH/4);
    ellipse(x, y, w, h);
  } else if (type === "rect") {
    const x = clampNumber(s.x, 0, canvasW, canvasW/4);
    const y = clampNumber(s.y, 0, canvasH, canvasH/4);
    const w = clampNumber(s.w, 0, canvasW, canvasW/4);
    const h = clampNumber(s.h, 0, canvasH, canvasH/4);
    rectMode(CENTER);
    rect(x, y, w, h);
  } else if (type === "line") {
    const x1 = clampNumber(s.x, 0, canvasW, 0);
    const y1 = clampNumber(s.y, 0, canvasH, 0);
    const x2 = clampNumber(s.x2, 0, canvasW, canvasW);
    const y2 = clampNumber(s.y2, 0, canvasH, canvasH);
    line(x1, y1, x2, y2);
  } else if (type === "triangle" || type === "polygon") {
    const pts = Array.isArray(s.points) ? s.points : [];
    if (pts.length < 3) { /* invalid */ }
    else {
      beginShape();
      for (const p of pts) {
        const px = clampNumber(p[0], 0, canvasW, canvasW/2);
        const py = clampNumber(p[1], 0, canvasH, canvasH/2);
        vertex(px, py);
      }
      endShape(CLOSE);
    }
  } else {
    // unknown type — skip
  }

  if (fillCol) pop();
}

// ---------- helper sanitizers ----------
function clampNumber(value, minV, maxV, defaultV) {
  const n = Number(value);
  if (Number.isFinite(n)) return Math.min(Math.max(n, minV), maxV);
  return defaultV;
}

function sanitizeColor(col) {
  if (!col || typeof col !== "string") return null;
  col = col.trim();
  // allow hex like #RRGGBB or #RGB
  if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(col)) return col;
  // allow rgba(r,g,b,a)
  if (/^rgba\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*(0|1|0?\.\d+)\s*\)$/.test(col))
    return col;
  // not allowed otherwise
  return null;
}
