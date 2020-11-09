const engine=require("./../../node-sdl-canvas");
class Image{
  constructor(width, height){
    const image=engine.createImageData(width, height);
    this._pixels=image.data;
    this._width=width;
    this._height=height;
  }
  static createImage(wid, hei){
    return new Image(wid, hei);
  }
  get width(){
    return this._width;
  }
  get height(){
    return this._height;
  }
  get pixels(){
    return this._pixels;
  }
}