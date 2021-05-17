const {
  Renderer,
  renderFuns
} = require("./renderer");
const Mode = require("./constants");
const math = require("./math");
const {
  Shaper,
  shapes
} = require("./shapes");
const EventManager = require("./events");
const colorManager = require("./color");
const io = require("./io");
const envFuns = require("./env");
const {
  State,
  stateChanger
} = require("./state");

function makeGlobal(obj) {
  const desc = Object.getOwnPropertyDescriptors(obj);
  for (let prop in desc) {
    Object.defineProperty(global, prop, desc[prop]);
  }
}

{
  const preload = global.preload || function() {};
  const setup = global.setup || function() {};
  const draw = global.draw || function() {};

  const internelRenderer = new Renderer(1280, 720);
  const state = new State();
  const shaper = new Shaper();
  const eventManager = new EventManager(internelRenderer);

  internelRenderer.setState(state);
  shaper.setState(state);
  math.setState(state);
  colorManager.setState(state);

  (async function() {
    try {
      makeGlobal(io);

      await new Promise(res => {
        preload();
        let lop = setInterval(() => {
          if (io.preloadDone()) {
            clearInterval(lop);
            res();
          }
        }, 10);
      });

    } catch (err) {
      if (global.crashed) global.crashed(err);
      else {
        console.error(`->${err}`);
      }
    }
    makeGlobal(Mode);
    makeGlobal(envFuns);
    makeGlobal(math.mathFuns);
    makeGlobal(colorManager.colorFuns);
    makeGlobal(shapes);
    makeGlobal(stateChanger);
    makeGlobal(renderFuns);
    eventManager.applyAllEvents();
    ////////////////////
    ///defaults//
    if (!global.draw) noLoop();
    fill(255);
    strokeCap(ROUND);
    //////////////////
    setup();
    internelRenderer.loop(draw);
  })();
  // setup();
}