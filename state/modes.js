const modes = [
  "ARROW",
  "WAIT",
  "TEXT",
  "MOVE",
  "HAND",
  "CROSS",

  "BLEND",
  "REMOVE",
  "ADD",
  "BURN",
  "DODGE",
  "SOFT_LIGHT",
  "HARD_LIGHT",
  "OVERLAY",
  "REPLACE",
  "SCREEN",
  "EXCLUSION",
  "MULTIPLY",
  "DIFFERENCE",
  "LIGHTEST",
  "DARKEST",

  "BASELINE",
  "BOTTOM",

  "TOP",
  "RIGHT",
  "LEFT",

  "ROUND",
  "BEVEL",
  "MITER",
  "ROUND",
  "PROJECT",
  "SQUARE",
];

for(let mode of modes){
  module.exports[mode] = Symbol(mode);
}
