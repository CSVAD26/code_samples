// Particle system of multiple ButterflyMover objects
// Reuses PNG frames from the forces_animation example (assets/frame_1..7.png)

let frames = [];
const NUM_FRAMES = 7;
let butterflies = [];
let fps = 12;

function preload() {
  for (let i = 1; i <= NUM_FRAMES; i++) {
    frames.push(loadImage(`../forces_animation/assets/frame_${i}.png`));
  }
}

function setup() {
  createCanvas(800, 400);
  imageMode(CENTER);
  // spawn a few butterflies
  for (let i = 0; i < 12; i++) {
    let x = random(width);
    let y = random(height);
    let m = random(0.6, 1.4);
    let b = new ButterflyMover(x, y, m, NUM_FRAMES, fps);
    // give initial random velocity
    b.velocity = p5.Vector.random2D().mult(random(0.5, 2));
    butterflies.push(b);
  }

  createP('Click to add wind to the right.');
}

function draw() {
  background(240);

  // perlin-like gentle noise force applied to each butterfly
  let t = millis() * 0.0005;
  for (let b of butterflies) {
    let nx = noise(b.position.x * 0.01, t) - 0.5;
    let ny = noise(b.position.y * 0.01, t + 100) - 0.5;
    let flutter = createVector(nx, ny).mult(0.2);
    b.applyForce(flutter);

    if (mouseIsPressed) {
      b.applyForce(createVector(0.2, 0));
    }

    b.update();
    b.checkEdges();
    b.draw(frames);
  }
}

function mousePressed() {
  // spawn a new butterfly at mouse
  let b = new ButterflyMover(mouseX, mouseY, random(0.6, 1.4), NUM_FRAMES, fps);
  b.velocity = p5.Vector.random2D().mult(random(0.5, 2));
  butterflies.push(b);
}
