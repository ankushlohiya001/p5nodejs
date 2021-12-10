const EventManager = require("./eventManager");
const modes = EventManager.modes = require("./modes");

let state = {};

EventManager.useRenderer = function(renderer){
  state = renderer.state;
}

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
