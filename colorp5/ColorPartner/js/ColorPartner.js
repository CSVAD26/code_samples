// This sketch creates a set of color swatches whose values are influenced by the
// relative positions of nearby swatches.
let swatch1;
let swatch2;
let swatches = [];
let selectedSwatch = null;
let colorShift = false;
let move = false;
let framesElapsed = 0;
let dragOffset = null;

function setup() {
  createCanvas(800, 800);

  // Create two initial swatches placed on opposite sides of the canvas.
  swatch1 = new Swatch(round(width * 0.3), height / 2, 100, 0, 100, 100);
  swatch2 = new Swatch(round(width * 0.6), height / 2, 100, 10, 100, 100);
  swatch1.locked = true;
  swatch2.locked = true;
  swatches.push(swatch1);
  swatches.push(swatch2);
}

function draw() {
  colorMode(RGB, 255);
  background(200, 200, 200);

  // Draw all swatches on the canvas.
  for (let i = 0; i < swatches.length; i++) {
    swatches[i].draw();
  }

  // Show the keyboard instructions over the sketch.
  drawInstructions();

  // Remove swatches whose radius has shrunk below zero.
  for (let i = swatches.length - 1; i >= 0; i--) {
    if (swatches[i].rad < 0) {
      swatches.splice(i, 1);
    }
  }

  // If a swatch is selected and neither color-shift nor move mode is active,
  // draw a guide line and generate new variations over time.
  if (selectedSwatch != null && !colorShift && !move) {
    colorMode(RGB, 255);
    stroke(255);
    line(selectedSwatch.position.x, selectedSwatch.position.y, mouseX, mouseY);
    framesElapsed++;
    if (framesElapsed > 100) {
      generateVariations(selectedSwatch, mouseX, mouseY);
      framesElapsed = 0;
    }
  }
}

function drawInstructions() {
  colorMode(RGB, 255);
  noStroke();
  fill(255);
  rect(18, 18, 360, 82);

  fill(0);
  textSize(15);
  textAlign(LEFT, TOP);
  text("Keyboard controls:", 30, 28);
  text("C = color shift, M = move swatch", 30, 48);
  text("Wheel = adjust selected swatch color", 30, 68);
}

function keyPressed() {
  // Press and hold C to adjust color values; hold M to reposition a selected swatch.
  if (key === 'c') {
    colorShift = true;
  } else if (key === 'm') {
    move = true;
  }
}

function keyReleased() {
  colorShift = false;
  move = false;
}

function mouseReleased() {
  // Clear selection and reset the time-based variation timer.
  deselectAllSwatches();
  framesElapsed = 0;
  dragOffset = null;
}

function mouseWheel(event) {
  // Normalize wheel movement across browsers so color changes are steady.
  let e = round(event.deltaY / 100);
  for (let i = 0; i < swatches.length; i++) {
    let s = swatches[i];
    if (s.selected === true) {
      if (colorShift === true) {
        s.updateColor(createVector(0, 0), e);
      }
      return false;
    }
  }
  return false;
}

function mouseDragged() {
  // Mouse drag behavior depends on whether the user is editing color or moving a swatch.
  let delta = createVector(mouseX - pmouseX, mouseY - pmouseY);
  for (let i = 0; i < swatches.length; i++) {
    let s = swatches[i];
    if (s.selected === true) {
      if (colorShift === true) {
        s.updateColor(delta, 0);
      } else if (move === true) {
        // Use an offset so the swatch follows the cursor smoothly rather than jumping.
        if (dragOffset !== null) {
          let newX = mouseX - dragOffset.x;
          let newY = mouseY - dragOffset.y;
          s.position.set(newX, newY);
        }
      }
      break;
    }
  }
}

function mousePressed() {
  // Clicking a swatch selects it, and if move mode is active we store a drag offset.
  let s = checkForSwatchHit(mouseX, mouseY);
  if (s != null && s.locked) {
    s.selected = true;
    selectedSwatch = s;
    s.rad = 75;

    if (move === true) {
      dragOffset = createVector(mouseX - s.position.x, mouseY - s.position.y);
    }
  }
}

function deselectAllSwatches() {
  // Deselect every swatch when we finish interacting.
  for (let i = 0; i < swatches.length; i++) {
    swatches[i].selected = false;
  }
  selectedSwatch = null;
}

function checkForSwatchHit(x, y) {
  // Check from the topmost swatch outward to see which swatch was clicked.
  for (let i = swatches.length - 1; i >= 0; i--) {
    let s = swatches[i];
    let hitTest = s.hitTest(x, y);
    if (hitTest === true) {
      s.locked = true;
      return s;
    }
  }
  return null;
}

function calculateDistance(swatch, x, y) {
  // Calculate the distance between the cursor and each swatch so nearby colors carry more weight.
  let d = dist(x, y, swatch.position.x, swatch.position.y);
  return { distance: d, hue: swatch.hue, sat: swatch.sat, bri: swatch.bri };
}

function calculateValue(valueDistancePairs) {
  // Use inverse-distance weighting so closest swatches contribute most strongly.
  let totalWeight = 0;
  let weightedHueSum = 0;
  let weightedSatSum = 0;
  let weightedBriSum = 0;

  for (let i = 0; i < valueDistancePairs.length; i++) {
    let pair = valueDistancePairs[i];
    let weight = 1 / (pair.distance + 1e-5);
    weightedHueSum += pair.hue * weight;
    weightedSatSum += pair.sat * weight;
    weightedBriSum += pair.bri * weight;

    totalWeight += weight;
  }

  if (totalWeight > 0) {
    return {
      hueWeight: weightedHueSum / totalWeight,
      satWeight: weightedSatSum / totalWeight,
      briWeight: weightedBriSum / totalWeight
    };
  } else {
    return { hueWeight: 0, satWeight: 0, briWeight: 0 };
  }
}

function generateVariations(targetSwatch, x, y) {
  // Create a new swatch whose color is blended from all nearby swatches,
  // effectively letting color relationships propagate across the composition.
  let distances = [];
  for (let i = 0; i < swatches.length; i++) {
    let s = swatches[i];
    let d = calculateDistance(s, x, y);
    distances.push(d);
  }

  let newWeights = calculateValue(distances);
  let newSwatch = new Swatch(x, y, 40, newWeights.hueWeight, newWeights.satWeight, newWeights.briWeight);
  swatches.push(newSwatch);
}

// Register mouseWheel event for p5.js so scrolling can adjust color while the user holds C.
function setupEventHandlers() {
  window.addEventListener('wheel', function(e) {
    if (colorShift && selectedSwatch) {
      mouseWheel({ deltaY: e.deltaY });
      e.preventDefault();
    }
  }, { passive: false });
}

// Needed for mouseWheel to work in some browsers.
setupEventHandlers();