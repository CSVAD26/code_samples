// Basic Drawing Utilities in p5.js
let shapes = [];
let currentTool = "line";
let startX, startY;
let selectedShape = null;
let dragMouseX, dragMouseY;

function setup() {
  createCanvas(800, 600);
  noFill();
  strokeWeight(2);
}

function draw() {
  background(240);

  // Draw existing shapes
  for (let s of shapes) {
    drawShape(s);
  }

  // Preview shape while drawing
  if (mouseIsPressed && selectedShape == null && currentTool !== "select") {
    drawPreview();
  }

  // Optional: display current tool
  noStroke();
  fill(0);
  textSize(14);
  text(`Tool: ${currentTool} | Press 1 for line mode 2 for rect mode 3 for circle mode, or S for select mode`, 10, height - 10);
}

function mousePressed() {
  if (currentTool === "select") {
    // Try to select a shape
    for (let i = shapes.length - 1; i >= 0; i--) {
      if (isMouseOverShape(shapes[i])) {
        selectedShape = shapes[i];
        dragMouseX = mouseX;
        dragMouseY = mouseY;
        break;
      }
    }
  } else {
    // Start drawing new shape
    startX = mouseX;
    startY = mouseY;
  }
}

function mouseDragged() {
  if (selectedShape) {
    // Move selected shape
     let dx = mouseX - dragMouseX;
     let dy = mouseY - dragMouseY;
    dragMouseX = mouseX;
    dragMouseY = mouseY;
    selectedShape.x += dx;
    selectedShape.y += dy;
    if(selectedShape.type === "line"){
      selectedShape.x2 += dx;
      selectedShape.y2 += dy;
    }
  }
}

function mouseReleased() {
  if (selectedShape) {
    selectedShape = null;
  } else if (currentTool !== "select") {
    let newShape = createShape(currentTool, startX, startY, mouseX, mouseY);
    shapes.push(newShape);
  }
}

function keyPressed() {
  if (key === '1') currentTool = "line";
  if (key === '2') currentTool = "rect";
  if (key === '3') currentTool = "circle";
  if (key === 'S' || key === 's') currentTool = "select";
}

// --- Helper Functions ---
function createShape(type, x1, y1, x2, y2) {
  if (type === "line") {
    return { type: "line", x: x1, y: y1, x2: x2, y2: y2 };
  } else if (type === "rect") {
    return { type: "rect", x: min(x1, x2), y: min(y1, y2), w: abs(x2 - x1), h: abs(y2 - y1) };
  } else if (type === "circle") {
    let r = dist(x1, y1, x2, y2);
    return { type: "circle", x: x1, y: y1, r: r };
  }
}

function drawShape(s) {
  stroke(0);
  noFill();
  if (s.type === "line") {
    line(s.x, s.y, s.x2, s.y2);
  } else if (s.type === "rect") {
    rect(s.x, s.y, s.w, s.h);
  } else if (s.type === "circle") {
    ellipse(s.x, s.y, s.r * 2, s.r * 2);
  }
}

function drawPreview() {
  stroke(100);
  if (currentTool === "line") {
    line(startX, startY, mouseX, mouseY);
  } else if (currentTool === "rect") {
    rect(min(startX, mouseX), min(startY, mouseY),
         abs(mouseX - startX), abs(mouseY - startY));
  } else if (currentTool === "circle") {
    let r = dist(startX, startY, mouseX, mouseY);
    ellipse(startX, startY, r * 2, r * 2);
  }
}

function isMouseOverShape(s) {
  if (s.type === "line") {
    // distance from mouse to line segment
    let d = pointLineDist(mouseX, mouseY, s.x, s.y, s.x2, s.y2);
    return d < 5;
  } else if (s.type === "rect") {
    return mouseX > s.x && mouseX < s.x + s.w &&
           mouseY > s.y && mouseY < s.y + s.h;
  } else if (s.type === "circle") {
    return dist(mouseX, mouseY, s.x, s.y) < s.r;
  }
}

function pointLineDist(px, py, x1, y1, x2, y2) {
  let A = px - x1;
  let B = py - y1;
  let C = x2 - x1;
  let D = y2 - y1;

  let dot = A * C + B * D;
  let len_sq = C * C + D * D;
  let param = len_sq !== 0 ? dot / len_sq : -1;

  let xx, yy;
  if (param < 0) { xx = x1; yy = y1; }
  else if (param > 1) { xx = x2; yy = y2; }
  else { xx = x1 + param * C; yy = y1 + param * D; }

  let dx = px - xx;
  let dy = py - yy;
  return Math.sqrt(dx * dx + dy * dy);
}
