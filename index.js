const Renderer = require("./renderer");
const Maths = require("./math");
const Shaper = require("./shapes");
const Color = require("./color");
const io = require("./io");
const envFuns = require("./env");
const State = require("./state");
const EventManager = require("./events");

function makeGlobal(obj) {
  const desc = Object.getOwnPropertyDescriptors(obj);
  for (let prop in desc) {
    Object.defineProperty(global, prop, desc[prop]);
  }
}

class Sketch {
  static inited = false;
  static running = false;

  static initModes(){
    makeGlobal(Color.modes);
    makeGlobal(Maths.modes);
    makeGlobal(Shaper.modes);
    makeGlobal(State.modes);
    makeGlobal(EventManager.modes);
  }
  
  static initGlobals(){
     if (!Sketch.inited) {
        Sketch.initModes();
        makeGlobal(io);
        makeGlobal(envFuns);
        makeGlobal(Maths.globals);
        makeGlobal(Color.globals);
        makeGlobal(Shaper.globals);
        makeGlobal(State.globals);
        makeGlobal(EventManager.globals);
        makeGlobal(Renderer.globals);
        Sketch.inited = true;
      }
  }

  static run() {
    if(this.running){
      console.warn(`currently allowed 1 runtime only for performance issue.`);
      return;
    } 
    this.running = true;
    const sketchObj = new this();
    sketchObj.run();
  }

  constructor() {
    const renderer = this.renderer = new Renderer(this);
    renderer._sketch = this;
    this.running = false;
  }

  setup() {
    createCanvas(520, 150);
    createWindow();
    resizable(false);
    noStroke();
    fill("#ed225d");
    rect(0, 0, 145, 150);
    fill("#43853d");
    rect(145, 0, 255, 150);
    fill("#f7df1e");
    rect(390, 0, 130, 150);
    textSize(100);
    stroke(255);
    fill(255);
    strokeWeight(4);
    text("p5node.js", 15, 100);
  }

  draw() {
    noLoop();
  }

  windowResized(){
    resizeCanvas();
  }

  crashed(err){
    print(err);
    exit();
  }

  async run() {
    Sketch.initGlobals();
    try {
      Renderer.useSketch(this);

      await new Promise(res => {
        if (typeof this.preload == "function") this.preload();
        let lop = setInterval(() => {
          if (io.preloadDone()) {
            clearInterval(lop);
            res();
          }
        }, 10);
      });

      ////////////////////
      ///defaults//
      createCanvas();
      fill(255);
      strokeCap(ROUND);
      //////////////////
      this.setup();
    } catch (err) {
      this.crashed(err);
    }

    this.renderer.loop(()=>{
      Renderer.useSketch(this);
      try{
        this.draw();
      }catch(err){
        this.crashed(err);
      }
    });

  }
}

module.exports = Sketch;
