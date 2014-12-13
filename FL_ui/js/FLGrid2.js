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
			extractFromCsvStore: function(){
				//Ex: from csvStore.csvRows = {"1":{"id":1,"shipped":true,"product":"Prod 1"},"2":{"id":2,"shipped":false,"product":"Prod 2"}}
				var retArr=_.map(csvStore.csvRows, function(value,key){return value});
				return retArr;
			},
			insertDefaultGridMenu: function(singular,plural) {// Adds a menu with title <plural> and content displayDefaultGrid(<singular>)
				// cursor over menu position <plural> will show: javascript:FL.links.setDefaultGrid('<singular>')
				// FL.server.insertCsvStoreDataTo(singular,function(err){
				// 	if(err){
				// 		console.log("Data from entity "+singular+" Error trying to store on server error="+err);
				// 		return;
				// 	}
				// 	FL.clearSpaceBelowMenus();
				// 	$.Topic( 'createGridOption' ).publish( plural,singular );//broadcast that will be received by FL.menu to add an option
				// 	FL.dd.displayEntities();
				// });
				var arrToSend = FL.grid.extractFromCsvStore(singular);
				// console.log("FLGrid2.js --> insertDefaultGridMenu show arrToSend="+JSON.stringify(arrToSend));
				// format for arraTosend must be-->[{"name":"Jojox","phone":"123"},{"name":"Anton","phone":"456"}];
				var saveTablePromise = FL.API.saveTable(singular,arrToSend);
				saveTablePromise.done(function(data){
					// console.log("FLGrid2.js --> insertDefaultGridMenu Succeded saving table. returned:"+JSON.stringify(data));
					FL.clearSpaceBelowMenus();
					$.Topic( 'createGridOption' ).publish( plural,singular );//broadcast that will be received by FL.menu to add an option
				});
				saveTablePromise.fail(function(err){
					console.log("FLGrid2.js --> insertDefaultGridMenu FAILURE !!! err="+err);
				});
			},
			testFunc: function(x) {
				alert("FL.grid.test() -->"+x);
			}
		};
	})();
// });