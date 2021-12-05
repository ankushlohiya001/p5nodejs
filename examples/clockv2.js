const Sketch = require("../");

class Clock extends Sketch {
  radii = 0;
  dif = 1;

  plate(px, py, rad, ang, col) {
    push();
    noStroke();
    fill(col);
    circle(px, py, rad);
    fill(col);
    for (let i = 0; i < 360; i += 30) {
      circle(px + cos(i + ang - 90) * rad / 2, py + sin(i + ang - 90) * rad / 2, rad / 2 - 50 - this.radii);
    }
    fill(200, 20, 0);
    circle(px + cos(ang - 90) * rad / 2, py + sin(ang - 90) * rad / 2, 50 - this.radii * 0.5);
    pop();
  }

  setup() {
    // createCanvas(img.width, img.height);
    createWindow();
    // noLoop();
    // rectMode(CORNERS);
    // ellipseMode(CENTER);
    angleMode(DEGREES);
    // fullscreen(true);
    // resizable(true);
    // frameRate(60);
    // fullscreen(true);
  }

  draw() {
    background(0, 5);
    // this.radii %= 50;
    const time = new Date;

    let ang = (time.getSeconds() + time.getMilliseconds() / 1000) * 6;
    // fill(red);
    this.plate(width / 2, height / 2, 400, ang, color(255, 250, 200));

    ang = time.getMinutes() * 6 + ang / 60;

    strokeWeight(30);
    stroke(200, 100, 12);
    line(width / 2, height / 2, width / 2 + cos(ang - 90) * 150, height / 2 + sin(ang - 90) * 150);

    ang = time.getHours() * 30 + ang / 12;

    stroke(200, 200, 128);
    line(width / 2, height / 2, width / 2 + cos(ang - 90) * 100, height / 2 + sin(ang - 90) * 100);
    if (this.radii < 0 || this.radii > 50) this.dif *= -1;
    this.radii += this.dif;
  }
  
  windowResized(){
    resizeCanvas();
  }
}

Clock.run();
