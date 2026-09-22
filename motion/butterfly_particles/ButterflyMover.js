// ButterflyMover class adapted for multiple instances
// Each instance manages its own animation frame index/timing

class ButterflyMover {
  constructor(x, y, m, frameNumber, fps) {
    this.mass = m;
    this.position = createVector(x, y);
    this.prevPosition = createVector(x, y);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);

    // animation
    this.frameNumber = frameNumber;
    this.fps = fps;
    this.frameInterval = 1000 / this.fps;
    this.lastChange = 0;
    this.animationIndex = 0;

    this.angle = 0;
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

    // compute heading from recent motion
    this.angle = p5.Vector.sub(this.position, this.prevPosition).heading();

    // Advance animation frame for this instance
    if (millis() - this.lastChange >= this.frameInterval) {
      this.lastChange = millis();
      this.animationIndex = (this.animationIndex + 1) % this.frameNumber;
    }
  }

  draw(frames) {
    // frames is an array of p5.Image
    let img = frames[this.animationIndex % frames.length];
    if (!img) return;
    const maxSize = 60; // base size
    let ratio = min(maxSize / img.width, maxSize / img.height);
    let w = img.width * ratio * this.mass;
    let h = img.height * ratio * this.mass;
    push();
    translate(this.position.x, this.position.y);
    rotate(this.angle + PI / 2);
    image(img, 0, 0, w, h);
    pop();
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
    } else if (this.position.y < 0) {
      this.velocity.y *= -1;
      this.position.y = 0;
    }
  }
}
