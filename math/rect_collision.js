function rectDim(rect) {
  return {
    min: {
      x: Math.min(rect[0][0], rect[1][0], rect[2][0], rect[3][0]),
      y: Math.min(rect[0][1], rect[1][1], rect[2][1], rect[3][1])
    },
    max: {
      x: Math.max(rect[0][0], rect[1][0], rect[2][0], rect[3][0]),
      y: Math.max(rect[0][1], rect[1][1], rect[2][1], rect[3][1])
    }
  };
}

function isCollision(rectA, rectB) {
  if (rectB.length === 1) {
    let rect = [];
    for (let i = 0; i < 4; i++) {
      rect.push(rectB[0]);
    }
    rectB = rect;
  }
  const dimA = rectDim(rectA);
  const dimB = rectDim(rectB);
  if ((dimA.max.x >= dimB.min.x && dimA.min.x <= dimB.max.x) &&
    (dimA.max.y >= dimB.min.y && dimA.min.y <= dimB.max.y)) return true;

  return false;
}

function createRect(x, y, wid, hei) {
  return [
    [x, y],
    [x + wid, y],
    [x + wid, y + hei],
    [x, y + hei]
  ];
}
module.exports = {
  isCollision,
  createRect
}