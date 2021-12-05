class Particle {
  constructor(px, py) {
    this.pos = createVector(px, py);
    this.vel = createVector();
    this.acc = createVector();
    this.dim = createVector();
    this.mass = 1;
    this.walls = [0, 0, 0, 0];
  }

  setSize(wid, hei) {
    this.dim.set(wid, hei);
  }

  setMass(mass) {
    this.mass = mass;
  }

  updatePos() {
    this.vel.add(this.acc);
    this.acc.zero();
    this.pos.add(this.vel);
  }

  seek(target, maxV = 10, limF = 0.1) {
    let des = Vector.sub(target, this.pos);
    let desMag = des.mag();
    if (desMag < target.rad) des.setMag(map(desMag, 0, maxV, 0, desMag));
    else des.setMag(maxV);
    let steer = Vector.sub(des, this.vel);
    steer.limit(limF);

    this.applyForce(steer);
  }

  follow(movers) {
    let count = 0;
    let avg = createVector();
    for (let mover of movers) {
      let dis = Vector.dist(this.pos, mover.pos);
      if (dis < minD) {
        count++;
        avg.add(mover.vel);
      }
    }
    if (count > 0) {
      avg.div(count);
      avg.setMag(5);

      let steer = Vector.sub(avg, this.vel);
      steer.limit(2);
      this.applyForce(steer);
    }
  }

  join(movers) {
    let count = 0;
    let avg = createVector();
    for (let mover of movers) {
      let dis = Vector.dist(this.pos, mover.pos);
      if (dis < minD) {
        count++;
        avg.add(mover.pos);
      }
    }
    if (count > 0) {
      avg.div(count);
      seek(avg);
    }
  }

  repel(movers) {
    let count = 0;
    let avg = createVector();
    for (let mover of movers) {
      let dis = Vector.dist(this.pos, mover.pos);
      if (dis > 0 && dis < minD) {
        count++;
        let diff = Vector.sub(this.pos, mover.pos);
        diff.normalize();
        diff.div(dis);

        avg.add(diff);
      }
    }
    if (count > 0) {
      avg.div(count);
      avg.setMag(5);

      let steer = Vector.sub(avg, this.vel);
      steer.limit(2);
      this.applyForce(steer);
    }
  }

  constrain() {
    const {
      x,
      y
    } = this.pos;
    let {
      x: wid,
      y: hei
    } = this.dim;
    wid /= 2;
    hei /= 2;

    const [top, right, bottom, left] = this.walls;

    //------top wall (sky)
    if (y - hei <= 0 && top) {
      this.vel.y *= -1;
      this.pos.y = hei;
    }

    //------right wall
    if (x + wid >= width && right) {
      this.vel.x *= -1;
      this.pos.x = width - wid;
    }

    //------bottom wall (ground)	
    if (y + hei >= height && bottom) {
      this.vel.y *= -1;
      this.pos.y = height - hei;
    }

    //------left wall
    if (x - wid <= 0 && left) {
      this.vel.x *= -1;
      this.pos.x = wid;
    }
  }

  applyForce(force) {
    if (typeof force == "object" && force.constructor == Vector) {
      this.acc.add(force.div(this.mass));
    }
  }

  draw() {}

  show() {
    this.updatePos();
    this.constrain();
    push();
    rectMode(CENTER);
    ellipseMode(CENTER);
    this.draw(this.pos, this.dim);
    pop();
  }

  outsideTheView(delta) {
    const [pos, dim] = [this.pos, this.dim];
    return (pos.x < 0 || pos.x > width) ||
      (pos.y < 0 || pos.y > height);
  }
}

class ParticleSystem {
  constructor(px, py) {
    this.pos = createVector(px, py);
    this.list = [];
    this.setWalls();
  }

  get count() {
    return this.list.length;
  }

  setWalls(t = 0, r = 0, b = 0, l = 0) {
    this.walls = [t, r, b, l];
  }

  attach(particle) {
    particle.walls = [...this.walls];
    particle.pos.set(this.pos);
    this.list.push(particle);
  }

  applyForces(forces = []) {
    for (let part of this.list) {
      for (let force of forces) {
        part.applyForce(force);
      }
    }
  }

  // iterateParticles()

  // detachOutsider(){
  // 	for(let i=0;i<this.list.length;i++){			
  // 		if(this.list[i].outsideTheView()){
  // 			this.list[i]=this.list.pop();
  // 			if(i==0 || i+1==this.list.length) break;
  // 			i--;
  // 		}
  // 	}
  // }
  conditionToRemove(part) {
    return part.outsideTheView();
  }

  draw(cb) {
    for (let i = 0; i < this.list.length; i++) {
      const part = this.list[i];
      if (this.conditionToRemove(part)) {
        this.list[i] = this.list.pop();
        let len = this.list.length;
        if (len == 1 || i + 1 == len) break;
        i--;
      } else {
        if (typeof cb === "function") cb(part);
        part.show();
      }
    }
  }
}

////////////////////////
/////////////////////////////////////
class Ball extends Particle {
  constructor(px, py, radx, rady) {
    super(px, py);
    this.setSize(radx, rady);
    this.hue = random(360);
  }

  draw(pos, size) {
    // noStroke();
    colorMode(HSL);
    fill(this.hue, 100, 50);
    ellipse(pos.x, pos.y, size.x, size.y);
  }
}
Particle.Ball = Ball;

class Box extends Particle {
  constructor(px, py, lenx, leny) {
    super(px, py);
    this.setSize(lenx, leny);
    this.hue = random(360);
  }

  draw(pos, size) {
    // noStroke();
    colorMode(HSL);
    fill(this.hue, 100, 50);
    rect(pos.x, pos.y, size.x, size.y);
  }
}
Particle.Box = Box;

class Triangle extends Particle {
  constructor(px, py, lenx, leny) {
    super(px, py);
    this.setSize(lenx, leny);
    this.hue = random(360);
  }
  draw(pos, size) {
    // noStroke();
    colorMode(HSL);
    noStroke();
    fill(this.hue, 100, 50);
    translate(pos.x, pos.y);
    rotate(this.vel.heading());
    triangle(size.x / 2, 0, -size.x / 2, size.y / 2, -size.x / 2, -size.y / 2);
  }
}

Particle.Triangle = Triangle;


class Spring extends Particle.Ball {
  constructor(anchor, len) {
    super(anchor.pos.x + len, anchor.pos.y, 50, 50);
    this.anchor = anchor;
    this.restL = len;
    this.spK = 0.1;
  }

  applySpring() {
    let spF = Vector.sub(this.pos, this.anchor.pos);
    let diff = spF.mag() - this.restL;
    spF.setMag(-1 * this.spK * diff);
    this.applyForce(spF);
    spF.mult(-1);
    if (this.anchor.applyForce) this.anchor.applyForce(spF);
  }

  draw(pos) {
    colorMode(HSL);
    fill(this.hue, 100, 50);
    strokeWeight(4);
    line(this.anchor.pos.x, this.anchor.pos.y, pos.x, pos.y);
    circle(pos.x, pos.y, 50);
  }
}

Particle.Spring = Spring

module.exports = {
  Particle,
  ParticleSystem
};

// [a, b, c, d, e, f]