// Arduino: send a range of values over serial
void setup() {
  Serial.begin(9600);  // Match Python's baud rate
}

void loop() {
  for (int i = 0; i <= 255; i++) {
    Serial.println(i);  // Send each value on a new line
    delay(50);          // Small delay for readability / buffer safety
    Serial.flush();

  }
}