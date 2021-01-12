const fs=require("fs");
let res;
preload=function(){
  res=loadStrings("http://cdnjs.cloudflare.com/ajax/libs/p5.js/1.2.0/addons/p5.sound.js");
}
setup=function(){
  noLoop();
  // frameRate(1);
  // noStroke();
  // colorMode(HSL);
  angleMode(DEGREES);
}
let st=0,end;
draw=function(){
  background(255);
  stroke(50);
  strokeWeight(6);
  strokeCap(ROUND);
  // for(let ang=0;ang<=width;ang+=12){
  //   line(ang,height/2,ang, height/2 + (sin(ang)+cos(ang*2))*100);
  // }
  textFont("fira code");
  textSize(25);
  noStroke();
  fill();
  // console.log(frameRate());
  // if(res){
    // image(res,0,0);
    // console.log(res);
    // let ind=0;
    end=st+27;
    // st=abs(st);
    // console.log(res);
    for(let i=st;i<end;i++){
      text((i+1)+"| "+(res[i]||"."), 0, 100+(i-st)*32);
    }
  // }
}
mouseWheel=function(eve){
  if(eve.deltaY<0){
    st++;
    if(st+10>res.length) st=res.length-10;
  }
  else if(eve.deltaY>0){
    st--;
    if(st<0) st=0;
  }else{
    return
  }
  redraw();
}
require("./");