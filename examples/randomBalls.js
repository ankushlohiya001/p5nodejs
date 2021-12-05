const Sketch = require("../");

let pxs = [];
let pos = [];

let vels = [];
let accs = [];
let cls = [];
class Balls extends Sketch {
  name = "kush";
  setup() {
    createWindow();
    // rectMode(CENTER);
    // noLoop();
    colorMode(HSL);
    push();
    noStroke();
    fill(255);
    rect(0, 0, 180, 50);
    fill(0);
    textSize(50);
    textFont("inter");
    text(this.name, 0, 50);
    pop();
    loadPixels(0, 0, 180, 50);
    for (let i = 0; i < 180; i += 4) {
      for (let j = 0; j < 50; j += 4) {
        if (getPixel(i, j)[0] == 0) {
          pxs.push(createVector(i * 6, j * 6));
          pos.push(createVector(random(width), random(height)));
          vels.push(createVector());
          accs.push(createVector());
          cls.push(color(random(360), 100, 50));
        }
      }
    }
    // noLoop();
  }


  draw() {
    background(0);
    noStroke();
    fill(255);
    const grav = createVector(random(-0.08, 0.08), 0.5);
    for (let i = 0; i < pos.length; i++) {


      if (mouseIsPressed) {
        const di = Vector.sub(pxs[i], pos[i]);
        vels[i].add(di);
        vels[i].limit(random(10));
      } else
        accs[i].add(grav);
      vels[i].add(accs[i]);
      accs[i].zero();
      pos[i].add(vels[i]);

      if (pos[i].y + 10 >= height) {
        pos[i].y = height - 10;
        vels[i].y *= -random(0.9, 1);
      }

      if (pos[i].y - 10 <= 0) {
        pos[i].y = 10;
        vels[i].y *= -random(0.9, 1);
      }

      if (pos[i].x + 10 >= width) {
        pos[i].x = width - 10;
        vels[i].x *= -random(0.9, 1);
      }

      if (pos[i].x - 10 <= 0) {
        pos[i].x = 10;
        vels[i].x *= -random(0.9, 1);
      }

      fill(cls[i]);
      push();
      // drawingContext.shadowOffsetX = 0;
      // drawingContext.shadowOffsetY = 0;
      // drawingContext.shadowBlur = 15;
      // drawingContext.shadowColor = cls[i];
      // circle(pos[i].x, pos[i].y, 30);
      circle(pos[i].x, pos[i].y, 20);
      pop();
    }
  }
}

Balls.run();
