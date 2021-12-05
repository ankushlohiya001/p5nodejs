const Sketch = require("../");

let sprites;

/*
	dino: 1675, 1763, 1851, 1939; 90 x 100
	cac: 653; 50 x 100;
*/

const dinoPos = [1675, 1851, 1939];
let st = 0;
let val = 0;
let willJump = false;
let pos, vel, acc;
let gr = 1;
let cacts = [];
let running = true;
let score = 0;
class Dino extends Sketch {
  setup() {
    createWindow();
    sprites = loadImage("./sprites.png");
    // noLoop();
    //rectMode(CORNERS);
    // frameRate(30);
    pos = createVector();
    vel = createVector();
    acc = createVector();
  }

  draw() {
    background(255);
    val %= width - 200;
    image(sprites, val, 100, 1280, 50, 0, height / 2, 1280, 50);

    val += deltaTime * 0.4;

    const lastCac = cacts[cacts.length - 1];

    if (random() < 0.01 && cacts.length < 5 && (width - lastCac > 200 || cacts.length == 0)) cacts.unshift(width);


    st %= dinoPos.length;
    let dinoLoc = dinoPos[floor(st)];
    if (willJump) {
      dinoLoc = dinoPos[0];
    }
    acc.add(gr * deltaTime * 0.1);
    vel.add(acc);
    acc.zero();
    pos.add(vel);

    // print(pos.x);
    for (let i = 0; i < cacts.length; i++) {

      if (abs(cacts[i]) < 50 && pos.x > -10) {
        // noLoop();
        noLoop();
        running = false;
        image(sprites, 0, 0, 80, 100, width / 2 - 40, height / 2 - 50, 80, 100);
      }

      image(sprites, 653, 0, 50, 100, cacts[i], height / 2 - 70, 50, 100);
      cacts[i] -= deltaTime * 0.4;
      if (cacts[i] + 40 <= 0) cacts.pop();
    }

    if (pos.x >= 0) {
      pos.set(0);
      vel.set(0);
      willJump = false;
    }

    image(sprites, dinoLoc, 0, 90, 100, 0, height / 2 - 65 + pos.x, 90, 100);
    st += deltaTime * 0.015;

    noStroke();
    fill(0);
    textSize(40);
    text(floor(score), width - 200, 100);
    score += deltaTime * 0.01;
  }

  keyPressed() {
    if (!keyIsDown(SPACEBAR)) return;
    else {
      if (!running) {
        loop();
        cacts = [];
        running = true;
        score = 0;
        redraw();
      }
    }
    if (!willJump) {
      willJump = true;
      acc.set(-25);
    }
  }
}

Dino.run();
