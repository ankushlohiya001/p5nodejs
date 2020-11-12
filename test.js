// const ren=require("./rendering/renderer");
// const Mode=require("./constants");
// const math=require("./math");
// // const {loadImage}=require("./../node-sdl-canvas");
// // let {SDL_ShowCursor}=require("./../node-sdl-canvas/sdl");
// let pk=new ren(1280, 720);
// // pk.state.fill(null,"red");
// // pk.state.push();
// // pk.state.noFill();
// // pk.state.push();
// // pk.state.noStroke();
// // pk.state.stroke(null,"green");
// // pk.state.fill(null,"yellow");
// // pk.state.noFill();
// // pk.state.pop();
// const ctx=pk._context;
// // ctx.lineWidth=6;
// const radians=deg=>deg*(Math.PI/180);
// // let dat=createImageData(640, 320);
// // let size=360/(640*320*4);
// // for(let i=0;i<dat.data.length;i+=4){
// //   // dat.data[i]=Math.abs(Math.sin(radians(i*size))*255);
// //   dat.data[i]=255*((i*size)/360);
// //   dat.data[i+1]=Math.sin(radians(i*size))*255;
// //   dat.data[i+2]=((i*size/360)**3)%255;
// //   // dat.data[i+2]=0;
// //   dat.data[i+3]=255;
// // }
// // ctx.putImageData(dat,0,0);
// pk.state.fill("tomato");
// pk.state.stroke("dodgerblue");
// // pk.state.ellipseMode(Mode.CORNERS);
// // pk.shapes.circle(10, 10, 200);
// // shapes.ellipse(s);
// // pk.state.noStroke();
// pk.state.colorMode(Mode.HSL);
// // pk.state.fill(120,100,50);
// pk.state.angleMode(Mode.DEGREES);
// pk.state.rectMode(Mode.CORNERS);
// pk.state.arcMode(Mode.OPEN);
// pk.state.strokeWeight(4);
// let ang=0;
// function loop(){
//   ang%=360;

//   // pk.state.noStroke();
//   // pk.state.arcMode(Mode.PIE);
//   // pk.state.noFill();
//   // pk.shapes.line(200,200,100,100);
//   // pk.state.clear();
//   pk.shapes.rect(200,200, 200+200*math.cos(ang,false) ,200+200*math.sin(ang,false));
//   // pk.state
//   ang++;
//   // pk.shapes.arc(200,200,200,200,ang-45,ang++);
//   // pk.state.stroke("dodgerblue");
//   // pk.state.strokeJoin(Mode.ROUND);
//   // pk.shapes.triangle(300,50, 400,300, 100,600);
//   pk.draw();
//   setTimeout(loop,1000/10);
// }
// loop();
// pk.window.on("click",()=>{
//   pk.state.clear();
// })
// console.log(pk);
// pk.save("pacman.png");
// // ctx.imageSmoothingEnabled=false;

// SDL_ShowCursor(false);
// console.log(pk.canvas);

setup=function(){
  // angleMode(DEGREES);
  strokeCap(ROUND);
  arcMode(PIE);
  // rectMode(CORNERS);
  // stroke("dodgerblue");
  colorMode(HSL);
  strokeWeight(4);
  // noStroke();
  console.log(sin(90));
}
let inc=0;
draw=function(){
  inc%=360;
  clear();
  background("seagreen");
  // fill("seagreen");
  // fill(val,100,50);
  // stroke(360-val,100,50)
  noFill();
  // for(let val=0;val<360;val+=1){
  //   let cs=cos(val);
  //   let sn=sin(val);
  // }
  // inc+=10;
  // val+=1;
  // strokeWeight(1);
  // stroke("tomato");
  // noStroke();
  // translate();
}
require("./");
// // console.log(