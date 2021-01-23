const Mode=require("./../constants");
class StateManager{
  static defaults={
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
    // _cursorMode: Mode.ARROW,
    _fps: 60,
    _isLoop: true
  }

  static create(ctx){
    return new State(ctx);
  }

  constructor(ctx){
    this.context=ctx;
    this.text={size:16,font:'sans-serif'};
    this._loop=null;
    this._deltaTime=0;
    this._lastPerformance=0;
    this._frameCount= 0;
    this._pixelData= null;
    this._eventData= {
      keyPressed:false,
      mousePressed:false,
      mouseX: 0,
      mouseY: 0,
      key: '',
      keyCode: 0
    };
    this._lastEventData={
      mouseX:0,
      mouseY:0
    };
    ///////////////
    this.changes={};
    this.__pendingApply=false;
    this.savedStates=[];
    //////////////////
    this._loadDefaults();
    this.updateKeyEvent=this._updateKeyEvent.bind(this);
    this.updateMouseEvent=this._updateMouseEvent.bind(this);
  }

  _saveState(prop){
    let lstIndx=this.savedStates.length-1;
    if(lstIndx<0) return;
    if(!this.savedStates[lstIndx].hasOwnProperty(prop)){
      this.savedStates[lstIndx][prop]=this[prop];
    }
  }

  _makeChange(prop,state,isTransform=false){
    if(isTransform){
      if(!this.changes[prop]){
        this.changes[prop]=[state];
      }else{
        this.changes[prop].push(state);
      }
      return;
    }
    this.changes[prop]=state;
    if(!this.__pendingApply) this.__pendingApply=true;
  }

  applyState(){
    const ctx=this.context;
    for(let changeKey in this.changes){
      let change=this.changes[changeKey];
      if(change.constructor===Array){
        for(let matrix of change){
          ctx[changeKey](...matrix);
        }
        continue;
      }
      ctx[changeKey]=change;
    }
    this.changes={};
    this.__pendingApply=false;
  }
  
  applyEffect(){
    const ctx=this.context;
    if(this._willFill) ctx.fill();
    if(this._willStroke) ctx.stroke();
  }

  _updateKeyEvent(eve){
    this._eventData.key=eve.key;
    this._eventData.keyCode=eve.keyCode;
  }

  _updateMouseEvent(eve){
    this._eventData.mouseX=eve.clientX;
    this._eventData.mouseY=eve.clientY;
  }

  _incFrameCount(){
    this._lastEventData.mouseX=this._eventData.mouseX;
    this._lastEventData.mouseY=this._eventData.mouseY;
    this._frameCount++;
  }

  _loadDefaults(){
    Object.assign(this,State.defaults);
    this.fill(255);
    this.strokeCap(Mode.ROUND);
  }
  
}

module.exports=StateManager;