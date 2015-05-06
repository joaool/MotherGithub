var FL = FL || {};


(function() { //App is a name space.
	var spinner=FL.common.loaderAnimationON('spinnerDiv');
	setInterval(function(){spinner.stop();},1000);
	$(document).ready(function() {
		console.log("Dict 1.0 on MotherGithub");
		FL.API.debug = false;
		FL.API.debugFiltersToShow = ["xAPI","xlogin","xdump","dd"];//note that "dump" is a reserved word for FL.dd.displayEntities()
		FL.API.fl.setTraceClient(2);

		// console.log("login:"+FL.login.test);
		FL.common.printToConsole("====>next will test exist !!!"+FL.login.test,"login");

		var fl = new flMain();//only place where this must exist !!!!
		FL.fl = fl; //new flMain();
		fl.serverName(FL.common.getServerName());
		//---------------------load Default application
		loginObject = {email:"zozo25@zozo.com",password:"123"};
		FL.common.printToConsole("Before display","login");
		var loadDefaultAppPromise = FL.API.loadDefaultApp(loginObject)
			.then(function(menuData,homeHTML){
				alert("style="+menuData.style+", fontFamily="+menuData.fontFamily+"\nHTML=>"+homeHTML+"\n--------\n"+JSON.stringify(menuData));
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
	FL.dd.init_t();//to set mockup on
	var display=null;
	_.each(FL.dd.t.entities.list(),function(element){display+=element.singular+"/"+element.csingular+"\n"});
	alert("List all entities:\n"+display+"\nCompressed name of sub="+FL.dd.t.entities.getCName("sub"));
	// var foo= new FL.dd.t.entities("a","b");

	FL.common.printToConsole("singular -->"+FL.dd.t.entities["53"].singular+"-->","login");
	FL.common.printToConsole("description -->"+FL.dd.t.entities["53"].description+"-->","login");
	FL.dd.t.entities.dumpToConsole();
	FL.dd.t.entities.add("dog","pet cared by a family");
	FL.dd.t.entities.dumpToConsole();
	var eCN = FL.dd.t.entities.getCName("dog");
	FL.common.printToConsole("singular:"+FL.dd.t.entities[eCN].singular+"-->","login");
	FL.common.printToConsole("plural:"+FL.dd.t.entities[eCN].plural+"-->","login");
	FL.common.printToConsole("description:"+FL.dd.t.entities[eCN].description+"-->","login");
	FL.common.printToConsole("csingular:"+FL.dd.t.entities[eCN].csingular+"-->","login");
	FL.common.printToConsole("------------------------","login");
	FL.dd.t.entities[eCN].set({singular:"nice dog",plural:"several nice dogs"});
	FL.common.printToConsole("singular:"+FL.dd.t.entities[eCN].singular+"-->","login");
	FL.common.printToConsole("plural:"+FL.dd.t.entities[eCN].plural+"-->","login");
	FL.common.printToConsole("description:"+FL.dd.t.entities[eCN].description+"-->","login");
	FL.common.printToConsole("--------FIELDS----------------","login");
	var entity ="sub";
	var eCN = FL.dd.t.entities.getCName(entity);
	FL.dd.t.entities[eCN].addField("joakim","dummy field joakim","Joakim'label","text","textbox");
	var display=null;
	_.each(FL.dd.t.entities[eCN].fieldsList(),function(element){display+=element.name+":::"+element.label+":::"+element.typeUI+"\n"});
	alert("For entity "+entity+" list all fields:\n"+display);

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
	FL.common.printToConsole("After display","login");
	
};
