# Generativity

This directory collects generative art and simulation examples in both their original Processing (Java) form and p5.js (JavaScript) ports. It also contains space for future diffusion and Python-based generativity experiments.

## Contents
- `procedural_generativity_processing/` – Original Processing sketches (.pde) exploring randomness, Gaussian distributions, Perlin noise, particle systems, and form deformation.
- `procedural_generativity_p5/` – One-to-one p5.js ports of the Processing sketches with equivalent visual behavior. GUI-driven sketches use lightweight HTML range inputs instead of ControlP5.
- `diffusion_generativity/` – Python + model API experiments (Gemini code generation, image generation, WebSocket JSON scene service). Subfolders:
	- `Model_API_scripts/` – Stand‑alone Python scripts calling Gemini (text, image, model listing) and a `config.py` (replace with your own key, do NOT commit real keys).
	- `p5_code_generation/` – WebSocket server (`gemini_ws.py`) returning structured JSON for p5 shape scenes.
	- `p5_image_generation/` – (If present) experiments generating imagery via model prompts.
- `p5_svg_generation/` – p5-based SVG or vector export experiments (added recently; not yet documented in detail).
- `gem_env/` – Recommended location for a Python virtual environment (created via `python -m venv gem_env`).

> Folder names here reflect the current repository state. If you rename or reorganize, update this list to preserve orientation for contributors.

## Processing → p5 Mapping
| Concept | Processing Sketch | p5 Port Folder |
|---------|-------------------|----------------|
| Random walk | `random/` | `random/` |
| Random walk (Manhattan constrained) | `random_walk_manhattan/` | `random_walk_manhattan/` |
| Random walk (Gaussian angle) | `random_walk_gaussian/` | `random_walk_gaussian/` |
| Perlin walk (basic) | `perlin_walk/` | `perlin_walk/` |
| Perlin walk (overlay) | `perlin/` | `perlin/` |
| Perlin 1D position probe | `perlin1D/` | `perlin1D/` |
| Perlin form walk (curved shape) | `perlin_form_walk/` | `perlin_form_walk/` |
| Gaussian seed scatter (single dandelion) | `gaussian/` | `gaussian/` |
| Gaussian particle dandelions (multiple systems + GUI) | `gaussian_particle/` | `gaussian_particle/` |
| Perlin particle field (10k agents + GUI) | `perlin_particle/` | `perlin_particle/` |

## Running the p5 Examples
Each p5 example folder contains `index.html` and `sketch.js` (plus assets when needed). You can:

1. Open the `index.html` directly in a browser (sufficient for most examples).  
2. Or serve locally for consistency (optional):

```bash
# From repository root or inside generativity/
python3 -m http.server 8080
# or
npx serve .
```
Then visit: `http://localhost:8080/generativity/procedural_generativity_p5/<example>/`.

### Asset Notes
- Dandelion / seed examples (`gaussian`, `gaussian_particle`) rely on `seed.svg` copied into their p5 folders. p5 loads it via `loadImage()`; scaling and rotation reproduce the original `PShape` transforms.

### Performance Tips
- `perlin_particle` preallocates 10,000 agents and uses a slider to vary `agentsCount`. Raise gradually to avoid frame drops.
- Lower `overlayAlpha` to retain longer trails; raise it to clear faster.
- Reducing `noiseStrength` or `strokeWidth` can also improve clarity in dense fields.



## Troubleshooting
| Issue | Possible Cause | Suggestion |
|-------|----------------|-----------|
| SVG not rendering | Path mismatch | Confirm asset copied and relative path in `preload()` matches folder. |
| Sliders unresponsive | Missing `id` or selector | Ensure `input` ids match those bound in `bindSlider()` helpers. |
| Low frame rate | Too many active agents | Reduce `agentsCount` or stroke width; consider capping maxAgents. |
| Trails vanish instantly | High `overlayAlpha` | Lower the overlay alpha to lengthen decay. |


## License / Attribution
Original conceptual inspirations from *Generative Gestaltung* examples (as noted in comments). Ports retain attribution headers where present. Ensure any redistribution maintains original credits.


## Gemini API (Python) Setup

The diffusion / model API scripts use Google Gemini. Follow these steps to configure a secure local environment.

### 1. Create a Gemini API Key
1. Sign in with a Google account.
2. Visit: https://aistudio.google.com/ (Google AI Studio).
3. Accept any Terms of Service if prompted.
4. Navigate to "Get API Key" (or "API keys" in left sidebar).
5. Create a new key and copy it. Treat this key like a password.

### 2. Store Your Key (Choose ONE Method)

Create a config.py file with the contents GEMINI_API_KEY = "YOUR KEY HERE" in the same directory as the python script that calls the Gemini API

Add `config.py` to your `.gitignore` so that your key is not committed to the repo.


### 3. Install Dependencies
Python scripts require installing the dependencies below:

```bash
pip install google-genai websockets requests python-dotenv
```


### 4. Run Example Scripts

List available models:
```bash
python diffusion_generativity/Model_API_scripts/prompt_available_models_gemini.py
```
Generate an image:
```bash
python diffusion_generativity/Model_API_scripts/prompt_image_gemini.py
```
Start JSON scene WebSocket server:
```bash
python diffusion_generativity/p5_code_generation/gemini_ws.py
```
Then connect (example JavaScript client) to `ws://localhost:5000`, send a prompt string, receive a JSON scene object.


### 5. Common Issues
| Symptom | Cause | Fix |
|---------|-------|-----|
| 403 / permission error | Key lacks access / expired | Recreate key in AI Studio; confirm correct model name. |
| `ModuleNotFoundError` | Missing dependency | Re-run `pip install -r requirements.txt`. |
| Empty response / missing `candidates` | Model name mismatch | Verify model string in script (e.g., `gemini-2.5-flash`). |
| Hard-coded key in history | Key accidentally committed | Delete from history if needed, rotate key immediately. |

### 8. Model Naming Notes
Scripts may reference preview or versioned models (e.g., `gemini-2.0-flash-preview-image-generation`). Consult AI Studio model catalog for up-to-date names; adjust accordingly in scripts.


