const Context = require("./context");
const modes = Context.modes = require("./modes");

let context = new Context;

Context.useRenderer = function(renderer){
  context.setRenderer(renderer);
}

Context.defaults = {

};

const globals = Context.globals = {

};

module.exports = Context;
