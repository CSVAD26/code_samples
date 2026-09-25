function setup() {
  createCanvas(400, 400);
  fill(255,0,0)
  ellipse(width/2,height/2,300,100)
  fill(0,255,0)
  rectMode(CENTER)
  rect(width/2-20,height/2,10,10)
  rect(width/2+20,height/2,10,10)
  rect(width/2, height/2+20,100,1)
}
