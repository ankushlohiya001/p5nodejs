const math=require("./math");
const Vector=require("./vector");
const Matrix=require("./matrix");
const {Line}=require("./geomat");
const Noise=require("./noise");

const mathClass=math.constructor;

mathClass.Vector = Vector;
mathClass.createVector= Vector.createVector;

mathClass.Line = Line;
mathClass.createLine= Line.createLine;

mathClass.Matrix = Matrix;

mathClass.noise=Noise.noise;
mathClass.noiseDetail=Noise.noiseDetail;
mathClass.noiseSeed=Noise.noiseSeed;
module.exports=math;