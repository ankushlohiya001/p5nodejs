const Maths = require("./../math")
const Shaper = require("./shaper");

let shaper = null;

Shaper.useRenderer = function(renderer){
	shaper = renderer.shaper;
}

const modes = Shaper.modes = {
  CHORD: Symbol("CHORD"),
  PIE: Symbol("PIE"),
  OPEN: Symbol("OPEN"),
  CLOSE: Symbol("CLOSE"),

  CORNER: Symbol("CORNER"),
  CORNERS: Symbol("CORNERS"),
  CENTER: Symbol("CENTER"),
  RADIUS: Symbol("RADIUS"),

  POINTS: Symbol("POINTS"),
  LINES: Symbol("LINES"),

  TRIANGLES: Symbol("TRIANGLES"),
  TRIANGLE_FAN: Symbol("TRIANGLE_FAN"),
  TRIANGLE_STRIP: Symbol("TRIANGLE_STRIP"),

  QUADS: Symbol("QUADS"),
  QUAD_STRIP: Symbol("QUAD_STRIP"),
}


const shapes = Shaper.shapes = Shaper.globals = {
  line(sx, sy, ex, ey) {
    shaper.drawShape(ctx => {
      ctx.moveTo(sx, sy);
      ctx.lineTo(ex, ey);
    });
  },

  ellipse(cx, cy, wid, hei) {
    [cx, cy, wid, hei] = shaper.ellipseModer(cx, cy, wid, hei);

    const radX = wid / 2;
    const radY = hei / 2;

    shaper.drawShape(ctx => {
      ctx.ellipse(cx, cy, radX, radY, 0, 0, 44 / 7);
    });
  },

  circle(cx, cy, dia) {
    shapes.ellipse(cx, cy, dia, dia);
  },

  rect(px, py, wid, hei, tl, tr, br, bl) {
    tl = tl || 0;
    tr = tr || tl;
    br = br || tl;
    bl = bl || tl;
    let _wid = abs(wid);
    let _hei = abs(hei);
    const min = (_hei < _wid ? _hei : _wid) / 2;
    tl = Maths.globals.constrain(tl, 0, min);
    tr = Maths.globals.constrain(tr, 0, min);
    br = Maths.globals.constrain(br, 0, min);
    bl = Maths.globals.constrain(bl, 0, min);

    [px, py, wid, hei] = shaper.rectModer(px, py, wid, hei);

    shaper.drawShape(ctx => {
      ctx.moveTo(px + wid / 2, py);
      ctx.arcTo(px + wid, py, px + wid, py + hei / 2, tr);
      ctx.arcTo(px + wid, py + hei, px + wid / 2, py + hei, br);
      ctx.arcTo(px, py + hei, px, py + hei / 2, bl);
      ctx.arcTo(px, py, px + wid / 2, py, tl);
      ctx.lineTo(px + wid / 2, py);
    });
  },

  square(px, py, side, tl, tr, br, bl) {
    shapes.rect(px, py, side, side, tl, tr, br, bl);
  },

  quad(x1, y1, x2, y2, x3, y3, x4, y4) {
    shaper.drawShape(ctx => {
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineTo(x3, y3);
      ctx.lineTo(x4, y4);
      ctx.closePath();
    });
  },

  point(px, py) {
		let crnt;
    function customStyler(state, ctx) {
      if (state._willStroke){
				crnt = ctx.fillStyle;
				ctx.fillStyle = ctx.strokeStyle;
			}
    }

    shaper.drawShape(ctx => {
      const rad = ctx.lineWidth / 2;
      ctx.ellipse(px, py, rad, rad, 0, 0, 44 / 7);
			if(crnt){
				ctx.fill();
				ctx.fillStyle = crnt;
			}
    }, customStyler);
  },

  arc(cx, cy, w, h, st, end) {
    const state = shaper.state;

    [cx, cy, w, h] = shaper.ellipseModer(cx, cy, w, h);
    const arcModerFns = shaper.arcModer(cx, cy);

    st = Maths.angleModer(state, st);
    end = Maths.angleModer(state, end);

    shaper.drawShape(ctx => {
      ctx.ellipse(cx, cy, w / 2, h / 2, 0, st, end);
      if (arcModerFns) arcModerFns(ctx);
    });
  },

  triangle(x1, y1, x2, y2, x3, y3) {
    shaper.drawShape(ctx => {
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineTo(x3, y3);
      ctx.closePath();
    });
  },

  vertex(px, py) {
    shaper._vertices.push([px, py]);
  },

  endShape(mode) {
    const state = shaper.state;
    const ctx = shaper.context;
    let fan;
    // if (state._shapeMode === null) return;
    if(shaper._vertices.length == 0) return;
    switch (state._shapeMode) {
      case modes.POINTS:
        {
          for (let pt of shaper._vertices) {
            shapes.point(pt[0], pt[1]);
          }
        }
        break;
      case modes.LINES:
        {
          let last = shaper._vertices[0];
          for (let i = 1; i < shaper._vertices.length; i ++) {
            const crnt = shaper._vertices[i];
            shapes.line(last[0], last[1], crnt[0], crnt[1]);
            last = crnt;
          }
        }
        break;
      case modes.TRIANGLES:
        {
          for (let i = 0; i < shaper._vertices.length; i += 3) {
            if (i + 2 >= shaper._vertices.length) break;
            const pt = shaper._vertices[i],
              qt = shaper._vertices[i + 1],
              rt = shaper._vertices[i + 2];
            shapes.triangle(pt[0], pt[1], qt[0], qt[1], rt[0], rt[1]);
          }
        }
        break;
      case modes.QUADS:
        {
          for (let i = 0; i < shaper._vertices.length; i += 4) {
            if (i + 3 >= shaper._vertices.length) break;
            const pt = shaper._vertices[i],
              qt = shaper._vertices[i + 1],
              rt = shaper._vertices[i + 2],
              st = shaper._vertices[i + 3];
            shapes.quad(pt[0], pt[1], qt[0], qt[1], rt[0], rt[1], st[0], st[1]);
          }
        }
        break;
        break;
      case modes.TRIANGLE_STRIP:
        break;
      case modes.QUAD_STRIP:
        break;
      case modes.TRIANGLE_FAN:
        fan = function() {
          const pt = shaper._vertices[0];
          for (let i = 2; i < shaper._vertices.length - 1; i++) {
            const qt = shaper._vertices[i]
            shapes.line(pt[0], pt[1], qt[0], qt[1]);
          }
        }
      default:
        {
          const init = shaper._vertices[0];
          shaper.drawShape(ctx => {
            ctx.moveTo(init[0], init[1]);
            for (let i = 1; i < shaper._vertices.length; i++) {
              const pt = shaper._vertices[i];
              ctx.lineTo(pt[0], pt[1]);
            }
            if (mode === modes.CLOSE) ctx.closePath();
          });
          (fan || function() {}).call(shaper);
        }
    }
    state._shapeMode = null;
    shaper._vertices = [];
  },

  text(txt, posx, posy) {
    const state = shaper.state;
    shaper.drawShape(ctx => {
      if (state._willFill) ctx.fillText(txt, posx, posy);
      if (state._willStroke) ctx.strokeText(txt, posx, posy);
    });
  },

  image(img, ...pars) {
    if (!img.surface) return;
    let ix, iy, iw, ih, dx, dy, dw, dh;
    const parLen = pars.length;
    switch (parLen) {
      case 2:
        [dx, dy] = pars;
        ix = iy = 0;
        iw = dw = img.width;
        ih = dh = img.height;
        break;
      case 4:
        [dx, dy, dw, dh] = pars;
        ix = iy = 0;
        iw = img.width;
        ih = img.height;
        break;
      case 8:
        [ix, iy, iw, ih, dx, dy, dw, dh] = pars;
        break;
      default:
        throw ("wrong parameter combination!!");
        return;
    }

    [dx, dy, dw, dh] = shaper.rectModer(dx, dy, dw, dh);

    shaper.drawShape(ctx => {
      ctx.drawImage(img.surface, ix, iy, iw, ih, dx, dy, dw, dh);
    });
  },

};


module.exports = Shaper; 
