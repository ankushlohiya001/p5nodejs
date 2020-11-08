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
    _rectMode: Mode.CORNER
  };
  static create(){
    return new State();
  }
  constructor(){
    this.loadDefaults();
    this.text={size:16,font:'sans-serif'};
    this.changes={};
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
  }
  applyState(ctx){
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
  }
  applyEffect(ctx){
    if(this._willStroke) ctx.stroke();
    if(this._willFill) ctx.fill();
  }
  stroke(...params){
    let col=color(...params);
    if(!this._willStroke) this._willStroke=true;
    this._makeChange('strokeStyle',col.toString());
  }
  noStroke(){
    if(this._willStroke) this._willStroke=false;
  }
  fill(...params){
    let col=color(...params);
    if(!this._willFill) this._willFill=true;
    this._makeChange('fillStyle',col.toString());
  }
  noFill(){
    if(this._willFill) this._willFill=false;
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
  get _font(){
    return `${this.text.size}px ${this.text.font}`;
  }
  textFont(font,size){
    this.text.font=font;
    if(size) this.text.size=size;
    this._makeChange('font',this._font);
  }
  textSize(size){
    this.text.size=size;
    this._makeChange('font',this._font);
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
    this._angleMode=mode;
  }
  blendMode(mode){
    this._blendMode=mode;
  }
  colorMode(mode){
    this._colorMode=mode;
  }
  ellipseMode(mode){
    this._ellipseMode=mode;
  }
  imageMode(mode){
    this._imageMode=mode;
  }
  rectMode(mode){
    this._rectMode=mode;
  }
  applyMatrix(a=1,b=0,c=0 ,d=1,e=0,f=0){
    this._makeChange('setTransform',[a,b,c,d,e,f],true);
  }
  resetMatrix(){
    this._makeChange('setTransform',[...State.defaults._transformationMatrix],true);
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
  loadDefaults(){
    Object.assign(this,State.defaults);
  }
}

module.exports=State;