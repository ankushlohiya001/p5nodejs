const math=require("./math");
class Vector{
  /////interface static methods
  static _validator(x,y=0){
    if(x.constructor===Array){
      return new Vector(...x);
    }
    if(x.constructor===Vector){
      return x.copy();
    }
    return new Vector(x, y);
  }
/////////
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
    return math.mag(this.x, this.y);
  }
  magSq(){
    return this.x*this.x + this.y*this.y;
  }
  dot(v2){
    return this.x*v2.x + this.y*v2.y;
  }
  dist(v2){
    return math.dist(this.x, this.y, v2.x, v2.y);
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
    return math.atan2(this.y, this.x);
  }
  rotate(ang){
    let mag=this.mag();
    ang+=this.heading();
    return this.set(mag * math.cos(ang),
                    mag * math.sin(ang)); 
  }
  lerp(x,y,amt=1){
    if(x.constructor==Vector){
      x=x.copy();
    }
    return this.set(math.lerp(this.x, x, amt), math.lerp(this.y, y, amt));
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
  static createVector(x=0,y=0){
    return new Vector(x,y);
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

  static angleBetween(v1, v2){
    return v2.heading() - v1.heading();
  }

  static dot(v1,v2){
    v1=v1.copy();
    return v1.dot(v2);
  }

  static mult(v1,v2,target=new Vector()){
    v1=v1.copy();
    return target.set(v1.mult(v2));
  }

  static div(v1,v2,target=new Vector()){
    v1=v1.copy();
    return target.set(v1.div(v2));
  }

  static fromAngle(ang){
    return new Vector(math.cos(ang), math.sin(ang));
  }
  static random2D(){
    let ang=Math.random()*2*Math.PI;
    return new Vector(mat.cos(ang), math.sin(ang));
  }
}

module.exports = Vector; 