const Sketch = require("../");

let pos = [0, 0];
let ds = [10, 10];
let grav = 6;
let k = -0.6;
let pts = [
  [0, 0]
];
let score = 0;
let net = [0, 0];
let timeRemains = 10;
let lifes = 3;
let rub = [];

let bird, pig, bg, sling, hrt;
class Ball extends Sketch {

  preload(){
    bird = loadImage("./red_new.png");
    pig = loadImage("./green_new.png");
    bg = loadImage("./bg.jpg");
    sling = loadImage("./sling.png");
    hrt = loadImage("./pow.png");
  }

  setup() {
    resizable(false);
    // noLoop();
    createWindow();
    angleMode(DEGREES);
    frameRate(90);
    strokeWeight(2);
    // noCursor();
    //grab();
    //imageMode(CENTER);
    noStroke();
    // print(deltaTime)
    net = [random(100, width), random(100, height)];
  }

  draw() {
    //background(0);
    image(bg, 0, 0);
    ds[1] += grav;
    pos[0] += ds[0] * deltaTime * 0.01;
    pos[1] += ds[1] * deltaTime * 0.01;
    if (pos[0] <= 50) {
      pos[0] = 50;
      ds[0] *= k;
    }
    if (pos[0] >= width - 50) {
      pos[0] = width - 50;
      ds[0] *= k;
    }
    if (pos[1] <= 50) {
      pos[1] = 50;
      ds[1] *= k;
    }
    if (pos[1] >= height - 50) {
      pos[1] = height - 50;
      ds[1] *= k;
    }

    push();
    noFill();
    stroke(200, 200, 0);
    let rad = this.rad;
    if (score % 5 == 0) {
      stroke(random(200), random(200), random(200));
      rad = random(100, 120);
    }
    //circle(...net, rad);
    image(pig, 0, 0, 100, 100, net[0] - rad / 2, net[1] - rad/2, rad, rad);
    pop();
    //circle(...pos, 100);
    image(bird, pos[0] - 50, pos[1] - 50);
    
    if(rub.length) image(sling, rub[0] - sling.width/2, rub[1] - sling.height/2);
    if (dist(...net, ...pos) < 100) {
      if (score % 5 == 0 && lifes == 3) score += 10;
      if (score % 5 == 0 && lifes < 3) lifes++;
      score++;
      net = [random(100, width), random(100, height)];
      this.rad = random(40, 100);
      timeRemains = 10;
    }
    timeRemains -= deltaTime * 0.001;
    if (timeRemains < 0) {
      lifes--;
      timeRemains = 10;
    }

    if (rub.length > 1) {
      if(dist(...rub, mouseX, mouseY) > 500) this.release();
      push();
      strokeWeight(8);
      stroke(20, 10, 10);
      line(rub[0] - 15, rub[1] - 90, mouseX, mouseY);
      line(rub[0] + 20, rub[1] - 90, mouseX, mouseY);
      pop();
    }

    push();
    textSize(30);
    text(score, 100, 100);
    text(floor(timeRemains), 100, 200);
    pop();
    push();
    noFill();
    stroke("red");
    for (let i = 0; i < lifes; i++) {
      //circle(100 + i * 80, 250, 50);
      image(hrt, 100 + i * 80 - hrt.width/2, 250 - hrt.height/2);
    }
    pop();
    if (lifes <= 0) {
      after(3, exit);
      noLoop();
      background(0);
      textSize(70);
      textAlign(CENTER);
      text("game over", width / 2, height / 2);
      text(`Score: ${score}`, width / 2, height / 2 + 100);
    }
  }

  mousePressed() {
    rub = [mouseX, mouseY];
  }

  mouseReleased(){
    this.release();
  }

  mouseLeaved(){
    this.release();
  }

  release() {
    ds[1] += -(mouseY - rub[1] || 0) * 0.5;
    ds[0] += -(mouseX - rub[0] || 0) * 0.5;
    rub = [];
  }

}

Ball.run();
