class EventManager{
  static userEventMap={
    keyPressed: "keypress",
    mousePressed: "mousedown",
    mouseReleased: "mouseup",
    keyTyped: "keyinput",
    keyReleased: "keyup",
    mouseWheel: "wheel",
    mouseDragged: "drag"
  }

  constructor(renderer){
    this.renderer=renderer;
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
    this.applyEvent("exit",console.log,"p5 window exited!!");
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