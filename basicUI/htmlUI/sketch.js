let paths = [];
let currentPath = [];
let strokeWidthSlider;
let colorPicker;
let strokeEffectSelector;

function setup() {
  createCanvas(800, 600);
  background(255);

  // --- UI Elements ---
  createP('Stroke Width');
  strokeWidthSlider = createSlider(1, 20, 5);
  strokeWidthSlider.style('width', '200px');

  createP('Stroke Color');
  colorPicker = createColorPicker('#000000');
  colorPicker.style('width', '200px');

  createP('Stroke Effect');
  strokeEffectSelector = createSelect();
  strokeEffectSelector.option('Solid');
  strokeEffectSelector.option('Dashed');
  strokeEffectSelector.option('Dotted');
  strokeEffectSelector.option('Wavy');
  strokeEffectSelector.style('width', '200px');
}

function draw() {
  background(255);

  // Draw all paths
  for (let path of paths) {
    drawStyledPath(path);
  }

  // Draw current path
  if (currentPath.length > 0) {
    drawStyledPath({
      points: currentPath,
      color: colorPicker.value(),
      weight: strokeWidthSlider.value(),
      effect: strokeEffectSelector.value()
    });
  }
}

function mousePressed() {
  currentPath = [];
  paths.push({
    points: currentPath,
    color: colorPicker.value(),
    weight: strokeWidthSlider.value(),
    effect: strokeEffectSelector.value()
  });
}

function mouseDragged() {
  currentPath.push({ x: mouseX, y: mouseY });
}

function drawStyledPath(path) {
  let pts = path.points;
  if (pts.length < 2) return;

  stroke(path.color);
  strokeWeight(path.weight);
  noFill();

  if (path.effect === 'Solid') {
    beginShape();
    for (let p of pts) vertex(p.x, p.y);
    endShape();
  }

  else if (path.effect === 'Dashed') {
    drawDashedLine(pts, 10, 10);
  }

  else if (path.effect === 'Dotted') {
    drawDashedLine(pts, 2, 10);
  }

  else if (path.effect === 'Wavy') {
    drawWavyLine(pts, 100, 100);
  }
}

function drawDashedLine(pts, dashLength, gapLength) {
  let patternLength = dashLength + gapLength;
  for (let i = 0; i < pts.length - 1; i++) {
    let p1 = pts[i];
    let p2 = pts[i + 1];
    let d = dist(p1.x, p1.y, p2.x, p2.y);
    let steps = int(d / patternLength * 2);
    let t = 0;
    while (t < 1) {
      let t1 = t;
      let t2 = min(t + dashLength / d, 1);
      let x1 = lerp(p1.x, p2.x, t1);
      let y1 = lerp(p1.y, p2.y, t1);
      let x2 = lerp(p1.x, p2.x, t2);
      let y2 = lerp(p1.y, p2.y, t2);
      line(x1, y1, x2, y2);
      t += patternLength / d;
    }
  }
}

function drawWavyLine(pts, wavelength, amplitude) {
  noFill();
  beginShape();
  for (let i = 0; i < pts.length - 1; i++) {
    let p1 = pts[i];
    let p2 = pts[i + 1];
    let segLength = dist(p1.x, p1.y, p2.x, p2.y);
    let steps = int(segLength / 5);
    for (let j = 0; j <= steps; j++) {
      let t = j / steps;
      let x = lerp(p1.x, p2.x, t);
      let y = lerp(p1.y, p2.y, t);

      let angle = atan2(p2.y - p1.y, p2.x - p1.x);
      let wave = sin(t * TWO_PI * (segLength / wavelength)) * amplitude;
      let xOffset = cos(angle + HALF_PI) * wave;
      let yOffset = sin(angle + HALF_PI) * wave;

      vertex(x + xOffset, y + yOffset);
    }
  }
  endShape();
}
