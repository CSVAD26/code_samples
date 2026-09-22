let showGrid = false;
let margin;
let cols = 2;
let rows = 4;
let partitions = [];
let numPartitions = 4;

function setup() {
  createCanvas(450, 600);
  colorMode(HSB);
  margin = height / 20;
  //generateRandomPartitions();
}

function draw() {
  background(240);

  // Draw random partitions
  noStroke();
  for (let p of partitions) {
    fill(p.color);
    rect(p.x, p.y, p.w, p.h);
  }

  // Optional overlay grid
  if (showGrid) {
    drawOverlayGrid();
  }
}

function mousePressed() {
  // Toggle grid visibility on mouse click
  showGrid = !showGrid;
}

function keyPressed() {
  numPartitions = round(random(2, 10));
  // Regenerate random partitions on any key press
  generateRandomPartitions();
}

function generateRandomPartitions() {
  partitions = [];

  const totalInnerWidth = width - (cols + 1) * margin;
  const totalInnerHeight = height - (rows + 1) * margin;
  const cellW = totalInnerWidth / cols;
  const cellH = totalInnerHeight / rows;

  // Create a grid matrix to track used cells
  let used = Array(rows).fill().map(() => Array(cols).fill(false));

  let attempts = 0;
  while (partitions.length < numPartitions && attempts < 50) {
    attempts++;

    // Random width/height in grid units
    let wCells = floor(random(1, cols + 1));
    let hCells = floor(random(1, rows + 1));

    // Random top-left grid position
    let i = floor(random(0, cols - wCells + 1));
    let j = floor(random(0, rows - hCells + 1));

    // Check for overlap
    let overlaps = false;
    for (let y = j; y < j + hCells; y++) {
      for (let x = i; x < i + wCells; x++) {
        if (used[y][x]) overlaps = true;
      }
    }

    if (overlaps) continue;

    // Mark region as used
    for (let y = j; y < j + hCells; y++) {
      for (let x = i; x < i + wCells; x++) {
        used[y][x] = true;
      }
    }

    // Convert grid position to pixel space
    let x = margin + i * (cellW + margin);
    let y = margin + j * (cellH + margin);
    let w = wCells * cellW + (wCells - 1) * margin;
    let h = hCells * cellH + (hCells - 1) * margin;

    // Store partition
    partitions.push({
      x,
      y,
      w,
      h,
      color: color(random(360), 60, 80)
    });
  }
}

function drawOverlayGrid() {
  const totalInnerWidth = width - (cols + 1) * margin;
  const totalInnerHeight = height - (rows + 1) * margin;
  const cellW = totalInnerWidth / cols;
  const cellH = totalInnerHeight / rows;

  stroke(0, 90, 90);
  strokeWeight(2);
  noFill();

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = margin + i * (cellW + margin);
      let y = margin + j * (cellH + margin);
      rect(x, y, cellW, cellH);
    }
  }
}
