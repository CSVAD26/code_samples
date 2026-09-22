let img;
let saliencyMap;

function preload() {
  img = loadImage('assets/example_1.jpg'); // Load an example image');
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
  createCanvas(img.width * 2, img.height);
  
  image(img, 0, 0);
  saliencyMap = createImage(img.width, img.height);
  generateSaliencyMap();
  displaySaliencyMap();

}



function generateSaliencyMap() {
  img.loadPixels();
  saliencyMap.loadPixels();

  // Create a blurred copy of the original image.
  let blurredImg = img.get();
  blurredImg.filter(BLUR, 20);
  blurredImg.loadPixels();

  // Calculate the difference between the original and blurred image brightness.
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      let index = (x + y * img.width) * 4;

      let originalBrightness = (img.pixels[index] + img.pixels[index + 1] + img.pixels[index + 2]) / 3;
      let blurredBrightness = (blurredImg.pixels[index] + blurredImg.pixels[index + 1] + blurredImg.pixels[index + 2]) / 3;
      
      let contrast = abs(originalBrightness - blurredBrightness) * 3; // Amplify contrast for visibility.
      contrast = constrain(contrast, 0, 255); // Keep value within range.
      
      saliencyMap.pixels[index] = contrast;
      saliencyMap.pixels[index + 1] = contrast;
      saliencyMap.pixels[index + 2] = contrast;
      saliencyMap.pixels[index + 3] = 255;
    }
  }
  saliencyMap.updatePixels();
}

function displaySaliencyMap() {
  // Display the generated saliency map.
  image(saliencyMap, img.width, 0);
}

