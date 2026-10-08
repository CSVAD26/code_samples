// Builds a simple contrast-based saliency map by highlighting differences
// between the image and a blurred copy, then displays both side by side.
let img;
let saliencyMap;

function preload() {
  // Load the source image before setup so its dimensions are available.
  img = loadImage('assets/example_1.jpg');
}

/*function setup() {
  createCanvas(img.width, img.height);
  image(img, 0, 0);

  // Create a new image to store the saliency map.
  saliencyMap = createImage(img.width, img.height);
  
  generateSaliencyMap();
  displaySaliencyMap();
}*/

// Optionally, display original image and saliency map side-by-side.

function setup() {
  // Reserve one image-width for the source and one for the saliency map.
  createCanvas(img.width * 2, img.height);
  
  image(img, 0, 0);
  saliencyMap = createImage(img.width, img.height);
  generateSaliencyMap();
  displaySaliencyMap();

}



function generateSaliencyMap() {
  // Load pixel arrays so their color channels can be read and written directly.
  img.loadPixels();
  saliencyMap.loadPixels();

  // A blurred copy represents the broader surrounding brightness at each pixel.
  let blurredImg = img.get();
  blurredImg.filter(BLUR, 20);
  blurredImg.loadPixels();

  // Compare the approximate grayscale brightness of each source pixel with
  // the corresponding blurred pixel. Large differences indicate local contrast.
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      // p5 stores four consecutive values per pixel: red, green, blue, alpha.
      let index = (x + y * img.width) * 4;

      // Use the mean of RGB channels as a simple brightness estimate.
      let originalBrightness = (img.pixels[index] + img.pixels[index + 1] + img.pixels[index + 2]) / 3;
      let blurredBrightness = (blurredImg.pixels[index] + blurredImg.pixels[index + 1] + blurredImg.pixels[index + 2]) / 3;
      
      // Amplify local contrast, then clamp it to the valid 8-bit channel range.
      let contrast = abs(originalBrightness - blurredBrightness) * 3; // Amplify contrast for visibility.
      contrast = constrain(contrast, 0, 255); // Keep value within range.
      
      // Write the same value to RGB to make this output pixel grayscale and opaque.
      saliencyMap.pixels[index] = contrast;
      saliencyMap.pixels[index + 1] = contrast;
      saliencyMap.pixels[index + 2] = contrast;
      saliencyMap.pixels[index + 3] = 255;
    }
  }
  saliencyMap.updatePixels();
}

function displaySaliencyMap() {
  // Place the generated grayscale map to the right of the original image.
  image(saliencyMap, img.width, 0);
}

