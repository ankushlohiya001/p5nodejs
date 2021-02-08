const math=require("./math");
const Vector=require("./vector");
const {Line}=require("./geomat");

const mathClass=math.constructor;

mathClass.Vector = Vector;
mathClass.createVector= Vector.createVector;

mathClass.Line = Line;
mathClass.createLine= Line.createLine;

module.exports=math;