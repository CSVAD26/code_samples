
import asyncio
import websockets
import subprocess
import os
from http.server import SimpleHTTPRequestHandler
from socketserver import TCPServer

# -------------------------------------------
# CONFIG
# -------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
IMAGES_DIR = os.path.join(BASE_DIR, "images")
SCRIPT_PATH = os.path.join(BASE_DIR, "prompt_image_poll.py")

WS_PORT = 5000
HTTP_PORT = 5001

os.makedirs(IMAGES_DIR, exist_ok=True)


# -------------------------------------------
# WEBSOCKET HANDLER
# -------------------------------------------
async def handle_client(websocket):
    async for message in websocket:
        print(f"Received prompt: {message}")

        # Make output filename
        outfile = f"img_{os.urandom(16).hex()}.png"
        outpath = os.path.join(IMAGES_DIR, outfile)

        print(f"Saving to: {outpath}")

        # Run image generator script
        try:
            subprocess.run(
                ["python", SCRIPT_PATH, message, outpath],
                check=True
            )
        except subprocess.CalledProcessError as e:
            await websocket.send("ERROR: image generation failed")
            print("Subprocess error:", e)
            continue

        # Return filename only (client loads via HTTP server)
        await websocket.send(outfile)
        print("Returned filename to client:", outfile)


async def start_websocket_server():
    print(f"WebSocket server running on ws://localhost:{WS_PORT}")
    async with websockets.serve(handle_client, "localhost", WS_PORT):
        await asyncio.Future()  # run forever


# -------------------------------------------
# HTTP SERVER WITH CORS
# -------------------------------------------
class CORSHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        super().end_headers()


def start_http_server():
    os.chdir(IMAGES_DIR)
    httpd = TCPServer(("", HTTP_PORT), CORSHandler)
    print(f"HTTP image server running at http://localhost:{HTTP_PORT}")
    httpd.serve_forever()


async def main():
    loop = asyncio.get_running_loop()

    # Run HTTP server in a separate thread
    loop.run_in_executor(None, start_http_server)

    # Run WebSocket server in asyncio
    await start_websocket_server()


# -------------------------------------------
# RUN BOTH SERVERS
# -------------------------------------------
if __name__ == "__main__":
    asyncio.run(main())
