const Color = require("../color");
const Maths = require("../math");
const Shaper = require("../shapes");
const State = require("./state");
const modes = State.modes = require("./modes");

let state;

State.useRenderer = function(renderer){
  state = renderer.state;
}

State.defaults = {
  _willStroke: true,
  _willFill: true,
  _willErase: false,
  _angleMode: Maths.modes.RADIANS,
  _colorMode: Color.modes.RGB,
  _ellipseMode: Shaper.modes.CENTER,
  _imageMode: Shaper.modes.CORNER,
  _rectMode: Shaper.modes.CORNER,
  _arcMode: Shaper.modes.OPEN,
  _shapeMode: null,
  _fps: 60,
  _willLoop: true,
  _willRender: true,
};


const globals = State.globals = {
  //////////////////////////////////////////
  ////////// getters
  /////////////////////////////////////////

  get displayDensity() {
    // return state.renderer.window.displayPixelRatio;
  },

  get deltaTime() {
    return state._deltaTime;
  },

  get frameCount() {
    return state._frameCount;
  },

  get drawingContext() {
    return state.renderer.context;
  },

  get width() {
    return state.renderer.canvas.width;
  },

  get height() {
    return state.renderer.canvas.height;
  },

  get windowWidth() {
    const window = state.renderer.window;
    if (window) return window.width;
  },

  get windowHeight() {
    const window = state.renderer.window;
    if (window) return window.height;
  },

  get pixels() {
    return state._pixelData ? state._pixelData.data : null;
  },

  ////////////////////////////////////////////////////////////////
  ///////////drawing states like whatever to stroke, fill etc.
  ////////// and their color, size etc.
  ////////////////////////////////////

  stroke(...params) {
    const col = Color.globals.color(...params);
    if (!state._willStroke) {
      state.saveState("_willStroke");
      state._willStroke = true;
    }
    state.makeChange('strokeStyle', col.toString());
  },

  noStroke() {
    if (state._willStroke) {
      state.saveState("_willStroke");
      state._willStroke = false;
    }
  },

  strokeWeight(weight) {
    if (weight) {
      state.makeChange('lineWidth', weight);
    }
  },

  strokeCap(cap) {
    switch (cap) {
      case modes.SQUARE:
        cap = "butt";
        break;
      case modes.PROJECT:
        cap = "square";
        break;
      case modes.ROUND:
        cap = "round";
        break;
      default:
        return;
    }
    state.makeChange('lineCap', cap);
  },

  strokeJoin(join) {
    switch (join) {
      case modes.MITER:
        join = "miter";
        break;
      case modes.BEVEL:
        join = "bevel";
        break;
      case modes.ROUND:
        join = "round";
        break;
      default:
        return;
    }
    state.makeChange('lineJoin', join);
  },

  fill(...params) {
    const col = Color.globals.color(...params);
    if (!state._willFill) {
      state.saveState("_willFill");
      state._willFill = true;
    }
    state.makeChange('fillStyle', col.toString());
  },

  noFill() {
    if (state._willFill) {
      state.saveState("_willFill");
      state._willFill = false;
    }
  },

  background(...params) {
    const col = color(...params);
    const ctx = state.renderer.context;
    const wid = ctx.canvas.width;
    const hei = ctx.canvas.height;
    ctx.save();
    ctx.resetTransform();
    ctx.fillStyle = col.toString();
    ctx.fillRect(0, 0, wid, hei);
    ctx.restore();
    ctx.beginPath();
  },

  clear() {
    const ctx = state.renderer.context;
    const wid = ctx.canvas.width;
    const hei = ctx.canvas.height;
    ctx.save();
    ctx.resetTransform();
    ctx.clearRect(0, 0, wid, hei);
    ctx.restore();
    ctx.beginPath();
  },
  // erase(strengthFill=100, strengthStroke=100){
  //   state._willErase=true;
  //   state.push();
  //   state.stroke(255,strengthStroke);
  //   state.fill(255,strengthFill);
  // }

  // noErase(){
  //   state.pop();
  //   state._willErase=false;
  // }

  ///////////////////////////////////////
  /////////// text font related states
  //////////////////////////////////////

  textFont(fontName, size) {
    state.text.font = fontName;
    if (size) state.text.size = size;
    state.makeChange('font', `${state.text.size}px ${state.text.font}`);
  },

  textSize(size) {
    state.text.size = size;
    state.makeChange('font', `${state.text.size}px ${state.text.font}`);
  },

  textAlign(hAlign, vAlign) {
    switch (hAlign) {
      case modes.LEFT:
        hAlign = "left";
        break;
      case Shaper.modes.CENTER:
        hAlign = "center";
        break;
      case modes.RIGHT:
        hAlign = "right";
        break;
      default:
        hAlign = "";
    }
    switch (vAlign) {
      case modes.TOP:
        vAlign = "top";
        break;
      case modes.BOTTOM:
        vAlign = "bottom";
        break;
      case Shaper.modes.CENTER:
        vAlign = "middle";
        break;
      case modes.BASELINE:
        vAlign = "alphabetic";
        break;
      default:
        vAlign = "";
    }
    state.makeChange("textAlign", hAlign);
    state.makeChange("textBaseline", vAlign);
  },

  ////////////////////////////////////
  ////////// modes of varios props
  ///////////////////////////////////

  angleMode(mode) {
    state.saveState("_angleMode");
    state._angleMode = mode;
  },

  arcMode(mode) {
    state.saveState("_arcMode");
    state._arcMode = mode;
  },

  blendMode(mode) {
    let operation = "";
    switch (mode) {
      case modes.DARKEST:
        operation = "darken";
        break;
      case modes.LIGHTEST:
        operation = "lighten";
        break;
      case modes.DIFFERENCE:
        operation = "difference";
        break;
      case modes.MULTIPLY:
        operation = "multiply";
        break;
      case modes.EXCLUSION:
        operation = "exclusion";
        break;
      case modes.SCREEN:
        operation = "screen";
        break;
      case modes.REPLACE:
        operation = "copy";
        break;
      case modes.OVERLAY:
        operation = "overlay";
        break;
      case modes.HARD_LIGHT:
        operation = "hard-light";
        break;
      case modes.SOFT_LIGHT:
        operation = "soft-light";
        break;
      case modes.DODGE:
        operation = "color-dodge";
        break;
      case modes.BURN:
        operation = "color-burn";
        break;
      case modes.ADD:
        operation = "lighter";
        break;
      case modes.REMOVE:
        operation = "destination-out";
        break;
        // case Mode.SUBTRACT: operation="";
        // break;
      case modes.BLEND:
      default:
        operation = "source-over";
    }
    state.makeChange("globalCompositeOperation", operation);
  },

  colorMode(mode) {
    state.saveState("_colorMode");
    state._colorMode = mode;
  },

  ellipseMode(mode) {
    state.saveState("_ellipseMode");
    state._ellipseMode = mode;
  },

  imageMode(mode) {
    state.saveState("_imageMode");
    state._imageMode = mode;
  },

  rectMode(mode) {
    state.saveState("_rectMode");
    state._rectMode = mode;
  },

  beginShape(mode) {
    state._shapeMode = mode;
  },

  ///////////////////////////////////////
  /////// transformations
  /////////////////////////////////////

  pixelDensity(dense) {
    const win = globals.renderer.window;
    if (!win) return;

    if (typeof dense != "number") return win.devicePixelRatio;
    // if (dense === globals.pixelDensity) return;
    // win.devicePixelRatio = dense;
    // globals.scale(dense);
  },

  applyMatrix(a = 1, b = 0, c = 0, d = 1, e = 0, f = 0) {
    state.makeChange('setTransform', [a, b, c, d, e, f], true);
  },

  resetMatrix() {
    state.makeChange('setTransform', [1, 0, 0, 1, 0, 0], true);
  },

  rotate(ang) {
    const scale = Maths.globals.cos(ang);
    const shear = Maths.globals.sin(ang);
    state.makeChange('transform', [scale, shear, -shear, scale, 0, 0], true);
  },

  scale(vecX, vecY) {
    vecY = vecY || vecX;
    state.makeChange('transform', [vecX, 0, 0, vecY, 0, 0], true);
  },

  shearX(ang) {
    let isRadian = state._angleMode === Maths.modes.RADIANS;
    state.makeChange('transform', [1, 0, Maths.globals.tan(ang), 1, 0, 0], true);
  },

  shearY(ang) {
    let isRadian = state._angleMode === Maths.modes.RADIANS;
    state.makeChange('transform', [1, -Maths.globals.tan(ang), 0, 1, 0, 0], true);
  },

  translate(x, y) {
    state.makeChange('transform', [1, 0, 0, 1, x, y], true);
  },

  /////////////////////////////////////
  ////////// drawing states
  ///////////////////////////////////

  push() {
    const ctx = state.renderer.context;
    if (state.__pendingApply) state.applyState(ctx);
    ctx.save();
    state.savedStates.push({});
  },

  pop() {
    const ctx = state.renderer.context;
    ctx.restore();
    if (state.savedStates.length) {
      Object.assign(state, state.savedStates.pop());
    }
  },

  ///////////////////////////////
  ///// pixel manipulation
  /////////////////////////////

  loadPixels(x = 0, y = 0, wid = null, hei = null) {
    wid = wid || globals.width;
    hei = hei || globals.height;
    state._pixelData = state.renderer.context.getImageData(x, y, wid, hei);
    state._pixelData.data.pitch = state._pixelData.width;
    state._pixelData.loc = {
      x,
      y
    };
  },
 
  pixelLoop(func, incX = null, incY = null) {
    incX = incX || 1;
    incY = incY || incX;
    const pixels = state._pixelData;
    if (!pixels || typeof func != "function") return;
    const [wid, hei] = [pixels.width, pixels.height];
    for (let x = 0; x < wid; x += incX) {
      for (let y = 0; y < hei; y += incY) {
        func(x, y);
      }
    }
  },

  setPixelOf(pixels, px, py, col) {
    if (typeof col == "object" && col.constructor === Array) {
      px = Maths.globals.int(px);
      py = Maths.globals.int(py);
      const ind = py * pixels.pitch * 4 + 4 * px;
      if (ind < pixels.length) {
        pixels[ind] = col[0];
        pixels[ind + 1] = col[1];
        pixels[ind + 2] = col[2];
        pixels[ind + 3] = col[3];
      }
    }
  },

  setPixel(px, py, col) {
    if (!state._pixelData) return;
    const pixels = state._pixelData.data;
    setPixelOf(pixels, px, py, col);
  },

  getPixelOf(pixels, px, py) {
    px = Maths.globals.int(px);
    py = Maths.globals.int(py);
    const ind = py * pixels.pitch * 4 + 4 * px;
    const hei = pixels.length / (4 * pixels.pitch);
    if (px < 0 || py < 0 || px >= pixels.pitch || py >= hei) return [];
    return [pixels[ind], pixels[ind + 1], pixels[ind + 2], pixels[ind + 3]];
  },

  getPixel(px, py) {
    if (!state._pixelData) return [];
    const pixels = state._pixelData.data;
    return getPixelOf(pixels, px, py);
  },

  updatePixels(x = null, y = null, dw = null, dh = null) {
    const pixels = state._pixelData;
    dw = dw || pixels.width;
    dh = dh || pixels.height;
    if (x == null) x = pixels.loc.x;
    if (y == null) y = pixels.loc.y;
    state.renderer.context.putImageData(state._pixelData, x, y, 0, 0, dw, dh);
    state._pixelData = null;
  },

  ////////////////////////////
  /////// Renderer related
  ////////////////////////////
  render() {
    state._willRender = true;
  },

  noRender() {
    state._willRender = false;
  },

  loop() {
    state._willLoop = true;
  },

  noLoop() {
    state._willLoop = false;
  },

  frameRate(fps = null) {
    if (fps === null || fps < 1) return 1000 / globals.deltaTime;
    state._fps = fps;
    if (state._willLoop) {
      clearTimeout(state._loop);
      state._loop = null;
    }
  },

  ////////////////////////////////
  ///// window related states
  ///////////////////////////////
  title(tit = null){
    const window = state.renderer.window;
    if(!window) return;
    if(tit==null) return window.title;
    window.title = "" + tit; // just converting to string
  },

  cursor(mode) {
    let type = "";
    switch (mode) {
      case modes.CROSS:
        type = "crosshair";
        break;
      case modes.HAND:
        type = "hand";
        break;
      case modes.MOVE:
        type = "sizeall";
        break;
      case modes.TEXT:
        type = "ibeam";
        break;
      case modes.WAIT:
        type = "wait";
        break;
      case modes.ARROW:
      default:
        type = "arrow";
    }
    const window = state.renderer.window;
    if (!window) return;
    window.cursor = type;
  },

  noCursor() {
    const window = state.renderer.window;
    if (!window) return;
    window.cursor;
  },

  fullscreen(tog = null) {
    const window = state.renderer.window;
    if (!window) return;
    if (tog === null) return window.fullscreen;
    window.fullscreen = !!tog;
  },

  grab() {
    const window = state.renderer.window;
    if (!window) return;
    window.grab = true;
  },

  noGrab() {
    const window = state.renderer.window;
    if (!window) return;
    window.grab = false;
  },

  resizable(is) {
    const window = state.renderer.window;
    if (!window) return;
    window.resizable = !!is;
  },

  showBorder(tog) {
    const window = state.renderer.window;
    if (!window) return;
    window.bordered = !!tog;
  },

  setPosition(x, y) {
    const window = state.renderer.window;
    if (!window) return;
    window.position = {
      x,
      y
    };
  },

};

module.exports = State;
