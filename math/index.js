const Mode=require("./../constants");
class math{
  _setState(state){
    this.state=state;
  }
  _angleModer(ang, radian=true){
    switch(this.state._angleMode){
      case Mode.DEGREES: return radian?this.radians(ang):ang;
      case Mode.RADIANS:
      default: return radian?ang: this.degrees(ang);
    }
  }

  get HALF_PI(){ return Math.PI/2; }
  get PI(){ return Math.PI; }
  get QUARTER_PI(){ return Math.PI/4; }
  get TWO_PI(){ return 2*Math.PI; }
  get TAU(){ return 2*Math.PI; }
  abs(value){
    return Math.abs(value); 
  }
  ceil(value){
    return Math.ceil(value);
  }
  constrain(n,low,high){
    return n<low?low:n>high?high:n;
  }
  dist(x1,y1,x2,y2){
    return Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
  }
  exp(value){
    return Math.exp(value);
  }
  floor(value){
    return Math.floor(value);
  }
  lerp(start, stop, amt=1){
    const gap=stop-start;
    return start+gap*amt;
  }
  log(value){
    return Math.log(value);
  }
  mag(x,y){
    return math.dist(0,0,x,y);
  }
  map(value,start1,stop1,start2,stop2){
    if(stop1-start1===0) return value;
    let per=(value-start1)/(stop1-start1);
    return math.lerp(start2,stop2,per);
  }
  max(...pars){
    return Math.max(...pars);
  }
  min(...pars){
    return Math.min(...pars);
  }
  norm(value,start,end){
    return math.map(value,start,end,0,1);
  }
  pow(value,power){
    return Math.pow(value,power);
  }
  round(value){
    return Math.round(value);
  }
  sq(value){
    return Math.pow(value,2);
  }
  sqrt(value){
    return Math.sqrt(value);
  }
  fract(value){
    return value-Math.floor(value);
  }
  random(min=0,max=null){
    if(min.constructor===Array){
      return min[Math.floor(Math.random()*min.length)];
    }
    if(max===null){
      max=min;
      min=0;
    }
    return min+Math.random()*(max-min);
  }
  degrees(angle){
    return angle*(180/Math.PI);
  }
  radians(angle){
    return angle*(Math.PI/180);
  }
  acos(value){
    let angle=Math.acos(value);
    return this._angleModer(angle,false);
  }
  asin(value){
    let angle=Math.asin(value);
    return this._angleModer(angle,false);
  }
  atan(value){
    let angle=Math.atan(value);
    return this._angleModer(angle,false);
  }
  atan2(y,x){
    let angle=Math.atan2(y,x);
    return this._angleModer(angle,false);
  }
  cos(angle){
    angle=this._angleModer(angle);
    return Math.cos(angle);
  }
  sin(angle){
    angle=this._angleModer(angle);
    return Math.sin(angle);
  }
  tan(angle){
    angle=this._angleModer(angle);
    return Math.tan(angle);
  }
  /*type conversions*/
  float(value){
    return parseFloat(value);
  }
  int(value){
    return parseInt(value);
  }
  str(value){
   if(value.constructor===Array){
    return value.map(x=>String(x));
   }
   return String(value);
  }
  boolean(value){
    return !!value;
  }
  // byte(value){
  //  if(value.constructor===Array){
  //   return value.map(x=>parseInt(x).toString(8));
  //  }
  //  return parseInt(value).toString(8);
  // }
  char(value){
   if(value.constructor===Array){
    return value.map(x=>String.fromCharCode(parseInt(x)));
   }
   return String.fromCharCode(parseInt(value));
  }
  unchar(value){
   if(value.constructor===Array){
    return value.map(x=>x.charCodeAt(0));
   }
   return value.charCodeAt(0);
  }
  hex(value,digits=8){
   if(value.constructor===Array){
    return value.map(x=>x.toString(16).padStart(digits,0));
   }
   return value.toString(16).padStart(digits,0);
  }
  unhex(value,digits=8){
   if(value.constructor===Array){
    return value.map(x=>parseInt(x,16));
   }
   return parseInt(value,16);
  }
};
module.exports=new math();