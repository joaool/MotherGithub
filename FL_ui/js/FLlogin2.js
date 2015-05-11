jQuery(document).ready(function($){
	/**
	* function to load a given css file 
		http://naveensnayak.wordpress.com/2013/06/26/dynamically-loading-css-and-js-files-using-jquery/
		http://stackoverflow.com/questions/950087/how-to-include-a-javascript-file-in-another-javascript-file
	*/
	// var FL = FL || {};
	FL["login"] = (function(){//name space FL.login
		var currentStyle = null; //currentStyle is set at launch by resetStyle(true) inside FL.login.checkSignIn(true);
		var currentFontFamily = null;
		var stylesForSelection = [
					{value: 0, text: 'cerulean'},
					{value: 1, text: 'cosmos'},
					{value: 2, text: 'readable'},
					{value: 3, text: 'red'},
					{value: 4, text: 'spacelab'}
				];
		var fontFamilyForSelection = [
					{value: 0, text: 'helvetica'},
					{value: 1, text: 'menlo'},
					{value: 2, text: 'georgia'},
					{value: 3, text: 'bookantiqua'},
					{value: 4, text: 'lucida'},
					{value: 5, text: 'tahoma'},
					{value: 6, text: 'elite'}
				];
		var messageEnabler = (function(){ //a singleton (to be instantiated by checkSignIn) to receive and dispatch topic messages.http://addyosmani.com/resources/essentialjsdesignpatterns/book/#singletonpatternjavascript
			var instantiated;
			function init() {
				var lastMessage = null;
				var receiver =  function(triggerName,enter){//enter true means ENTERING the slide panel trigger, false means EXITING
					lastMessage = triggerName;//triggerName is the id of the slide panel "#trigger1" or "#trigger2" or "#trigger3"
					// alert("messageEnabler.receiver received message="+lastMessage+" enter="+enter+" style="+currentStyle+" font="+currentFontFamily);
					// alert("FLLoadCss2.js messageEnabler.receiver triggerName="+triggerName+" enter="+enter);

					if(triggerName == "#trigger1") {//user entered or exited slide panel fl_settings.html
						// alert("messageEnabler.receiver received message from trigger1="+lastMessage+" currentStyle="+currentStyle+" font="+currentFontFamily);
						// $("#styleSet").parents('.btn-group').find('.dropdown-toggle').html(currentStyle +' <span class="caret"></span>');//shows current value
						//the values that appear before any selection....
						$("#styleSet").parents('.btn-group').find('.dropdown-toggle').html(currentStyle +' <span class="caret"></span>');//shows current value
						$("#fontFamily").parents('.btn-group').find('.dropdown-toggle').html(currentFontFamily +' <span class="caret"></span>');//shows current value

						var xStyle = localStorage.style;
						FL.common.selectBox({boxId: "styleSet",boxCurrent: xStyle,boxArr: stylesForSelection},function(selected){
							//select is the full object corresponding to the choosed option
							// alert("styleSet "+ JSON.stringify(selected)+" was selected !");
							currentStyle = selected.text;
							localStorage.style = currentStyle;
							$.Topic( 'styleChange' ).publish( currentStyle);//broadcast that will be received by FL.tour
							FL.mix("ChangeStyle",{"newStyle":currentStyle});
							FL.currentStyle = currentStyle;//compatibility with touring - before code review
							// alert("FL.loadCss2  receiver... STYLE CHANGE will call FL.server.syncLocalStoreToServer()");
							FL.server.syncLocalStoreToServer();
							resetStyle(true);
						});
						var xFont = localStorage.fontFamily;
						FL.common.selectBox({boxId:"fontFamily",boxCurrent: xFont, boxArr:fontFamilyForSelection},function(selected){
							//following code is what is done on selection
							// alert("font "+ JSON.stringify(selected)+" was selected !");
							currentFontFamily = selected.text;
							localStorage.fontFamily = currentFontFamily;
							FL.mix("ChangeFontFamily",{"newFont":currentFontFamily});
							// alert("FL.loadCss2  receiver... STYLE CHANGE will call FL.server.syncLocalStoreToServer()");
							FL.server.syncLocalStoreToServer();
							resetStyle(true);
						});
					}else if(triggerName == "#trigger2") {//user entered or exited slide panel fl_builder.html
						// alert("FLLoadCss.js init.receiver() -->Entered trigger2");
						// FL.login.managePanel3();
						FL.slidePanels.managePanel2();
						// window.zz="firstTime.csv";
					}else if(triggerName == "#trigger3") {//user entered or exited slide panel fl_service.html
						// alert("FLLoadCss.js init.receiver() -->Entered trigger3");		
					}
				};
				$.Topic( 'slidePanel' ).subscribe( receiver );

				return {//the singleton
					lastMessage: lastMessage
				};
			}
			return {
				getInstance: function(){
					if(!instantiated) {
						instantiated = init();
					}
					return instantiated;
				}
			};
		})();
		var recoverLastMenu = function() {//recover locally saved menu and informs FL.menu about the new menu if any
			var lastMenuStr = localStorage.getItem("storedMenu");
			var lastMenuObject = null;
			if(lastMenuStr)
				lastMenuObject = JSON.parse(lastMenuStr);
			if(lastMenuObject) {
				// alert("FL.signIn()  -> Read menu with:\n"+JSON.stringify(lastMenuObject.menu));

				if(lastMenuObject.menu[0].title =="Users" || lastMenuObject.menu[0].title =="Settings" ) //temporarly to correct those that have the old users menu
					lastMenuObject.menu[0] = FL.login.defaultMenu.menu[0];
				

				$.Topic( 'jsonMenuUpdate' ).publish( lastMenuObject );//broadcast that will be received by FL.menu to update jsonMenu
			}
			$.Topic( 'sidePanelOpened' ).publish( false ); //informs FL.menu that sidePanel is closed 
		};
		var displaySignInUser = function(user) {//if user is null displays signIn icon+"Sign In" otherwise displays user
			var browserW = FL.common.getBrowserWidth();
			var htmlToInject = '<div style="line-height:2.2em;"><span id="_signInDomain" class="small hidden-xs" style="margin-left:2%;" >'+
									'Welcome to FrameLink: support@framelink.co App:'+  FL.domain + " / "+browserW +
								'</span>'+
								// '<a class="pull-right text-muted" href="javascript:FL.signIn()" style="margin-right:12em">'+
								'<a class="pull-right" href="javascript:FL.login.signIn()" style="margin-right:2%;">'+
									'<img src="FL_ui/img/signIn.png">'+
									'<span id="_signIn" style="font-size: 1.2em;"> Sign In</span>'+
								'</a>'+
								// '<a class="pull-right text-muted" style="margin-right:1.5em" href="javascript:FL.tourIn()" >'+
								// '<a class="pull-right" style="margin-right:1.5em;" href="javascript:FL.tourIn()" >'+
								// 	'<i  class="glyphicon glyphicon-eye-open" style="font-size: 1.5em;color:black;"></i>'+
								// 	'<span style="font-size: 1.2em;"> Tour</span>'+
								// '</a>'+
							'</div>';
			if(user) {
				htmlToInject = '<div style="line-height:2.2em;"><span class="small hidden-xs" style="margin-left:2%;">'+
										'Welcome to FrameLink: support@framelink.co App:' + FL.domain + " / "+browserW +
									'</span>'+
									// '<a class="pull-right text-muted" href="javascript:FL.signIn()" style="margin-right:12em">'+
									'<a class="pull-right " href="javascript:FL.login.signIn()" style="margin-right:2%">'+
										'<i  class="glyphicon glyphicon-user"></i>'+
										'<span id="_signIn" style="font-size: 1.2em;"> '+ user +'</span>'+
									'</a>'+
									// '<a class="pull-right text-muted" style="margin-right:1.5em" href="javascript:FL.tourIn()" >'+
									// '<a class="pull-right" style="margin-right:1.5em;" href="javascript:FL.tourIn()" >'+
									// 	'<i class="glyphicon glyphicon-eye-open" style="font-size: 1.5em;color:black;"></i>'+
									// 	'<span style="font-size: 1.2em;"> Tour</span>'+
									// '</a>'+
								'</div>';
			}
			FL.domInject("_login",htmlToInject );
		};
		var logOutMenu = function(){//displays the menu and home page for logout status
			FL.common.printToConsole("---------------------------------------------------------->logOutMenu");
			var loginMenu = FL.menu.createMenu({jsonMenu:{"menu":[{"title":"","uri":"#"}]}});//FL.oMenu is a global defined  in FLMain.js
			loginMenu.menuRefresh();
			FL.common.clearSpaceBelowMenus();
			FL.domInject("_placeHolder",FL.login.defaultPageOnLogout );
		};
		var loginDefaultMenu_and_homePage = function(loginObject){//after user creation in server we need to display the menu and home page for logins of new users (defaults for menu and homepage)
			// var loginMenu = FL.menu.createMenu({jsonMenu:FL.oMenu});//FL.oMenu is a global defined  in FLMain.js
			// loginMenu.menuRefresh();
			$.Topic( 'signInDone' ).publish( true ); //informs FL.menu that edition is allowed
			$.Topic( 'jsonMenuUpdate' ).publish( FL.clone(FL.oMenu) );//broadcast that will be received by FL.menu to update jsonMenu

			var pos = FL.login.token.userName.indexOf("@");
			var shortUserName = FL.login.token.userName.substring(0,pos);
			var templateFunction = _.template(FL.login.defaultPage);
			var templateArg = {appDescription:"default app", userName:"", shortUserName:shortUserName};
			var homeHTML = templateFunction(templateArg);

			localStorage.login = JSON.stringify(loginObject);
			$('#trigger1').show();$('#trigger2').show();$('#trigger3').show();
			FL.common.clearSpaceBelowMenus();
			FL.domInject("_placeHolder",homeHTML );
			FL.domain = FL.login.token.appDescription;
			displaySignInUser(loginObject.email);
		};
		var getLoginObject = function(){
			var email = $('#getStarted_email').val();
			email = email.trim();
			var password = $('#getStarted_password').val();
			password = password.trim();
			return {email:email,password:password};
		};
		var setupApp = function(menuData,homeHTML,loginObject){
			$.Topic( 'jsonMenuUpdate' ).publish( menuData.oMenu );//broadcast that will be received by FL.menu to update jsonMenu
			FL.common.clearSpaceBelowMenus();
			FL.domInject("_placeHolder",homeHTML );

			FL.domain = FL.login.token.appDescription; //test with "jojo"+loginObject.email;
			
			localStorage.storedMenu  = JSON.stringify(menuData.oMenu);
			localStorage.style = menuData.style;
			localStorage.fontFamily = menuData.fontFamily;
			resetStyle(true);
			localStorage.login = JSON.stringify(loginObject);
			$.Topic( 'signInDone' ).publish( true );
			recoverLastMenu();//recover locally saved menu and informs FL.menu about the new menu if any
			displaySignInUser(loginObject.email);
		};
		var loginDialogs = function(loginObject){
			var def = $.Deferred();

			var masterDetailItems = {
				master:{email:loginObject.email,password:loginObject.password},
				detail:{} //format is array with {attribute:<attribute name>,description:<attr description>,statement;<phrase>}
			};
			// FL.common.makeModal("B"," FrameLink Login","loginTemplate",{icon:"user",button1:"Logout",button2:"Login"},function(result){// "Cancel and "Ok" will be assumed with result = true for "Ok"
			var btn1Caption = "Cancel";//if it enters in logout mode the first button is "Cancel"
			if(FL.fl.getsId())
				btn1Caption = "Logout";//if it enters in loggedin mode the first button is "Logout"
			FL.common.editMasterDetail("B"," Sign in to FrameLink","loginTemplate",masterDetailItems,{type:"primary", icon:"user",button1:btn1Caption,button2:"Sign in"},function(result){
				if(result){//user choosed login
					var email = $('#login_email').val();
					var password = $('#login_password').val();
					var spinner=FL.common.loaderAnimationON('spinnerDiv');
					var loginPromise = FL.API.loadDefaultApp({email:email,password:password,domain:null});
					loginPromise.done(function(menuData,homeHTML){
						setupApp(menuData,homeHTML,{email:email,password:password,domain:null});
						$('#trigger1').show();$('#trigger2').show();$('#trigger3').show();
						var okToContinue = true;
						spinner.stop();
						return def.resolve(okToContinue,loginObject);
					});
					loginPromise.fail(function(err){
						spinner.stop();
						if(err.code == 1 || err.code == 5){//user does not exist or wrong password
							FL.common.makeModalInfo(
								"Invalid Email/password.<br> - If you are an existing user please correct your EMail/password.<br>" +
								" - If you are a <strong>new user</strong> please press <strong>'Logout'</strong> and then " +
								"<strong>'Get started'</strong> button.<br>", function(){
								FL.common.printToConsole("makeModalInfo --->pressed 'Ok' after Invalid Email/password email="+loginObject.email);
								return def.resolve(false,loginObject);//true ==>continue false=>repeat						
							});
						}else{
							alert("FLlogin2.js loginDialogs >>>>> access FAILURE <<<<< ERROR ->"+err.code+" - "+err.message);    		
							return def.reject(err);
				    	}
					});
				}else{//the user choosed Cancel or Logout (it is the same button)
					if (btn1Caption == "Cancel") {				
						return def.resolve(true,loginObject);
					}else{
						var disconnectPromise = FL.API.disconnect();
						disconnectPromise.then(function(){
							logOutMenu();//displays menu and homepage for logout status
							FL.login.signOut();
							return def.resolve(true,loginObject);
						},function(err){return def.reject(err);});
					}
				}
			});//OK	
			return def.promise();
		};
		var getStartedDialogs = function(loginObject){
			var def = $.Deferred();
			var masterDetailItems = {
				master:{eMail:loginObject.eMail,password:loginObject.password},
				detail:{}
			};
			FL.common.editMasterDetail("B"," Get started with FrameLink","getStartedTemplate",masterDetailItems,{type:"primary", icon:"thumbs-up",button1:"Cancel",button2:"Start now"},function(result){
				if(result){//user choosed login
					var loginObject  = getLoginObject();
					if(loginObject.email.length>0 && loginObject.password.length === 0){
						FL.common.makeModalInfo('You must introduce a password to sign up !',function(){
							FL.common.printToConsole("getStartedDialogs-->missing password for email="+loginObject.email+" !!!");
							def.resolve(false,loginObject);//true ==>continue false=>repeat	
						});
					}else if(loginObject.email.length === 0 && loginObject.password.length === 0){
						FL.common.printToConsole("getStartedDialogs-->sign up for trial");
						// TO BE DONE
						// loginPromise = FL.API.prepareTrialApp().then(function(){return appSetup(loginObject);})
							// .then(function(){return def.resolve();},function(err){return def.reject(err);});

						def.resolve(true);//true ==>continue false=>repeat	
					}else if(loginObject.email.length >0  && loginObject.password.length > 0){//a potencial new user
						FL.common.printToConsole("getStartedDialogs-->sign up for email="+loginObject.email+"/"+loginObject.password);
						var newUserPromise=newUserAccess( loginObject );
						newUserPromise.done(function(userWasCreated){
							if(userWasCreated){
								FL.common.printToConsole("getStartedDialogs ->newUserAccess-> new user " + loginObject.email +" successfully created!");
								loginDefaultMenu_and_homePage(loginObject);//default for new users
								def.resolve(true);//true ==>continue false=>repeat	
							}else{
								FL.common.printToConsole("getStartedDialogs ->newUserAccess-> user " + loginObject.email + " alread exists !!!");
								def.resolve(false,loginObject);//true ==>continue false=>repeat	
							}
						});
						newUserPromise.fail(function(err){alert("getStartedDialogs --> error in newUserAccess for " + loginObject.email + " !!!!");});
					}
				}else{//the user choosed logout
					FL.common.printToConsole("getStartedDialogs-->cancel");
					return def.resolve(true);////true ==>continue false=>repeat		
				}
			});//OK	
			return def.promise();
		};
		var newUserAccess = function(loginObject){//when login email is valid and other data acceptable - {email:email,userName:userName,password:password};
			// loginObject = {email:email,userName:userName,password:password};
			var def = $.Deferred();
			var loginPromise = null;
			// check if the user exists - if it does not exist => creates it.
			FL.common.printToConsole("newUserAccess not a guest -------------------------------------------------------> checks if user exists");
			var spinner=FL.common.loaderAnimationON('spinnerDiv');
			var existingUserPromise=FL.API.isUserExist(loginObject.email);
			existingUserPromise.done(function(exist){
				FL.common.printToConsole("newUserAccess existingUserPromise.done-------------------------------->next will text exist !!!");
				if(!exist){//the user does not exist we can create-it
					FL.common.printToConsole("newUserAccess existingUserPromise.done----------------------------> unexisting user!. We can create it");
					var userName = FL.common.stringBeforeLast(loginObject.email,"@");
					createUserPromise = FL.API.createUserAndDefaultApp(loginObject.email,loginObject.password, "First app of " + userName)
						.then(function(){
							spinner.stop();
							FL.common.printToConsole("FLlogin2 ->newUserAccess-> success creating a new user! ->now we create _histoMail");
							return def.resolve(true);//true ==>user was created
							},function(err){FL.common.printToConsole("FLlogin2newUserAccess->fail");return def.reject(err);});
				}else{//user exist !!!
					spinner.stop();
					FL.common.makeModalInfo("Cannot sign up because " + loginObject.email + " is already registered.<br> - If " + loginObject.email + " is your Email, please choose <strong>'Sign In'</strong> to enter as an existing user.",function(){
						FL.common.printToConsole("FLlogin2newUserAccess->makeModalInfo --->pressed 'Ok' after existing email message for email="+loginObject.email);
						return def.resolve(false);//false ==>user not created because it already exists						
					});
				}
			});
			existingUserPromise.fail(function(err){
				spinner.stop();
				alert("newUserAccess --> error while checking if user " + loginObject.email + " exists !!!! err="+JSON.stringify(err));
				return def.reject("Error while checking if user " + loginObject.email + " exists!");
			});
			return def.promise();
		};
		var recoverLastTourActiveStatus = function() {//recover locally saved menu and informs FL.menu about the new menu if any
			var lastTourStatusStr = localStorage.getItem("storedTourStatus");
			var lastTourStatusObject = null;
			if(lastTourStatusStr) {
				lastTourStatusObject = JSON.parse(lastTourStatusStr);
				FL.tourActive = lastTourStatusObject.tourActive;
				FL.showTourStep0 = false;
				// alert("recoverLastTourActiveStatus: last Tour Status FL.tourActive ="+FL.tourActive);
			}else{
				FL.tourActive = false;
				FL.showTourStep0 = true;
				// alert("recoverLastTourActiveStatus: no lastTourStatusStr was saved !!!!");
			}
		};
		var resetStyle = function(is_logIn) {//if is_login = true display last locally saved style else display FLreadable.css
			//if is_LogIn = true =>soft reset - this method recovers style and fontFamily from  localStorage and sets it on use
			//if is_LogIn = false =>hard reset - this method forces currentStyle = "readable" and currentFontFamily = "helvetica" settinmg it to use
			var lastStyleStr = localStorage.style;// Retrieve last saved style ex.red or spacelab
			var lastFontFamilyStr = localStorage.fontFamily;// Retrieve last saved fontFamily ex.impact or georgia	

			// var	currentStyle = "readable";//default style
			// var	currentFontFamily = "helvetica";//default font
			var	currentStyle = this.defaultStyle;
			var	currentFontFamily = this.defaultFontFamily;
			if (is_logIn) {//a soft reset - the content from local storage will be used. Otherwise force default values
				if(lastStyleStr)
					currentStyle = lastStyleStr;
				if(lastFontFamilyStr)
					currentFontFamily = lastFontFamilyStr;
			}
			FL.common.setStyleAndFont(currentStyle,currentFontFamily);
			localStorage.style = currentStyle;
			localStorage.fontFamily = currentFontFamily;
			FL.currentStyle = currentStyle; //to be compatible with touring - before code review
			FL.currentFontFamily = currentFontFamily; //to be compatible with touring - before code review
			$("#_css").text(FL.currentStyle);
			$.Topic( 'styleChange' ).publish( FL.currentStyle );//broadcast that will be received by FL.tour
			$.Topic( 'fontChange' ).publish( FL.currentFontFamily );//broadcast that will be received by FL.tour
		};
		return{
			test:"juakim",
			token: {fl:null},
			appToken: {},
			defaultStyle: "readable",
			defaultFontFamily: "helvetica",
			permissionToAddMenu: true,
			defaultMenu: {
				// "menu" : [
				// 	{
				// 		"title" : "User Administration",//0
				// 		"uri":"javascript:FL.links.userAdministration()"
				// 	}
				// ]
				"menu" : [
					{
						"title" : "Settings",//0
						"uri":"#",				
						"menu":[
							{
								"title" : "User Administration",//0
								"uri":"javascript:FL.links.userAdministration()"
							},
							{
								"title" : "Preferences",//0
								"uri":"#",
								"menu":[
									{
										"title" : "Styles and Fonts",//0
										"uri":"javascript:FL.links.editStylesAndFonts()"
									},
									{
										"title" : "Home Page",//0
										"uri":"javascript:FL.links.pageEditor('home')"
									},
								]
							},
							{
								"title" : "emails/Newsletter templates",
								"uri":"#",
								"menu":[
									{
										"title" : "Newsletter templates",//0
										"uri":"javascript:FL.links.newsletterEditor()"
									},
									{
										"title" : "Display rejected list",//0
										"uri":"javascript:FL.links.getMandrillRejectListForSender()"
									},
									{
										"title" : "remove jojo from rejected list",//0
										"uri":"javascript:FL.links.setMandrillDeleteFromReject(['jojo@mailinator.com'])"
									},
									{
										"title" : "remove zwnfabhn from rejected list",//0
										"uri":"javascript:FL.links.setMandrillDeleteFromReject(['zwnfabhn@sharklasers.com'])"
									},
									{
										"title" : "email Statistics",//0
										"uri":"javascript:FL.links.displayStatistics()"
									},									
								]
							},							
							{
								"title" : "Grids",//0
								"uri":"#",
								"menu":[
									{
										"title" : "Create Grid",//0
										"uri":"javascript:FL.grid.createGrid()"
									},
									{
										"title" : "Import CSV Spreadsheet",//0
										"uri":"javascript:javascript:FL.grid.importGrid()"
									}
								]
							}						
						]
					}
				]
			},
			//defaultPage HTML can contain the variables: <%= appDescription %>, <%= shortUserName %>, <%= userName %> (used by FL.API._restorePage)
			defaultPage: "<div class='jumbotron'>" +
							"<h1>Welcome</h1>" +
							"<p>Hello <strong><%= shortUserName %></strong>, your are logged into FrameLink !</p>" +
							"<p>Application description: <%= appDescription %></p>" +
						"</div>",
			defaultPageOnLogout: "<div class='jumbotron'>" +
									"<h1>FrameLink Platform</h1>" +
									"<p>Please <strong>Sign In</strong> as a designer (upper right corner) or choose " +
									"<strong>Get started</strong> if you are a first time user.</p>" +
									"<p>" +
										// "<a href='#' class='btn btn-primary btn-large' onclick='FL.showTourStep0 = true; FL.tourIn();'>Tour</a>" +
										"<a href='#' class='btn btn-primary btn-large' onclick='FL.login.getStarted();'>Get started with a FREE beta account</a>" +
									"</p>" +
								"</div>",					
			// fl: new flMain(),//FL.login.fl
			fl: null,//FL.login.fl
			fa: null,
			emailContentTemplate:null, //used on FLmenulinks - if not null it is ready to send newsletter
			emailTemplateName:null,
			emailImagesArray:[], //used on FLmenulinks - getHTMLContent to prepare a Mandrill array with all base64 images
			ServerByPass:true,
			signOut: function(){//saves logout in local storage ->hide slide panels  ->updates upper right corner display
				// localStorage.setItem("login", "");
				// FL.login.signOut()
				$('#trigger1').hide();$('#trigger2').hide();$('#trigger3').hide();
				localStorage.login = "";

				FL.domain = FL.login.token.appDescription; //test with "jojo"+loginObject.email;

				// localStorage.storedMenu = JSON.stringify(FL.oMenu);//initial menu
				$.Topic( 'signInDone' ).publish( false );//broadcast that will be received by FL.menu to update .editable to false
				// $.Topic( 'jsonMenuUpdate' ).publish( FL.clone(FL.oMenu) );//broadcast that will be received by FL.menu to update jsonMenu
				$.Topic( 'sidePanelOpened' ).publish( false ); //informs FL.menu that sidePanel is closed 

				// loadCSS("FLreadable.css");
				resetStyle(true);
				displaySignInUser();//displays no user, just icon and "Sign In" link
				FL.mix("Entering",{});
			},
			checkSignIn:function() {
				//checkSignIn2 ->recover last saved loginObject and:
				//	if user/password exists ->logs in -> shows slide panels ->updates upper right corner
				//	if not keeps user in logout mode. -> hide slide panels  ->updates upper right corner
				var def = $.Deferred();

				messageEnabler.getInstance();//a singleton to listen for "slidePanel" broadcasts 
				var loggedIn = false;
				var lastLogin = null;
				var htmlToInject = null;
				var user = null;
				if (typeof(Storage) !== undefined) {//browser supports storage
					var lastLoginStr = localStorage.login;// Retrieve format {email:x1,userName:x2,password:x3};
					if (typeof lastLoginStr === "undefined" || lastLoginStr === ""){
						lastLoginStr = null;
						FL.API.clearServerToken();//sets token as null						
					}
					if(lastLoginStr !== null) {//user/password exist
						var lastLoginObj = JSON.parse(lastLoginStr);
						var spinner=FL.common.loaderAnimationON('spinnerDiv');
						var loadDefaultAppPromise = FL.API.loadDefaultApp(lastLoginObj)//no loginAcess, no appSetup
							.then(function(menuData,homeHTML){
								spinner.stop();
								setupApp(menuData,homeHTML,lastLoginObj);						
								$('#trigger1').show();$('#trigger2').show();$('#trigger3').show();
								$.Topic( 'signInDone' ).publish( true ); //informs FL.menu that edition is allowed						
								return def.resolve();
							},function(err){
								if(err.code == 1){//user does not exist
									spinner.stop();
									FL.login.signOut();//saves logout in local storage ->hide slide panels  ->updates upper right corner display
									logOutMenu();//displays menu and homepage for logout status
									return def.resolve();
								}
								alert("checkSignIn ->access ERROR ->"+err.code+" - "+err.message);
								return def.reject("Login access error err="+JSON.stringify(err));
							});
					}else{//the status is signed out
						logOutMenu();//displays menu and homepage for logout status
						FL.login.signOut();//saves logout in local storage ->hide slide panels  ->updates upper right corner display
						return def.resolve();
					}				
				}else{
					FL.common.makeModalInfo('No menu persistence because your browser does not support Web Storage...',function(){
						return def.reject("Unsupported browser");
					});
				}
				return def.promise();
			},
			signIn: function() {//called from href in first line of screen (htmlToInject)
				// http://www.sitepoint.com/11-ways-to-enhance-your-web-application/
				// Use cases:
				// 		New user
				FL.common.printToConsole("enter signIn");
				$.Topic( 'inLogOnProcess' ).publish( true );//broadcast that will be received by FL.menu to update .editable to false
				if(FL.is_sidePanelOpen){
					FL.common.makeModalInfo("Please close FrameLink side panel before changing your Sign In/Sign Out status");
				}else{
					if (typeof(Storage) !== undefined) {//browser supports storage
						var loginObject =  {email:"",userName:"",password:""};
						var lastLoginStr = localStorage.getItem("login");
						if (lastLoginStr == "undefined")
							lastLoginStr = undefined;
						if(lastLoginStr) {
							loginObject=JSON.parse(lastLoginStr);
						}
						var loginOkPromise = loginDialogs(loginObject);
						loginOkPromise.done(function(loginOk,loginObject){
							FL.common.printToConsole("signIn --------------->loginOk="+loginOk+" Email="+loginObject.email);//loginOk ==>go false=>repeat
							if(!loginOk){
								if(loginObject.email.length>0){
									localStorage.login = JSON.stringify(loginObject);
								}
								FL.login.signIn();
							}
						});
						loginOkPromise.fail(function(err){
							alert("Login access error err="+JSON.stringify(err));
						});

					}else{
						// BootstrapDialog.alert('No menu persistence because your browser does not support Web Storage...');
						FL.common.makeModalInfo('No menu persistence because your browser does not support Web Storage...');
					}
				}
			},
			getStarted: function(loginObject){
				if(!loginObject)// the first call is done from FL.login.defaultPageOnLogout with onclick='FL.login.getStarted();'
					loginObject  = {eMail:"",password:""};
				var getStartedPromise = getStartedDialogs(loginObject);
				getStartedPromise.done(function(continueOk,loginObject){
					FL.common.printToConsole("getStarted --------------->continueOk=" + continueOk);//continueOk ==>go false=>repeat
					if(!continueOk){
						FL.login.getStarted(loginObject);
					}
				});
				getStartedPromise.fail(function(err){
					alert("Login access error err="+JSON.stringify(err));
				});
			},
			home:function(){
				// alert("the brand !!!");
				var loadAppPromise=FL.API.loadAppDataForSignInUser2();//gets data dictionary + main menu + style + fontFamily + home page
				loadAppPromise.done(function(menuData,homeHTML){
					FL.common.printToConsole("FL.login.home ---> homeHTML=" + homeHTML);
					// FL.common.printToConsole("FL.login.home --------------------------------------------->first menu=" + menuData.oMenu.menu[0].title);				
					FL.common.clearSpaceBelowMenus();
					FL.domInject("_placeHolder",homeHTML );
				});	
				loadAppPromise.fail(function(err){
					alert("FLpage_editor ->  --> after successfull connectUserToDefaultApp FAILURE in loadAppDataForSignInUser2 <<<<< error="+err);
				});				
			},
			clearAllSettings: function(){//restore original menu in local storage and updates DOM status - called directly from DOM link
	            FL.common.makeModalConfirm("Your current edit menu will be lost and you will be logged out. Do you really want this ?","Cancel","OK",function(result){
	                if(result){
						localStorage.clear();
						$.Topic( 'signInDone' ).publish( false );//broadcast that will be received by FL.menu to update .editable to false
						// $.Topic( 'jsonMenuUpdate' ).publish( FL.clone(FL.oMenu) );//broadcast that will be received by FL.menu to update jsonMenu
	                     FL.common.makeModalInfo('The full reset was done. <strong>Please Sign In again</strong>.');
	                     FL.login.checkSignIn(true);
	                }
	            });//OK			
			},
			selectStyle: function() {
				alert("selectStyle !");
			}
		};
	})();
	FL["showTourStep0"] = false;
	//FL.currentStyle is still used to communicate with Tour2
});