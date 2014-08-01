var newOp = (function(){
	// window.stack = window.stack||[];
	// stack.push(x);
	// var len=stack.length;
	// xPrevious = -1;
	// if(len>1)
	// 	xPrevious =  stack[len-2];
	return function(x){
		window.stack = window.stack||[];
		stack.push(x);
		var len=stack.length;
		xPrevious = -1;
		if(len>1)
			xPrevious =  stack[len-2];	
			return {
				topOfStack:stack[len-1],
				previous:xPrevious,
				opDouble:2*x,
				opPower2:x*x
			} //end of object
	}; // end of function
})();
var newOp2 = function(x){
	window.stack = window.stack||[];
	stack.push(x);
	var len=stack.length;
	xPrevious = -1;
	if(len>1)
		xPrevious =  stack[len-2];
	return {
			topOfStack:stack[len-1],
			previous:xPrevious,
			opDouble:2*x,
			opPower2:x*x
		}; //end of object
};
var abc = (function(){
	return {
		name:"abc",
		doubleOp:function(x){return 2*x;}
	}; //end of object
})();
// abc();