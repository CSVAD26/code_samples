let rW = 40;
let rH = 40;

let patternA = [1, 1, 1, 1];
let patternB = [1, 0.5, 0.75, 0.25];
let patternC = [0.75, 0.25, 1, 0.5];
let patternD = [0.25, 0.75, 0.5, 1];

let patternList = [patternA, patternB, patternC, patternD];

function setup() {
  createCanvas(800, 800);
  background(0);
  noFill();
  stroke(255);
  angleMode(RADIANS);

  let patternIndex = 0;
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

function draw() {
  // nothing animated — same as Processing version
}

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

function drawSeed(x, y, r) {
  push();
  translate(x + rW / 2, y + rH / 2);
  rotate(r);
  noFill();
  rectMode(CENTER);
  rect(0, 0, rW, rH);
  fill(255);
  noStroke();
  triangle(-rW / 2, -rH / 2, rW / 2, -rH / 2, -rW / 2, rH / 2);
  pop();
}
