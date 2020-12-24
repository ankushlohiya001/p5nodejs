
setup=function() {
  // createCanvas(720, 400);
  // background(204);
  loop();
  // fill(255);
  // strokeWeight(2);
  strokeWeight(10);
  strokeCap(ROUND);
}

draw=function() {
  background(204);
  beginShape(LINES);
  vertex(570.5, 500);
  vertex(50.5, 150);
  vertex(92, 500);
  vertex(570.5, 600);
  vertex(220, 500);
  vertex(570.5, 150);
  endShape(); 
}

require("./");
