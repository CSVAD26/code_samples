let img;
let outImg;
let cvReady = false;
let k = 3; // number of clusters

function onOpenCvReady() {
  document.getElementById('status').innerText = 'OpenCV.js is ready ✅';
  cvReady = true;
}

function setup() {
  createCanvas(800, 800);
  noLoop();
  // Let user upload an image
  createFileInput(handleFile).position(10, 40);
}

function handleFile(file) {
  if (file.type === 'image') {
    img = loadImage(file.data, () => {
      resizeCanvas(img.width, img.height);
      image(img, 0, 0);
      if (cvReady) {
        segmentImage();
      } else {
        console.log("OpenCV not ready yet.");
      }
    });
  }
}

function segmentImage() {
  // Convert p5 image to cv.Mat
  img.loadPixels();
  let src = cv.matFromImageData(img.canvas.getContext('2d').getImageData(0, 0, img.width, img.height));

  // Convert RGBA to RGB
  let rgb = new cv.Mat();
  cv.cvtColor(src, rgb, cv.COLOR_RGBA2RGB);

  let rows = rgb.rows;
  let cols = rgb.cols;
  let channels = rgb.channels();
  let sampleCount = rows * cols;

  // Flatten the image into N x 3 float matrix
  let samples = new cv.Mat(sampleCount, channels, cv.CV_32F);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      for (let c = 0; c < channels; c++) {
        samples.floatPtr(y * cols + x)[c] = rgb.ucharPtr(y, x)[c];
      }
    }
  }

  // K-means
  let labels = new cv.Mat();
  let centers = new cv.Mat();
  let criteria = new cv.TermCriteria(cv.TermCriteria_EPS + cv.TermCriteria_MAX_ITER, 10, 1.0);

  cv.kmeans(samples, k, labels, criteria, 3, cv.KMEANS_PP_CENTERS, centers);

  // Reconstruct clustered image
  let clustered = new cv.Mat(rows, cols, rgb.type());
  for (let i = 0; i < sampleCount; i++) {
    let cluster_idx = labels.intAt(i, 0);
    let y = Math.floor(i / cols);
    let x = i % cols;
    for (let c = 0; c < channels; c++) {
      clustered.ucharPtr(y, x)[c] = centers.floatAt(cluster_idx, c);
    }
  }

  // Convert back to RGBA
  let dst = new cv.Mat();
  cv.cvtColor(clustered, dst, cv.COLOR_RGB2RGBA);

  // Convert to p5 Image
  outImg = createImage(cols, rows);
  outImg.loadPixels();
  outImg.pixels.set(dst.data);
  outImg.updatePixels();

  image(outImg, 0, 0);

  // Cleanup
  src.delete(); rgb.delete(); samples.delete();
  labels.delete(); centers.delete();
  clustered.delete(); dst.delete();
}

function keyPressed() {
  if (key === '+' || key === '=') {
    k++;
    if (img && cvReady) segmentImage();
  } else if (key === '-' && k > 2) {
    k--;
    if (img && cvReady) segmentImage();
  }
}
