// Animates moving points and visualizes their Delaunay triangulation and Voronoi cells.
// Press V to toggle Voronoi cells and D to toggle Delaunay triangles.
let points = [];
// Each velocity entry corresponds to the point at the same index.
let velocities = [];
let delaunay, voronoi;
let showVoronoi = true;
let showDelaunay = false;

const NUM_POINTS = 20;

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Start with random positions and small random movement vectors.
  for (let i = 0; i < NUM_POINTS; i++) {
    points.push([random(width), random(height)]);
    velocities.push([random(-2, 2), random(-2, 2)]);
  }

  updateTriangulation();
}

function draw() {
  background(0);

  // Move the sites, then rebuild both diagrams from their updated positions.
  movePoints();
  updateTriangulation();

  // Draw the Delaunay triangles when their display toggle is enabled.
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

  // Draw the Voronoi cells when their display toggle is enabled.
  if (showVoronoi) {
    stroke(0, 255, 0, 180);
    noFill();
    for (let cell of voronoi.cellPolygons()) {
      beginShape();
      for (let [x, y] of cell) vertex(x, y);
      endShape(CLOSE);
    }
  }

  // Draw the moving sites on top of the diagram lines.
  noStroke();
  fill(255, 100, 100);
  for (let [x, y] of points) {
    circle(x, y, 8);
  }

  drawInstructions();
}

function movePoints() {
  // Advance every point by its velocity and reverse direction at canvas edges.
  for (let i = 0; i < points.length; i++) {
    points[i][0] += velocities[i][0];
    points[i][1] += velocities[i][1];

    // Bounce off the horizontal and vertical boundaries.
    if (points[i][0] <= 0 || points[i][0] >= width) velocities[i][0] *= -1;
    if (points[i][1] <= 0 || points[i][1] >= height) velocities[i][1] *= -1;
  }
}

function keyPressed() {
  // Toggle each diagram independently; both can be shown at once.
  if (key === 'V' || key === 'v') showVoronoi = !showVoronoi;
  if (key === 'D' || key === 'd') showDelaunay = !showDelaunay;
}

function updateTriangulation() {
  // Delaunay triangulation needs at least three points.
  if (points.length < 3) return;
  // Build the triangulation from the current point coordinates, then clip
  // each corresponding Voronoi cell to the canvas bounds.
  delaunay = d3.Delaunay.from(points);
  voronoi = delaunay.voronoi([0, 0, width, height]);
}

function windowResized() {
  // Keep the visualization fitted to the browser window.
  resizeCanvas(windowWidth, windowHeight);
}

function drawInstructions() {
  // Keep the keyboard shortcuts visible at the bottom of the canvas.
  noStroke();
  fill(255);
  textSize(14);
  text('V: Toggle Voronoi | D: Toggle Delaunay', 10, height - 10);
}
