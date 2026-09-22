let dynamicBrushes;
let shape;
let distInterval;
let totalDist = 0;
let dripRate = 1;
let drips = [];

function setup() {
  createCanvas(1056, 816);
  background(255);
  dynamicBrushes = new DynamicBrushes(window);
  dynamicBrushes.strokeWeight(5);
  distInterval = random(10, 100);
}

function draw() {
  // Iterate backwards through the drip array list so we
  // don't encounter any issues when removing drips
  for (let i = drips.length - 1; i >= 0; i--) {
    let drip = drips[i];
    
    // Increase the delta of the drip on the y axis by
    // the interval specified in the dripRate variable
    drip.addDelta(0, dripRate);
    
    // Stop the drip by removing it from the array list
    // when it is off the bottom of the canvas
    if (drip.position.y >= height) {
      drips.splice(i, 1);
    }
  }
}

function keyPressed() {
  // Save SVG when spacebar is pressed
  if (key === ' ') {
    dynamicBrushes.saveSVG();
  }
  // Clear canvas when 'c' is pressed
  if (key === 'c') {
    dynamicBrushes.clear();
  }
  // Stop drips when 's' is pressed
  if (key === 's') {
    drips = [];
  }
}

function mousePressed() {
  totalDist = 0;
  shape = dynamicBrushes.addShape();
}

function mouseDragged() {
  dynamicBrushes.stroke(0, 0, 0);
  shape.addVertex(mouseX, mouseY);
  
  let v = createVector(mouseX - pmouseX, mouseY - pmouseY);
  totalDist += v.mag();
  
  // Condition to check if total distance is greater than the distance interval
  if (totalDist >= distInterval) {
    // Reset the total dist
    totalDist = 0;
    // Calculate a new random distance interval
    distInterval = random(10, 100);
    
    // Create a new DShape object for the new drip
    // Add a vertex at the current mouse position
    // Add it to the drip array list
    let drip = dynamicBrushes.addShape();
    drip.addVertex(mouseX, mouseY);
    drips.push(drip);
  }
}
