const Sketch = require("../");

class Logo extends Sketch {
  setup() {
    createCanvas(520, 150);
    createWindow();
    noStroke();
    fill("#ed225d");
    rect(0, 0, 145, 150);
    fill("#43853d");
    rect(145, 0, 255, 150);
    fill("#f7df1e");
    rect(390, 0, 130, 150);
    textSize(100);
    stroke(255);
    fill(255);
    strokeWeight(4);
    text("p5node.js", 15, 100);
  }
}

Logo.run();
