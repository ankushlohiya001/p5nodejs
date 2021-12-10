const modes = {
  BACKSPACE: 8,
  DELETE: 46,
  RETURN: 13,
  ENTER: 13,
  TAB: 9,
  ESCAPE: 27,
  SHIFT: 16,
  CONTROL: 17,
  OPTION: 0,
  ALT: 18,
  UP_ARROW: 38,
  DOWN_ARROW: 40,
  LEFT_ARROW: 37,
  RIGHT_ARROW: 39,
  SPACEBAR: 32,
};

for(let mode in modes){
  module.exports[mode] = modes[mode];
}
