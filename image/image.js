const engine=require("./../../node-sdl-canvas");
class Image{
  constructor(src){
    this._surface=null;
    this._src=src;
    this._width=0;
    this._height=0;
    this._onLoadEve=function(){}
    this._onErrEve=function(){}
  }
  get width(){
    return this._width;
  }
  get height(){
    return this._height;
  }
  get src(){
    return this._src;
  }
  get surface(){
    return this._surface;
  }
  get isLoaded(){
    return this._surface!==null;
  }
  set onload(cb){
    if(isLoaded){
      cb(this);
    }else{
      this._onLoadEve=cb;
    }
  }
  set onerror(cb){
    this._onErrEve=cb;
  }
  static loadImage(buf){
    const src="";
    if(typeof buf==="string"){
      src=buf;
    }
    const img=new Image(src);
    engine.loadImage(buf).then(sur=>{
      img._surface=sur;
      this._onLoadEve();
    })
    .catch(err=>{
      this._onErrEve(err);
    })
    return img;
  }
}

module.exports=Image;