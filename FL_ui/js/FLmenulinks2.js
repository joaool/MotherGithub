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
			var promise=FL.API.loadTable(entityName);
			promise.done(function(data){
				console.log("New %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
				csvStore.setEntityName(entityName);
				csvStore.store(data);
				var z=csvStore.csvRows;//only for debugging
				// alert("New displayDefaultGrid -->import is done");
				console.log("New displayDefaultGrid -->import is done");
				console.log("show csvStore="+JSON.stringify(csvStore.csvRows));
				FL.clearSpaceBelowMenus();
				$("#addGrid").show();
				$("#addGrid").html("Add Row");
				var columnsArr = utils.backGridColumnsExtractedFromDictionary(entityName);//extracts attributes from dictionary and prepares columns object for backgrid
				console.log("New &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& entity="+entityName);
				console.log("show columnsArr="+JSON.stringify(columnsArr));

				utils.mountGridInCsvStore(columnsArr);//mount backbone views and operates grid -
			});
			promise.fail(function(err){
				alert("displayDefaultGrid Error="+err);
			});


		};
		var XdisplayDefaultGrid = function(entityName) {
			FL.server.loadCsvStoreFromEntity(entityName,function(err){//all csvStore will be stored in server as "order" content
				console.log("loadCsvStoreFromEntity is done !!! Error:"+err);
				// FL.server.disconnect();
				console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% entity="+entityName);
				console.log("show csvStore="+JSON.stringify(csvStore.csvRows));

				FL.clearSpaceBelowMenus();
				$("#addGrid").show();
				$("#addGrid").html("Add Row");
				var columnsArr = utils.backGridColumnsExtractedFromDictionary(entityName);//extracts attributes from dictionary and prepares columns object for backgrid
				console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& entity="+entityName);
				console.log("show columnsArr="+JSON.stringify(columnsArr));

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
				var eCN = FL.dd.getCEntity("_histoMail");
				var fCN = FL.dd.getFieldCompressedName("_histoMail","msg");
				var dbName = FL.login.token.dbName;
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
						"from_name": "jojo",
						"to":[{"email":"joaoccoliveira@live.com"},{"email":"joaocarloscoliveira@gmail.com"},{"email":"nicolas@cuvillier.net"}],
						// "to":[{"email":"joaoccoliveira@live.com"}],
						// "to":[{"email":"joaocarloscoliveira@gmail.com"}],
						"subject": "test #15 -  from FrameLink support team",
						"html": '<p>Thank you for selecting <a href="http://www.framelink.co"><strong>FrameLink</strong></a> to build your backend site !</p>',
// "html":'<body style="margin:0; padding:0;" bgcolor="#F0F0F0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"><!-- 100% background wrapper (grey background) --><table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0" bgcolor="#F0F0F0"><tr>   <td align="center" valign="top" bgcolor="#F0F0F0" style="background-color: #F0F0F0;"><br><!-- 600px container (white background) --><table border="0" width="600" cellpadding="0" cellspacing="0" class="container" style="width:600px;max-width:600px"><tr><td class="container-padding header" align="left" style="font-family:Helvetica, Arial, sans-serif;font-size:24px;font-weight:bold;padding-bottom:12px;color:#DF4726;padding-left:24px;padding-right:24px">Antwort v1.0</td></tr><tr><td class="container-padding content" align="left" style="padding-left:24px;padding-right:24px;padding-top:12px;padding-bottom:12px;background-color:#ffffff"><br><div class="title" style="font-family:Helvetica, Arial, sans-serif;font-size:18px;font-weight:600;color:#374550">Single Column Fluid Layout</div><br><div class="body-text" style="font-family:Helvetica, Arial, sans-serif;font-size:14px;line-height:20px;text-align:left;color:#333333">This is an example of a single column fluid layout. There are no columns. Because the container table width is set to 100%, it automatically resizes itself to all devices. The magic of good old fashioned HTML.<br><br>The media query change we make is to decrease the content margin from 24px to 12px for devices up to max width of 400px.<br><br></div></td></tr><tr><td class="container-padding footer-text" align="left" style="font-family:Helvetica, Arial, sans-serif;font-size:12px;line-height:16px;color:#aaaaaa;padding-left:24px;padding-right:24px"><br><br>Sample Footer text: © 2014 Acme, Inc.<br><br>You are receiving this email because you opted in on our website. Update your <a href="#" style="color:#aaaaaa">email preferences</a> or <a href="#" style="color:#aaaaaa">unsubscribe</a>.<br><br><strong>Acme, Inc.</strong><br><span class="ios-footer">123 Main St.<br>Springfield, MA 12345<br></span><a href="http://www.acme-inc.com" style="color:#aaaaaa">www.acme-inc.com</a><br><br><br></td></tr></table><!--/600px container --></td></tr></table><!--/100% background wrapper--></body>',
// "html":'<body style="margin:0; padding:0;" bgcolor="#F0F0F0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"><!-- 100% background wrapper (grey background) --><table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0" bgcolor="#F0F0F0"><tr><td align="center" valign="top" bgcolor="#F0F0F0" style="background-color: #F0F0F0;"><br><!-- 600px container (white background) --><table border="0" width="600" cellpadding="0" cellspacing="0" class="container" style="width:600px;max-width:600px"><tr><td class="container-padding header" align="left" style="font-family:Helvetica, Arial, sans-serif;font-size:24px;font-weight:bold;padding-bottom:12px;color:#DF4726;padding-left:24px;padding-right:24px">Test 3 columns & Pictures</td></tr><tr><td class="content" align="left" style="padding-top:12px;padding-bottom:12px;background-color:#ffffff"><table width="600" border="0" cellpadding="0" cellspacing="0" class="force-row" style="width: 600px;"><tr><td class="content-wrapper" style="padding-left:24px;padding-right:24px"><br><div class="title" style="font-family:Helvetica, Arial, sans-serif;font-size:18px;font-weight:600;color:#374550">Three Columns</div></td></tr><tr><td class="cols-wrapper" style="padding-left:12px;padding-right:12px"><!--[if mso]><table border="0" width="576" cellpadding="0" cellspacing="0" style="width: 576px;"><tr><td width="192" style="width: 192px;" valign="top"><![endif]--><table width="192" border="0" cellpadding="0" cellspacing="0" align="left" class="force-row" style="width: 192px;"><tr><td class="col" valign="top" style="padding-left:12px;padding-right:12px;padding-top:18px;padding-bottom:12px"><img src="http://amerikaihirujsag.com/wp-content/uploads/2012/11/555-192x125.jpg" border="0" alt="The White Whale" width="168" height="110" hspace="0" vspace="0" style="max-width:100%; " class="image"><div class="subtitle" style="font-family:Helvetica, Arial, sans-serif;font-size:16px;font-weight:600;color:#2469A0;margin-top:18px">The White Whale</div><div class="col-copy" style="font-family:Helvetica, Arial, sans-serif;font-size:13px;line-height:20px;text-align:left;color:#333333;margin-top:12px">I take the good old <a href="http://www.framelink.co"><strong>FrameLink</strong></a> ground that the whale is a fish, and call upon holy Jonah to back me. This fundamental thing settled, the next point is, in what internal respect does the whale differ from other fish.</div><br></td></tr></table>'+
// '<!--[if mso]></td><td width="192" style="width: 192px;" valign="top"><![endif]--><table width="192" border="0" cellpadding="0" cellspacing="0" align="left" class="force-row" style="width: 192px;"><tr><td class="col" valign="top" style="padding-left:12px;padding-right:12px;padding-top:18px;padding-bottom:12px"><img src="http://eltcasino.com/wp-content/uploads/2013/12/EN-192x125-Blade-CRM.jpg" border="0" alt="I am Ishmael" width="168" height="110" hspace="0" vspace="0" style="max-width:100%; " class="image"><div class="subtitle" style="font-family:Helvetica, Arial, sans-serif;font-size:16px;font-weight:600;color:#2469A0;margin-top:18px">I am Ishmael</div><div class="col-copy" style="font-family:Helvetica, Arial, sans-serif;font-size:13px;line-height:20px;text-align:left;color:#333333;margin-top:12px">Here upon the very point of starting for the voyage, Captain Peleg and Captain Bildad were going it with a high hand on the quarter-deck, just as if they were to be joint-commanders at sea, as well as to all appearances in port.</div><br></td></tr></table><!--[if mso]></td><td width="192" style="width: 192px;" valign="top"><![endif]--><table width="192" border="0" cellpadding="0" cellspacing="0" align="left" class="force-row" style="width: 192px;"><tr><td class="col" valign="top" style="padding-left:12px;padding-right:12px;padding-top:18px;padding-bottom:12px"><img src="http://www.momentumlife.tv/wp-content/uploads/2013/01/012413_1442_MotherhoodI1-192x125.png" border="0" alt="The Albatross" width="168" height="110" hspace="0" vspace="0" style="max-width:100%; " class="image"><div class="subtitle" style="font-family:Helvetica, Arial, sans-serif;font-size:16px;font-weight:600;color:#2469A0;margin-top:18px">The Albatross</div><div class="col-copy" style="font-family:Helvetica, Arial, sans-serif;font-size:13px;line-height:20px;text-align:left;color:#333333;margin-top:12px">And somehow, at the time, I felt a sympathy and a sorrow for him, but for I dont know what, unless it was the cruel loss of his leg. And yet I also felt a strange awe of him; but that sort of awe, which I cannot at all describe.</div><br></td></tr></table>'+
// '<!--[if mso]></td></tr></table><![endif]--></td></tr></table></td></tr><tr><td class="container-padding footer-text" align="left" style="font-family:Helvetica, Arial, sans-serif;font-size:12px;line-height:16px;color:#aaaaaa;padding-left:24px;padding-right:24px"><br><br>Sample Footer text: © 2014 Acme, Inc.<br><br>You are receiving this email because you opted in on our website. Update your <a href="#" style="color:#aaaaaa">email preferences</a> or <a href="#" style="color:#aaaaaa">unsubscribe</a>.<br><br><strong>Acme, Inc.</strong><br><span class="ios-footer">123 Main St.<br>Springfield, MA 12345<br></span><a href="http://www.acme-inc.com" style="color:#aaaaaa">www.acme-inc.com</a><br><br><br></td></tr></table><!--/600px container --></td></tr></table><!--/100% background wrapper--></body>',
						"autotext":true,
						"track_opens":true,
						"track_clicks":true,
						"metadata": {
							"dbName": dbName,//"45829",//it is in token
							"eCN": eCN,	//"111",
							"fCN": fCN   //456",
						}
						// "recipient_metadata": [
						// 	{
						// 		"rcpt": "joaoccoliveira@live.com",
						// 		"values": {
						// 			"user_id": 123456
						// 		}
						// 	}
						// ]						
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
				m.messages.send(params2,function(res){console.log(res);},function(err){console.log(err);});
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