const Mode = require("./../constants");
const stateChanger = require("./state_changer");

class State {
  static canvasStates = [
    "textAlign",
    "textBaseline",
    "font",
    "strokeStyle",
    "fillStyle",
    "currentTransform",
    "quality",
    "lineDashOffset",
    "lineJoin",
    "lineCap",
    "lineWidth",
    "miterLimit",
    "globalCompositeOperation"
  ];
  static defaults = {
    _willStroke: true,
    _willFill: true,
    _willErase: false,
    _angleMode: Mode.RADIANS,
    _colorMode: Mode.RGB,
    _ellipseMode: Mode.CENTER,
    _imageMode: Mode.CORNER,
    _rectMode: Mode.CORNER,
    _arcMode: Mode.OPEN,
    _shapeMode: null,
    _fps: 60,
    _willLoop: true,
    _willRender: true,
  }

  constructor() {
    this.renderer = null;
    this.text = {
      size: 16,
      font: 'sans-serif'
    };
    this._loop = null;
    this._deltaTime = 0;
    this._lastPerformance = 0;
    this._frameCount = 0;
    this._pixelData = null;
    this._eventData = {
      keyPressed: false,
      mousePressed: false,
      mouseX: 0,
      mouseY: 0,
      key: '',
      keyCode: 0
    };
    this._lastEventData = {
      mouseX: 0,
      mouseY: 0
    };
    this._savedCanvasStates = {};
    ///////////////
    this.changes = {};
    this.__pendingApply = false;
    this.savedStates = [];
    //////////////////
    this.loadDefaults();
    stateChanger.setState(this);
  }

  saveState(prop) {
    let lstIndx = this.savedStates.length - 1;
    if (lstIndx < 0) return;
    if (!this.savedStates[lstIndx].hasOwnProperty(prop)) {
      this.savedStates[lstIndx][prop] = this[prop];
    }
  }

  makeChange(prop, state, isTransform = false) {
    if (isTransform) {
      if (!this.changes[prop]) {
        this.changes[prop] = [state];
      } else {
        this.changes[prop].push(state);
      }
      return;
    }
    this.changes[prop] = state;
    if (!this.__pendingApply) this.__pendingApply = true;
  }

  applyState() {
    const ctx = this.renderer.context;
    for (let changeKey in this.changes) {
      let change = this.changes[changeKey];
      if (change.constructor === Array) {
        for (let matrix of change) {
          ctx[changeKey](...matrix);
        }
        continue;
      }
      ctx[changeKey] = change;
    }
    this.clearChanges();
  }

  clearChanges() {
    this.changes = {}
    this.__pendingApply = false;
  }

  applyEffect() {
    const ctx = this.renderer.context;
    if (this._willFill) ctx.fill();
    if (this._willStroke) ctx.stroke();
  }

  setRenderer(ren) {
    this.renderer = ren;
  }

  updateKeyEvent(eve) {
    this._eventData.key = eve.key;
    this._eventData.keyCode = eve.keyCode;
  }

  updateMouseEvent(eve) {
    this._eventData.mouseX = eve.clientX;
    this._eventData.mouseY = eve.clientY;
  }

  incFrameCount() {
    this._lastEventData.mouseX = this._eventData.mouseX;
    this._lastEventData.mouseY = this._eventData.mouseY;
    this._frameCount++;
  }

  saveCanvasState() {
    const ctx = this.renderer.canvas.getContext("2d");
    for (let key of State.canvasStates) {
      this._savedCanvasStates[key] = ctx[key];
    }
  }

  restoreCanvasState() {
    const ctx = this.renderer.canvas.getContext("2d");
    for (let key of State.canvasStates) {
      ctx[key] = this._savedCanvasStates[key];
    }
    this._savedCanvasStates = {};
  }

  loadDefaults() {
    Object.assign(this, State.defaults);
  }

}

module.exports = {
  stateChanger: stateChanger.public,
  State
};