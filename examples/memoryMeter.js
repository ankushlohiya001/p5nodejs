const os = require("os");
let totalmem = os.totalmem();

setup=function(){
	colorMode(HSL);
	createCanvas(340, 340);
	angleMode(DEGREES);
	frameRate(1);
	strokeWeight(20);
	col = color("tomato");
}

let col;

draw=function(){
	background(0);

	noFill();
	stroke(col, 30);
	circle(width/2, height/2, 300);

	let used = 1 - os.freemem() / totalmem;
	
	stroke(col);
	arc(width/2, height/2, 300, 300, -90, used * 360 - 90);
	
	noStroke();
	fill(col);
	textSize(50);
	textAlign(CENTER, CENTER);
	text((used * 100).toFixed(2)+"%", width/2, height/2);
}

require("../");