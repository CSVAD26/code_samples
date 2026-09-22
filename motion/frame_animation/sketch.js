// p5.js sketch — sequence animation of 7 PNGs
// with thumbnail keyframe strip toggle (press "K")

let frames = [];
const NUM_FRAMES = 7;

let currentIndex = 0;
let showKeyframes = false;   // toggled with key "K"

let fps = 24;
let frameInterval = 1000 / fps;
let lastChange = 0;

// layout
let thumbHeight = 100; // height for each thumbnail
let thumbMargin = 10;

function preload() {
  for (let i = 1; i <= NUM_FRAMES; i++) {
    frames.push(loadImage(`assets/frame_${i}.png`));
  }
}

function setup() {
  createCanvas(800, 600);
  imageMode(CENTER);
  frameInterval = 1000 / fps;
  lastChange = millis();
  background(30);
}

function draw() {
  background(220);

  if (frames.length === 0 || !frames[0]) {
    fill(255, 0, 0);
    textSize(18);
    textAlign(CENTER, CENTER);
    text("No frames found — check your assets folder and filenames", width / 2, height / 2);
    noLoop();
    return;
  }

  // animate
  if (millis() - lastChange >= frameInterval) {
    lastChange = millis();
    currentIndex++;
    if (currentIndex >= NUM_FRAMES) {
      currentIndex = 0;
    }
  }

  // determine animation area height depending on whether keyframes are shown
  let keyframeArea = showKeyframes ? (thumbHeight + thumbMargin * 2) : 0;
  let animationAreaHeight = height - keyframeArea;

  // draw current frame
  const img = frames[currentIndex];
  if (img) {
    const maxW = width * 0.9;
    const maxH = animationAreaHeight * 0.9;
    let drawW = img.width;
    let drawH = img.height;
    const ratio = min(maxW / drawW, maxH / drawH, 1);
    drawW *= ratio;
    drawH *= ratio;
    image(img, width / 2, animationAreaHeight / 2, drawW, drawH);
  }

  // draw keyframes strip if visible
  if (showKeyframes) {
    let thumbW = (width - thumbMargin * (NUM_FRAMES + 1)) / NUM_FRAMES;
    let thumbY = animationAreaHeight + thumbMargin + thumbHeight / 2;

    for (let i = 0; i < NUM_FRAMES; i++) {
      let thumbImg = frames[i];
      let ratio = min(thumbW / thumbImg.width, thumbHeight / thumbImg.height);
      let w = thumbImg.width * ratio;
      let h = thumbImg.height * ratio;
      let x = thumbMargin + i * (thumbW + thumbMargin) + thumbW / 2;

      // highlight current frame
      if (i === currentIndex) {
        noFill();
        stroke(0);
        strokeWeight(3);
        rectMode(CENTER);
        rect(x, thumbY, thumbW, thumbHeight);
      }

      image(thumbImg, x, thumbY, w, h);
    }
  }

  // HUD
  fill(0);
  noStroke();
  textSize(12);
  textAlign(LEFT, BOTTOM);
  text(
    `Frame: ${currentIndex + 1}/${NUM_FRAMES} | FPS: ${fps}  (press + to increase / - to decrease) | | Keyframes: ${showKeyframes ? "Visible" : "Hidden"} (press "K" to toggle)`,
    10,
    height - 5
  );
}

function keyPressed() {
 if (key === 'K' || key === 'k') {
    showKeyframes = !showKeyframes;
  }
  else if (key === '+') {
    fps = min(fps + 1, 60); // cap at 60 fps
    frameInterval = 1000 / fps;
  }
  else if (key === '-'){
    fps = max(fps - 1, 1); // minimum 1 fps
    frameInterval = 1000 / fps;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
