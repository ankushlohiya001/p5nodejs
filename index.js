const Renderer = require("./rendering/renderer");
const EventManager = require("./events");
const Mode = require("./constants");
const math = require("./math");
const Shaper = require("./shapes");
const colorManager = require("./color");
const utils = require("./utils");
const io = require("./io");
const Runvironment = require("./env");
const ioElems = require("./rendering/io_elems.js");
{
  const preload = global.preload || function(){};
  const setup = global.setup || function(){};
  const draw = global.draw || function(){};
  const internelRenderer = new Renderer(1280, 720);
  const eventManager=new EventManager(internelRenderer);
  const runvironment=new Runvironment(internelRenderer.window);
  const shaper=new Shaper();
  const makeGlobal=utils.makeGlobal;

  shaper.setState(internelRenderer.state);
  math.setState(internelRenderer.state);
  colorManager.setState(internelRenderer.state);
  ioElems.setState(internelRenderer.state);

  internelRenderer.setIOElementDrawFuns(ioElems.ioDrawer);
  internelRenderer.setDrawFuns(draw);

  (async function(){
    try{
      makeGlobal(io);
      
      await new Promise(res=>{
        preload();
        let lop=setInterval(()=>{
          if(io.preloadDone()){
            clearInterval(lop);
            res();
          }
        },10);
      });

      makeGlobal(Object.getPrototypeOf(runvironment), runvironment);
      makeGlobal(Mode);
      makeGlobal(colorManager);
      makeGlobal(utils.globals);
      makeGlobal(Object.getPrototypeOf(math), math);
      makeGlobal(math.constructor);
      makeGlobal(Object.getPrototypeOf(internelRenderer.state), internelRenderer.state);
      makeGlobal(Object.getPrototypeOf(shaper), shaper);
      makeGlobal(Renderer.globals, internelRenderer)
      makeGlobal(ioElems.globals);
      eventManager.applyAllEvents();

      setup();
      internelRenderer.state._incFrameCount();
      internelRenderer.loop();
    }catch(err){
      if(global.crashed) global.crashed(err);
      else{
        console.error(`->${err}`);
      }
    }
  })();
  // setup();
}
