import processing.serial.*;
import cc.arduino.*;

Arduino arduino;

float mx[];
float my[]; 

void setup() {
  size(400, 400); 
  arduino = new Arduino(this, "/dev/tty.usbmodem1201", 57600);

  mx = new float[100];
  my = new float[100];
}

void mousePressed() {
  background(255);
  for (int i=0; i<100; i++) {
    mx[i] = mouseX;
    my[i] = mouseY;
  }
}

void draw() {
  int smoothRate =  arduino.analogRead(0);
  float smoothValue = map(smoothRate,90,800,1,0.01);
  
  //println(smoothRate+","+smoothValue);

  noStroke(); 
  fill(255, 255, 255, 5); 

  rect(0, 0, width, height); 

  noFill(); 
  stroke(0); 
  strokeWeight(2);
  beginShape();
  for (int i=0; i<100; i++) {
    vertex(mx[i], my[i]);
  }
  endShape(); 

  if (mousePressed) {
    for (int i=0; i<99; i++) {
      mx[i] = mx[i+1];
      my[i] = my[i+1];
    }
    mx[99] = mouseX; 
    my[99] = mouseY;
  } else {
    for (int i=1; i<99; i++) {
      float currentX = mx[i];
      float targetX = (mx[i-1] + mx[i] + mx[i+1])/3.0;
      float differenceX = (currentX - targetX)*smoothValue;
       float currentY = my[i];
      float targetY = (my[i-1] + my[i] + my[i+1])/3.0;
      float differenceY = (currentY - targetY)*smoothValue;
      println(currentX,targetX,differenceX);
      mx[i] = currentX-differenceX;//(mx[i-1] + mx[i] + mx[i+1])/3.0;
      my[i] = currentY-differenceY;//(my[i-1] + my[i] + my[i+1])/3.0;
    }
  }
}

void keyPressed(){
  background(255);
  mx = new float[100];
  my = new float[100];
}
