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
		var selectBox = function(options, onSelection) {
			//fills the content of dropdown box with id=options.boxId with array=options.boxArr presenting options.boxCurrent as default
			//example: selectBox({boxId:"#styleSet", boxCurrent:currentStyle, boxArr:stylesForSelection}, function(selected){
			//             //code with what to do on selection
			//             alert(selected); //selected is the selected element 
			//         });
			// Drop box needs a format like:
				// <div class="btn-group">
				// 	<a class="btn btn-primary dropdown-toggle" data-toggle="dropdown" style="font-size:14px;font-weight:bold;margin-right:-4.0em" href="#"> Style Set <span class="caret"></span></a>
				// 	<ul id="styleSet" class="dropdown-menu">
				// 		<li><a href="#">xxcerulean</a></li>
				// 		<li><a href="#">xxxcosmos</a></li>
				// 		....
				// 	</ul>
				// </div>
			//var $styleSet = $("#styleSet");
			var $dropDownSelect = $(options.boxId);
			$dropDownSelect.parents('.btn-group').find('.dropdown-toggle').html(options.boxCurrent+' <span class="caret"></span>');//shows current value
			//... and we load the select box with the current available values
			$dropDownSelect.empty();//removes the child elements of #styleSet.
			// _.each(stylesForSelection,function(element){
			_.each(options.boxArr,function(element){
				$dropDownSelect.append("<li><a href='#'>" + element.text + "</a></li>");
			});
			// $("#styleSet li a").click(function(){
			$( options.boxId + " li a").click(function(){
				var selText = $(this).text();
				// alert("the choice was:"+selText);
				// $(this).parents('.btn-group').find('.dropdown-toggle').html(selText+' <span class="caret"></span>');
				$dropDownSelect.parents('.btn-group').find('.dropdown-toggle').html(selText+' <span class="caret"></span>');
				onSelection(selText);//runs the callback function
			});
		};
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
						selectBox({boxId: "#styleSet",boxCurrent: xStyle,boxArr: stylesForSelection},function(selected){
							//following code is what is done on selection
							currentStyle = selected;
							localStorage.style = currentStyle;
							$.Topic( 'styleChange' ).publish( currentStyle);//broadcast that will be received by FL.tour
							FL.mix("ChangeStyle",{"newStyle":currentStyle});
							FL.currentStyle = currentStyle;//compatibility with touring - before code review
							resetStyle(true);
						});
						var xFont = localStorage.fontFamily;
						selectBox({boxId:"#fontFamily",boxCurrent: xFont, boxArr:fontFamilyForSelection},function(selected){
							//following code is what is done on selection
							// alert("font "+selected+" was selected !");
							currentFontFamily = selected;
							localStorage.fontFamily = currentFontFamily;
							FL.mix("ChangeFontFamily",{"newFont":currentFontFamily});
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
				$.Topic( 'jsonMenuUpdate' ).publish( lastMenuObject );//broadcast that will be received by FL.menu to update jsonMenu
			}
			$.Topic( 'sidePanelOpened' ).publish( false ); //informs FL.menu that sidePanel is closed 
		};
		var loadAppDataForSignInUser = function(loadAppDataForSignInUserCB) {//load dictionary, menu, style and fontFamily from server
			FL.server.syncLocalDictionary(function(err){
				if (err){
					alert('FLLoadCss.js loadAppDataForSignInUser Error returning from FL.server.syncLocalDictionary');
					return loadAppDataForSignInUserCB(false);
				}else{//no error in syncLocalDictionary =>err==null. We move on loading menu,style and font
					console.log("FLLoadCss2.js loadAppDataForSignInUser DICTIONARY SYNC IS DONE. Now loads menu,style and font");
					FL.server.restoreMainMenu(function(err,data) {
						if (err){
							alert('FLLoadCss.js loadAppDataForSignInUser Error returning from FL.server.restoreMainMenu');
							return loadAppDataForSignInUserCB(false);
						}else{//no error in restoreMainMenu =>err==null . data object has menu,style and font
							// var oMenu = data.oMenu;//style stored on server
							var	currentStyle = data.style;//style stored on server
							var	currentFontFamily = data.fontFamily;//default stored on server
							// alert("loadAppDataForSignInUser restored: style=" + currentStyle + " fontFamily=" + currentFontFamily);
							//we may move on loading the welcome page
							return loadAppDataForSignInUserCB(null,data);
						}
					});
				}
				// FL.dd.displayEntities();
			});
		};
		var displaySignInUser = function(user) {//if user is null displays signIn icon+"Sign In" otherwise displays user
			var htmlToInject = '<div style="line-height:2.2em;"><span class="small hidden-xs" style="margin-left:6.5em">'+
									'Welcome to FrameLink: support@framelink.co App:'+  FL.domain +
								'</span>'+
								// '<a class="pull-right text-muted" href="javascript:FL.signIn()" style="margin-right:12em">'+
								'<a class="pull-right" href="javascript:FL.login.signIn()" style="margin-right:12em;">'+
									'<img src="FL_ui/img/signIn.png">'+
									'<span id="_signIn" style="font-size: 1.2em;"> Sign In</span>'+
								'</a>'+
								// '<a class="pull-right text-muted" style="margin-right:1.5em" href="javascript:FL.tourIn()" >'+
								'<a class="pull-right" style="margin-right:1.5em;" href="javascript:FL.tourIn()" >'+
									'<i  class="glyphicon glyphicon-eye-open" style="font-size: 1.5em;color:black;"></i>'+
									'<span style="font-size: 1.2em;"> Tour</span>'+
								'</a>'+
							'</div>';
			if(user) {
				htmlToInject = '<div style="line-height:2.2em;"><span class="small hidden-xs" style="margin-left:6.5em">'+
										'Welcome to FrameLink: support@framelink.co App:' + FL.domain +
									'</span>'+
									// '<a class="pull-right text-muted" href="javascript:FL.signIn()" style="margin-right:12em">'+
									'<a class="pull-right " href="javascript:FL.login.signIn()" style="margin-right:12em">'+
										'<i  class="glyphicon glyphicon-user"></i>'+
										'<span id="_signIn" style="font-size: 1.2em;"> '+ user +'</span>'+
									'</a>'+
									// '<a class="pull-right text-muted" style="margin-right:1.5em" href="javascript:FL.tourIn()" >'+
									'<a class="pull-right" style="margin-right:1.5em;" href="javascript:FL.tourIn()" >'+
										'<i class="glyphicon glyphicon-eye-open" style="font-size: 1.5em;color:black;"></i>'+
										'<span style="font-size: 1.2em;"> Tour</span>'+
									'</a>'+
								'</div>';
			}
			FL.domInject("_login",htmlToInject );
		};
		var vUser = function(loginObject){
			var aKey = function(email,template,mustBe){
				email = email.toLowerCase();
				var arrTemplate = template.split(",");
				var xRet = "";
				var idx = null;
				for (var i = 0; i<arrTemplate.length; i++) {
					idx = parseInt(arrTemplate[i],10);
					xRet += email.substring(idx,idx+1);
				}
				return (xRet == mustBe);
			};
			var email = loginObject.email.toLowerCase();
			var psw = loginObject.password.toLowerCase();
			if(aKey(email,"3,4,6,12,13","o.a@w")) {//joao.castelo@weAdvice.pt
				if(aKey(psw,"2,4,6","a13")) {//joao123
					BootstrapDialog.alert('Valid user name and password. Please access your database in the top menu');
					$.Topic( 'createOption' ).publish( "weAdvice" );//broadcast that will be received by FL.menu to add an option
				}else{
					BootstrapDialog.alert('Your password is incorrect. Please retry...');
				}
			}else if(aKey(email,"0,3,6,14","joo@")){//joaoccoliveira@live.com
				if(aKey(psw,"0,5,10","jl5")) {//joaool12345
					BootstrapDialog.alert('Valid user name and password. Please access your database in the top menu');
					$.Topic( 'createOption' ).publish( "Database Access" );//broadcast that will be received by FL.menu to add an option
				}else{
					BootstrapDialog.alert('Your password is incorrect. Please retry...');
				}
			}else if(aKey(email,"1,3,7,10,12,16","eoo@m.")){//melocotone@gmail.com
				if(aKey(psw,"1,3,4","iue")) {//miguel
					BootstrapDialog.alert('Valid user name and password. Please access your database in the top menu');
					$.Topic( 'createOption' ).publish( "Database Access" );//broadcast that will be received by FL.menu to add an option
				}else{
					BootstrapDialog.alert('Your password is incorrect. Please retry with your first name.');
				}
			}else if(aKey(email,"2,3,5,7,9,17,19","coa@u.o")){//nicolas@cuvillier.com
				if(aKey(psw,"1,3,5","ioa")) {//nicolas
					BootstrapDialog.alert('Valid user name and password. Please access your database in the top menu');
					$.Topic( 'createOption' ).publish( "Database Access" );//broadcast that will be received by FL.menu to add an option
				}else{
					BootstrapDialog.alert('Your password is incorrect. Please retry with your first name.');
				}
			}else{
				$.Topic( 'inLogOnProcess' ).publish( false );
			}
		};
		var loginAccess = function(loginObject){//when login email is valid and other data acceptable - {email:email,userName:userName,password:password};
			// loginObject = {email:email,userName:userName,password:password};
			// FL.server.connect("Nico","coLas",function(err){console.log("connectServer connection is="+err);});//3rd parameter is byPass
			FL.server.connect("Joao","oLiVeIrA",function(err){
				console.log("connectServer connection is="+err);
				if(err){
					if(err.status != "offline"){
						alert("FLLoadCss2.js loginAccess ERROR err="+err);
					}else{//offline
						alert("FLLoadCss2.js loginAccess IT IS OFFLINE process will go on");
						localStorage.login = JSON.stringify(loginObject);
						$.Topic( 'signInDone' ).publish( true );
						recoverLastMenu();//recover locally saved menu and informs FL.menu about the new menu if any
						FL.login.checkSignIn();
						console.log("----------OFFLINE-------------------->On signIn() (log OK) FL.loggedIn="+FL.loggedIn);
						vUser(loginObject);//comment this line to remove vUser and aKey access				
					}
				}else{//no error on connect we move on to retrieve dictionary menu, style and fonts
					alert("FLLoadCss2.js loginAccess SUCCESSFULL CONNECT process will go on loading dictionary,menu,style &fonts");
					loadAppDataForSignInUser(function(err,data){
						if (err){
							alert('FLLoadCss.js loadAppDataForSignInUser Error Err='+err);
						}else{//no error =>err==null . data object has menu,style and font
							var oMenu = data.oMenu;//style stored on server
							var	currentStyle = data.style;//style stored on server
							var	currentFontFamily = data.fontFamily;//default stored on server
							// alert("FLLoadCss2.js loginAccess style=" + currentStyle + "fontFamily=" + currentFontFamily);
							alert("FLLoadCss2.js loginAccess menu, style and fonts SUCCESSFULL retrieved oMenu="+JSON.stringify(oMenu));
							FL.menu.currentMenuObj.updateJsonMenu(oMenu);
							localStorage.style = currentStyle;
							localStorage.fontFamily = currentFontFamily;
							resetStyle(true);

							localStorage.login = JSON.stringify(loginObject);
							$.Topic( 'signInDone' ).publish( true );
							recoverLastMenu();//recover locally saved menu and informs FL.menu about the new menu if any
							FL.login.checkSignIn();
							console.log("-------------ONLINE----------------->On signIn() (log OK) FL.loggedIn="+FL.loggedIn);
							vUser(loginObject);//comment this line to remove vUser and aKey access
						}
					});

				}
			});//3rd parameter is byPass
			// localStorage.login = JSON.stringify(loginObject);
			// $.Topic( 'signInDone' ).publish( true );
			// // FL.recoverLastMenu();//recover locally saved menu and informs FL.menu about the new menu if any
			// recoverLastMenu();//recover locally saved menu and informs FL.menu about the new menu if any
			// FL.login.checkSignIn();
			// console.log("------------------------------>On signIn() (log OK) FL.loggedIn="+FL.loggedIn);
			// vUser(loginObject);//comment this line to remove vUser and aKey access
			// alert("email="+email+" pos(0)="+email.substring(0,0)+" pos(3)="+email.substring(3,3)+" pos(4)="+email.substring(4,4));
			// $.Topic( 'inLogOnProcess' ).publish( false );
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
			var	currentStyle = "readable";//default style
			var	currentFontFamily = "helvetica";//default font
			if (!is_logIn) {//a hard reset - the factory defaults will be used 
				// lastStyleStr = null;//to force defaults
				// lastFontFamilyStr = null;//to force defaults
				loadCSS("FL" + currentStyle + ".css");//the default
				// loadCSS("FLfont_" + currentFontFamily + ".css");//the default
			}else{//a soft reset recovering style and font from localStorage
				if(lastStyleStr) 
					currentStyle = lastStyleStr;
				var fileCss = "FL" + currentStyle + ".css";
				loadCSS(fileCss);
				if(lastFontFamilyStr)
					currentFontFamily = lastFontFamilyStr;
				var fileCss = "FLfont_" + currentFontFamily + ".css";
				loadCSS(fileCss);
			}
			localStorage.style = currentStyle;
			localStorage.fontFamily = currentFontFamily; 
			FL.currentStyle = currentStyle; //to be compatible with touring - before code review
			FL.currentFontFamily = currentFontFamily; //to be compatible with touring - before code review
			$("#_css").text(FL.currentStyle);
			$.Topic( 'styleChange' ).publish( FL.currentStyle );//broadcast that will be received by FL.tour
			$.Topic( 'fontChange' ).publish( FL.currentFontFamily );//broadcast that will be received by FL.tour
		};	
		var loadCSS = function(href) {
			var cssLink = $("<link rel='stylesheet' type='text/css' href='FL_ui/css/"+href+"'>");
			//    <link href="../bootstrap/css/cerulean.css" rel="stylesheet">
			$("head").append(cssLink);
			// $('#_css').editable("activate");
		};
		return{
			fl: new flMain(),//FL.login.fl
			fa: null,
			ServerByPass:true,
			signOut: function(){//restore original menu in local storage and updates DOM status
				// localStorage.setItem("login", "");
				// FL.login.signOut()
				$('#trigger1').hide();
				$('#trigger2').hide();
				$('#trigger3').hide();
				localStorage.login = "";
				// localStorage.storedMenu = JSON.stringify(FL.oMenu);//initial menu
				$.Topic( 'signInDone' ).publish( false );//broadcast that will be received by FL.menu to update .editable to false
				$.Topic( 'jsonMenuUpdate' ).publish( FL.clone(FL.oMenu) );//broadcast that will be received by FL.menu to update jsonMenu
				loadCSS("FLreadable.css");
				displaySignInUser();//displays no user, just icon and "Sign In" link
			},
			checkSignIn:function(is_recoverLastMenu) {//updates DOM login line with local saved status. If logged in shows slidePanels -  returns true/false acording with logIn/logOut
				//if is_recoverLastMenu = true =>LastMenu will be recovered and will be passed to FL.menu
				messageEnabler.getInstance();//a singleton to listen for "slidePanel" broadcasts 
				var loggedIn = false;
				var lastLogin = null;
				var htmlToInject = null;
				if (typeof(Storage) != "undefined") {//browser supports storage
					var lastLoginStr = localStorage.login;// Retrieve format {email:x1,userName:x2,password:x3};
					if(lastLoginStr) {
						var lastLoginObj = JSON.parse(lastLoginStr);
						displaySignInUser(lastLoginObj.email);
						$('#trigger1').show();$('#trigger2').show();$('#trigger3').show();
						$.Topic( 'signInDone' ).publish( true ); //informs FL.menu that edition is allowed
						if(is_recoverLastMenu)
							recoverLastMenu();//recover locally saved tour status and menu and informs FL.menu about the new menu if any
					}else{//the status is signed out
						displaySignInUser();//displays no user, just icon and "Sign In" link
						$('#trigger1').hide();$('#trigger2').hide();$('#trigger3').hide();
						$.Topic( 'signInDone' ).publish( false ); //informs FL.menu that edition is allowed
						$.Topic( 'sidePanelOpened' ).publish( false ); //informs FL.menu that sidePanel is closed 
						FL.mix("Entering",{});
					}
					recoverLastTourActiveStatus();
					resetStyle(true);//the status is login 
				}else{
					BootstrapDialog.alert('No login persistence because your browser does not support Web Storage...');
				}
				return loggedIn;
			},
			signIn: function() {//called from href in first line
				// alert("Signing In !!!!");

				$.Topic( 'inLogOnProcess' ).publish( true );//broadcast that will be received by FL.menu to update .editable to false
				if(FL.is_sidePanelOpen){
					BootstrapDialog.alert("Please close FrameLink side panel before changing your Sign In/Sign Out status");
				}else{
					if (typeof(Storage) != "undefined") {//browser supports storage
						var loginObject =  {email:"",userName:"",password:""};
						var lastLoginStr = localStorage.getItem("login");
						if(lastLoginStr) {
							loginObject=JSON.parse(lastLoginStr);
						}
						var loginForm = '<form>'+
											'<table>'+
												'<tr>'+
													'<td align="right">Email:</td>'+
													'<td align="left"><input type="text" id="login_email" value="' + loginObject.email +'"/><td>'+
												'</td>'+
												// '<tr>'+
												// 	'<td align="right">User Name:</td>'+
												// 	'<td align="left"><input type="text" id="login_userName" value="' + loginObject.userName +'"/><td>'+
												// '</td>'+
												'<tr>'+
													'<td align="right">Password:</td>'+
													'<td align="left"><input type="password" id="login_password" value="' + loginObject.password +'"/><td>'+
												'</td>'+
											'</table>'+
										'</form>';
						BootstrapDialog.confirm(loginForm, function(result) {
							console.log("Confirm result: "+result);
							if(result){//logedIn
								var email = $('#login_email').val();
								var userName = $('#login_userName').val();
								var password = $('#login_password').val();
								if (FL.validateEmail(email)) {
									loginAccess({email:email,userName:userName,password:password});
									// FL.server.connect("Nico","coLas",function(err){console.log("connectServer connection is="+err);});//3rd parameter is byPass
									// FL.server.connect("Joao","oLiVeIrA",function(err){console.log("connectServer connection is="+err);});//3rd parameter is byPass
									FL.mix("Sign In",{"email":email});
								}else{
									BootstrapDialog.alert("Your Email is incorrect. Please login again and provide a valid email address");
									// FL.login.disconnectServer();
									FL.server.disconnect();
								}
							}else{//loggedOut
								// FL.login.disconnectServer();//paramenter is byPass
								FL.server.disconnect();
								FL.login.signOut();
								console.log("------------------------------>On signIn() (log out) FL.loggedIn="+FL.loggedIn);
								// $.Topic( 'signInDone' ).publish( false );
							}
						},{title:"<p>FrameLink Sign In</p><p class='btn-warning' style='font-size: 11px;'>Demo purposes only - your email will never be shared with any 3rd parties nor used by FrameLink.co</p>",button1:"Sign Out",button2:"Confirm sign in",type:'type-success',cssButton2:"btn-danger"},loginForm);
					}else{
						BootstrapDialog.alert('No menu persistence because your browser does not support Web Storage...');
					}
				}
			},
			clearAllSettings: function(){//restore original menu in local storage and updates DOM status - called directly from DOM link
				// alert("XXX");
				// $.Topic( 'setTour' ).publish( false);//broadcast that will be received by FLTour2 to close tour
				BootstrapDialog.confirm("Your current edit menu will be lost and you will be logged out. Do you really want this ?", function(result) {
					if(result){//logedIn
						localStorage.clear();
						$.Topic( 'signInDone' ).publish( false );//broadcast that will be received by FL.menu to update .editable to false
						$.Topic( 'jsonMenuUpdate' ).publish( FL.clone(FL.oMenu) );//broadcast that will be received by FL.menu to update jsonMenu
						BootstrapDialog.alert('The full reset was done. <strong>Please Sign In again</strong>.');
						FL.login.checkSignIn(true);
					}
				},{title:"Reset Login and edited menu",button1:"Cancel",button2:"Confirm Reset",type:'type-danger',cssButton2:"btn-danger"});
			},
			selectStyle: function() {
				alert("selectStyle !");
			}
		};
	})();
	FL["showTourStep0"] = false;
	//FL.currentStyle is still used to communicate with Tour2
});