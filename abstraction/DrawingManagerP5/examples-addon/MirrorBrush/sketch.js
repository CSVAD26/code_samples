// Mirror Brush Example using DrawingManager Addon
// This version uses p5.prototype extension methods

let currentShape = null;
let mirrorShape = null;

function setup() {
  createCanvas(800, 600);
  background(255);
  
  // Initialize the drawing manager
  initDynamicBrushes();
  
  // Draw a center line to show the mirror axis
  stroke(200);
  strokeWeight(1);
  line(width/2, 0, width/2, height);
}

function draw() {
  // No need to redraw, shapes are drawn as they're created
}

function mousePressed() {
  // Create the main shape (blue)
  dbStroke(0, 100, 200);
  dbStrokeWeight(2);
  dbNoFill();
  currentShape = dbAddShape();
  currentShape.addVertex(mouseX, mouseY);
  
  // Create the mirrored shape (red)
  dbStroke(200, 50, 50);
  mirrorShape = dbAddShape();
  
  // Set up mirror transformation
  mirrorShape.pushMatrix();
  mirrorShape.translate(width, 0);
  mirrorShape.scale(-1, 1);
  
  mirrorShape.addVertex(mouseX, mouseY);
}

function mouseDragged() {
  if (currentShape && mirrorShape) {
    // Add vertex to main shape
    currentShape.addVertex(mouseX, mouseY);
    
    // Add same vertex to mirror shape (transformation will flip it)
    mirrorShape.addVertex(mouseX, mouseY);
  }
}

function mouseReleased() {
  if (mirrorShape) {
    mirrorShape.popMatrix();
  }
  currentShape = null;
  mirrorShape = null;
}

function keyPressed() {
  if (key === 'c' || key === 'C') {
    // Clear and redraw center line
    dbClear();
    stroke(200);
    strokeWeight(1);
    line(width/2, 0, width/2, height);
  } else if (key === ' ') {
    // Save as SVG (requires p5.svg library)
    dbSaveSVG();
  }
}
