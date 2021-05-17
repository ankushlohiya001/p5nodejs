const engine = require("./../../node-sdl-canvas");
const performance = require("perf_hooks").performance;

const {
  State,
  stateChanger
} = require("../state");
const renderFuns = require("./render_funs");

class Renderer {
  static defaultConfig = {
    width: 1280,
    height: 720,
    title: "nodeP5 sketch"
  }

  constructor(wid, hei) {
    let {
      width,
      height,
      title
    } = Renderer.defaultConfig;
    width = wid || width;
    height = hei || height;
    this.initContext(width, height);
    this.initWindow(title, width, height);
    this.pendingDraw = false;
    renderFuns.setRenderer(this);
  }

  get canvas() {
    return this.context.canvas;
  }

  get width() {
    return this.canvas.width;
  }

  set width(wid) {
    const win = this.window;
    if (!win) {
      this.canvas.width = wid;
      return wid;
    }
    let hei = win.size[1];
    win.size = [wid, hei];
  }

  get height() {
    return this.canvas.height;
  }

  set height(hei) {
    const win = this.window;
    if (!win) {
      this.canvas.height = hei;
      return hei;
    }
    let wid = win.size[0];
    win.size = [wid, hei];
  }

  setState(state) {
    state.setRenderer(this);
    this.state = state;
  }

  initWindow(title, wid, hei) {
    engine.mainLoop();
    const window = engine.createWindow(title, wid, hei);
    window.canvas = this.canvas;
    this.window = window;
  }

  initContext(width, height) {
    const canvas = engine.createCanvas(width, height);
    this.context = canvas.getContext("2d");
  }

  saveCanvas(filename, after) {
    engine.saveAs(this.canvas, filename, after);
  }

  loop(draw) {
    const state = this.state;
    const win = this.window;
    this.draw = draw;
    (function looper() {
      const crnt = performance.now();
      state._deltaTime = crnt - state._lastPerformance;
      state._lastPerformance = crnt;

      state.incFrameCount();
      stateChanger.resetMatrix();
      draw();
      if (state._willRender) win.render();

      const timeConsumed = performance.now() - crnt;
      let delayForNext = 1000 / state._fps - timeConsumed;
      delayForNext = delayForNext < 0 ? 0 : delayForNext;
      if (state._willLoop) state._loop = setTimeout(looper, Math.ceil(delayForNext));
    })();

  }

  exit() {
    const window = this.window;
    if (window.confirm("do you really want to exit??")) {
      window.closable = true;
      window.exit();
    }
  }
}

module.exports = {
  Renderer,
  renderFuns: renderFuns.public
};