let p1, p2;
let stepSize = 20;

function setup() {
  createCanvas(600, 600);
  p2 = createVector(width / 2, height / 2);
  p1 = p2.copy();
  background(0);
  stroke(255);
  strokeWeight(3);
}

function draw() {
  fill(0, 5);
  noStroke();
  rect(0, 0, width, height);

  const mean = 180;
  const st = 40;
  const angle = radians(randomGaussian() * st + mean);
  const aV = createVector(cos(angle) * stepSize, sin(angle) * stepSize);
  p2.add(aV);

  if (p2.x < -10) p2.x = p1.x = width + 10;
  if (p2.x > width + 10) p2.x = p1.x = -10;
  if (p2.y < -10) p2.y = p1.y = height + 10;
  if (p2.y > height + 10) p2.y = p1.y = -10;

  stroke(255);
  line(p1.x, p1.y, p2.x, p2.y);

  p1.set(p2);
}
