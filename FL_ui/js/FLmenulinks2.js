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
			},
			userGrid: function() {//call with menu key "uri": "javascript:FL.links.setDefaultGrid('JOJO')"
				FL.common.makeModalInfo("To be implemented.");
			},			
			userAdministration: function() {//call with menu key "uri": "javascript:FL.links.setDefaultGrid('JOJO')"
				// FL.common.makeModalInfo("You are the sole user, for the time being.");
				var message = "<p>You are the sole user, for the time being.</p><br>" +
							  "<button type='submit' class='btn btn-primary' onclick='xFL.links.userGrid()'>Add users</button>'";
				FL.common.makeModal("A","User Administration",message,{type:"primary", icon:"pencil",button1:"",button2:"Ok"},function(){
					if(result){
						alert("Yup");
					}else{
						alert("Nope");
					}
				});
			},
			resetMenus: function() {//saves factory default menu in current user"
				// var lastMenuStr  = localStorage.storedMenu
				var oMenu = {
					"menu" : [
						{
							"title" : "User Administration",//0
							"uri":"javascript:FL.links.userAdministration()"
						}
					]
				};
				localStorage.storedMenu = JSON.stringify(oMenu);
				FL.server.syncLocalStoreToServer();
				FL.menu.topicUpdateJsonMenu(oMenu);
			},
			testEmail: function() {//sends a sample email with mandrill javascript API
				var xhr = new XMLHttpRequest();
				xhr.open("GET", "http://www.codecademy.com/", false);//4 verbs - GET, POST, PUT, DELETE
				xhr.send();
				console.log(xhr.status);
				console.log(xhr.statusText);

				var m = new mandrill.Mandrill('vVC6R5SZJEHq2hjEZfUwRg');
				m.users.ping(function(res){console.log(res);},function(err){console.log(err);});
				// create a variable for the API call parameters
				var params = {
					"message": {
						"from_email":"support@framelink.co",
						"to":[{"email":"joaoccoliveira@live.com"}],
						"subject": "Text from FrameLink support team",
						"text": "I'm Joao from FrameLink support team."
					}
				};
				var params2 = {
					"message": {
						"from_email":"support@framelink.co",
						"to":[{"email":"joaoccoliveira@live.com"}],
						"subject": "Text from FrameLink support team",
						"html": "<p>I'm <strong>learning</strong> the Mandrill API at Codecademy.</p>",
						"autotext":true,
						"track_opens":true,
						"track_clicks":true
					}
				};
				var params3 = {//placing merge tags in the content
					"message": {
						"from_email":"support@framelink.co",
						"from_name" : "Joao Oliveira",
						"to":[{"email":"joaool@framelink.co","name":"Jojo"},{"email":"joaoccoliveira@live.com","name":"Joao"}],
						"subject": "Your *|ORDER|* has been received",
						"html":  "<p>Hey *|COOLFRIEND|*, we've been friends for *|YEARS|*.</p>",
						"autotext":true,
						"track_opens":true,
						"track_clicks":true,
						"merge_vars": [//suports IF ELSE conditions
							{
								"rcpt": "joaool@framelink.co",
								"vars": [
									{
										"name": "ORDER",
										"content": "1"
									},
									{
										"name": "COOLFRIEND",
										"content": "Patolinas"
									},
									{
										"name": "YEARS",
										"content": "5 awesome years"
									}
								]
							},
							{
								"rcpt": "joaoccoliveira@live.com",
								"vars": [
									{
										"name": "ORDER",
										"content": "2"
									},
									{
										"name": "COOLFRIEND",
										"content": "Malhanca"
									},
									{
										"name": "YEARS",
										"content": "4.5 awesome years"
									}
								]
							},
						]
					}
				};
				//The global_merge_vars parameter lets you specify some default values in the event that a recipient
				//   doesn't have recipient-specific information.
				m.messages.send(params3,function(res){console.log(res);},function(err){console.log(err);});
				alert("Send a test email");
				// var xId = 'id_1';
				// var xEmail = 'joaoccoliveira@live.com';
				// _cio.identify({
				// 	// Required attributes
				// 	id: xId,          	// Unique id for the currently signed in user in your application.
				// 	email: xEmail,	// Email of the currently signed in user.
				// 	created_at: 1410680673, 	// Timestamp in your system that represents when
				// 								// the user first signed up. You'll want to send it
				// 								// as seconds since the epoch.

				// 	// Optional (these are examples. You can name attributes what you wish)

				// 	first_name: 'John',       // Add any attributes you'd like to use in the email subject or body.
				// 	plan_name: 'free'      // To use the example segments, set this to 'free' or 'premium'.
				// });
			}
		};
	})();
// });