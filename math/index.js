const math={
  abs(value){
    return Math.abs(value); 
  },
  ceil(value){
    return Math.ceil(value);
  },
  constrain(n,low,high){
    return n<low?low:n>high?high:n;
  },
  dist(x1,y1,x2,y2){
    return Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
  },
  exp(value){
    return Math.exp(value);
  },
  floor(value){
    return Math.floor(value);
  },
  lerp(start, stop, amt=1){
    const gap=stop-start;
    return start+gap*amt;
  },
  log(value){
    return Math.log(value);
  },
  mag(x,y){
    return math.dist(0,0,x,y);
  },
  map(valueue,start1,stop1,start2,stop2){
    if(stop1-start1===0) return valueue;
    let per=(valueue-start1)/(stop1-start1);
    return math.lerp(start2,stop2,per);
  },
  max(a,b=null){
    let arr=b?[a,b]:a;
    return Math.max(...arr);
  },
  min(a,b=null){
    let arr=b?[a,b]:a;
    return Math.min(...arr);
  },
  norm(value,start,end){
    return math.map(value,start,end,0,1);
  },
  pow(value,power){
    return Math.pow(value,power);
  },
  round(value){
    return Math.round(value);
  },
  sq(value){
    return Math.pow(value,2);
  },
  sqrt(value){
    return Math.sqrt(value);
  },
  fract(value){
    return value-Math.floor(value);
  },
  random(min=0,max=null){
    if(min.constructor===Array){
      return min[Math.floor(Math.random()*min.length)];
    }
    if(max===null){
      max=min;
      min=0;
    }
    return min+Math.random()*(max-min);
  },
  degrees(angle){
    return angle*(180/Math.PI);
  },
  radians(angle){
    return angle*(Math.PI/180);
  },
  acos(value,isRadian=true){
    let angle=Math.acos(value);
    return isRadian?angle:math.degrees(angle);
  },
  asin(value,isRadian=true){
    let angle=Math.asin(value);
    return isRadian?angle:math.degrees(angle);
  },
  atan(value,isRadian=true){
    let angle=Math.atan(value);
    return isRadian?angle:math.degrees(angle);
  },
  atan2(y,x,isRadian=true){
    let angle=Math.atan2(y,x);
    return isRadian?angle:math.degrees(angle);
  },
  cos(angle,isRadian=true){
    angle=isRadian?angle:math.radians(angle);
    return Math.cos(angle);
  },
  sin(angle,isRadian=true){
    angle=isRadian?angle:math.radians(angle);
    return Math.sin(angle);
  },
  tan(angle,isRadian=true){
    angle=isRadian?angle:math.radians(angle);
    return Math.tan(angle);
  },
  HALF_PI:Math.PI/2,
  PI:Math.PI,
  QUARTER_PI:Math.PI/4,
  TWO_PI:2*Math.PI,
  TAU:2*Math.PI,

  /*type conversions*/
  float(value){
    return parseFloat(value);
  },
  int(value){
    return parseInt(value);
  },
  str(value){
   if(value.constructor===Array){
    return value.map(x=>String(x));
   }
   return String(value);
  },
  boolean(value){
    return !!value;
  },
  // byte(value){
  //  if(value.constructor===Array){
  //   return value.map(x=>parseInt(x).toString(8));
  //  }
  //  return parseInt(value).toString(8);
  // },
  char(value){
   if(value.constructor===Array){
    return value.map(x=>String.fromCharCode(parseInt(x)));
   }
   return String.fromCharCode(parseInt(value));
  },
  unchar(value){
   if(value.constructor===Array){
    return value.map(x=>x.charCodeAt(0));
   }
   return value.charCodeAt(0);
  },
  hex(value,digits=8){
   if(value.constructor===Array){
    return value.map(x=>x.toString(16).padStart(digits,0));
   }
   return value.toString(16).padStart(digits,0);
  },
  unhex(value,digits=8){
   if(value.constructor===Array){
    return value.map(x=>parseInt(x,16));
   }
   return parseInt(value,16);
  }
};
module.exports=math;