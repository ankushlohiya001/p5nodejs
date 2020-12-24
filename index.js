const Renderer=require("./rendering/renderer");
const {performance}=require("perf_hooks");
function makeGlobal(obj, bindTo){
  const props = Object.getOwnPropertyNames(obj);
  for(let prop of props){
    if(prop === "constructor") continue;
    if(bindTo && obj[prop].constructor === Function){
      global[prop] = obj[prop].bind(bindTo);
    }else{
      global[prop] = obj[prop]
    }
  }
}

{
  const setup = global.setup || function(){}
  const draw = global.draw || function(){}
  const mousePressed = global.mousePressed || function(){}
  const keyPressed = global.keyPressed || function(){}
  const keyTyped = global.keyTyped || function(){}
  const mouseReleased = global.mouseReleased || function(){}
  const keyReleased = global.keyReleased || function(){}
  const mouseWheel = global.mouseWheel || function(){}
  const mouseDragged = global.mouseDragged || function(){}
  const intrRen = new Renderer(1280, 720);
  const events = {
    mousex:0,
    mousey:0,
    key:null,
    keyCode:null
  };
  const drState = {fps:30, loop:null, frames:0, pixels:null, updateNeeded:false};
  makeGlobal(intrRen.mode);
  Object.defineProperties(global,{
    mouseX:{
      get(){return events.mousex;}
    },
    mouseY:{
      get(){return events.mousey;}
    },
    key:{
      get(){return events.key;}
    },
    keyCode:{
      get(){return events.keyCode;}
    },
    width:{
      get(){return intrRen.width;}
    },
    height:{
      get(){return intrRen.height;}
    },
    frameCount:{
      get(){return drState.frames;}
    },
    pixels:{
      get(){return drState.pixels?drState.pixels.data:null;}
    },
    frameRate:{
      value:function (fps=null){
        if(fps === null || fps<1) return drState.fps; 
        drState.fps = fps;
        if(loop){
          clearTimeout(loop);
          loop = null;
        }
      }
    },
    loop:{
      value:function(){
        drState.loop = true;
      }
    },
    noLoop:{
      value:function(){
        drState.loop = null;
      }
    },
    // redraw:{
    //   value:function(){
    //     drState.updateNeeded=true;
    //   }
    // },
    quit:{
      value:function(){
        intrRen.exit();
      }
    },
    loadPixels:{
      value:function(x = 0,y = 0,wid = null,hei = null){
        wid = wid||intrRen.width;
        hei = hei||intrRen.height;
        drState.pixels = intrRen.getPixels(x,y,wid,hei);
        drState.pixels.loc = {x,y};
      }
    },
    updatePixels:{
      value:function(x=null, y=null, dw=null, dh=null){
        const pixels=drState.pixels;
        dw=dw || pixels.width;
        dh=dh || pixels.height;
        if(x==null) x=pixels.loc.x;
        if(y==null) y=pixels.loc.y;
        intrRen.updatePixels(drState.pixels, x, y, 0, 0, dw, dh);
        drState.pixels=null;
      }
    }
  });

  // /***apply when event latency issue solved */
  //
  // function renderWithoutLoop(eveFn){
  //   return function(eve){
  //     eveFn(eve);
  //     if(drState.loop==null) intrRen.draw();
  //   }
  // }

  makeGlobal(Object.getPrototypeOf(intrRen.state), intrRen.state);
  makeGlobal(Object.getPrototypeOf(intrRen.shapes), intrRen.shapes);
  makeGlobal(Object.getPrototypeOf(intrRen.math), intrRen.math);
  intrRen.window.on("mousemove",(eve)=>{
    events.mousex = eve.clientX;
    events.mousey = eve.clientY;
  });
  intrRen.window.on("keypress",(eve)=>{
    events.key = eve.key;
    events.keyCode = eve.keyCode;
    keyPressed(eve);
  });
  intrRen.window.on("exit",()=>{
    console.log("process exited successfully!!");
  });
  intrRen.window.on("mousedown",mousePressed);
  intrRen.window.on("mouseup",mouseReleased);
  intrRen.window.on("keyinput",keyTyped);
  intrRen.window.on("keyup",keyReleased);
  intrRen.window.on("wheel",mouseWheel);
  intrRen.window.on("drag",mouseDragged);
  setup();
  function _draw(){
    // if(!drState.updateNeeded) return;
    // console.log(5);
    const pre = performance.now();
    intrRen.state.push();
    draw();
    intrRen.state.pop();
    intrRen.draw();
    drState.frames++;
    const diff = performance.now() - pre;
    const delay = Math.max(1000/drState.fps - diff,0);
    // console.log(delay===0?drState.fps-(drState.fps - diff/1000):1000/delay);
    // drState.updateNeeded=false;
    if(drState.loop) drState.loop = setTimeout(_draw, delay);
  }
  _draw();
}
