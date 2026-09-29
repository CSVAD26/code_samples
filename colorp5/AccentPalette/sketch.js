// This sketch builds a color palette from the mouse position and then fills
// a grid with randomly sampled colors from that palette.

let baseCol, accentCol;
let baseColors = new Array(8);
let accentColors = new Array(3);
let numRows = 20;
let numCols = 20;
let grid = new Array(numRows);
let gridHeight = 475;

function setup() {
  createCanvas(500, 600);

  // The palette is regenerated once at startup and whenever the mouse is clicked.
  regeneratePalette = true;
  
}

function draw() {
  background(255);
  noStroke();

  // Map the mouse position to a hue and lightness value in HSB color space.
  // Moving horizontally changes the color family; moving vertically changes brightness.
  let baseHue = map(mouseX, 0, width, 0, 360);
  let baseLightness = map(mouseY, 0, height, 0, 100);
  colorMode(HSB, 360, 100, 100);

  // The primary color is determined by the cursor position.
  // The accent color is the complementary hue (180 degrees away).
  baseCol = color(baseHue, 100, baseLightness);
  accentCol = color((baseHue + 180) % 360, 100, baseLightness);

  // Only regenerate the palette and grid when needed.
  if (regeneratePalette) {
    generatePalette();
    generateGrid();
    regeneratePalette = false;
  }

  // Draw the palette swatches and the randomized grid of color cells.
  drawPalette();
 fill(255);
 rect(0, gridHeight / 10 + 0.5 * gridHeight / 10, width, gridHeight / 20);
  drawGrid();
 
 fill(0);
  text("Mouse left-right changes hue, up-down changes brightness.", 20, height-20);
  text("Click anywhere to generate a new palette and grid from primary swatches.", 20, height);
}

function drawPalette() {
  // Main base color swatch.
  fill(baseCol);
  rect(0, 0, (3 * width) / 4, gridHeight / 10);

  // Complementary accent swatch.
  fill(accentCol);
  rect((3 * width) / 4, 0, width / 4, gridHeight / 10);

  // Create a range of related base colors by varying brightness while keeping
  // the same hue and saturation.
  for (let i = 0; i < baseColors.length; i++) {
    let c = baseColors[i];
    fill(c);
    rect(i * ((3 * width) / 4) / baseColors.length, gridHeight / 10,
      ((3 * width) / 4) / baseColors.length + 1, gridHeight / 10);
  }

  // Create a smaller set of accent tones in the same way.
  for (let i = 0; i < accentColors.length; i++) {
    let c = accentColors[i];
    fill(c);
    rect((3 * width / 4) + i * (width / 4) / accentColors.length, gridHeight / 10,
      (width / 4) / accentColors.length + 1, gridHeight/ 10);
  }
}

function drawGrid() {
  // Draw a grid of cells, each filled with a randomly chosen color from the
  // base or accent palette.
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      fill(grid[i][j]);
      rect(i * width / numRows, gridHeight / 5 + j * gridHeight / numCols,
        width / numRows, gridHeight / numCols);
    }
  }
}

function generatePalette() {
  // Generate a spectrum of related colors for the main palette.
  for (let i = 0; i < baseColors.length; i++) {
    // Create variations by changing brightness while keeping hue and saturation.
    let brightness = map(i, 0, baseColors.length - 1, 20, 80);
    let c = color(hue(baseCol), saturation(baseCol), brightness);
    baseColors[i] = c;
  }

  // Generate a complementary accent palette with a similar brightness range.
  for (let i = 0; i < accentColors.length; i++) {
    // Create variations by changing brightness while keeping hue and saturation.
    let brightness = map(i, 0, accentColors.length - 1, 20, 80);
    let c = color(hue(accentCol), saturation(accentCol), brightness);
    accentColors[i] = c;
  }
}

function generateGrid() {
  // Build a 2D array of color cells. Most cells choose from the base palette,
  // while some use the accent palette to create visual contrast.
  for (let i = 0; i < numRows; i++) {
    grid[i] = new Array(numCols);
    for (let j = 0; j < numCols; j++) {
      let baseOrAccent = random();
      if (baseOrAccent < 0.75) {
        let alphaIndex = int(random(baseColors.length));
        grid[i][j] = baseColors[alphaIndex];
      } else {
        let alphaIndex = int(random(accentColors.length));
        grid[i][j] = accentColors[alphaIndex];
      }
    }
  }
}

function mousePressed() {
  // Click anywhere to create a new palette and grid using the current mouse position.
  regeneratePalette = true;
}