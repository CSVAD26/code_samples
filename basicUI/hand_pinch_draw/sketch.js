let video;
let hands = [];
let canvasLayer; // paint accumulates here

let drawing = false; // true only while fingers are pinched
let prev = null;
const pinchDistance = 40;

async function setup() {
  createCanvas(640, 480);
  canvasLayer = createGraphics(640, 480);
  canvasLayer.stroke("red");
  canvasLayer.strokeWeight(8);

  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  const handPose = await ml5.handPose();
  handPose.detectStart(video, (results) => (hands = results));
}

function draw() {
  // mirrored video
  push();
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0, width, height);
  pop();

  let tip = null;
  drawing = false;
  if (hands.length > 0) {
    let thumb = hands[0].thumb_tip;
    let index = hands[0].index_finger_tip;
    tip = { x: width - index.x, y: index.y };

    drawing = dist(thumb.x, thumb.y, index.x, index.y) < pinchDistance;
  }

  if (drawing && tip && prev) {
    canvasLayer.line(prev.x, prev.y, tip.x, tip.y);
  }
  prev = tip;

  image(canvasLayer, 0, 0);

  // cursor: filled when drawing is on
  if (tip) {
    stroke("red");
    strokeWeight(2);
    fill(drawing ? "red" : color(255, 0, 0, 0));
    circle(tip.x, tip.y, 20);
  }
}
