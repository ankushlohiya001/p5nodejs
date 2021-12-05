const Sketch = require("../");

let ang = 0;
let ch = 30;
let dch = 0.2;

class Spinner extends Sketch {

  setup() {
    // createCanvas(img.width, img.height);
    createWindow();
    // noLoop();
    // rectMode(CORNERS);
    ellipseMode(CENTER);
    angleMode(DEGREES);
    // fullscreen(true);
    // resizable(true);
    frameRate(60);
  }

  draw() {
    ang = ang > 360 ? 0 : ang + deltaTime * 0.1;
    if (ch < 30 || ch > 300) dch *= -1;
    ch += deltaTime * dch;
    // print(ch);
    background(0);
    noFill();
    strokeWeight(18);
    stroke(255);
    arc(width / 2, height / 2, 200, 200, ang, ang - ch);
    strokeWeight(10);
    stroke(0, 200, 0);
    arc(width / 2, height / 2, 200, 200, ang - ch, ang);
  }
}

Spinner.run();
