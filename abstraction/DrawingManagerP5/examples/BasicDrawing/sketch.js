let dynamicBrushes;
let shape;

function setup() {
  createCanvas(800, 600);
  background(255);
  dynamicBrushes = new DynamicBrushes(window);
  dynamicBrushes.strokeWeight(3);
}

function draw() {
  // Drawing happens in mouse events
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
}

function mousePressed() {
  // Start a new shape when mouse is pressed
  shape = dynamicBrushes.addShape();
  dynamicBrushes.stroke(0, 0, 0);
}

function mouseDragged() {
  // Add vertices as mouse is dragged
  shape.addVertex(mouseX, mouseY);
}
