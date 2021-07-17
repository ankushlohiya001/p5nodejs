
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

let recA,recB;
setup=function(){
	// noLoop();
	frameRate(30);
	angleMode(DEGREES);
	// ellipseMode(CORNER);
	recA=[[300,200],[350,200],[350,250],[300,250]];
	// noStroke();
	colorMode(HSL);
}
let rad=0;
let img;
let pos=[300,200];
let started=false;
let scl=0;
let inpTxt="";
draw=function(){
	background(map(scl, 0, 300, 0, 360),100,50);
	// rotate(45);
	recB=[[mouseX, mouseY]];
	fill(255);
	
	if(mouseIsPressed && started){
		fill(150);
		// noFill();
		let xpos=constrain(mouseX-25,300,600);
		scl=xpos-300;
		pos=[xpos, 200];
	}else{
		started=false;
	}
	
	if(isCollision(recA, recB)){
		cursor(HAND);
		if(mouseIsPressed) started=true;
	}else{
		cursor(ARROW);
		rad=0;
	}
	push();
	fill(330,100,50);
	rect(325,215,300,20,10);
	pop();

	recA=[[pos[0],pos[1]],[pos[0]+50,pos[1]],[pos[0]+50,pos[1]+50],[pos[0],pos[1]+50]];
	rect(...pos, 50, 50,50);

	// if(keyIsPressed){
	
	// }
	rect(400,300, 200, 50);
	push();
	noStroke();
	textAlign(CENTER, CENTER);
	textSize(36);
	fill(20);
	text(inpTxt, 500, 325);
	pop();
}
keyPressed=function(eve){
	let modkey=key.toLowerCase();
	if(modkey==="backspace") inpTxt=inpTxt.slice(0, inpTxt.length-1);
	else if(key.length===1){
		let modkey=key;
		if(eve.shiftKey){
			modkey=key.toUpperCase();
		}
		inpTxt+=modkey;
	}
}
require("./../");