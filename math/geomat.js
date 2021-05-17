class Line {
  static slop(x1 = {}, y1, x2, y2) {
    if (x1.constructor === Line) return x1.slop;
    return (y2 - y1) / (x2 - x1);
  }

  static isParallel(l1, l2) {
    return l1.slop === l2.slop;
  }

  static isPerpend(l1, l2) {
    return l1.slop === (-1 / l2.slop);
  }

  static isEqual(l1, l2) {
    return l1.slop === l2.slop && l1.eqX(0) === l2.eqX(0);
  }

  static intersectionOf(l1, l2, extend = false) {
    if (Line.isEqual(l1, l2)) {
      // console.warn("both lines are same, hance infinite intersections.");
      return;
    }
    if (Line.isParallel(l1, l2)) {
      // console.warn("since lines are parallel, so no intersection.");
      return;
    }
    // x=(b1-y1+mx1-na1)/(m-n)
    let m, n, x1, y1, a1, b1;
    x1 = l1.x1;
    y1 = l1.y1;
    m = l1.slop; //line l1

    a1 = l2.x1;
    b1 = l2.y1;
    n = l2.slop; //line l2

    const interX = (b1 - y1 + m * x1 - n * a1) / (m - n);
    const interY = l1.eqY(interX);

    if (extend) return [interX, interY];

    if (l1.inBoundRect(interX, interY) && l2.inBoundRect(interX, interY)) {
      return [interX, interY];
    }
  }

  static createLine(a, b, c, d) {
    return new Line(a, b, c, d);
  }

  constructor(a, b, c, d) {
    this.x1 = a;
    this.y1 = b;
    this.x2 = c;
    this.y2 = d;
    this.bound = [0, 0, 0, 0];
    if (a < c) {
      this.bound[0] = a;
      this.bound[2] = c;
    } else {
      this.bound[0] = c;
      this.bound[2] = a;
    }

    if (b < d) {
      this.bound[1] = b;
      this.bound[3] = d;
    } else {
      this.bound[1] = d;
      this.bound[3] = b;
    }

  }
  get slop() {
    const {
      x1,
      y1,
      x2,
      y2
    } = this;
    return Line.slop(x1, y1, x2, y2);
  }
  eqX(y) {
    const {
      x1,
      y1
    } = this;
    let m = this.slop;
    if (m === 0) m += 0.0001;
    return (y - y1) / m + x1;
  }

  eqY(x) {
    const {
      x1,
      y1
    } = this;
    let m = this.slop;
    if (m === 0) m += 0.0001;
    return (x - x1) * m + y1;
  }

  inBoundRect(px, py) {
    let [a, b, c, d] = this.bound;
    return (px >= a && px <= c) && (py >= b && py <= d);
  }

  checkPoint(px, py, extend = false) {
    let isValid = px === this.eqX(py)
    if (extend) return isValid;
    return this.inBoundRect(px, py) && isValid;
  }
}

module.exports = {
  Line
};


// class Equation{
// 	static vars(val){
// 		if(typeof val==="number"){
// 			return val;
// 		}
// 		return this[val];
// 	}

// 	setup(crntResult){
// 		this.result=crntResult;
// 		this.lresult=this.result;
// 	}

// 	constructor(){
// 		this.vars={};
// 	}
// 	result(){
// 		return 0;
// 	}
// 	lresult(){
// 		return 0;
// 	}
// 	setVar(nam, val){
// 		this.vars[nam]=val;
// 		return this;
// 	}
// 	getVar(nam){
// 		return this.vars[nam];
// 	}
// 	add(val){
// 		let toAdd=Equation.vars.call(this, val);
// 		this.setup(()=>this.lresult()+toAdd);
// 		return this;
// 	}
// 	sub(val){
// 		let toAdd=Equation.vars.call(this, val);
// 		this.setup(()=>this.lresult()-toAdd);
// 		return this;
// 	}
// 	mul(val){
// 		let toAdd=Equation.vars.call(this, val);
// 		this.setup(()=>this.lresult()*toAdd);
// 		return this;
// 	}
// 	div(val){
// 		let toAdd=Equation.vars.call(this, val);
// 		this.setup(()=>this.lresult()/toAdd);
// 		return this;
// 	}
// }

// // 5-x+4
// let pk=new Equation();
// pk.add(5).sub('x').add(4);
// console.log(pk.result());