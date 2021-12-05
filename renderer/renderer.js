const document = require("./../../node-sdl-canvas");
const State = require("../state");
const Shaper = require("../shapes");
const Maths = require("../math");
const performance = require("perf_hooks").performance;
const EventManager = require("../events"); 

class Renderer {
  static crntDrawFn;

  constructor() {
    this._sketch = null;
    this._window = null;
    this._canvas = null;
    this.initStateAndShaper();
    this.drawIsPending = false;
  }

  get canvas() {
    return this._canvas;
  }

	get context(){
		return this._canvas.getContext("2d");
	}

  get window() {
    return this._window;
  }

  get sketch(){
    return this._sketch;
  }

  createWindow(wid, hei, title) {
    if (this._window) {
      this._window.resizeTo(wid, hei);
      this._window.title = title;
    } else {
      this._window = document.createElement("window", {
        width: wid,
        height: hei,
        title,
        resizable: true
      });

      const eventManager = this.eventManager = new EventManager(this);
      eventManager.applyAllEvents(this._sketch);
    }
    if(this._canvas){
      document.appendChild(this._canvas, this._window);
    }
  }

  createCanvas(wid, hei, type) {
    if (this._canvas && this._window) {
      document.removeChild(this._canvas, this._window);
    }

    this._canvas = document.createElement("canvas", {
      width: wid,
      height: hei
    });

    if (this._window) document.appendChild(this._canvas, this._window);

    if (type != "2d") {
      console.warn(`${type} not yet Supported`);
    }
  }

  initStateAndShaper() {
    const state = this.state = new State(this);
		this.shaper = new Shaper(state);
  }

  async render(drawFn){
    const state = this.state;
    state.incFrameCount();
    drawFn();
    state.updateLastEvent();

    const win = this.window;
    if (state._willRender && !!win) await win.render();
    this.drawIsPending = false;
  }

	loop(drawFn) {
    Renderer.crntDrawFn = drawFn;
    const state = this.state;
		const renderer = this;
    (function looper() {
			const crnt = performance.now();
      const timeConsumed = crnt - state._lastPerformance;
      let remainingTime = 1000 / state._fps - timeConsumed;

      if(remainingTime < Renderer.defaults.EPSILON || state._frameCount==0){ // allow first immediate render
        state._deltaTime = timeConsumed;
        state._lastPerformance = crnt;
        renderer.render(drawFn);
      }
      
      // drawIsPending is used by redraw function
      if (state._willLoop || renderer.drawIsPending){
        state._loop = setTimeout(looper, remainingTime);
      }
    })();

  }

  redraw(times=1) {
    for (let i = 0; i < times; i++) {
      if (this.drawIsPending) return;
      this.drawIsPending = true;
      if(Renderer.crntDrawFn) this.loop(Renderer.crntDrawFn);
    }
  }
  
  exit(){
    this.state._willLoop = false;
    const window = this.window;
    if (!window) return;
    window.closable = true;
    window.close();
  }
}

module.exports = Renderer;
