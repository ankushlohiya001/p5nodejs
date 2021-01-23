const Color=require("./Color.js");
let state={};
module.exports={
  setState(st){
    state=st;
  },
  color(...params){
    return Color.color(state._colorMode,...params);
  },
  red(col){
    return Color.red(col);
  },
  green(col){
    return Color.green(col);
  },
  blue(col){
    return Color.blue(col);
  },
  alpha(col){
    return Color.alpha(col);
  },
  hue(col){
    return Color.hue(col);
  },
  saturation(col){
    return Color.saturation(col,state._colorMode);
  },
  lightness(col){
    return Color.lightness(col);
  },
  brightness(col){
    return Color.brightness(col);
  },
  lerpColor(col1,col2,amount){
    return Color.lerpColor(col1,col2,amount);
  }
};