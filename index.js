let nativeCanvas=require("native-canvas");
let strToRgba=require('color-rgba');
let grab=require('native-canvas/dist/engine/sdl/sdl/sdl-video.js').SDL_SetWindowGrab;
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
  HSB:'hsb',
  HSL:'hsl',
  LEFT:'left',
  MITER:'miter',
  OPEN:'open',
  PIE:'pie',
  PROJECT:'square',
  QUARTER_PI:0.7853981633974483,
  RADIUS:'radius',
  RGB:'rgb',
  RIGHT:'right',
  ROUND:'round',
  SQUARE:'butt',
  TAU:6.283185307179586,
  TOP:'top',
  TWO_PI:6.283185307179586,
  BLEND:'source-over',
  DARKEST:'darken',
  LIGHTEST:'lighten',
  DIFFERENCE:'difference',
  MULTIPLY:'multiply',
  EXCLUSION:'exclusion',
  SCREEN:'screen',
  REPLACE:'copy',
  OVERLAY:'overlay',
  HARD_LIGHT:'hard-light',
  SOFT_LIGHT:'soft-light',
  DODGE:'color-dodge',
  BURN:'color-burn',
  ADD:'lighter',
  REMOVE:'destination-out',
  POINTS:0,
  LINES:1,
  TRIANGLES:4,
  TRIANGLE_FAN:6,
  TRIANGLE_STRIP:5,
  QUADS:"quads",
  QUAD_STRIP:"quad_strip",
  CLOSE:"close",
  RADIANS:"radians",
  DEGREES:"degrees",
  BACKSPACE:8,
  DELETE:46,
  ENTER:13,
  RETURN:13,
  TAB:9,
  ESCAPE:27,
  SHIFT:16,
  CONTROL:17,
  OPTION:18,
  ALT:18,
  UP_ARROW:38,
  DOWN_ARROW:40,
  LEFT_ARROW:37,
  RIGHT_ARROW:39
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
  "hsb":7,
  "hsl":8,
  "left":9,
  "miter":10,
  "open":11,
  "pie":12,
  "square":13,
  "radius":14,
  "rgb":15,
  "right":16,
  "butt":17,
  "top":18,
  "quads":19,
  "quad_strip":20,
  "close":21,
  "degrees":22,
  "radians":23
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
  drawingContext(){
    return this.ctx;
  },
  pixels(){
    return this.pixelData.data;
  },
  mouseX(){
    return this.mouse.crntPos.x/this._pixelDensity;
  },
  mouseY(){
    return this.mouse.crntPos.y/this._pixelDensity;
  },
  pmouseX(){
    return this.mouse.lastPos.x/this._pixelDensity;
  },
  pmouseY(){
    return this.mouse.lastPos.y/this._pixelDensity;
  },
  movedX(){
    return this.mouse.crntPos.x-this.mouse.lastPos.x;
  },
  movedY(){
    return this.mouse.crntPos.y-this.mouse.lastPos.y;
  },
  mouseIsPressed(){
    return this.mouse.isMousePressed;
  },
  mouseButton(){
    return this.mouse.mouseButton;
  },
  keyIsPressed(){
    return this.keyboard.isKeyPressed;
  },
  key(){
    return this.keyboard.key;
  },
  keyCode(){
    return this.keyboard.keyCode;
  },
  focused(){
    return this.isFocused;
  }
};
//////////
///timing functions
function startTimer() {
   return process.hrtime();
 }

 function endTimer(time) {
   const diff = process.hrtime(time);
   return +(Math.round((diff[0] * 1e9 + diff[1]) * 0.0000010 + `e+6`)  + `e-6`);
 }

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
  /////interface static methods
  static _applyTo(glob){
    glob.Vector=Vector;
    glob.createVector=Vector.createVector;
  }
  static _validator(x,y=0){
    if(x.constructor==Array){
      return new Vector(...x);
    }
    if(x.constructor==Vector){
      return x.copy();
    }
    return new Vector(x, y);
  }
/////////
  static createVector(x=0,y=0){
    return new Vector(x,y);
  }
  constructor(x=0,y=0){
    this.x=x;
    this.y=y;
  }
  toString(){
    return `Vector: ${this.x}i + ${this.y}j`;
  }
  set(v1,v2){
    v1=Vector._validator(v1,v2);
    this.x=v1.x;
    this.y=v1.y;
    return this;
  }
  copy(){
    return new Vector(this.x, this.y);
  }
  add(x,y){
    let v1=Vector._validator(x,y);
    return this.set(this.x-(-v1.x),this.y-(-v1.y));
  }
  rem(x,y){
    let v1=Vector._validator(x,y);
    return this.set(this.x%v1.x,this.y%v1.y);
  }
  sub(x,y){
    let v1=Vector._validator(x,y);
    return this.set(this.x-v1.x,this.y-v1.y);
  }
  mult(x){
    if(x.constructor==Number) return this.set(this.x*x, this.y*x); 
    console.warn(`n is undefined,,`);
    return this.set(this.x,this.y);
  }
  div(x){
    if(x.constructor==Number) return this.set(this.x/x, this.y/x); 
    console.warn(`n is undefined,,`);
    return this.set(this.x,this.y);
  }
  mag(){
    return Math.sqrt(this.x*this.x + this.y*this.y);
  }
  magSq(){
    return this.x*this.x + this.y*this.y;
  }
  dot(v2=new Vector()){
    return this.x*v2.x + this.y*v2.y;
  }
  dist(v2){
    v2=v2.copy();
    return Math.sqrt((v2.x-this.x)**2+(v2.y-this.y)**2);
  }
  normalize(){
    let mag=this.mag();
    return this.set(this.x/mag, this.y/mag);
  }
  limit(max){
    max=Math.min(this.mag(), max);
    return this.setMag(max);
  }
  setMag(mag){
    mag=this.mag()/mag;
    return this.set(this.x/mag, this.y/mag);
  }
  heading(){
    return P5Math.prototype.atan2(this.y, this.x);
  }
  rotate(ang){
    let mag=this.mag();
    ang+=this.heading();
    return this.set(mag*P5Math.prototype.cos(ang),
                    mag*P5Math.prototype.sin(ang)); 
  }
  angleBetween(v2){
    return v2.heading()-this.heading();
  }
  lerp(x,y,amt=1){
    if(x.constructor==Vector){
      x=x.copy();
      [x, y]=[x.x, x.y];
    }
    return this.set(
      P5Math.prototype.lerp(this.x, x, amt),
      P5Math.prototype.lerp(this.y, y, amt)
                    );
  }
  array(){
    return [this.x, this.y];
  }
  equals(v2,y){
    if(v2.constructor==Vector){
      [v2,y]=[v2.x, v2.y];
    }
    return this.x==v2 && this.y==y;
  }
  static add(v1,v2,target=new Vector()){
    v1=v1.copy(); v2=Vector._validator(v2);
    target.set(v1.add(v2));
    return target;
  }
  static rem(v1,v2,target=new Vector()){
    v1=v1.copy(); v2=Vector._validator(v2);
    target.set(v1.rem(v2));
    return target;
  }
  static sub(v1,v2,target=new Vector()){
    v1=v1.copy(); v2=Vector._validator(v2);
    target.set(v1.sub(v2));
    return target;
  }
  static mag(vec){
    return vec.mag();
  }
  static magSq(vec){
    return vec.magSq();
  }
  static dot(v1,v2){
    v1=v1.copy();
    return v1.dot(v2);
  }
  static dist(v1,v2){
    v1=v1.copy();
    return v1.dist(v2);
  }
  static mult(v1,v2,target=new Vector()){
    v1=v1.copy();
    return target.set(v1.mult(v2));
  }
  static div(v1,v2,target=new Vector()){
    v1=v1.copy();
    return target.set(v1.div(v2));
  }
  static lerp(v1,v2,amt=1,target=new Vector()){
    v1=v1.copy();v2=v2.copy();
    return target.set(
      P5Math.prototype.lerp(v1.x, v2.x, amt),
      P5Math.prototype.lerp(v1.y, v2.y, amt)
                    );
  }
  static fromAngle(ang){
    return new Vector(
      P5Math.prototype.cos(ang),
      P5Math.prototype.sin(ang),
      );
  }
  static random2D(){
    let ang=Math.random()*2*Math.PI;
    return new Vector(
      Math.cos(ang),
      Math.sin(ang),
      );
  }
}
////////////////////
///color

class ColorConversion{
  static _hsbaToHSLA({h,s,b,a}={}){
    let l=b*(1-s/2);
    s=(l!=0 && l!=1)?(b-l)/Math.min(l,1-l):0;
    return {h,s,l,a};
  }
  static _hsbaToRGBA({h,s,b,a}={}){
    let rgb=[0,0,0]; h/=60;
    let dif=h%2-1;
    dif*=dif<0?-1:1;
    let c=b*s; let x=c*(1-dif)
    let m=b-c;
    if(0<= h && h <=1) rgb=[c,x,0];
    if(1<= h && h <=2) rgb=[x,c,0];
    if(2<= h && h <=3) rgb=[0,c,x];
    if(3<= h && h <=4) rgb=[0,x,c];
    if(4<= h && h <=5) rgb=[x,0,c];
    if(5<= h && h <=6) rgb=[c,0,x];
    return {r:Math.round((rgb[0]+m)*255),g:Math.round((rgb[1]+m)*255),b:Math.round((rgb[2]+m)*255),a};

  }
  static _hslaToHSBA({h,s,l,a}={}){
    let b=l+s*Math.min(l,1-l);
    s=b!=0?2*(1-l/b):0;
    return {h,s,b,a};
  }
  static _hslaToRGBA({h,s,l,a}={}){
    return ColorConversion._hsbaToRGBA(ColorConversion._hslaToHSBA({h,s,l,a}));
  }
  static _rgbaToHSBA({r,g,b,a}={}){
    r/=255;g/=255;b/=255;
    let mini=Math.min(r,g,b),
    maxi=Math.max(r,g,b);
    let dif=maxi-mini,h=0;
    if(maxi!=mini){
      if(maxi==r) h=(g-b)/dif;
      else if(maxi==g) h=2+(b-r)/dif;
      else h=4+(r-g)/dif;
      h*=60;
    }
    let s=maxi!=0?dif/maxi:0;
    h+=h<0?360:0;
    return {h,s,b:maxi,a};
  }
  static _rgbaToHSLA({r,g,b,a}={}){
    return ColorConversion._hsbaToHSLA(ColorConversion._rgbaToHSBA({r,g,b,a}));
  }
  static decToHex(dec,len=1){
    return Math.floor(dec).toString(16).padStart(len,0); 
  }
  static hexToDec(hex){
    return parseInt(hex,16);
  }
}

class Color{
  static limit(val,mod){
    return val<0?0:(val>mod?mod:val); 
  }
  static convert({r,g,b,a=255}={}){
    let hsb=ColorConversion._rgbaToHSBA({r,g,b,a});
    let hsl=ColorConversion._hsbaToHSLA(hsb);
    hsb.s*=100; hsb.b*=100;
    hsl.s*=100; hsl.l*=100;
    return {hsb,hsl};
  }
  static conversionObject={
      "#rgb":function({rgb}={},hexer){
        let {r,g,b}=rgb;
        return `#${hexer(r/17)}${hexer(g/17)}${hexer(b/17)}`;
      },
      "#rgba":function({rgb}={},hexer){
        let {r,g,b,a}=rgb;
        return `#${hexer(r/17)}${hexer(g/17)}${hexer(b/17)}${hexer(a/17)}`;
      },
      "#rrggbb":function({rgb}={},hexer){
        let {r,g,b}=rgb;
        return `#${hexer(r,2)}${hexer(g,2)}${hexer(b,2)}`;
      },
      "#rrggbbaa":function({rgb}={},hexer){
        let {r,g,b,a}=rgb;
        return `#${hexer(r,2)}${hexer(g,2)}${hexer(b,2)}${hexer(a,2)}`;
      },
      "rgb":function({rgb}={}){
         let {r,g,b}=rgb; 
         return `rgb(${r}, ${g}, ${b})`;
      },
      "rgba":function({rgb}={}){
         let {r,g,b,a}=rgb;
         return `rgba(${r}, ${g}, ${b}, ${a/255})`;
      },
      "rgb%":function({rgb}={}){
        let {r,g,b}=rgb;
        return `rgb(${r/2.55}%, ${g/2.55}%, ${b/2.55}%)`;
      },
      "rgba%":function({rgb}={}){
        let {r,g,b,a}=rgb;
        return `rgba(${r/2.55}%, ${g/2.55}%, ${b/2.55}%, ${a/2.55}%)`;
      },
      "hsb":function({hsb}={}){
        let {h,s,b}=hsb;
        return `hsb(${h}, ${s}, ${b})`;
      },
      "hsba":function({hsb}={}){
        let {h,s,b,a}=hsb;
        return `hsba(${h}, ${s}, ${b}, ${a})`;
      },
      "hsb%":function({hsb}={}){
        let {h,s,b}=hsb;
        return `hsb(${h/3.60}%, ${s}%, ${b}%)`;
      },
      "hsba%":function({hsb}={}){
        let {h,s,b,a}=hsb;
        return `hsba(${h/3.60}%, ${s}%, ${b}%, ${a/2.55}%)`;
      },
      "hsl":function({hsl}={}){
        let {h,s,l}=hsl;
        return `hsl(${h}, ${s}, ${l})`;
      },
      "hsla":function({hsl}={}){
        let {h,s,l,a}=hsl;
        return `hsl(${h}, ${s}, ${l}, ${a})`;
      },
      "hsl%":function({hsl}={}){
        let {h,s,l}=hsl;
        return `hsl(${h/3.60}%, ${s}%, ${l}%)`;
      },
      "hsla%":function({hsl}={}){
        let {h,s,l,a}=hsl;
        return `hsla(${h/3.60}%, ${s}%, ${l}%, ${a/2.55}%)`;
      }
    }
  static update(rgb){
    return {rgb,...Color.convert(rgb)};
  }
  ////////////////
  //color management
  // mode --> code
  // hsb  --> 7 
  // hsl  --> 8
  // rgb  --> 15

  static colorParam(mode,...par){
   if(par[0].constructor==String){
    par=strToRgba(par[0]);
    if(par.length<1){par=[255,255,255]; console.log('color not found,, setting up white color');}
    par=par.slice(0,3);
    mode="rgb";
  }
   if(par[0].constructor===Number){
      mode=constantCode[mode];
      let cObj;
      if(par.length>=3){
        par=[...par,255];
        cObj={r:par[0],g:par[1],b:par[2],a:par[3]};
        if(mode== 7) cObj=ColorConversion
                          ._hsbaToRGBA({h:par[0],
                                        s:par[1]/100,
                                        b:par[2]/100,
                                        a:par[3]});
      
        if(mode ==8) cObj=ColorConversion
                        ._hslaToRGBA({h:par[0],
                                      s:par[1]/100,
                                      l:par[2]/100,
                                      a:par[3]});
      }
      else if(par.length==2) cObj={r:par[0], g:par[0], b:par[0], a:par[1]};
      else if(par.length==1) cObj={r:par[0], g:par[0], b:par[0], a:255};
      
      par=new Color(cObj);
    }else{
      par=par[0];
    }
    return par;
  }

  constructor({r=0,g=0,b=0,a=255}={}){
    [r,g,b,a]=[r,g,b,a]
    .map(lev=>Math.round(Color.limit(lev)));
    let rgb={r,g,b,a};
    this.levels=Color.update(rgb);
  }
  setRed(val){
    this.levels.rgb.r=Math.round(Color.limit(val,255));
    this.levels=Color.update(this.levels.rgb);
  }
  setBlue(val){
    this.levels.rgb.b=Math.round(Color.limit(val,255));
    this.levels=Color.update(this.levels.rgb);
  }
  setGreen(val){
    this.levels.rgb.g=Math.round(Color.limit(val,255));
    this.levels=Color.update(this.levels.rgb);
  }
  setAlpha(val){
    this.levels.rgb.a=Color.limit(val,255);
    this.levels=Color.update(this.levels.rgb);
  }
  toString(format="rgba"){
    return Color.conversionObject[format](this.levels,ColorConversion.decToHex);
  }
  ///////////
  /// blend mode ---> 
}
///////

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
    if(this.isShadow){
      this.isShadow=false;
      let ctx=this.ctx;
      ctx.shadowOffsetX=0;
      ctx.shadowOffsetY=0;
      ctx.shadowBlur=0;
      ctx.shadowColor='#0000';
    }

  }
  static applyDefaultStyle(){
    let ctx=this.ctx;
    ctx.fillStyle=this._fillStyle;
    ctx.strokeStyle=this._strokeStyle;
    ctx.font=`${this._fontSize}px ${this._font}`;
    ctx.lineCap=this._lineCap;
    ctx.lineJoin=this._lineJoin;
    ctx.lineWidth=this._lineWidth;
  }
  //////////////
  ///default style variables
  Renderer(){
    //default styling
    let ctxMatrix={
    "isFill":true,
    "_fillStyle":'#fff',
    "_font":'sans',
    "_fontSize":12,
    "isStroke":true,
    "_strokeStyle":'#000',
    "_lineCap":'round',
    "_lineJoin":'miter',
    "_lineWidth":1,
    "_rectMode":'corner',
    "_ellipseMode":'center',
    "_colorMode":'rgb',
    "_angleMode":"radians",
    "isShadow":false,
    "isShapeBegin":false,
  };
  for(let prop in ctxMatrix){
    this[prop]=ctxMatrix[prop];
  }
    Renderer.ctxStyle=Renderer.ctxStyle.bind(this);
    Renderer.applyDefaultStyle.call(this);
    
    Renderer.applyDefaultStyle=Renderer.applyDefaultStyle.bind(this);
    Renderer.__angleMode=this._angleMode;
    this.ctxMatrix=[];
  }

  static angleModer(angle,mod){
    ///////////
    // mode ----> code
    // degrees    22   
    // radians    23
    if(constantCode[mod]==22){
      return angle*(Math.PI/180);
    }
    if(constantCode[mod]==23){
      return angle;
    }
  }
  ///////
  //2d shapes
  static ellipseModer(mod,a,b,c,d){
    ///////////
    // mode ----> code
    // center     3   
    // radius     14
    // corner     5
    // corners    6
    mod=constantCode[mod];
    if(mod==3) return [a,b,c,d];
    if(mod==14) return [a,b,c*2,d*2];
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
    // pie        12   
    // chord      4
    // open       11
    // 
    mod=constantCode[mod];
    [cx,cy,w,h]=Renderer.ellipseModer(
                        this._ellipseMode,
                        cx,cy,w,h);

    start=Renderer.angleModer(start, this._angleMode);
    end=Renderer.angleModer(end, this._angleMode);

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
      if(mod==12) ctx.moveTo(cx,cy);
      ctx.ellipse(cx,cy,w/2,h/2,0,start,end);
      if(mod==12 || mod==4) ctx.closePath();
      Renderer.ctxStyle();
    }
    ctx.beginPath();
  }
  ellipse(cx,cy,radx,rady){
    [cx,cy,radx,rady]=Renderer.ellipseModer(
                        this._ellipseMode,
                        cx,cy,radx,rady);
    if(rady==undefined) rady=radx;
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
    // radius     14
    // corner     5
    // corners    6
    mod=constantCode[mod];
    if(mod==3) return [a-(c/2),b-(d/2),c,d];
    if(mod==14) return [a-c,b-d,c*2,d*2];
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
    if(h==undefined){h=w;}
    [cx,cy,w,h]=Renderer.rectModer(
                        this._rectMode,
                        cx,cy,w,h);
    w=Math.abs(w);
    h=Math.abs(h);
    if(tr==null){tr=br=bl=tl;}
    tl=tl<0?0:tl; tr=tr<0?0:tr;
    bl=bl<0?0:bl; br=br<0?0:br;
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
    s=Math.abs(s);
    if(tr==null){tr=br=bl=tl;}
    tl=tl<0?0:tl; tr=tr<0?0:tr;
    bl=bl<0?0:bl; br=br<0?0:br;
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
  background(...color){
    if(color.constructor==Color) color=color.toString();
    else if(strToRgba(color[0]).length==0) color=color[0];
    else color=Color.colorParam(this._colorMode,...color);
    let ctx=this.ctx;
    ctx.save();
    ctx.fillStyle=color;
    ctx.fillRect(0,0,this.width,this.height);
    ctx.beginPath();
    ctx.restore();
  }
  clear(){
    let ctx=this.ctx;
    ctx.save();
    ctx.clearRect(0,0,this.width,this.height);
    ctx.beginPath();
    ctx.restore();
  }
  fill(...color){
    if(color[0]==undefined){this.isFill=true;return;}
    if(color.constructor==Color) color=color.toString();
    else color=Color.colorParam(this._colorMode,...color);
    if(color.constructor==Color) color=color.toString();
    this.ctx.fillStyle=this._fillStyle=color;
    this.isFill=true;
  }
  noFill(){
    this.isFill=false;
  }
  noStroke(){
    this.isStroke=false;
  }
  stroke(...color){
    if(color[0]==undefined){this.isStroke=true;return;}
    if(color.constructor==Color) color=color.toString();
    else color=Color.colorParam(this._colorMode,...color);
    this.ctx.strokeStyle=this._strokeStyle=color;
    this.isStroke=true;
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
  angleMode(mode){
    this._angleMode=mode;
    Renderer.__angleMode=mode;
  }
  /////////////////////////
  ///color management
  color(...par){
    return Color.colorParam(this._colorMode,...par);
  }
  ///color modes RGB, HSB , HSL
  colorMode(mode){
    this._colorMode=mode;
  }
  ///getters
  alpha(clr){
    return clr.levels.rgb.a;
  }
  blue(clr){
    return clr.levels.rgb.b;
  }
  brightness(clr){
    return clr.levels.hsb.b;
  }
  green(clr){
    return clr.levels.rgb.g;
  }
  hue(clr){
    return clr.levels.hsb.h;
  }
  lightness(clr){
    return clr.levels.hsl.l;
  }
  red(clr){
    return clr.levels.rgb.r;
  }
  saturation(clr){
    return clr.levels[this._colorMode=="rgb"?'hsl':this._colorMode].s;
  }
  blendMode(mode){
    this.ctx.globalCompositeOperation=mode;
  }
  ///////////
  //shadow
  shadow(ofx, ofy, sb, sc){
    let ctx=this.ctx;
    ctx.shadowOffsetX=ofx;
    ctx.shadowOffsetY=ofy;
    ctx.shadowBlur=sb;
    ctx.shadowColor=sc;
    this.isShadow=true;
  }
  /////////////
  //custom shape started with beginShape
  //ended to endShape using vertex
  ////////////
  /// mode     ---> code
  /// close     -> 21
  beginShape(mode=null){
    this.isShapeBegin=true;
    this.shapeMode=mode;
    this.vertices=[];
  }
  vertex(px, py){
    if(this.isShapeBegin){
      this.vertices.push([px, py]);
    }
  }
  ////////////
  /// mode     ---> code
  /// points     -> 0
  /// lines      -> 1
  /// triangles  -> 4
  /// tri_fan    -> 5
  /// tri_strip  -> 6
  /// quads      -> 19
  /// quad_strip -> 20
  endShape(mode){
    let vertiLen=this.vertices.length;
    let isClose=constantCode[mode]==21;mode=this.shapeMode;
    mode=mode*0==0?mode:constantCode[mode];
    if(this.isShapeBegin){
      let ctx=this.ctx;
      ctx.beginPath();
      if(mode==0){
        for(let i=0;i<vertiLen;i++){
          this.point(...this.vertices[i]);
        }
      }else if(mode==1){
        for(let i=0;i<vertiLen;i+=2){
          if(i+1>=vertiLen) break;
          ctx.moveTo(...this.vertices[i]);
          ctx.lineTo(...this.vertices[i+1]);
        }
      }else if(mode==4){
        for(let i=0;i<vertiLen;i+=3){
          if(i+2>=vertiLen) break;
          ctx.moveTo(...this.vertices[i]);
          ctx.lineTo(...this.vertices[i+1]);
          ctx.lineTo(...this.vertices[i+2]);
          ctx.closePath();
        }
      }else if(mode==19){
        for(let i=0;i<vertiLen;i+=4){
          if(i+3>=vertiLen) break;
          ctx.moveTo(...this.vertices[i]);
          ctx.lineTo(...this.vertices[i+1]);
          ctx.lineTo(...this.vertices[i+2]);
          ctx.lineTo(...this.vertices[i+3]);
          ctx.closePath();
        }
      }else{
        for(let i=0;i<vertiLen;i+=2){
          ctx.lineTo(...this.vertices[i]);
        }
        if(isClose) ctx.closePath();
      }
      Renderer.ctxStyle()
      ctx.beginPath();
      this.vertices=[];
      this.isShapeBegin=false;
    }
  }

  ////////////////
  /// Transformation Matrix
  applyMatrix(a, b, c, d, e, f){
    if(a*0==0) this.ctx.transform(a,b,c,d,e,f);
    else if(a.constructor.name=='DOMMatrix'){
      this.ctx.getContext('2d').currentTransform=a;
    }
  }
  resetMatrix(){
    let pd=this.pixelDensity();
    this.ctx.setTransform(pd,0,0,pd,0,0);
  }
  translate(tx, ty){
    this.ctx.translate(tx, ty);
  }
  scale(sx, sy=null){
    let pd=this.pixelDensity();
    sy=sy==null?sx:sy;
    this.ctx.scale(sx/pd, sy/pd);
  }
  rotate(ang){
    ang=Renderer.angleModer(ang,this._angleMode);
    this.ctx.rotate(ang);
  }
  shearX(ang){
    ang=Renderer.angleModer(ang,this._angleMode);
    this.ctx.transform(1,0,ang,1,0,0);
  }
  shearY(ang){
    ang=Renderer.angleModer(ang,this._angleMode);
    this.ctx.transform(1,ang,0,1,0,0);
  }
  push(){
    let obj={
    "isFill":true,
    "_fillStyle":'#fff',
    "_font":'sans',
    "_fontSize":12,
    "isStroke":true,
    "_strokeStyle":'#000',
    "_lineCap":'round',
    "_lineJoin":'miter',
    "_lineWidth":1,
    "_rectMode":'corner',
    "_ellipseMode":'center',
    "_colorMode":'rgb',
    "_angleMode":"radians",
    "isShadow":false,
    "isShapeBegin":false
  };
    for(let prop in obj){
      obj[prop]=this[prop];
    }
    obj.transMatrix=this.ctx.canvas.getContext("2d").currentTransform;
    this.ctxMatrix.push(obj);
  }
  pop(){
    let tmp=this.ctxMatrix.length;
    let piDen=this.pixelDensity();
    if(tmp>0){
      let tmp=this.ctxMatrix.pop();
      for(let prop in tmp){
        this[prop]=tmp[prop];
      }
      tmp=tmp.transMatrix;
      this.ctx.setTransform(tmp.a,tmp.b,tmp.c,tmp.d,tmp.e,tmp.f);

      Renderer.applyDefaultStyle.call(this);
    }
  }
  ///    end     ///
  /////////////////
}
/*
//// P5Math   */
class P5Math{
  boolean(val){
    return !!val;
  }
  char(str){
    if(str.constructor==Array){
      return str.map(elem=>String.fromCharCode(parseInt(elem)));
    }
    return String.fromCharCode(parseInt(str));
  }
  constrain(n, low, high){
    if(n<low) return low;
    if(n>high) return high;
    return n;
  }
  degrees(rad){
    return rad*(180/PI);
  }
  dist(x1, y1, x2, y2){
    return Math.sqrt((x1-x2)**2+(y1-y2)**2);
  }
  hex(dec,len=8){
    if(dec.constructor==Array)
      return dec.map(val=>{
        if(val==Infinity) val=(16**len)-1;
        else if(val==-Infinity) val=0;
        return val.toString(16).padStart(len,0);
      });
    
    if(dec==Infinity) dec=(16**len)-1;
    else if(dec==-Infinity) dec=0;
    return dec.toString(16).padStart(len,0); 
  }
  int(val){
    return parseInt(val);
  }
  float(val){
    return parseFloat(val);
  }
  fract(value){
    return value-Math.floor(value);
  }
  lerp(from,to,per=1){
    return from+(to-from)*per;
  }
  lerpColor(from,to,per=1){
    let {r:r1,g:g1,b:b1,a:a1}=from.levels.rgb;
    let {r:r2,g:g2,b:b2,a:a2}=to.levels.rgb;
    let [r,g,b,a]=[r1+(r2-r1)*per, g1+(g2-g1)*per,
                   b1+(b2-b1)*per, a1+(a2-a1)*per];
    return new Color({r,g,b,a});
  }
  mag(a, b){
    return Math.sqrt(a*a+b*b);
  }
  map(val, strt1, stop1, strt2, stop2){
    return strt2+((val-strt1)/(stop1-strt1))*(stop2-strt2);
  }
  norm(value, start, stop){
    return (value-start)/(stop-start);
  }
  radians(deg){
    return deg*(PI/180);
  }
  random(from=1, to=null){
    if(to==null){
      to=from;
      from=0;
    }
    return from+Math.random()*(to-from);
  }
  sq(val){
    return val*val;
  }
  str(val){
    return String(val);
  }
  unchar(str){
  if(str.constructor==Array){
      return str.map(elem=>String(elem).charCodeAt(0));
    }
    if(str.constructor!==String) return;
    return str.charCodeAt(0); 
  }
  unhex(hex){
    if(hex.constructor==Array) return hex.map(val=>parseInt(val,16));
    return parseInt(hex,16);
  }
}

  for(let prop of ["cos","cosh","sin","sinh","tan","tanh"]){
    P5Math.prototype[prop]=(ang)=>{
      ang*=Renderer.__angleMode=="degrees"?(Math.PI/180):1;
      return Math[prop](ang);
    }
  }
  for(let prop of ["acos","acosh","asin","asinh","atan","atan2","atanh"]){
    P5Math.prototype[prop]=(...par)=>{
      par=Math[prop](...par);
      return Renderer.__angleMode=="degrees"?par*(180/Math.PI):par;
    }
  }
/*p5math end*/

class Interaction{
  static applyCustomEvent(window, enable){
    if(enable){
window.on('mousedown',pt=>{
  function app(pts){
    window.emit('dragging',pts);
  }
  function fun(ptsd){
    window.off("mousemove",app);
    window.off("mouseup",fun);
  }
  window.on('mouseup',fun);
  window.on('mousemove',app)
})
  }

  }
  static grab(willGrab){
    grab(this.window._windowPtr, willGrab); 
  }
  static init({
    mouseMoved=function(){},
    mouseDragged=null,
    mousePressed=function(){},
    mouseReleased=function(){},
    mouseClicked=null,
    mouseWheel=null,
    keyPressed=null,
    keyReleased=function(){},
    keyTyped=null,
  }={}){
    this.mouse={
      lastPos:{x:0, y:0},
      crntPos:{x:0, y:0},
      isMousePressed:false,
      mouseButton:0
    }
    this.keyboard={
      isKeyPressed:false,
      key:'',
      keyCode:0
    }
    // let self=this;
    this.window.on("mousemove",pt=>{
      this.mouse.crntPos={x:pt.clientX,y:pt.clientY};
      mouseMoved(pt);
    });
    if(mouseClicked!=null){
     this.window.on("click",mouseClicked);
  }
    this.window.on("mouseup",pt=>{
      this.mouse.isMousePressed=false;
      mouseReleased(pt);
    });
    this.window.on("mousedown",pt=>{
      this.mouse.mouseButton=pt.button==1?'left':'right';
      this.mouse.isMousePressed=true;
      mousePressed(pt);
    });
    if(mouseWheel!=null){
     this.window.on("mousewheel",mouseWheel);
    }
    if(mouseDragged!=null){
      this.window.on("dragging",mouseDragged);
    }
    this.window.on("keyup",pt=>{
      this.keyboard.isKeyPressed=false;
      keyReleased(pt);
    });

    this.window.on("keydown",pt=>{
      this.keyboard.key=pt.key;
      this.keyboard.keyCode=pt.keyCode;
      this.keyboard.isKeyPressed=true;
      if(!pt.repeat && keyPressed!=null) keyPressed(pt);
    });

    if(keyTyped!=null){
      this.window.on('keypress',pk=>{
      if(!pk.repeat) keyTyped(pk);
      });
  }
    this.window.on("focus",pt=>{
      this.isFocused=true;
    });
    this.window.on("blur",pt=>{
      this.isFocused=false;
    });
    this.window.on("hide",pt=>{
      if(this.frames>0){
        this.noLoop();
        this.hidden=true;
      }
    });
    this.window.on("show",pt=>{
       if(this.hidden){
        this.loop();
        this.hidden=false;
      }
    })
  }

  static lstPos(){
    this.mouse.lastPos={x:this.mouse.crntPos.x, y:this.mouse.crntPos.y};
  }
  static applyEvents(){
    Interaction.grab=Interaction.grab.bind(this);
    Interaction.lstPos=Interaction.lstPos.bind(this);
    Interaction.applyCustomEvent(this.window, this.eventHandles.mouseDragged!==undefined);
    Interaction.init.call(this, this.eventHandles);
  }
}

function NodeP5(){
  //////////
  //main class for nodeP5
  this.title="canvas";
  this.newCreated=false;
  let pd=1.5; 
  let width=800*pd;
  let height=450*pd;
  ////////
  //creating default window for nodep5
  this.window=nativeCanvas.createWindow({width,height,resizable:false,title:this.title,fitCanvasInWindow:true});
  this.ctx=this.window.canvas.getContext("2d");
 
  Object.defineProperties(this,{
    width:{get(){return this.window.size.w/this._pixelDensity}},
    height:{get(){return this.window.size.h/this._pixelDensity}}
  });

  this._loop=null;
  this.isLoop=true;
  this.isDrawLoaded=false;///decides whatever the draw function is executed or not;
  this.fps=90;
  this._pixelDensity=this.window.devicePixelRatio || pd;
  this.setup=function(){};
  this.draw=function(){};
  
  Renderer.prototype.Renderer.call(this); ///adding Renderer props to our main class
  this.window.center();  ///center the window;
  this.frames=0;
  this.deltaT=0;  ////calcalating deltaTime
  this.loadedTime=startTimer();
  this.sysTime=new Date();
  this.pixelData=null;
  NodeP5.draw=NodeP5.draw.bind(this);  ///binding static method to this
  }

NodeP5.prototype=Object.create(Renderer.prototype);
NodeP5.prototype.constructor=NodeP5;

NodeP5.draw=function(){
    let piDen=this._pixelDensity;
    this.isDrawLoaded=true;
    let lst=Date.now();
    this._loop=null;
    let looper=()=>{
      let tmp=Date.now();
      this.deltaT=tmp-lst;
      lst=tmp;
      ++this.frames;
      if(!this.isLoop) clearTimeout(this._loop);
      else{this.sysTime=new Date();this.ctx.setTransform(piDen,0,0,piDen,0,0);this.draw();}
      Interaction.lstPos();
      this._loop=setTimeout(looper,1000/this.fps);
    }
    looper();
    if(!this.isLoop){this.ctx.setTransform(piDen,0,0,piDen,0,0);this.draw();}
};
NodeP5.prototype.exit=function(){
  process.exit();
}
NodeP5.prototype.createCanvas=function(w, h, title){
  w*=1.5;h*=1.5;
  this.window.destroy();
  title=title || this.title;
  this.window=nativeCanvas.createWindow({width:w,height:h,resizable:false,title,fitCanvasInWindow:true});
  this.window.center();
  this.ctx=this.window.canvas.getContext("2d");
  this._pixelDensity=this.window.devicePixelRatio || 1.5;
  Renderer.applyDefaultStyle();
  Interaction.applyEvents.call(this);
  this.newCreated=true;
}
NodeP5.prototype.reqFullScreen=function(isF){
    if(isF===undefined) return !!this.window.fullScreen;
    this.window.fullScreen=!!isF;
    if(!this.isLoop) setTimeout(()=>{
      Renderer.applyDefaultStyle();
      NodeP5.draw();
    },1);
    return !!isF;
  }
NodeP5.prototype.requestPointerLock=function(){
    Interaction.grab(true);
  }
NodeP5.prototype.exitPointerLock=function(){
    Interaction.grab(false);
  }
NodeP5.prototype.keyIsDown=function(key){
  return (this.keyboard.keyCode===key && this.keyboard.isKeyPressed);
}

NodeP5.prototype.print=function(...text){
  console.log(...text);
}

NodeP5.prototype.millis=function(){
  return endTimer(this.loadedTime);
}
NodeP5.prototype.second=function(){
  return this.sysTime.getSeconds();
};
NodeP5.prototype.minute=function(){
  return this.sysTime.getMinutes();
};
NodeP5.prototype.hour=function(){
  return this.sysTime.getHours();
};
NodeP5.prototype.day=function(){
  return this.sysTime.getDate();
};
NodeP5.prototype.year=function(){
  return this.sysTime.getFullYear();
};
NodeP5.prototype.month=function(){
  return this.sysTime.getMonth()+1;
};

NodeP5.prototype.pixelDensity=function(dens){
  if(dens==undefined) return this._pixelDensity;
  this._pixelDensity=dens;
}
NodeP5.prototype.loadPixels=function(){
  this.pixelData=this.ctx.getImageData(0,0,this.width,this.height);
}
NodeP5.prototype.updatePixels=function(){
  if(this.pixelData!=null){
    this.ctx.putImageData(this.pixelData,0,0);
    this.pixelData=null;
 }
}

NodeP5.prototype.saveCanvas=function(fileName,ext="png",opt={}){
  ext=ext.toLowerCase();
  if(["png","jpg","jpeg"].indexOf==-1) throw 'desired: png/jpg/jpeg';
  fileName=fileName || String('./'+Math.floor(Math.random()*1000000));
  fileName=`${fileName}.${ext}`;
  let wS=require("fs")
  .createWriteStream(fileName)
  .on("finish",err=>console.log(err || "success"));
  this.ctx.canvas[ext=="png"?'createPNGStream':'createJPEGStream'](opt).pipe(wS);
}

NodeP5.prototype.saveFrame=function(filename){
}

NodeP5.prototype.loadImage=function(path,cb=null){
  path=this.window.loadImage(path);
  if(cb){
    path.then(cb);
  }else{
    return path;
  }
}
NodeP5.prototype.loadFont=function(path,family="loadedFont"){
  require("canvas").registerFont(path,{family});
}
NodeP5.prototype.isLooping=function(){
  return this.isLoop;
}
NodeP5.prototype.noLoop=function(){
  this.isLoop=false;
}
NodeP5.prototype.loop=function(){
  this.isLoop=true;
  if(this.isDrawLoaded){
    clearTimeout(this._loop);
    NodeP5.draw();
  }
}
NodeP5.prototype.frameRate=function(fps=null){
  if(fps===null || fps===0) return this.isLoop?!this.deltaT?this.fps:(1000/this.deltaT):0;
  this.fps=fps;
  if(this.isDrawLoaded){
    clearTimeout(this._loop);
    if(this.isLoop) NodeP5.draw();
  }
}
NodeP5.prototype.redraw=function(){
  NodeP5.draw();
}

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
  
  ///vectors class
    Vector._applyTo(global);
  ///

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
NodeP5.prototype.run=async function({setup,
                                     draw,
                                     preload={},
                                     mouseClicked, mousePressed,
                                     mouseDragged, mouseReleased,
                                     mouseWheel, keyPressed, keyTyped, keyReleased}={}){
  this.setup= setup || this.setup;
  this.draw= draw || this.draw;

  this.eventHandles={mouseClicked, mousePressed,
                             mouseDragged, mouseReleased,
                             mouseWheel, keyPressed, keyTyped, keyReleased};
   Interaction.applyEvents.call(this);
   let piDen=this._pixelDensity;
   this.ctx.setTransform(piDen,0,0,piDen,0,0);
  if(typeof preload == 'function'){
    if(!this.newCreated){
    this.init();
    this.newCreated=false;
    await preload();
    this.timeTaken=0;
    this.setup();
  }
  NodeP5.draw();
  
  }else{
    if(!this.newCreated){
    this.init();
    this.newCreated=false;
    this.timeTaken=0;
    this.setup();
  }
  NodeP5.draw();  
  
  }

  
}
let samP5=new NodeP5();
module.exports=samP5.run.bind(samP5);