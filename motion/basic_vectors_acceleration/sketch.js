// Adapted from "The Nature of Code" by Daniel Shiffman
// Bouncing object with PNG sequence animation using vectors
// https://natureofcode.com/vectors/#the-point-of-vectors

let position;
let prevPosition;
let velocity;
let acceleration;

let frames = [];
const NUM_FRAMES = 7;
let currentIndex = 0;

let fps = 12;
let frameInterval = 1000 / fps;
let lastChange = 0;

maxSpeed = 10; // maximum speed

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
  velocity = createVector(2, 0);
  acceleration = createVector(0.1, 0);
  imageMode(CENTER);
}

function draw() {
  background(255);

  prevPosition = position.copy();
  velocity.add(acceleration);
  velocity.limit(maxSpeed); // limit max speed
  // Update position based on velocity
  position.add(velocity);

  // Bounce off edges
  if (position.x > width || position.x < 0) {
    position.x = 100;
    velocity.x = 2;
  }
  

  // Advance animation frame
  if (millis() - lastChange >= frameInterval) {
    lastChange = millis();
    currentIndex = (currentIndex + 1) % NUM_FRAMES;
  }

  // Draw current image at position
  let img = frames[currentIndex];
  if (img) {
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
