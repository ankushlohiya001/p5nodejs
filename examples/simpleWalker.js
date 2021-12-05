const Sketch = require("../");

let pt;
let isOn = false;
let isDown = false

class Walker extends Sketch {

  setup() {
    createWindow();
    pt = createVector(width / 2, height / 2);
  }

  draw() {
    background(0);

    isOn = dist(mouseX, mouseY, pt.x, pt.y) < 50;

    isDown = isOn && mouseIsPressed;

    stroke(255);
    strokeWeight(4);

    let col = isDown ? 255 : 200;

    if (isOn) noFill();
    else fill(col);
    circle(pt.x, pt.y, 100);
  }
}

Walker.run();
