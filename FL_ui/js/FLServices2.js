jQuery(document).ready(function($){
	/**
	* function to load a given css file 
		http://naveensnayak.wordpress.com/2013/06/26/dynamically-loading-css-and-js-files-using-jquery/
		http://stackoverflow.com/questions/950087/how-to-include-a-javascript-file-in-another-javascript-file
	*/
	// var FL = FL || {};
	FL["services"] = (function(){//name space FL.services
		// var privateCommonVar  = null; //shared by all services
		// var privateFunction = function(options, onSelection) {};//shared by all services
		return{//public properties and methods 
			publicProperty: "abc",
			publicNA:function(par1) {//nota available
				alert("FL.services.publicNA --> The "+par1+ " service, is not available for the moment.");
			}
		};
	})();
});