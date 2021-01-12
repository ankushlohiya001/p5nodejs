const fs=require("fs");
const http=require("http");
const Image=require("./../image");
const {performance}=require("perf_hooks");
class Response{
	constructor(url, res){
		this.httpresponse=res;
		this._url=url;
		this._blob=Buffer.alloc(0);
	}
	get body(){
		return null;
	}
	get headers(){
		return this.httpresponse.headers;
	}
	get ok(){
		return this.httpresponse.statusCode===200;
	}
	get status(){
		return this.httpresponse.statusCode;
	}
	get statusText(){
		return this.httpresponse.statusMessage;
	}
	get url(){  
		return this._url;
	}
	arrayBuffer(){
		return this.blob().then(res=>res.buffer);
	}
	blob(){
		return new Promise(res=>res(this._blob));
	}
	json(){
		return this.text().then(res=>JSON.parse(res));
	}
	text(){
		return this.blob().then(res=>res.toString());
	}
}

function httpDo(path, options, scsMethod, errMethod){
	scsMethod=scsMethod||function(){};
	errMethod=errMethod||function(){};
	return new Promise((result,reject)=>{
		const req=http.request(path, options, res=>{
			const response=new Response(path,res);
			let responseMod=response;

			const resType=options.resType.toLowerCase();
			
			res.on("data",(buf)=>{
				response._blob=Buffer.concat([response._blob, buf]);
			});
			res.on("end", ()=>{
				switch(resType){
					case "blob":responseMod=response.blob();
					break;
					case "buffer":responseMod=response.arrayBuffer();
					break;
					case "json":responseMod=response.json();
					break;
					case "text":
					case "string":
					case "lines":
					responseMod=response.text();
					break;
				}
				result(responseMod);
				scsMethod(responseMod);
			});

		});
		req.end();
		req.on("error",er=>{
			reject(er);
			errMethod(er);
		})
	});
}

module.exports={
	pendingLoads:0,
	makeGlobal(obj, bindTo){
	  const props = Object.getOwnPropertyDescriptors(obj);
	  for(let prop in props){
	    let objDesc=props[prop];
	    if(objDesc.get && bindTo) objDesc.get=objDesc.get.bind(bindTo);
	    if(objDesc.set && bindTo) objDesc.set=objDesc.set.bind(bindTo);
	    if((objDesc.value && typeof objDesc.value == "function")&&bindTo) objDesc.value=objDesc.value.bind(bindTo);
	    Object.defineProperty(global, prop, objDesc);
	  }
	},
	globals:{
		httpDo,
		httpGet(path, options, scsMethod, errMethod){
			return httpDo(path, {...options, method:"GET"},scsMethod, errMethod);
		},
		httpPost(path, options, scsMethod, errMethod){
			return httpDo(path, {...options, method:"POST"},scsMethod, errMethod);
		},
		loadJSON(path, scsMethod=function(){}, errMethod=function(){}){
			let jsonObj={data:null};
			module.exports.pendingLoads++;
			
			if(!path.startsWith("http")){
				fs.readFile(path,"utf-8",(err,data)=>{
					module.exports.pendingLoads--;
					if(err){
						errMethod(err);
					}else{
						const json=JSON.parse(data);
						jsonObj[data]=json;
						scsMethod(json);
					}
				})
				return jsonObj;
			}

			httpDo(path, {method:"GET",resType:"json"})
			.then(res=>{
				module.exports.pendingLoads--;
				jsonObj.data=res;
				scsMethod(res);
			})
			.catch(err=>{
				module.exports.pendingLoads--;
				errMethod(err);
			});
			return jsonObj;
		},
		loadStrings(path, scsMethod=function(){}, errMethod=function(){}){
			let lines=[];
			module.exports.pendingLoads++;

			if(!path.startsWith("http")){
				fs.readFile(path,"utf-8",(err,data)=>{
					module.exports.pendingLoads--;
					if(err){
						errMethod(err);
					}else{
						const lins=data.split("\n");
						let indx=0;
						for(let line of lins){
							lines[indx++]=line;
						}
						scsMethod(lines);
					}
				})
				return lines;
			}

			httpDo(path, {method:"GET",resType:"text"})
			.then(res=>{
				module.exports.pendingLoads--;
				if(typeof res!=="string") return;
				let lins=res.split("\n");
				let indx=0;
				for(let line of lins){
					lines[indx++]=line;
				}
				scsMethod(lines);
			})
			.catch(err=>{
				module.exports.pendingLoads--;
				errMethod(err);
			});
			return lines;
		},
		loadImage(path, scsMethod=function(){}, errMethod=function(){}){
			let image;
			module.exports.pendingLoads++;
			if(!path.startsWith("http")){
				image=Image.loadImage(path);
				image.onload=()=>{
					module.exports.pendingLoads--;
				}
				return image;
			}
			httpDo(path, {method:"GET",resType:"blob"})
			.then(res=>{
				image=Image.loadImage(res);
				image.onload=()=>{
					module.exports.pendingLoads--;
				}
				image.onerror=()=>{
					module.exports.pendingLoads--;
				}
				scsMethod(res);
			})
			.catch(err=>{
				module.exports.pendingLoads--;
				errMethod(err);
			});
			return image;
		}
	}
};