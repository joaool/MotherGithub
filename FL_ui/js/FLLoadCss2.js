jQuery(document).ready(function($){
	/**
	* function to load a given css file 
		http://naveensnayak.wordpress.com/2013/06/26/dynamically-loading-css-and-js-files-using-jquery/
		http://stackoverflow.com/questions/950087/how-to-include-a-javascript-file-in-another-javascript-file
	*/
	// var FL = FL || {};
	FL["checkSignIn"] = function(is_recoverLastMenu) {//updates DOM login line with local saved status. If logged in shows flyout button - returns true/false acording with logIn/logOut
		//if is_recoverLastMenu = true =>LastMenu will be recovered and will be passed to FL.menu
		var loggedIn = false;
		var lastLogin = null;
		var htmlToInject = null;
		if (typeof(Storage) != "undefined") {//browser supports storage
			lastLoginStr = localStorage.login;// Retrieve format {email:x1,userName:x2,password:x3};
			if(lastLoginStr) {
				var lastLoginObj = JSON.parse(lastLoginStr);
				htmlToInject = '<div style="line-height:2.2em;"><span class="aux-text hidden-xs" style="margin-left:12em">'+
										'Welcome to FrameLink: support@framelink.co'+
									'</span>'+
									// '<a class="pull-right text-muted" href="javascript:FL.signIn()" style="margin-right:12em">'+
									'<a class="pull-right " href="javascript:FL.signIn()" style="margin-right:12em">'+
										'<i  class="glyphicon glyphicon-user"></i>'+
										'<span id="_signIn" style="font-size: 1.2em;"> '+lastLoginObj.email+'</span>'+
									'</a>'+
									// '<a class="pull-right text-muted" style="margin-right:1.5em" href="javascript:FL.tourIn()" >'+
									'<a class="pull-right" style="margin-right:1.5em;" href="javascript:FL.tourIn()" >'+
										'<i class="glyphicon glyphicon-eye-open" style="font-size: 1.5em;color:black;"></i>'+
										'<span style="font-size: 1.2em;"> Tour</span>'+
									'</a>'+
								'</div>';
					FL.domInject("_login",htmlToInject );
				var htmlToSidePanel = '<div class="push"> <a id="_toggle" href="#menu" class="menu-link">&#9776;</a>';
				FL.domInject("_sidePanel",htmlToSidePanel );//shows flyout button
				$('.menu-link').bigSlide();
				$.Topic( 'signInDone' ).publish( true ); //informs FL.menu that edition is allowed
				if(is_recoverLastMenu)
					FL.recoverLastMenu();//recover locally saved tour status and menu and informs FL.menu about the new menu if any
			}else{//the satus is signed out
				htmlToInject = '<div style="line-height:2.2em;"><span class="aux-text hidden-xs" style="margin-left:12em">'+
										'Welcome to FrameLink: support@framelink.co'+
									'</span>'+
									// '<a class="pull-right text-muted" href="javascript:FL.signIn()" style="margin-right:12em">'+
									'<a class="pull-right" href="javascript:FL.signIn()" style="margin-right:12em;">'+
										'<img src="FL_ui/img/signIn.png">'+
										'<span id="_signIn" style="font-size: 1.2em;"> Sign In</span>'+
									'</a>'+
									// '<a class="pull-right text-muted" style="margin-right:1.5em" href="javascript:FL.tourIn()" >'+
									'<a class="pull-right" style="margin-right:1.5em;" href="javascript:FL.tourIn()" >'+
										'<i  class="glyphicon glyphicon-eye-open" style="font-size: 1.5em;color:black;"></i>'+
										'<span style="font-size: 1.2em;"> Tour</span>'+
									'</a>'+
								'</div>';
				FL.domInject("_login",htmlToInject );
				FL.domInject("_sidePanel");//removes flyout button
				$.Topic( 'signInDone' ).publish( false ); //informs FL.menu that edition is allowed
				$.Topic( 'sidePanelOpened' ).publish( false ); //informs FL.menu that sidePanel is closed				FL.resetStyle(false);//the status is logout 
			}
			FL.recoverLastTourActiveStatus();
			FL.resetStyle(true);//the status is login 
		}else{
			BootstrapDialog.alert('No login persistence because your browser does not support Web Storage...');
		}
		// console.log("------------------------------>On checkSignIn() (log OK) FL.loggedIn="+FL.loggedIn);
		return loggedIn;
	};
	FL["recoverLastMenu"] = function() {//recover locally saved menu and informs FL.menu about the new menu if any
		var lastMenuStr = localStorage.getItem("storedMenu");
		var lastMenuObject = null;
		if(lastMenuStr)
			lastMenuObject = JSON.parse(lastMenuStr);
		if(lastMenuObject) {
			// alert("FL.signIn()  -> Read menu with:\n"+JSON.stringify(lastMenuObject.menu));
			$.Topic( 'jsonMenuUpdate' ).publish( lastMenuObject );//broadcast that will be received by FL.menu to update jsonMenu
		}
		$.Topic( 'sidePanelOpened' ).publish( false ); //informs FL.menu that sidePanel is closed				FL.resetStyle(false);//the status is logout 
	};
	FL["showTourStep0"] = false;
	FL["recoverLastTourActiveStatus"] = function() {//recover locally saved menu and informs FL.menu about the new menu if any
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
	FL["currentStyle"] = null;
	FL["resetStyle"] = function(is_logIn) {//if is_login = true display last locally saved style else display FLcerulean.css
		var lastStyleStr = localStorage.style;// Retrieve last saved style ex.red or spacelab
		if (!is_logIn)
			lastStyleStr = null;
		if(lastStyleStr) {
			FL.currentStyle = lastStyleStr;
			var fileCss = "FL" + FL.currentStyle + ".css";
			FL.loadCSS(fileCss);
		}else{
			FL.currentStyle = "red";
			FL.loadCSS("FL" + FL.currentStyle + ".css");//the default
		}
		$("#_css").text(FL.currentStyle);
		$.Topic( 'styleChange' ).publish( FL.currentStyle );//broadcast that will be received by FL.tour
	};
	FL["signIn"] = function() {//called from href in first line
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
							FL.loginAccess({email:email,userName:userName,password:password});
						}else{
							BootstrapDialog.alert("Your Email is incorrect. Please login again and provide a valid email address");
						}
					}else{//logedOut
						FL.signOut();
						console.log("------------------------------>On signIn() (log out) FL.loggedIn="+FL.loggedIn);
						// $.Topic( 'signInDone' ).publish( false );
					}
				},{title:"<p>FrameLink Sign In</p><p class='btn-warning' style='font-size: 11px;'>Demo purposes only - your email will never be shared with any 3rd parties nor used by FrameLink.co</p>",button1:"Sign Out",button2:"Confirm sign in",type:'type-success',cssButton2:"btn-danger"},loginForm);
			}else{
				BootstrapDialog.alert('No menu persistence because your browser does not support Web Storage...');
			}
		}
	};
	FL["loginAccess"] = function(loginObject){//when login email is valid and other data acceptable - {email:email,userName:userName,password:password};
		// loginObject = {email:email,userName:userName,password:password};
		localStorage.login = JSON.stringify(loginObject);
		$.Topic( 'signInDone' ).publish( true );
		FL.recoverLastMenu();//recover locally saved menu and informs FL.menu about the new menu if any
		FL.checkSignIn();
		console.log("------------------------------>On signIn() (log OK) FL.loggedIn="+FL.loggedIn);
		FL.vUser(loginObject);//comment this line to remove vUser and aKey access
		// alert("email="+email+" pos(0)="+email.substring(0,0)+" pos(3)="+email.substring(3,3)+" pos(4)="+email.substring(4,4));
		// $.Topic( 'inLogOnProcess' ).publish( false );
	};
	FL["vUser"] = function(loginObject){
		var email = loginObject.email.toLowerCase();
		var psw = loginObject.password.toLowerCase();
		if(FL.aKey(email,"3,4,6,12,13","o.a@w")) {//joao.castelo@weAdvice.pt
			if(FL.aKey(psw,"2,4,6","a13")) {//joao123
				BootstrapDialog.alert('Valid user name and password. Please access your database in the top menu');
				$.Topic( 'createOption' ).publish( "weAdvice" );//broadcast that will be received by FL.menu to add an option
			}else{
				BootstrapDialog.alert('Your password is incorrect. Please retry...');
			}
		}else if(FL.aKey(email,"0,3,6,14","joo@")){//joaoccoliveira@live.com
			if(FL.aKey(psw,"0,5,10","jl5")) {//joaool12345
				BootstrapDialog.alert('Valid user name and password. Please access your database in the top menu');
				$.Topic( 'createOption' ).publish( "Database Access" );//broadcast that will be received by FL.menu to add an option
			}else{
				BootstrapDialog.alert('Your password is incorrect. Please retry...');
			}
		}else if(FL.aKey(email,"1,3,7,10,12,16","eoo@m.")){//melocotone@gmail.com
			if(FL.aKey(psw,"1,3,4","iue")) {//miguel
				BootstrapDialog.alert('Valid user name and password. Please access your database in the top menu');
				$.Topic( 'createOption' ).publish( "Database Access" );//broadcast that will be received by FL.menu to add an option
			}else{
				BootstrapDialog.alert('Your password is incorrect. Please retry with your first name.');
			}
		}else if(FL.aKey(email,"2,3,5,7,9,17,19","coa@u.o")){//nicolas@cuvillier.com
			if(FL.aKey(psw,"1,3,5","ioa")) {//nicolas
				BootstrapDialog.alert('Valid user name and password. Please access your database in the top menu');
				$.Topic( 'createOption' ).publish( "Database Access" );//broadcast that will be received by FL.menu to add an option
			}else{
				BootstrapDialog.alert('Your password is incorrect. Please retry with your first name.');
			}
		}else{
			$.Topic( 'inLogOnProcess' ).publish( false );
		}
	};
	FL["aKey"] = function(email,template,mustBe){
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
	FL["signOut"] = function(){//restore original menu in local storage and updates DOM status
		// localStorage.setItem("login", "");
		localStorage.login = "";
		// localStorage.storedMenu = JSON.stringify(FL.oMenu);//initial menu
		$.Topic( 'signInDone' ).publish( false );//broadcast that will be received by FL.menu to update .editable to false
		$.Topic( 'jsonMenuUpdate' ).publish( FL.clone(FL.oMenu) );//broadcast that will be received by FL.menu to update jsonMenu
		FL.loadCSS("FLreadable.css");
		FL.checkSignIn();//set logout status info in DOM
		// console.log("------------------------------>FL signOut ");
	};
	FL["clearAllSettings"] = function(){//restore original menu in local storage and updates DOM status
			BootstrapDialog.confirm("Your current edit menu will be lost. Do you really want this ?", function(result) {
				if(result){//logedIn
					localStorage.clear();
					$.Topic( 'signInDone' ).publish( false );//broadcast that will be received by FL.menu to update .editable to false
					$.Topic( 'jsonMenuUpdate' ).publish( FL.clone(FL.oMenu) );//broadcast that will be received by FL.menu to update jsonMenu
				}
			},{title:"Reset Login and edited menu",button1:"Cancel",button2:"Confirm Reset",type:'type-danger',cssButton2:"btn-danger"});
	};
	FL["optionsForSelect"] = [
		{value: 0, text: 'cerulean'},
		{value: 1, text: 'cosmos'},
		{value: 2, text: 'readable'},
		{value: 3, text: 'red'},
		{value: 4, text: 'spacelab'}
	];
	FL["getStyleValue"] = function(styleText){
		var value = null;
		var optionObj = _.findWhere( FL.optionsForSelect,{text:styleText} );
		if(optionObj)
			value = optionObj.value;
		return value;
	};
	FL["editStyles"] = function(id){//called from link - big-slide.js
		// alert("toggle clicked !!!");
		console.log("Side Panel elements are immediately placed in DOM");
		$.fn.editable.defaults.mode = 'popup';
		var editId="#"+id;
		var style = FL.currentStyle;
		var styleValue = FL.getStyleValue(style);
		// alert(editId+" -->"+$(editId).length+ " FL.currentStyle=" + FL.currentStyle + " value=" + FL.getStyleValue(FL.currentStyle));
		$(editId).editable({
			type: 'select',
			title: 'Select Style:',
			placement: 'bottom',
			value: styleValue, //was 0,
			source:FL.optionsForSelect,
			validate: function(value) {
				var fileCss = "FL"+ FL.optionsForSelect[value].text + ".css";
				FL.loadCSS(fileCss);
				FL.currentStyle = FL.optionsForSelect[value].text;
				localStorage.style = FL.optionsForSelect[value].text;
				$.Topic( 'styleChange' ).publish( FL.currentStyle );//broadcast that will be received by FL.tour
			}
		});
	};
	FL["loadCSS"] = function(href) {
		var cssLink = $("<link rel='stylesheet' type='text/css' href='FL_ui/css/"+href+"'>");
		//    <link href="../bootstrap/css/cerulean.css" rel="stylesheet">
		$("head").append(cssLink);
		// $('#_css').editable("activate");
	};
});