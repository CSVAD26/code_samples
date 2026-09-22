// Adapted from "The Nature of Code" by Daniel Shiffman
// Bouncing object with PNG sequence animation using vectors
// https://natureofcode.com/vectors/#the-point-of-vectors

let position;
let frames = [];
const NUM_FRAMES = 7;
let currentIndex = 0;

let fps = 12;
let frameInterval = 1000 / fps;
let lastChange = 0;

let maxSpeed = 10;
// Easing control
let duration = 4000; // ms for one full ease-in-out cycle
let startTime;

let easeFunction = "easeInSine"

function preload() {
  // Load 7 image frames
  for (let i = 1; i <= NUM_FRAMES; i++) {
    frames.push(loadImage(`assets/frame_${i}.png`));
  }
}

function setup() {
  createCanvas(640, 240);
  imageMode(CENTER);
  startTime = millis();
  position = createVector(100, 100);

}

function draw() {
  background(255);

  // Calculate normalized time for one full ease-in-out cycle
  let elapsed = (millis() - startTime) % duration;
  let t = elapsed / duration;
  let eased;
  // Use easeInOutSine to get normalized position (0 to 1)
  switch(easeFunction){
    case "easeInSine":
      eased = easeInSine(t);
      break;
    case "easeInOutSine":
    eased = easeInOutSine(t);
    break;
    case "easeOutSine":
    eased = easeOutSine(t);
    break;
    case "easeInExpo":
    eased = easeInExpo(t);
    break;
    case "easeOutExpo":
    eased = easeOutExpo(t);
    break;
    case "easeInOutExpo":
    eased = easeInOutExpo(t);
    break;
  }
  position.x = eased * width;

  // Advance animation frame
  if (millis() - lastChange >= frameInterval) {
    lastChange = millis();
    currentIndex = (currentIndex + 1) % NUM_FRAMES;
  }

  // Draw current image at position
  let img = frames[currentIndex];
  if (img) {
    const maxSize = 60; // max displayed width or height
    let ratio = min(maxSize / img.width, maxSize / img.height);
    let w = img.width * ratio;
    let h = img.height * ratio;
    push();
    translate(position.x, position.y);
    rotate(PI/2); // rotate to align with path direction
    image(img, 0, 0, w, h);
    pop();
  }

  // HUD
  fill(0);
  noStroke();
  textSize(12);
  textAlign(LEFT, BOTTOM);
  text(
    `Frame: ${currentIndex + 1}/${NUM_FRAMES} | FPS: ${fps} | Easing: ${easeFunction}
    (Press keys 1-6 to change easing function) | ease duration: ${duration} ms press +/- to change`,
    10, height - 5);
}

function keyPressed() {
  if (key === '1') {
    easeFunction = "easeInSine";
  } else if (key === '2') {
    easeFunction = "easeInOutSine";
  }
  else if (key === '3') {
    easeFunction = "easeOutSine";
  } else if (key === '4') {
    easeFunction = "easeInExpo";
  } else if (key === '5') {
    easeFunction = "easeOutExpo";
  } else if (key === '6') {
    easeFunction = "easeInOutExpo";
  }
  else if (key === '-') {
    duration +=500;
  }
  else if (key === '+') {
    duration -= 500; 
    if (duration < 500) {
      duration = 500;
    }// increase by 0.5 secy
  }
}


/**
 * Returns a normalized position (0 to 1) for ease-in-out motion.
 *
 * This function uses a sine-based formula to smoothly interpolate a value
 * from 0 to 1 over the interval t = 0 to t = 1. The motion starts slowly,
 * accelerates in the middle, and slows down again at the end (ease-in-out).
 *
 * The formula is: 0.5 * (1 - cos(PI * t))
 * - At t = 0, position = 0
 * - At t = 0.5, position = 0.5
 * - At t = 1, position = 1
 *
 * This is commonly used for smooth, natural-looking animations.
 *
 * @param {number} t - Normalized time (0 <= t <= 1)
 * @returns {number} - Normalized position (0 <= position <= 1)
 */
function easeInOutSine(t) {
  t = constrain(t, 0, 1);
  return 0.5 * (1 - cos(PI * t));
}

function easeInSine(t){
  t = constrain(t, 0, 1);
  return 1-cos((t * PI) / 2);
}

function easeOutSine(t){
  t = constrain(t, 0, 1);
  return sin((t * PI) / 2);
}

function easeInExpo(t){
  t = constrain(t, 0, 1);
  return t === 0 ? 0 : pow(2, 10 * (t - 1));
}

function easeOutExpo(t){
  t = constrain(t, 0, 1);
  return t === 1 ? 1 : 1 - pow(2, -10 * t);
}

function easeInOutExpo(t){
  t = constrain(t, 0, 1);
  if (t === 0) return 0;
  if (t === 1) return 1;
  if (t < 0.5) return 0.5 * pow(2, 20 * t - 10);
  return 1 - 0.5 * pow(2, -20 * t + 10);
}