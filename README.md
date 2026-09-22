# CSVAD25 - Computational Systems for Visual Art and Design

This repository contains creative coding projects using JavaScript and p5.js for visual art and design.

## 📁 Projects

```
CSVAD25/
├── hello_world/                # Basic JavaScript examples
├── color/                      # Vanilla JS color projects
├── colorp5/                    # p5.js color projects
│   ├── ColorNodes/             # Node-based color system
│   ├── ColorPartner/           # Interactive color generation (HSB)
│   └── ColorPartnerLab/        # Interactive color generation (CIE LAB)
├── Arduino/                    # Arduino + Processing/p5.js integration
│   └── serialsocket.py         # Serial communication bridge
└── abstraction/                # Drawing abstraction libraries
    ├── DrawingManager/         # Original Processing library
    └── DrawingManagerP5/       # p5.js port with examples
        ├── drawingmanager.js       # Class-based library
        ├── drawingmanager-addon.js # p5.prototype extension
        ├── examples/               # Original library examples
        │   ├── BasicDrawing/
        │   ├── DripBrush/
        │   ├── MirrorBrush/
        │   └── SpikeBrush/
        └── examples-addon/         # Addon version examples
            ├── BasicDrawing/
            ├── MirrorBrush/
            └── SpikeBrush/
```

## 🎨 Project Details

### DrawingManager for p5.js ⭐
**Location**: `/abstraction/DrawingManagerP5/`

A drawing abstraction library ported from Processing that provides a higher-level interface for creating and manipulating drawings. Available in two versions:

- **Class-based** (`drawingmanager.js`): Traditional OOP approach with `new DrawingManager(window)`
- **Addon** (`drawingmanager-addon.js`): Extends p5.prototype with `dm` prefixed methods

**Features**:
- Record drawing operations as replayable objects
- Build shapes incrementally with vertices
- Apply transformations (translate, rotate, scale) to shapes
- Programmatic manipulation of drawings
- SVG export support (with p5.svg library)

**Examples**:
- **BasicDrawing**: Simple freehand drawing
- **DripBrush**: Animated drips that fall from drawing path
- **MirrorBrush**: Mirrored drawing with transformations
- **SpikeBrush**: Direction-based triangular spikes

[View DrawingManager Documentation →](abstraction/DrawingManagerP5/README.md)

### Arduino Integration
**Location**: `/Arduino/`
- Serial communication bridge between Arduino and Processing/p5.js
- Examples for analog input, digital input, accelerometer, and distance sensors
- Real-time sensor data visualization

### Hello World Examples
**Location**: `/hello_world/`
- Basic JavaScript setup and examples

### Color Projects
**Location**: `/color/` and `/colorp5/`
- **ColorNodes**: Interactive color node system for exploring color relationships
- **ColorPartner**: Color variation generator using HSB color space
- **ColorPartnerLab**: Color variation generator using CIE L*a*b* color space for perceptually uniform color mixing

## 🚀 Getting Started

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd CSVAD25
   ```

2. **Open any project**:
   - All p5.js projects can be opened directly in a web browser
   - For DrawingManager examples, open the `index.html` files

3. **For Arduino projects**:
   ```bash
   cd Arduino
   python3 serialsocket.py
   ```

## 🔧 Technologies

- **JavaScript** - Core programming language  
- **p5.js** - Creative coding library for graphics and interaction
- **Processing** - Java-based creative coding environment
- **Arduino** - Physical computing platform
- **CIE L*a*b*** - Perceptually uniform color space for advanced color mixing

## 📚 Documentation

- [DrawingManager Library](abstraction/DrawingManagerP5/README.md)
- [DrawingManager Addon](abstraction/DrawingManagerP5/README-ADDON.md)
- [Arduino Integration](Arduino/README.md)

---

**Creative Coding with JavaScript and p5.js** ✨