# SpikeBrush Example - Code Comparison

## Overview
The SpikeBrush creates triangular spikes that point in the direction of mouse movement. Each spike has a random length between 10 and 100 pixels.

## Original Library Version

```javascript
let drawingManager;

function setup() {
  createCanvas(1056, 816);
  background(255);
  
  // Initialize DrawingManager
  drawingManager = new DrawingManager(window);
}

function mouseDragged() {
  let xDist = mouseX - pmouseX;
  let yDist = mouseY - pmouseY;
  let theta = atan2(xDist, yDist);
  
  drawingManager.stroke(0, 0, 0);
  drawingManager.fill(0, 0, 0);
  
  drawingManager.pushMatrix();
  drawingManager.translate(mouseX, mouseY);
  drawingManager.rotate(TWO_PI - theta);
  
  let spikeLength = random(10, 100);
  drawingManager.triangle(-10, 0, 10, 0, 0, spikeLength);
  
  drawingManager.popMatrix();
}

function keyPressed() {
  if (key === ' ') {
    drawingManager.saveSVG();
  } else if (key === 'c' || key === 'C') {
    drawingManager.clear();
  }
}
```

## Addon Version

```javascript
function setup() {
  createCanvas(1056, 816);
  background(255);
  
  // Initialize DrawingManager addon
  initDrawingManager();
}

function mouseDragged() {
  let xDist = mouseX - pmouseX;
  let yDist = mouseY - pmouseY;
  let theta = atan2(xDist, yDist);
  
  dmStroke(0, 0, 0);
  dmFill(0, 0, 0);
  
  dmPushMatrix();
  dmTranslate(mouseX, mouseY);
  dmRotate(TWO_PI - theta);
  
  let spikeLength = random(10, 100);
  dmTriangle(-10, 0, 10, 0, 0, spikeLength);
  
  dmPopMatrix();
}

function keyPressed() {
  if (key === ' ') {
    dmSaveSVG();
  } else if (key === 'c' || key === 'C') {
    dmClear();
  }
}
```

## Key Differences

| Aspect | Original Library | Addon Version |
|--------|------------------|---------------|
| **Setup** | `new DrawingManager(window)` | `initDrawingManager()` |
| **Usage** | `drawingManager.method()` | `dmMethod()` |
| **Variable** | Requires variable declaration | No variable needed |
| **Style** | Object-oriented | Functional (native p5 feel) |

## Method Mapping

| Original | Addon |
|----------|-------|
| `drawingManager.stroke()` | `dmStroke()` |
| `drawingManager.fill()` | `dmFill()` |
| `drawingManager.pushMatrix()` | `dmPushMatrix()` |
| `drawingManager.popMatrix()` | `dmPopMatrix()` |
| `drawingManager.translate()` | `dmTranslate()` |
| `drawingManager.rotate()` | `dmRotate()` |
| `drawingManager.triangle()` | `dmTriangle()` |
| `drawingManager.clear()` | `dmClear()` |
| `drawingManager.saveSVG()` | `dmSaveSVG()` |

## Files Created

### Original Library Version
- `examples/SpikeBrush/index.html`
- `examples/SpikeBrush/sketch.js`

### Addon Version
- `examples-addon/SpikeBrush/index.html`
- `examples-addon/SpikeBrush/sketch.js`

## How It Works

1. **Mouse Movement Tracking**: Uses `pmouseX` and `pmouseY` to calculate the direction of movement
2. **Angle Calculation**: `atan2(xDist, yDist)` determines the angle between current and previous mouse positions
3. **Transformation**: The canvas is rotated so the triangle points in the direction of movement
4. **Triangle Drawing**: A triangle with a base of 20 pixels wide and random height (10-100) is drawn
5. **Reset**: Transformation matrix is restored with `popMatrix()`

## Tips for Using SpikeBrush

- **Slower Movement**: Creates longer, more dramatic spikes
- **Faster Movement**: Creates more frequent, shorter spikes
- **Curved Paths**: Creates interesting radiating patterns
- **Straight Lines**: Creates uniform spike patterns

## Extending the Example

Try modifying these values to create different effects:

```javascript
// Change spike base width
drawingManager.triangle(-20, 0, 20, 0, 0, spikeLength);  // Wider base

// Change spike length range
let spikeLength = random(20, 200);  // Longer spikes

// Add color variation
let col = random(255);
drawingManager.fill(col, 0, 255 - col);  // Purple to pink gradient

// Multiple spikes per position
for (let i = 0; i < 3; i++) {
  let offset = random(-5, 5);
  drawingManager.triangle(-10 + offset, 0, 10 + offset, 0, 0, random(10, 100));
}
```
