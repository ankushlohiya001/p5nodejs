const Mode = require("./../constants");
const shapes = require("./shapes");
const math = require("./../math").mathFuns;

const stateChanger = require("./../state").stateChanger;

class Shaper {
  constructor() {
    this.state = {};
    this._vertices = [];
    shapes.setShaper(this);
  }

  static angleModer(ang, mod) {
    return mod === Mode.DEGREES ? math.radians(ang) : ang;
  }

  static arcModer(cx, cy, mod) {
    let fun = null;
    switch (mod) {
      case Mode.CHORD:
        fun = function(ctx) {
          ctx.closePath();
        };
        break;

      case Mode.PIE:
        fun = function(ctx) {
          ctx.lineTo(cx, cy);
          ctx.closePath();
        };
        break;

      case Mode.OPEN:
      default:
        fun = null;
    }
    return fun;
  }

  static ellipseModer(px, py, wid, hei, mod) {
    let parArr = [];
    switch (mod) {
      case Mode.CORNER:
        parArr = [px + wid, py + hei, wid, hei];
        break;
      case Mode.RADIUS:
        parArr = [px, py, wid * 2, hei * 2];
        break;
      case Mode.CORNERS:
        let x, y, w, h;
        if (wid - px < 0) {
          w = px - wid;
          x = wid + w / 2;
        } else {
          w = wid - px;
          x = px + w / 2;
        }
        if (hei - py < 0) {
          h = py - hei;
          y = hei + h / 2;
        } else {
          h = hei - py;
          y = py + h / 2;
        }
        parArr = [x, y, w, h];
        break;
      case Mode.CENTER:
      default:
        parArr = [px, py, wid, hei];
    }
    return parArr;
  }

  static rectModer(px, py, wid, hei, mod) {
    let parArr = [];
    switch (mod) {
      case Mode.CENTER:
        parArr = [px - (wid / 2), py - (hei / 2), wid, hei];
        break;
      case Mode.RADIUS:
        parArr = [px - wid, py - hei, wid * 2, hei * 2];
        break;
      case Mode.CORNERS:
        let x, y, w, h;
        if (wid - px < 0) {
          w = px - wid;
          x = wid;
        } else {
          w = wid - px;
          x = px;
        }
        if (hei - py < 0) {
          h = py - hei;
          y = hei;
        } else {
          h = hei - py;
          y = py;
        }
        parArr = [x, y, w, h];
        break;
      case Mode.CORNER:
      default:
        parArr = [px, py, wid, hei];
    }
    return parArr;
  }

  setState(state) {
    this.state = state;
  }

  get context() {
    return this.state.renderer.context;
  }

  drawShape(funs, tmpStateFn) {
    const ctx = this.context;
    const state = this.state;
    ctx.beginPath();
    if (!!tmpStateFn) {
      stateChanger.push(state);
      tmpStateFn(state, ctx);
    }
    this.state.applyState(state);
    funs(ctx);
    this.state.applyEffect(state);
    if (!!tmpStateFn) stateChanger.pop(state);
  }

};

module.exports = {
  shapes: shapes.public,
  Shaper
};