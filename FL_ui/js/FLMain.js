var FL = FL || {};

// (function() {//hijack any JavaScript funct <----------- OK !!!
// 	//http://stackoverflow.com/questions/9216441/intercept-calls-to-console-log-in-chrome
// 	//Use:
// 	//   to inhibit all FL.common.printToConsole do FL.API.debug = false
// 	//   to show all FL.common.printToConsole with line numbers link do FL.API.debug = true (this assumes FL.API.debugStyle= 0)
// 	//	 to show FL.common.printToConsole without line numbers link do: FL.API.debug = true; FL.API.debugStyle= 1;
// 	//example FL.API.debug = true; FL.API.debugStyle= 0;
//   var Oldlog = FL.common.printToConsole;
//   // FL.common.printToConsole = function(){};//activate this instead of next - to "remove" all FL.common.printToConsoles
  
//   FL.common.printToConsole = function() {
//     // var nRepeat = 1; //90 - arguments[0].length;
//     // var args = [].slice.apply(arguments).concat([FL.common.repeat("-",nRepeat),(new Error()).stack.split(/\n/)[2].trim()]);
//     if(FL.API.debug){
//         FL.API.fl.setTraceClient(2);
// 		if (FL.API.debugStyle == 1){
// 			Oldlog.apply(this, arguments);
// 		}else{
// 			var nRepeat = 90 - arguments[0].length;
// 			var isIE = /*@cc_on!@*/false || !!document.documentMode;   // At least IE6 - http://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser
// 			var args = arguments;
// 			if(!isIE)
// 				args = [].slice.apply(arguments).concat([FL.common.repeat("-",nRepeat),(new Error()).stack.split(/\n/)[2].trim()]);
// 			Oldlog.apply(this, args);
// 		}
//         // Oldlog.apply(this, args);
//     }else{
//         FL.API.fl.setTraceClient(0);
//     }
//   };
// })();

(function() { //App is a name space.
	var spinner=FL.common.loaderAnimationON('spinnerDiv');
	setInterval(function(){spinner.stop();},1000);
	$(document).ready(function() {
		FL.API.debug = false;
		FL.API.debugFiltersToShow = ["API","checkServerCall"];
		FL.API.fl.setTraceClient(2);

		FL.common.printToConsole("joakimZZZZ","abc");
		FL.common.printToConsole("manel","cde");
		FL.common.printToConsole("joakim2","abc");
		FL.common.printToConsole("jojo1","jojo");
		
		var fl = new flMain();//only place where this must exist !!!!
		FL.fl = fl; //new flMain();
		fl.serverName(FL.common.getServerName());


		FL.oMenu = FL.login.defaultMenu; //why is this necessary ? it is !
		FL.common.clearSpaceBelowMenus();

		FL.common.printToConsole("FLMain.js begin inside document.ready");
		var fullUrl = window.location.href;
		if(fullUrl){//gets domain from url string ->http://localhost/pdojo/MotherGithub/test_menu13.html?d=myDomain1#
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
			triggerTopPos: '45px',
			panelTopPos: '45px',
			ajax: true,
			ajaxSource: 'FL_ui/sidepanel/fl_settings.html'
		});
		// $('#panel2').slidePanel({
		// 	triggerName: '#trigger2',
		// 	position: 'fixed',
		// 	triggerTopPos: '210px',
		// 	panelTopPos: '210px',
		// 	ajax: true,
		// 	// ajaxSource: 'FL_ui/sidepanel/fl_services.html'
		// 	ajaxSource: 'FL_ui/sidepanel/fl_builder.html'
		// });
		// $('#panel3').slidePanel({
		// 	triggerName: '#trigger3',
		// 	position: 'fixed',
		// 	triggerTopPos: '310px',
		// 	panelTopPos: '310px',
		// 	ajax: true,
		// 	ajaxSource: 'FL_ui/sidepanel/fl_services.html'
		// });
		// $('#trigger2').on('mousedown','#fl_builder',function(){alert("Inside Panel2 at pos-load !!!!")});
		// $('#trigger2').on('mousedown',function(){alert("Inside Panel2 at pos-load !!!!")});
		$('#trigger1').hide();
		$('#trigger2').hide();
		$('#trigger3').hide();
	// var myMenu = FL.menu.createMenu({jsonMenu:FL.clone(oMenu),initialMenu:"_home",editable:true});
		// var myMenu = FL.menu.createMenu({jsonMenu:FL.clone(oMenu),initialMenu:"_mission",editable:true});
		// var myMenu = FL.menu.createMenu({jsonMenu:FL.clone(oMenu)});
		// FL.setTourOn(true);
		FL.mixPanelEnable = false;
		FL.server.offline = false;
		localStorage.connection = '';

		//checkSignIn2 ->recover last saved loginObject and:
		//	if user/password exists ->logs in ->updates upper right corner
		//	if not keeps user in logout mode. ->updates upper right corner


		var myMenu = FL.menu.createMenu({jsonMenu:FL.clone(FL.oMenu)});

		var loginPromise = FL.login.checkSignIn2();
		loginPromise.done(function(){
			// FL.common.printToConsole("FLMain --> success in checkSignIn2 ");
			FL.common.printToConsole("FLMain.js --> success in checkSignIn2 ");
			return;
		});
		loginPromise.fail(function(err){
			alert("FLMain --> error in checkSignIn2 err="+JSON.stringify(err));
			return;
		});

		// //testing queueManager
		// var promise = FL.API.queueManager("_dummy","abc",[230,231,232,233]);
		// promise.done(function(result){
		// 	alert("queueManager - PROMISE DONE!!!");
		// });
		// promise.fail(function(err){
		// 	alert("queueManager - PROMISE FAIL!!! err="+err);
		// });

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
			FL.common.printToConsole("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
			def.resolve();
		}
		return def.promise();
	};
	var p0 =function(){
		var deferred = $.Deferred();
		FL.common.printToConsole("process 0 begins...");
		if(false)
			deferred.reject();
		setTimeout(function() {//after 10 sec executes the anonymous function
			FL.common.printToConsole("process 0 COMPLETE");
			deferred.resolve();
		}, 5000);
		return deferred.promise();
	};
	var p1 = function(){
		var def = $.Deferred();
		FL.common.printToConsole("beginning p1...");
		def.fail(function(){
			alert("error!");
		});
		def.done(function(){
			FL.common.printToConsole(" p1 was well done!");
		});
		FL.common.printToConsole("process 1 begins...");
		if(false)
			def.reject();
		setTimeout(function() {//after 10 sec executes the anonymous function
			FL.common.printToConsole("process 1 COMPLETE");
			def.resolve();
		}, 2000);
		return def.promise();
	};
	var p2 = function process2(){
		var deferred = $.Deferred();
		FL.common.printToConsole("process 2 begins...");

		FL.common.printToConsole("process 2 COMPLETE");
		return deferred.promise();
	};
	//only enters p1 after p0 is resolved
	// p0().then(p1).then(p2);//OK !!!! DRY Dont Repeat Yourself and single Responsability Principle
	// p0();
	// p1();
	// p2();
	FL.common.printToConsole(document.title+"......  END..");
})();
