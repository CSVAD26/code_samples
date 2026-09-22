let p1, p2;
let stepSize = 20;
let angle = 0;

function setup() {
  createCanvas(600, 600);
  p2 = createVector(width / 2, height / 2);
  p1 = p2.copy();
  background(0);
  stroke(255);
  strokeWeight(3);
}

function draw() {
  angle = random(0, TWO_PI);
  const constrainedAngle = toQuadrant(angle);
  const aV = createVector(cos(constrainedAngle) * stepSize, sin(constrainedAngle) * stepSize);
  p2.add(aV);

  if (p2.x < -10) p2.x = p1.x = width + 10;
  if (p2.x > width + 10) p2.x = p1.x = -10;
  if (p2.y < -10) p2.y = p1.y = height + 10;
  if (p2.y > height + 10) p2.y = p1.y = -10;

  line(p1.x, p1.y, p2.x, p2.y);

  p1.set(p2);
}

function toQuadrant(v) {
  if (v <= TWO_PI * 0.25) {
    return TWO_PI * 0.25;
  } else if (v > TWO_PI * 0.25 && v <= TWO_PI * 0.5) {
    return TWO_PI * 0.5;
  } else if (v > TWO_PI * 0.5 && v <= TWO_PI * 0.75) {
    return TWO_PI * 0.75;
  } else {
    return TWO_PI;
  }
}
