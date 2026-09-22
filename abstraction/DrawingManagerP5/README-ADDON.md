# DrawingManager p5.js Addon

A version of the DrawingManager library that extends p5.prototype, allowing you to use DrawingManager functionality as native p5 methods.

## Installation

Include the addon script after p5.js:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.js"></script>
<script src="path/to/drawingmanager-addon.js"></script>
```

## Usage

### Initialization

Call `initDrawingManager()` in your `setup()` function:

```javascript
function setup() {
  createCanvas(800, 600);
  initDrawingManager();
}
```

### Basic Drawing

All methods are available directly on the p5 instance (or globally in global mode):

```javascript
function mousePressed() {
  dmStroke(0, 100, 200);
  dmStrokeWeight(2);
  dmNoFill();
  
  currentShape = dmAddShape();
  currentShape.addVertex(mouseX, mouseY);
}

function mouseDragged() {
  if (currentShape) {
    currentShape.addVertex(mouseX, mouseY);
  }
}
```

## API Reference

### Initialization
- `initDrawingManager()` - Initialize the drawing manager (call in setup)

### Style Methods
- `dmStroke(r, g, b, a)` - Set stroke color
- `dmFill(r, g, b, a)` - Set fill color
- `dmStrokeWeight(weight)` - Set stroke weight
- `dmNoStroke()` - Disable stroke
- `dmNoFill()` - Disable fill

### Shape Creation
- `dmAddShape()` - Create a new shape (returns DShape object)
- `dmLine(x1, y1, x2, y2)` - Draw a line
- `dmEllipse(x, y, width, height)` - Draw an ellipse
- `dmRect(x, y, width, height)` - Draw a rectangle
- `dmTriangle(x1, y1, x2, y2, x3, y3)` - Draw a triangle
- `dmImage(img, x, y, width, height)` - Draw an image

### Transformations (Global)
- `dmPushMatrix()` - Save transformation state
- `dmPopMatrix()` - Restore transformation state
- `dmTranslate(x, y)` - Translate origin
- `dmScale(x, y)` - Scale coordinate system
- `dmRotate(theta)` - Rotate coordinate system

### DShape Methods
When you create a shape with `dmAddShape()`, you can call these methods on it:

- `addVertex(x, y)` - Add a vertex at absolute position
- `addDelta(dx, dy)` - Add a vertex relative to last position
- `pushMatrix()` - Save transformation state for this shape
- `popMatrix()` - Restore transformation state for this shape
- `translate(x, y)` - Translate this shape
- `scale(x, y)` - Scale this shape
- `rotate(theta)` - Rotate this shape
- `close()` - Close the shape path
- `open()` - Open the shape path
- `setReflectX(bool)` - Enable/disable X reflection
- `setReflectY(bool)` - Enable/disable Y reflection

### Utility Methods
- `dmClear()` - Clear all shapes and reset canvas
- `dmSaveSVG(filename)` - Save drawing as SVG (requires p5.svg library)
- `dmVersion()` - Get version string

## Differences from Original Library

### Original Library (Class-based)
```javascript
let drawingManager = new DrawingManager(this);
drawingManager.stroke(0, 100, 200);
let shape = drawingManager.addShape();
shape.addVertex(mouseX, mouseY);
drawingManager.clear();
```

### Addon Version (p5.prototype extension)
```javascript
initDrawingManager();
dmStroke(0, 100, 200);
let shape = dmAddShape();
shape.addVertex(mouseX, mouseY);
dmClear();
```

## Key Features

1. **Native p5 Integration** - All methods extend p5.prototype
2. **Prefix Convention** - All methods use `dm` prefix to avoid conflicts
3. **Chainable** - Style methods return `this` for chaining
4. **Auto-initialization** - Methods auto-initialize if needed
5. **Same Functionality** - All features from original library available

## Examples

### Basic Drawing
See `examples-addon/BasicDrawing/` - Simple freehand drawing

### Mirror Brush
See `examples-addon/MirrorBrush/` - Demonstrates transformations with mirrored drawing

## Method Naming Convention

All DrawingManager methods use the `dm` prefix to avoid conflicts with native p5 methods:

| Original Method | Addon Method |
|----------------|--------------|
| `stroke()` | `dmStroke()` |
| `fill()` | `dmFill()` |
| `addShape()` | `dmAddShape()` |
| `clear()` | `dmClear()` |

## Advanced Usage

### Working with Transformations

```javascript
let shape = dmAddShape();

// Set up transformation matrix
shape.pushMatrix();
shape.translate(width/2, height/2);
shape.rotate(PI/4);
shape.scale(2, 2);

// Add vertices (will be transformed)
shape.addVertex(0, 0);
shape.addVertex(50, 0);
shape.addVertex(50, 50);

// Restore transformation
shape.popMatrix();
```

### Multiple Shapes with Different Styles

```javascript
// Blue shape
dmStroke(0, 100, 200);
dmStrokeWeight(2);
let blueShape = dmAddShape();
blueShape.addVertex(100, 100);
blueShape.addVertex(200, 200);

// Red shape
dmStroke(200, 50, 50);
dmStrokeWeight(4);
let redShape = dmAddShape();
redShape.addVertex(300, 100);
redShape.addVertex(400, 200);
```

## License

Same as original DrawingManager library

## Version

1.0.0
