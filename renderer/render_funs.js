let renderer = {};

const public = {
  createCanvas(w, h, title) {
    renderer.window.resizeTo(w, h);
    renderer.window.title = title;
  },

  saveCanvas(filename = "nodeP5.png", after) {
    renderer.saveCanvas(filename, after);
  },

  // saveAndExit(filename = "nodeP5.png", wait = 1) {
  //   stateChanger.noLoop.call(renderer.state);
  //   renderer.window.saveAs(filename, () => {
  //     setTimeout(() => {
  //       renderer.exit();
  //     }, wait * 1000);
  //   });
  // },

  redraw(times = 1) {
    for (let i = 0; i < times; i++) {
      if (renderer.pendingDraw) return;
      renderer.pendingDraw = true;
      renderer.loop(renderer.draw);
      renderer.pendingDraw = false;
    }
  },

  alert(mess) {
    return renderer.window.alert(mess);
  },

  confirm(mess) {
    return renderer.window.confirm(mess);
  },

  exit() {
    renderer.exit();
  }
};

module.exports = {
  setRenderer(ren) {
    renderer = ren;
  },
  public
};