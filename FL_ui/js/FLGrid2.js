// jQuery(document).ready(function($){
	/**
	* data dictionary UI methods 
	*/
	// FL = FL || {}; //gives undefined if FL is undefined 
	// FL = {};
	// // a="A";
	// b="B";
	// var a = (typeof a === 'undefined') ? b : a;//if a is defined returns "A" otherwise returns the content of b
	// alert("zzz="+a);//sets "B"

	FL = (typeof FL === 'undefined') ? {} : FL;
	FL["grid"] = (function(){//name space FL.grid
		var internalTest = function(x) {//
			alert("grid internalTest() -->"+x);
		};
		return{
			// getPageNo: function(pagName){ //to be used by savePage and restorePage
			// 	var pageNoObj = {"home":1,"about":2};
			// 	return  pageNoObj[pagName];
			// },		
			insertDefaultGridMenu: function(singular,plural) {// Adds a menu with title <plural> and content displayDefaultGrid(<singular>)
				// cursor over menu position <plural> will show: javascript:FL.links.setDefaultGrid('<singular>')
				FL.server.insertCsvStoreDataTo(singular,function(err){
					if(err){
						console.log("Data from entity "+singular+" Error trying to store on server error="+err);
						return;
					}
					FL.clearSpaceBelowMenus();
					$.Topic( 'createGridOption' ).publish( plural,singular );//broadcast that will be received by FL.menu to add an option
					FL.dd.displayEntities();
				});
			},
			testFunc: function(x) {
				alert("FL.grid.test() -->"+x);
			}		
		};
	})();
// });