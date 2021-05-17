const GifEncoder=require("gif-encoder");
let giffy=new GifEncoder(1280, 720);
giffy.writeHeader()
const str=require("fs").createWriteStream("./pacman.gif");

giffy.pipe(str);