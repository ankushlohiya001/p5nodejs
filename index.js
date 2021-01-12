const Renderer=require("./rendering/renderer");
const EventManager=require("./events");
const Mode=require("./constants");
const math=require("./math");
const Shaper=require("./shapes");
const ColorManager=require("./color");
const utils=require("./utils");

{
  const preload = global.preload || function(){};
  const setup = global.setup || function(){};
  const draw = global.draw || function(){};

  const internelRenderer = new Renderer(1280, 720);
  const eventManager=new EventManager(internelRenderer);
  const shaper=new Shaper(internelRenderer);
  const makeGlobal=utils.makeGlobal;

  makeGlobal(Mode);
  makeGlobal(ColorManager);
  makeGlobal(utils.globals);
  makeGlobal(Object.getPrototypeOf(math), math);
  makeGlobal(Object.getPrototypeOf(internelRenderer.state), internelRenderer.state);
  makeGlobal(Object.getPrototypeOf(shaper), shaper);

  math.setState(internelRenderer.state);

  eventManager.applyAllEvents();
  
  internelRenderer.setDrawFuns(draw);

  (async function(){
    await new Promise(res=>{
      preload();
      let lop=setInterval(()=>{
        if(utils.pendingLoads<=0){
          clearInterval(lop);
          res();
        }
      },10);
    });
    setup();
    internelRenderer.loop();
  })();
  // setup();
  makeGlobal(Renderer.globals, internelRenderer)
}
