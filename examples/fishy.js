const {Particle:{ Triangle }, ParticleSystem}=require("./particle");

Triangle.prototype.draw=function(pos, size){
	colorMode(HSL);
  fill(this.hue,100, 50);
  translate(pos.x, pos.y);
  rotate(this.vel.heading());

  image(fish, -size.x/2, -size.y/2);
	// triangle(0, 0-size.y/2, 0+size.x/2, 0+size.y/2, 0-size.x/2, 0+size.y/2);
}
setup=function(){
	rocks=new ParticleSystem(random(width), random(height));

	rocks.conditionToRemove=rock=>rock.vel.mag()<=0.001 && false;

	rectMode(CENTER);
	angleMode(DEGREES);
	noStroke();
}

let rocks;

const sunSize=200;
let starC=100;
let stars=Array(starC);
let bg;
let wall=200;
let fish;

preload=function(){
	fish=loadImage("./fish.png");
}

draw=function(){
	background(0);
	if(rocks.parts.length<10){
		let tri=new Triangle(random(width),random(height), random(10, 20), random(20, 40));
		tri.vel.set(Vector.random2d().setMag(2));
		rocks.attach(tri);
	}

	push();
	// stroke(255);
	fill(20);
	rect(width/2, height/2, width-wall*2, height-wall*2);
	pop();

	for(let rock of rocks.parts){
		
		let {pos, vel, acc}=rock;

		let steer=createVector();
		let maxsp=2;
		if( pos.x <= wall){
		 	let des = createVector(maxsp, vel.y);
		 	steer= Vector.sub(des, vel);
		}
		if( pos.x >= width - wall){
		 	let des = createVector(-maxsp, vel.y);
		 	steer= Vector.sub(des, vel);
		}

		if( pos.y <= wall){
		 	let des = createVector(vel.x, maxsp);
		 	steer= Vector.sub(des, vel);
		}
		if( pos.y >= height - wall){
		 	let des = createVector(vel.x, -maxsp);
		 	steer= Vector.sub(des, vel);
		}
		 
		steer.limit(0.3);
		acc.add(steer);

		if(mouseIsPressed){
			let food=createVector(mouseX, mouseY);
			let des=Vector.sub(food, pos);
			let dis=des.mag();
			
			if(dis<40) des.setMag(map(dis, 0, 40,0, 2));
			else des.setMag(2);

			let steer=Vector.sub(des, vel);
			steer.limit(0.1);

			acc.add(steer);

			fill("red");
			circle(food.x, food.y, 10);
		}


		vel.add(acc);
		pos.add(vel);
		acc.zero();
	}

	// push();
	// fill(255,255,0);
	// circle(mouse.x, mouse.y, 100);
	// pop();

	rocks.draw();
}

keyPressed=function(){
	if(key==" ") print(rocks.parts.length);
}

require("../");