// Basic Drawing Utilities in p5.js
let shapes = [];
let currentTool = "line";
let startX, startY;
let selectedShape = null;

// --- Shape classes ---
class Shape {
  constructor(type) {
    this.type = type;
    this._dragMouseX = 0;
    this._dragMouseY = 0;
  }

  draw() {
    // override
  }
  contains(px, py) {
    return false;
  }
  // prepare for drag: store initial positions
  startDrag(mx, my) {
    this._dragMouseX = mx;
    this._dragMouseY = my;
  }
  // drag to new mouse pos
  dragTo(mx, my) {
    let dx = mx - this._dragMouseX;
    let dy = my - this._dragMouseY;
    this._dragMouseX = mx;
    this._dragMouseY = my;
    this.translate(dx, dy);
  }
  translate(dx, dy) {
    // override
  }

}

class LineShape extends Shape {
  constructor(x1, y1, x2, y2) {
    super('line');
    this.x = x1; this.y = y1; this.x2 = x2; this.y2 = y2;
  }
  draw() {
    line(this.x, this.y, this.x2, this.y2);
  }
  contains(px, py) {
    let d = this.pointLineDist(px, py, this.x, this.y, this.x2, this.y2);
    return d < 5;
  }
  translate(dx, dy) {
    this.x += dx; this.y += dy; this.x2 += dx; this.y2 += dy;
  }

  pointLineDist(px, py, x1, y1, x2, y2) {
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
}

class RectShape extends
  Shape {
  constructor(x, y, w, h) {
    super('rect');
    this.x = x; this.y = y; this.w = w; this.h = h;
  }
  draw() {
    rect(this.x, this.y, this.w, this.h);
  }
  contains(px, py) {
    return px > this.x && px < this.x + this.w && py > this.y && py < this.y + this.h;
  }
  translate(dx, dy) {
    this.x += dx; this.y += dy;
  }
}

class CircleShape extends Shape {
  constructor(x, y, r) {
    super('circle');
    this.x = x; this.y = y; this.r = r;
  }
  draw() {
    ellipse(this.x, this.y, this.r * 2, this.r * 2);
  }
  contains(px, py) {
    return dist(px, py, this.x, this.y) < this.r;
  }
  translate(dx, dy) {
    this.x += dx; this.y += dy;
  }
}

function setup() {
  createCanvas(800, 600);
  noFill();
  strokeWeight(2);
}

function draw() {
  background(240);

  // Draw existing shapes
  for (let s of shapes) {
    stroke(0);
    noFill();
    s.draw();
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
      if (shapes[i].contains(mouseX, mouseY)) {
        selectedShape = shapes[i];
        selectedShape.startDrag(mouseX, mouseY);
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
    // Move selected shape using drag helper
    selectedShape.dragTo(mouseX, mouseY);
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
    return new LineShape(x1, y1, x2, y2);
  } else if (type === "rect") {
    return new RectShape(min(x1, x2), min(y1, y2), abs(x2 - x1), abs(y2 - y1));
  } else if (type === "circle") {
    let r = dist(x1, y1, x2, y2);
    return new CircleShape(x1, y1, r);
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
// old isMouseOverShape logic moved into Shape.contains methods

