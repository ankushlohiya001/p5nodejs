const Mode = require("./../constants");

let state = {};

function angleModer(ang, retun = false) {
  if (state._angleMode === Mode.DEGREES) {
    return retun ? mathFuns.degrees(ang) : mathFuns.radians(ang);
  }
  return ang;
}

const mathFuns = {
  get HALF_PI() {
    return Math.PI / 2;
  },

  get PI() {
    return Math.PI;
  },

  get QUARTER_PI() {
    return Math.PI / 4;
  },

  get TWO_PI() {
    return 2 * Math.PI;
  },

  get TAU() {
    return 2 * Math.PI;
  },

  abs(value) {
    return Math.abs(value);
  },

  ceil(value) {
    return Math.ceil(value);
  },

  constrain(n, low, high) {
    return n < low ? low : n > high ? high : n;
  },

  dist(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  },

  exp(value) {
    return Math.exp(value);
  },

  floor(value) {
    return Math.floor(value);
  },

  lerp(start, stop, amt = 1) {
    const gap = stop - start;
    return start + gap * amt;
  },

  log(value) {
    return Math.log(value);
  },

  mag(x, y) {
    if (typeof x == "object") {
      y = x.y;
      x = x.x;
    }
    return mathFuns.dist(0, 0, x, y);
  },

  map(value, start1, stop1, start2, stop2) {
    if (stop1 - start1 === 0) return value;
    let per = (value - start1) / (stop1 - start1);
    return mathFuns.lerp(start2, stop2, per);
  },

  maxIndex(...pars) {
    if (pars.length < 1) return;
    if (typeof pars[0] == "object" && pars[0].constructor == Array) {
      pars = pars[0];
    }
    let maxIndex = 0;
    for (let i = 1; i < pars.length; i++) {
      if (pars[i] > pars[maxIndex]) {
        maxIndex = i;
      }
    }
    return maxIndex;
  },

  max(...pars) {
    return pars[maxIndex(...pars)];
  },

  minIndex(...pars) {
    if (pars.length < 1) return;
    if (typeof pars[0] == "object" && pars[0].constructor == Array) {
      pars = pars[0];
    }
    let minIndex = 0;
    for (let i = 1; i < pars.length; i++) {
      if (pars[i] < pars[minIndex]) {
        minIndex = i;
      }
    }
    return minIndex;
  },

  min(...pars) {
    return pars[mathFuns.minIndex(...pars)];
  },

  norm(value, start, end) {
    return state.map(value, start, end, 0, 1);
  },

  pow(value, power) {
    return Math.pow(value, power);
  },

  round(value) {
    return Math.round(value);
  },

  sq(value) {
    return Math.pow(value, 2);
  },

  sqrt(value) {
    return Math.sqrt(value);
  },

  fract(value) {
    return value - Math.floor(value);
  },

  random(min = 1, max = null) {
    if (min.constructor === Array) {
      return min[Math.floor(Math.random() * min.length)];
    }
    if (max === null) {
      max = min;
      min = 0;
    }
    return min + Math.random() * (max - min);
  },

  randomInt(min, max) {
    return int(mathFuns.random(min, max));
  },

  randomBool() {
    return mathFuns.random() < 0.5;
  },

  degrees(angle) {
    return angle * (180 / Math.PI);
  },

  radians(angle) {
    return angle * (Math.PI / 180);
  },

  acos(value) {
    let angle = Math.acos(value);
    return angleModer(angle, true);
  },

  asin(value) {
    let angle = Math.asin(value);
    return angleModer(angle, true);
  },

  atan(value) {
    let angle = Math.atan(value);
    return angleModer(angle, true);
  },

  atan2(y, x) {
    let angle = Math.atan2(y, x);
    return angleModer(angle, true);
  },

  cos(angle) {
    angle = angleModer(angle);
    return Math.cos(angle);
  },

  sin(angle) {
    angle = angleModer(angle);
    return Math.sin(angle);
  },

  tan(angle) {
    angle = angleModer(angle);
    return Math.tan(angle);
  },

  sort(array) {
    let arr = [...array];
    arr.sort((a, b) => a - b);
    return arr;
  },

  * range(from, to = null, diff = null) {
    if (typeof from == "object" && from != null) {
      if (from.constructor == Array) {
        for (let i = 0; i < from.length; i++) yield [from[i], i];
      } else {
        for (let key in from) yield [from[key], key];
      }
      return;
    }
    if (diff == null) diff = 1;
    if (to == null) {
      to = from;
      from = 0;
    }
    if (diff < 0)
      for (let i = from; i > to; i += diff) yield i;
    else
      for (let i = from; i < to; i += diff) yield i;
  },

  /*type conversions*/
  float(value) {
    if (typeof value == "number") return value;
    return parseFloat(value);
  },

  int(value) {
    if (typeof value == "number") return Math.floor(value);
    return parseInt(value);
  },

  str(value) {
    if (value.constructor === Array) {
      return value.map(x => String(x));
    }
    return String(value);
  },

  boolean(value) {
    return !!value;
  },

  // byte(value){
  //  if(value.constructor===Array){
  //   return value.map(x=>parseInt(x).toString(8));
  //  }
  //  return parseInt(value).toString(8);
  // }

  char(value) {
    if (value.constructor === Array) {
      return value.map(x => String.fromCharCode(parseInt(x)));
    }
    return String.fromCharCode(parseInt(value));
  },

  unchar(value) {
    if (value.constructor === Array) {
      return value.map(x => x.charCodeAt(0));
    }
    return value.charCodeAt(0);
  },

  hex(value, digits = 8) {
    if (value.constructor === Array) {
      return value.map(x => x.toString(16).padStart(digits, 0));
    }
    return value.toString(16).padStart(digits, 0);
  },

  unhex(value, digits = 8) {
    if (value.constructor === Array) {
      return value.map(x => parseInt(x, 16));
    }
    return parseInt(value, 16);
  }
}


module.exports = {
  setState(stat) {
    state = stat;
  },
  public: mathFuns
};