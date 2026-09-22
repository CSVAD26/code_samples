let socket;
let img;
let promptInput;
let button;
let statusMsg = "Enter prompt → click Generate";

function setup() {
  createCanvas(600, 600);

  // WebSocket connection
  socket = new WebSocket("ws://localhost:5000");

  socket.onmessage = (event) => {
    console.log("Received message: " + event.data);
    const filename = event.data;
    statusMsg = "Loading image...";

    img = loadImage(`http://localhost:5001/${filename}`, () => {
      statusMsg = "";
    });
  };

  promptInput = createInput("a fox holding a lantern");
  button = createButton("Generate");
  button.mousePressed(sendPrompt);
  
  textAlign(CENTER);
}

function draw() {
  background(220);

  if (img) {
    image(img, 0, 0, width, height);
  } else {
    text(statusMsg, width / 2, height / 2);
  }
}

function sendPrompt() {
  const prompt = promptInput.value();
  img = null;
  statusMsg = "Sending prompt...";

  socket.send(prompt);
}
