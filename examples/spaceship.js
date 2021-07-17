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


let pos, vel, acc;
let ang=0;
setup=function(){
	angleMode(DEGREES);
	rectMode(CENTER);
	noStroke();
	pos=createVector();
	vel=createVector();
	acc=createVector();
}

draw=function(){
	background(0);

	const mouse=createVector(mouseX, mouseY);

	let dir=Vector.sub(mouse, pos);
	ang=dir.heading();
	if(keyIsPressed){

		// if(keyCode===LEFT_ARROW){
		// 	ang-=5;
		// 	// acc.empty();
		// 	// let foc=Vector.fromAngle(ang);
		// 	// acc.add(foc.mult(0.1));
		// }

		// if(keyCode===RIGHT_ARROW){
		// 	ang+=5;
		// 	// acc.empty();
		// 	// let foc=Vector.fromAngle(ang);
		// 	// acc.add(foc.mult(0.1));
		// }

		if(keyCode===UP_ARROW){
			let foc=Vector.fromAngle(ang);
			acc.add(foc.mult(0.5));
		}

		if(keyCode===DOWN_ARROW){
			let foc=Vector.fromAngle(ang).invert();
			acc.add(foc.mult(0.05));
		}
		
	}

	let drag=Material.prototype.dragForce.call({c:0.1},{
		vel,
		area:0.2
	})

	acc.add(drag);

	vel.add(acc);
	// vel.limit(10);
	pos.add(vel);
	acc.empty();


	if(pos.x < 0 ){
		pos.x=width;
	}
	if(pos.x > width ){
		pos.x= 0;
	}

	if(pos.y < 0 ){
		pos.y=height;
	}

	if(pos.y > height ){
		pos.y=0;
	}
push();
	translate(pos.x, pos.y);
	rotate(ang);
	rect(0, 0, 100, 30);
	stroke("red");
	line(0,0, 110, 0);
pop();
push();
translate(width/2, height/2);
// rotate(10);
 	textSize(15);
 for(let i=0;i<=180;i+=10){
 	let ang=i-180;
 	// rotate(-10);
 	noStroke();
 	text(i, cos(ang)*200, sin(ang)*200);
 }
pop();
push();
translate(width/2, height/2);
let si=vel.mag();
si=map(si,0, 10, 0, 180);
noStroke();
textSize(15);
text(int(si), 0, -30);
strokeWeight(4);
stroke("red");
line(0,0, cos(si-180)*150, sin(si-180)*150);
pop();
}

require("./");