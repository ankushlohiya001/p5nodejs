const {
  Particle: {
    Triangle
  }
} = require("./particle");

class Path {
  constructor(px, py, qx, qy, rad = 10) {
    this.start = createVector(px, py);
    this.end = createVector(qx, qy);
    this.rad = rad;
  }

  draw() {
    const {
      x: sx,
      y: sy
    } = this.start;
    const {
      x: rx,
      y: ry
    } = this.end;
    push();
    strokeWeight(this.rad * 2);
    stroke(255, 25);
    line(sx, sy, rx, ry);
    strokeWeight(2);
    stroke(255);
    line(sx, sy, rx, ry);
    pop();
  }
}

setup = function() {
  angleMode(DEGREES);
  let pts = [];
  let dif=20;
  let phase=90;
  for(let i=0;i<360+dif;i+=dif){
  	let sine=0;
  	for(let c=1;c<20;c+=2){
  		sine+=sin(i*c)/c;
  	}
  	pts.push([phase+i*3, height/2+300*(sine)]);
  }
  for (let i = 1; i < pts.length; i++) {
    vecs.push(new Path(...pts[i - 1], ...pts[i], 30));
  }

  mover = new Triangle(random(width), random(height), 20, 10);
  mover.walls = [0, 0, 0, 0];
}

let vecs = [];
let mover;
draw = function() {
  background(0);
  stroke(200);
  strokeWeight(4);

	let des = mover.vel.copy();
	des.setMag(30);
	let futLoc = Vector.add(mover.pos, des);

	let norm, dis=Infinity;
  for (let i=0;i<vecs.length;i++) {
  	let pt=vecs[i]
    pt.draw();

	  let vecA = Vector.sub(futLoc, pt.start);

	  let patVec = Vector.sub(pt.end, pt.start);
	  // let b=patVec.copy();
	  // let ang = Vector.angleBetween(patVec, vecA);
	  // if(ang*0!=0) ang=0.00001;
	  patVec.normalize();
	  patVec.mult(Vector.dot(vecA, patVec));

	  patVec.add(pt.start);
	  
	  if (patVec.x < min(pt.start.x, pt.end.x) || patVec.y < min(pt.start.y, pt.end.y)){
	  	patVec = pt.start.copy();
	  }else if (patVec.x > max(pt.start.x, pt.end.x) || patVec.y > max(pt.start.y, pt.end.y)){
	  	patVec = pt.end.copy();
	  }

	  let di=Vector.dist(futLoc, patVec);

	  if(di<dis){
		  dis=di;
		  norm=patVec;
		}
  }
	
		circle(norm.x, norm.y, 10);
	if(dis > vecs[0].rad){
		let dir=Vector.sub(norm, mover.pos);
		dir.setMag(10);
		let steer=Vector.sub(dir, mover.vel);
		steer.limit(1);

		// print(mover.pos)
		mover.applyForce(steer);
	}


	mover.show();

}

mousePressed = function() {
  mover.pos.set(mouseX, mouseY);
  mover.vel.set(Vector.random2d().setMag(5));
}
require("../");