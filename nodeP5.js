let nativeCanvas=require("native-canvas");
///////////
///closing native-canvas default window
window.close();
let safe={
  confirm,
  alert,
  global,
  clearInterval,
  clearTimeout,
  setInterval,
  setTimeout,
  queueMicrotask,
  clearImmediate,
  setImmediate
};
/////////////
//deleteing props that  are useless for NodeP5
for(let i in global){
  if(!safe[i]){
    global[i]=null;
    delete global[i];
  }
}
let constants={
  BASELINE:'alphabetic',
  BEVEL:'bevel',
  BOTTOM:'bottom',
  CENTER:'center',
  CHORD:'chord',
  CORNER:'corner',
  CORNERS:'corners',
  HALF_PI:1.5707963267948966,
  LEFT:'left',
  MITER:'miter',
  OPEN:'open',
  PIE:'pie',
  PROJECT:'square',
  QUARTER_PI:0.7853981633974483,
  RADIUS:'radius',
  RIGHT:'right',
  ROUND:'round',
  SQUARE:'butt',
  TAU:6.283185307179586,
  TOP:'top',
  TWO_PI:6.283185307179586
},
////////////
// for use in develeopment only,, as string matching might cause high processing usage;
constantCode={
  "alphabetic":0,
  "bevel":1,
  "bottom":2,
  "center":3,
  "chord":4,
  "corner":5,
  "corners":6,
  "left":7,
  "miter":8,
  "open":9,
  "pie":10,
  "square":11,
  "radius":12,
  "right":13,
  "butt":14,
  "top":15
}
,
////////////
///getters that are avialable global in your sketch
variables={
  frameCount(){
    return this.frames;
  },
  deltaTime(){
    return this.deltaT;
  },
  width(){
    return this.width;
  },
  height(){
    return this.height;
  },
};
//////////
//Matrix 2d for matrix based methods
class Matrix2D extends Array{
  constructor(a=0,b=0,c=0,d=0){
    super();
    this.length=2;
    this[0]=[a, b];
    this[1]=[c, d];
  }
  add(mat){
    if(mat.constructor!==Matrix2D) return;
    return new Matrix2D(
      this[0][0]+mat[0][0], this[0][1]+mat[0][1],
      this[1][0]+mat[1][0], this[1][1]+mat[1][1]
      );
    }
  sub(mat){
    if(mat.constructor!==Matrix2D) return;
    return new Matrix2D(
      this[0][0]-mat[0][0], this[0][1]-mat[0][1],
      this[1][0]-mat[1][0], this[1][1]-mat[1][1]
      );
    }
  mult(mat){
    if(mat.constructor===Number) return new Matrix2D(
      this[0][0]*mat,this[0][1]*mat,
      this[1][0]*mat,this[1][1]*mat
      );
    if(mat.constructor!==Matrix2D) return;
    return new Matrix2D(
      this[0][0]*mat[0][0]+this[0][1]*mat[1][0], this[0][0]*mat[0][1]+this[0][1]*mat[1][1],
      this[1][0]*mat[0][0]+this[1][1]*mat[1][0], this[1][0]*mat[0][1]+this[1][1]*mat[1][1]
      );
    }
  div(mat){
    if(mat.constructor===Number) return new Matrix2D(
      this[0][0]/mat,this[0][1]/mat,
      this[1][0]/mat,this[1][1]/mat
      );
    else return;
  }
}



class Vector{
  constructor(x=0,y=0){
    this.x=x;
    this.y=y;
  }
  static createVector(x=0,y=0){
    return new Vector(x,y);
  }
  set(x,y){
    if(x.constructor==Array){
      this.x=x[0];
      this.y=x[1];
    }else if(x.constructor==Vector){
      this.x=x.x;
      this.y=x.y;
    }else{
      this.x=x;
      this.y=y;
    }
    return this;
  }
  copy(){
    return new Vector(this.x,this.y);
  }
  add(x,y={}){
    if(x.constructor==Number && y.constructor==Number){
      this.x+=x;
      this.y+=y;
    }else if(x.constructor==Vector){
      this.x+=x.x;
      this.y+=x.y;
    }
    return this;
  }
  sub(x,y={}){
    if(x.constructor==Number && y.constructor==Number){
      this.x-=x;
      this.y-=y;
    }else if(x.constructor==Vector){
      this.x-=x.x;
      this.y-=x.y;
    }
    return this;
  }
  mult(x){
    if(x.constructor==Number){
      this.x*=x;
      this.y*=x;
      return this;
    }else if(x.constructor==Vector){
      this.x*=x.x;
      this.y*=x.y;
    }
    return this;
  }
  rem(x,y){
    if(x.constructor==Number && y.constructor==Number){
      this.x%=x;
      this.y%=y;
      return this;
    }else if(x.constructor==Vector){
      this.x%=x.x;
      this.y%=x.y;
    }
    return this;
  }
}

class Renderer{
  ////////////
  ///decides whatever to stroke/fill
  static ctxStyle(){
    if(this.isFill){
      this.ctx.fill();
    }
    if(this.isStroke){
      this.ctx.stroke();
    }
  }
  static applyDefaultStyle(){
    let ctx=this.ctx;
    ctx.fillStyle=this._fillStyle;
    ctx.strokeStyle=this._strokeStyle;
    ctx.font=`${this._fontSize}px ${this._font}`;
    ctx.lineCap=this._lineCap;
    ctx.lineJoin=this._lineJoin;
  }
  //////////////
  ///default style variables
  Renderer(){
    //default styling
    this.isFill=true;
    this._fillStyle='#fff';
    this._font='sans';
    this._fontSize=12;
    this.isStroke=true;
    this._strokeStyle='#000';
    this._lineCap='round';
    this._lineJoin='miter';
    this._lineWidth=1;
    this._rectMode='corner';
    this._ellipseMode='center';
    Renderer.ctxStyle=Renderer.ctxStyle.bind(this);
    Renderer.applyDefaultStyle.call(this);
  }

  ///////
  //2d shapes
  static ellipseModer(mod,a,b,c,d){
    ///////////
    // mode ----> code
    // center     3   
    // radius     12
    // corner     5
    // corners    6
    mod=constantCode[mod];
    if(mod==3) return [a,b,c,d];
    if(mod==12) return [a,b,c*2,d*2];
    if(mod==5) return [a-(-c),b-(-d),c,d];
    if(mod==6){
      let x,y,r,s;
      if(c-a<0){
        r=a-c; x=c+r/2;
      }else{
        r=c-a; x=a+r/2;
      }
      if(d-b<0){
        s=b-d;y=d+s/2;
      }else{
        s=d-b;y=b+s/2;
      }
      return [x, y, r, s];
    }
    console.log('unknown ellipseMode falling back to default!!');
    return [a,b,c,d]; 
  }
  arc(cx,cy,w,h,start,end,mod){
    ///////////
    // mode ----> code
    // pie        10   
    // chord      4
    // open       9
    // 
    mod=constantCode[mod];
    [cx,cy,w,h]=Renderer.ellipseModer(
                        this._ellipseMode,
                        cx,cy,w,h);
    let ctx=this.ctx;
    ctx.beginPath();
    if(mod==undefined){
      if(this.isFill){
        ctx.moveTo(cx, cy);
        ctx.ellipse(cx,cy,w/2,h/2,0,start,end);
        ctx.closePath();
        ctx.fill();
      }if(this.isStroke){
        ctx.beginPath();
        ctx.ellipse(cx,cy,w/2,h/2,0,start,end);
        ctx.stroke();
      }
    }else{
      if(mod==10) ctx.moveTo(cx,cy);
      ctx.ellipse(cx,cy,w/2,h/2,0,start,end);
      if(mod==10 || mod==4) ctx.closePath();
      Renderer.ctxStyle();
    }
    ctx.beginPath();
  }
  ellipse(cx,cy,radx,rady){
    [cx,cy,radx,rady]=Renderer.ellipseModer(
                        this._ellipseMode,
                        cx,cy,radx,rady);
    let ctx=this.ctx;
    ctx.beginPath();
    ctx.ellipse(cx,cy,radx/2,rady/2,0,0,44/7);
    Renderer.ctxStyle();
    ctx.beginPath();
  }
  circle(cx,cy,rad){
    [cx,cy,rad]=Renderer.ellipseModer(
                        this._ellipseMode,
                        cx,cy,rad,rad);
    let ctx=this.ctx;
    ctx.beginPath();
    ctx.arc(cx,cy,rad/2,0,44/7);
    Renderer.ctxStyle();
    ctx.beginPath();
  }
  line(cx, cy, tx, ty){
    let ctx=this.ctx;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(tx, ty);
    Renderer.ctxStyle();
    ctx.beginPath();
  }
  point(x,y){
    let ctx=this.ctx;
    ctx.beginPath();
    let tmp=this._lineWidth;
    ctx.lineWidth=tmp/2;
    ctx.arc(x,y,ctx.lineWidth/2,0,44/7);
    ctx.strokeStyle=this._strokeStyle;
    if(this.isStroke) ctx.stroke();
    ctx.lineWidth=tmp;
    ctx.beginPath();
  }
  quad(x1,y1,x2,y2,x3,y3,x4,y4){
  let ctx=this.ctx;
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.lineTo(x3,y3);
    ctx.lineTo(x4,y4);
    ctx.lineTo(x1,y1);
    Renderer.ctxStyle();
    ctx.beginPath(); 
  }
  ////////////
  //rectModer==> for rectMode  
  static rectModer(mod,a,b,c,d){
    ///////////
    // mode ----> code
    // center     3   
    // radius     12
    // corner     5
    // corners    6
    mod=constantCode[mod];
    if(mod==3) return [a-(c/2),b-(d/2),c,d];
    if(mod==12) return [a-c,b-d,c*2,d*2];
    if(mod==5) return [a,b,c,d];
    if(mod==6){
      let x,y,w,h;
      if(c-a<0){
        w=a-c; x=c;
      }else{
        w=c-a;x=a;
      }
      if(d-b<0){
        h=b-d;y=d
      }else{
        h=d-b;y=b;
      }
      return [x, y, w, h];
    }
    console.log('unknown rectMode falling back to default!!');
    return [a,b,c,d]; 
  }
  ///////////
  rect(cx,cy,w,h,tl=0,tr=null,br=null,bl=null){
    if(tl<0) throw 'radius can\'t be negative';
    if(h==undefined){h=w;}
    [cx,cy,w,h]=Renderer.rectModer(
                        this._rectMode,
                        cx,cy,w,h);
    w=w<0?-w:w;
    h=h<0?-h:h;
    if(tr==null){tr=br=bl=tl;}
    let min=(w>h?h:w)/2;
    tl=tl>min?min:tl; tr=tr>min?min:tr;
    bl=bl>min?min:bl; br=br>min?min:br;

    let ctx=this.ctx;
    ctx.beginPath();
    ctx.moveTo(cx+w/2,cy);
    ctx.arcTo(cx+w, cy, cx+w, cy+h/2, tr);
    ctx.arcTo(cx+w, cy+h, cx+w/2, cy+h, br);
    ctx.arcTo(cx, cy+h, cx, cy+h/2, bl);
    ctx.arcTo(cx, cy, cx+w/2, cy, tl);
    ctx.lineTo(cx+w/2,cy);
    Renderer.ctxStyle();
    ctx.beginPath();
  }
  square(cx,cy,s,tl=0,tr=null,br=null,bl=null){
    [cx,cy,s]=Renderer.rectModer(
                        this._rectMode,
                        cx,cy,s,s);
    s=s<0?-s:s;
    if(tr==null){tr=br=bl=tl;}
    let min=s/2;
    tl=tl>min?min:tl; tr=tr>min?min:tr;
    bl=bl>min?min:bl; br=br>min?min:br;
    let ctx=this.ctx;
    ctx.beginPath();
    ctx.moveTo(cx+min,cy);
    ctx.arcTo(cx+s, cy, cx+s, cy+min, tr);
    ctx.arcTo(cx+s, cy+s, cx+min, cy+s, br);
    ctx.arcTo(cx, cy+s, cx, cy+min, bl);
    ctx.arcTo(cx, cy, cx+min, cy, tl);
    ctx.lineTo(cx+min,cy);
    Renderer.ctxStyle();
    ctx.beginPath();
  }
  triangle(x1,y1,x2,y2,x3,y3){
  let ctx=this.ctx;
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.lineTo(x3,y3);
    ctx.closePath();
    Renderer.ctxStyle();
    ctx.beginPath();  
  }
/////////////////
///curves --> bezier, quadratic
  bezier(x1, y1, x2, y2, x3, y3, x4, y4){
    let ctx=this.ctx;
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.bezierCurveTo(x2, y2, x3, y3, x4, y4);
    Renderer.ctxStyle();
    ctx.beginPath();
  }
  // curve(x1, y1, x2, y2, x3, y3, x4, y4){
  //   let ctx=this.ctx;
  //   ctx.beginPath();
  //   ctx.moveTo(x2,y2);
  //   ctx.bezierCurveTo(x1, y1, x4, y4, x3, y3);
  //   Renderer.ctxStyle();
  //   ctx.beginPath();
  // }
/////////////
//draw image
  image(img, sx, sy, sw, sh, dx=null, dy=null, dw=null, dh=null){
    if(sw==undefined || sh==undefined){
      sw=img.width;
      sh=img.height;
    }
    if(dx==null || dy==null || dw==null || dh==null){
      this.ctx.drawImage(img, sx, sy, sw, sh);
    }else{
      this.ctx.drawImage(img, dx, dy, dw, dh, sx, sy, sw, sh);
    }
  }

/////////////
// Typography
    text(txt,x,y,x2,y2){
      let ctx=this.ctx;
      let width=ctx.measureText(txt).width;
      ctx.beginPath();
      if(this.isStroke){
        ctx.strokeStyle=this._strokeStyle;
        ctx.strokeText(txt,x,y);
      }
      if(this.isFill){
        ctx.fillStyle=this._fillStyle;
        ctx.fillText(txt,x,y);
      }
      ctx.beginPath();
    }
    textAlign(align,baseline){
      this.ctx.textAlign=this._textAlign=align;
      this.ctx.textBaseline=this._textBaseline=baseline=='center'?'middle':baseline;
    }
    textFont(font,size){
      this._font=font;
      this._fontSize=size;
      this.ctx.font=`${size}px ${font}`;
    }
    textSize(size){
      this.ctx.font=`${size}px ${this._font}`;
    }
/////////////
///canvas stroke, fill style
  background(color){
    this.ctx.save();
    // this.transform
    this.ctx.fillStyle=color;
    this.ctx.fillRect(0,0,this.width,this.height);
    this.ctx.beginPath();
    this.ctx.restore();
  }
  clear(){
    this.ctx.save();
    this.ctx.clearRect(0,0,this.width,this.height);
    this.ctx.beginPath();
    this.ctx.restore();
  }
  fill(style){
    this.ctx.fillStyle=this._fillStyle=style;
    this.isFill=true;
  }
  noFill(){
    this.isFill=false;
  }
  noStroke(){
    this.isStroke=false;
  }
  pop(){
    this.ctx.restore();
  }
  push(){
    this.ctx.save();
  }
  stroke(style){
    this.ctx.strokeStyle=this._strokeStyle=style;
    this._stroke=true;
  }
  strokeCap(type){
    this.ctx.lineCap=this._lineCap=type;
  }
  strokeJoin(type){
    this.ctx.lineJoin=this._lineJoin=type;
  }
  strokeWeight(wei){
    this.ctx.lineWidth=this._lineWidth=wei;
  }
  ///////////
  ///rectanges modes CENTER, CENTERS, RADIUS etc.
  rectMode(mode){
    this._rectMode=mode;
  }
  ellipseMode(mode){
    this._ellipseMode=mode;
  }
}

class P5Math{
  random(from=1, to=null){
    if(to==null){
      to=from;
      from=0;
    }
    return from+Math.random()*(to-from);
  }
  lerp(from,to,per=1){
    return from+(to-from)*per;
  }
  int(val){
    return Math.floor(val);
  }
  str(val){
    return String(val);
  }
  boolean(val){
    return !!val;
  }
  radians(deg){
    return deg*(PI/180);
  }
  degrees(rad){
    return rad*(180/PI);
  }

}
////////////////
//color


/////////
////Color manage



function NodeP5(){
  //////////
  //main class for nodeP5
  this.title="canvas";
  this.newCreated=false; 
  let width=1280;
  let height=720;
  ////////
  //creating default window for nodep5
  this.window=nativeCanvas.createWindow({width,height,resizable:false,title:this.title,fitCanvasInWindow:true});
  this.ctx=this.window.canvas.getContext("2d");
 
  Object.defineProperties(this,{
    width:{get(){return this.window.size.w}},
    height:{get(){return this.window.size.h}}
  });

  this.loop=null;
  this.isLoop=true;
  this.isDrawLoaded=false;///decides whatever the draw function is executed or not;
  this.fps=60;
  
  this.setup=function(){};
  this.draw=function(){};
  
  Renderer.prototype.Renderer.call(this); ///adding Renderer props to our main class
  this.window.center();  ///center the window;
  this.frames=0;
  this.deltaT=0;  ////calcalating deltaTime

  NodeP5.draw=NodeP5.draw.bind(this);  ///binding static method to this
  }

NodeP5.prototype=Object.create(Renderer.prototype);
NodeP5.prototype.constructor=NodeP5;

NodeP5.draw=function(){
    this.isDrawLoaded=true;
    let lst=Date.now();
    this.loop=setInterval(()=>{
      let tmp=Date.now();
      this.deltaT=tmp-lst;
      lst=tmp;
      ++this.frames;
      if(!this.isLoop) clearInterval(this.loop);
      else this.draw();
    },1000/this.fps);
    if(!this.isLoop) this.draw();
};
NodeP5.prototype.exit=function(){
  process.exit();
}
NodeP5.prototype.createCanvas=function(w, h, title){
  this.window.destroy();
  title=title || this.title;
  this.window=nativeCanvas.createWindow({width:w,height:h,resizable:false,title,fitCanvasInWindow:true});
  this.window.center();
  this.ctx=this.window.canvas.getContext("2d");
  this.newCreated=true;
}
NodeP5.prototype.reqFullScreen=function(isF){
    if(isF===undefined) return !!this.window.fullScreen;
    this.window.fullScreen=!!isF;
    if(!this.isLoop) setTimeout(NodeP5.draw,1);
    return !!isF;
  }

NodeP5.prototype.print=function(...text){
  console.log(...text);
}
NodeP5.prototype.loadImage=function(path,cb=null){
  path=this.window.loadImage(path);
  if(cb){
    path.then(cb);
  }else{
    return path;
  }
}
NodeP5.prototype.isLooping=function(){
  return this.isLoop;
}
NodeP5.prototype.noLoop=function(){
  this.isLoop=false;
}
NodeP5.prototype.frameRate=function(fps=null){
  if(fps===null || fps===0) return this.isLoop?1000/this.deltaT:0;
  this.fps=fps;
  this.isLoop=true;
  if(this.isDrawLoaded){
    clearInterval(this.loop);
    NodeP5.draw();
  }
}
// NodeP5.prototype.loadFont=async function(file){
//   let font=require();
// }

NodeP5.prototype.init=function(){
  for(let prop in NodeP5.prototype){
    if(NodeP5.prototype[prop].constructor!==Function) continue;
    NodeP5.prototype[prop]=NodeP5
          .prototype[prop].bind(this);
  }
  Object.assign(global,NodeP5.prototype);

let desc=Object.getOwnPropertyDescriptors(Renderer.prototype);
 for(let prop in desc){
    // console.log(prop);
    if(prop!=='constructor'){
    let obj=desc[prop];obj.enumerable=true;
    Object.defineProperty(Renderer.prototype,prop,obj)
    Renderer.prototype[prop]=Renderer
          .prototype[prop].bind(this);
      }
  }
  Object.assign(global, Renderer.prototype);

  Object.defineProperties(global,
Object.getOwnPropertyDescriptors(Math));

  desc=Object.getOwnPropertyDescriptors(P5Math.prototype);
 for(let prop in desc){
    if(prop!=='constructor'){
    let obj=desc[prop];obj.enumerable=true;
    Object.defineProperty(P5Math.prototype,prop,obj);
      }
  }
  Object.assign(global, P5Math.prototype);
  Object.assign(global, constants);
///global variables///
  for(let variable in variables){
    let geter=variables[variable].bind(this);
    Object.defineProperty(global, variable,{
      get:geter,
    });
  }
////////
}
NodeP5.prototype.run=async function({setup, draw, preload={}}={}){
  this.setup= setup || this.setup;
  this.draw= draw || this.draw;
  if(typeof preload == 'function'){

    if(!this.newCreated){
    this.init();
    this.newCreated=false;
    await preload();
    this.setup();
  }
  NodeP5.draw();
  
  }else{
    if(!this.newCreated){
    this.init();
    this.newCreated=false;
    this.setup();
  }
  NodeP5.draw();  
  
  }

  
}
let samP5=new NodeP5();
module.exports=samP5.run.bind(samP5);