# Getting Started with DrawingManager P5.js

## Quick Start (30 seconds)

1. **Open the examples**
   - Navigate to `abstraction/DrawingManagerP5/`
   - Open `index.html` in your browser
   - Click on any example to try it out

2. **Try drawing**
   - Click and drag your mouse to draw
   - Press 'c' to clear
   - Press spacebar to save (if p5.svg is loaded)

## Create Your Own Project (2 minutes)

### Step 1: Set up HTML

Create an `index.html` file:

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.js"></script>
    <script src="path/to/drawingmanager.js"></script>
  </head>
  <body>
    <script src="sketch.js"></script>
  </body>
</html>
```

### Step 2: Create Your Sketch

Create a `sketch.js` file:

```javascript
let dm;  // DrawingManager instance
let shape;

function setup() {
  createCanvas(800, 600);
  background(255);
  dm = new DrawingManager(window);
  dm.strokeWeight(3);
  dm.stroke(0, 0, 0);
}

function mousePressed() {
  shape = dm.addShape();
}

function mouseDragged() {
  shape.addVertex(mouseX, mouseY);
}

function keyPressed() {
  if (key === 'c') {
    dm.clear();
  }
}
```

### Step 3: Open in Browser

- Open your `index.html` in a web browser
- Start drawing!

## Common Patterns

### Pattern 1: Simple Line Drawing
```javascript
let dm;
let shape;

function setup() {
  createCanvas(800, 600);
  dm = new DrawingManager(window);
}

function mousePressed() {
  shape = dm.addShape();
}

function mouseDragged() {
  shape.addVertex(mouseX, mouseY);
}
```

### Pattern 2: Shapes with Fill
```javascript
let dm;

function setup() {
  createCanvas(800, 600);
  dm = new DrawingManager(window);
  dm.fill(255, 0, 0);  // Red fill
  dm.stroke(0, 0, 0);  // Black stroke
  dm.rect(100, 100, 200, 150);
}
```

### Pattern 3: Animated Shapes
```javascript
let dm;
let shapes = [];

function setup() {
  createCanvas(800, 600);
  dm = new DrawingManager(window);
}

function mousePressed() {
  let shape = dm.addShape();
  shape.addVertex(mouseX, mouseY);
  shapes.push(shape);
}

function draw() {
  for (let shape of shapes) {
    shape.addDelta(0, 1);  // Move down
  }
}
```

### Pattern 4: Transformations
```javascript
let dm;
let shape;

function setup() {
  createCanvas(800, 600);
  dm = new DrawingManager(window);
  shape = dm.addShape();
  
  // Set up transformation
  shape.pushMatrix();
  shape.translate(width/2, height/2);
  shape.rotate(PI/4);
  
  // Draw transformed shape
  shape.addVertex(0, -50);
  shape.addVertex(50, 50);
  shape.addVertex(-50, 50);
  
  shape.popMatrix();
}
```

## Keyboard Shortcuts (in examples)

- **Spacebar** - Save as SVG (if p5.svg library loaded)
- **C** - Clear canvas
- **S** - Stop animations (in DripBrush)

## Common Questions

**Q: Why do I pass `window` instead of `this`?**  
A: In p5.js global mode, `window` provides access to all p5 functions. In instance mode, you'd pass your p5 instance.

**Q: Can I use this with p5.js instance mode?**  
A: Yes! Pass your p5 instance instead of `window`:
```javascript
let sketch = function(p) {
  let dm;
  
  p.setup = function() {
    p.createCanvas(800, 600);
    dm = new DrawingManager(p);
  };
};

new p5(sketch);
```

**Q: How do I export to SVG?**  
A: Include the p5.svg library before drawingmanager.js:
```html
<script src="https://unpkg.com/p5.js-svg@1.5.1"></script>
<script src="drawingmanager.js"></script>
```

Then call: `dm.saveSVG('myDrawing.svg');`

**Q: Can I change colors mid-drawing?**  
A: Yes! Call `dm.stroke()` or `dm.fill()` before creating new shapes.

## Next Steps

1. **Try the examples** - See different techniques in action
2. **Read the README** - Full API documentation
3. **Experiment** - Combine patterns to create unique effects
4. **Check out the Processing examples** - Many can be adapted to p5.js

## Troubleshooting

**Nothing appears on screen:**
- Check browser console for errors
- Make sure p5.js loaded before drawingmanager.js
- Verify you called `new DrawingManager(window)`

**Drawing doesn't work:**
- Make sure you called `dm.addShape()` in `mousePressed()`
- Verify you're calling `shape.addVertex()` with valid coordinates

**Clear doesn't work:**
- Check that you're calling `dm.clear()` not `clear()`
- Make sure `dm` variable is accessible in your function

## Resources

- **Full Documentation**: See README.md
- **Examples**: Browse the examples/ folder
- **p5.js Reference**: https://p5js.org/reference/

Happy drawing! 🎨
