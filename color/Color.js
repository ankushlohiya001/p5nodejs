const colorParse=require("color-parse");
const colorSpace=require("color-space");
const Mode=require("./../constants");
const {lerp,hex,round}=require("./../math");
class Color{
  constructor(color){
    if(color.constructor===String) color=color.toLowerCase();
    color=colorParse(color);
    if(color.space===undefined){
      color={values:[0,0,0],space:"rgb",alpha:1};
    }
    if(color.space!=='rgb'){
      color.values=colorSpace[color.space].rgb(color.values);
    }
    this.value=color.values.map(round);
    this.alpha=color.alpha;
    this.colorSpaces={
      rgb:this.value,
      hsl:null,
      hsv:null
    };
    this._updateColorSpaces();
  }
  _updateColorSpaces(){
    let forms=["hsl","hsv"];
    for(let form of forms){
      this.colorSpaces[form]=(colorSpace.rgb[form](this.value)).map(round);
    }
  }
  setRed(val){
    this.value[0]=round(val);
    this._updateColorSpaces();
  }
  setGreen(val){
    this.value[1]=round(val);
    this._updateColorSpaces();
  }
  setBlue(val){
    this.value[2]=round(val);
    this._updateColorSpaces();
  }
  setAlpha(val){
    this.alpha=val;
  }
  toString(){
    let [r,g,b]=this.value;
    r=hex(r,2);
    g=hex(g,2);
    b=hex(b,2);
    let a=hex(round(this.alpha*255),2);
    return `#${r}${g}${b}${a}`;
  }
  toColorObj(){
    const [r, g, b]=this.value;
    const a=this.alpha*255;
    return {r, g, b, a};
  }
  copy(){
    let tmpColor=new Color(this.value);
    tmpColor.alpha=this.alpha;
    return tmpColor;
  }
  static color(colorMode,...pars){
    let color="";
    let alpha=100;
    if(pars[0].constructor===Array){
      pars=[...pars[0],pars[1]];
    }
    switch(pars.length){
      case 1:
      case 2:{
        let [a,b]=pars;
        b=b||alpha;
        switch(a.constructor){
          case String: color=a;
          break;
          case Number: color=[a,a,a];
          break;
          case Color: return a.copy();
          default: color=[0,0,0];
        }
        alpha=parseFloat(b);
      }
      break;
      case 3:
      case 4:{
        let [a,b,c,d]=pars;
        alpha=d||alpha;
        switch(colorMode){
          case Mode.HSL: colorMode='hsl';
          break;
          case Mode.HSB: colorMode='hsv';
          break;
          default: colorMode='rgb';
        }
        color=colorSpace[colorMode].rgb([a,b,c]);
      }
    }
    let tmpColor=new Color(color);
    tmpColor.alpha=alpha/100;
    return tmpColor;
  }
  static red(color){
    return color.colorSpaces.rgb[0];
  }
  static green(color){
    return color.colorSpaces.rgb[1];
  }
  static blue(color){
    return color.colorSpaces.rgb[2];
  }
  static alpha(color){
    return color.alpha;
  }
  static hue(color){
    return color.colorSpaces.hsl[0];
  }
  static saturation(color,colorMode){
    colorMode=colorMode===Mode.HSB?'hsv':'hsl';
    return color.colorSpaces[colorMode][1];
  }
  static lightness(color){
    return color.colorSpaces.hsl[2];
  }
  static brightness(color){
    return color.colorSpaces.hsv[2];
  }
  static lerpColor(color_1,color_2,amount){
    let cl1=color_1.value;
    let cl2=color_2.value;
    let colorArr=[];
    for(let i=0;i<3;i++){
      colorArr.push(lerp(cl1[i],cl2[i],amount));
    }
    return new Color(colorArr);
  }
}

module.exports=Color;