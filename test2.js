// const fetch=require("./io/fetch");
// const fs=require("fs");

// fs.readFile("./test2.js",(err,body)=>{
// 	if(err) return;
// 	// console.log(body);
// 	fetch("http://localhost:3000",{method:"POST",body, headers:{
// 		"connection":"keep-alive"
// 	}})
// 	.then(res=>res.text())
// 	.then(console.log)
// 	.catch(console.log);
// })


function reCall(func, times=1){
	for(let i=0;i<times;i++){
		if(reCall.pending) return;
		reCall.pending=true;
		func();
		reCall.pending=false;
	}
}
reCall.pending=false;


let val=0;
function tmp(){
	console.log(val++);
	reCall(tmp,10);
}

tmp();