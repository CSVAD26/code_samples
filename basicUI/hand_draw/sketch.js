let video;
let hands = [];
let canvasLayer; // paint accumulates here

// previous fingertip positions: index, middle, ring
let prev = [null, null, null];
const colors = ["red", "green", "blue"];
const tips = ["index_finger_tip", "middle_finger_tip", "ring_finger_tip"];

async function setup() {
  createCanvas(640, 480);
  canvasLayer = createGraphics(640, 480);
  canvasLayer.strokeWeight(8);

  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  const handPose = await ml5.handPose();
  handPose.detectStart(video, (results) => (hands = results));
}

function draw() {
  // draw the video mirrored so it matches the flipped fingertip x
  push();
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0, width, height);
  pop();

  if (hands.length > 0) {
    for (let i = 0; i < 3; i++) {
      let tip = hands[0][tips[i]];
      // mirror x so it feels like a mirror
      let x = width - tip.x;
      if (prev[i]) {
        canvasLayer.stroke(colors[i]);
        canvasLayer.line(prev[i].x, prev[i].y, x, tip.y);
      }
      prev[i] = { x: x, y: tip.y };
    }
  } else {
    prev = [null, null, null];
  }

  image(canvasLayer, 0, 0);
}
