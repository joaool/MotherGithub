define(function(){
	Array.prototype.remove = function(item){
	    if (item){
	        var index = this.indexOf(item);
	        if (index != -1)
	            return this.slice(index,1);
	    }
	    return this;
	}
});