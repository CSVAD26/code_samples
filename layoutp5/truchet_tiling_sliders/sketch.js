let rW = 40;
let rH = 40;
let v1 = 0.25;
let v2 = 0.25;
let v3 = 0.25;
let v4 = 0.25;

let v1Slider, v2Slider, v3Slider, v4Slider;

function setup() {
  createCanvas(800, 800);
  noFill();
  stroke(255);
  angleMode(RADIANS);

  // Create sliders similar to ControlP5
  v1Slider = createSlider(0.25, 1, 0.25, 0.25);
  v1Slider.position(25, 25);
  v1Slider.style('width', '200px');
  createP('v1').position(235, 15);

  v2Slider = createSlider(0.25, 1, 0.25, 0.25);
  v2Slider.position(25, 50);
  v2Slider.style('width', '200px');
  createP('v2').position(235, 40);

  v3Slider = createSlider(0.25, 1, 0.25, 0.25);
  v3Slider.position(25, 75);
  v3Slider.style('width', '200px');
  createP('v3').position(235, 65);

  v4Slider = createSlider(0.25, 1, 0.25, 0.25);
  v4Slider.position(25, 100);
  v4Slider.style('width', '200px');
  createP('v4').position(235, 90);
}

function draw() {
  background(0);

  // Read slider values
  v1 = v1Slider.value();
  v2 = v2Slider.value();
  v3 = v3Slider.value();
  v4 = v4Slider.value();

  // Define pattern sets
  let patternA = [v1, v2, v3, v4];
  let patternB = [v4, v1, v2, v3];
  let patternC = [v3, v4, v1, v2];
  let patternD = [v2, v3, v4, v1];

  let patternList = [patternA, patternB, patternC, patternD];

  let patternIndex = 0;

  // Loop through the grid
  for (let j = 0; j < height / rH; j++) {
    let t = 0;
    let targetPattern = patternList[patternIndex];
    patternIndex++;
    if (patternIndex > patternList.length - 1) {
      patternIndex = 0;
    }

    for (let i = 0; i < width / rW; i++) {
      let v = targetPattern[t];
      let r = toQuadrant(v);
      drawSeed(i * rW, j * rH, r);
      t++;
      if (t > targetPattern.length - 1) {
        t = 0;
      }
    }
  }
}

// Map values to rotation quadrants
function toQuadrant(v) {
  if (v <= 0.25) {
    return TWO_PI * 0.25;
  } else if (v > 0.25 && v <= 0.5) {
    return TWO_PI * 0.5;
  } else if (v > 0.5 && v <= 0.75) {
    return TWO_PI * 0.75;
  } else {
    return TWO_PI;
  }
}

// Draws one Truchet tile
function drawSeed(x, y, r) {
  push();
  translate(x + rW / 2, y + rH / 2);
  rotate(r);
  rectMode(CENTER);
  noFill();
  rect(0, 0, rW, rH);
  fill(255);
  noStroke();
  triangle(-rW / 2, -rH / 2, rW / 2, -rH / 2, -rW / 2, rH / 2);
  pop();
}
