const {
	Canvas
} = require("canvas");
const {
	createWriteStream
} = require("fs");

module.exports = class extends Canvas{

	constructor(wid, hei, renderer){
		super(wid, hei);
	}

	get context(){
		return this.getContext("2d");
	}

	save(name){
		const out = createWriteStream(`${name}`);
    const stream = this.createPNGStream();
    stream.pipe(out);
    out.on('finish', () =>  console.log(`drawing to file: ${name}`));
	}

}
