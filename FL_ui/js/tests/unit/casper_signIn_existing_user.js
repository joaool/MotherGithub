casper.on('remote.message', function(message) {
    this.echo('remote message caught: ' + message);
});
casper.test.begin("FrameLink UI tests", 8, function suite(test) {
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
		console.log('STEP3------------->sign In clicked, fill form dialog');
		casper.wait(1000, function() {
			test.assert(this.exists('#__FLDialog_button2'),"#__FLDialog_button2 ->Sign-in in dialog exists!");
			var dialogHTML = this.getElementInfo('#_modalDialogB').html;
			// require('utils').dump(dialogHTML);
			test.assert(dialogHTML != "","Login Dialog active !!!");
			this.fill('form#form_loginTemplate', {
				'email':        'toto@toto.com',
				'password':     '123',
			}, false);		
			console.log('-------------------------->Form was filled with toto@toto.com/123');
			// var welcomeApp = this.getElementInfo('#_signInDomain').html;
			// var pos = welcomeApp.lastIndexOf(":");
			// // console.log(welcomeApp.substr(pos+1));//extracts null from 'Welcome to FrameLink: support@framelink.co App:null'
			// test.assert(welcomeApp.substr(pos+1) == "null" ,"application title is App:null !");
		});
	});	
	casper.then(function() {
		console.log('STEP4------------->Before clicking Sign In inside dialog box');
		this.click('#__FLDialog_button2');
		casper.wait(5000, function() {
			// this.echo("I've waited for a 5 seconds.");
			console.log('STEP5------------->dialog closed (after 5 secs) - checks toto@toto.com.');
			// require('utils').dump(this.getElementInfo('#_signIn'));
			var userHTML = this.getElementInfo('#_signIn').html;
			test.assert(userHTML == " toto@toto.com","User toto@toto.com is signed in !");
		});		
	});
	casper.run(function() {
		test.done();
	});
});