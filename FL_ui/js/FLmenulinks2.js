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
			setDefaultGrid: function(entityName) {//call with menu key "uri": "javascript:FL.links.setDefaultGrid('JOJO')"
				if(!FL.server.offline){
					if(FL.dd.isEntityInLocalDictionary(entityName)){
						displayDefaultGrid(entityName);
					}else{//entity is not in local dictionary =>we force syncLocalDictionary
						//TEMPORARY local dictionary adjust to force pair in local dictionary
						
						FL.server.syncLocalDictionary(function(){
							console.log("CB from F.links.setDefaultGrid SYNC IS DONE !!!!!!!!!!!!!!!!!!!!!!");
							FL.dd.displayEntities();
							displayDefaultGrid(entityName);
						});

						// var success = FL.dd.createEntity("order","client's product request");
						// FL.dd.addAttribute("order","shipped","expedition status","Shipped","boolean",null);
						// FL.dd.addAttribute("order","product","unique order item","product","string",null);
						// var oEntity =  FL.dd.getEntityBySingular("order");
						// oEntity.csingular = "61";//we force entity compressed name for test
						// FL.dd.setFieldCompressedName("order","id","62");
						// FL.dd.setFieldCompressedName("order","shipped","63");
						// FL.dd.setFieldCompressedName("order","product","64");
						// FL.dd.setSync("order",true);
						// // -------------------------------------------------
						// // alert("FL.links.setDefaultGrid - cannot display grid " + entityName + " because entity is not in local dictionary");
						// displayDefaultGrid(entityName);

					}
				}else{
					alert("FL.links.setDefaultGrid - cannot display grid " + entityName + " because FrameLink is offline.");
				}
			}
		};
	})();
// });