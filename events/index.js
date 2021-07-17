class EventManager {
  static userEventMap = {
    keyPressed: "keypress",
    mousePressed: "mousedown",
    mouseClicked: "click",
    doubleClicked: "dblclick",
    mouseReleased: "mouseup",
    mouseEntered: "mouseenter",
    mouseLeaved: "mouseleave",
    keyTyped: "keyinput",
    keyReleased: "keyup",
    mouseWheel: "wheel",
    mouseDragged: "drag",
    windowResized: "resize",
    windowMoved: "move",
    windowMaximized: "maximize",
    windowMinimized: "minimize",
    windowFocused: "focus",
    windowBlurred: "blur",
    windowRestored: "restore",
    fileDropped: "drop",
  }

  constructor(renderer) {
    this.renderer = renderer;
    renderer.window.closable = false;
  }

  applyEvent(eve, todo) {
    if (!this.renderer.window) return;
    this.renderer.window.on(eve, todo);
  }

  updateEventData() {
    const state = this.renderer.state;
    const eventData = state._eventData;

    this.applyEvent("keypress", function() {
      eventData.keyPressed = true;
    });

    this.applyEvent("keyup", function() {
      eventData.keyPressed = false;
    });

    this.applyEvent("mousedown", function() {
      eventData.mousePressed = true;
    });

    this.applyEvent("mouseup", function() {
      eventData.mousePressed = false;
    });

    this.applyEvent("mousemove", eve => state.updateMouseEvent(eve));
    this.applyEvent("keypress", eve => state.updateKeyEvent(eve));

  }

  applyInternalEvents() {
    const state = this.renderer.state;
    const renderer = this.renderer;
    this.applyEvent("close", () => {
      renderer.exit();
    });

    this.applyEvent("minimize", () => {
      state._willRender = false;
    });

    this.applyEvent("restore", () => {
      state._willRender = true;
    });

    ///// preserving canvas state, as resizing cause canvas to loss it's state.

    renderer.window.beforeResize = () => {
      state.saveCanvasState();
    };

    this.applyEvent("resize", () => {
      state.restoreCanvasState();
    });
  }

  applyUserEvents() {
    const eventMap = EventManager.userEventMap;
    for (let event in eventMap) {
      if (global[event]) this.applyEvent(eventMap[event], global[event]);
    }
  }

  applyAllEvents() {
    this.applyInternalEvents();
    this.updateEventData();
    this.applyUserEvents();
  }

}

module.exports = EventManager;