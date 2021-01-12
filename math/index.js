const math=require("./math");
const Vector=require("./vector");

const mathClass=math.constructor;
mathClass.prototype.Vector = Vector;
mathClass.prototype.createVector=function(a, b){
  return new Vector(a,b);
}

module.exports=math;