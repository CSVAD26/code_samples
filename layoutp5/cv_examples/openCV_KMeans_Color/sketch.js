// Upload an image to group its pixels into k representative RGB colors with
// OpenCV K-means, then display a simplified, color-segmented version.
let img;
let outImg;
let cvReady = false;
let k = 5; // Number of color clusters; '+' and '-' change this value.

function onOpenCvReady() {
  // Called by index.html when the asynchronous OpenCV.js script finishes loading.
  document.getElementById('status').innerText = 'OpenCV.js is ready ✅';
  cvReady = true;
}

function setup() {
  createCanvas(800, 800);
  noLoop();
  // Add a file picker; the selected image is processed in handleFile().
  createFileInput(handleFile).position(10, 40);
}

function handleFile(file) {
  // Ignore non-image files, and wait until the selected image has loaded.
  if (file.type === 'image') {
    img = loadImage(file.data, () => {
      resizeCanvas(img.width, img.height);
      image(img, 0, 0);
      if (cvReady) {
        // Process immediately only after OpenCV is ready.
        segmentImage();
      } else {
        console.log("OpenCV not ready yet.");
      }
    });
  }
}

function segmentImage() {
  // Read the p5 image pixels and wrap the canvas image data in an OpenCV matrix.
  img.loadPixels();
  let src = cv.matFromImageData(img.canvas.getContext('2d').getImageData(0, 0, img.width, img.height));

  // Drop the alpha channel because clustering uses the three RGB color values.
  let rgb = new cv.Mat();
  cv.cvtColor(src, rgb, cv.COLOR_RGBA2RGB);

  let rows = rgb.rows;
  let cols = rgb.cols;
  let channels = rgb.channels();
  let sampleCount = rows * cols;

  // Make one RGB sample row per image pixel; K-means expects this N x 3 layout.
  let samples = new cv.Mat(sampleCount, channels, cv.CV_32F);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      for (let c = 0; c < channels; c++) {
        samples.floatPtr(y * cols + x)[c] = rgb.ucharPtr(y, x)[c];
      }
    }
  }

  // Cluster colors into k groups. Stop after at most 10 iterations or when
  // cluster centers change by less than the configured epsilon; use 3 attempts.
  let labels = new cv.Mat();
  let centers = new cv.Mat();
  let criteria = new cv.TermCriteria(cv.TermCriteria_EPS + cv.TermCriteria_MAX_ITER, 10, 1.0);

  cv.kmeans(samples, k, labels, criteria, 3, cv.KMEANS_PP_CENTERS, centers);

  // Replace every source pixel with the RGB center of its assigned cluster.
  let clustered = new cv.Mat(rows, cols, rgb.type());
  for (let i = 0; i < sampleCount; i++) {
    let cluster_idx = labels.intAt(i, 0);
    let y = Math.floor(i / cols);
    let x = i % cols;
    for (let c = 0; c < channels; c++) {
      clustered.ucharPtr(y, x)[c] = centers.floatAt(cluster_idx, c);
    }
  }

  // Convert the clustered RGB result back to RGBA for display by p5.js.
  let dst = new cv.Mat();
  cv.cvtColor(clustered, dst, cv.COLOR_RGB2RGBA);

  // Copy the OpenCV result into a p5.Image, then draw it on the canvas.
  outImg = createImage(cols, rows);
  outImg.loadPixels();
  outImg.pixels.set(dst.data);
  outImg.updatePixels();

  image(outImg, 0, 0);

  // Release temporary OpenCV matrices to avoid growing WebAssembly memory usage.
  src.delete(); rgb.delete(); samples.delete();
  labels.delete(); centers.delete();
  clustered.delete(); dst.delete();
}

function keyPressed() {
  // Adjust the number of color groups and rerun segmentation on the current image.
  if (key === '+' || key === '=') {
    k++;
    if (img && cvReady) segmentImage();
  } else if (key === '-' && k > 2) {
    k--;
    if (img && cvReady) segmentImage();
  }
}
