const moders={
  ellipseModer()
};
const contextConfig={
  ctx:{},
  ellipseMode:null,
  rectMode:null
};
const shapes={
  ellipse(x,y,w,h){
    ctx.beginPath();
    ctx.ellipse(x,y,w,h,0,44/7);
  }
};
module.exports={
  shapes,
  setCtx(ctx){
    contextConfig.ctx=ctx;
  }
};