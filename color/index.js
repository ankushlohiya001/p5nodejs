const colorParse = require("color-parse");
const colorSpace = require("color-space");
const Mode = require("./../constants");
const math = require("./../math").mathFuns;

class Color {
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
    let color = "";
    let alpha = 100;
    if (typeof pars[0] == "array") {
      pars = [...pars[0], pars[1]];
    }
    let spaceAlpha;
    switch (pars.length) {
      case 1:
      case 2: {
        let [a, b] = pars;
        b = b || alpha;
        switch (a.constructor) {
          case String:
            let col = colorParse(a.toLowerCase());
            if (col.space){
              color = col.values;
              b = col.alpha*100;
            }
            else color = [0, 0, 0];
            break;
          case Number:
            color = [a, a, a];
            break;
          case Color:
            return a.copy();
          default:
            color = [0, 0, 0];
        }
        alpha = parseFloat(b);
      }
      break;
    case 3:
    case 4: {
      let [a, b, c, d] = pars;
      alpha = d || alpha;
      switch (colorMode) {
        case Mode.HSL:
          colorMode = 'hsl';
          break;
        case Mode.HSB:
          colorMode = 'hsv';
          break;
        default:
          colorMode = 'rgb';
      }
      color = colorSpace[colorMode].rgb([a, b, c]);
    }
    }
    let tmpColor = new Color(color);
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
    colorMode = colorMode === Mode.HSB ? 'hsv' : 'hsl';
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
}

/////////////////////////////////////////////////////////
let state = {};

const colorFuns = {
  Color,
  color(...params) {
    return Color.color(state._colorMode, ...params);
  },

  red(col) {
    return Color.red(col);
  },

  green(col) {
    return Color.green(col);
  },

  blue(col) {
    return Color.blue(col);
  },

  alpha(col) {
    return Color.alpha(col);
  },

  hue(col) {
    return Color.hue(col);
  },

  saturation(col) {
    return Color.saturation(col, state._colorMode);
  },

  lightness(col) {
    return Color.lightness(col);
  },

  brightness(col) {
    return Color.brightness(col);
  },

  lerpColor(col1, col2, amount) {
    return Color.lerpColor(col1, col2, amount);
  }
};


module.exports = {
  setState(stat){
    state = stat;
  },
  colorFuns
};