const engine=require("./../../node-sdl-canvas");
const State=require("./state");
class Renderer{
  static defaultConfig={
    width:1280,
    height:720
  }
  constructor(wid,hei,onlyImage=false){
    let {width,height}=Renderer.defaultConfig;
    width=wid || width;
    height=hei || height;
    this.initContext(width, height);
    if(!onlyImage) this.initWindow({width, height, title:"nodeP5"});
    this.initState();
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
    engine.mainLoop();
    window.canvas=this.canvas;
    this.window=window;
  }
  initContext(width,height){
    const canvas=engine.createCanvas(width, height);
    this._context=canvas.getContext("2d");
  }
  getPixels(sx, sy, sw, sh){
    return this._context.getImageData(sx, sy, sw, sh);
  }
  updatePixels(...pars){
    return this._context.putImageData(...pars);
  }
  draw(){
    if(this.window){
      this.window.render();
    }
  }
  save(name="nodeP5"){
    engine.saveAs(this.canvas, name);
  }
}

module.exports=Renderer;