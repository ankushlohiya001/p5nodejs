const modes = [

];

for(let mode of modes){
  module.exports[mode] = Symbol(mode);
}
