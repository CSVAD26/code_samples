// adapted from The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

class ButterflyMover {
  constructor(x, y, m, frameNumber, fps) {
    this.mass = m;
    this.position = createVector(x, y);
    this.prevPosition = createVector(x,y); 
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.frameNumber = frameNumber;
    this.fps = fps;
  }

  applyForce(force) {
    let f = p5.Vector.div(force, this.mass);
    this.acceleration.add(f);
  }

  update() {
    this.prevPosition = this.position.copy();
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
    this.angle = p5.Vector.sub(this.position, this.prevPosition).heading();
    // Advance animation frame
  if (millis() - lastChange >= frameInterval) {
    lastChange = millis();
    currentIndex = (currentIndex + 1) % this.frameNumber;
  }

  }

  checkEdges() {
    if (this.position.x > width) {
      this.position.x = width;
      this.velocity.x *= -1;
    } else if (this.position.x < 0) {
      this.velocity.x *= -1;
      this.position.x = 0;
    }
    if (this.position.y > height) {
      this.velocity.y *= -1;
      this.position.y = height;
    }
    else if (this.position.y < 0) {
      this.velocity.y *= -1;
      this.position.y = 0;
    }
  }
}
