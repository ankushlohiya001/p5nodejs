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
  "top":18
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
  static convert({r,g,b,a}={}){
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
   if(par[0].constructor===Number){
      mode=constantCode[mode];
      let cObj;
      if(par.length==3){
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
    r=Color.limit(r,255);
    g=Color.limit(g,255);
    b=Color.limit(b,255);
    a=Color.limit(a,255);
    let rgb={r,g,b,a};
    this.levels=Color.update(rgb);
  }
  setRed(val){
    this.levels.rgb.r=Color.limit(val,255);
    this.levels=Color.update(this.levels.rgb);
  }
  setBlue(val){
    this.levels.rgb.b=Color.limit(val,255);
    this.levels=Color.update(this.levels.rgb);
  }
  setGreen(val){
    this.levels.rgb.g=Color.limit(val,255);
    this.levels=Color.update(this.levels.rgb);
  }
  setAlpha(val){
    this.levels.rgb.a=Color.limit(val,255);
    this.levels=Color.update(this.levels.rgb);
  }
  toString(format="rgba"){
    return Color.conversionObject[format](this.levels,ColorConversion.decToHex);
  }
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
    this._colorMode='rgb';
    Renderer.ctxStyle=Renderer.ctxStyle.bind(this);
    Renderer.applyDefaultStyle.call(this);
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
  background(...color){
    if(color.constructor==Color) color=color.toString();
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
  pop(){
    this.ctx.restore();
  }
  push(){
    this.ctx.save();
  }
  stroke(...color){
    if(color.constructor==Color) color=color.toString();
    else color=Color.colorParam(this._colorMode,...color);
    this.ctx.strokeStyle=this._strokeStyle=color;
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
  /////////////////////////
  ///color management
  color(...par){
    return Color.colorParam(this._colorMode,...par);
  }
  getColor(){return Color;}
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
  /////////////////
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