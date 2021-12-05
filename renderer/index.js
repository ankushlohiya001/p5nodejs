const Renderer = require("./renderer");
const State = require("../state");
const Shaper = require("../shapes"); 
const Color = require("../color");
const Maths = require("../math");
const EventManager = require("../events"); 

let renderer, state;

Renderer.useSketch = function(sk) {
  renderer = sk.renderer;
  state = renderer.state;
	State.useRenderer(renderer);
  Shaper.useRenderer(renderer);
  Color.useRenderer(renderer);
  Maths.useRenderer(renderer);
  EventManager.useRenderer(renderer);
}

const defaults = Renderer.defaults = {
  width: 1280,
  height: 720,
  resizable: true,
  opengl: false,
  EPSILON: 0
};

const globals = Renderer.globals = {
  createWindow(wid = null, hei = null, title = null) {
    if (wid == null && hei == null) {
      const canvas = renderer.canvas;
      if(!canvas){
        wid = defaults.width;
        hei = defaults.height;
      }else{
        wid = canvas.width;
        hei = canvas.height;
      }
    }
    renderer.createWindow(wid, hei, title || renderer.sketch.constructor.name);
  },

  createCanvas(wid = null, hei = null, type = "2d") {
    if(wid == null && hei == null ){
      const window = renderer.window;
      if (!window) {
        wid = defaults.width;
        hei = defaults.height;
      } else {
        const size = window.size;
        wid = size.w;
        hei = size.h;
      }
    }
    renderer.createCanvas(wid, hei, type);
    return renderer.canvas;
  },

  resizeCanvas(wid = null, hei = null) {
    const canvas = renderer.canvas;
    if (!canvas) {
      throw "canvas is not created yet..";
    }
    if (wid == null && hei == null) {
      const window = renderer.window;
      if(!window){
        wid = defaults.width;
        hei = defaults.height;
      }else{
        const size = window.size;
        wid = size.w;
        hei = size.h;
      }
    }
    state.saveCanvasState(renderer.context);
    canvas.width = wid;
    canvas.height = hei;
    state.restoreCanvasState(renderer.context);
    return canvas;
  },

  saveCanvas(filename = __filename + "_sketch.png", after) {
    const canvas = renderer.canvas;
    if (canvas) {
      canvas.saveAs(filename, after);
    }
  },

  redraw(times) {
    renderer.redraw(times);
  },

  alert(mess) {
    console.info("yet to implement!!");
    // return renderer.window.alert(mess);
  },

  confirm(mess) {
    console.info("yet to implement!!");
    // return renderer.window.confirm(mess);
  },

  exit() {
    renderer.exit();
  }
}

globals.size = function(...params){
  globals.createWindow(...params);
  globals.resizeCanvas();
};

module.exports = Renderer;

