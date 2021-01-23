class EventManager{
  static userEventMap={
    keyPressed: "keypress",
    mousePressed: "mousedown",
    mouseReleased: "mouseup",
    mouseEntered: "mouseenter",
    mouseLeaved: "mouseleave",
    keyTyped: "keyinput",
    keyReleased: "keyup",
    mouseScrolled: "wheel",
    mouseDragged: "drag",
    windowResized: "resize",
    windowMoved: "move",
    windowMaximized: "maximize",
    windowMinimized: "minimize",
    windowFocused: "focus",
    windowBlurred: "blur"
  }

  constructor(renderer){
    this.renderer=renderer;
    this.renderer.window.closable=false;
  }

  applyEvent(eve, todo){
    if(!this.renderer.window) return;
    this.renderer.window.on(eve, todo);
  }

  updateEventData(){
    const state=this.renderer.state;
    const eventData=state._eventData;

    this.applyEvent("keypress", function(){
      eventData.keyPressed=true;
    });

    this.applyEvent("keyup", function(){
      eventData.keyPressed=false;
    });

    this.applyEvent("mousedown", function(){
      eventData.mousePressed=true;
    });

    this.applyEvent("mouseup", function(){
      eventData.mousePressed=false;
    });

    this.applyEvent("mousemove", state.updateMouseEvent);
    this.applyEvent("keypress", state.updateKeyEvent);

  }

  applyInternalEvents(){
    this.applyEvent("close",()=>{
      if(this.renderer.window.confirm("do you really want to exit??")){
        this.renderer.window.closable=true;
        this.renderer.window.exit();
      }
    });
  }

  applyUserEvents(){
    const eventMap=EventManager.userEventMap;
    for(let event in eventMap){
      this.applyEvent(eventMap[event], global[event] || function(){});
    }
  }

  applyAllEvents(){
    this.applyInternalEvents();
    this.updateEventData();
    this.applyUserEvents();
  }

}

module.exports=EventManager;