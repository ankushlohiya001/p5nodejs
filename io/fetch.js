const http=require("http");
const https=require("https");
const Response=require("./response");
const Url=require("url");

const Protocol={
	"http:": http,
	"https:": https
};
function fetch(path, option){
	option=option||{};
	option=Object.assign({method:"GET"},option);
	const url=Url.parse(path);
	if(url.protocol===null) return Promise.reject(`${path}: not a valid url!!`);

	const Proto=Protocol[url.protocol]; 
	if(!Proto) return Promise.reject(`${url.protocol} not supported!!`);


	return new Promise((result, reject)=>{
		const req=Proto.request(path, option, (res)=>{
			const response=new Response(path, res);
			
			res.on("data", buffer=>{
				response._buffer=Buffer.concat([response._buffer, buffer]);
			});

			res.on("end",()=>{
				result(response);
			});

		});
		req.on("error",reject);
		req.end();
	});
}

module.exports=fetch;