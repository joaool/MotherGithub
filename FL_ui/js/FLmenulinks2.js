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
				//localStorage.connection = connectionString; //this was already done in FL.server.connectServer()
				
				// FL.server.disconnect();
				// var style = localStorage.style;
				// var font = localStorage.fontFamily;
				// // location.href = "./page_editor.html?connectionString="+connectionString+"#page=" + xPage + "#style=" + style + "#font="+font;
				// // location.href = "./page_editor.html?connectionString="+connectionString+"#page=" + xPage + "#style=" + style + "#font="+font;
				// var child = window.open("./page_editor.html?connectionString="+connectionString+"#page=" + xPage + "#style=" + style + "#font="+font, 'theWindow');
				// if (window.focus) {
				// 	child.focus();
				// }

				// var timer = setInterval(checkChild, 500);
				// function checkChild() {
				// 	if (child.closed) {
				// 		alert("FrameLink Page Editor was closed \nconnectionString="+connectionString);
				// 		clearInterval(timer);
				// 		//restore home page
				// 		FL.server.restorePageFromConnectionString("home",connectionString,function(err,htmlStr){
				// 			if (err){
				// 				alert('FLmenulinks2.js after closing page_editor window ERROR restoring home page err=' + JSON.stringify(err));
				// 			}
				// 			FL.menu.homeMemory = htmlStr; //this means that this will be displayed
				// 			FL.menu.currentMenuObj.menuRefresh();
				// 		});
				// 	}else{
				// 		// child.focus();
				// 	}
				// }

				FL.server.disconnect(function(){
					alert("inside disconnect callback ");
					var style = localStorage.style;
					var font = localStorage.fontFamily;
					// location.href = "./page_editor.html?connectionString="+connectionString+"#page=" + xPage + "#style=" + style + "#font="+font;
					// location.href = "./page_editor.html?connectionString="+connectionString+"#page=" + xPage + "#style=" + style + "#font="+font;
					var child = window.open("./page_editor.html?connectionString="+connectionString+"#page=" + xPage + "#style=" + style + "#font="+font, 'theWindow');
					if (window.focus) {
						child.focus();
					}

					var timer = setInterval(checkChild, 500);
					function checkChild() {
						if (child.closed) {
							alert("FrameLink Page Editor was closed \nconnectionString="+connectionString);
							clearInterval(timer);
							//restore home page
							FL.server.restorePageFromConnectionString("home",connectionString,function(err,htmlStr){
								if (err){
									alert('FLmenulinks2.js after closing page_editor window ERROR restoring home page err=' + JSON.stringify(err));
								}
								FL.menu.homeMemory = htmlStr; //this means that this will be displayed
								FL.menu.currentMenuObj.menuRefresh();
							});
						}else{
							// child.focus();
						}
					}
				});
				// document.getElementById('TheForm').submit();

				// alert("this an alert after calling PageEditor");
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
			},
			clearDictionary: function() {
				console.log("------------------------- before clearing data dictionary -----------------------------");
				FL.dd.displayEntities();
				console.log("------------------------- after clearing data dictionary -----------------------------");
				FL.dd.clear();
				FL.dd.displayEntities();
				FL.common.makeModalInfo("Local frameLink dictionary deleted. Synchronization with server failled.");

				// FL.server.syncLocalStoreToServer(function(err){
				// 	if(err){
				// 		console.log("FL.server.clearDictionary() ERROR --> failled !");
				// 		FL.common.makeModalInfo("Local frameLink dictionary deleted. Synchronization with server failled.");
				// 	}else{	
				// 		FL.dd.displayEntities();
				// 		FL.common.makeModalInfo("FrameLink dictionary was successfully deleted (client and server).");
				// 	}
				// });
			}	
		};
	})();
// });