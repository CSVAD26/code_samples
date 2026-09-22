let p, pOld;
let stepSize = 10;

function setup() {
  createCanvas(600, 600);
  p = createVector(width / 2, height / 2);
  pOld = p.copy();
  background(0);
}

function draw() {
  fill(0, 10);
  noStroke();
  rect(0, 0, width, height);

  stroke(255, 90);

  const angle = random(0, TWO_PI);
  p.x += cos(angle) * stepSize;
  p.y += sin(angle) * stepSize;

  if (p.x < -10) p.x = pOld.x = width + 10;
  if (p.x > width + 10) p.x = pOld.x = -10;
  if (p.y < -10) p.y = pOld.y = height + 10;
  if (p.y > height + 10) p.y = pOld.y = -10;

  strokeWeight(3);
  line(pOld.x, pOld.y, p.x, p.y);

  pOld.set(p);
}
