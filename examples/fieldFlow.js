const Sketch = require("../");
const {
  Particle,
  ParticleSystem
} = require("./particle");

function findFieldForce(mover) {
  let pos = mover.pos;
  let x = constrain(floor(pos.x / boxSize), 0, xs);
  let y = constrain(floor(pos.y / boxSize), 0, ys);
  return field[y][x];
}

let movers;
let field = [];
let boxSize = 50;
let xs, ys;
let fish;


class FieldFlow extends Sketch {

  setup() {
    createWindow();
    Particle.prototype.draw = function(pos) {
      push();
      translate(pos.x, pos.y);
      // circle(0, 0, 50);
      // stroke("red");
      // strokeWeight(4);
      rotate(this.vel.heading());
      // line(0,0, 40,0);
      image(fish, -fish.width / 2, -fish.height / 2);
      pop();
    }

    movers = new ParticleSystem(random(width), random(height));

    xs = width / boxSize;
    ys = height / boxSize;

    for (let y = 0; y < ys; y++) {
      field.push([]);
      for (let x = 0; x < xs; x++) {
        let ang = map(noise(x * 0.1, y * 0.1), 0, 1, 0, TWO_PI);
        field[y][x] = createVector(cos(ang), sin(ang));
      }
    }
  }

  preload() {
    fish = loadImage("./fish.png");
  }

  draw() {
    if (movers.list.length < 10) {
      let fish = new Particle();
      movers.attach(fish);
      fish.acc = Vector.random2d().setMag(20);
    }
    background(0);
    stroke(255);
    strokeWeight(2);
    for (let y = 0; y < ys; y++) {
      for (let x = 0; x < xs; x++) {
        push();
        let dir = field[y][x];
        let px = x * boxSize,
          py = y * boxSize;
        translate(px + boxSize / 2, py + boxSize / 2);
        rotate(dir.heading());
        line(-boxSize / 3, 0, boxSize / 3, 0);
        circle(boxSize / 3, 0, 6);
        pop();
      }
    }

    for (let mover of movers.list) {
      let des = findFieldForce(mover);
      // des.setMag(10);
      let steer = Vector.sub(des, mover.vel);
      // steer.limit(0.1);
      mover.applyForce(steer);
    }

    movers.draw();

    fill("green");
    circle(movers.pos.x, movers.pos.y, 40);
  }

  mousePressed() {
    movers.pos.set(mouseX, mouseY);
  }
}

FieldFlow.run();
