# basicUI

small p5.js example sketches for creating basic drawing UIs

Contents

- `basic_shape_drawing/` — Simple drawing utilities for creating and selecting primitive shapes (lines, rectangles, circles).
- `basic_shape_drawing_oop/` — same functionality as above but using object oriented approach.
- `htmlUI/` — Examples combining p5 canvas with HTML inputs (sliders, selectors, color pickers) to control drawing parameters like stroke width, color, and effects.
- `p5.5/` — Example of p5.5 UI library from https://github.com/eltapir/p5.5/tree/main
- `hand_draw/` — Webcam hand tracking with ml5.js handPose: the index, middle, and ring fingertips draw in red, green, and blue over the mirrored video. Based on https://p5js.org/tutorials/speak-with-your-hands/
- `hand_pinch_draw/` — Gesture recognition with ml5.js handPose: pinching the thumb and index finger draws; releasing stops drawing; the index fingertip is the brush.

How to run

Open the desired subfolder and open `index.html` in a web browser. Each sketch includes a `libraries/` folder with p5.js if needed.

`hand_draw/` and `hand_pinch_draw/` load p5.js and ml5.js from CDNs and need webcam access, so they must be served from `localhost` rather than opened as a file. Easiest: right-click `index.html` in VS Code and choose "Open with Live Server" (Live Server extension). Alternatively run `python3 -m http.server` in the folder. Allow camera permission when prompted.

Developed for CSVAD25 by pixelmaid
