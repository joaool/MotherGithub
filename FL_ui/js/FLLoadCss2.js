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
			// $dropDownSelect.parents('.btn-group').find('.dropdown-toggle').html(options.boxCurrent+' <span class="caret"></span>');//shows current value
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
					// alert("messageEnabler.receiver triggerName="+triggerName+" enter="+enter);

					if(triggerName == "#trigger1") {//user entered or exited slide panel fl_settings.html
						// alert("messageEnabler.receiver received message from trigger1="+lastMessage+" currentStyle="+currentStyle+" font="+currentFontFamily);
						// $("#styleSet").parents('.btn-group').find('.dropdown-toggle').html(currentStyle +' <span class="caret"></span>');//shows current value
						//the values that appear before any selection....
						$("#styleSet").parents('.btn-group').find('.dropdown-toggle').html(currentStyle +' <span class="caret"></span>');//shows current value
						$("#fontFamily").parents('.btn-group').find('.dropdown-toggle').html(currentFontFamily +' <span class="caret"></span>');//shows current value

						selectBox({boxId: "#styleSet",boxCurrent: currentStyle,boxArr: stylesForSelection},function(selected){
							//following code is what is done on selection
							currentStyle = selected;
							localStorage.style = currentStyle;
							$.Topic( 'styleChange' ).publish( currentStyle);//broadcast that will be received by FL.tour
							FL.mix("ChangeStyle",{"newStyle":currentStyle});
							FL.currentStyle = currentStyle;//compatibility with touring - before code review
							resetStyle(true);
						});
						selectBox({boxId:"#fontFamily", boxArr:fontFamilyForSelection},function(selected){
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
		var displaySignInUser = function(user) {//if user is null displays signIn icon+"Sign In" otherwise displays user
			var htmlToInject = '<div style="line-height:2.2em;"><span class="small hidden-xs" style="margin-left:6.5em">'+
									'Welcome to FrameLink: support@framelink.co'+
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
										'Welcome to FrameLink: support@framelink.co'+
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
			localStorage.login = JSON.stringify(loginObject);
			$.Topic( 'signInDone' ).publish( true );
			// FL.recoverLastMenu();//recover locally saved menu and informs FL.menu about the new menu if any
			recoverLastMenu();//recover locally saved menu and informs FL.menu about the new menu if any
			FL.login.checkSignIn();
			// this.checkSignIn();
			console.log("------------------------------>On signIn() (log OK) FL.loggedIn="+FL.loggedIn);
			vUser(loginObject);//comment this line to remove vUser and aKey access
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
			var lastStyleStr = localStorage.style;// Retrieve last saved style ex.red or spacelab
			var lastFontFamilyStr = localStorage.fontFamily;// Retrieve last saved fontFamily ex.impact or georgia
			if (!is_logIn) {//the defaults
				lastStyleStr = null;//to force defaults
				lastFontFamilyStr = null;//to force defaults
				currentStyle = "readable";
				currentFontFamily = "helvetica";
				loadCSS("FL" + currentStyle + ".css");//the default
				// loadCSS("FLfont_" + currentFontFamily + ".css");//the default
			}else{
				if(lastStyleStr) {
					currentStyle = lastStyleStr;
					var fileCss = "FL" + currentStyle + ".css";
					loadCSS(fileCss);
				}
				if(lastFontFamilyStr) {
					currentFontFamily = lastFontFamilyStr;
					var fileCss = "FLfont_" + currentFontFamily + ".css";
					loadCSS(fileCss);
				}
			}
			FL.currentStyle = currentStyle; //to be compatible with touring - before code review
			$("#_css").text(FL.currentStyle);
			$.Topic( 'styleChange' ).publish( FL.currentStyle );//broadcast that will be received by FL.tour
		};
		var loadCSS = function(href) {
			var cssLink = $("<link rel='stylesheet' type='text/css' href='FL_ui/css/"+href+"'>");
			//    <link href="../bootstrap/css/cerulean.css" rel="stylesheet">
			$("head").append(cssLink);
			// $('#_css').editable("activate");
		};
		var xdisconnectServer = function() {
			FL.login.fa.disconnect(function(e,d){
				alert ('bye');
			});
		};
		var xconnectServer = function(userName,password,connectServerCB) {
			// var fl = new flMain();
			if(!FL.login.fa)
				FL.login.fa = new FL.login.fl.app();
			var fa = FL.login.fa;
			// var fa = new FL.login.fl.app();
			FL.login.fl.setTraceClient(2);
			FL.login.fl.serverName('flServer');
			FL.login.fl.login({"username": userName, "password": password}, function (err, data){
				if (err){
					alert('flLoging: err=' + JSON.stringify(err));
					return connectServerCB(false);
					// return console.log ('flLoging: err=' + JSON.stringify(err));
				}
				var myApp =data.applications[0];
					alert ('connecting to '+myApp.name);
					fa.connect(myApp, function(err2, data2){
					if (err2){
						alert('fla.connect: err=' + JSON.stringify(err2));
						return connectServerCB(false);
						// return console.log ('fla.connect: err=' + JSON.stringify(err2));
					}
					// var fEnt = new FL.login.fl.entity();
					// fEnt.getAll({query:{}}, function (err, data){
					// 	if(err){
					// 		alert('error in entity.getAll: ' + err);
					// 		return ('error in entity.getAll: ' + err);
					// 	}
					// 	alert(JSON.stringify(data));
					// });
					return connectServerCB(true);
				});
			});
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
			checkSignIn:function(is_recoverLastMenu) {//updates DOM login line with local saved status. If logged in shows flyout button - returns true/false acording with logIn/logOut
				//if is_recoverLastMenu = true =>LastMenu will be recovered and will be passed to FL.menu
				messageEnabler.getInstance();
				var loggedIn = false;
				var lastLogin = null;
				var htmlToInject = null;
				if (typeof(Storage) != "undefined") {//browser supports storage
					var lastLoginStr = localStorage.login;// Retrieve format {email:x1,userName:x2,password:x3};
					if(lastLoginStr) {
						var lastLoginObj = JSON.parse(lastLoginStr);
						displaySignInUser(lastLoginObj.email);

						// var htmlToSidePanel = '<div class="push"> <a id="_toggle" href="#menu" class="menu-link">&#9776;</a>';
						// FL.domInject("_sidePanel",htmlToSidePanel );//shows flyout button
						// $('.menu-link').bigSlide();
						$('#trigger1').show();
						$('#trigger2').show();
						$('#trigger3').show();

						$.Topic( 'signInDone' ).publish( true ); //informs FL.menu that edition is allowed
						if(is_recoverLastMenu)
							recoverLastMenu();//recover locally saved tour status and menu and informs FL.menu about the new menu if any
					}else{//the satus is signed out
						displaySignInUser();//displays no user, just icon and "Sign In" link
						
						// FL.domInject("_sidePanel");//removes flyout button
						$('#trigger1').hide();
						$('#trigger2').hide();
						$('#trigger3').hide();
						
						$.Topic( 'signInDone' ).publish( false ); //informs FL.menu that edition is allowed
						$.Topic( 'sidePanelOpened' ).publish( false ); //informs FL.menu that sidePanel is closed 
						// mixpanel.track("Entering", {
						// });
						FL.mix("Entering",{});
					}
					recoverLastTourActiveStatus();
					resetStyle(true);//the status is login 
				}else{
					BootstrapDialog.alert('No login persistence because your browser does not support Web Storage...');
				}
				// console.log("------------------------------>On checkSignIn() (log OK) FL.loggedIn="+FL.loggedIn);
				return loggedIn;
			},
			xconnectServer: function(userName,password,connectServerCB){
				// alert("connectServer ServerByPass="+ServerByPass);
				if(!this.ServerByPass)
					connectServer(userName,password,connectServerCB);
			},
			xdisconnectServer: function(){
				// alert("disconnectServer ServerByPass="+ServerByPass);
				if(!this.ServerByPass)
					disconnectServer();
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
									// FL.login.connectServer("Nico","coLas",function(err){console.log("connectServer connection is="+err);});//3rd parameter is byPass
									FL.server.connect("Nico","coLas",function(err){console.log("connectServer connection is="+err);});//3rd parameter is byPass
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
				$.Topic( 'setTour' ).publish( false);//broadcast that will be received by FLTour2 to close tour
				BootstrapDialog.confirm("Your current edit menu will be lost and you will be logged out. Do you really want this ?", function(result) {
					if(result){//logedIn
						localStorage.clear();
						$.Topic( 'signInDone' ).publish( false );//broadcast that will be received by FL.menu to update .editable to false
						$.Topic( 'jsonMenuUpdate' ).publish( FL.clone(FL.oMenu) );//broadcast that will be received by FL.menu to update jsonMenu
						BootstrapDialog.alert('The full reset was done. <strong>Please refresh your browser</strong>.');
						FL.login.checkSignIn(true);
					}
				},{title:"Reset Login and edited menu",button1:"Cancel",button2:"Confirm Reset",type:'type-danger',cssButton2:"btn-danger"});
			},
			selectStyle: function() {
				alert("selectStyle !");
			}
			// editStyles: function(id){//called from link - big-slide.js
			// 	// alert("toggle clicked !!!");
			// 	// var stylesForSelection = [
			// 	// 	{value: 0, text: 'cerulean'},
			// 	// 	{value: 1, text: 'cosmos'},
			// 	// 	{value: 2, text: 'readable'},
			// 	// 	{value: 3, text: 'red'},
			// 	// 	{value: 4, text: 'spacelab'}
			// 	// ];
			// 	var getStyleValue = function(styleText){
			// 		var value = null;
			// 		var optionObj = _.findWhere( stylesForSelection,{text:styleText} );
			// 		if(optionObj)
			// 			value = optionObj.value;
			// 		return value;
			// 	};
			// 	console.log("Side Panel elements are immediately placed in DOM");
			// 	$.fn.editable.defaults.mode = 'popup';
			// 	var editId="#"+id;
			// 	var style = FL.currentStyle;
			// 	var styleValue = getStyleValue(style);
			// 	// alert(editId+" -->"+$(editId).length+ " FL.currentStyle=" + FL.currentStyle + " value=" + FL.getStyleValue(FL.currentStyle));
			// 	$(editId).editable({
			// 		type: 'select',
			// 		title: 'Select Style:',
			// 		placement: 'bottom',
			// 		value: styleValue, //was 0,
			// 		source:stylesForSelection,
			// 		validate: function(value) {
			// 			var fileCss = "FL"+ stylesForSelection[value].text + ".css";
			// 			loadCSS(fileCss);
			// 			FL.currentStyle = stylesForSelection[value].text;
			// 			localStorage.style = stylesForSelection[value].text;
			// 			$.Topic( 'styleChange' ).publish( FL.currentStyle );//broadcast that will be received by FL.tour
			// 			FL.mix("ChangeStyle",{"newStyle":FL.currentStyle});
			// 		}
			// 	});
			// }
		};
	})();
	FL["showTourStep0"] = false;
	//FL.currentStyle is still used to communicate with Tour2
});