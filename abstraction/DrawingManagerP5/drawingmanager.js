/**
 * DynamicBrushes p5.js Library
 * A drawing abstraction library for p5.js
 * 
 * This library provides a higher-level drawing interface that records drawing operations
 * and allows for transformations, SVG export, and programmatic manipulation of shapes.
 * 
 * @version 1.0.0
 * @author Ported from Processing version
 */

class DColor {
  constructor(r, g, b, a = 255) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }
}

class DObj {
  renderTransformation(p) {
    // To be overridden by subclasses
  }
}

class DPoint extends DObj {
  constructor(x, y) {
    super();
    this.x = x;
    this.y = y;
  }
  
  renderTransformation(p) {
    // DPoint doesn't render anything, it's just a coordinate
  }
}

class PushTransform extends DObj {
  constructor(shouldRender = true) {
    super();
    this.shouldRender = shouldRender;
  }
  
  renderTransformation(p) {
    if (this.shouldRender) {
      p.push();
    }
  }
}

class PopTransform extends DObj {
  constructor(shouldRender = true) {
    super();
    this.shouldRender = shouldRender;
  }
  
  renderTransformation(p) {
    if (this.shouldRender) {
      p.pop();
    }
  }
}

class Translate extends DObj {
  constructor(x, y, shouldRender = true) {
    super();
    this.x = x;
    this.y = y;
    this.shouldRender = shouldRender;
  }
  
  renderTransformation(p) {
    if (this.shouldRender) {
      p.translate(this.x, this.y);
    }
  }
}

class Scale extends DObj {
  constructor(x, y, shouldRender = true) {
    super();
    this.x = x;
    this.y = y;
    this.shouldRender = shouldRender;
  }
  
  renderTransformation(p) {
    if (this.shouldRender) {
      p.scale(this.x, this.y);
    }
  }
}

class Rotate extends DObj {
  constructor(theta, shouldRender = true) {
    super();
    this.theta = theta;
    this.shouldRender = shouldRender;
  }
  
  renderTransformation(p) {
    if (this.shouldRender) {
      p.rotate(this.theta);
    }
  }
}

class DLine extends DObj {
  constructor(p, x1, y1, x2, y2, fillColor, strokeColor, noFill, noStroke, dmObjects = null) {
    super();
    this.p = p;
    this.start = new DPoint(x1, y1);
    this.end = new DPoint(x2, y2);
    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
    this.noFill = noFill;
    this.noStroke = noStroke;
    if (dmObjects) {
      this.renderWithTransforms(p, dmObjects);
    } else {
      this.renderTransformation(p);
    }
  }
  
  renderWithTransforms(p, dmObjects) {
    // Apply pending transformations from the stack
    p.push();
    for (let i = 0; i < dmObjects.length; i++) {
      if (dmObjects[i] instanceof PushTransform || 
          dmObjects[i] instanceof PopTransform ||
          dmObjects[i] instanceof Translate ||
          dmObjects[i] instanceof Scale ||
          dmObjects[i] instanceof Rotate) {
        dmObjects[i].renderTransformation(p);
      }
    }
    this.renderTransformation(p);
    p.pop();
  }
  
  renderTransformation(p) {
    if (!this.noStroke) {
      p.stroke(this.strokeColor.r, this.strokeColor.g, this.strokeColor.b, this.strokeColor.a);
    } else {
      p.noStroke();
    }
    if (!this.noFill) {
      p.fill(this.fillColor.r, this.fillColor.g, this.fillColor.b, this.fillColor.a);
    } else {
      p.noFill();
    }
    p.line(this.start.x, this.start.y, this.end.x, this.end.y);
  }
}

class DEllipse extends DObj {
  constructor(p, x, y, width, height, fillColor, strokeColor, noFill, noStroke, dmObjects = null) {
    super();
    this.p = p;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
    this.noFill = noFill;
    this.noStroke = noStroke;
    if (dmObjects) {
      this.renderWithTransforms(p, dmObjects);
    } else {
      this.renderTransformation(p);
    }
  }
  
  renderWithTransforms(p, dmObjects) {
    // Apply pending transformations from the stack
    p.push();
    for (let i = 0; i < dmObjects.length; i++) {
      if (dmObjects[i] instanceof PushTransform || 
          dmObjects[i] instanceof PopTransform ||
          dmObjects[i] instanceof Translate ||
          dmObjects[i] instanceof Scale ||
          dmObjects[i] instanceof Rotate) {
        dmObjects[i].renderTransformation(p);
      }
    }
    this.renderTransformation(p);
    p.pop();
  }
  
  renderTransformation(p) {
    if (!this.noStroke) {
      p.stroke(this.strokeColor.r, this.strokeColor.g, this.strokeColor.b, this.strokeColor.a);
    } else {
      p.noStroke();
    }
    if (!this.noFill) {
      p.fill(this.fillColor.r, this.fillColor.g, this.fillColor.b, this.fillColor.a);
    } else {
      p.noFill();
    }
    p.ellipse(this.x, this.y, this.width, this.height);
  }
}

class DRect extends DObj {
  constructor(p, x, y, width, height, fillColor, strokeColor, noFill, noStroke, dmObjects = null) {
    super();
    this.p = p;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
    this.noFill = noFill;
    this.noStroke = noStroke;
    if (dmObjects) {
      this.renderWithTransforms(p, dmObjects);
    } else {
      this.renderTransformation(p);
    }
  }
  
  renderWithTransforms(p, dmObjects) {
    // Apply pending transformations from the stack
    p.push();
    for (let i = 0; i < dmObjects.length; i++) {
      if (dmObjects[i] instanceof PushTransform || 
          dmObjects[i] instanceof PopTransform ||
          dmObjects[i] instanceof Translate ||
          dmObjects[i] instanceof Scale ||
          dmObjects[i] instanceof Rotate) {
        dmObjects[i].renderTransformation(p);
      }
    }
    this.renderTransformation(p);
    p.pop();
  }
  
  renderTransformation(p) {
    if (!this.noStroke) {
      p.stroke(this.strokeColor.r, this.strokeColor.g, this.strokeColor.b, this.strokeColor.a);
    } else {
      p.noStroke();
    }
    if (!this.noFill) {
      p.fill(this.fillColor.r, this.fillColor.g, this.fillColor.b, this.fillColor.a);
    } else {
      p.noFill();
    }
    p.rect(this.x, this.y, this.width, this.height);
  }
}

class DTriangle extends DObj {
  constructor(p, x1, y1, x2, y2, x3, y3, fillColor, strokeColor, noFill, noStroke, dmObjects = null) {
    super();
    this.p = p;
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.x3 = x3;
    this.y3 = y3;
    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
    this.noFill = noFill;
    this.noStroke = noStroke;
    if (dmObjects) {
      this.renderWithTransforms(p, dmObjects);
    } else {
      this.renderTransformation(p);
    }
  }
  
  renderWithTransforms(p, dmObjects) {
    // Apply pending transformations from the stack
    p.push();
    for (let i = 0; i < dmObjects.length; i++) {
      if (dmObjects[i] instanceof PushTransform || 
          dmObjects[i] instanceof PopTransform ||
          dmObjects[i] instanceof Translate ||
          dmObjects[i] instanceof Scale ||
          dmObjects[i] instanceof Rotate) {
        dmObjects[i].renderTransformation(p);
      }
    }
    this.renderTransformation(p);
    p.pop();
  }
  
  renderTransformation(p) {
    if (!this.noStroke) {
      p.stroke(this.strokeColor.r, this.strokeColor.g, this.strokeColor.b, this.strokeColor.a);
    } else {
      p.noStroke();
    }
    if (!this.noFill) {
      p.fill(this.fillColor.r, this.fillColor.g, this.fillColor.b, this.fillColor.a);
    } else {
      p.noFill();
    }
    p.triangle(this.x1, this.y1, this.x2, this.y2, this.x3, this.y3);
  }
}

class DImage extends DObj {
  constructor(p, img, x, y, width, height) {
    super();
    this.p = p;
    this.img = img;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.renderTransformation(p);
  }
  
  renderTransformation(p) {
    p.image(this.img, this.x, this.y, this.width, this.height);
  }
}

class DShape extends DObj {
  constructor(p, fillColor, strokeColor, strokeWeight, noFill, noStroke) {
    super();
    this.p = p;
    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
    this.strokeWeight = strokeWeight;
    this.noFill = noFill;
    this.noStroke = noStroke;
    this.objects = [];
    this.vertices = [];
    this.position = new DPoint(0, 0);
    this.isClosed = false;
    this.reflectX = false;
    this.reflectY = false;
  }
  
  setReflectX(reflect) {
    this.reflectX = reflect;
  }
  
  setReflectY(reflect) {
    this.reflectY = reflect;
  }
  
  close() {
    this.isClosed = true;
  }
  
  open() {
    this.isClosed = false;
  }
  
  pushMatrix() {
    let p = new PushTransform(true);  // Changed to true so it renders
    this.objects.push(p);
  }
  
  popMatrix() {
    let p = new PopTransform(true);  // Changed to true so it renders
    this.objects.push(p);
  }
  
  rotate(theta) {
    let r = new Rotate(theta, true);  // Changed to true so it renders
    this.objects.push(r);
  }
  
  scale(x, y) {
    let s = new Scale(x, y, true);  // Changed to true so it renders
    this.objects.push(s);
  }
  
  translate(x, y) {
    let t = new Translate(x, y, true);  // Changed to true so it renders
    this.objects.push(t);
  }
  
  calculateCentroid() {
    let xSum = 0;
    let ySum = 0;
    for (let i = 0; i < this.vertices.length; i++) {
      xSum += this.vertices[i].x;
      ySum += this.vertices[i].y;
    }
    return new DPoint(xSum / this.vertices.length, ySum / this.vertices.length);
  }
  
  getNormalizedVertices() {
    let nV = [];
    let centroid = this.calculateCentroid();
    for (let i = 0; i < this.vertices.length; i++) {
      let nX = this.vertices[i].x - centroid.x;
      let nY = this.vertices[i].y - centroid.y;
      nV.push(new DPoint(nX, nY));
    }
    return nV;
  }
  
  addVertex(x, y) {
    let v = new DPoint(x, y);
    let lastVertex = this.lastVertex();
    
    if (lastVertex > -1) {
      let last = this.objects[lastVertex];
      this.p.fill(this.fillColor.r, this.fillColor.g, this.fillColor.b, this.fillColor.a);
      this.p.stroke(this.strokeColor.r, this.strokeColor.g, this.strokeColor.b, this.strokeColor.a);
      this.p.strokeWeight(this.strokeWeight);
      this.p.push();
      
      for (let i = 0; i < this.objects.length; i++) {
        this.objects[i].renderTransformation(this.p);
      }
      
      this.p.line(last.x, last.y, x, y);
      this.p.pop();
    }
    
    this.objects.push(v);
    this.vertices.push(v);
    this.position = v;
  }
  
  addDelta(x, y) {
    let lastVertex = this.lastVertex();
    if (lastVertex > -1) {
      let last = this.objects[lastVertex];
      let nX = last.x + x;
      let nY = last.y + y;
      this.addVertex(nX, nY);
    } else {
      this.addVertex(0, 0);
    }
  }
  
  lastVertex() {
    for (let i = this.objects.length - 1; i >= 0; i--) {
      let o = this.objects[i];
      if (o instanceof DPoint) {
        return i;
      }
    }
    return -1;
  }
  
  concatMatrix(shape) {
    let transforms = shape.getTransformations();
    for (let i = 0; i < transforms.length; i++) {
      this.applyTransform(transforms[i]);
    }
  }
  
  getTransformations() {
    let transforms = [];
    for (let i = 0; i < this.objects.length; i++) {
      if (!(this.objects[i] instanceof DPoint)) {
        transforms.push(this.objects[i]);
      }
    }
    return transforms;
  }
  
  applyTransform(transform) {
    if (transform instanceof PushTransform) {
      this.pushMatrix();
    } else if (transform instanceof PopTransform) {
      this.popMatrix();
    } else if (transform instanceof Translate) {
      this.translate(transform.x, transform.y);
    } else if (transform instanceof Scale) {
      this.scale(transform.x, transform.y);
    } else if (transform instanceof Rotate) {
      this.rotate(transform.theta);
    }
  }
  
  renderTransformation(p) {
    if (!this.noStroke) {
      p.stroke(this.strokeColor.r, this.strokeColor.g, this.strokeColor.b, this.strokeColor.a);
    } else {
      p.noStroke();
    }
    if (!this.noFill) {
      p.fill(this.fillColor.r, this.fillColor.g, this.fillColor.b, this.fillColor.a);
    } else {
      p.noFill();
    }
    p.strokeWeight(this.strokeWeight);
    
    p.push();
    for (let i = 0; i < this.objects.length; i++) {
      this.objects[i].renderTransformation(p);
    }
    p.pop();
  }
}

class DynamicBrushes {
  constructor(p) {
    this.p = p;
    this.objects = [];
    this.strokeColor = new DColor(0, 0, 0);
    this.fillColor = new DColor(255, 255, 255);
    this._strokeWeight = 1;  // Changed to _strokeWeight to avoid conflict
    this.noFill = true;
    this.noStroke = false;
  }
  
  fill(r, g, b, a = 255) {
    this.fillColor = new DColor(r, g, b, a);
    this.noFill = false;
  }
  
  stroke(r, g, b, a = 255) {
    this.strokeColor = new DColor(r, g, b, a);
    this.noStroke = false;
  }
  
  noStroke() {
    this.noStroke = true;
  }
  
  noFill() {
    this.noFill = true;
  }
  
  strokeWeight(weight) {
    this._strokeWeight = weight;  // Changed to _strokeWeight
  }
  
  line(x1, y1, x2, y2) {
    let l = new DLine(this.p, x1, y1, x2, y2, this.fillColor, this.strokeColor, this.noFill, this.noStroke, this.objects);
    this.objects.push(l);
  }
  
  addShape() {
    let dShape = new DShape(this.p, this.fillColor, this.strokeColor, this._strokeWeight, this.noFill, this.noStroke);
    this.objects.push(dShape);
    return dShape;
  }
  
  triangle(x1, y1, x2, y2, x3, y3) {
    let t = new DTriangle(this.p, x1, y1, x2, y2, x3, y3, this.fillColor, this.strokeColor, this.noFill, this.noStroke, this.objects);
    this.objects.push(t);
  }
  
  ellipse(x, y, width, height) {
    let e = new DEllipse(this.p, x, y, width, height, this.fillColor, this.strokeColor, this.noFill, this.noStroke, this.objects);
    this.objects.push(e);
  }
  
  image(img, x, y, width, height) {
    let i = new DImage(this.p, img, x, y, width, height);
    this.objects.push(i);
  }
  
  rect(x, y, width, height) {
    let r = new DRect(this.p, x, y, width, height, this.fillColor, this.strokeColor, this.noFill, this.noStroke, this.objects);
    this.objects.push(r);
  }
  
  pushMatrix() {
    let p = new PushTransform();
    this.objects.push(p);
  }
  
  popMatrix() {
    let p = new PopTransform();
    this.objects.push(p);
  }
  
  rotate(theta) {
    let r = new Rotate(theta);
    this.objects.push(r);
  }
  
  scale(x, y) {
    let s = new Scale(x, y);
    this.objects.push(s);
  }
  
  translate(x, y) {
    let t = new Translate(x, y);
    this.objects.push(t);
  }
  
  clear() {
    this.objects = [];
    this.p.background(255);
  }
  
  // Export to SVG using p5.js SVG library (if available)
  saveSVG(filename) {
    if (typeof this.p.saveSVG === 'function') {
      let timestamp = this.getTimestamp();
      this.p.saveSVG(filename || `drawing_${timestamp}.svg`);
    } else {
      console.warn('p5.svg library not loaded. Include p5.svg.js to enable SVG export.');
    }
  }
  
  getTimestamp() {
    let now = new Date();
    return `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}-${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}`;
  }
  
  static version() {
    return "1.0.0";
  }
}
