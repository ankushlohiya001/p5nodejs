setup=function(){
	// noLoop();
	strokeWeight(2);
	// frameRate(10);
	angleMode(DEGREES);
	pos=createVector(200,200);
	vel=createVector(0,1);
}
let pos, vel;
let stif=0.9;
let h=1;
draw=function(){
	background(200);
	if(pos.x+25>=width){
		pos.x = width-25;
		vel.x*=-stif;
	}
	if(pos.x-25<=0){
		pos.x = 25;
		vel.x*=-stif;
	}
	if(pos.y+25>=height){
		pos.y = height-25;
		vel.y*=-stif;
	}
	if(pos.y-25<=0){
		pos.y = 25;
		vel.y*=-stif;
	}
	let gr=createVector(0,0.8);
	// let gd=createVector(0,-0.8);

	if(vel.y>0) vel.mult(0.9);
	// else
	vel.add(gr);
	pos.add(vel);
	circle(pos.x, pos.y,50);
}
require("./");