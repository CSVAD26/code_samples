// Interactive Golden Ratio Rectangles
let phi = (1 + Math.sqrt(5)) / 2; // ≈ 1.618
let margin = 80;
let widthSlider;
let invert = false; // toggle which rectangle is larger

function setup() {
  createCanvas(800, 400);
  colorMode(HSB);
  textAlign(CENTER, CENTER);
  textSize(14);
  noStroke();

  // Slider to control total width
  createP("Adjust total width:");
  widthSlider = createSlider(200, width - margin * 2, 600, 1);
  createP("Press [SPACE] to swap which rectangle is larger");
}

function draw() {
  background(0, 0, 95);
  const totalWidth = widthSlider.value();
  const rectHeight = 200;

  // Compute rectangle widths
  const smallW = totalWidth / (phi + 1);
  const largeW = totalWidth - smallW;

  const x0 = margin;
  const y0 = (height - rectHeight) / 2;

  // Choose which rectangle is larger based on toggle
  let leftW, rightW;
  if (invert) {
    leftW = smallW;
    rightW = largeW;
  } else {
    leftW = largeW;
    rightW = smallW;
  }

  // Draw rectangles
  fill(210, 80, 80);
  rect(x0, y0, leftW, rectHeight);
  fill(40, 90, 90);
  rect(x0 + leftW, y0, rightW, rectHeight);

  // Draw dividing line
  stroke(0);
  strokeWeight(2);
  line(x0 + leftW, y0, x0 + leftW, y0 + rectHeight);
  noStroke();

  // Labels
  fill(0);
  text(`Left width = ${leftW.toFixed(1)}`, x0 + leftW / 2, y0 + rectHeight / 2);
  text(`Right width = ${rightW.toFixed(1)}`, x0 + leftW + rightW / 2, y0 + rectHeight / 2);
  text(`Ratio (larger / smaller) ≈ ${(max(leftW, rightW) / min(leftW, rightW)).toFixed(3)} (φ ≈ ${phi.toFixed(3)})`,
       width / 2, y0 + rectHeight + 30);
}

function keyPressed() {
  if (key === ' ') {
    invert = !invert;
  }
}
