# DrawingManager for p5.js

A drawing abstraction library for p5.js that provides a higher-level interface for creating and manipulating drawings programmatically.

## Overview

DrawingManager is a port of the Processing DrawingManager library to p5.js. It records drawing operations as objects, allowing you to:

- Create complex, programmatic drawings
- Apply transformations to shapes
- Build shapes incrementally with vertices
- Clear and redraw the canvas
- Export drawings (with p5.svg library)

## Installation

1. Download `drawingmanager.js`
2. Include it in your HTML after p5.js:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.js"></script>
<script src="drawingmanager.js"></script>
```

## Quick Start

```javascript
let drawingManager;
let shape;

function setup() {
  createCanvas(800, 600);
  background(255);
  drawingManager = new DrawingManager(window);
  drawingManager.strokeWeight(3);
}

function mousePressed() {
  shape = drawingManager.addShape();
  drawingManager.stroke(0, 0, 0);
}

function mouseDragged() {
  shape.addVertex(mouseX, mouseY);
}

function keyPressed() {
  if (key === 'c') {
    drawingManager.clear();
  }
}
```

## Core API

### DrawingManager

Create a new DrawingManager instance:
```javascript
let dm = new DrawingManager(window);
```

#### Drawing Methods

- `fill(r, g, b, [a])` - Set fill color
- `stroke(r, g, b, [a])` - Set stroke color
- `noFill()` - Disable fill
- `noStroke()` - Disable stroke
- `strokeWeight(weight)` - Set stroke weight
- `line(x1, y1, x2, y2)` - Draw a line
- `ellipse(x, y, width, height)` - Draw an ellipse
- `rect(x, y, width, height)` - Draw a rectangle
- `triangle(x1, y1, x2, y2, x3, y3)` - Draw a triangle
- `image(img, x, y, width, height)` - Draw an image

#### Shape Methods

- `addShape()` - Create and return a new DShape object for building custom shapes

#### Transformation Methods

- `pushMatrix()` - Save current transformation state
- `popMatrix()` - Restore previous transformation state
- `translate(x, y)` - Translate origin
- `rotate(theta)` - Rotate (in radians)
- `scale(x, y)` - Scale

#### Utility Methods

- `clear()` - Clear all drawing objects and reset background
- `saveSVG([filename])` - Save drawing as SVG (requires p5.svg library)

### DShape

A custom shape that can be built vertex by vertex.

#### Methods

- `addVertex(x, y)` - Add a vertex at absolute coordinates
- `addDelta(x, y)` - Add a vertex relative to the last vertex
- `close()` - Mark the shape as closed (connects last vertex to first)
- `open()` - Mark the shape as open
- `pushMatrix()` - Add a push transformation to this shape
- `popMatrix()` - Add a pop transformation to this shape
- `translate(x, y)` - Add a translation to this shape
- `rotate(theta)` - Add a rotation to this shape
- `scale(x, y)` - Add a scale to this shape
- `calculateCentroid()` - Get the centroid of the shape
- `getNormalizedVertices()` - Get vertices relative to centroid

#### Properties

- `position` - DPoint representing the last added vertex
- `vertices` - Array of all DPoint vertices

## Examples

### DripBrush

A drawing tool where drips fall from your drawing path.

Features:
- Draw by clicking and dragging
- Drips automatically fall from your drawing at random intervals
- Press 'c' to clear
- Press 's' to stop all drips
- Press spacebar to save as SVG

### BasicDrawing

A simple freehand drawing example showing the minimal setup.

## Advanced Usage

### Building Complex Shapes

```javascript
let shape = drawingManager.addShape();
shape.addVertex(100, 100);
shape.addVertex(200, 100);
shape.addVertex(200, 200);
shape.addVertex(100, 200);
shape.close(); // Connects back to first vertex
```

### Using Transformations

```javascript
let shape = drawingManager.addShape();
shape.pushMatrix();
shape.translate(width/2, height/2);
shape.rotate(PI/4);
shape.addVertex(0, -50);
shape.addVertex(50, 50);
shape.addVertex(-50, 50);
shape.popMatrix();
```

### Relative Drawing

```javascript
let shape = drawingManager.addShape();
shape.addVertex(100, 100); // Start at 100,100
shape.addDelta(50, 0);     // Move right 50px
shape.addDelta(0, 50);     // Move down 50px
shape.addDelta(-50, 0);    // Move left 50px
```

## Differences from Processing Version

- Pass `window` instead of `this` when creating DrawingManager
- PDF export is replaced with SVG export (requires p5.svg library)
- Uses JavaScript conventions (camelCase, etc.)
- No need for imports - just include the script

## SVG Export (Optional)

To enable SVG export, include the p5.svg library:

```html
<script src="https://unpkg.com/p5.js-svg@1.5.1"></script>
```

Then you can use:
```javascript
drawingManager.saveSVG('myDrawing.svg');
```

## Browser Compatibility

Works in all modern browsers that support p5.js:
- Chrome/Edge
- Firefox
- Safari
- Opera

## Version

1.0.0

## License

Same as original Processing library

## Credits

Ported from the Processing DrawingManager library to p5.js
