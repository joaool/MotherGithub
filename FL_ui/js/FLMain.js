var FL = FL || {};
(function() { //App is a name space.
	var oMenu = {
		"menu" : [
			{
				"title" : "Menu A - Tier 1",//0
				// "uri":"http://www.microsoft.com"
				// "uri":"./page_editor.html?d=joao"
				"uri":"#"
				// "uri":"microsoft"
			},
			{
				"title" : "Menu B - Tier 1",//1
				"uri" : "#",
				"menu" : [
					{
						"title" : "Menu B - Tier 2 - I ",//2
						"uri":"#",
			 			 "menu" : [
				            {
				                "title" : "Menu B - Tier 3 - I FrameLink",//3
				                "uri":"http://framelink.co"
				            },
				            {
				                "title" : "Menu B - Tier 3 - II",//4
				                "uri":"#",
				                "menu" : [
						            {
						                "title" : "Menu B - Tier 3 - I FrameLink",//5
						                "uri":"http://framelink.co"
						            },
						            {
						                "title" : "Menu B - Tier 3 - II",//6
						                "uri":"#",
						                "menu" : [
								            {
								                "title" : "Menu B - Tier 4 - I FrameLink",//7
								                "uri":"http://framelink.co"
								            },
								            {
								                "title" : "Menu B - Tier 4 - II",//8
								                "uri":"_mission"
								            },
								            {
								                "title" : "Menu B - Tier 4 - III weAdvice",//9
								                "uri":"http://weadvice.pt"
								            }				            
								        ]
						            },
						            {
						                "title" : "Menu B - Tier 3 - III weAdvice",//10
						                "uri":"http://weadvice.pt"
						            }				            
						        ]
				            }
				        ]
		            },
		            {
		                "title" : "Menu B - Tier 2 - II",//11
		                "uri": "javascript:FL.links.setDefaultGrid('Order')"
		            }
		        ]
		    },
		    {
		        "title" : "Menu C - Tier 1",//12
		        "uri":"#3",
		    },
		    {
		        "title" : "Menu D - Tier 1",//13
		        "uri":"#3",
		        "menu" : [
		            {
		                "title" : "Menu D - Tier 2 - I",//14
		                "uri":"#1"
		            },
		            {
		                "title" : "Menu D - Tier 2 - II",//15
		                "uri":"#",
		               	"menu" : [
				            {
				                "title" : "Menu D - Tier 3 - I FrameLink",//16
				                "uri":"http://framelink.co"
				            },
				            {
				                "title" : "Menu D - Tier 3 - II",//17
				                "uri":"#"
				            },
				            {
				                "title" : "Menu D - Tier 3 - III weAdvice",//18
				                "uri":"http://weadvice.pt"
				            }				            
				        ]
		            },
		            {
		                "title" : "Menu D - Tier 2 - III - facebook",//19
		                "uri":"http://facebook.com"
		            }		            
		        ]
		    },
		    {
		        "title" : "Home",//20
		        "uri":"_home"
		    },		    
		    {
		        "title" : "What it does",//21
		        "uri":"#",
		         "menu" : [
		            {
		                "title" : "What is it for ?",//14
		                "uri":"_whatFor"
		            },
		            {
		                "title" : "Usage examples",//14
		                "uri":"_usage"
		            }
		        ]    
		    },
		    {
		        "title" : "Company",//21
		        "uri":"#",
		         "menu" : [
		            {
		                "title" : "Who we are",//14
		                "uri":"_whoweare"
		            },
		            {
		                "title" : "Contact us",//14
		                "uri":"_contacts"
		            }
		        ]    
		    }
		]    
	};
	// simulZ = function(id,t,cb){
	// 	setTimeout(function(){
	// 	 	console.log("--->"+id+" is done.");   
	// 	 	cb();    
 //        }, t);
	// };

	// FL.dd.createServerEntity_Fields(function(err){console.log("New status !!! "+err);});//singular, plural, description
	// console.log("Temporary status");
	// return;
	
	// var FL = FL || {};
	var testObject = localStorage.testObject;
	var z = null;
	if(testObject)
		z=testObject.one;
	console.log("FLMain.js begin z=" + z );
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
			ajaxSource: 'FL_ui/sidepanel/fl_builder.html'
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
		// var myMenu = FL.menu.createMenu({jsonMenu:FL.clone(oMenu),initialMenu:"_home",editable:true});
		var myMenu = FL.menu.createMenu({jsonMenu:FL.clone(oMenu),initialMenu:"_mission",editable:true});
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
			myMenu.menuRefresh();
		};
	});	
	console.log(document.title+"......  END..");
})();
