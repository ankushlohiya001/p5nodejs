const engine=require("./../../node-sdl-canvas");
const State=require("./state");
const fs = require('fs');
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
    if(!onlyImage) this.initWindow({width, height,title:"nodeP5"});
    this.initState();
  }
  get width(){
    this._context.canvas.width;
  }
  set width(val){
    if(!this.window){this._context.canvas.width=val;return val;}
    let {w,h}=this.window.size;
    this.window.size={w:val, h};
  }
  get height(){
    this._context.canvas.height;
  }
  set height(val){
    if(!this.window){this._context.canvas.height=val;return val;}
    let {w,h}=this.window.size;
    this.window.size={w, h:val};
  }
  initState(){
    const state=State.create();
    this.state=state;
    for(let method in State.prototype){
      this[method]=State.prototype[method].bind(state);
    }
  }
  initWindow(opts={}){
    const window=engine.createWindow(opts);
    engine.mainLoop();
    window.canvas=this._context.canvas;
    this.window=window;
  }
  initContext(width,height){
    const canvas=engine.createCanvas(width, height);
    this._context=canvas.getContext("2d");
  }
  saveAs(name="nodeP5"){
    const out = fs.createWriteStream(`${name}.png`);
    const stream = this._context.canvas.createPNGStream();
    stream.pipe(out);
    out.on('finish', () =>  console.log(`drawing to file: ${name}.png`));
  }
  draw(name){
    if(this.window){
      this.window.render();
      return;
    }
    this.saveAs();
  }
}

module.exports=Renderer;