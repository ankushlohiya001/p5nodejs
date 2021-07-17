setup=function(){
	// noLoop();
	angleMode(DEGREES);
	// frameRate(10);
  strokeWeight(2);
  // noCursor();
  let rat=(height/width);
  let dx=200;
  let dy=rat*200;
  for(let i=0;i<40;i++){
  	let [px, py]=[random(width-dx), random(height-dy)];
  	lines.push(createLine(px, py, px+random(-dx,dx), py+random(dy,dy)));
  }

  // rectMode(CORNERS);
  noFill();
}

let lines=[];
let length=800;
let ang=0;
draw=function(){
	let refs=[];
  background(0);
  // translate(width/2, height/2);
  if(keyIsPressed){
  	if(keyCode===37) ang--;
  	if(keyCode===39) ang++;
  }
  strokeWeight(2);
  stroke(255,0,0);
  for(let i=ang;i<ang+90;i+=2){
  	let [px, py]=[mouseX+length*cos(i), mouseY+length*sin(i)];
  	const lin2=createLine(mouseX, mouseY, px, py);

  	let cont=false;
  	let conect=[];
  	let min=Infinity;
  	for(let lin of lines){
	  	let inter=Line.intersectionOf(lin, lin2);
	  	if(!inter) continue;
	  	cont=true;
	  	let len = dist(lin2.x1, lin2.y1, ...inter);
	  	if(len < min){
	  		min=len;
	  		conect=[...inter];
	  	}
  	}
	  	refs.push(min);
  	if(cont){
	  	line(lin2.x1, lin2.y1, ...conect);
	  	// circle(...conect, 10);
  		continue;
  	}
  	line(lin2.x1, lin2.y1, lin2.x2, lin2.y2);
  }
  push();
  stroke(200);
  strokeWeight(10);
  for(let lin of lines){
  	line(lin.x1, lin.y1, lin.x2, lin.y2);
  }
  pop();
  push();
  noStroke();
  // fill(0);
  // rect(0,0,200,200);
  let [wid, hei]=[width/2,height/2];
  let rate=wid/refs.length;
  // print(rate);
  for(let i=0;i<refs.length;i++){
  	if(abs(refs[i])==Infinity) continue;
  	let shade=map(refs[i],0,length,200,0);
  	let size=map(refs[i],0,length,hei,0);
  	fill(shade);
  	let start=(hei-size)/2;
  	rect(i*rate, start,rate+1 ,size);
  }
  pop();
}

// keyPressed=function(){
// 	saveCanvas();
// }
require("./../");

// 0,0,600,200


// 100,200  200,100 

// (y-y1)/(x-x1)=m
// y = m(x - x1) + y1
// (y-y1)/m+x1=x
