const Sketch = require("../");

const {
  Particle: {
    Triangle
  },
  ParticleSystem
} = require("./particle");

class Path {
  constructor(px, py, qx, qy, rad = 10) {
    this.start = createVector(px, py);
    this.end = createVector(qx, qy);
    this.rad = rad;
  }

  draw() {
    const {
      x: sx,
      y: sy
    } = this.start;
    const {
      x: rx,
      y: ry
    } = this.end;
    push();
    strokeWeight(this.rad * 2);
    stroke(255, 25);
    line(sx, sy, rx, ry);
    strokeWeight(2);
    stroke(255);
    line(sx, sy, rx, ry);
    pop();
  }
}

let vecs = [];
let movers;

class PathFollow extends Sketch {

  setup() {
    createWindow();
    resizable(false);
    angleMode(DEGREES);
    let pts = [
      [80, 200],
      [1200, 500]
    ];

    for (let i = 1; i < pts.length; i++) {
      vecs.push(new Path(...pts[i - 1], ...pts[i], 30));
    }

    movers = new ParticleSystem(random(width), random(height));
    movers.setWalls();
  }
  draw() {
    if (movers.list.length < 50) {
      let mover = new Triangle(0, 0, 20, 10);
      movers.pos.set(random(width), random(height));
      mover.vel.set(Vector.random2d().setMag(10));
      movers.attach(mover);
    }
    background(0);
    stroke(200);
    strokeWeight(4);
    for (let pt of vecs) {
      pt.draw();
    }

    movers.draw(mover => {
      let des = mover.vel.copy();
      des.setMag(20);
      let futLoc = Vector.add(mover.pos, des);

      let vecA = Vector.sub(futLoc, vecs[0].start);

      let patVec = Vector.sub(vecs[0].end, vecs[0].start);

      let ang = Vector.angleBetween(patVec, vecA);
      if (ang * 0 != 0) ang = 0.00001;

      patVec.setMag(vecA.mag() * cos(ang));

      patVec.add(vecs[0].start);
      let dis = Vector.dist(futLoc, patVec);

      if (dis > vecs[0].rad) {
        let dir = Vector.sub(patVec, mover.pos);
        dir.setMag(10);
        let steer = Vector.sub(dir, mover.vel);
        steer.limit(1);

        // print(mover.pos)
        mover.applyForce(steer);
      }
    });
  }

  mousePressed() {
    movers.pos.set(mouseX, mouseY);
    // mover.vel.set(Vector.random2d());
  }
}

PathFollow.run();
