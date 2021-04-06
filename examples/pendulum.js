class Particle{
	constructor(x, y, m){
		this.pos=createVector(x, y);
		this.vel=Vector.random2D().setMag(0);
		this.acc=createVector();
		
		this.ang=createVector();
		this.angVel=createVector();
		this.angAcc=createVector();
		
		this.mass=m||25;
		this.repel=false;
	}

	get area(){
		return this.mass * PI;
	}
	update(){

		this.vel.add(this.acc);
		this.pos.add(this.vel);

		this.angVel.add(this.angAcc);
		this.ang.add(this.angVel);

		if(this.pos.x -this.mass <= 0 ){
			this.pos.x=this.mass;
			this.vel.x*=-1;
		}
		if(this.pos.x +this.mass >= width ){
			this.pos.x=width-this.mass;
			this.vel.x*=-1;
		}

		if(this.pos.y -this.mass <= 0 ){
			this.pos.y=this.mass;
			this.vel.y*=-1;
		}

		if(this.pos.y +this.mass >= height ){
			this.pos.y=height-this.mass;
			this.vel.y*=-1;
		}

		this.acc.empty();
		this.angAcc.empty();
	}
	applyForce(force){
		//f=ma
		this.acc.add(Vector.div(force, this.mass));
	}
	applyAngAcc(ang){
		this.angAcc.add(ang);
	}
	draw(color){
		push();
		fill(this.mass);
		stroke(255-this.mass);
		translate(this.pos.x, this.pos.y);
		rotate(this.ang.x);
		circle(0, 0, this.mass*2);
		line(0, 0, this.mass, 0);
		pop();
	}
}

class Material{
	constructor(x, y, w, h){
		this.pos=createVector(x, y);
		this.wid=w;
		this.hei=h;
		this.c=0.04;
	}
	
	inside(part){
		const pos=part.pos;
		let {pos:{x, y}, wid:w, hei:h}=this;
		
		let a=[x - w/2, y - h/2],
				b=[x + w/2, y - h/2],
				c=[x + w/2, y + h/2],
				d=[x - w/2, y + h/2];
		return (pos.x >= a[0] && pos.x <= b[0]) && (pos.y >= a[1] && pos.y <= c[1]);  
	}

	dragForce(part){
		let dir = part.vel.copy();
		let V = dir.magSq();
		dir.setMag(-1/2);
		dir.mult(V * this.c * part.area*0.5);
		return dir;
	}

	draw(){
		push();
		fill(200, 50);
		stroke(200);
		rect(this.pos.x, this.pos.y, this.wid, this.hei);
		pop();
	}
}


let ang=0;
let angVel=0;
let angAcc=0;
setup=function(){
	angleMode(DEGREES);
	rectMode(CENTER);
}

draw=function(){
	background(0);

	const grav = createVector(0, 1);
	angAcc=sin()
	angVel+=angAcc;
	ang+=angVel;
	angAcc=0;
	translate(width/2, height/2);
	rotate(ang);
	stroke(200);
	line(0, 0, 200,0);
	circle(200, 0, 100);
}

require("./");