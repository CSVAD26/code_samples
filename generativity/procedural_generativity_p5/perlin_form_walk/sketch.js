let p1, p2;
let stepSize = 1;
let noiseScale = 100;
let noiseStrength = 10;

let noiseZ = 0;
let noiseZVelocity = 0.01;

const formResolution = 15;
const initRadius = 150;
let x = [];
let y = [];

function setup() {
  createCanvas(600, 600);
  p2 = createVector(width / 2, height / 2);
  p1 = p2.copy();

  const angleStep = TWO_PI / formResolution;
  for (let i = 0; i < formResolution; i++) {
    x[i] = cos(angleStep * i) * initRadius;
    y[i] = sin(angleStep * i) * initRadius;
  }

  background(0);
}

function draw() {
  fill(0, 4);
  noStroke();
  rect(0, 0, width, height);

  stroke(255, 90);

  const angle = noise(p2.x / noiseScale, p2.y / noiseScale, noiseZ) * noiseStrength;
  const aV = createVector(cos(angle) * stepSize, sin(angle) * stepSize);
  p2.add(aV);

  if (p2.x < -10) p2.x = p1.x = width + 10;
  if (p2.x > width + 10) p2.x = p1.x = -10;
  if (p2.y < -10) p2.y = p1.y = height + 10;
  if (p2.y > height + 10) p2.y = p1.y = -10;

  for (let i = 0; i < formResolution; i++) {
    x[i] += random(-stepSize, stepSize);
    y[i] += random(-stepSize, stepSize);
  }

  strokeWeight(0.75);
  noFill();

  beginShape();
  curveVertex(x[formResolution - 1] + p2.x, y[formResolution - 1] + p2.y);
  for (let i = 0; i < formResolution; i++) {
    curveVertex(x[i] + p2.x, y[i] + p2.y);
  }
  curveVertex(x[0] + p2.x, y[0] + p2.y);
  curveVertex(x[1] + p2.x, y[1] + p2.y);
  endShape();

  p1.set(p2);
  noiseZ += noiseZVelocity;
}
