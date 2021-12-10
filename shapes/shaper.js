const Maths = require("./../math");
const math = Maths.globals;

class Shaper {
  constructor() {
    this._vertices = [];
		this.renderer = {};
  }

  setRenderer(renderer){
    this.renderer = renderer;
  }

  get state(){
    return this.renderer.state;
  }
	
  arcModer(cx, cy) {
    let fun = null;
    switch (this.state._arcMode) {
      case Shaper.modes.CHORD:
        fun = function(ctx) {
          ctx.closePath();
        };
        break;

      case Shaper.modes.PIE:
        fun = function(ctx) {
          ctx.lineTo(cx, cy);
          ctx.closePath();
        };
        break;

      case Shaper.modes.OPEN:
      default:
        fun = null;
    }
    return fun;
  }

  ellipseModer(px, py, wid, hei) {
    let parArr = [];
    switch (this.state._ellipseMode) {
      case Shaper.modes.CORNER:
        parArr = [px + wid, py + hei, wid, hei];
        break;
      case Shaper.modes.RADIUS:
        parArr = [px, py, wid * 2, hei * 2];
        break;
      case Shaper.modes.CORNERS:
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
      case Shaper.modes.CENTER:
      default:
        parArr = [px, py, wid, hei];
    }
    return parArr;
  }

  rectModer(px, py, wid, hei) {
    let parArr = [];
    switch (this.state._rectMode) {
      case Shaper.modes.CENTER:
        parArr = [px - (wid / 2), py - (hei / 2), wid, hei];
        break;
      case Shaper.modes.RADIUS:
        parArr = [px - wid, py - hei, wid * 2, hei * 2];
        break;
      case Shaper.modes.CORNERS:
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
      case Shaper.modes.CORNER:
      default:
        parArr = [px, py, wid, hei];
    }
    return parArr;
  }

  drawShape(funs, tmpStateFn) {
    const ctx = drawingContext;
    const state = this.state;
    ctx.beginPath();
    if (!!tmpStateFn) {
      State.globals.push(state);
      tmpStateFn(state, ctx);
    }
    this.state.applyState(ctx);
    funs(ctx);
    this.state.applyEffect(ctx);
    if (!!tmpStateFn) State.globals.pop(state);
  }

};

module.exports = Shaper; 
