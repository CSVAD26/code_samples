let points = [];
let velocities = [];
let delaunay, voronoi;
let showVoronoi = true;
let showDelaunay = false;

const NUM_POINTS = 20;

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Initialize random points and velocities
  for (let i = 0; i < NUM_POINTS; i++) {
    points.push([random(width), random(height)]);
    velocities.push([random(-2, 2), random(-2, 2)]);
  }

  updateTriangulation();
}

function draw() {
  background(0);

  movePoints();
  updateTriangulation();

  // Draw Delaunay
  if (showDelaunay) {
    stroke(255, 150);
    strokeWeight(1);
    noFill();
    for (let tri of delaunay.trianglePolygons()) {
      beginShape();
      for (let [x, y] of tri) vertex(x, y);
      endShape(CLOSE);
    }
  }

  // Draw Voronoi
  if (showVoronoi) {
    stroke(0, 255, 0, 180);
    noFill();
    for (let cell of voronoi.cellPolygons()) {
      beginShape();
      for (let [x, y] of cell) vertex(x, y);
      endShape(CLOSE);
    }
  }

  // Draw points
  noStroke();
  fill(255, 100, 100);
  for (let [x, y] of points) {
    circle(x, y, 8);
  }

  drawInstructions();
}

function movePoints() {
  for (let i = 0; i < points.length; i++) {
    points[i][0] += velocities[i][0];
    points[i][1] += velocities[i][1];

    // bounce off edges
    if (points[i][0] <= 0 || points[i][0] >= width) velocities[i][0] *= -1;
    if (points[i][1] <= 0 || points[i][1] >= height) velocities[i][1] *= -1;
  }
}

function keyPressed() {
  if (key === 'V' || key === 'v') showVoronoi = !showVoronoi;
  if (key === 'D' || key === 'd') showDelaunay = !showDelaunay;
}

function updateTriangulation() {
  if (points.length < 3) return;
  delaunay = d3.Delaunay.from(points);
  voronoi = delaunay.voronoi([0, 0, width, height]);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function drawInstructions() {
  noStroke();
  fill(255);
  textSize(14);
  text('V: Toggle Voronoi | D: Toggle Delaunay', 10, height - 10);
}
