const modes = [
  "CHORD",
  "PIE",
  "OPEN",
  "CLOSE",

  "CORNER",
  "CORNERS",
  "CENTER",
  "RADIUS",

  "POINTS",
  "LINES",

  "TRIANGLES",
  "TRIANGLE_FAN",
  "TRIANGLE_STRIP",

  "QUADS",
  "QUAD_STRIP",
];

for(let mode of modes){
  module.exports[mode] = Symbol(mode);
}
