setup=function(){
  // noLoop();
  angleMode(DEGREES);
  // frameRate(10);
  strokeWeight(2);
  // noCursor();
  // rectMode(CORNERS);
  grab(); 
  noStroke();
  // print(deltaTime)
  net=[random(100,width), random(100,height)];
}

let pos=[0,0];
let ds=[10,10];
let grav=6;
let k=-0.6;
let pts=[[0,0]];
let score=0;
let net=[0,0];
let timeRemains=10;
let lifes=3;
draw=function(){
  background(0);
  ds[1]+=grav;
  pos[0]+=ds[0]*deltaTime*0.01;
  pos[1]+=ds[1]*deltaTime*0.01;
  if(pos[0] <= 50){
    pos[0]=50;
    ds[0]*=k;
  }
  if(pos[0] >= width - 50){
    pos[0]=width-50;
    ds[0]*=k;
  }
  if(pos[1] <= 50){
    pos[1]=50;
    ds[1]*=k;
  }
  if(pos[1] >= height - 50){
    pos[1]=height-50;
    ds[1]*=k;
  }

  push();
  noFill();
  stroke(200,200,0);
  let rad=100;
  if(score%5==0){
    stroke(random(200),random(200),random(200));
    rad=random(100,120);
  }
  circle(...net,rad);
  pop();
  circle(...pos, 100);
  if(dist(...net, ...pos)<100){
    if(score%5==0 && lifes==3) score+=10;
    if(score%5==0 && lifes<3) lifes++;
    score++;
    net=[random(100,width), random(100,height)];
    timeRemains=10;
  }
  timeRemains-=deltaTime*0.001;
  if(timeRemains<0){
    lifes--;
    timeRemains=10;
  }
  if(rub.length>1){
    push();
    strokeWeight(8);
    let len=dist(...rub, mouseX, mouseY);
    if(len>400) stroke("red");
    else if(len>200) stroke("orange");
    else stroke("green");
    line(...rub, mouseX, mouseY);
    pop();
  }

  push();
  textSize(30);
  text(score,100,100);
  text(floor(timeRemains),100,200);
  pop();
  push();
  noFill();
  stroke("red");
  for(let i=0;i<lifes;i++){
    circle(100+i*80,250,50);
  }
  pop();
  if(lifes<=0){
    after(3000, exit);
    noLoop();
    background(0);
    textSize(70);
    textAlign(CENTER);
    text("game over", width/2, height/2);
    text(`Score: ${score}`, width/2, height/2+100);
  }
}
let rub=[];
mousePressed=function(){
  rub=[mouseX, mouseY];
}
// mouseDragged=function(){
// }
mouseReleased=function(){
  ds[1]+=-(mouseY-rub[1])*0.5;
  ds[0]+=-(mouseX-rub[0])*0.5;
  rub=[];
}
require("../");