const fetch=require("./io/fetch");
const fs=require("fs");

fs.readFile("./tmp.jpg",(err,body)=>{
	if(err) return;
	// console.log(body);
	fetch("http://localhost:3000",{method:"POST",body})
	// .then(res=>res.text())
	.then(console.log)
	.catch(console.log);
})