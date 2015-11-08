var FL = FL || {};

(function() { //App is a name space.
	var spinner=FL.common.loaderAnimationON('spinnerDiv');
	setInterval(function(){spinner.stop();},1000);
	$(document).ready(function() {
		console.log("Dict 2.0 on MotherGithub");
		FL.common.debug = false;
		FL.common.debugFiltersToShow = ["xAPI","login","dump","xdd","test"];//note that "dump" is a reserved word for FL.dd.displayEntities()
		FL.API.fl.setTraceClient(2);

		// console.log("login:"+FL.login.test);
		FL.common.printToConsole("====>next will test exist !!!"+FL.login.test,"login");
		var fl = new flMain();//only place where this must exist !!!!
		FL.fl = fl; //new flMain();
		fl.serverName(FL.common.getServerName());
		//---------------------load Default application
		//loginObject = {email:"zozo25@zozo.com",password:"123"};
		loginObject = {email:"zozo27@zozo.com",password:"123"};
		FL.common.printToConsole("Before display","login");
		var loadDefaultAppPromise = FL.API.loadDefaultApp(loginObject)
			.then(function(menuData,homeHTML){
				// alert("style="+menuData.style+", fontFamily="+menuData.fontFamily+"\nHTML=>"+homeHTML+"\n--------\n"+JSON.stringify(menuData));
				testMockUp();
				return;
			},function(err){alert("ERROR ->"+err.code+" - "+err.message);return;});
		//---------------------
		console.log("END !!!");
	});
	FL.common.printToConsole(document.title+"......  END..");
})();
testMockUp = function(){
	// alert("Inside testMockUp");
    //----------------- to delete
	FL.dd.init_t();//to init
	FL.dd.t.entities.dumpToConsole();

	var eCN = "68";
	console.log("FLTestDictionary2 !!!! working with entity "+FL.dd.t.entities[eCN].singular);
	FL.dd.t.entities[eCN].set({name:"person3",plural:"persons with 3"});
	FL.dd.t.entities[eCN].addField("country2","Birth country","NacionalityX","text");
	FL.dd.t.entities[eCN].addField("ParentEmail","Father's email","Father","email");
	var ch_fCN = FL.dd.t.entities[eCN].getCName("name");
	var ch_fCN1 = FL.dd.t.entities[eCN].getCName("age");
	var ch_fCN2 = FL.dd.t.entities[eCN].getCName("height");
	var ch_fCN3 = FL.dd.t.entities[eCN].getCName("country2");
	FL.dd.t.entities[eCN].removeField("country");
	FL.common.printToConsole("11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111","test");
	FL.dd.t.entities.dumpToConsole();

	FL.dd.t.entities[eCN].fields[ch_fCN].set({label:"name"});
	//FL.dd.t.entities[eCN].fields[ch_fCN1].set({label:"ageA"});
	FL.dd.t.entities[eCN].fields[ch_fCN2].set({label:"height"});
	FL.common.printToConsole("########################################################################################","test");
	FL.dd.t.entities.dumpToConsole();

	var promiseSave = FL.dd.t.entities[eCN].save();//fieldsList()
	promiseSave.done(function (eCN) {
		FL.dd.t.entities.dumpToConsole();
	});
	promiseSave.fail(function (err) {
		alert(err);
	});
	FL.common.printToConsole("End of FLTestDictionary2","test");
};
