// var casper = require('casper').create({
//     clientScripts:  [
//         'includes/jquery.js',      // These two scripts will be injected in remote
//         'includes/underscore.js'   // DOM on every request
//     ],
//     pageSettings: {
//         loadImages:  false,        // The WebPage instance used by Casper will
//         loadPlugins: false         // use these settings
//     },
//     logLevel: "info",              // Only "info" level messages will be logged
//     verbose: true                  // log messages will be printed out to the console
// });
casper.on('remote.message', function(message) {
    this.echo('remote message caught: ' + message);
});
casper.test.begin("FrameLink UI tests", 9, function suite(test) {
	casper.start().viewport(1300,650);
	// casper.start("http://localhost/pdojo/MotherGithub/test_menu13.html", function(){
	casper.thenOpen("http://localhost/pdojo/MotherGithub/test_menu13.html", function(){
		test.assertTitle("menu v13.0", "Frame Link menu title is 'menu v13.0' ");
		test.assertEvalEquals(function () {
			return jQuery.fn.jquery;
		}, '1.11.1', 'jQuery 1.11.1 was found.');
		console.log('STEP1------------->Before checking that Sign In (upper right corner) exists in initial page');
		test.assert(this.exists('#_signIn'),"signIn exists!");
		var dialogHTML = this.getElementInfo('#_modalDialogB').html;
		// require('utils').dump(dialogHTML);
		test.assert(dialogHTML === "","Login Dialog not active");
	});
	casper.then(function() {
		console.log('STEP2------------->Before clicking Sign In (upper right corner)');
		// this.clickLabel('Sign in', 'a');//// <a href="...">My link is beautiful</a> //ERROR !!!
		test.assert(!this.exists('#__FLDialog_button2'),"#__FLDialog_button2 ->Sign-in in dialog not yet in DOM!");
		this.click('#_signIn');
	});
	casper.then(function() {
		console.log('STEP3------------->sign In clicked, click cancel in Dialog');
		casper.wait(1000, function() {
			test.assert(this.exists('#__FLDialog_button1'),"#__FLDialog_button1 ->Cancel in dialog exists!");
			var dialogHTML = this.getElementInfo('#_modalDialogB').html;
			// require('utils').dump(dialogHTML);
			test.assert(dialogHTML !== "","Login Dialog active !!!");
			this.click('#__FLDialog_button1');
			var userTags =  this.getElementInfo('#_signIn');
			// require('utils').dump(userTags);
			test.assert(userTags.html == " Sign In","User is logged out !");
			var welcomeApp = this.getElementInfo('#_signInDomain').html;
			var pos = welcomeApp.lastIndexOf(":");
			// console.log(welcomeApp.substr(pos+1));//extracts null from 'Welcome to FrameLink: support@framelink.co App:null'
			test.assert(welcomeApp.substr(pos+1) == "null" ,"application title is App:null !");
		});
	});	
	// casper.then(function() {
	// 	console.log('STEP4------------->sign In was clicked, dialog must be visible');
	// 	this.click('#_signIn');
	// 	test.assert(this.exists('#__FLDialog_button2'),"#__FLDialog_button2 ->Sign-in in dialog exists!");
	// 	var dialogHTML = this.getElementInfo('#_modalDialogB').html;
	// 	// require('utils').dump(dialogHTML);
	// 	test.assert(dialogHTML != "","Login Dialog active !!!");
	// 	this.fill('form#form_loginTemplate', {
	// 		'email':        'toto@toto.com',
	// 		'password':     'client428',
	// 	}, false);		
	// 	console.log('-------------------------->Form was filled with toto@toto.com/client428');
	// 	test.assert(this.exists('#__FLDialog_button2'),"#__FLDialog_button2 ->Sign-in in dialog exists!");
	// });
	// // // casper.then(function() {
	// // // 	console.log('STEP4------------->Before clicking Sign In inside dialog box');
	// // // 	// this.click('#__FLDialog_button2');//clicks on sign in button
	// // // 	// casper.test.comment('"nonexistent selector" but exists');//OK - the same as console.log...
	// // // 	// this.click('a[id="__FLDialog_button2"]');
	// // // 	// this.click('#__FLDialog_button1');//a click on an anchor without href or href="#"
	// // // 	this.clickLabel('Sign in', 'a');//// <a href="...">My link is beautiful</a>
	// // // });
	// // // casper.thenClick('#__FLDialog_button2'); //OK if fill has no submit !!!
	// casper.then(function() {
	// 	console.log('STEP5------------->Before clicking Sign In inside dialog box');
	// 	this.click('#__FLDialog_button2');
	// 	casper.wait(5000, function() {
	// 		// this.echo("I've waited for a 5 seconds.");
	// 		console.log('STEP6------------->dialog closed (after 5 secs) - checks toto@toto.com.');
 //        	// require('utils').dump(this.getElementInfo('#_signIn'));
	// 		var userHTML = this.getElementInfo('#_signIn').html;
	// 		test.assert(userHTML == " toto@toto.com","User toto@toto.com is signed in !");
	// 	});		
	// });	
	casper.run(function() {
		test.done();
	});
});