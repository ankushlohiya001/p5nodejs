const loadImage = require("canvas").loadImage;
class Image {
  constructor() {
    this._surface = null;
    this._width = 0;
    this._height = 0;
  }
  get width() {
    return this._width;
  }
  get height() {
    return this._height;
  }
  get surface() {
    return this._surface;
  }
  setSurface(surf) {
    this._surface = surf;
    this._width = surf.width;
    this._height = surf.height;
  }
  get isLoaded() {
    return this._surface !== null;
  }
  static loadSurface(buf) {
    return loadImage(buf);
  }
}

module.exports = Image;