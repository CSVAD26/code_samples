// SpikeBrush Example
// Creates triangular spikes that point in the direction of mouse movement
// Port from Processing DynamicBrushes library

let dynamicBrushes;

function setup() {
  createCanvas(1056, 816);
  background(255);
  
  // Initialize DynamicBrushes
  dynamicBrushes = new DynamicBrushes(window);
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
  dynamicBrushes.stroke(0, 0, 0);
  dynamicBrushes.fill(0, 0, 0);
  
  // Create a spike pointing in the direction of movement
  dynamicBrushes.pushMatrix();
  dynamicBrushes.translate(mouseX, mouseY);
  dynamicBrushes.rotate(TWO_PI - theta);
  
  // Draw triangle with random spike length
  let spikeLength = random(10, 100);
  dynamicBrushes.triangle(-10, 0, 10, 0, 0, spikeLength);
  
  dynamicBrushes.popMatrix();
}

function keyPressed() {
  if (key === ' ') {
    // Save as SVG (requires p5.svg library)
    dynamicBrushes.saveSVG();
  } else if (key === 'c' || key === 'C') {
    // Clear the canvas
    dynamicBrushes.clear();
  }
}
