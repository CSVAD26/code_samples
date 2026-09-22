let seed;
const seedWidth = 200;
const seedHeight = 325;

function preload() {
  seed = loadImage('seed.svg');
}

function setup() {
  createCanvas(1000, 1000);
  noLoop();
}

function draw() {
  background(0);
  dandelion(200, 80, 200, 200);
}

function dandelion(seedCount, sd, xMean, yMean) {
  for (let i = 0; i < seedCount; i++) {
    const xVal = randomGaussian();
    const yVal = randomGaussian();

    const x = xVal * sd + xMean;
    const y = yVal * sd + yMean;

    const origin = createVector(xMean, yMean);
    const delta = createVector(xMean - x, yMean - y);

    const theta = delta.heading();
    const r = delta.mag();
    const scale = map(r, 0, 200, 1.5, 0.15);

    push();
    translate(x, y);
    rotate(theta + PI);
    image(seed, 0, 0, seedWidth * scale, seedHeight * scale);
    pop();
  }
}
