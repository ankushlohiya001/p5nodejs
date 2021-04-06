// const envObj={
// };
const Mode=require("./../constants");
class Runvironment{
	constructor(win){
		this.window=win;
	}
	print(...params){
		console.log(...params);
	}
	after(seconds, dothis, ...params){
		setTimeout(dothis, seconds*1000, ...params);
	}
	alert(mess){
    return this.window.alert(mess);
  }
  confirm(mess){
   	return this.window.confirm(mess);
  }
  fullscreen(tog){
  	return this.window.fullscreen(tog);
  }
  grab(){
  	this.window.grab(true);
  }
  noGrab(){
  	this.window.grab(false);
  }
  cursor(mode){
  	let type="";
  	switch(mode){
      case Mode.CROSS: type="crosshair";
      break;
      case Mode.HAND: type="hand";
      break;
      case Mode.MOVE: type="move";
      break;
      case Mode.TEXT: type="i-beam";
      break;
      case Mode.WAIT: type="wait";
      break;
      case Mode.ARROW:
      default: type="arrow";
    }
    this.window.showCursor(true);
    this.window.setCursor(type);
  }
  noCursor(){
  	this.window.showCursor(false);
  }
  exit(){
  	this.window.exit();
  }
  showBorder(tog){
  	this.window.border=!!tog;
  }
  setPosition(lox, loy){
  	this.window.position=[lox, loy];
  }
}
module.exports=Runvironment;