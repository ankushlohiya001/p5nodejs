let dino, cactus;

preload=function(){
	dino=loadImage("./sams/pk.png");
	cactus=loadImage("./sams/ck.png");
}
setup=function(){
	// noLoop();
	strokeWeight(2);
	// frameRate(10);
	angleMode(DEGREES);
	pos=createVector(200,200);
	vel=createVector(0,1);
	add=100;
	for(let i=0;i<10;i++){
		cacts.push(random(cactus.height,cactus.height+20));
	}
}
let pos, vel;
let stif=0.2;
let h=1;
let cacts=[];
let add=0;
draw=function(){
	background(200);
	// add%=0;
	translate(0,-100);
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
	let gr=createVector(0,0.9);
	// let gd=createVector(0,-0.8);

	// if(vel.y>0) vel.mult(0.9);
	// else
	vel.add(gr);
	pos.add(vel);
	if(add < 0){
		cacts.shift();
		cacts.push(random(cactus.height,cactus.height+20));
		add=200;
	}

	// cacts.push(random(50,100));

	stroke();
	let pt=-200;
	for(let cac of cacts){
		// rect();
		image(cactus, add+(pt+=200), height-cac, cactus.width, cac);
		// image(ck, );
	}
	add-=deltaTime*0.2;

	fill(255);
	// circle(pos.x, pos.y,50);
	image(dino,pos.x-20, pos.y-20);
	fill(0,200,0);
	noStroke();
	rect(0,height,width,height);
}

keyPressed=function(){
	let gd=createVector(0,70);
	vel.add(gd);
}
require("../");

function rectDim(rect){
	return {
		min:{
			x: Math.min(rect[0][0], rect[1][0], rect[2][0], rect[3][0]),
			y: Math.min(rect[0][1], rect[1][1], rect[2][1], rect[3][1])
		},
		max:{
			x: Math.max(rect[0][0], rect[1][0], rect[2][0], rect[3][0]),
			y: Math.max(rect[0][1], rect[1][1], rect[2][1], rect[3][1])
		}
	};
}
function isCollision(rectA, rectB){
	if(rectB.length===1){
		let rect=[];
		for(let i=0;i<4;i++){
			rect.push(rectB[0]);
		}
		rectB=rect;
	}
	const dimA=rectDim(rectA);
	const dimB=rectDim(rectB);
	if((dimA.max.x >= dimB.min.x && dimA.min.x <= dimB.max.x)
	&&(dimA.max.y >= dimB.min.y && dimA.min.y <= dimB.max.y)) return true;

	return false;
}

require("");