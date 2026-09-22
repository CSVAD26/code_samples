/*
arduino_input

Demonstrates the reading of digital and analog pins of an Arduino board
running the StandardFirmata firmware.

To use:
* Using the Arduino software, upload the StandardFirmata example (located
  in Examples > Firmata > StandardFirmata) to your Arduino board.
* Run this sketch and look at the list of serial ports printed in the
  message area below. Note the index of the port corresponding to your
  Arduino board (the numbering starts at 0).  (Unless your Arduino board
  happens to be at index 0 in the list, the sketch probably won't work.
  Stop it and proceed with the instructions.)
* Modify the "arduino = new Arduino(...)" line below, changing the number
  in Arduino.list()[0] to the number corresponding to the serial port of
  your Arduino board.  Alternatively, you can replace Arduino.list()[0]
  with the name of the serial port, in double quotes, e.g. "COM5" on Windows
  or "/dev/tty.usbmodem621" on Mac.
  
* Run this sketch. The circle shows the values of the
  analog input at the specified pin index (default 0) (the bigger the circle, the higher the reading on the
  corresponding analog input pin). Note that the readings from unconnected pins will fluctuate randomly. 
  
For more information, see: http://playground.arduino.cc/Interfacing/Processing
*



*/

import processing.serial.*;

import cc.arduino.*;

Arduino arduino;
int xPin = 3;
int yPin = 4;
int zPin = 5;

int xMin = 279;
int xMax = 402;
int yMin = 267;
int yMax = 400; 
int zMin = 281;
int zMax = 414;

void setup() {
  size(470, 280);

  // Prints out the available serial ports.
  println(Arduino.list());
  
  // Modify this line, by changing the "0" to the index of the serial
  // port corresponding to your Arduino board (as it appears in the list
  // printed by the line above).
  //arduino = new Arduino(this, Arduino.list()[2], 57600);
  
  // Alternatively, use the name of the serial port corresponding to your
  // Arduino (in double-quotes), as in the following line.
  arduino = new Arduino(this, "/dev/tty.usbmodem21101", 57600);
}

void draw() {
  float xAxis = map(arduino.analogRead(xPin),xMin,xMax,0,255);
  float yAxis = map(arduino.analogRead(yPin),yMin,yMax,0,255);
  float zAxis = map(arduino.analogRead(zPin),zMin,zMax,0,255);

  println(arduino.analogRead(xPin)+","+arduino.analogRead(yPin)+","+arduino.analogRead(zPin));
  background(xAxis,yAxis,zAxis);



  
}
