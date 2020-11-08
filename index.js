// let color=require("./color");
let mode=require("./constants");
// let engine=require("node-sdl-canvas");
// let win=engine.createWindow({
//   title:"node-sdl-canvas",
//   width:1280,height:720
// });
// // let canvas=require("canvas").createCanvas(1280,720);
// let canvas=win.canvas;
// let ctx=canvas.getContext('2d');
// // let size=1280/360;
// // ctx.lineWidth=4;

// // ctx.arc(200,200,2,0,44/7);
// // ctx.stroke();
// // let ang=radians(45);
// // ctx.setTransform(1,Math.tan(0),Math.tan(0), 1,200,200);
// // ctx.strokeRect(-100,-50,200,100);
// // ctx.setTransform(1,-Math.tan(radians(30)),Math.tan(radians(0)), 1,200,200);
// // // ctx.beginPath();
// // // ctx.lineWidth=4;
// // // let rad=radians(30);
// // // ctx.rotate(rad);
// // // console.log(Math.sin(rad),Math.cos(rad));
// // console.log(ctx.currentTransform);
// // ctx.strokeRect(-100,-50,200,100);
// // engine.renderFrame();

let Renderer=require("./rendering/renderer");

let renderer=new Renderer(1280,720,true);

renderer.state.angleMode(mode.DEGREES);

renderer.state.fill(null,"beige");
renderer.state.stroke(null,"red");
renderer.state.strokeWeight(20);
renderer.state.strokeCap(mode.ROUND);
renderer.state.applyState(renderer._context);
renderer._context.moveTo(100,100);
renderer._context.lineTo(400,100);
renderer.state.applyEffect(renderer._context);
// renderer.win.canvasWidth=480;
// renderer.win.size={w:480,h:320};

// function loop(){
renderer.draw();
// console.log(renderer.win);
// setTimeout(loop,1000/10);
// }
// loop();
// renderer.render();
// renderer.state.blendMode(mode.OVERLAY);
// console.log(renderer.win.canvasWidth);
