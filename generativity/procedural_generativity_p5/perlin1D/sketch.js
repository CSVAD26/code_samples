let xoff = 0.0;

function setup() {
  createCanvas(600, 600);
}

function draw() {
  background(204);
  xoff += 0.01;
  const n = noise(xoff) * width;
  stroke(0);
  line(n, 0, n, height);
}
