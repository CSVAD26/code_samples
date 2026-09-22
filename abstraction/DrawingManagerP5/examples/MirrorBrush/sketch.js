let dynamicBrushes;
let shape;
let mirrorShape;

function setup() {
  createCanvas(800, 600);
  background(255);
  dynamicBrushes = new DynamicBrushes(window);
  dynamicBrushes.strokeWeight(2);
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
  // Create the main shape
  dynamicBrushes.stroke(0, 0, 255);
  shape = dynamicBrushes.addShape();
  
  // Create a mirrored version
  dynamicBrushes.stroke(255, 0, 0);
  mirrorShape = dynamicBrushes.addShape();
  
  
  // Set up transformation for mirroring
  mirrorShape.pushMatrix();
  mirrorShape.translate(0, height);
  mirrorShape.scale(1, -1);
}

function mouseDragged() {
  // Add vertex to main shape
  shape.addVertex(mouseX, mouseY);
  
  // Add same vertex to mirror shape (transformation will flip it)
  mirrorShape.addVertex(mouseX, mouseY);
}

function mouseReleased() {
  // Close the transformation
  if (mirrorShape) {
    mirrorShape.popMatrix();
  }
}
