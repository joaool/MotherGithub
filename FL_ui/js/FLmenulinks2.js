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
	FL["links"] = (function(){//name space FL.dd
		var internalTest = function ( x) { //returns a 2 bytes string from number 
			console.log( "FLmenulinks2.js internalTest -->"+x );
		};
		var displayDefaultGrid = function(entityName) {
			FL.server.loadCsvStoreFromEntity(entityName,function(err){//all csvStore will be stored in server as "order" content
				console.log("loadCsvStoreFromEntity is done !!! Error:"+err);
				// FL.server.disconnect();
				console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
				console.log("show csvStore="+JSON.stringify(csvStore.csvRows));

				FL.clearSpaceBelowMenus();
				$("#addGrid").show();
				$("#addGrid").html("Add Row");
				var columnsArr = utils.backGridColumnsExtractedFromDictionary(entityName);//extracts attributes from dictionary and prepares columns object for backgrid
				utils.mountGridInCsvStore(columnsArr);//mount backbone views and operates grid - 
			});
		};
		return{
			abc: "abc",
			test: function(x) {//call with menu key "uri": "javascript:FL.links.test('JOJO')"
				internalTest(x);
				alert("Fl.link.test(x) x="+x);
			},
			pageEditor: function(xPage) {//call with menu key "uri": "javascript:FL.links.test('JOJO')"
				var connectionString = localStorage.connection;
				if(connectionString.length === 0){
					alert("Fl.link.pageEditor PLEASE CONNECT TO THE DATABASE ");
					return;
				}
			alert("Fl.link.pageEditor call with:\npage=" + xPage + "\nconnectionString="+connectionString);
				// "uri":"./page_editor.html?d=joao"
				// location.href = "./page_editor.html?d=joao";
				localStorage.connection = connectionString;
				FL.server.disconnect();
				var style = localStorage.style;
				var font = localStorage.fontFamily;
				// location.href = "./page_editor.html?connectionString="+connectionString+"#page=" + xPage + "#style=" + style + "#font="+font;
				// location.href = "./page_editor.html?connectionString="+connectionString+"#page=" + xPage + "#style=" + style + "#font="+font;
				window.open("./page_editor.html?connectionString="+connectionString+"#page=" + xPage + "#style=" + style + "#font="+font, 'TheWindow');
				// document.getElementById('TheForm').submit();
			},
			setDefaultGrid: function(entityName) {//call with menu key "uri": "javascript:FL.links.setDefaultGrid('JOJO')"
				if(!FL.server.offline){
					if(FL.dd.isEntityInLocalDictionary(entityName)){
						displayDefaultGrid(entityName);
					}else{//entity is not in local dictionary =>we force syncLocalDictionary
						//TEMPORARY local dictionary adjust to force pair in local dictionary
						
						FL.server.syncLocalDictionary(function(){
							console.log("F.links.setDefaultGrid CB from  SYNC IS DONE !!!!!!!!!!!!!!!!!!!!!!");
							FL.dd.displayEntities();
							displayDefaultGrid(entityName);
						});
					}
				}else{
					alert("FL.links.setDefaultGrid - cannot display grid " + entityName + " because FrameLink is offline.");
				}
			}
		};
	})();
// });