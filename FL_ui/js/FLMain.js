var FL = FL || {};
(function() { //App is a name space.
	var oMenu = {
		"menu" : [
			{
				"title" : "User Administration",//0
				// "uri":"http://www.microsoft.com"
				// "uri":"./page_editor.html?d=joao"
				"uri":"javascript:FL.links.userAdministration()"
				// "uri":"microsoft"
			},
			// {
			// 	"title" : "Menu B - Tier 1",//1
			// 	"uri" : "#",
			// 	"menu" : [
			// 		{
			// 			"title" : "Menu B - Tier 2 - I ",//2
			// 			"uri":"#",
			//  			 "menu" : [
			// 	            {
			// 	                "title" : "Menu B - Tier 3 - I FrameLink",//3
			// 	                "uri":"http://framelink.co"
			// 	            },
			// 	            {
			// 	                "title" : "Menu B - Tier 3 - II",//4
			// 	                "uri":"#",
			// 	                "menu" : [
			// 			            {
			// 			                "title" : "Menu B - Tier 3 - I FrameLink",//5
			// 			                "uri":"http://framelink.co"
			// 			            },
			// 			            {
			// 			                "title" : "Menu B - Tier 3 - II",//6
			// 			                "uri":"#",
			// 			                "menu" : [
			// 					            {
			// 					                "title" : "Menu B - Tier 4 - I FrameLink",//7
			// 					                "uri":"http://framelink.co"
			// 					            },
			// 					            {
			// 					                "title" : "Menu B - Tier 4 - II",//8
			// 					                "uri":"_mission"
			// 					            },
			// 					            {
			// 					                "title" : "Menu B - Tier 4 - III weAdvice",//9
			// 					                "uri":"http://weadvice.pt"
			// 					            }				            
			// 					        ]
			// 			            },
			// 			            {
			// 			                "title" : "Menu B - Tier 3 - III weAdvice",//10
			// 			                "uri":"http://weadvice.pt"
			// 			            }				            
			// 			        ]
			// 	            }
			// 	        ]
		 //            },
		 //            {
		 //                "title" : "Menu B - Tier 2 - II",//11
		 //                "uri": "javascript:FL.links.setDefaultGrid('Order')"
		 //            }
		 //        ]
		 //    },
		 //    {
		 //        "title" : "Menu C - Tier 1",//12
		 //        "uri":"#3",
		 //    },
		 //    {
		 //        "title" : "Menu D - Tier 1",//13
		 //        "uri":"#3",
		 //        "menu" : [
		 //            {
		 //                "title" : "Menu D - Tier 2 - I",//14
		 //                "uri":"#1"
		 //            },
		 //            {
		 //                "title" : "Menu D - Tier 2 - II",//15
		 //                "uri":"#",
		 //               	"menu" : [
			// 	            {
			// 	                "title" : "Menu D - Tier 3 - I FrameLink",//16
			// 	                "uri":"http://framelink.co"
			// 	            },
			// 	            {
			// 	                "title" : "Menu D - Tier 3 - II",//17
			// 	                "uri":"#"
			// 	            },
			// 	            {
			// 	                "title" : "Menu D - Tier 3 - III weAdvice",//18
			// 	                "uri":"http://weadvice.pt"
			// 	            }				            
			// 	        ]
		 //            },
		 //            {
		 //                "title" : "Menu D - Tier 2 - III - facebook",//19
		 //                "uri":"http://facebook.com"
		 //            }		            
		 //        ]
		 //    },
		 //    {
		 //        "title" : "Home",//20
		 //        "uri":"_home"
		 //    },		    
		 //    {
		 //        "title" : "What it does",//21
		 //        "uri":"#",
		 //         "menu" : [
		 //            {
		 //                "title" : "What is it for ?",//14
		 //                "uri":"_whatFor"
		 //            },
		 //            {
		 //                "title" : "Usage examples",//14
		 //                "uri":"_usage"
		 //            }
		 //        ]    
		 //    },
		 //    {
		 //        "title" : "Company",//21
		 //        "uri":"#",
		 //         "menu" : [
		 //            {
		 //                "title" : "Who we are",//14
		 //                "uri":"_whoweare"
		 //            },
		 //            {
		 //                "title" : "Contact us",//14
		 //                "uri":"_contacts"
		 //            }
		 //        ]    
		 //    }
		]    
	};

	FL.oMenu = oMenu;
	$(document).ready(function() {
		console.log("FLMain.js begin inside document.ready");
		var fullUrl = window.location.href;
		if(fullUrl){//gets domain from irl string ->http://localhost/pdojo/MotherGithub/test_menu13.html?d=myDomain1#
			//ex. http://www.framelink.co/app?d=myDomain1 Nico's definition
			//this is equivalent to  http://localhost/pdojo/MotherGithub/test_menu13.html?d=myDomain1
			//
			//alternative mode ->it could be ex. http://www.framelink.co/app#myDomain1 
			//      equivalent to  http://localhost/pdojo/MotherGithub/test_menu13.html#myDomain1
			// alert("url="+fullUrl+"\n urlParam="+FL.common.stringAfterLast(fullUrl,"="));//instead of "=", use "#" for alternative mode
			// alert("url="+fullUrl+"\n urlParam="+FL.common.getLastTagInString(fullUrl,"=","#"));//instead of "=", use "#" for alternative mode
			FL["domain"] = FL.common.getLastTagInString(fullUrl,"=","#");//FL.domain is globally defined - the last # is disregarded
			// alert("FL.domain="+FL.domain);
		}
		$('#panel1').slidePanel({
			triggerName: '#trigger1',
			position: 'fixed',
			triggerTopPos: '110px',
			panelTopPos: '110px',
			ajax: true,
			ajaxSource: 'FL_ui/sidepanel/fl_settings.html'
		});	
		$('#panel2').slidePanel({
			triggerName: '#trigger2',
			position: 'fixed',
			triggerTopPos: '210px',
			panelTopPos: '210px',
			ajax: true,
			// ajaxSource: 'FL_ui/sidepanel/fl_services.html'
			ajaxSource: 'FL_ui/sidepanel/fl_builder2.html'
		});
		$('#panel3').slidePanel({
			triggerName: '#trigger3',
			position: 'fixed',
			triggerTopPos: '310px',
			panelTopPos: '310px',
			ajax: true,
			ajaxSource: 'FL_ui/sidepanel/fl_services.html'
		});	
		// $('#trigger2').on('mousedown','#fl_builder',function(){alert("Inside Panel2 at pos-load !!!!")});
		// $('#trigger2').on('mousedown',function(){alert("Inside Panel2 at pos-load !!!!")});
		$('#trigger1').hide();
		$('#trigger2').hide();
		$('#trigger3').hide();
		var myMenu = FL.menu.createMenu({jsonMenu:FL.clone(oMenu),initialMenu:"_home",editable:true});
		// var myMenu = FL.menu.createMenu({jsonMenu:FL.clone(oMenu),initialMenu:"_mission",editable:true});
		// var myMenu = FL.menu.createMenu({jsonMenu:FL.clone(oMenu)});
		FL.setTourOn(true);
		FL.mixPanelEnable = false;
		FL.server.offline = false;
		localStorage.connection = '';
		var loggedIn = FL.login.checkSignIn(true);//recover last saved menu and tour - is_recoverLastMenu = true =>LastMenu will be recovered and will be passed to FL.menu
		FL.tourBegin();		
		// myMenu.settings.editable = true;
		// myMenu.menuRefresh([//receives a menu array and displays it. If empty assumes settings.jsonMenu.menu
		// 	{
		// 		"title" : "MenuA/T1",//0
		// 		"uri":"http://www.microsoft.com"
		// 	},
		// 	{
		// 		"title" : "MenuB/T1",//1
		// 		"uri" : "#",
		// 		"menu" : [
		// 			{
		// 				"title" : "MenuB/T2-I",//2
		// 				"uri":"_home"
		// 			}
		// 		]	
		// 	},
		// 	{
		// 		"title" : "MenuC/T1",//3
		// 		"uri":"#",
		// 		"menu": [
		// 			{
		// 			  "title" : "MenuC/T2-I",//4
		// 			  "uri":"_mission"
		// 			},
		// 			{
		// 			  "title" : "MenuC/T2-II",//4
		// 			  "uri":"#"
		// 			}  	 		        
		// 		]
		// 	}			
		// ]);
		// myMenu.menuRefresh(oMenu.menu); //OK
		
		myMenu.menuRefresh();
		home = function() {//necessary to force brand to call _home
			// alert("Home !!!");
			FL.clearSpaceBelowMenus();
			myMenu.menuRefresh();
		};
		//testing login promises
		// FL.API.connectAdHocUser();//OK
		// FL.API.connectAdHocUser().then(FL.API.removeAdHocUser);//OK 
		// FL.API.connectAdHocUser().then(function(){FL.API.registerAdHocUser("fofo26","fofo123","fofo26 app");});//OK
		// FL.API.connectAdHocUser().then(function(){FL.API.registerAdHocUser("JSmith@nwtraders.com","js123","Northwind Company Site");});//OK
		// FL.API.connectUserToDefaultApp("fofo26","fofo123");//OK
		// FL.API.connectUserToDefaultApp("fofo25","fofo123").then(FL.API.syncLocalDictionary);//no connection - OK, null dict OK, 
		// FL.API.connectUserToDefaultApp("joao@framelink.co","oLiVeIrA").then(FL.API.syncLocalDictionary);//no connection - OK, null dict OK, 

		// FL.dd.createEntity("Client","Individual or Company to whom we may send invoices");		
		// FL.dd.addAttribute("Client","name","client's name","Name","string","textbox",null);
		// FL.dd.addAttribute("Client","address","client's address","Address","string","textbox",null);
		// FL.dd.addAttribute("Client","city","client's city","City","string","combobox",["Amsterdam","Lisbon","Port Louis"]);
		// FL.dd.displayEntities();

		/*
		FL.API.connectUserToDefaultApp("fofo25","fofo123") 
		.then(separator)
		.then(function(){FL.API.syncLocalDictionaryToServer("Client");});//OK
		*/
		// FL.API.connectAdHocUser().then(function(){FL.API.registerAdHocUser("customer1@xyz.com","123","test xyz");});//OK
		// FL.API.connectUserToDefaultApp("customer1@xyz.com","123");
		/*
		FL.API.connectUserToDefaultApp("customer1@xyz.com","123") 
		.then(separator)
		.then(function(){FL.API.loadAppDataForSignInUser2();});//OK	 
		*/

		
		// var promise = FL.API.connectUserToDefaultApp("customer1@xyz.com","123").then(FL.API.loadAppDataForSignInUser2);//OK	 		
		// promise.done(function(menuData,homeHTML,appDescription){
		// 	console.log("style=" + menuData.style + "\nfont=" + menuData.fontFamily + "\nmenu="+
		// 		JSON.stringify(menuData.oMenu)+"\nhomePage="+homeHTML + "\nappDescription=" + appDescription );
		// });
		// promise.fail(function(err){console.log("Error loading application error="+err);});
		
		/*
		var homePage = "<div class='jumbotron'>" +
							"<h1>--- <%= appDescription %> ---</h1><p>Hello World !!!=>Welcome <%= userName %> </p>" +
						"</div>";
		// var homePage=null;
		FL.API.setHomePage(homePage);
		FL.API.connectUserToDefaultApp("customer1@xyz.com","123").then(FL.API.saveHomePage);//	
		*/
		
		var oMyMenu = {
			"menu" : [
				{
					"title" : "xyz admin",//0
					"uri":"javascript:FL.links.userAdministration()"
				},
				{
					"title" : "customers",//1
					"uri" : "#",
					"menu" : [
						{
							"title" : "Reports",//2
							"uri":"#",
				 			 "menu" : [
					            {
					                "title" : "Customer List by name",//3
					                "uri":"#"  //http://framelink.co"
					            },
					            {
					                "title" : "Ranked List",//3
					                "uri":"#"  //http://framelink.co"
					            }
					        ]    
					    }
					]
				},
				{
					"title" : "EMail Marketing",//12
					"uri":"#3",
				}
			]	
		};		    
		// oMyMenu = null;		        
		FL.API.setMenu(oMyMenu);
		// FL.API.setStyle("spacelab");
		// FL.API.setStyle(null);
		// FL.API.setFontFamily("elite");
		// FL.API.setFontFamily(null);
		FL.API.connectUserToDefaultApp("customer1@xyz.com","123").then(FL.API.save_Menu_style_fontFamily);//	
	});	
	// FL.login.token = {};
	// connectAdHocUser = function(connectAdHocUserCB) {//
	// FL.login.token has all information about the user and the current applications the user is using
	// connectAdHocUser = function(connectAdHocUserCB) {//
	// GlobalUserName = null;
	//-------- PROMISE WRAPPERS ------------------
	var separator = function(){
		var def = $.Deferred();
		if(true){
			console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
			def.resolve();
		}
		return def.promise();
	};
	var p0 =function(){
		var deferred = $.Deferred();
		console.log("process 0 begins...");
		if(false)
			deferred.reject();
		setTimeout(function() {//after 10 sec executes the anonymous function
			console.log("process 0 COMPLETE");
			deferred.resolve();
		}, 5000);
		return deferred.promise();		
	};
	var p1 = function(){
		var def = $.Deferred();
		console.log("beginning p1...");
		def.fail(function(){
			alert("error!");
		});
		def.done(function(){
			console.log(" p1 was well done!");
		});
		console.log("process 1 begins...");
		if(false)
			def.reject();
		setTimeout(function() {//after 10 sec executes the anonymous function
			console.log("process 1 COMPLETE");
			def.resolve();
		}, 2000);
		return def.promise();		
	};
	var p2 = function process2(){
		var deferred = $.Deferred();
		console.log("process 2 begins...");

		console.log("process 2 COMPLETE");
		return deferred.promise();		
	};
	//only enters p1 after p0 is resolved
	// p0().then(p1).then(p2);//OK !!!! DRY Dont Repeat Yourself and single Responsability Principle
	// p0();
	// p1();
	// p2();
	console.log(document.title+"......  END..");
})();
