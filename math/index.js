const math = require("./math_funs");
const Vector = require("./vector");
const Matrix = require("./matrix");
const {
  Line
} = require("./geomat");
const Noise = require("./noise");

math.public.Vector = Vector;
math.public.createVector = Vector.createVector;

math.public.Line = Line;
math.public.createLine = Line.createLine;

math.public.Matrix = Matrix;

math.public.noise = Noise.noise;
math.public.noiseDetail = Noise.noiseDetail;
math.public.noiseSeed = Noise.noiseSeed;

module.exports = {
  setState: math.setState,
  mathFuns: math.public
};