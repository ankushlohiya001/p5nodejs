// function pixelLoop(pixels, func){
// 	const [wid, hei]=[pixels.width, pixels.height];
// 	for(let x=0; x < wid; x++){
// 	  for(let y=0; y < hei; y++){
// 	    func(x, y);
// 	  }
// 	}
// }

// function setPixel(pixels, px, py, col){
// 	if(typeof col=="object" && col.constructor===Color){
// 	  const ind=py * pixels.width*4 + 4*px;
// 	  if(ind<pixels.data.length){
// 	    pixels.data[ind]=col.value[0];
// 	    pixels.data[ind+1]=col.value[1];
// 	    pixels.data[ind+2]=col.value[2];
// 	    pixels.data[ind+3]=col.alpha*255;
// 	  }
// 	}
// }

// function getPixel(px, py){
//     const pixels=this._pixelData;
//     if(pixels){
//       const ind=py * pixels.width*4 + 4*px;
//       if(ind>=pixels.data.length) return color(0,0,0,0);
//       return color(pixels.data[ind], pixels.data[ind+1], pixels.data[ind+2], pixels.data[ind+3]*0.392156863);
//     }
//     return color(0,0,0,0);
//   }

// function updatePixels(x=null, y=null, dw=null, dh=null){
//     const pixels=this._pixelData;
//     dw=dw || pixels.width;
//     dh=dh || pixels.height;
//     if(x==null) x=pixels.loc.x;
//     if(y==null) y=pixels.loc.y;
//     this.context.putImageData(this._pixelData, x, y, 0, 0, dw, dh);
//     this._pixelData=null;
//   }

// // module.exports={
// // 	Pixel
// // }