// Basic Drawing Example using DrawingManager Addon
// This version uses p5.prototype extension methods

let currentShape = null;

function setup() {
  createCanvas(800, 600);
  background(255);
  
  // Initialize the drawing manager
  initDynamicBrushes();
  
  // Set drawing properties
  dbStroke(0, 100, 200);
  dbStrokeWeight(2);
  dbNoFill();
}

function draw() {
  // No need to redraw, shapes are drawn as they're created
}

function mousePressed() {
  // Start a new shape when mouse is pressed
  currentShape = dbAddShape();
  currentShape.addVertex(mouseX, mouseY);
}

function mouseDragged() {
  // Continue adding vertices while dragging
  if (currentShape) {
    currentShape.addVertex(mouseX, mouseY);
  }
}

function mouseReleased() {
  // Finish the current shape
  currentShape = null;
}

function keyPressed() {
  if (key === 'c' || key === 'C') {
    // Clear the canvas
    dbClear();
  } else if (key === ' ') {
    // Save as SVG (requires p5.svg library)
    dbSaveSVG();
  }
}
