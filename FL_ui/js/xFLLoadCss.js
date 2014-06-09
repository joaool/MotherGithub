jQuery(document).ready(function($){
	/**
	* function to load a given css file 
		http://naveensnayak.wordpress.com/2013/06/26/dynamically-loading-css-and-js-files-using-jquery/
		http://stackoverflow.com/questions/950087/how-to-include-a-javascript-file-in-another-javascript-file
	*/
	// BootstrapDialog.alert("FrameLink"); //http://nakupanda.github.io/bootstrap3-dialog/
	// BootstrapDialog.confirm("FrameLink menus ?"); //http://nakupanda.github.io/bootstrap3-dialog/
	//  BootstrapDialog.confirm = function(message, callback,options) {//http://nakupanda.github.io/bootstrap3-dialog/
	// var FL = FL || {};
    BootstrapDialog.confirm = function(message,callback,options,form) {//http://nakupanda.github.io/bootstrap3-dialog/
		new BootstrapDialog({
			//element = _.extend(element,updatedElement);//passed by reference
			title: _.extend({title:"CONFIRMATION"},options).title,
			message: message,
			// form: '<label>Email </label><input type="text" id="titleDrop"><br><label>User Name</label><input type="text" id="descriptionDrop">',//form,
			// type: BootstrapDialog.TYPE_PRIMARY, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
			type: _.extend({type:'type-primary' },options).type, //'type-primary', 'type-info' .'type-success','type-warning','type-danger' 
			draggable:true,
			data: {
				'callback': callback
			},
			buttons: [{
					label: _.extend({button1:"Cancel"},options).button1,
					action: function(dialog) {
						typeof dialog.getData('callback') === 'function' && dialog.getData('callback')(false);
						dialog.close();
					}
				}, {
					label:  _.extend({button2:"Ok"},options).button2,
					cssClass: _.extend({cssButton2:"btn-primary"},options).cssButton2,
					action: function(dialog) {
						typeof dialog.getData('callback') === 'function' && dialog.getData('callback')(true);
						dialog.close();
					}
				}
			]
		}).open();
    };
	FL["clone"] = function(obj) {//http://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-clone-an-object/5344074#5344074
		var ss = JSON.stringify(obj);
		return JSON.parse(ss);
		// return JSON.parse(JSON.stringify(obj));
	};
	FL["domInject"] = function(id,htmlContent) {//clean and replace content by htmlContent
		var target="#" + id;
		var $id = $(target);
		$id.empty();//removes the child elements of the selected element(s).
		if(htmlContent)
			$id.append( $( htmlContent ) );//with $(htmlContent) we convert htmlStr to a JQuery object
	};
	FL["checkSignIn"] = function() {//updates DOM login line with local saved status. If logged in shows flyout button - returns true/false acoording with logIn/logOut
		var loggedIn = false;
		var lastLogin = null;
		var htmlToInject = null;
		if (typeof(Storage) != "undefined") {//browser supports storage
			lastLoginStr = localStorage.login;// Retrieve only
			if(lastLoginStr) {
				var lastLoginObj = JSON.parse(lastLoginStr);
				htmlToInject = '<span class="aux-text hidden-xs">'+
										'Welcome to FrameLink: support@framelink.co or +351 911 574 655'+
									'</span>'+
									'<a class="pull-right text-muted" href="javascript:FL.signIn()">'+
										'<i class="glyphicon glyphicon-user"></i>'+
										'<span> '+lastLoginObj.userName+'</span>'+
									'</a>';
				FL.domInject("_login",htmlToInject );
				var htmlToSidePanel = '<div class="push"> <a href="#menu" class="menu-link">&#9776;</a>';
				FL.domInject("_sidePanel",htmlToSidePanel );//shows flyout button
				$('.menu-link').bigSlide();
				FL.loggedIn = true;
				loggedIn=true;
			}else{
				htmlToInject = '<span class="aux-text hidden-xs">'+
										'Welcome to FrameLink: support@framelink.co or +351 911 574 655'+
									'</span>'+
									'<a class="pull-right text-muted" href="javascript:FL.signIn()">'+
										'<i class="glyphicon glyphicon-log-in"></i>'+
										'<span> Login</span>'+
									'</a>';
				FL.domInject("_login",htmlToInject );
				FL.domInject("_sidePanel");//removes flyout button
				FL.loggedIn = false;
			}
		}else{
			BootstrapDialog.alert('No login persistence because your browser does not support Web Storage...');
		}
		// console.log("------------------------------>On checkSignIn() (log OK) FL.loggedIn="+FL.loggedIn);
		return loggedIn;
	};

	FL["signIn"] = function() {//called from href in first line
		// alert("Signing In !!!!");
		if (typeof(Storage) != "undefined") {//browser supports storage
			var loginObject =  {email:"",userName:"",password:""};
			var lastLoginStr = localStorage.getItem("login");// Retrieve
			if(lastLoginStr)
				loginObject=JSON.parse(lastLoginStr);
			var loginForm = '<form>'+
								'<table>'+
									'<tr>'+
										'<td align="right">Email:</td>'+
										'<td align="left"><input type="text" id="login_email" value="' + loginObject.email +'"/><td>'+
									'</td>'+
									'<tr>'+
										'<td align="right">User Name:</td>'+
										'<td align="left"><input type="text" id="login_userName" value="' + loginObject.userName +'"/><td>'+
									'</td>'+
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
					// saves locally login status
					loginObject = {email:email,userName:userName,password:password};
					localStorage.login = JSON.stringify(loginObject);
					FL.checkSignIn();
					FL.loggedIn = true;
					console.log("------------------------------>On signIn() (log OK) FL.loggedIn="+FL.loggedIn);
					// recover locally saved menu
					var lastSavedMenuStr = localStorage.storedMenu;
					if(lastSavedMenuStr){
						var lastSavedMenuObj = JSON.parse(lastSavedMenuStr);
						// lastSavedMenuObj.menu[0].title = "Faruk";
						// console.log("------------------------------>signIn recovered "+lastSavedMenuObj.menu[0].title);
						// FL.menu({jsonMenu:lastSavedMenuObj}).refresh();//displays last savedMenu - this must have the original menu that was saved in logout !
						FL.menu({jsonMenu:lastSavedMenuObj,editable:true});
					}
					// alert("signIn -> Confirm Login : storedMenu was saved with:\n"+localStorage.storedMenu);
					// alert("after loggedIn !!!!")
				}else{//logedOut
					FL.signOut();
					console.log("------------------------------>On signIn() (log out) FL.loggedIn="+FL.loggedIn);
				}
			},{title:"FrameLink Login",button1:"Log out",button2:"Confirm Login",type:'type-success',cssButton2:"btn-danger"},loginForm);
		}else{
			BootstrapDialog.alert('No menu persistence because your browser does not support Web Storage...');
		}
	};
	// signOut = function(){
	FL["signOut"] = function(){//restore original menu in local storage and updates DOM status
		// localStorage.setItem("login", "");
		localStorage.login = "";
		localStorage.storedMenu = JSON.stringify(FL.oMenu);//initial menu
		// FL.menu().refresh(FL.oMenu);//displays original menu
		// FL.menu({jsonMenu:FL.oMenu}).refresh();//displays last savedMenu - this must have the original menu that was saved in logout !
		var clone1 = FL.clone(FL.oMenu);
		clone1.menu[0].title = "inacio";
		FL.menu({jsonMenu:FL.clone(FL.oMenu)});
		FL.checkSignIn();//set logout status info in DOM
		FL.loggedIn = false;
		console.log("------------------------------>FL signOut ");
		// alert("signOut: storedMenu was saved with:\n "+localStorage.storedMenu);
		z=32;
	};
	loadCSS = function(href) {
		// var cssLink = $("<link rel='stylesheet' type='text/css' href='FL_ui/js/"+href+"'>");
		//Example	<script src="FL_ui/js/main.js"></script>
		var cssLink = $("<link rel='stylesheet' type='text/css' href='../bootstrap/css/"+href+"'>");
		//    <link href="../bootstrap/css/cerulean.css" rel="stylesheet">
		$("head").append(cssLink);
	};
	console.log("JO this is inside main.js");
	var optionsForSelect =[
		{value: 0, text: 'cerulean'},
		{value: 1, text: 'cosmos'},
		{value: 2, text: 'readable'},
		{value: 3, text: 'spacelab'},
		{value: 4, text: 'redish'},
		{value: 5, text: 'red'}
	];
	$('#_css').editable({
        type: 'select',
        title: 'Select Style:',
        placement: 'right',
        value: 4,
        source:optionsForSelect,
		validate: function(value) {
			var fileCss = optionsForSelect[value].text + ".css";
			loadCSS(fileCss);
			// alert("FileCss="+fileCss);
        }
    });
});