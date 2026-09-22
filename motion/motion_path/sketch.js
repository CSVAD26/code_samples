// p5.js sketch — PNG sequence animation following a path
// Keyframes toggle (K), play/pause (space), loop (L)

let frames = [];
const NUM_FRAMES = 7;

let currentIndex = 0;
let showKeyframes = false;
let showPath = true;

let fps = 12;
let frameInterval = 1000 / fps;
let lastChange = 0;

let thumbHeight = 100;
let thumbMargin = 10;

// define path points (edit these to shape the trajectory)
let pathPoints = [
  { x: 100, y: 100 },
  { x: 300, y: 200 },
  { x: 600, y: 150 },
  { x: 700, y: 400 },
  { x: 400, y: 500 },
  { x: 150, y: 400 }
];

let pathProgress = 0;   // 0..1 progress along path
let velocity = 0.002;  // adjust this for faster/slower motion

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
}

function draw() {
  background(220);

  // --- advance animation frame ---
  if (millis() - lastChange >= frameInterval) {
    lastChange = millis();
    currentIndex++;
    if (currentIndex >= NUM_FRAMES) {
      
        currentIndex = 0;
     
    }
  }

  // --- advance path progress ---
  
    pathProgress += velocity;
    if (pathProgress > 1) {
      pathProgress = 0; // loop back to start
    }
  

  // determine animation area height depending on whether keyframes are shown
  let keyframeArea = showKeyframes ? (thumbHeight + thumbMargin * 2) : 0;
  let animationAreaHeight = height - keyframeArea;

  // --- draw path ---
  if(showPath){
  stroke(100);
  strokeWeight(2);
  noFill();
  beginShape();
  for (let p of pathPoints) {
    vertex(p.x, p.y);
  }
  endShape(CLOSE);
}

  // --- compute position along path ---
  let pos = getPositionOnPath(pathProgress);

  // --- draw current frame at position ---
  const img = frames[currentIndex];
  if (img) {
    const maxW = 150; // size of animation on path
    const maxH = 150;
    let drawW = img.width;
    let drawH = img.height;
    const ratio = min(maxW / drawW, maxH / drawH, 1);
    drawW *= ratio;
    drawH *= ratio;
    image(img, pos.x, pos.y, drawW, drawH);
  }

  // --- draw keyframes strip if visible ---
  if (showKeyframes) {
    let thumbW = (width - thumbMargin * (NUM_FRAMES + 1)) / NUM_FRAMES;
    let thumbY = animationAreaHeight + thumbMargin + thumbHeight / 2;

    for (let i = 0; i < NUM_FRAMES; i++) {
      let thumbImg = frames[i];
      let ratio = min(thumbW / thumbImg.width, thumbHeight / thumbImg.height);
      let w = thumbImg.width * ratio;
      let h = thumbImg.height * ratio;
      let x = thumbMargin + i * (thumbW + thumbMargin) + thumbW / 2;

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
    `Frame: ${currentIndex + 1}/${NUM_FRAMES} | FPS: ${fps}  (press + to increase / - to decrease) | Path: ${showPath ? "Visible" : "Hidden"} (press "P" to toggle) | Keyframes: ${showKeyframes ? "Visible" : "Hidden"} (press "K" to toggle)p`,
    10,
    height - 5
  );
}

// --- keyboard controls ---
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
   else if (key === 'p'){
    showPath = !showPath;
  }
}

// --- helper: compute position along path ---
/**
 * Returns the position (x, y) on the path for a given parameter t (0 <= t <= 1).
 *
 * The path is defined by the global 'points' array, which contains a sequence of points.
 * The function treats the path as a series of straight line segments connecting these points.
 * The parameter 't' represents the normalized position along the entire path:
 *   - t = 0 corresponds to the start of the path (first point)
 *   - t = 1 corresponds to the end of the path (last point)
 *
 * Internally, the function calculates which segment of the path 't' falls into,
 * then linearly interpolates between the two points that define that segment.
 * This allows for smooth movement along the path, even if the segments are of different lengths.
 *
 * Useful for animating objects or drawing markers that follow a custom path.
 *
 * @param {number} t - Normalized position along the path (0 <= t <= 1)
 * @returns {{x: number, y: number}} - The interpolated position on the path
 */
function getPositionOnPath(t) {
  // total path length
  let totalLength = 0;
  for (let i = 0; i < pathPoints.length; i++) {
    let a = pathPoints[i];
    let b = pathPoints[(i + 1) % pathPoints.length];
    totalLength += dist(a.x, a.y, b.x, b.y);
  }

  let target = t * totalLength;
  let traveled = 0;
  for (let i = 0; i < pathPoints.length; i++) {
    let a = pathPoints[i];
    let b = pathPoints[(i + 1) % pathPoints.length];
    let seg = dist(a.x, a.y, b.x, b.y);
    if (traveled + seg >= target) {
      let segT = (target - traveled) / seg;
      let x = lerp(a.x, b.x, segT);
      let y = lerp(a.y, b.y, segT);
      return { x, y };
    }
    traveled += seg;
  }

  // fallback
  return pathPoints[pathPoints.length - 1];
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
