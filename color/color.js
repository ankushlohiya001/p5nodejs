const colorParse = require("color-parse");
const colorSpace = require("color-space");
const math = require("./../math").globals;

class Color {
  static RGB_MAX = [255, 255, 255];
  static HSL_MAX = [360, 100, 100];
  static HSB_MAX = [360, 100, 100];

  constructor(color, spaces = null) {
    if (!(color && color.constructor == Array)) return;
    this.value = [...color.map(math.round)];
    this.alpha = color[3];
    this.colorSpaces = {
      rgb: [0, 0, 0],
      hsl: [0, 0, 0],
      hsv: [0, 0, 0]
    };
    if (spaces && typeof spaces == "object") {
      Object.assign(this.colorSpaces, spaces);
    } else {
      this._updateColorSpaces();
    }

  }

  _updateColorSpaces() {
      this.colorSpaces.hsl = (colorSpace.rgb.hsl(this.value)).map(math.round);
      this.colorSpaces.hsv = (colorSpace.rgb.hsv(this.value)).map(math.round);
      this.colorSpaces.rgb = this.value
    }
    //////////////////////
    //under discussion 

  get r() {
    return this.value[0];
  }

  get g() {
    return this.value[1];
  }

  get b() {
    return this.value[2];
  }

  get a() {
    return this.alpha * 100;
  }

  setRed(val) {
    this.value[0] = math.round(val);
    this._updateColorSpaces();
  }

  setGreen(val) {
    this.value[1] = math.round(val);
    this._updateColorSpaces();
  }

  setBlue(val) {
    this.value[2] = math.round(val);
    this._updateColorSpaces();
  }

  setAlpha(val) {
    this.alpha = val / 100;
  }

  toString() {
    let [r, g, b] = this.value;
    r = math.hex(r, 2);
    g = math.hex(g, 2);
    b = math.hex(b, 2);
    let a = math.hex(math.round(this.alpha * 255), 2);
    return `#${r}${g}${b}${a}`;
  }

  toColorObj() {
    const [r, g, b] = this.value;
    const a = this.alpha * 255;
    return {
      r,
      g,
      b,
      a
    };
  }

  copy() {
    let tmpColor = new Color(this.value, this.colorSpaces);
    tmpColor.alpha = this.alpha;
    return tmpColor;
  }

  static color(colorMode, ...pars) {
    if (pars.length < 1) pars[0] = 0;
    let color = [0, 0, 0];
    let alpha = 100;
    if (typeof pars[0] == "array") {
      pars = [...pars[0], pars[1]];
    }
    let spaceAlpha;
    switch (pars.length) {
      case 1:
      case 2:
        {
          const b = parseFloat(pars[1]);
          const par = pars[0];
          switch (par.constructor) {
            case String:
              let col = colorParse(par.toLowerCase());
              color = !!col.space ? col.values : [0, 0, 0];
              alpha = col.alpha * 100;
              break;
            case Number:
              color = [par, par, par];
              break;
            case Color:
              color = par.copy();
              if(!Number.isNaN(b)) color.setAlpha(b); 
              return color;
          }
          if(!Number.isNaN(b)) alpha = b;
        }
        break;
      case 3:
      case 4:
        {
          const d = parseFloat(pars[3]);
          alpha = Number.isNaN(d) ? 100 : d;
          let spaceMax;
          switch (colorMode) {
            case Color.modes.HSL:
              colorMode = 'hsl';
              spaceMax = Color.HSL_MAX;
              break;
            case Color.modes.HSB:
              colorMode = 'hsv';
              spaceMax = Color.HSB_MAX;
              break;
            default:
              colorMode = 'rgb';
              spaceMax = Color.RGB_MAX;
          }
          pars = pars.map((val, i)=>math.constrain(val, 0, spaceMax[i]));
          color = colorSpace[colorMode].rgb(pars);
        }
    }
    const tmpColor = new Color(color);
    tmpColor.alpha = alpha / 100;
    return tmpColor;
  }

  static red(color) {
    return color.colorSpaces.rgb[0];
  }

  static green(color) {
    return color.colorSpaces.rgb[1];
  }

  static blue(color) {
    return color.colorSpaces.rgb[2];
  }

  static alpha(color) {
    return color.alpha * 100;
  }

  static hue(color) {
    return color.colorSpaces.hsl[0];
  }

  static saturation(color, colorMode) {
    colorMode = colorMode === Color.modes.HSB ? 'hsv' : 'hsl';
    return color.colorSpaces[colorMode][1];
  }

  static lightness(color) {
    return color.colorSpaces.hsl[2];
  }

  static brightness(color) {
    return color.colorSpaces.hsv[2];
  }

  static invert(color) {
    let r, g, b, a;
    r = 255 - Color.red(color);
    g = 255 - Color.green(color);
    b = 255 - Color.blue(color);
    return new Color([r, g, b]);
  }

  static lerpColor(color_1, color_2, amount) {
    let cl1 = color_1.value;
    let cl2 = color_2.value;
    let colorArr = [];
    for (let i = 0; i < 3; i++) {
      colorArr.push(math.lerp(cl1[i], cl2[i], amount));
    }
    return new Color(colorArr);
  }

  static mix(...colors) {
    let [r, g, b] = [0, 0, 0];
    for (let color of colors) {
      r += Color.red(color);
      g += Color.green(color);
      b += Color.blue(color);
    }
    r /= colors.length;
    g /= colors.length;
    b /= colors.length;
    return new Color([r, g, b]);
  }

  static RGB_HSL(r, g, b) {
    return colorSpace.rgb.hsl([r, g, b]);
  }

  static RGB_HSV(r, g, b) {
    return colorSpace.rgb.hsv([r, g, b]);
  }

  static HSL_RGB(h, s, l) {
    return colorSpace.hsl.rgb([h, s, l]);
  }

  static HSL_HSV(h, s, l) {
    return colorSpace.hsl.hsv([h, s, l]);
  }

  static HSV_RGB(h, s, v) {
    return colorSpace.hsv.rgb([h, s, v]);
  }

  static HSV_HSL(h, s, v) {
    return colorSpace.hsv.hsl([h, s, v]);
  }
}

module.exports = Color;
