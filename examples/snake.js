setup = function() {
  for (let i of range(3)) {
    pos[i] = createVector();
  }
  frameRate(10);
  food = createVector(int(random(width / 20)), int(random(height / 20)));
}

let pos = [];
let food;

draw = function() {
  background(0);

  // if (keyIsPressed) {
  const di = faceDir();
  let [cx, cy] = [0, 0];
  switch (keyCode) {
    case UP_ARROW:
      if (di != 2) cy--;
      break;
    case DOWN_ARROW:
      if (di != 0) cy++;
      break;
    case LEFT_ARROW:
      if (di != 1) cx--;
      break;
    case RIGHT_ARROW:
      if (di != 3) cx++;
      break;
  }

  if (pos[0].x + cx == food.x && pos[0].y + cy == food.y) {
    food = createVector(int(random(width / 20)), int(random(height / 20)));
    pos.push(createVector());
  }
  if (pos.some((p, i) => {
      if (i == 0) return false;
      return p.x == pos[0].x && p.y == pos[0].y;
    })) {
    while (pos.length > 3) {
      pos.pop();
    }
  }

  if (!(cx == 0 && cy == 0)) {
    const msVec = pos[0].copy();
    msVec.x += cx;
    msVec.y += cy;

    if (msVec.x * 20 > width) msVec.x = 0;
    if (msVec.x < 0) msVec.x = int(width / 20);

    if (msVec.y * 20 > height) msVec.y = 0;
    if (msVec.y < 0) msVec.y = int(height / 20);

    pos.unshift(msVec);
    pos.pop();
  }
  // }
  noStroke();
  for (let [p, i] of range(pos)) {
    if (i == 0) {
      fill(255, 0, 0);
      rect(p.x * 20, p.y * 20, 20, 20, 5);
    } else {
      fill(255);
      rect(p.x * 20, p.y * 20, 18, 18, 5);
    }
  }
  fill(0, 200, 0);
  rect(food.x * 20, food.y * 20, 20, 20);
}

function faceDir() {
  let dx = pos[0].x - pos[1].x;
  let dy = pos[0].y - pos[1].y;
  if (abs(dx) > 1 || abs(dy) > 1) return 4;
  if (dx < 0 && dy == 0) return 3;
  if (dx > 0 && dy == 0) return 1;
  if (dx == 0 && dy < 0) return 0;
  if (dx == 0 && dy > 0) return 2;
}

// keyPressed = 

require("../");