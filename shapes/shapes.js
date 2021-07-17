const Mode = require("./../constants");
const math = require("./../math").mathFuns;

const stateChanger = require("./../state").stateChanger;

let shaper = {};

const shapes = {
  line(sx, sy, ex, ey) {
    shaper.drawShape(ctx => {
      ctx.moveTo(sx, sy);
      ctx.lineTo(ex, ey);
    });
  },

  ellipse(cx, cy, wid, hei) {
    hei = hei || wid;

    const Shaper = shaper.constructor;

    [cx, cy, wid, hei] = Shaper.ellipseModer(cx, cy, wid, hei, shaper.state._ellipseMode);

    const radX = wid / 2;
    const radY = hei / 2;

    shaper.drawShape(ctx => {
      ctx.ellipse(cx, cy, radX, radY, 0, 0, 44 / 7);
    });
  },

  circle(cx, cy, dia) {
    shapes.ellipse.call(shaper, cx, cy, dia);
  },

  rect(px, py, wid, hei, tl, tr, br, bl) {
    tl = tl || 0;
    tr = tr || tl;
    br = br || tl;
    bl = bl || tl;
    let _wid = abs(wid);
    let _hei = abs(hei);
    const min = (_hei < _wid ? _hei : _wid) / 2;
    tl = math.constrain(tl, 0, min);
    tr = math.constrain(tr, 0, min);
    br = math.constrain(br, 0, min);
    bl = math.constrain(bl, 0, min);

    const Shaper = shaper.constructor;

    [px, py, wid, hei] = Shaper.rectModer(px, py, wid, hei, shaper.state._rectMode);

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
    shapes.rect.call(shaper, px, py, side, side, tl, tr, br, bl);
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
    function customStyler(state, ctx) {
      if (state._willStroke) stateChanger.fill(ctx.strokeStyle);
      else stateChanger.noFill();
      stateChanger.noStroke();
    }

    shaper.drawShape(ctx => {
      const rad = ctx.lineWidth / 2;
      ctx.ellipse(px, py, rad, rad, 0, 0, 44 / 7);
    }, customStyler);
  },

  arc(cx, cy, w, h, st, end) {
    const state = shaper.state;
    const Shaper = shaper.constructor;

    [cx, cy, w, h] = Shaper.ellipseModer(cx, cy, w, h, state._ellipseMode);
    const arcModerFns = Shaper.arcModer(cx, cy, state._arcMode);

    st = Shaper.angleModer(st, state._angleMode);
    end = Shaper.angleModer(end, state._angleMode);

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
    if (state._shapeMode === null) return;
    switch (state._shapeMode) {
      case Mode.POINTS:
        {
          for (let pt of shaper._vertices) {
            shaper.point(pt[0], pt[1]);
          }
        }
        break;
      case Mode.LINES:
        {
          for (let i = 0; i < shaper._vertices.length; i += 2) {
            if (i + 1 >= shaper._vertices.length) break;
            const pt = shaper._vertices[i],
              qt = shaper._vertices[i + 1];
            shaper.line(pt[0], pt[1], qt[0], qt[1]);
          }
        }
        break;
      case Mode.TRIANGLES:
        {
          for (let i = 0; i < shaper._vertices.length; i += 3) {
            if (i + 2 >= shaper._vertices.length) break;
            const pt = shaper._vertices[i],
              qt = shaper._vertices[i + 1],
              rt = shaper._vertices[i + 2];
            shaper.triangle(pt[0], pt[1], qt[0], qt[1], rt[0], rt[1]);
          }
        }
        break;
      case Mode.QUADS:
        {
          for (let i = 0; i < shaper._vertices.length; i += 4) {
            if (i + 3 >= shaper._vertices.length) break;
            const pt = shaper._vertices[i],
              qt = shaper._vertices[i + 1],
              rt = shaper._vertices[i + 2],
              st = shaper._vertices[i + 3];
            shaper.quad(pt[0], pt[1], qt[0], qt[1], rt[0], rt[1], st[0], st[1]);
          }
        }
        break;
        break;
      case Mode.TRIANGLE_STRIP:
        break;
      case Mode.QUAD_STRIP:
        break;
      case Mode.TRIANGLE_FAN:
        fan = function() {
          const pt = shaper._vertices[0];
          for (let i = 2; i < shaper._vertices.length - 1; i++) {
            const qt = shaper._vertices[i]
            shaper.line(pt[0], pt[1], qt[0], qt[1]);
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
            if (mode === Mode.CLOSE) ctx.closePath();
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
    const parLen=pars.length;
    switch(parLen){
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
      default: throw ("wrong parameter combination!!");
      return;
    }

    const Shaper = shaper.constructor;
    // [ix, iy, iw, ih] = Shaper.rectModer(ix, iy, iw, ih, shaper.state._imageMode);
    [dx, dy, dw, dh] = Shaper.rectModer(dx, dy, dw, dh, shaper.state._imageMode);

    shaper.drawShape(ctx => {
      ctx.drawImage(img.surface, ix, iy, iw, ih, dx, dy, dw, dh);
    });
  },

};


module.exports = {
  setShaper(shapr){
    shaper = shapr;
  },
  public: shapes
}