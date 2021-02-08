const {color}=require("./../color");
const Mode=require("./../constants");
const math=require("./../math");
class State{
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
  stroke(...params){
    const col=color(...params);
    if(!this._willStroke){
      this._saveState("_willStroke");
      this._willStroke=true;
    }
    this._makeChange('strokeStyle',col.toString());
  }
  
  noStroke(){
    if(this._willStroke){
      this._saveState("_willStroke");
      this._willStroke=false;
    }
  }

  background(...params){
    const col=color(...params);
    const ctx=this.context;
    const wid=ctx.canvas.width;
    const hei=ctx.canvas.height;
    ctx.save();
    ctx.resetTransform();
    ctx.fillStyle=col.toString();
    ctx.fillRect(0,0, wid, hei);
    ctx.restore();
    ctx.beginPath();
  }

  clear(){
    const ctx=this.context;
    const wid=ctx.canvas.width;
    const hei=ctx.canvas.height;
    ctx.save();
    ctx.resetTransform();
    ctx.clearRect(0,0, wid, hei);
    ctx.restore();
    ctx.beginPath();
  }
  // erase(strengthFill=100, strengthStroke=100){
  //   this._willErase=true;
  //   this.push();
  //   this.stroke(255,strengthStroke);
  //   this.fill(255,strengthFill);
  // }
  
  // noErase(){
  //   this.pop();
  //   this._willErase=false;
  // }
  
  fill(...params){
    const col=color(...params);
    if(!this._willFill){
      this._saveState("_willFill");
      this._willFill=true;
    }
    this._makeChange('fillStyle',col.toString());
  }
  
  noFill(){
    if(this._willFill){
      this._saveState("_willFill");
      this._willFill=false;
    }
  }
  
  strokeWeight(weight){
    this._makeChange('lineWidth',weight);
  }
  
  strokeCap(cap){
    switch(cap){
      case Mode.SQUARE: cap="butt";
      break;
      case Mode.PROJECT: cap="square";
      break;
      case Mode.ROUND: cap="round";
      break;
      default: return;
    }
    this._makeChange('lineCap',cap);
  }
  
  strokeJoin(join){
    switch(join){
      case Mode.MITER: join="miter";
      break;
      case Mode.BEVEL: join="bevel";
      break;
      case Mode.ROUND: join="round";
      break;
      default: return;
    }
    this._makeChange('lineJoin',join);
  }
  
  _font(){
    return `${this.text.size}px ${this.text.font}`;
  }
  
  textFont(font,size){
    this.text.font=font;
    if(size) this.text.size=size;
    this._makeChange('font',this._font());
  }
  
  textSize(size){
    this.text.size=size;
    this._makeChange('font',this._font());
  }
  
  textAlign(hAlign,vAlign){
    switch(hAlign){
      case Mode.LEFT: hAlign="left";
      break;
      case Mode.CENTER: hAlign="center";
      break;
      case Mode.RIGHT: hAlign="right";
      break;
      default: hAlign="";
    }
    switch(vAlign){
      case Mode.TOP: vAlign="top";
      break;
      case Mode.BOTTOM: vAlign="bottom";
      break;
      case Mode.CENTER: vAlign="middle";
      break;
      case Mode.BASELINE: vAlign="alphabetic";
      break;
      default: vAlign="";
    }
    this._makeChange("textAlign",hAlign);
    this._makeChange("textBaseline",vAlign);    
  }
  
  angleMode(mode){
    this._saveState("_angleMode");
    this._angleMode=mode;
  }
  
  arcMode(mode){
    this._saveState("_arcMode");
    this._arcMode=mode;
  }
  
  blendMode(mode){
    let operation="";
    switch(mode){
      case Mode.DARKEST: operation="darken";
      break;
      case Mode.LIGHTEST: operation="lighten";
      break;
      case Mode.DIFFERENCE: operation="difference";
      break;
      case Mode.MULTIPLY: operation="multiply";
      break;
      case Mode.EXCLUSION: operation="exclusion";
      break;
      case Mode.SCREEN: operation="screen";
      break;
      case Mode.REPLACE: operation="copy";
      break;
      case Mode.OVERLAY: operation="overlay";
      break;
      case Mode.HARD_LIGHT: operation="hard-light";
      break;
      case Mode.SOFT_LIGHT: operation="soft-light";
      break;
      case Mode.DODGE: operation="color-dodge";
      break;
      case Mode.BURN: operation="color-burn";
      break;
      case Mode.ADD: operation="lighter";
      break;
      case Mode.REMOVE: operation="destination-out";
      break;
      // case Mode.SUBTRACT: operation="";
      // break;
      case Mode.BLEND:
      default: operation="source-over";
    }
    this._makeChange("globalCompositeOperation", operation);
  }
  // cursor(mode){
  //   let type="";
  //   switch(mode){
  //     case Mode.CROSS: type="crosshair";
  //     break;
  //     case Mode.HAND: type="hand";
  //     break;
  //     case Mode.MOVE: type="move";
  //     break;
  //     case Mode.TEXT: type="i-beam";
  //     break;
  //     case Mode.WAIT: type="wait";
  //     break;
  //     case Mode.ARROW:
  //     default: type="arrow";
  //   }
  //   this._cursorMode=type;
  // }
  // noCursor(){
  //   this._cursorMode=null;
  // }
  colorMode(mode){
    this._saveState("_colorMode");
    this._colorMode=mode;
  }
  
  ellipseMode(mode){
    this._saveState("_ellipseMode");
    this._ellipseMode=mode;
  }
  
  imageMode(mode){
    this._saveState("_imageMode");
    this._imageMode=mode;
  }
  
  rectMode(mode){
    this._saveState("_rectMode");
    this._rectMode=mode;
  }
  
  beginShape(mode=1){
    this._shapeMode=mode;
  }
  
  applyMatrix(a=1,b=0,c=0 ,d=1,e=0,f=0){
    this._makeChange('setTransform',[a,b,c,d,e,f],true);
  }
  
  resetMatrix(){
    this._makeChange('setTransform',[1,0,0,1,0,0],true);
  }
  
  rotate(ang){
    let isRadian=this._angleMode===Mode.RADIANS;
    const scale=math.cos(ang, isRadian);
    const shear=math.sin(ang, isRadian);
    this._makeChange('transform',[scale,shear,-shear,scale,0,0],true);
  }
  
  scale(vecX, vecY){
    vecY=vecY || vecX;
    this._makeChange('transform',[vecX,0,0,vecY,0,0],true);
  }
  
  shearX(ang){
    let isRadian=this._angleMode===Mode.RADIANS;
    this._makeChange('transform',[1,0,math.tan(ang,isRadian),1,0,0],true);
  }
  
  shearY(ang){
    let isRadian=this._angleMode===Mode.RADIANS;
    this._makeChange('transform',[1,-math.tan(ang,isRadian),0,1,0,0],true);
  }
  
  translate(x,y){
    this._makeChange('transform',[1,0,0,1,x,y],true);
  }
  
  push(){
    if(this.__pendingApply) this.applyState();
    const ctx=this.context;
    ctx.save();
    this.savedStates.push({});
  }
  
  pop(){
    const ctx=this.context;
    ctx.restore();
    if(this.savedStates.length){
      Object.assign(this, this.savedStates.pop());
    }
  }
  // setState(val){
  //   let changes;
  //   if(val.constructor===Function){
  //     let lst=Object.assign({},this);
  //     changes=val(lst);
  //   }else if(val.constructor===Object){
  //     changes=val;
  //   }else{return false;}
  //   Object.assign(this,changes);
  // }
  
  frameRate(fps=null){
    if(fps === null || fps<1) return 1000/this.deltaTime; 
    this._fps = fps;
    if(this._isLoop){
      clearTimeout(this._loop);
      this._loop = null;
    }
  }
  
  loop(){
    this._isLoop=true;
  }
  
  noLoop(){
    this._isLoop=false;
  }
  get deltaTime(){
    return this._deltaTime;
  }
  get frameCount(){
    return this._frameCount;
  }
  get drawingContext(){
    return this.context;
  }
  get width(){
    return this.context.canvas.width;
  }
  
  get height(){
    return this.context.canvas.height;
  }
  
  get mouseX(){
    return this._eventData.mouseX;
  }
  
  get mouseY(){
    return this._eventData.mouseY;
  }
  
  get pmouseX(){
    return this._lastEventData.mouseX;
  }
  
  get pmouseY(){
    return this._lastEventData.mouseY;
  }

  get movedX(){
    return this.mouseX - this.pmouseX;
  }
  
  get movedY(){
    return this.mouseY - this.pmouseY;
  }
  
  get mouseIsPressed(){
    return !!this._eventData.mousePressed;
  }

  get keyIsPressed(){
    return !!this._eventData.keyPressed;
  }

  get key(){
    return this._eventData.key;
  }
  
  get keyCode(){
    return this._eventData.keyCode;
  }
  
  get pixels(){
    return this._pixelData?this._pixelData.data:null;
  }

  loadPixels(x = 0,y = 0,wid = null,hei = null){
    wid = wid||this.width;
    hei = hei||this.height;
    this._pixelData = this.context.getImageData(x,y,wid,hei);
    this._pixelData.loc = {x,y};
  }

  updatePixels(x=null, y=null, dw=null, dh=null){
    const pixels=this._pixelData;
    dw=dw || pixels.width;
    dh=dh || pixels.height;
    if(x==null) x=pixels.loc.x;
    if(y==null) y=pixels.loc.y;
    this.context.putImageData(this._pixelData, x, y, 0, 0, dw, dh);
    this._pixelData=null;
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

module.exports=State;