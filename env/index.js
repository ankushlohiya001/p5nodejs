// const Mode = require("./../constants");
const readline = require("readline");

//const interface = readline.createInterface({
//  input: process.stdin,
//  output: process.stdout,
//  prompt: '>'
//});

module.exports = {
  print(...params) {
    console.log(...params);
  },
  
  after(seconds, dothis, ...params) {
    setTimeout(dothis, seconds * 1000, ...params);
  },
  
//shellInput(){
//  interface.on("line", txt=>{
//    eval(txt);
//    interface.prompt();
//  });
//  interface.prompt();
//}
};
