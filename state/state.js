const Maths = require("../math");
const performance = require("perf_hooks").performance;

class State {
  static canvasStates = [
    "textAlign",
    "textBaseline",
    "font",
    "strokeStyle",
    "fillStyle",
    // "currentTransform",
    "quality",
    "lineDashOffset",
    "lineJoin",
    "lineCap",
    "lineWidth",
    "miterLimit",
    "globalCompositeOperation"
  ];

  constructor(renderer) {
    this.renderer = renderer;

    this.text = {
      size: 16,
      font: 'sans-serif'
    };
    this._loop = null;
    this._deltaTime = 0;
    this._lastPerformance = performance.now();
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

  applyState(ctx) {
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

  applyEffect(ctx) {
    if (this._willFill) ctx.fill();
    if (this._willStroke) ctx.stroke();
  }

  updateKeyEvent(eve) {
    this._eventData.key = eve.key;
    this._eventData.keyCode = eve.keyCode;
  }

  updateMouseEvent(eve) {
    this._eventData.mouseX = eve.clientX;
    this._eventData.mouseY = eve.clientY;
  }

  updateLastEvent() {
    this._lastEventData.mouseX = this._eventData.mouseX;
    this._lastEventData.mouseY = this._eventData.mouseY;
  }

  incFrameCount() {
    this._frameCount++;
  }

  saveCanvasState(ctx) {
    for (let key of State.canvasStates) {
      this._savedCanvasStates[key] = ctx[key];
    }
  }

  restoreCanvasState(ctx) {
    for (let key of State.canvasStates) {
      ctx[key] = this._savedCanvasStates[key];
    }
    this._savedCanvasStates = {};
  }

  loadDefaults() {
    Object.assign(this, State.defaults);
  }

}

module.exports = State;
