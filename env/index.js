// const Mode = require("./../constants");

module.exports = {
  print(...params) {
    console.log(...params);
  },
  
  after(seconds, dothis, ...params) {
    setTimeout(dothis, seconds * 1000, ...params);
  }
};
