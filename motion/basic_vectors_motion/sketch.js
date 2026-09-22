// Adapted from "The Nature of Code" by Daniel Shiffman
// Animated sequence moving across the screen with position and velocity vectors
// https://natureofcode.com/vectors/#the-point-of-vectors

let position;
let prevPosition;
let velocity;

let frames = [];
const NUM_FRAMES = 7;
let currentIndex = 0;

let fps = 12;
let frameInterval = 1000 / fps;
let lastChange = 0;

function preload() {
  // Load 7 image frames
  for (let i = 1; i <= NUM_FRAMES; i++) {
    frames.push(loadImage(`assets/frame_${i}.png`));
  }
}

function setup() {
  createCanvas(640, 240);
  position = createVector(100, 100);
  prevPosition = createVector(position.x, position.y);
  velocity = createVector(2, 2);
  imageMode(CENTER);
}

function draw() {
  background(255);

  prevPosition = position.copy();
  // Update position based on velocity
  position.add(velocity);

  // return to start if off screen
  if (position.x > width || position.x < 0) {
    position.x = 100;
  }
  


  // Advance animation frame
  if (millis() - lastChange >= frameInterval) {
    lastChange = millis();
    currentIndex = (currentIndex + 1) % NUM_FRAMES;
  }

  // Draw current image at position
  let img = frames[currentIndex];
  if (img) {
    //resize to fit image within canvas size
    const maxSize = 60; // max displayed width or height
    let ratio = min(maxSize / img.width, maxSize / img.height);
    let w = img.width * ratio;
    let h = img.height * ratio;
    push();
    translate(position.x, position.y);
    rotate(PI/2); // rotate to align with path direction
    image(img, 0, 0,w,h);
    pop();
  }
}
