// SpikeBrush Example (Addon Version)
// Creates triangular spikes that point in the direction of mouse movement
// Port from Processing DrawingManager library

function setup() {
  createCanvas(1056, 816);
  background(255);
  
  // Initialize DrawingManager addon
  initDynamicBrushes();
}

function draw() {
  // No continuous drawing needed
}

function mouseDragged() {
  // Calculate distance moved
  let xDist = mouseX - pmouseX;
  let yDist = mouseY - pmouseY;
  
  // Calculate angle of movement
  let theta = atan2(xDist, yDist);
  
  // Set drawing properties
  dbStroke(0, 0, 0);
  dbFill(0, 0, 0);
  
  // Create a spike pointing in the direction of movement
  dbPushMatrix();
  dbTranslate(mouseX, mouseY);
  dbRotate(TWO_PI - theta);
  
  // Draw triangle with random spike length
  let spikeLength = random(10, 100);
  dbTriangle(-10, 0, 10, 0, 0, spikeLength);
  
  dbPopMatrix();
}

function keyPressed() {
  if (key === ' ') {
    // Save as SVG (requires p5.svg library)
    dbSaveSVG();
  } else if (key === 'c' || key === 'C') {
    // Clear the canvas
    dbClear();
  }
}
