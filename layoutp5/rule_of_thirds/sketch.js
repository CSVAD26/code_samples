let xSlider, ySlider, wSlider, hSlider;
let cols = 3, rows = 3;
let cellColors = [];

function setup() {
  createCanvas(800, 600);
  colorMode(HSB);
  textAlign(CENTER, CENTER);
  textSize(14);

  createP("Rectangle size (width, height):");
  wSlider = createSlider(50, width, 400, 1);
  hSlider = createSlider(50, height, 300, 1);

  // Initialize colors for each of the 3×3 cells
  for (let i = 0; i < cols * rows; i++) {
    cellColors[i] = color(0, 0, 95); // background (light gray)
  }
}

function draw() {
  background(0, 0, 95);
  noStroke();

  // Get rectangle parameters
   let w = wSlider.value();
  let h = hSlider.value();
  let x = width/2- w/2;
  let y = height/2 - h/2;

  // Dimensions of each subdivision
  let cellW = w / cols;
  let cellH = h / rows;

  // Draw the 3×3 grid with stored colors
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

  // Labels
  noStroke();
  fill(0);
  text(`Width: ${w} px`, x + w / 2, y - 20);
  text(`Height: ${h} px`, x - 60, y + h / 2);
  text("Click a cell to color it blue", width / 2, height - 30);
}

function mousePressed() {
  // Get current rectangle position and size
  let w = wSlider.value();
  let h = hSlider.value();
  let x = width/2- w/2;
  let y = height/2 - h/2;

  // Check if click is inside the rectangle
  if (mouseX < x || mouseX > x + w || mouseY < y || mouseY > y + h) return;

  // Which cell was clicked?
  let cellW = w / cols;
  let cellH = h / rows;
  let i = floor((mouseX - x) / cellW);
  let j = floor((mouseY - y) / cellH);
  let index = j * cols + i;

  // Toggle cell color
  let current = cellColors[index];
  let blue = color(210, 80, 80);
  let bg = color(0, 0, 95);
  cellColors[index] = (red(current) === red(blue) && green(current) === green(blue))
    ? bg
    : blue;
}
