let seedSystems = [];
let seedShape;

// GUI params
let seedCount = 100;
let dandelionCount = 10;
let velocityScaling = 1.0;

function preload() {
  seedShape = loadImage('seed.svg');
}

function setup() {
  createCanvas(1280, 800);
  initSeedSystems();
  setupGUI();
}

function draw() {
  background(0);
  for (let i = seedSystems.length - 1; i >= 0; i--) {
    seedSystems[i].update();
  }
}

function initSeedSystems() {
  seedSystems = [];
  for (let i = 0; i < dandelionCount; i++) {
    const x = random(0, width);
    const y = random(200, height / 2);
    const sd = random(10, 60);
    const alpha = floor(map(i, 0, dandelionCount, 1, 255));
    seedSystems.push(new SeedSystem(createVector(x, y), seedCount, sd, alpha));
  }
}

function setupGUI() {
  const seedCountSlider = select('#seedCount');
  const dandelionCountSlider = select('#dandelionCount');
  const velocitySlider = select('#velocity');

  seedCountSlider.input(() => {
    seedCount = int(seedCountSlider.value());
    select('#seedCountValue').html(seedCount);
    initSeedSystems();
  });

  dandelionCountSlider.input(() => {
    dandelionCount = int(dandelionCountSlider.value());
    select('#dandelionCountValue').html(dandelionCount);
    initSeedSystems();
  });

  velocitySlider.input(() => {
    velocityScaling = float(velocitySlider.value());
    select('#velocityValue').html(velocityScaling.toFixed(1));
  });
}

class SeedSystem {
  constructor(position, count, sd, alpha) {
    this.origin = position.copy();
    this.seeds = [];
    this.alpha = alpha;
    this.sd = sd;
    const gausVector = createVector(randomGaussian(), randomGaussian());
    this.stemCurvePosition = gausVector.mult(100);
    this.generateSeeds(count);
  }

  generateSeeds(count) {
    for (let i = 0; i < count; i++) {
      this.addSeed();
    }
  }

  addSeed() {
    const xVal = randomGaussian();
    const yVal = randomGaussian();
    const gauss = createVector(xVal, yVal);
    const position = gauss.mult(this.sd).add(this.origin);
    const delta = this.origin.copy().sub(position);
    this.seeds.push(new Seed(delta, this.alpha));
  }

  update() {
    if (this.seeds.length === 0) {
      this.generateSeeds(seedCount);
    }
    push();
    translate(this.origin.x, this.origin.y);
    this.drawStem();
    for (let i = this.seeds.length - 1; i >= 0; i--) {
      const s = this.seeds[i];
      s.run();
      if (s.isDead()) {
        this.seeds.splice(i, 1);
      }
    }
    pop();
  }

  drawStem() {
    noFill();
    stroke(255, 255, 255, this.alpha);
    strokeWeight(2);
    beginShape();
    curveVertex(0, 0);
    curveVertex(0, 0);
    curveVertex(this.stemCurvePosition.x, (height - this.origin.y) / 2);
    curveVertex(0, height - this.origin.y);
    curveVertex(0, height - this.origin.y);
    endShape();
  }
}

class Seed {
  constructor(l, alpha) {
    this.acceleration = createVector(0, 0.05);
    this.velocity = l.copy().normalize().mult(velocityScaling);
    this.position = l.copy();
    this.scale = 1;
    this.alpha = alpha;
  }

  run() {
    this.update();
    this.display();
  }

  update() {
    this.velocity.mult(velocityScaling);
    this.position.add(this.velocity);
    const mag = this.position.mag();
    this.scale = map(mag, 0, 300, 1.5, 0.1);
  }

  display() {
    const theta = this.position.heading();
    push();
    translate(this.position.x, this.position.y);
    rotate(theta);
    const w = 200 * this.scale;
    const h = 325 * this.scale;
    tint(255, 255, 255, this.alpha);
    image(seedShape, -w / 2, -h / 2, w, h);
    pop();
  }

  isDead() {
    return this.scale < 0.1;
  }
}
