var FL = FL || {};

(function() { //App is a name space.
	var spinner=FL.common.loaderAnimationON('spinnerDiv');
	setInterval(function(){spinner.stop();},1000);
	$(document).ready(function() {
		console.log("Dict 1.0 on MotherGithub");
		FL.common.debug = false;
		FL.common.debugFiltersToShow = ["API","login","dump","dd"];//note that "dump" is a reserved word for FL.dd.displayEntities()
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
	var display="";

	_.each(FL.dd.t.entities.list(),function(element){display+=element.singular+"/"+element.csingular+"\n"});
	alert("List all entities:\n"+display+"\nCompressed name="+FL.dd.t.entities.getCName("person"));

	FL.common.printToConsole("singular -->"+FL.dd.t.entities["50"].singular+"-->","login");
	FL.common.printToConsole("description -->"+FL.dd.t.entities["50"].description+"-->","login");
MAIN.JS	//FL.dd.t.entities.add("dog","pet cared by a family");//only locally
	var eCN = FL.dd.t.entities.add("skill","profession of a person");//only locally
	var eCNCopy = FL.dd.t.entities.getCName("skill");
	// ---------  showing table properties -- only locally
	FL.common.printToConsole("showing table properties -- only locally", "login");
	FL.common.printToConsole("   singular:" + FL.dd.t.entities[eCN].singular, "login");
	FL.common.printToConsole("   plural:" + FL.dd.t.entities[eCN].plural, "login");
	FL.common.printToConsole("   description:" + FL.dd.t.entities[eCN].description, "login");
	FL.common.printToConsole("   csingular:" + FL.dd.t.entities[eCN].csingular,"login");
	FL.common.printToConsole("------------------------","login");
	// --------  updating table properties ---only locally
	FL.common.printToConsole("updating table properties -- only locally", "login");

	//FL.dd.t.entities[eCN].set({singular:"nice dog",plural:"several nice dogs"});/// CHANGED
	FL.dd.t.entities[eCN].set({singular:"professionalSkill",plural:"professional skills"});/// CHANGED

	FL.common.printToConsole("   singular:"+FL.dd.t.entities[eCN].singular,"login");
	FL.common.printToConsole("   plural:"+FL.dd.t.entities[eCN].plural,"login");
	FL.common.printToConsole("   description:"+FL.dd.t.entities[eCN].description,"login");
	FL.common.printToConsole("   csingular:" + FL.dd.t.entities[eCN].csingular,"login");

	// ------------------ fields locally
	FL.common.printToConsole("--------FIELDS (locally)----------------","login");
	var fieldsArr = FL.dd.t.entities[eCN].fieldList();

	//FL.dd.t.entities[eCN].addField("petName","name assigned to pet","your pet name","string","textbox");
	FL.dd.t.entities[eCN].addField("skillName","name of the professional skill","Skill title","text");

	var fCN = FL.dd.t.entities[eCN].getFieldCName("skillName");
	// ---------  showing field properties -- only locally
	FL.common.printToConsole("showing field properties -- only locally", "login");
	FL.common.printToConsole("    field name:"+FL.dd.t.entities[eCN].fields[fCN].name,"login");
	FL.common.printToConsole("    field name:"+FL.dd.t.entities[eCN].fields[fCN].label,"login");
	FL.common.printToConsole("    field typeUI:"+FL.dd.t.entities[eCN].fields[fCN].typeUI,"login");
	FL.common.printToConsole("    field typeUI:"+FL.dd.t.entities[eCN].fields[fCN].userType,"login");
    var z= FL.dd.t.entities[eCN].fields[fCN].userType;
	var xArr=FL.dd.t.entities[eCN].fieldList();
	var display="";
	_.each(FL.dd.t.entities[eCN].fieldList(),function(value,key){
		display+=value.name+"/"+value.fCN+"--->"+value.label+"-->"+value.userType+"-->"+value.statement+"\n"
	});
	alert("For entity "+FL.dd.t.entities[eCN].singular+" list all fields (name/fCN:::label:::userType:::statement):\n"+display);

	// ---------  updating field properties -- only locally
	FL.common.printToConsole("updating field properties -- only locally", "login");
	//FL.dd.t.entities[eCN].fields[fCN].set({name:"nameOfPet",label:"Name of your pet"});
	FL.dd.t.entities[eCN].fields[fCN].set({name:"titleOfSkill",label:"Professional title"});
	FL.common.printToConsole("    field name:"+FL.dd.t.entities[eCN].fields[fCN].name,"login");
	FL.common.printToConsole("    field name:"+FL.dd.t.entities[eCN].fields[fCN].label,"login");
	//FL.dd.t.entities[eCN].addField("petBirthDay","date of birth","Birth Day","string","datetimebox");
	enrollFCN = FL.dd.t.entities[eCN].addField("enrollment","year of registration","Registration","integer");

	var display="";
	_.each(FL.dd.t.entities[eCN].fieldList(),function(value,key){
		display+=value.name+"/"+value.fCN+"--->"+value.label+"-->"+value.typeUI+"-->"+value.statement+"\n"
	});
	alert("For entity "+FL.dd.t.entities[eCN].singular+" list all fields (name/fCN:::label:::typeUI:::statement):\n"+display);

	FL.dd.t.entities[eCN].fields[enrollFCN].set({description:"date of registration",userType:"datetime"});

	var xArr=FL.dd.t.entities[eCN].fieldList();

	FL.dd.t.entities.dumpToConsole();

	// Now we want to commit this values to the database
	//FL.dd.t.save()://will commit all value

	var promiseSave = FL.dd.t.entities[eCN].save();
	promiseSave.done(function (eCN) {
		var entityName = FL.dd.getEntityByCName(eCN);
		FL.dd.t.entities.dumpToConsole();
		alert("CHECKED TILL THIS POINT");
	});
	promiseSave.fail(function (err) {
		alert(err);
		alert("STOP");
	});

/*

	var entity ="sub";
	var eCN = FL.dd.t.entities.getCName(entity);
	FL.dd.t.entities[eCN].addField("joakim","dummy field joakim","Joakim'label","text","textbox");
	var display='';
	_.each(FL.dd.t.entities[eCN].fieldsList(),function(element){display+=element.fCN+":::"+element.name+":::"+element.label+":::"+element.typeUI+"\n"});
	alert("For entity "+entity+" list all fields (fCN:::name:::label:::typeUI):\n"+display);

	var field = "ESPECIALIDADE";
	var fCN = FL.dd.t.entities[eCN].getFieldCName(field);
	if(fCN){
	  FL.common.printToConsole("field compressed name:"+fCN,"login");
	  FL.common.printToConsole("field name:"+FL.dd.t.entities[eCN].fields[fCN].name,"login");
	  FL.common.printToConsole("field typeUI:"+FL.dd.t.entities[eCN].fields[fCN].typeUI,"login");
	  //(name,description,label,type,typeUI,enumerable)
	  FL.dd.t.entities[eCN].fields[fCN].setField({name:"ESPECIALIDADEx",label:"label of especialidade"});
	}else{
	  FL.common.printToConsole("field "+field+" does not exist!","login");
	  field = "ESPECIALIDADEx";
	  fCN = FL.dd.t.entities[eCN].getFieldCName(field);
	}
	var display=null;
	_.each(FL.dd.t.entities[eCN].fields[fCN],function(value,key){display+=key+"---"+value+"\n"});
	alert("For entity "+entity+" and field "+field+" list all field properties:\n"+display);



	// FL.common.printToConsole("-->"+FL.dd.t.entities["53"].singular+"-->","login");

	// FL.dd.entity["53"].singular = "joakim";
	// alert("Singular of '53':"+FL.dd.entity["53"].singular));
	display = null;
	_.each(FL.dd.t.entities.list(),function(element){display+=element.singular+"/"+element.csingular+"\n"});
	alert("List all entities(2):\n"+display+"\nCompressed name of sub="+FL.dd.t.entities.getCName("joakim"));
*/
	FL.common.printToConsole("After display","login");
	if (window.entitiesLoaded)
        window.entitiesLoaded();
};
