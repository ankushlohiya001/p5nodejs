module.exports={
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
	}
};