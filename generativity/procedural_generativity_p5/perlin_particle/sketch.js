// Perlin Particle Field (p5.js port)
// Original concept adapted from Generative Gestaltung examples (Agent.pde, GUI.pde)

let agents = [];
let maxAgents = 10000;
let agentsCount = 4000;
let noiseScale = 100;
let noiseStrength = 10;
let noiseZRange = 0.4;
let overlayAlpha = 10;
let agentsAlpha = 90;
let strokeWidth = 0.3;

function setup() {
  createCanvas(1280, 800);
  pixelDensity(1);
  background(0);
  initAgents();
  bindControls();
}

function draw() {
  // Overlay fade to create trails
  noStroke();
  fill(0, overlayAlpha);
  rect(0, 0, width, height);

  stroke(255, agentsAlpha);
  for (let i = 0; i < agentsCount; i++) {
    agents[i].update();
  }
}

class Agent {
  constructor() {
    this.p = createVector(random(width), random(height));
    this.pOld = this.p.copy();
    this.noiseZVelocity = 0.01;
    this.noiseZ = 0; // will be initialized by setNoiseZRange
    this.stepSize = random(1, 5);
    this.setNoiseZRange(noiseZRange);
  }

  update() {
    const angle = noise(this.p.x / noiseScale, this.p.y / noiseScale, this.noiseZ) * noiseStrength;

    this.p.x += cos(angle) * this.stepSize;
    this.p.y += sin(angle) * this.stepSize;

    // Wraparound
    if (this.p.x < -10) this.p.x = this.pOld.x = width + 10;
    if (this.p.x > width + 10) this.p.x = this.pOld.x = -10;
    if (this.p.y < -10) this.p.y = this.pOld.y = height + 10;
    if (this.p.y > height + 10) this.p.y = this.pOld.y = -10;

    strokeWeight(strokeWidth * this.stepSize);
    line(this.pOld.x, this.pOld.y, this.p.x, this.p.y);

    this.pOld.set(this.p);
    this.noiseZ += this.noiseZVelocity;
  }

  setNoiseZRange(r) {
    this.noiseZ = random(r);
  }
}

function initAgents() {
  agents = [];
  for (let i = 0; i < maxAgents; i++) {
    agents.push(new Agent());
  }
}

function resizeAgentsCount(newCount) {
  agentsCount = newCount;
}

function updateNoiseZRange(val) {
  noiseZRange = val;
  for (let i = 0; i < agentsCount; i++) {
    agents[i].setNoiseZRange(noiseZRange);
  }
}

function bindControls() {
  bindSlider('agentsCount', v => resizeAgentsCount(int(v)));
  bindSlider('noiseScale', v => (noiseScale = float(v)));
  bindSlider('noiseStrength', v => (noiseStrength = float(v)));
  bindSlider('strokeWidth', v => (strokeWidth = float(v)));
  bindSlider('noiseZRange', v => updateNoiseZRange(float(v)));
  bindSlider('agentsAlpha', v => (agentsAlpha = int(v)));
  bindSlider('overlayAlpha', v => (overlayAlpha = int(v)));

  select('#resetBtn').mousePressed(() => {
    initAgents();
    updateNoiseZRange(noiseZRange); // reinitialize z values
  });

  select('#clearBtn').mousePressed(() => {
    background(0);
  });
}

function bindSlider(id, onInput) {
  const el = select('#' + id);
  const out = select('#' + id + 'Out');
  if (!el) return;
  el.input(() => {
    const v = el.value();
    out.html(v);
    onInput(v);
  });
  // Initialize label
  out.html(el.value());
}
