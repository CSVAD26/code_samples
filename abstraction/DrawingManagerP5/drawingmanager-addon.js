/**
 * DynamicBrushes p5.js Addon
 * A drawing abstraction library that extends p5.prototype
 * 
 * This version integrates directly with p5.js, extending the prototype
 * to add DynamicBrushes functionality as native p5 methods.
 * 
 * @version 1.0.0
 * @author Ported from Processing version
 */

(function() {
  'use strict';

  // Helper classes that don't need to be exposed
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
    constructor(p, x1, y1, x2, y2, fillColor, strokeColor, noFill, noStroke, applyTransforms = true) {
      super();
      this.p = p;
      this.start = new DPoint(x1, y1);
      this.end = new DPoint(x2, y2);
      this.fillColor = fillColor;
      this.strokeColor = strokeColor;
      this.noFill = noFill;
      this.noStroke = noStroke;
      if (applyTransforms) {
        this.renderWithTransforms(p);
      } else {
        this.renderTransformation(p);
      }
    }
    
    renderWithTransforms(p) {
      // Apply pending transformations from the stack
      if (p._dbObjects) {
        p.push();
        for (let i = 0; i < p._dbObjects.length; i++) {
          if (p._dbObjects[i] instanceof PushTransform || 
              p._dbObjects[i] instanceof PopTransform ||
              p._dbObjects[i] instanceof Translate ||
              p._dbObjects[i] instanceof Scale ||
              p._dbObjects[i] instanceof Rotate) {
            p._dbObjects[i].renderTransformation(p);
          }
        }
        this.renderTransformation(p);
        p.pop();
      } else {
        this.renderTransformation(p);
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
      p.line(this.start.x, this.start.y, this.end.x, this.end.y);
    }
  }

  class DEllipse extends DObj {
    constructor(p, x, y, width, height, fillColor, strokeColor, noFill, noStroke, applyTransforms = true) {
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
      if (applyTransforms) {
        this.renderWithTransforms(p);
      } else {
        this.renderTransformation(p);
      }
    }
    
    renderWithTransforms(p) {
      // Apply pending transformations from the stack
      if (p._dbObjects) {
        p.push();
        for (let i = 0; i < p._dbObjects.length; i++) {
          if (p._dbObjects[i] instanceof PushTransform || 
              p._dbObjects[i] instanceof PopTransform ||
              p._dbObjects[i] instanceof Translate ||
              p._dbObjects[i] instanceof Scale ||
              p._dbObjects[i] instanceof Rotate) {
            p._dbObjects[i].renderTransformation(p);
          }
        }
        this.renderTransformation(p);
        p.pop();
      } else {
        this.renderTransformation(p);
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
      p.ellipse(this.x, this.y, this.width, this.height);
    }
  }

  class DRect extends DObj {
    constructor(p, x, y, width, height, fillColor, strokeColor, noFill, noStroke, applyTransforms = true) {
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
      if (applyTransforms) {
        this.renderWithTransforms(p);
      } else {
        this.renderTransformation(p);
      }
    }
    
    renderWithTransforms(p) {
      // Apply pending transformations from the stack
      if (p._dbObjects) {
        p.push();
        for (let i = 0; i < p._dbObjects.length; i++) {
          if (p._dbObjects[i] instanceof PushTransform || 
              p._dbObjects[i] instanceof PopTransform ||
              p._dbObjects[i] instanceof Translate ||
              p._dbObjects[i] instanceof Scale ||
              p._dbObjects[i] instanceof Rotate) {
            p._dbObjects[i].renderTransformation(p);
          }
        }
        this.renderTransformation(p);
        p.pop();
      } else {
        this.renderTransformation(p);
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
      p.rect(this.x, this.y, this.width, this.height);
    }
  }

  class DTriangle extends DObj {
    constructor(p, x1, y1, x2, y2, x3, y3, fillColor, strokeColor, noFill, noStroke, applyTransforms = true) {
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
      if (applyTransforms) {
        this.renderWithTransforms(p);
      } else {
        this.renderTransformation(p);
      }
    }
    
    renderWithTransforms(p) {
      // Apply pending transformations from the stack
      if (p._dbObjects) {
        p.push();
        for (let i = 0; i < p._dbObjects.length; i++) {
          if (p._dbObjects[i] instanceof PushTransform || 
              p._dbObjects[i] instanceof PopTransform ||
              p._dbObjects[i] instanceof Translate ||
              p._dbObjects[i] instanceof Scale ||
              p._dbObjects[i] instanceof Rotate) {
            p._dbObjects[i].renderTransformation(p);
          }
        }
        this.renderTransformation(p);
        p.pop();
      } else {
        this.renderTransformation(p);
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
      let p = new PushTransform(true);
      this.objects.push(p);
    }
    
    popMatrix() {
      let p = new PopTransform(true);
      this.objects.push(p);
    }
    
    rotate(theta) {
      let r = new Rotate(theta, true);
      this.objects.push(r);
    }
    
    scale(x, y) {
      let s = new Scale(x, y, true);
      this.objects.push(s);
    }
    
    translate(x, y) {
      let t = new Translate(x, y, true);
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

  // Extend p5.prototype with DynamicBrushes methods
  p5.prototype.initDynamicBrushes = function() {
    this._dbObjects = [];
    this._dbStrokeColor = new DColor(0, 0, 0);
    this._dbFillColor = new DColor(255, 255, 255);
    this._dbStrokeWeight = 1;
    this._dbNoFill = true;
    this._dbNoStroke = false;
  };

  p5.prototype.dbFill = function(r, g, b, a = 255) {
    if (!this._dbObjects) this.initDynamicBrushes();
    this._dbFillColor = new DColor(r, g, b, a);
    this._dbNoFill = false;
    return this;
  };

  p5.prototype.dbStroke = function(r, g, b, a = 255) {
    if (!this._dbObjects) this.initDynamicBrushes();
    this._dbStrokeColor = new DColor(r, g, b, a);
    this._dbNoStroke = false;
    return this;
  };

  p5.prototype.dbNoStroke = function() {
    if (!this._dbObjects) this.initDynamicBrushes();
    this._dbNoStroke = true;
    return this;
  };

  p5.prototype.dbNoFill = function() {
    if (!this._dbObjects) this.initDynamicBrushes();
    this._dbNoFill = true;
    return this;
  };

  p5.prototype.dbStrokeWeight = function(weight) {
    if (!this._dbObjects) this.initDynamicBrushes();
    this._dbStrokeWeight = weight;
    return this;
  };

  p5.prototype.dbLine = function(x1, y1, x2, y2) {
    if (!this._dbObjects) this.initDynamicBrushes();
    let l = new DLine(this, x1, y1, x2, y2, this._dbFillColor, this._dbStrokeColor, this._dbNoFill, this._dbNoStroke);
    this._dbObjects.push(l);
    return this;
  };

  p5.prototype.dbAddShape = function() {
    if (!this._dbObjects) this.initDynamicBrushes();
    let dShape = new DShape(this, this._dbFillColor, this._dbStrokeColor, this._dbStrokeWeight, this._dbNoFill, this._dbNoStroke);
    this._dbObjects.push(dShape);
    return dShape;
  };

  p5.prototype.dbTriangle = function(x1, y1, x2, y2, x3, y3) {
    if (!this._dbObjects) this.initDynamicBrushes();
    let t = new DTriangle(this, x1, y1, x2, y2, x3, y3, this._dbFillColor, this._dbStrokeColor, this._dbNoFill, this._dbNoStroke);
    this._dbObjects.push(t);
    return this;
  };

  p5.prototype.dbEllipse = function(x, y, width, height) {
    if (!this._dbObjects) this.initDynamicBrushes();
    let e = new DEllipse(this, x, y, width, height, this._dbFillColor, this._dbStrokeColor, this._dbNoFill, this._dbNoStroke);
    this._dbObjects.push(e);
    return this;
  };

  p5.prototype.dbImage = function(img, x, y, width, height) {
    if (!this._dbObjects) this.initDynamicBrushes();
    let i = new DImage(this, img, x, y, width, height);
    this._dbObjects.push(i);
    return this;
  };

  p5.prototype.dbRect = function(x, y, width, height) {
    if (!this._dbObjects) this.initDynamicBrushes();
    let r = new DRect(this, x, y, width, height, this._dbFillColor, this._dbStrokeColor, this._dbNoFill, this._dbNoStroke);
    this._dbObjects.push(r);
    return this;
  };

  p5.prototype.dbPushMatrix = function() {
    if (!this._dbObjects) this.initDynamicBrushes();
    let p = new PushTransform();
    this._dbObjects.push(p);
    return this;
  };

  p5.prototype.dbPopMatrix = function() {
    if (!this._dbObjects) this.initDynamicBrushes();
    let p = new PopTransform();
    this._dbObjects.push(p);
    return this;
  };

  p5.prototype.dbRotate = function(theta) {
    if (!this._dbObjects) this.initDynamicBrushes();
    let r = new Rotate(theta);
    this._dbObjects.push(r);
    return this;
  };

  p5.prototype.dbScale = function(x, y) {
    if (!this._dbObjects) this.initDynamicBrushes();
    let s = new Scale(x, y);
    this._dbObjects.push(s);
    return this;
  };

  p5.prototype.dbTranslate = function(x, y) {
    if (!this._dbObjects) this.initDynamicBrushes();
    let t = new Translate(x, y);
    this._dbObjects.push(t);
    return this;
  };

  p5.prototype.dbClear = function() {
    if (!this._dbObjects) this.initDynamicBrushes();
    this._dbObjects = [];
    this.background(255);
    return this;
  };

  p5.prototype.dbSaveSVG = function(filename) {
    if (typeof this.saveSVG === 'function') {
      let now = new Date();
      let timestamp = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}-${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}`;
      this.saveSVG(filename || `drawing_${timestamp}.svg`);
    } else {
      console.warn('p5.svg library not loaded. Include p5.svg.js to enable SVG export.');
    }
    return this;
  };

  // Version info
  p5.prototype.dbVersion = function() {
    return "1.0.0";
  };

  console.log('DynamicBrushes p5 addon loaded (v1.0.0)');
})();
