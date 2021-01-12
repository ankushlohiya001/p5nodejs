const engine=require("./../../node-sdl-canvas");
const {performance}=require("perf_hooks");
const State=require("./state");
class Renderer{
  static defaultConfig={
    width:1280,
    height:720
  }
  static globals={
    redraw(){
      this.loop();
    }
  }
  constructor(wid,hei){
    let {width,height}=Renderer.defaultConfig;
    width=wid || width;
    height=hei || height;
    this.initContext(width, height);
    this.initWindow({width, height, title:"nodeP5"});
    this.initState();
    this.loop=this.loop.bind(this);
  }

  get context(){
    return this._context;
  }

  get canvas(){
    return this._context.canvas;
  }

  get width(){
    return this.canvas.width;
  }

  set width(val){
    if(!this.window){this.canvas.width=val;return val;}
    let {w,h}=this.window.size;
    this.window.size={w:val, h};
  }

  get height(){
    return this.canvas.height;
  }

  set height(val){
    if(!this.window){this.canvas.height=val;return val;}
    let {w,h}=this.window.size;
    this.window.size={w, h:val};
  }

  initState(){
    const state=State.create(this.context);
    this.state=state;
  }


  initWindow(opts={}){
    const window=engine.createWindow(opts);
    window.canvas=this.canvas;
    window.preserveCanvasState=true;
    this.window=window;
  }

  initContext(width,height){
    const canvas=engine.createCanvas(width, height);
    this._context=canvas.getContext("2d");
  }

  draw(){
    if(this.window){
      this.window.render();
      this.state._incFrameCount();
    }
  }

  setDrawFuns(funs){
    this.userDrawFuns=funs;
  }

  loop(){
    const crnt = performance.now();
    this.state._deltaTime= crnt - this.state._lastPerformance;
    this.state._lastPerformance = crnt;
    this.state.push();
    this.userDrawFuns();
    this.state.pop();
    this.draw();
    const delay = Math.max(1000/this.state._fps - this.state.deltaTime,0);
    if(this.state._isLoop) this.state._loop = setTimeout(this.loop, delay);
  }

  save(name="nodeP5"){
    engine.saveAs(this.canvas, name);
  }

  exit(){
    this.window.exit();
  }
}

module.exports=Renderer;