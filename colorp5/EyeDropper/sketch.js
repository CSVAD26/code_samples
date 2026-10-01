// Displays a jpg and uses p5.Image.get() to sample and show the color at each image click.
let abstractImage;
let sampledColor;

const imageX = 20;
const imageY = 50;
const imageWidth = 600;
const imageHeight = 400;

function preload() {
  // Load the bitmap that will be sampled by the eyedropper.
  abstractImage = loadImage("data/abstract.jpg");
}

function setup() {
  createCanvas(640, 500);
}

function draw() {
  background(245);

  fill(20);
  noStroke();
  textSize(16);
  text("Click the image to sample a color.", imageX, 28);

  image(abstractImage, imageX, imageY, imageWidth, imageHeight);

  if (sampledColor) {
    // Show the most recently sampled color and its RGB values.
    fill(sampledColor);
    rect(imageX, 462, 36, 24);

    fill(20);
    textSize(14);
    text(
      `RGB: ${round(red(sampledColor))}, ${round(green(sampledColor))}, ${round(blue(sampledColor))}`,
      imageX + 48,
      480
    );
  }
}

function mousePressed() {
  // Only sample clicks that land inside the displayed bitmap.
  if (
    mouseX >= imageX && mouseX < imageX + imageWidth &&
    mouseY >= imageY && mouseY < imageY + imageHeight
  ) {
    // Convert canvas coordinates to the original bitmap's pixel coordinates.
    const sourceX = floor((mouseX - imageX) * abstractImage.width / imageWidth);
    const sourceY = floor((mouseY - imageY) * abstractImage.height / imageHeight);

    // p5.Image.get(x, y) returns the color of one pixel in the loaded bitmap.
    sampledColor = abstractImage.get(sourceX, sourceY);
  }
}
