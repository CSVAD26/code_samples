function setup() {
  createCanvas(400, 400);
  fill(0,255,0);
  ellipse(width/2,height/2,100,200);
  fill(0,0,255)
  rectRectMode(CENTER);
  rect(width/2-40,height/2,20,20);
  rect(width/2+40,height/2,20,20);
  fill(255,0,0);
  ellipse(width/2, height/2+40, 200, 2);
}

