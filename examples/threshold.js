const Sketch = require("../");

function rcToInd(r, c, d) {
  return c * d + r;
}

function indToRc(ind, d) {
  const c = int(ind / d);
  return [ind - d * c, c];
}

let img;

let se = [
  1, 1, 1,
  1, 1, 0,
  1, 1, 1
];

class Mine extends Sketch {
  src = "../sams/chicken.png";
  se = se;
  preload() {
    img = loadImage(this.src);
  }

  setup() {
    const se = this.se;
    createWindow();
    background(255);
    image(img, 0, 0);
    loadPixels(0, 0, img.width, img.height);
    const data = getPixelData();

    for (let i = 0; i < img.width; i++) {
      for (let j = 0; j < img.height; j++) {

        let cpx = getPixelOf(data, i, j)[0];
        cpx = abs(cpx - 200) < 10 ? 255 : 0;

        let cl = 255;
        if (se.every((val, ind) => {
            const [x, y] = indToRc(ind, 3);
            let px = getPixelOf(data, i + x - 1, j + y - 1)[0];
            px = (px - 200) < 10 ? 255 : 0;
            return val * 255 === px || val === 2;
          })) {
          cl = 0;
        }
        cl = cl == 255 && cpx == 255 ? 255 : 0;
        // cl = cpx - cl;
        if (cl == 0) setPixel(i, j, [cl, cl, cl, 100]);
      }
    }

    updatePixels(img.width, 0);
  }
}

Mine.run();
