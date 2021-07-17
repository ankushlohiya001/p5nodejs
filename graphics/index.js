const Graphics = require("./graphics");

module.exports = {
	Graphics,

	createGraphics(wid, hei){
		return new Graphics(wid, hei);
	}
};