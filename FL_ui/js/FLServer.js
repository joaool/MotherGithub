// jQuery(document).ready(function($){
	/**
	* data dictionary UI methods 
	*/
	// FL = FL || {}; //gives undefined if FL is undefined 
	// FL = {};
	// // a="A";
	// b="B";
	// var a = (typeof a === 'undefined') ? b : a;//if a is defined returns "A" otherwise returns the content of b
	// alert("zzz="+a);//sets "B"
	FL = (typeof FL === 'undefined') ? {} : FL;
	FL["server"] = (function(){//name space FL.server
		// entities={__Last:0,__LastRelation:0};//this is an object of objects (not an array of objects)
		//the key of the internal objects is the singular entity name
			//   {__Last:<number>,__LastRelation:<number>} is a special object with:
			//			__Last - The total the number of entities. This is used to generate entity compressed names
			//			__LastRelation - The total the number of relations. This is used to generate idRelation compressed names
			//   each internal object(entity) has: 
			//      key:{singular:xSingular,csingular:xCSingular,plural:xPlural,description:xDescription,lastId:0,L2C:{},C2L:{},attributes:[]};	
			//		ex:{"Client":{singular:"Client",
			//					csingular:"01",
			//					plural:"clients",
			//					description:"Individual or Company to whom we may send invoices",
			//					sync:false,
			//					lastId:0,
			//					L2C:{},
			//					C2L:{},
			//					attributes:[]	
			//					relations:[]	
			//		}};
			//
			//  singular - is the human (logical) entitity name
			//	csingular - is the compressed entity name (does not change on renames)
			//  plural - plural expression corresponding to singular
			//  description - description of singular (answer to: "what is a <singular> ?")
			//	sync - false if no synchronization was done with the server - true if synchronization was done
			//				- if sync = false (default) csingular and all attributes fieldCN are temporary 
			//				- when sync = true - csingular and all attributes fieldCN are correct
			//  lastId - number of attributes of entity <singular>
			//
			//each attribute (i) is in dDictionary.entities[<sEentity>].arributes[i]
			//     with the format 
			//		{name:"address",description:"address to send invoices",label:"Address",type:"string",enumerable:null,key:false});
			//
			//			name -  is the human (logical) attribute name
			//			description - description of attribute (answer to: "what the <name > of a <entity.singular> ?")
			//			label - defaul value that will appear in UI labeling the attribute
			//			type - one of:  "number","string","enumerable",email","boolean","object","array","null","undefined"
			//				NOTE: if type is "enumerable", the key enumerable must have an array of enumerables
			//			enumerable - an array of enumerables or null (if key type != "enumerable"
			//			key - boolean. True means the attribute is the  key field of the entity . (only one allowed)
			//          fieldCN - field vcompressed name - (NICO)
			//
			// each relation (i) is in dDictionary.entities[<sEntity>].relations[i]
			//     with the format 
			//     oRelation-->	{idRelation:3,cIdRelation:"03",rightEntity:"Invoice",description:"has",cardinality:"0_1",semantic:"Client has many Invoices",delChildren:false});
		 	//    		idRelation - key for database table "relation" int(11) autoincrement
		 	//    		cIdRelation - compressed name corresponding to idRelation - independent identifier  
			//      Note: semantic property is redundant with all other relation properties and with the entity key.
			//      Sych Server 
			//		      //cIdRelation ->rCN returned has _id
			//			  rightEntity ->entityCN ->U
			//			              side - must be saved in the customer dictionary
			//			  IF relation not reflexive
			//			  		description (change to verb) - V - if not reflexive
			//            IF relation reflexive
			//					two entries are necessary with the same right entity -side must be saved one is 0 the other is 1
			//			  cardinality :W ->0,1,N
			//			  delChildren ->option TBD->"02":[{delChildren:true,....}]
			//
		var internalTest = function(x) {//for entity=xSingular, returns the index of attribute=xAttribute
			alert("internalTest() -->"+x);
		};
		var getPageNo = function(pagName){ //to be used by savePage and restorePage
			var pageNoObj = {"home":1,"about":2};
			return  pageNoObj[pagName];
		};
		var disconnectServer = function(disconnectServerCB) {
			FL.server.fa.disconnect(function(e,d){
				// alert ('bye');
				if(disconnectServerCB){
					alert("disconnectServer -->the callback exists");
					return disconnectServerCB();
				}
			});
		};
		var connectServer = function(userName,password,domain,connectServerCB) {
			// var fl = new flMain();
			if(!FL.server.fa)
				FL.server.fa = new FL.server.fl.app();
			var fa = FL.server.fa;
			// var fa = new FL.server.fl.app();
			FL.server.fl.setTraceClient(2);
			// FL.server.fl.serverName('62.210.97.101');
			var jsonParam = {"username": userName, "password": password};
			if(domain){
				jsonParam.domain = domain;
			}
			FL.server.fl.login(jsonParam, function (err, data){
				if (err){
					if(err=="Access denied"){ //unknown pair user/password
						alert("unknown user/password");	
						//createFullaccess				
					}
					localStorage.connection = null;
					alert('flLoging: err=' + JSON.stringify(err));
					return connectServerCB(err);
					// return FL.common.printToConsole ('flLoging: err=' + JSON.stringify(err));
				}
				var myApp = null;  
				if(data.applications.length == 0){
					alert("You have no accessible application - Please contact you application Administrator");
					return connectServerCB("You have no accessible application - Please contact you application Administrator");
				}else if(data.applications.length == 1){//direct access to the sole app 
					myApp =data.applications[0];
				}else{
					//this user has several applications
					alert("to code a selection mechanism so that the user can choose one out of the application set: first app="+data.applications[0].description + "second app"+data.applications[1].description);
					//data.applications[ii].domainName
					//data.applications[ii].description
					var ii=0;
					myApp =data.applications[ii];//if a single application  
				}
				// alert ('connecting to '+myApp.name + JSON.stringify(myApp));
				fa.connect(myApp, function(err2, data2){
					if (err2){
						alert('fa.connect: err=' + JSON.stringify(err2));
						localStorage.connection = null;
						return connectServerCB(false);
						// return FL.common.printToConsole ('fla.connect: err=' + JSON.stringify(err2));
					}
					FL.menuLevel = data2.menuLevel;
					FL.restrictions = data2.restrictions;
					alert("FL.server.connectServer menuLevel="+FL.menuLevel+"\n Restrictions="+JSON.stringify(FL.restrictions));
					localStorage.connection = JSON.stringify(myApp);
					return connectServerCB(null);
				});
			});
		};
		return{
			fl: new flMain(),//FL.server.fl
			fa: null,
			offline:true,
			connect: function(userName,password,domain,connectServerCB){
				// alert("connectServer byPass="+byPass);
				if(!this.offline){
					connectServer(userName,password,domain,connectServerCB);
				}else{
					return connectServerCB({status:"offline"});
				}
			},
			disconnect: function(disconnectCB){
				// alert("disconnectServer byPass="+byPass);
				if(!this.offline)
					disconnectServer(disconnectCB);
			},
			createServerEntity_Fields: function(entityName,createServerEntity_FieldsCB){
				// cb();
				var oEntity = FL.dd.getEntityBySingular(entityName);
				var eCN = null;
				var fEntity = new FL.server.fl.entity();
				var entityJSON = {"3": oEntity.singular, "4": oEntity.description, 'E': oEntity.plural,fields:[]};
				for (var i=0;i<oEntity.attributes.length;i++){//mounts field array
					var attribute = oEntity.attributes[i];

					// var attrJSON = {"3":attribute.name, "4":attribute.description, 'K': attribute.label, 'M': attribute.type, 'O':false,'N':attribute.enumerableArr};
					var attributeType =attribute.type;
					// if(attributeType == "enumerable")
					// 	attributeType = "string";				
					var attrJSON = {"3":attribute.name, "4":attribute.description, 'K': attribute.label,'9':attribute.typeUI, 'M': attribute.type, 'O':false,'N':attribute.enumerable};
					//"O" - attribute.repetable
					entityJSON.fields.push(attrJSON);
				}
				fEntity.addWithFields(entityJSON, function (err, data){
					// FL.common.printToConsole(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

					// FL.common.printToConsole(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
					if(err){
						alert("createEntity Error: "+JSON.stringify(err));
						return createServerEntity_FieldsCB(err);
					}
					eCN=data[0]['_id'];
					oEntity.csingular = eCN;
					for (var i=0;i<data[0].fields.length;i++){//
						FL.dd.setFieldCompressedName(entityName,data[0].fields[i].d["3"],data[0].fields[i]["_id"]);
					};
					FL.dd.setSync(entityName,true);
					return createServerEntity_FieldsCB(null);//null=>it ok
				});	

			},
			XinsertCsvStoreDataTo: function(entityName,insertCB){//creates entity=entityName in server and sends csvStore data to server
				var oEntity =  FL.dd.getEntityBySingular(entityName);
				this.createServerEntity_Fields(entityName,function(err){
					if(err)
						return insertCB(err);
					var eCN = oEntity.csingular;
					//for sure it is sinchronized
					var fd = new FL.server.fl.data();
					var arrToSend = FL.server.preparePutAllCsvStore(entityName);
					fd.insert(eCN,arrToSend,function(err, data){
						if (err){
							alert('insertCsvStoreDataTo: err=' + JSON.stringify(err));
							return insertCB(false);
						}
						FL.common.printToConsole("exit from insertCsvStoreDataTo -->"+JSON.stringify(data));
						return insertCB(null);
						// var myApp =data.applications[0];
					});
				});
			},
			XXXinsertCsvStoreDataTo: function(entityName,insertCB){//creates entity=entityName in server and sends csvStore data to server
				var oEntity =  FL.dd.getEntityBySingular(entityName);
				this.createServerEntity_Fields(entityName,function(err){
					if(err)
						return insertCB(err);
					var eCN = oEntity.csingular;
					//for sure it is sinchronized
					var fd = new FL.server.fl.data();
					var arrToSend = FL.server.preparePutAllCsvStore(entityName);
					fd.insert(eCN,arrToSend,function(err, data){
						if (err){
							alert('insertCsvStoreDataTo: err=' + JSON.stringify(err));
							return insertCB(false);
						}
						FL.common.printToConsole("exit from insertCsvStoreDataTo -->"+JSON.stringify(data));
						return insertCB(null);
						// var myApp =data.applications[0];
					});
				});
			},			
			preparePutRowFromCsvStoreById: function(entityName,id){
				//with the dictionary for entityName translates field logical names in csvStore into compressed field names with csvStore content for id
				//Ex: from csvStore.csvRows = {"1":{"id":1,"shipped":true,"product":"Prod 1"},"2":{"id":2,"shipped":false,"product":"Prod 2"}}
				//      FL.dd.preparePutRowFromCsvStoreById("order",1) ==> {d:{ "00":1,"01":true,"02":"Prod 1" },r:[]}
				//NOTE: the object is not ready to be inserted in server (entity compressed name is missing) !  
				var csvRow = csvStore.csvRows[id];
				var retObj = {};
				var fCN = null;
				var oEntity =  FL.dd.getEntityBySingular(entityName);
				var attribute = null;
				_.each(csvRow, function(value,key){
					fCN = oEntity.L2C[key];//with key ( a logical name) we get the compressed name
					retObj[fCN] = value;
				});
				// fd.insert("50", {d:{"51":'Nome do cliente', '52':'Cascais', '53': 'Portugal', "54":'cliente@sapo.pt'}, r:[ {r:"59", l:[ {_id: "789fgd89"}]}]
				//   }, function(err, data){
				return {d:retObj,r:[]};
			},
			preparePutAllCsvStore: function(entityName){
				var csvRows = csvStore.csvRows;
				var retArr = _.map(csvRows, function(value,key){
					return FL.server.preparePutRowFromCsvStoreById(entityName,key);
				});
				return retArr;
			},
			convertArrC2LForEntity: function(entityName,serverArr){//serverArr =>[{"_id":123,d:{},r:[]},{"_id":124,d:{},r:[]},....{"_id":125,d:{},r:[]}]
				//Use the dictionary for entityName to convert compressed field names in keys in serverArr to logical field names
				//Ex: from server [{"d":{"01":true,"02":"Super 1","00":1},"r":[]},{"d":{"01":false,"02":"Super 2","00":2},"r":[]}]
				//     ==============> [{"_id":123,id:1,"shipped":true,"product":"Super 1","id":1},{"_id":124,id:2,"shipped":false,"product":"Super 2","id":2}]	
				// If serverArr elements inside d object have no compressed name corresponding to "id" in local dictionary, id will be added
				// if serverArr elements have a "_id" property/value "_id" will be included in the return array 
				var oEntity =  FL.dd.getEntityBySingular(entityName);
				var arrOfCKeys = null;
				var arrOfValues = null;
				var arrOfLKeys = null;
				var dContent = null;
				var el = null;
				var index = 1;
				var retArr = _.map(serverArr, function(element){//each element is JSON =>{"_id":123,d:{},r:[]}
					dContent = element.d;//only d will be processed. d is a JSON ex.=>{ "62":1, "63":true,"64":"Super 1" }
					arrOfCKeys = _.keys(dContent);//ex. ["62","63","64"]
					arrOfValues = _.values(dContent);//ex. [1,true,"Super1"]
					arrOfLKeys = _.map(arrOfCKeys, function(element2){ 
						var logicalName = oEntity.C2L[element2];
						// return oEntity.C2L[element2]; 
						return logicalName; 
					});
					el = _.object(arrOfLKeys,arrOfValues);//reassembles the object from two aligned arrays
					if(!el.id)
						el["id"] = index;
					index++;
					if(element._id)
						el["_id"] = element._id;
					return el;
				});
				return retArr;
			},			
			loadCsvStoreFromEntity: function(entityName,loadCsvStoreFromEntityCB){
				//For this to run entityName must exist in local Dictionary and must be in sync with server
				// var arrToStoreLocally = [];
				//we assume that entityName exists in local Dictionary and is in sync
				var oEntity =  FL.dd.getEntityBySingular(entityName);
				// oEntity.csingular = "61";
				if(oEntity){//entityName exists in local Dictionary
					var eCN =  oEntity.csingular;
					var sync = oEntity.sync;
					if(sync){//now we can import from server
						FL.common.printToConsole("FL.server.loadCsvStoreFromEntity Entity=" + entityName + " exists and is in sync -->eCN/sync=" + eCN + "/"+sync);
						var flData = new FL.server.fl.data();
						// var flData = new FL.server.fl.entity();
						flData.findAll(eCN, {query:{}},function(err, docs){
							if (err){
								alert('FL.server.loadCsvStoreFromEntity: Error returning from server -> err=' + JSON.stringify(err));
								return loadCsvStoreFromEntityCB(false);
							}
							FL.common.printToConsole("docs="+JSON.stringify(docs));

							var arrToStoreLocally = FL.server.convertArrC2LForEntity(entityName,docs);//docs =>[{"_id":123,d:{},r:[]},{"_id":124,d:{},r:[]},....{"_id":125,d:{},r:[]}]
							FL.common.printToConsole("arrToStoreLocally="+JSON.stringify(arrToStoreLocally));

							csvStore.store(arrToStoreLocally);
							alert("import is done");
							FL.common.printToConsole("import is done");
							return loadCsvStoreFromEntityCB(true);
						});

					}else{
						alert("FL.server.loadCsvStoreFromEntity Error:" + entityName + " exists but is not synchronized with server");
						return loadCsvStoreFromEntityCB(false);
					}
				}else{
					alert("FL.server.loadCsvStoreFromEntity Error: local Dictionary has no entity="+entityName);
					return loadCsvStoreFromEntityCB(false);
				}

				// csvStore.store(arrToStoreLocally);
			},
			// syncLocalEntity: function(entityName,syncLocalEntityCB){//gets all updated info from server to entity = entityName
			// 	//code here
			// 	fEnt.getOne({‘query’:{‘3’:’nomEntity’}, projection:{‘_id’:1}}, function(err ,data){//only _id is returned - _id is the compressed name
			// 	   if(err){ // process error
			// 	   }	
			// 	   if(data != null){

			// 	   }
   //     // we have a new entity on the server, need to resync the dictionary
			// },	
			syncLocalDictionary: function(syncLocalDictionaryCB){//clears local dictionary and updates it from server dictionary
				//fd.insert(’40’,{_id:1, d: json}, function(err, data){…}) pg22
				//fd.findOne(“40”,{query:{‘_id’:1}}, function(err, data){…})
				//code here
				var fEnt = new FL.server.fl.entity();
				var z= 32;
				fEnt.getAllWithField({"query":{}}, function(err ,entities){
					try{
						if(err){ // process error
							return syncLocalDictionaryCB(err);
						}
						//code here
						var sucess = null;
						var oEntity = null;
						// FL.common.printToConsole("&&&&&&&&&&&&&&&&&&& begin syncLocalDictionary &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
						FL.dd.clear();//clears local dictionary
						// FL.dd.displayEntities();
						// FL.common.printToConsole("--- *** Entities *** ---");
						for( var i = 0; i < entities.length; i++){
							// FL.common.printToConsole("Entity eCN=" + entities[i]._id + " singular=" + entities[i].d["3"] );
							success = FL.dd.createEntity(entities[i].d["3"],entities[i].d["4"]);//("client","company we may invoice")
							oEntity = FL.dd.entities[entities[i].d["3"]];
							oEntity.plural = entities[i].d["E"];
							oEntity.csingular = entities[i]._id;
							FL.common.printToConsole("--- *** fields *** ---");
							for( var fieldIndex = 0; fieldIndex < entities[i].fields.length; fieldIndex++){//boucle fields
								// FL.common.printToConsole("--->field fCN=" + entities[i].fields[fieldIndex]._id + " fieldName=" + entities[i].fields[fieldIndex].d["3"] );
								FL.dd.addAttribute(entities[i].d["3"],entities[i].fields[fieldIndex].d["3"] ,entities[i].fields[fieldIndex].d["4"],entities[i].fields[fieldIndex].d["K"],entities[i].fields[fieldIndex].d["M"],entities[i].fields[fieldIndex].d["9"],entities[i].fields[fieldIndex].d["N"]);//("order","shipped","expedition status","Shipped","boolean",null)
								//addAttribute uses a local compressed name. Now we have to force the field compressed name comming from server								
								FL.dd.setFieldCompressedName(entities[i].d["3"],entities[i].fields[fieldIndex].d["3"], entities[i].fields[fieldIndex]._id );
							}
							// FL.common.printToConsole("--- *** relations *** ---");
							var rCN = null;
							var relationName = null;
							var withEntityCN = null;
							var side = null;
							var verb = null;
							var cardinality = null;
							var semantic = null;
							var storedHere = null;
							var relation = null;

							oEntity.relations = [];
							for( var relationIndex = 0; relationIndex < entities[i].relations.length; relationIndex++){//boucle relations
								// FL.common.printToConsole("--->relation  rCN=" + entities[i].relations[relationIndex]._id );
								relation = {};
								relation["rCN"] = entities[i].relations[relationIndex]._id;
								relation["withEntityCN"] = entities[i].relations[relationIndex].d["00"][0]["U"];
								relation["withEntity"] = null;
								relation["verb"] = entities[i].relations[relationIndex].d["00"][0]["V"];
								relation["cardinality"] = entities[i].relations[relationIndex].d["00"][0]["W"];
								relation["side"]  = entities[i].relations[relationIndex].d["00"][0]["Z"];
								relation["storedHere"] = entities[i].relations[relationIndex].d["00"][0]["Y"];//if true this is the side to read the relation from left to rigth
								relation["semantic"] = null;
								//semantic = to be formed in local dictionary ex://"customer has many orders"
								//FL.dd.addRelation(entities[i].d["3"],rCN,withEntity,verb,cardinality,side,storedHere);
								//we cannot use addRelation() because withEntity is unknown here. we only know its compressed name = withEntityCN
								//    because of this it is impossible to call FL.dd.relationSemantics
								//    we need a second pass to fill withEntity and semantic
								oEntity.relations.push(relation);
							}

						}
						//When we sync in a serial way we are creating relations before having the other side entity. S
						//Synchronizing relations needs 2 steps. Step 1 is done above saving  the auxiliary "withEntityCN" without filling "withEntity"
						// - Step 2 is done below filling "withEntity" from "withEntityCN" (saved in step 1) and setting sync=true at entity level. 
						FL.dd.relationPass2();//goes thru all entities and for all relations of each entity fills withEntity and semantic using withEntityCN
						// FL.dd.displayEntities();
						// FL.common.printToConsole("&&&&&&&&&&&&&&&&&&&& end syncLocalDictionary &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
						return syncLocalDictionaryCB(null);
					}
					catch(e){
						FL.common.printToConsole("Big error !!!"+e.stack);
						return syncLocalDictionaryCB(e.toString());
					}
				});
			},
			saveMainMenu: function(oMenu,style,fontFamily,saveMainMenuCB) {
				//it tries to update if it fails (because _id:1  does not exist) then inserts
				// alert("FL.server.saveMainMenu() -->");
				var fd = new FL.server.fl.data();
				fd.update("40", {"query":{"_id":1},"update":{"45":oMenu,"46":style,"47":fontFamily}}, function(err, data){
					if (err){
						alert('FL.server.saveMainMenu: err=' + JSON.stringify(err));
						return saveMainMenuCB(false);
					}
					FL.common.printToConsole("exit from update with success -->"+JSON.stringify(data));
					if(data.count == 0){//data.count == 0 =>we need to insert
						fd.insert("40",{_id:1, d:{"45":oMenu,"46":style,"47":fontFamily}}, function(err, data){
							if (err){
								alert('FL.server.saveMainMenu: err=' + JSON.stringify(err));
								return saveMainMenuCB(false);
							}
							FL.common.printToConsole("exit from saveMainMenu insert after failling update. Success -->"+JSON.stringify(data));
							return saveMainMenuCB(null);
						});
					}
					return saveMainMenuCB(null);
				});	
			},
			syncLocalStoreToServer: function(){//saves menu,style and font to server, retrieving them from localStore
				var lastMenuStr  = localStorage.storedMenu
				var lastStyleStr = localStorage.style;// Retrieve last saved style ex.red or spacelab
				var lastFontFamilyStr = localStorage.fontFamily;// Retrieve last saved fontFamily ex.impact or georgia
				var oMenu = JSON.parse(lastMenuStr);
				// FL.menu.currentMenuObj.jsonMenu = FL.menu.currentOptions.jsonMenu;//HACK - because FL.menu.currentMenuObj.jsonMenu does not reflect the last menu update
				FL.server.saveMainMenu(oMenu,lastStyleStr,lastFontFamilyStr,function(err){
					FL.common.printToConsole("FL.server syncLocalStoreToServer() -> menu style and font saved on server -->"+err);
					// alert("FLMenu2.js saveMenuToLocalAndServer called FL.server.saveMainMenu with style="+lastStyleStr+ " font="+lastFontFamilyStr);
				});
			},
			NextVersionSaveMainMenu: function(oMenu,p1,p2,saveMainMenuCB) {
				alert("FL.server.saveMainMenu() -->");
				var fd = new FL.server.fl.data();
				fd.findAndModify("40", {"query":{"_id":1},"sort":{},option:{upsert:true},"update":{"45":oMenu,"46":p1,"47":p2}}, function(err, data){
					if (err){
						alert('FL.server.saveMainMenu: err=' + JSON.stringify(err));
						return saveMainMenuCB(false);
					}
					FL.common.printToConsole("exit from saveMainMenu with success -->"+JSON.stringify(data));
					return saveMainMenuCB(null);
				});
			},			
			restoreMainMenu: function(restoreMainMenuCB) {//restores main menu, style and fontFamily
				// alert("FL.server.restoreMainMenu() -->");
				var fd = new FL.server.fl.data();
				fd.findOne("40",{"query":{"_id":1}}, function(err, data){
					if (err){
						alert('FL.server.restoreMainMenu: err=' + JSON.stringify(err));
						return restoreMainMenuCB(false);
					}
					// FL.common.printToConsole("restoreMainMenu -->")
					var oMenu= data.d["45"];
					var style= data.d["46"];
					var fontFamily= data.d["47"];
					var retData = {oMenu: oMenu,style: style,fontFamily: fontFamily};
					FL.common.printToConsole("FL.server.restoreMainMenu exit with success -->"+JSON.stringify(data));
					return restoreMainMenuCB(null,retData);
				});
			},
			savePage: function(pagName,htmlContent,savePageCB) {
				//it tries to update if it fails (because _id:pagNo  does not exist) then inserts
			    // ex FL.server.savePage("home",homeHTML,function(err){});
				// alert("FL.server.saveMainMenu() -->");
				var pagNo = getPageNo(pagName);
				if (pagNo){
					var fd = new FL.server.fl.data();
					fd.update("43", {"query":{"_id":pagNo},"update":{html:htmlContent}}, function(err, data){
					// fd.update("43", {"query":{"_id":pagNo},d: htmlContent}, function(err, data){ //ERROR IN flClient 269
					// fd.update("43", {"query":{"_id":pagNo},"update":{d:{d:htmlContent}}}, function(err, data){
						if (err){
							alert('FL.server.savePage: ERROR ON UPDATE err=' + JSON.stringify(err));
							return savePageCB(false);
						}					
						FL.common.printToConsole("FL.server.savePage: exit from update with success -->"+JSON.stringify(data));
						if(data.count == 0){//data.count == 0 =>we need to insert

							fd.insert("43",{_id:pagNo, d:{html:htmlContent}}, function(err, data){
								if (err){
									alert('FL.server.savePage: ERROR ON INSERT err=' + JSON.stringify(err));
									return savePageCB(false);
								}
								FL.common.printToConsole("FL.server.savePage: exit with success after insert -->"+JSON.stringify(data));
								return savePageCB(null);
							});
						}
						return savePageCB(null);
					});
				}else{
					alert('FL.server.savePage Error: pagName=' + pagName + ' unavailable to be saved. Please check getPageNo()');
					return savePageCB({status:pagName + " is unavailable"});
				}
			},			
			restorePage: function(pagName,restorePageCB) {
				// alert("FL.server.restorePage() -->");
				var htmlContent = null;
				var pagNo = getPageNo(pagName);
				if (pagNo){
					var fd = new FL.server.fl.data();
					fd.findOne("43",{"query":{"_id":pagNo}}, function(err, data){
						if (err){
							alert('FL.server.restorePage: err=' + JSON.stringify(err));
							return restorePageCB(false);
						}
						FL.common.printToConsole("exit from restorePage with success -->"+JSON.stringify(data));
						return restorePageCB(null,data);
					});
				}else{
					alert('FL.server.restorePage Error: pagName=' + pagName + ' unavailable to be restored.');
					return restorePageCB({status:pagName + "unavailable"});
				}
			},		
			restorePageFromConnectionString: function(pagName,connectionString,restorePageFromConnectionStringCB) {
				FL.server.fa = new FL.server.fl.app();
				var myApp = JSON.parse(connectionString);
				FL.server.fl.setTraceClient(2);
				FL.server.fa.connect(myApp, function(err2, data2){
					if (err2){
						localStorage.connection = null;
						alert('FL.server.restorePageFromConnectionString: reconnecting ERROR err=' + JSON.stringify(err2));
						return restorePageFromConnectionStringCB(false);
					}
					FL.server.offline = false;
					FL.server.restorePage(pagName, function(err,data){
						if (err){
							alert('FL.server.restorePageFromConnectionString: after reconnect ERROR: err=' + JSON.stringify(err));
							return restorePageFromConnectionStringCB(false);
						}
						// alert('FL.server.restorePageFromConnectionString: after connect: PAGE RESTORED SUCCESSFULLY data=' + JSON.stringify(data));
						var htmlStr = data.d.html;	
						return restorePageFromConnectionStringCB(null,htmlStr);
					});
				});
			},				
			testFunc: function(x) {
				alert("FL.server.test() -->"+x);
			}			
		};
	})();
// });