const fetch = require("node-fetch");
const fs = require("fs");
const Image = require("./../image");
// const Sound = require("./../audio");

const waiter = {
  _pendingEves: 0,

  isWaiting() {
    return this._pendingEves !== 0;
  },
  addWait() {
    this._pendingEves++;
  },
  finishWait() {
    if (this._pendingEves === 0) return;
    this._pendingEves--;
  },
};

const requests = {
  preloadDone() {
    return !waiter.isWaiting();
  },

  httpDo(path, options, scsMethod, errMethod) {
    return fetch(path, options)
      .then(res => {
        const {
          resType
        } = options;
        if (!resType) return res;
        switch (resType) {
          case "buffer":
            return res.arrayBuffer();
            break;
          case "json":
            return res.json();
            break;
          case "text":
          case "string":
          case "lines":
            return res.text();
            break;
          case "buffer":
          default:
            return res.buffer();
        }
      })
      .then(scsMethod || function() {})
      .catch(errMethod || function() {});
  },

  httpGet(path, options, scsMethod, errMethod) {
    return httpDo(path, Object.assign({}, options, {
      method: "GET"
    }), scsMethod, errMethod);
  },

  httpPost(path, options, scsMethod, errMethod) {
    return httpDo(path, Object.assign({}, options, {
      method: "POST"
    }), scsMethod, errMethod);
  },

  loadJSON(path, scsMethod, errMethod) {
    scsMethod = scsMethod || function() {};
    errMethod = errMethod || function() {};

    const jsonObj = {
      data: null
    };
    waiter.addWait();

    const scsMethodMod = function(res) {
      waiter.finishWait();
      jsonObj.data = res;
      scsMethod(res);
    }

    if (typeof path == "object" && path.constructor === Buffer) {
      scsMethodMod(JSON.parse(path));
      return jsonObj;
    }

    if (path.startsWith("http")) {
      fetch(path)
        .then(res => res.json())
        .then(scsMethodMod)
        .catch(err => {
          waiter.finishWait();
          errMethod(err);
        });
    } else {
      fs.readFile(path, "utf-8", (err, data) => {
        if (err) {
          waiter.finishWait();
          errMethod(err);
          return;
        }
        scsMethodMod(JSON.parse(data));
      })
    }

    return jsonObj;
  },

  loadStrings(path, scsMethod, errMethod) {
    scsMethod = scsMethod || function() {};
    errMethod = errMethod || function() {};

    const stringLines = [];
    waiter.addWait();

    const scsMethodMod = function(res) {
      waiter.finishWait();
      const lines = res.split("\n");
      for (let line of lines) {
        stringLines.push(line);
      }
      scsMethod(lines);
    }

    if (typeof path == "object" && path.constructor === Buffer) {
      scsMethodMod(path.toString());
      return image;
    }

    if (path.startsWith("http")) {
      fetch(path)
        .then(res => res.text())
        .then(scsMethodMod)
        .catch(err => {
          waiter.finishWait();
          errMethod(err);
        });
    } else {
      fs.readFile(path, "utf-8", (err, data) => {
        if (err) {
          waiter.finishWait();
          errMethod(err);
          return;
        }
        scsMethodMod(data);
      })
    }

    return stringLines;
  },

  loadImage(path, scsMethod, errMethod) {
    scsMethod = scsMethod || function() {};
    errMethod = errMethod || function() {};

    let image = new Image();
    waiter.addWait();

    Image
      .loadSurface(path)
      .then(surface => {
        waiter.finishWait();
        image.setSurface(surface);
        scsMethod(image);
      })
      .catch(err => {
        waiter.finishWait();
        errMethod(err);
      });

    return image;
  },

  // loadSound(path, scsMethod, errMethod) {
  //   scsMethod = scsMethod || function() {};
  //   errMethod = errMethod || function() {};

  //   let sound = new Sound();
  //   waiter.addWait();

  //   Sound
  //     .loadSound(path)
  //     .then(audBuf => {
  //       waiter.finishWait();
  //       sound.setBuffer(audBuf);
  //       scsMethod(sound);
  //     })
  //     .catch(err => {
  //       waiter.finishWait();
  //       errMethod(err);
  //     });;


  //   return sound;
  // }

};

module.exports = requests;