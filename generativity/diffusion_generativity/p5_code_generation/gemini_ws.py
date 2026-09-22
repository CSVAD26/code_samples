# ws_gemini_json.py
import asyncio
import websockets
import json
import requests
import re
import os
import config   # must provide GEMINI_API_KEY
from typing import Optional

API_KEY = config.GEMINI_API_KEY
MODEL = "gemini-2.5-flash"

# --- helper: call Gemini ---
def query_gemini_raw(prompt_text: str) -> str:
    """
    Send a prompt (string) to Gemini and return raw text response.
    We prepend a JSON-only instruction so the model returns only JSON.
    """
    # Strict instruction for JSON output
    instruction = (
        "You must respond EXACTLY with a single JSON object and nothing else. "
        "Do not include markdown, backticks, commentary, or any explanation. "
        "Follow this schema strictly:\n"
        "{\n"
        '  "canvas": { "width": number, "height": number, "background": string },\n'
        '  "shapes": [ { "type": string, ... } ]\n'
        "}\n"
        "Allowed canvas width: 500px. Allowed canvas height: 500px.\n"
        "Allowed shape types: ellipse, rect, line, triangle, polygon.\n"
        "Allowed color formats: hex #RRGGBB or rgba(r,g,b,a).\n"
        "Clamp numeric values to reasonable ranges (e.g., coordinates within canvas).\n\n"
        "Now: produce JSON following that schema for this user prompt:\n"
        f"USER PROMPT: {prompt_text}\n"
    )

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={API_KEY}"
    headers = {"Content-Type": "application/json"}
    data = {
        "contents": [{"parts": [{"text": instruction}]}],
        # Keep other fields default; adjust temperature if desired
    }

    r = requests.post(url, headers=headers, data=json.dumps(data), timeout=30)
    r.raise_for_status()
    return r.json()["candidates"][0]["content"]["parts"][0]["text"]

# --- helper: try to extract JSON substring from raw text ---
def extract_json_from_text(text: str) -> Optional[dict]:
    # Try direct parse first
    try:
        obj = json.loads(text)
        return obj
    except Exception:
        pass

    # If not direct, try to extract the first {...} block
    # naive brace-matching search for top-level JSON object
    start = text.find('{')
    if start == -1:
        return None
    depth = 0
    for i in range(start, len(text)):
        if text[i] == '{':
            depth += 1
        elif text[i] == '}':
            depth -= 1
            if depth == 0:
                candidate = text[start:i+1]
                try:
                    return json.loads(candidate)
                except Exception:
                    return None
    return None

# --- Validation (basic) ---
def validate_scene(scene: dict) -> bool:
    # Basic structure check
    if not isinstance(scene, dict):
        return False
    canvas = scene.get("canvas")
    shapes = scene.get("shapes")
    if not isinstance(canvas, dict) or not isinstance(shapes, list):
        return False
    # Validate canvas numbers
    w = canvas.get("width"); h = canvas.get("height")
    if not (isinstance(w, (int,float)) and isinstance(h, (int,float))):
        return False
    # Validate shapes entries minimally
    allowed_types = {"ellipse","rect","line","triangle","polygon"}
    for s in shapes:
        if not isinstance(s, dict):
            return False
        t = s.get("type")
        if t not in allowed_types:
            return False
        # numeric checks for coords where present
        # (Detailed per-type checks could be added)
    return True

# --- WebSocket handler ---
async def handle_client(ws, path=None):
    async for message in ws:
        prompt_text = message.strip()
        print("Prompt:", prompt_text)
        try:
            raw = query_gemini_raw(prompt_text)
        except Exception as e:
            err = {"error": "LLM request failed", "detail": str(e)}
            await ws.send(json.dumps(err))
            continue

        scene = extract_json_from_text(raw)
        if scene is None or not validate_scene(scene):
            await ws.send(json.dumps({"error":"invalid_or_unparsable_json", "raw": raw[:1000]}))
            continue

        # Everything looks OK: send the scene JSON (string) to client
        print("scene:", scene)
        await ws.send(json.dumps({"scene": scene}))

# --- server entrypoint ---
async def main():
    print("Starting Gemini JSON WebSocket server ws://localhost:5000")
    async with websockets.serve(handle_client, "localhost", 5000):
        await asyncio.Future()

if __name__ == "__main__":
    asyncio.run(main())
