const Sketch = require("../");

let mov;

class Mover extends Sketch {

  setup() {
    createWindow();
    // noLoop();
    // frameRate(10);
    // rectMode(CENTER);
    // createCanvas(400, 400);
    angleMode(DEGREES);
    // noFill();
    // colorMode(HSL);
    background(0);

    class Mover {
      constructor(x, y) {
        this.pos = createVector(x, y);
        this.pre = this.pos.copy();
        this.vel = createVector();
        this.acc = createVector();
        this.mass = 25;
        this.col = 255;
      }

      update() {
        this.vel = Vector.random2d();
        let limit = 1;
        let col;
        if (random(100) < 1) {
          limit = random(40, 60);
          col = "brown";
        } else {
          limit = random(1, 5);
          col = "green";
        }
        this.col = col;
        this.vel.add(this.acc);
        this.vel.setMag(limit);
        this.pos.add(this.vel);

        const {
          x,
          y
        } = this.pos;
        if (x + this.mass >= width) {
          this.pos.x = width - this.mass;
          this.vel.mult(-0.5, 1);
        }
        if (x - this.mass <= 0) {
          this.pos.x = this.mass;
          this.vel.mult(-0.5, 1);
        }

        if (y + this.mass >= height) {
          this.pos.y = height - this.mass;
          this.vel.mult(1, -0.5);
        }
        if (y - this.mass <= 0) {
          this.pos.y = this.mass;
          this.vel.mult(1, -0.5);
        }
      }

      draw() {
        push();
        // strokeWeight(3);
        // fill(255, 20);
        stroke(this.col);
        line(this.pos.x, this.pos.y, this.pre.x, this.pre.y);
        this.pre.set(this.pos);
        pop();
      }

      applyForce(forc) {
        // F = ma => a = F/m
        this.acc.add(forc.div(this.mass));
      }

    }

    mov = new Mover(width / 2, height / 2);
  }

  draw() {
    // background(0, 10);
    mov.update();
    mov.draw();
  }
}

Mover.run();
