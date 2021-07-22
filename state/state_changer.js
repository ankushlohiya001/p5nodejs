const color = require("./../color").colorFuns.color;

const Mode = require("./../constants");
const math = require("./../math").mathFuns;

let state = {};

function font() {
  return `${state.text.size}px ${state.text.font}`;
}

const stateChanger = {
  //////////////////////////////////////////
  ////////// getters
  /////////////////////////////////////////

  get displayDensity() {
    return stateChanger.renderer.window.displayPixelRatio;
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
    return state.renderer.width;
  },

  get height() {
    return state.renderer.height;
  },

  get mouseX() {
    return state._eventData.mouseX;
  },

  get mouseY() {
    return state._eventData.mouseY;
  },

  get pmouseX() {
    return state._lastEventData.mouseX;
  },

  get pmouseY() {
    return state._lastEventData.mouseY;
  },

  get movedX() {
    return stateChanger.mouseX - stateChanger.pmouseX;
  },

  get movedY() {
    return stateChanger.mouseY - stateChanger.pmouseY;
  },

  get mouseIsPressed() {
    return !!state._eventData.mousePressed;
  },

  get keyIsPressed() {
    return !!state._eventData.keyPressed;
  },

  get key() {
    return state._eventData.key;
  },

  get keyCode() {
    return state._eventData.keyCode;
  },

  get pixels() {
    return state._pixelData ? state._pixelData.data : null;
  },

  keyIsDown(code) {
    return stateChanger.keyIsPressed && code === stateChanger.keyCode;
  },
  ////////////////////////////////////////////////////////////////
  ///////////drawing states like whatever to stroke, fill etc.
  ////////// and their color, size etc.
  ////////////////////////////////////

  stroke(...params) {
    const col = color(...params);
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
      case Mode.SQUARE:
        cap = "butt";
        break;
      case Mode.PROJECT:
        cap = "square";
        break;
      case Mode.ROUND:
        cap = "round";
        break;
      default:
        return;
    }
    state.makeChange('lineCap', cap);
  },

  strokeJoin(join) {
    switch (join) {
      case Mode.MITER:
        join = "miter";
        break;
      case Mode.BEVEL:
        join = "bevel";
        break;
      case Mode.ROUND:
        join = "round";
        break;
      default:
        return;
    }
    state.makeChange('lineJoin', join);
  },

  fill(...params) {
    const col = color(...params);
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
    state.makeChange('font', font());
  },

  textSize(size) {
    state.text.size = size;
    state.makeChange('font', font());
  },

  textAlign(hAlign, vAlign) {
    switch (hAlign) {
      case Mode.LEFT:
        hAlign = "left";
        break;
      case Mode.CENTER:
        hAlign = "center";
        break;
      case Mode.RIGHT:
        hAlign = "right";
        break;
      default:
        hAlign = "";
    }
    switch (vAlign) {
      case Mode.TOP:
        vAlign = "top";
        break;
      case Mode.BOTTOM:
        vAlign = "bottom";
        break;
      case Mode.CENTER:
        vAlign = "middle";
        break;
      case Mode.BASELINE:
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
      case Mode.DARKEST:
        operation = "darken";
        break;
      case Mode.LIGHTEST:
        operation = "lighten";
        break;
      case Mode.DIFFERENCE:
        operation = "difference";
        break;
      case Mode.MULTIPLY:
        operation = "multiply";
        break;
      case Mode.EXCLUSION:
        operation = "exclusion";
        break;
      case Mode.SCREEN:
        operation = "screen";
        break;
      case Mode.REPLACE:
        operation = "copy";
        break;
      case Mode.OVERLAY:
        operation = "overlay";
        break;
      case Mode.HARD_LIGHT:
        operation = "hard-light";
        break;
      case Mode.SOFT_LIGHT:
        operation = "soft-light";
        break;
      case Mode.DODGE:
        operation = "color-dodge";
        break;
      case Mode.BURN:
        operation = "color-burn";
        break;
      case Mode.ADD:
        operation = "lighter";
        break;
      case Mode.REMOVE:
        operation = "destination-out";
        break;
        // case Mode.SUBTRACT: operation="";
        // break;
      case Mode.BLEND:
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
    const win = stateChanger.renderer.window;
    if (typeof dense != "number") return win.devicePixelRatio;
    // if (dense === stateChanger.pixelDensity) return;
    // win.devicePixelRatio = dense;
    // stateChanger.scale(dense);
  },

  applyMatrix(a = 1, b = 0, c = 0, d = 1, e = 0, f = 0) {
    state.makeChange('setTransform', [a, b, c, d, e, f], true);
  },

  resetMatrix() {
    state.makeChange('setTransform', [1, 0, 0, 1, 0, 0], true);
  },

  rotate(ang) {
    let isRadian = state._angleMode === Mode.RADIANS;
    const scale = math.cos(ang, isRadian);
    const shear = math.sin(ang, isRadian);
    state.makeChange('transform', [scale, shear, -shear, scale, 0, 0], true);
  },

  scale(vecX, vecY) {
    vecY = vecY || vecX;
    state.makeChange('transform', [vecX, 0, 0, vecY, 0, 0], true);
  },

  shearX(ang) {
    let isRadian = state._angleMode === Mode.RADIANS;
    state.makeChange('transform', [1, 0, math.tan(ang, isRadian), 1, 0, 0], true);
  },

  shearY(ang) {
    let isRadian = state._angleMode === Mode.RADIANS;
    state.makeChange('transform', [1, -math.tan(ang, isRadian), 0, 1, 0, 0], true);
  },

  translate(x, y) {
    state.makeChange('transform', [1, 0, 0, 1, x, y], true);
  },

  /////////////////////////////////////
  ////////// drawing states
  ///////////////////////////////////

  push() {
    if (state.__pendingApply) state.applyState();
    const ctx = state.renderer.context;
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
    wid = wid || stateChanger.width;
    hei = hei || stateChanger.height;
    state._pixelData = state.renderer.context.getImageData(x, y, wid, hei);
    state._pixelData.data.pitch = state._pixelData.width;
    state._pixelData.loc = {
      x,
      y
    };
  },

  getPixelData(){
    const arr = state._pixelData.data.slice();
    arr.pitch = state._pixelData.width;
    return arr;
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
      px = math.int(px);
      py = math.int(py);
      const ind = py * pixels.pitch * 4 + 4 * px;
      if (ind < pixels.length) {
        pixels[ind] = col[0];
        pixels[ind + 1] = col[1];
        pixels[ind + 2] = col[2];
        pixels[ind + 3] = col[3] * 2.55;
      }
    }
  },

  setPixel(px, py, col) {
    if (!state._pixelData) return;
    const pixels = state._pixelData.data;
    setPixelOf(pixels, px, py, col);
  },

  getPixelOf(pixels, px, py) {
    px = math.int(px);
    py = math.int(py);
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
    if (fps === null || fps < 1) return 1000 / stateChanger.deltaTime;
    state._fps = fps;
    if (state._willLoop) {
      clearTimeout(state._loop);
      state._loop = null;
    }
  },

  ////////////////////////////////
  ///// window related states
  ///////////////////////////////

  cursor(mode) {
    let type = "";
    switch (mode) {
      case Mode.CROSS:
        type = "crosshair";
        break;
      case Mode.HAND:
        type = "hand";
        break;
      case Mode.MOVE:
        type = "move";
        break;
      case Mode.TEXT:
        type = "i-beam";
        break;
      case Mode.WAIT:
        type = "wait";
        break;
      case Mode.ARROW:
      default:
        type = "arrow";
    }
    const window = state.renderer.window;
    window.cursorHidden = false;
    window.cursor = type;
  },

  noCursor() {
    state.renderer.window.cursorHidden = true;
  },

  fullscreen(tog) {
    return state.renderer.window.fullscreen(tog);
  },

  grab() {
    state.renderer.window.grab = true;
  },

  noGrab() {
    state.renderer.window.grab = false;
  },

  resizable(is) {
    state.renderer.window.resizable = !!is;
  },

  showBorder(tog) {
    state.renderer.window.border = !!tog;
  },

  setPosition(lox, loy) {
    state.renderer.window.position = [lox, loy];
  },

};

module.exports = {
  setState(stat) {
    state = stat;
  },
  public: stateChanger,
}