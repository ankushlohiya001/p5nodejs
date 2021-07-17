const Mode=require("./../constants");
const {isCollision, createRect}=require("./../math/rect_collision.js");
let state={};
let elems=[];

class Element{
	static defaultStyling={
		title:"element",
		background: "#fff",
		color: "#000",
		border_color: "#000",
		border_width: 2,
		border_radius: 0,
		padding_h: 2,
		padding_v: 2,
		width: 0,
		height: 0
	}
	constructor(obj={}){
		this.title=obj.title;
		Object.assign(this, Element.defaultStyling, obj);
		this.calc();
		elems.push(this);
	}
	setTitle(title){
		this.title=title;
		this.calc();
	}
	calc(){
		this.vertices=createRect(this.posx, this.posy, this.width, this.height);
	}
	onMouseMove(){}
	onMouseOut(){}
	onClick(){}
	updateDataOnEvent(state){
		if(isCollision(this.vertices, [[state.mouseX, state.mouseY]])){
			this.isOver=true;
			this.onMouseMove();
			if(state.mouseIsPressed && !this.isPressed){
				this.isPressed=true;
			}else if(!state.mouseIsPressed && this.isPressed){
				this.isPressed=false;
				this.onClick();
			}

		}else{
			this.isOver=false;
			this.isPressed=false;
			this.onMouseOut();
		}
	}
	draw(){}
}

class Button extends Element{
	static defaultStyling={
		title:"button",
		text_size: 16,
		text_halign: Mode.CENTER,
		text_valign: Mode.CENTER,
	}
	constructor(obj={}){
		super();
		Object.assign(this, Button.defaultStyling, obj);
	}
	calc(){
		this.height = this.text_size + this.padding_v*2; 
		this.width = this.text_size*0.8*this.title.length + this.padding_h*2;
		Element.prototype.calc.call(this);
	}
	setTextSize(size){
		this.text_size=size;
		this.calc();
	}
	draw(){
		if(!state.drawingContext) return;
		this.updateDataOnEvent(state);
		const ctx=state.drawingContext;
		ctx.save();
		ctx.beginPath();
		ctx.strokeStyle=this.border_color;
		ctx.fillStyle=this.background;
		ctx.lineWidth=this.border_width;
		ctx.rect(this.posx, this.posy, this.width, this.height);
		ctx.fill();
		ctx.stroke();
		ctx.beginPath();
		ctx.fillStyle=this.color;
		ctx.font=`${this.text_size}px sans`;
		ctx.textAlign="center";
		ctx.textBaseline="middle";
		ctx.fillText(this.title, this.posx+this.width/2, this.posy+this.height/2);
		ctx.restore();
	}
}

class Range extends Element{
	static defaultParams={
		min: 0,
		max: 100,
		step: 1
	}
	constructor(obj={}){
		super();
		Object.assign(this, Range.defaultParams, obj);
	}
	draw(){
		if(!state.drawingContext) return;
		this.updateDataOnEvent(state);
		const ctx=state.drawingContext;
		ctx.save();
		ctx.beginPath();
		ctx.strokeStyle=this.border_color;
		ctx.fillStyle=this.background;
		ctx.lineWidth=this.border_width;
		ctx.rect(this.posx, this.posy, this.width, this.height);
		ctx.fill();
		ctx.stroke();
		ctx.beginPath();
		// ctx.rect(this.pos);
		ctx.restore();
	}	 
}

function ioDrawer(){
	for(let elem of elems){
		elem.draw();
	}
}


module.exports={
	setState(stat){
		state=stat;
	},
	ioDrawer,
	globals:{
		createButton(title, posx, posy){
			const btn=new Button({title, posx, posy});
			return btn;
		},
		createRange(min, max, step){
			const range=new Range({min, max, step});
			return range;
		}
	}
}