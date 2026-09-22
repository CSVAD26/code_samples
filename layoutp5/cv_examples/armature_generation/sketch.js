//add citation of Jane's paper
let video;
let saliencyGraphics;
let lines = [];

let blurSmallSlider, blurLargeSlider, thresholdSlider, sigmaSlider;

function setup() {
  createCanvas(1280, 540);
  pixelDensity(1);

  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  saliencyGraphics = createGraphics(640, 480);

  // Define composition lines
  lines = [
    { p1: createVector(640 / 3, 0), p2: createVector(640 / 3, 480) },
    { p1: createVector((2 * 640) / 3, 0), p2: createVector((2 * 640) / 3, 480) },
    { p1: createVector(0, 480 / 3), p2: createVector(640, 480 / 3) },
    { p1: createVector(0, (2 * 480) / 3), p2: createVector(640, (2 * 480) / 3) },
    { p1: createVector(0, 0), p2: createVector(640, 480) },
    { p1: createVector(640, 0), p2: createVector(0, 480) },
    { p1: createVector(640 / 2, 0), p2: createVector(640 / 2, 480) },
    { p1: createVector(0, 480 / 2), p2: createVector(640, 480 / 2) },
  ];

  // --- UI Controls ---
  createP("Local Blur (detail)").style('color', '#fff').position(20, 490);
  blurSmallSlider = createSlider(0, 5, 1, 0.1).position(180, 495);

  createP("Global Blur (smoothness)").style('color', '#fff').position(400, 490);
  blurLargeSlider = createSlider(1, 20, 6, 0.1).position(600, 495);

  createP("Saliency Threshold").style('color', '#fff').position(820, 490);
  thresholdSlider = createSlider(0, 255, 30, 1).position(980, 495);

  createP("Sigma Factor (spread)").style('color', '#fff').position(20, 520);
  sigmaSlider = createSlider(0.1, 1.0, 0.25, 0.01).position(180, 525);
}

function draw() {
  background(0);

  // --- Step 1: Draw and process video ---
  image(video, 0, 0, 640, 480);

  let blurSmall = blurSmallSlider.value();
  let blurLarge = blurLargeSlider.value();
  let threshold = thresholdSlider.value();
  let sigmaFactor = sigmaSlider.value();

  // Compute saliency (Difference of Gaussians)
  saliencyGraphics.image(video, 0, 0, 640, 480);
  saliencyGraphics.filter(GRAY);
  saliencyGraphics.filter(BLUR, blurSmall);
  let smallBlur = saliencyGraphics.get();

  saliencyGraphics.image(video, 0, 0, 640, 480);
  saliencyGraphics.filter(GRAY);
  saliencyGraphics.filter(BLUR, blurLarge);
  let largeBlur = saliencyGraphics.get();

  // DoG
  let saliency = createImage(640, 480);
  smallBlur.loadPixels();
  largeBlur.loadPixels();
  saliency.loadPixels();

  for (let i = 0; i < smallBlur.pixels.length; i += 4) {
    let diff = abs(smallBlur.pixels[i] - largeBlur.pixels[i]);
    saliency.pixels[i] = diff;
    saliency.pixels[i + 1] = diff;
    saliency.pixels[i + 2] = diff;
    saliency.pixels[i + 3] = 255;
  }
  saliency.updatePixels();

  // Draw saliency map
  image(saliency, 640, 0);

  // --- Step 2: Compute composition line scores ---
  saliency.loadPixels();
  let scores = lines.map(() => 0);
  let sigma = (max(640, 480) / 10) * sigmaFactor;
  let denom = 2 * sigma * sigma;

  for (let y = 0; y < 480; y += 4) {
    for (let x = 0; x < 640; x += 4) {
      let idx = (y * 640 + x) * 4;
      let S = saliency.pixels[idx];
      if (S < threshold) continue;

      for (let i = 0; i < lines.length; i++) {
        let L = lines[i];
        let d = distPointToLine(x, y, L.p1.x, L.p1.y, L.p2.x, L.p2.y);
        let g = exp(-d * d / denom);
        scores[i] += S * g;
      }
    }
  }

  // Normalize and rank
  for (let i = 0; i < lines.length; i++) {
    let len = dist(lines[i].p1.x, lines[i].p1.y, lines[i].p2.x, lines[i].p2.y);
    scores[i] /= len;
  }

  let ranked = scores
    .map((s, i) => ({ s, i }))
    .sort((a, b) => b.s - a.s)
    .slice(0, 3);

  // --- Step 3: Overlay adaptive armature on both panels ---
  drawCompositionLines(lines, ranked, 0, 0);     // over video
  drawCompositionLines(lines, ranked, 640, 0);   // over saliency

  // --- Step 4: Labels ---
  noStroke();
  fill(255);
  textAlign(CENTER, CENTER);
  text("Original Video + Armature", 320, 20);
  text("Saliency Map + Armature", 960, 20);
}

// --- Helper: Draw composition lines ---
function drawCompositionLines(lines, ranked, xOffset, yOffset) {
  push();
  translate(xOffset, yOffset);
  for (let i = 0; i < lines.length; i++) {
    let L = lines[i];
    let top = ranked.find(r => r.i === i);
    stroke(top ? color(0, 255, 0) : color(255, 80));
    strokeWeight(top ? 4 : 1);
    line(L.p1.x, L.p1.y, L.p2.x, L.p2.y);
  }
  pop();
}

// --- Helper: Distance from point to line ---
function distPointToLine(px, py, x1, y1, x2, y2) {
  let A = px - x1;
  let B = py - y1;
  let C = x2 - x1;
  let D = y2 - y1;
  let dot = A * C + B * D;
  let len_sq = C * C + D * D;
  let param = dot / len_sq;
  let xx, yy;
  if (param < 0) { xx = x1; yy = y1; }
  else if (param > 1) { xx = x2; yy = y2; }
  else { xx = x1 + param * C; yy = y1 + param * D; }
  let dx = px - xx;
  let dy = py - yy;
  return sqrt(dx * dx + dy * dy);
}
