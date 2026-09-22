let img;
let cols = 3, rows = 3;
let cellColors = [];
let input;
let x = 0, y = 0;
let w = 0, h = 0;

function setup() {
  createCanvas(800, 600);
  colorMode(HSB);
  textAlign(CENTER, CENTER);
  textSize(14);

  // Upload button
  createP("Upload an image:");
  input = createFileInput(handleFile);
  input.style('margin-bottom', '10px');

  // Initialize transparent colors for 3×3 grid cells
  for (let i = 0; i < cols * rows; i++) {
    cellColors[i] = color(0, 0, 95, 0.2); // light gray, 20% opacity
  }
}

function draw() {
  background(0, 0, 95);

  if (img) {
    image(img, x, y, w, h);
    drawGrid();
  } else {
    fill(0);
    text("Upload an image to begin", width / 2, height / 2);
  }
}

function handleFile(file) {
  if (file.type === 'image') {
    img = loadImage(file.data, () => {
      // Scale image to fit canvas while preserving aspect ratio
      let scale = min(width / img.width, height / img.height);
      w = img.width * scale;
      h = img.height * scale;
      x = (width - w) / 2;
      y = (height - h) / 2;
    });
  } else {
    img = null;
  }
}

function drawGrid() {
  noStroke();

  let cellW = w / cols;
  let cellH = h / rows;

  // Draw transparent overlay cells
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let index = j * cols + i;
      fill(cellColors[index]);
      rect(x + i * cellW, y + j * cellH, cellW, cellH);
    }
  }

  // Draw grid lines
  stroke(0);
  strokeWeight(2);
  noFill();
  rect(x, y, w, h);
  for (let i = 1; i < cols; i++) {
    line(x + i * cellW, y, x + i * cellW, y + h);
  }
  for (let j = 1; j < rows; j++) {
    line(x, y + j * cellH, x + w, y + j * cellH);
  }

  // Label
  noStroke();
  fill(0);
  text("Click a cell to toggle blue overlay", width / 2, height - 20);
}

function mousePressed() {
  if (!img) return;

  // Check if click is inside the image rectangle
  if (mouseX < x || mouseX > x + w || mouseY < y || mouseY > y + h) return;

  // Identify clicked cell
  let cellW = w / cols;
  let cellH = h / rows;
  let i = floor((mouseX - x) / cellW);
  let j = floor((mouseY - y) / cellH);
  let index = j * cols + i;

  // Toggle between semi-transparent gray and semi-transparent blue
  let current = cellColors[index];
  let blue = color(210, 80, 80, 0.4); // blue with 40% opacity
  let gray = color(0, 0, 95, 0.2); // gray with 20% opacity

  if (hue(current) === hue(blue)) {
    cellColors[index] = gray;
  } else {
    cellColors[index] = blue;
  }
}
