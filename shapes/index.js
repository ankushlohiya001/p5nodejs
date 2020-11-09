const shapes={
  _renderer:null,
  get ctx(){
    return this._renderer.context;
  },
  get renderer(){
    return this._renderer;
  },
  setRenderer(renderer){
    this._renderer=renderer;
  },
  _drawShape(funs){
    const ctx=this.ctx;
    ctx.beginPath();
    this.renderer.state.applyState();
    funs(ctx);
    this.renderer.state.applyEffect();
  },
  ellipse(cx, cy, width, height){
    this._drawShape(ctx=>{
      height=height || width;
      const radX=width/2;
      const radY=height/2;
      ctx.ellipse(cx, cy, radX, radY,0, 0, 44/7);
    });
  },
  circle(cx, cy, dia){
    this._drawShape(ctx=>{
      const rad=dia/2;
      ctx.ellipse(cx, cy, rad, rad, 0, 0, 44/7);
    });
  },
  rect(px, py, wid, hei){
    this._drawShape(ctx=>{
      hei=hei || wid;
      ctx.rect(px, py, wid, hei);
    });
  }
};

module.exports=shapes;