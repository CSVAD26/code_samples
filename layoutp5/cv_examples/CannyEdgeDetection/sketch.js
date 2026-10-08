// example from https://kylemcdonald.github.io/cv-examples/
// https://inspirit.github.io/jsfeat/sample_canny_edge.html

// Webcam input, grayscale processing buffer, and p5 image used to display the result.
var capture;
var buffer;
var result;
var w = 640,
    h = 480;

function setup() {
    // Request webcam video at the same dimensions as the processing canvas.
    capture = createCapture({
        audio: false,
        video: {
            width: w,
            height: h
        }
    }, function() {
        console.log('capture ready.')
    });
    capture.elt.setAttribute('playsinline', '');
    createCanvas(w, h);
    capture.size(w, h);
    capture.hide();
    // jsfeat stores a single grayscale value per pixel in this matrix.
    buffer = new jsfeat.matrix_t(w, h, jsfeat.U8C1_t);
}

function jsfeatToP5(src, dst) {
    // Create a p5 image if needed, then copy each grayscale value into RGB pixels.
    if (!dst || dst.width != src.cols || dst.height != src.rows) {
        dst = createImage(src.cols, src.rows);
    }
    var n = src.data.length;
    dst.loadPixels();
    var srcData = src.data;
    var dstData = dst.pixels;
    for (var i = 0, j = 0; i < n; i++) {
        var cur = srcData[i];
        dstData[j++] = cur;
        dstData[j++] = cur;
        dstData[j++] = cur;
        dstData[j++] = 255;
    }
    dst.updatePixels();
    return dst;
}

function draw() {
    // Show the live camera frame underneath the processed edge image.
    image(capture, 0, 0, 640, 480);
    capture.loadPixels();
    // Wait until the webcam has supplied pixel data before processing a frame.
    if (capture.pixels.length > 0) {
        // Read the three HTML range controls and convert their 0-100 values
        // into the ranges expected by the blur and Canny functions.
        var blurSize = select('#blurSize').elt.value;
        var lowThreshold = select('#lowThreshold').elt.value;
        var highThreshold = select('#highThreshold').elt.value;

        blurSize = map(blurSize, 0, 100, 1, 12);
        lowThreshold = map(lowThreshold, 0, 100, 0, 255);
        highThreshold = map(highThreshold, 0, 100, 0, 255);

        // Canny operates on a grayscale image; blur first to reduce image noise.
        jsfeat.imgproc.grayscale(capture.pixels, w, h, buffer);
        jsfeat.imgproc.gaussian_blur(buffer, buffer, blurSize, 0);
        // Detect edges using the low and high thresholds from the sliders.
        jsfeat.imgproc.canny(buffer, buffer, lowThreshold, highThreshold);
        var n = buffer.rows * buffer.cols;
        // Uncomment to invert the edge image (swap light and dark pixel values).
//        for (var i = 0; i < n; i++) {
//            buffer.data[i] = 255 - buffer.data[i];
//        }
        // Convert the processed jsfeat matrix into a p5 image and draw it.
        result = jsfeatToP5(buffer, result);
        image(result, 0, 0, 640, 480);
    }
}
