const Renderer=require("./rendering/renderer");

function makeGlobal(obj, bindTo){
  const props=Object.getOwnPropertyNames(obj);
  for(let prop of props){
    if(prop==="constructor") continue;
    if(bindTo && obj[prop].constructor===Function){
      global[prop]=obj[prop].bind(bindTo);
    }else{
      global[prop]=obj[prop]
    }
  }
}

{
  const setup=global.setup || function(){}
  const draw=global.draw || function(){}
  let intrRen=new Renderer(1280, 720);
  makeGlobal(intrRen.mode);
  makeGlobal(Object.getPrototypeOf(intrRen.state), intrRen.state);
  makeGlobal(Object.getPrototypeOf(intrRen.shapes), intrRen.shapes);
  makeGlobal(Object.getPrototypeOf(intrRen.math), intrRen.math);
  setup();
  function _draw(){
    draw();
    intrRen.draw();
    setTimeout(_draw,1000/30);
  }
  _draw();
}
