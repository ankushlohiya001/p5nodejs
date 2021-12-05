const EventManager = require("./eventManager");

let state = {};

EventManager.useRenderer = function(renderer){
  state = renderer.state;
}

const modes = EventManager.modes = {
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

const globals = EventManager.globals = {
  get mouseX() {
    return state._eventData.mouseX;
  },

  get mouseY() {
    return state._eventData.mouseY;
  },

  get pmouseX() {
    return state._lastEventData.mouseX;
  },

  get pmouseY() {
    return state._lastEventData.mouseY;
  },

  get movedX() {
    return globals.mouseX - globals.pmouseX;
  },

  get movedY() {
    return globals.mouseY - globals.pmouseY;
  },

  get mouseIsPressed() {
    return !!state._eventData.mousePressed;
  },

  get keyIsPressed() {
    return !!state._eventData.keyPressed;
  },

  get key() {
    return state._eventData.key;
  },

  get keyCode() {
    return state._eventData.keyCode;
  },

  keyIsDown(code) {
    return globals.keyIsPressed && code === globals.keyCode;
  },

};

module.exports = EventManager;
