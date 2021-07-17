setup=function(){
	noLoop();
	wid=width;
	hei=height;
	for(let i=0;i<200;i++){
		pts.push(createVector(random(wid), random(hei)));
	}
}
let wid=700, hei=700;
let pts=[];
draw=function(){
	background(0);

	pts[0].set(mouseX, mouseY);
	loadPixels(0, 0, wid, hei);

	for(let i=0;i<wid;i++){
		for(let j=0;j<hei;j++){
			let ind=0;
			let mD=Infinity;
			for(let k=0;k<pts.length;k++){
				let dis=dist(i, j, pts[k].x, pts[k].y);
				if(dis < mD){
					mD=dis;
					ind=k;
				}
			}
			let col=map(mD, 0, width/12, 0, 255);
			setPixel(i, j, [col, col, col, 100]);
		}
	}

	updatePixels();
	// for(let pt of pts) pt.add(Vector.random2d().setMag(4));
		// circle(pt.x, pt.y, 20);
}
require("../");