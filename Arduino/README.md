# Arduino + Creative Coding (Processing and p5.js)

This folder contains two ways to connect Arduino data to creative-coding sketches:

- Processing (Java-based) examples using Firmata to read Arduino pins directly
- p5.js (JavaScript) example using a lightweight Python WebSocket bridge to forward Serial data to the browser

Use whichever path best fits your project.

## Quick start

**For Processing:**
1. Upload StandardFirmata to Arduino (Arduino IDE: File → Examples → Firmata → StandardFirmata)
2. Open a `.pde` sketch from `Processing/` folder
3. Run the sketch

**For p5.js + WebSocket:**
1. Install Python dependencies: `pip3 install pyserial websockets`
2. Configure serial port in `p5/websocket_serial/serialsocket.py`
3. Run bridge: `python3 Arduino/p5/websocket_serial/serialsocket.py`
4. Open `p5/websocket_serial/p5websocket/index.html` in browser

---

## Folder structure

- `Processing/`
  - `arduino_firmata_analog_input/` – Read analog pins (e.g., potentiometers, photoresistors)
  - `arduino_firmata_digital_input/` – Read digital pins (e.g., buttons, switches)
  - `arduino_firmata_analog_accel/` – Read accelerometer data via analog pins
  - `arduino_firmata_distance_sensor/` – Read distance/ultrasonic sensor data
  - `analogsensor_smoothing/` – Smoothing noisy analog sensor readings
  - Each contains a `.pde` sketch you can open in the Processing IDE. Upload StandardFirmata to your Arduino first.
- `p5/websocket_serial/`
  - `serialsocket.py` – Python WebSocket ↔ Serial bridge
  - `p5websocket/` – p5.js client (index.html + sketch.js + libraries)

---

## Option A: Processing + Firmata

This route lets Processing talk directly to your Arduino through the Firmata protocol.

### Requirements
- Arduino IDE (to upload a firmware)
- Processing IDE (https://processing.org/download)
- Arduino board + USB cable

### Steps
1. In the Arduino IDE: File → Examples → Firmata → StandardFirmata. Upload to your board.
2. Open one of the sketches under `Arduino/Processing/` in the Processing IDE
   (for example `Processing/arduino_firmata_analog_input/arduino_firmata_analog_input.pde`).
3. In the Processing sketch, if there is a serial port selection, choose your Arduino’s port.
4. Run the Processing sketch. You should see live readings from the board.

Tips:
- On macOS, Arduino ports look like `/dev/cu.usbmodem###` or `/dev/cu.usbserial-####`.
- If you get a permissions error on Linux, you may need to add your user to the `dialout` group or adjust udev rules.

---

## Option B: p5.js + WebSocket Serial Bridge

This route forwards Arduino Serial data to a p5.js sketch via a small Python WebSocket server. It’s handy when you want your visual in the browser without using experimental Web Serial APIs.

### Requirements
- Python 3.9+
- Packages: `pyserial`, `websockets`
- A basic Arduino sketch that prints sensor values on Serial at 9600 baud

Install packages (once):

```bash
pip3 install pyserial websockets
```

### Configure the bridge
Edit `Arduino/p5/websocket_serial/serialsocket.py`:

- Set the correct serial port:
  ```python
  SERIAL_PORT = '/dev/tty.usbmodem21201'  # Change to your Arduino port
  BAUD_RATE = 9600
  ```

The bridge includes basic filtering that only forwards numeric values (via `data.isdigit()`) to reduce noise. You can modify this logic in the `serial_to_websocket()` function to handle different data formats.

### Run the bridge
From the repository root (or the `websocket_serial` folder):

```bash
python3 Arduino/p5/websocket_serial/serialsocket.py
```

You should see a message that a WebSocket server is listening on `ws://localhost:8765`.

### Open the p5.js client
Open `Arduino/p5/websocket_serial/p5websocket/index.html` in a browser (or serve the folder with a simple static server). The included `sketch.js` connects to `ws://localhost:8765` and logs any messages from the Python bridge.

If you’re running into local file restrictions, serve the folder:

```bash
# from Arduino/p5/websocket_serial/p5websocket
python3 -m http.server 8000
# then open http://localhost:8000
```

### Arduino sketch example
Upload an Arduino sketch that prints values to Serial, e.g.:

```cpp
void setup() {
  Serial.begin(9600);
}

void loop() {
  int sensor = analogRead(A0);
  Serial.println(sensor);
  delay(20);
}
```

The Python bridge will read each line and forward it to the p5.js client.

---

## Troubleshooting
- Can't find the serial port
  - Unplug/replug the Arduino and check the port name. On macOS it's usually `/dev/tty.usbmodem...` or `/dev/cu.usbmodem...`.
  - List available ports with: `ls /dev/tty.*` or `ls /dev/cu.*`
- Browser can't connect to ws://localhost:8765
  - Make sure `serialsocket.py` is running and not blocked by a firewall.
  - Confirm the address/port in `p5websocket/sketch.js` matches the Python server.
- Garbage or no data
  - Match the Arduino `Serial.begin(9600)` to the Python `BAUD_RATE`.
  - Check that the Arduino is printing values that pass the `data.isdigit()` filter in `serialsocket.py`.
- Connection errors or "device busy"
  - Close the Arduino IDE Serial Monitor before running `serialsocket.py` (both can't use the port simultaneously).

---

## Where to put your code
- For Processing-based projects: duplicate one of the example folders in `Processing/` and start from there.
- For p5.js + WebSocket: duplicate the `p5websocket/` folder and adapt `sketch.js` to parse the incoming messages and drive visuals.

---

## Next steps
- Extend `serialsocket.py` to broadcast to multiple clients
- Define a simple CSV/JSON line format for your serial messages (e.g., `time,sensor1,sensor2`)
- Add a UI in p5.js to select visual modes based on incoming data
