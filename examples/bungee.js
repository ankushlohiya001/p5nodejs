setup=function(){
  // frameRate(10);
  // noLoop();
  pos=createVector(0, len);
  vel=createVector();
  acc=createVector();
  anchor=createVector(width/2, height/2);

  pos.add(anchor);
  strokeWeight(4);
  colorMode(HSL);
  angleMode(DEGREES);
}

let pos, vel, acc, len=200;
let anchor;
draw=function(){

  if(mouseIsPressed) pos.set(mouseX, mouseY);
  background(0, 20);
  stroke(255);

  let sp=Vector.sub(pos, anchor);
  let crnt=sp.mag();
  sp.normalize();

  let dist=crnt - len;
  sp.mult(-0.006 * dist);

  acc.add(sp);

  let gravity=createVector(0, 1);
  acc.add(gravity);

  let drag=vel.copy();
  let velVal=vel.mag();
  drag.normalize();
  const con=0.5*0.001;
  drag.mult(- con * velVal**2);

  acc.add(drag);

  vel.add(acc);
  pos.add(vel);
  acc.zero();

  line(anchor.x, anchor.y, pos.x, pos.y);

  let hu=map(Vector.sub(pos, anchor).heading(), -180, 180, 0, 360);
  stroke(hu, 100, 50);

  push();
  drawingContext.shadowBlur=20;
  drawingContext.shadowColor=color(hu, 100, 50);
  strokeWeight(8);
  circle(pos.x, pos.y, 100);
  pop();

}

require("../");
