define(function(){
	Array.prototype.remove = function(item){
	    if (item){
	        var index = this.indexOf(item);
	        if (index != -1)
	            return this.slice(index,1);
	    }
	    return this;
	}

	Handlebars.registerHelper('arrayToString', function(array, options) {
	    if (array && typeof array == "object" && array.length >0){
	        return array.toString();
	    }
	    return array;
	});

	Handlebars.registerHelper("math", function(lvalue, operator, rvalue, options) {
	    lvalue = parseFloat(lvalue);
	    rvalue = parseFloat(rvalue);

	    return {
	        "+": lvalue + rvalue
	    }[operator];
	});
	
	Handlebars.registerHelper('isAdmin', function(userId, options) {
	    if (parseInt(userId) == window.userData.id) {
	        return options.fn(userId, options);
	    }
	});
});