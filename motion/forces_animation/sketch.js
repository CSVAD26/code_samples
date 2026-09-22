// Adapted from "The Nature of Code" by Daniel Shiffman
// Bouncing object with PNG sequence animation using vectors
// https://natureofcode.com/vectors/#the-point-of-vectors

let butterflyMover;

let frames = [];
const NUM_FRAMES = 7;
let currentIndex = 0;

let fps = 12;
let frameInterval = 1000 / fps;
let lastChange = 0;
let xoffset = 0;

function preload() {
  // Load 7 image frames
  for (let i = 1; i <= NUM_FRAMES; i++) {
    frames.push(loadImage(`assets/frame_${i}.png`));
  }
}

function setup() {
  createCanvas(640, 240);
  imageMode(CENTER);
  butterflyMover = new ButterflyMover(100,100,1,NUM_FRAMES,fps);
  createP('Click mouse to apply wind force.');

}

function draw() {
  background(255);
  let xNoise = noise(xoffset)*0.01
  let yNoise = noise(xoffset+1000)*0.01
  console.log(xNoise);
  xoffset += random(0.001,-0.001);
  let flapping = createVector(xNoise,yNoise);
  butterflyMover.applyForce(flapping);
  if (mouseIsPressed) {
    let wind = createVector(0.1, 0);
    butterflyMover.applyForce(wind);
  }
  butterflyMover.update();
  
let img = frames[currentIndex];
  if (img) {
    const maxSize = 60; // max displayed width or height
    let ratio = min(maxSize / img.width, maxSize / img.height);
    let w = img.width * ratio * butterflyMover.mass;
    let h = img.height * ratio * butterflyMover.mass;
    push();
    translate(butterflyMover.position.x, butterflyMover.position.y);
    rotate(butterflyMover.angle + PI/2); // rotate to align with path direction
    image(img, 0, 0,w,h);
    pop();
  }

  butterflyMover.checkEdges();

}
