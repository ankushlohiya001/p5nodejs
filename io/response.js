class Response{
	constructor(url, res, body){
		this._response=res;
		this._url=url;
		this._buffer=Buffer.alloc(0);
		this._body=body||null;
	}
	get body(){
		return this._body;
	}
	get headers(){
		return this._response.headers;
	}
	get ok(){
		return this._response.statusCode===200;
	}
	get status(){
		return this._response.statusCode;
	}
	get statusText(){
		return this._response.statusMessage;
	}
	get url(){  
		return this._url;
	}
	arrayBuffer(){
		return this.buffer().then(res=>res.buffer);
	}
	buffer(){
		return Promise.resolve(this._buffer);
	}
	json(){
		return this.text().then(JSON.parse);
	}
	text(){
		return this.buffer().then(String);
	}
}

module.exports=Response;