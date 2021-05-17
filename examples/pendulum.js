setup = function() {
  frameRate(30);
  angleMode(DEGREES);
  rectMode(CENTER);
  ang = createVector(30);
  angVel = createVector();
  angAcc = createVector(0.0);
  stroke(180);
  strokeWeight(4);
}

let ang, angVel, angAcc;
const gravity = 400;
let rad = 300;
draw = function() {
  background(0);

  if (mouseIsPressed) {
    let mouse = createVector(mouseX, mouseY);
    let loc = createVector(width / 2);
    ang.x = Vector.sub(mouse, loc).heading() - 90;
    angVel.zero();

  }

  angAcc.x = -gravity * sin(ang.x) / rad;

  let fr = angVel.copy();
  fr.normalize();
  fr.mult(-0.01);

  angAcc.add(fr);

  angVel.add(angAcc);
  angAcc.zero();

  ang.add(angVel);

  let px, py;
  px = width / 2 + rad * cos(ang.x + 90);
  py = rad * sin(ang.x + 90);
  line(width / 2, 0, px, py);
  fill(255);
  noStroke();
  drawingContext.shadowBlur = 20;
  drawingContext.shadowColor = '#ffffff';

  circle(px, py, 50);
}


require("../");