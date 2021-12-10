class Context{
  constructor(){

  }

  get canvas(){
    return this.renderer.canvas;
  }

  get context(){
    return this.canvas.getContext("2d");
  }

  setRenderer(renderer){
    this.renderer = renderer;
  }
}

module.exports  = Context;
