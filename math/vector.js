const math = require("./math_funs").public;

function validator(x, y) {

  switch (typeof x) {
    case "object":
      {
        if (x.constructor === Vector) return [x.x, x.y];
        else if (x.constructor === Array && typeof x[0] == "number") {
          if (typeof x[1] != "number") x[1] = 0;
          return [x[0], x[1]];
        }
      }
      break;

    case "number":
      {
        if (typeof y != "number") y = 0;
        return [x, y];
      }
      break;
  }

  return [null, null];
}

function isValid(vecA) {
  if (typeof vecA === "object") {
    return vecA.constructor === Vector;
  }
  return false;
}


class Vector {

  static createVector(x = 0, y = 0) {
    [x, y] = validator(x, y);
    return new Vector(x, y);
  }

  static fromAngle(ang) {
    return new Vector(math.cos(ang), math.sin(ang));
  }

  static random2d() {
    const ang = math.random(0, math.TWO_PI);
    return new Vector(Math.cos(ang), Math.sin(ang));
  }

  static angleBetween(vecA, vecB) {
    let dot = Vector.dot(vecA, vecB);
    let magMult = vecA.mag() * vecB.mag();
    return math.acos(dot / magMult);
  }

  static add(vecA, vecB) {
    let vecAcp = vecA.copy();
    if (isValid(vecA) && isValid(vecB)) {
      return vecAcp.add(vecB);
    }
    return vecAcp;
  }

  static sub(vecA, vecB) {
    let vecAcp = vecA.copy();
    if (isValid(vecA) && isValid(vecB)) {
      return vecAcp.sub(vecB);
    }
    return vecAcp;
  }

  static mult(vecA, x, y) {
    let vecAcp = vecA.copy();
    if (isValid(vecA)) {
      return vecAcp.mult(x, y);
    }
    return vecAcp;
  }

  static div(vecA, x, y) {
    let vecAcp = vecA.copy();
    if (isValid(vecA)) {
      return vecAcp.div(x, y);
    }
    return vecAcp;
  }

  static dot(vecA, vecB) {
    let vecAcp = vecA.copy();
    if (isValid(vecA) && isValid(vecB)) {
      return vecAcp.dot(vecB);
    }
    return 0;
  }

  static dist(vecA, vecB){
    return math.dist(vecA.x, vecA.y, vecB.x, vecB.y);
  }

  constructor(x, y) {
    if (typeof x != "number") x = 0;
    if (typeof y != "number") y = 0;
    this.x = x;
    this.y = y;
  }

  copy() {
    return new Vector(this.x, this.y);
  }

  set(x, y) {
    [x, y] = validator(x, y);
    if (x != null) {
      this.x = x;
      this.y = y;
    }
    return this;
  }

  add(x, y) {
    [x, y] = validator(x, y);
    if (x != null) {
      this.x += x;
      this.y += y;
    }
    return this;
  }

  sub(x, y) {
    [x, y] = validator(x, y);
    if (x != null) {
      this.x -= x;
      this.y -= y;
    }
    return this;
  }

  mult(x, y) {
    y = y || x;
    [x, y] = validator(x, y);
    if (x != null) {
      this.x *= x;
      this.y *= y;
    }
    return this;
  }

  div(x, y) {
    y = y || x;
    [x, y] = validator(x, y);
    if (x != null) {
      this.x /= x;
      this.y /= y;
    }
    return this;
  }

  magSq() {
    return (this.x ** 2 + this.y ** 2);
  }

  mag() {
    return math.sqrt(this.magSq());
  }

  invert() {
    return this.mult(-1);
  }

  zero() {
    return this.mult(0);
  }

  dist(x, y) {
    [x, y] = validator(x, y);
    if (x != null) {
      return math.dist(this.x, this.y, x, y);
    }
    return 0;
  }

  dot(x, y) {
    [x, y] = validator(x, y);
    if (x != null) {
      return this.x * x + this.y * y;
    }
    return 0;
  }

  heading() {
    return math.atan2(this.y, this.x);
  }

  normalize() {
    let mag = this.mag();
    if (mag !== 0) {
      this.set(this.x / mag, this.y / mag);
    }
    return this;
  }

  setMag(mag) {
    return this.normalize().mult(mag);
  }

  limit(mag) {
    mag = math.min(mag, this.mag());
    return this.setMag(mag);
  }

  rotate(ang) {
    let mag = this.mag();
    ang += this.heading();
    return this.set(mag * math.cos(ang), mag * math.sin(ang));
  }

  toString() {
    return `${this.x}i + ${this.y}j`;
  }

  toArray() {
    return [this.x, this.y];
  }

  equals(x, y) {
    [x, y] = validator(x, y);
    if (x != null) {
      return this.x == x && this.y == y;
    }
    return false;
  }

}

module.exports = Vector;