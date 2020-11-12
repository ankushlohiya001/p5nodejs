const {color}=require("./../color");
const Mode=require("./../constants");
const math=require("./../math");
class State{
  static defaults={
    _willStroke: true,
    _willFill: true,
    _angleMode: Mode.RADIANS,
    _blendMode: Mode.BLEND,
    _colorMode: Mode.RGB,
    _ellipseMode: Mode.CENTER,
    _imageMode: Mode.CORNER,
    _rectMode: Mode.CORNER,
    _arcMode: Mode.OPEN
  }
  static create(ctx){
    return new State(ctx);
  }
  constructor(ctx){
    this.context=ctx;
    this._loadDefaults();
    this.text={size:16,font:'sans-serif'};
    this.changes={};
    this.__applyPending=false;
    this.savedStates=[];
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
    if(!this.__applyPending) this.__applyPending=true;
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
    this.__applyPending=false;
  }
  applyEffect(){
    const ctx=this.context;
    if(this._willFill) ctx.fill();
    if(this._willStroke) ctx.stroke();
  }
  stroke(...params){
    const col=color(this._colorMode, ...params);
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
    const col=color(this._colorMode, ...params);
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

  fill(...params){
    const col=color(this._colorMode, ...params);
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
      // default: return;
    }
    switch(vAlign){
      case Mode.TOP: vAlign="top";
      break;
      case Mode.BOTTOM: vAlign="bottom";
      break;
      case Mode.CENTER: vAlign="center";
      break;
      case Mode.BASELINE: vAlign="alphabetic";
      break;
      default: return;
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
    this._saveState("_blendMode");
    this._blendMode=mode;
  }
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
    if(this.__applyPending) this.applyState();
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
  _loadDefaults(){
    Object.assign(this,State.defaults);
  }
}

module.exports=State;