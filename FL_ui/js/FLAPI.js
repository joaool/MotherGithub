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
	FL["API"] = (function(){//name space FL.API
		var internalTest = function(x) {//
			alert("internalTest() -->"+x);
		};
		//-------- PROMISE WRAPPERS ------------------
		var	_applicationFullCreate = function(jsonParam) {
			//ex _applicationFullCreate({"adminName": "nico@framelink.co", "adminPassWord": "coLas"}, function (err, myApp){
			console.log("....................................>beginning _applicationFullCreate....");
			var def = $.Deferred();
			var fl = new flMain();//FL.server.fl
			var fa = new fl.app();
			fl.setTraceClient(2);
			fl.applicationFullCreate(jsonParam, function (err, myApp){
			// fl.applicationFullCreate({"adminName": "joao@framelink.co", "adminPassWord": "oLiVeIrA"}, function (err, myApp){
				// err = "abc";
				if(err){
					// alert("ERROR ON _applicationFullCreate");
					console.log("=================================>ERROR ON fl.applicationFullCreate");
					FL.login.token = {
						"clientName":null,
						"userName":null,
						"userPassWord":null,
						"domainName":null,
						"fl":fl,
						"fa":fa,
						"appDef":null,
						"appDescription":null,
						"appMenuLevel":null,
						"appRestrictions":null,
						"error":"fl.applicationFullCreate"
					};
					def.reject(err);
				}else{
					// myAppFC=myApp;
					console.log("....................................>fl.applicationFullCreate RESPONSE OK ON _applicationFullCreate....");
					FL.login.token = {
						"clientName":myApp.clientName,
						"userName":myApp.userName,
						"userPassWord":myApp.userPassWord,
						"domainName":myApp.domainName,
						"fl":fl,
						"fa":fa,
						"appDef":null,
						"appDescription":null,
						"appMenuLevel":null,
						"appRestrictions":null,
						"error":null
					};
					def.resolve();
				}
			});
			return def.promise();
		};
		var _login = function() {//notice that login can be done without any application =>FL.login.token.appDef = null;
			console.log("....................................>beginning _login....");
			var def = $.Deferred();
			var fl = FL.login.token.fl; //new flMain();
			// var fa = new fl.app();
			fl.login({"username": FL.login.token.userName, "password": FL.login.token.userPassWord, "domain": FL.login.token.domainName}, function (err, data){
				// err = "abc";
				if(err){
					// alert("ERROR ON _login");
					console.log("============================>ERROR ON _login");
					FL.login.token.error = "_login";
					def.reject("ERROR ON _login err="+err);
				}else{
					var appDef =data.applications[0];//it has a single application because it was just created
					if(appDef){
						console.log("....................................>fl.login RESPONSE OK ON _login....");
						FL.login.token.appDef = appDef;
						FL.login.token.appDescription = appDef.description;
						def.resolve();		
					}else{
						FL.login.token.appDef = null;
						FL.login.token.appDescription = null;
						console.log("....................................>fl.login RESPONSE OK ON _login but ERROR:no application available....");
						def.reject("no application available");
					}
				}
			});
			return def.promise();
		};
		var _connect = function() {
			// ex jsonParam = {"username": myApp.userName, "password": myApp.userPassWord, "domain": myApp.domainName}
			console.log("....................................>beginning _connect....");
			var def = $.Deferred();
			// var fl = FL.login.token.fl; //new flMain();
			var fa = FL.login.token.fa;//new fl.app();
			fa.connect(FL.login.token.appDef, function(err, data2){
				// err = "abc";
				if(err){
					// alert("ERROR ON _connect");
					console.log("=============================>ERROR ON _connect");
					FL.login.token.error = "_connect";
					def.reject(err);
				}else{
					console.log("....................................>fa.connect RESPONSE OK ON _connect....");
					// alert("OK USER CREATED AND CONNECTED  ->"+JSON.stringify(FL.login.token));
					console.log("=====================================>_connect: OK USER CONNECTED  ->"+JSON.stringify(FL.login.token));
					def.resolve();
				}
			});
			return def.promise();
		};
		var _disconnect = function(){
			console.log("....................................>beginning _disconnect...."+JSON.stringify(FL.login.token));
			var def = $.Deferred();
			var fl = FL.login.token.fl;//new flMain();
			var fa = FL.login.token.fa;//new fl.app();
			// var fa = new fl.app();
			// var fl= token.fl;
			// var fa= token.fa;
			fa.disconnect(function(err,data){
				console.log(".............................fa.disconnect ON _disconnect....");
				// err = "abc";
				if(err){
					alert("ERROR ON _disconnect err="+err);
					console.log("======================>ERROR ON _disconnect err="+err);
					def.reject(err);
				}else{
					console.log("=====================================>_disconnect: OK USER DISCONNECTED  ->token="+JSON.stringify(FL.login.token));
					def.resolve();
				}
			});
			return def.promise();
		};
		var _applicationRemove = function(){
			var def = $.Deferred();
			var fl = FL.login.token.fl; //new flMain();
			// var fl = new flMain();
			// var fa = FL.login.token.fa;//new fl.app();
			fl.applicationRemove({"adminName": FL.login.token.userName, "adminPassWord": FL.login.token.userPassWord, "domain": FL.login.token.domainName}, function (err, data){
				console.log("............................._applicationRemove....");
				// err = "abc";
				if(err){
					alert("ERROR ON _applicationRemove err="+err);
					console.log("======================>ERROR ON _applicationRemove err="+err);
					def.reject(err);
				}else{
					FL.login.token.appDef = null;
					console.log("=====================================>_applicationRemove: OK APPLICATION REMOVED  ->token="+JSON.stringify(FL.login.token));
					def.resolve();
				}
			});
			return def.promise();
		};
		var _applicationCreate = function(){
			var def = $.Deferred();
			var fl = FL.login.token.fl; //new flMain();
			// var fl = new flMain();
			// var fa = FL.login.token.fa;//new fl.app();
			fl.applicationCreate({"adminName": FL.login.token.userName, "adminPassWord": FL.login.token.userPassWord, "domainPrefix": "test",
				"description": "sample Application"}, function (err, data){
				console.log("............................._applicationCreate....");
				// err = "abc";
				if(err){
					// alert("ERROR ON _applicationCreate err="+err);
					console.log("======================>ERROR ON _applicationCreate err="+err);
					def.reject("ERROR ON _applicationCreate err="+ err);
				}else{
					FL.login.token.appDef = data.d;
					FL.login.token.domainName = data.d['domainName'];
					console.log("=====================================>_applicationCreate: OK APPLICATION CREATED  ->token="+JSON.stringify(FL.login.token));
					def.resolve();
				}
			});
			return def.promise();
		};
		var	_clientRemove = function(){
			var def = $.Deferred();
			var fl = FL.login.token.fl; //new flMain();
			var fa = FL.login.token.fa;//new fl.app();
			fl.clientRemove({"adminName": "nico@framelink.co", "adminPassWord": "coLas", "clientName": FL.login.token.clientName}, function (err, data){
				console.log("............................._clientRemove....");
				// err = "abc";
				if(err){
					alert("ERROR ON _clientRemove err="+err);
					console.log("======================>ERROR ON _clientRemove err="+err);
					def.reject(err);
				}else{
					var oldUserName = FL.login.token.userName;
					FL.login.token = null;
					// alert("_clientRemove DONE user=" + oldUserName + "was removed!  ->token="+JSON.stringify(FL.login.token));
					console.log("=====================================>_clientRemove DONE user=" + oldUserName + "was removed! ->token="+JSON.stringify(FL.login.token));
					def.resolve();
				}
			});
			return def.promise();
		};
		var _applicationFinalize = function(userName,appDescription){
			var def = $.Deferred();
			FL.login.token.appDescription = "application of user "+userName;
			if(appDescription)
				FL.login.token.appDescription = appDescription;
			var fl = FL.login.token.fl; //new flMain();
			var fa = FL.login.token.fa;//new fl.app();
			fl.applicationFinalize({"adminName":"nico@framelink.co","adminPassWord":"coLas",
					"userName":FL.login.token.userName,"clientName":FL.login.token.clientName,"domainName":FL.login.token.domainName,
					"newUserName":userName,"newClientName":userName,
					"newDescription":FL.login.token.appDescription}, function(err, data){
				console.log("............................._applicationFinalize....with:"+userName+"/"+appDescription);
				// err = "abc";
				if(err){
					alert("ERROR ON _applicationFinalize err="+err);
					console.log("======================>ERROR ON _applicationFinalize err="+err);
					def.reject(err);
				}else{
					// FL.login.token = {
					//	"clientName":null,
					//	"userName":null,
					//	"userPassWord":null,
					//	"domainName":null,
					//	"fl":fl,
					//	"fa":fa,
					//	"appDef":null,
					//	"appDescription":null,
					//	"appMenuLevel":null,
					//	"appRestrictions":null,
					//	"error":"fl.applicationFullCreate"
					//};				
					FL.login.token.clientName = userName;
					FL.login.token.userName = userName;
					// FL.login.token.userPassWord = null;
					console.log("=====================================>_applicationFinalize: OK ->token="+JSON.stringify(FL.login.token));
					def.resolve();
				}
			});
			return def.promise();
		};
		var _userChangePassWord = function(password){
			var def = $.Deferred();
			var fl = FL.login.token.fl; //new flMain();
			// var fl = new flMain();
			// var fa = FL.login.token.fa;//new fl.app();
			fl.userChangePassWord({"adminName":"nico@framelink.co", "adminPassWord":"coLas",
					"userName":FL.login.token.userName, "userPassWord":password}, function(err, result){
				console.log("............................._userChangePassWord....TO "+password);
				// err = "abc";
				if(err){
					alert("ERROR ON _userChangePassWord err="+err);
					console.log("======================>ERROR ON _userChangePassWord err="+err);
					def.reject(err);
				}else{
					FL.login.token.userPassWord = password;
					console.log("=====================================>_userChangePassWord: OK Password changed to " + password + "  ->token="+JSON.stringify(FL.login.token));
					def.resolve();
				}
			});
			return def.promise();
		};
		//-------- END OF LOGIN WRAPPERS ------------------		
		
		//-------- OTHER WRAPPERS ------------------		
		var _getFullDictionary = function(){
			var def = $.Deferred();
			var fl = FL.login.token.fl; //new flMain();
			if(!fl){
				// console.log("======================>ERROR ON _getFullDictionary ->no connection");
				def.reject("ERROR: no connection available");
			}else{
				var fEnt = new fl.entity();
				fEnt.getAllWithField({"query":{}}, function(err ,entities){
					console.log(".............................fEnt.getAllWithField ON _getFullDictionary");
					// err = "abc";
					if(err){
						// alert("ERROR ON _getFullDictionary err="+err);
						console.log("======================>ERROR ON _getFullDictionary err="+err);
						def.reject(err);
					}else{
						console.log("=====================================>_getFullDictionary: OK ->entites="+JSON.stringify(entities));
						def.resolve(entities);
					}
				});
			}
			return def.promise();
		};
		var _addWithFields = function(entityJSON){//creates an entity with the fields in server, with one singke call
			var def = $.Deferred();
			var fl = FL.login.token.fl; //new flMain();
			// var fl = new flMain();
			// var fa = FL.login.token.fa;//new fl.app();
			var fEntity = new fl.entity();
			fEntity.addWithFields(entityJSON, function (err, data){
				console.log("............................._addWithFields....");
				// err = "abc";
				if(err){
					// alert("ERROR ON _addWithFields err="+err);
					console.log("======================>ERROR ON _addWithFields err="+err);
					def.reject("ERROR: _addWithFields err="+err);
				}else{
					var entityName = entityJSON["3"];//the same as oEntity.singular
					var oEntity = FL.dd.getEntityBySingular(entityName);
					var eCN=data[0]['_id'];
					oEntity.csingular = eCN;
					for (var i=0;i<data[0].fields.length;i++){//
						FL.dd.setFieldCompressedName(entityName,data[0].fields[i].d["3"],data[0].fields[i]["_id"]);//xSingular,fieldName,fieldCN
					}
					FL.dd.setSync(entityName,true);

					console.log("=====================================>_addWithFields: OK " + entityName + " stored on server and local Dict in synch");
					def.resolve();
				}
			});
			return def.promise();
		};
		var _restoreMainMenuStyleANDfontFamily = function(){//restores main menu, style and fontFamily
			var def = $.Deferred();
			var fl = FL.login.token.fl; //new flMain();
			// var fl = new flMain();
			// var fa = FL.login.token.fa;//new fl.app();
			FL.login.appToken = {
				"menu":null,
				"style":null,
				"fontFamily":null,
				"homePage":null,
				"error":null
			};
			var fd = new fl.data();
			fd.findOne("40",{"query":{"_id":1}}, function(err, data){
				console.log("............................._restoreMainMenuStyleANDfontFamily....");
				// err = "abc";
				if(err){
					// alert("ERROR ON _addWithFields err="+err);
					FL.login.appToken.error = "_restoreMainMenuStyleANDfontFamily err="+err;
					console.log("======================>ERROR ON " + FL.login.appToken.error);
					def.reject("ERROR: " + FL.login.appToken.error);
				}else{
					console.log("=====================================>_restoreMainMenuStyleANDfontFamily: OK checks for nulls");
					var retData = null;
					var oMenu = FL.login.defaultMenu;
					var style = FL.login.defaultStyle;
					var fontFamily = FL.login.defaultFontFamily;
					if(!data){
						console.log("=====================================>_restoreMainMenuStyleANDfontFamily: OK With null data");
					}else{
						if(!data.d){
							console.log("=====================================>_restoreMainMenuStyleANDfontFamily: OK With null data.d");
						}else{
							if(data.d["45"])//menu
								oMenu = data.d["45"];
							if(data.d["46"])//style
								style = data.d["46"];
							if(data.d["47"])//fontFamily
								fontFamily = data.d["47"];
							console.log("=====================================>_restoreMainMenuStyleANDfontFamily: OK ");
						}
					}
					retData = {oMenu: oMenu,style: style,fontFamily: fontFamily};
					FL.login.appToken.menu = oMenu;
					FL.login.appToken.style = style;
					FL.login.appToken.fontFamily = fontFamily;
					FL.login.appToken.homePage = null;
					FL.login.appToken.error = null;
					def.resolve(retData);
				}
			});
			return def.promise();
		};
		var insertMacrosOnHomePage = function(textHTML){
			//only supports:<%= appDescription %>, <%= shortUserName %> and <%= userName %>
			var templateFunction = _.template(textHTML);
			var pos = FL.login.token.userName.indexOf("@");
			var shortUserName = FL.login.token.userName.substring(0,pos);
			var templateArg = {appDescription:FL.login.token.appDescription, userName:FL.login.token.userName, shortUserName:shortUserName};
			return templateFunction(templateArg);
		};
		var _restorePage = function(){//restores main menu, style and fontFamily
			var def = $.Deferred();
			var fl = FL.login.token.fl; //new flMain();
			var pagNo = getPageNo("home");
			// var fl = new flMain();
			// var fa = FL.login.token.fa;//new fl.app();
			var fd = new fl.data();
			fd.findOne("43",{"query":{"_id":pagNo}}, function(err, data){
				console.log("............................._restorePage....");
				// err = "abc";
				if(err){
					// alert("ERROR ON _addWithFields err="+err);
					console.log("======================>ERROR ON _restorePage err="+err);
					def.reject("ERROR: _restorePage err="+err);
				}else{ 
					var retData = insertMacrosOnHomePage(FL.login.defaultPage);
					// data = null;
					if(!data){
						console.log("=====================================>_restorePage: OK With null data");
					}else{
						// data.d = null;
						if(!data.d){
							console.log("=====================================>_restorePage: OK With null data.d");
						}else{
							// data.d.html = null;
							if(!data.d.html){
								console.log("=====================================>_restorePage: OK With null data.d.html");
							}else{
								retData = data.d.html;
								console.log("=====================================>_restorePage: OK ");
							}
						}
					}	
					def.resolve(retData);
				}
			});
			return def.promise();
		};
		var _saveMainMenuStyleANDfontFamily = function(){//updates menu,style and fontFamily defined on FL.login.appToken. to server - inspired on FL.server.saveMainMenu
			//it tries to update if it fails (because _id:1  does not exist) then inserts
			var def = $.Deferred();
			var fl = FL.login.token.fl; //new flMain();
			// var fl = new flMain();
			// var fa = FL.login.token.fa;//new fl.app();
			var fd = new fl.data();
			var oMenu = FL.login.appToken.menu;// instead of localStorage.storedMenu;//Retrieve last saved menu
			var lastStyleStr = FL.login.appToken.style;// instead of localStorage.style;// Retrieve last saved style ex.red or spacelab
			var lastFontFamilyStr = FL.login.appToken.fontFamily;//instead of localStorage.fontFamily;// Retrieve last saved fontFamily ex.impact or georgia
			fd.update("40", {"query":{"_id":1},"update":{"45":oMenu,"46":lastStyleStr,"47":lastFontFamilyStr}}, function(err, data){
				console.log("............................._saveMainMenuStyleANDfontFamily....");
				// err = "abc";
				if(err){
					console.log("======================>ERROR ON _saveMainMenuStyleANDfontFamily err="+err);
					def.reject("ERROR: _saveMainMenuStyleANDfontFamily err="+err);
				}else{
					if(data.count == 0){//data.count == 0 =>we need to insert
						console.log("=====================================>_saveMainMenuStyleANDfontFamily: OK no existing record, we need to insert");
						fd.insert("40",{_id:1, d:{"45":oMenu,"46":lastStyleStr,"47":lastFontFamilyStr}}, function(err, data){
							console.log("............................._saveMainMenuStyleANDfontFamily...trying to insert...");
							// err = "abc";
							if (err){
								console.log("======================>ERROR ON _saveMainMenuStyleANDfontFamily FAIL TO INSERT err="+err);
								def.reject("ERROR: _saveMainMenuStyleANDfontFamily FAIL TO INSERT err="+err);
							}else{
								console.log("=====================================>_saveMainMenuStyleANDfontFamily: INSERTED OK ");
								def.resolve();							
							}
						});
					}else{
						console.log("=====================================>_saveMainMenuStyleANDfontFamily: OK ");
						def.resolve();
					}	
				}
			});
			return def.promise();
		};
		var _saveHomePage = function(){//save page in FL.login.appToken.homePage - inspired in FL.server.savePage
			var def = $.Deferred();
			var fl = FL.login.token.fl; //new flMain();
			var pagNo = getPageNo("home");
			// var fl = new flMain();
			// var fa = FL.login.token.fa;//new fl.app();
			var htmlContent = FL.login.appToken.homePage;
			var fd = new fl.data();
			fd.update("43", {"query":{"_id":pagNo},"update":{html:htmlContent}}, function(err, data){
				console.log("............................._saveHomePage....");
				// err = "abc";
				if(err){
					// alert("ERROR ON _addWithFields err="+err);
					console.log("======================>ERROR ON _saveHomePage err="+err);
					def.reject("ERROR: _saveHomePage err="+err);
				}else{
					if(data.count == 0){//data.count == 0 =>we need to insert
						console.log("=====================================>_saveHomePage: OK no existing record, we need to insert");
						fd.insert("43",{_id:pagNo, d:{html:htmlContent}}, function(err, data){
							console.log("............................._saveHomePage...trying to insert...");
							// err = "abc";
							if (err){
								console.log("======================>ERROR ON _saveHomePage FAIL TO INSERT err="+err);
								def.reject("ERROR: _saveHomePage FAIL TO INSERT err="+err);
							}else{
								console.log("=====================================>_saveHomePage: INSERTED OK ");
								def.resolve();							
							}
						});
					}else{
						console.log("=====================================>_saveHomePage: OK ");
						def.resolve();
					}	
				}
			});
			return def.promise();
		};			
		var	rebuildsLocalDictionaryFromServer = function(entities){//interprets entity JSON received from server to local dd
			console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx entities=" + entities + " xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
			var sucess = null;
			var oEntity = null;
			// console.log("&&&&&&&&&&&&&&&&&&& begin syncLocalDictionary &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
			FL.dd.clear();//clears local dictionary

			// console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% after FL.dd.clear %%%%%%%%%%%%%%%%%");
			// FL.dd.displayEntities();
			// console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");

			// console.log("--- *** Entities *** ---");
			for( var i = 0; i < entities.length; i++){
				// console.log("Entity eCN=" + entities[i]._id + " singular=" + entities[i].d["3"] );
				success = FL.dd.createEntity(entities[i].d["3"],entities[i].d["4"]);//singular,description ex:("client","company we may invoice")
				oEntity = FL.dd.entities[entities[i].d["3"]];
				oEntity.plural = entities[i].d["E"];
				oEntity.csingular = entities[i]._id;
				// console.log("--- *** fields *** ---");
				for( var fieldIndex = 0; fieldIndex < entities[i].fields.length; fieldIndex++){//boucle fields
					// console.log("--->field fCN=" + entities[i].fields[fieldIndex]._id + " fieldName=" + entities[i].fields[fieldIndex].d["3"] );
					FL.dd.addAttribute(entities[i].d["3"],entities[i].fields[fieldIndex].d["3"] ,entities[i].fields[fieldIndex].d["4"],entities[i].fields[fieldIndex].d["K"],entities[i].fields[fieldIndex].d["M"],entities[i].fields[fieldIndex].d["9"],entities[i].fields[fieldIndex].d["N"]);//("order","shipped","expedition status","Shipped","boolean",null)
					//addAttribute uses a local compressed name. Now we have to force the field compressed name comming from server								
					FL.dd.setFieldCompressedName(entities[i].d["3"],entities[i].fields[fieldIndex].d["3"], entities[i].fields[fieldIndex]._id );
				}
				// console.log("--- *** relations *** ---");
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
					// console.log("--->relation  rCN=" + entities[i].relations[relationIndex]._id );
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
			//When we sync in a serial way we are creating relations before having the other side entity.
			//Synchronizing relations needs 2 steps. Step 1 is done above saving  the auxiliary "withEntityCN" without filling "withEntity"
			// - Step 2 is done below filling "withEntity" from "withEntityCN" (saved in step 1) and setting sync=true at entity level. 
			FL.dd.relationPass2();//goes thru all entities and for all relations of each entity fills withEntity and semantic using withEntityCN
			// FL.dd.displayEntities();
			// console.log("&&&&&&&&&&&&&&&&&&&& end syncLocalDictionary &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
		};
		var getPageNo = function(pagName){ //to be used by savePage and restorePage
			var pageNoObj = {"home":1,"about":2};
			return  pageNoObj[pagName];
		};		
		var _test =	function(){
			console.log("--- test ----");
		};
		//-------- END OF OTHER WRAPPERS ------------------		
		return{
			fl: new flMain(),//FL.server.fl
			fa: null,
			offline:true,
			// getPageNo: function(pagName){ //to be used by savePage and restorePage
			// 	var pageNoObj = {"home":1,"about":2};
			// 	return  pageNoObj[pagName];
			// },		
			connectAdHocUser: function() {//
				var def = $.Deferred();
				var fl = new flMain();//FL.server.fl
				// var fa = new fl.app();
				fl.setTraceClient(2);
				def.fail(function(){
					alert("error on connectAdHocUser ! ");
				});
				console.log("....................................>beginning connectAdHocUser....");
				var connectAdHocUserPromise=_applicationFullCreate({"adminName": "nico@framelink.co", "adminPassWord": "coLas"})
				.then(_login).then(_connect);
				connectAdHocUserPromise.done(function(){console.log(">>>>> connectAdHocUserPromise SUCCESS <<<<<");def.resolve();});
				connectAdHocUserPromise.fail(function(){console.log(">>>>> connectAdHocUserPromise FAILURE <<<<<");def.reject();});
				return def.promise();

				// to generate unique userName
				// var seconds = new Date().getTime() / 1000;
				// var userName = "toto"+ seconds;
			},
			removeAdHocUser: function() {//
				console.log("....................................>beginning removeAdHocUser....with token="+JSON.stringify(FL.login.token));
				var def = $.Deferred();
				var removeAdHocUserPromise=_disconnect().then(_applicationRemove).then(_clientRemove);
				removeAdHocUserPromise.done(function(){console.log(">>>>> removeAdHocUserPromise SUCCESS <<<<<");def.resolve();});
				removeAdHocUserPromise.fail(function(){console.log(">>>>> removeAdHocUserPromise FAILURE <<<<<");def.reject();});
				return def.promise();
			},
			registerAdHocUser: function(userName,password,appDescription) {//
				console.log("....................................>beginning registerAdHocUser....with token="+JSON.stringify(FL.login.token));
				var def = $.Deferred();
				var registerAdHocUser=_applicationFinalize(userName,appDescription).then(function(){_userChangePassWord(password);});
				registerAdHocUser.done(function(){console.log(">>>>> registerAdHocUser SUCCESS <<<<<");def.resolve();});
				registerAdHocUser.fail(function(){console.log(">>>>> registerAdHocUser FAILURE <<<<<");def.reject();});
				return def.promise();
			},
			connectUserToDefaultApp: function(userName,password) {//
				//if userName/password has no application one application is created
				console.log("....................................>beginning connectUserToDefaultApp....with token="+JSON.stringify(FL.login.token));
				var def = $.Deferred();
				var tokenBackup = FL.login.token;//if it fails we will recover the initial token this backup
				var fl = null;
				var fa = null;
				if (FL === null || FL.login === null || FL.login.token === null){//FL.login.token is null
					fl = new flMain();
					fa = new fl.app();
					FL.login.token["fl"] = fl;
					FL.login.token["fa"] = fa;
				}else{//FL.login.token exists
					if(FL.login.token.fl){
						fl = FL.login.token.fl; //new flMain();
					}else{
						fl = new flMain();
					}
					fa = new fl.app();
					FL.login.token["fl"] = fl;
					FL.login.token["fa"] = fa;
				}
				FL.login.token.userName = userName;
				FL.login.token.userPassWord = password;
				var connectUserToDefaultApp=_login().then(_connect);
				connectUserToDefaultApp.done(function(){console.log(">>>>> connectUserToDefaultApp SUCCESS <<<<<");def.resolve();});
				connectUserToDefaultApp.fail(function(err){
					if( err == "no application available"){//we will try to recover the error creating one application
						// alert("Recovering from no application");
						console.log("....................................>connectUserToDefaultApp....Recovering from no application...");
						var applicationCreatePromise = _applicationCreate();
						applicationCreatePromise.done(function(){console.log("....................................>connectUserToDefaultApp applicationCreate DONE");def.resolve();});
						applicationCreatePromise.fail(function(err){console.log("....................................>connectUserToDefaultApp applicationCreate FAIL");def.reject("ERROR:connectUserToDefaultApp ->applicationCreate FAIL err=" + err);});
					}else{
						console.log(">>>>> connectUserToDefaultApp FAILURE <<<<< Error:" + err);
						FL.login.token = tokenBackup;
						def.reject();					
					}
				});
				return def.promise();	
			},
			temporaryRebuildsLocalDictionaryFromServer: function(entities){
				// console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx entities=" + entities + " xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
				console.log("xxxxxxxxx #$%#%#%5 xxxxxxx");
			},		
			syncLocalDictionary: function() {//clears local dictionary and updates it from server dictionary
				console.log("....................................>beginning syncLocalDictionary....with token="+JSON.stringify(FL.login.token));
				var def = $.Deferred();
				//_getFullDictionary->FL.dd.clear()->rebuildsLocalDictionary()
				// temporaryRebuildsLocalDictionaryFromServer("ABC");
				// _test();
				var syncLocalDictionary=_getFullDictionary();
				syncLocalDictionary.done(function(entities){
					console.log(">>>>> syncLocalDictionary SUCCESS <<<<< entities=" + entities);
					FL.dd.clear();
					if(entities){
						console.log(">>>>> syncLocalDictionary -> does temporaryRebuildsLocalDictionaryFromServer(entities)");
						rebuildsLocalDictionaryFromServer(entities);//interprets entity JSON received from server to local dd
						// console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% after rebuildsLocalDictionaryFromServer %%%%%%%%%%%%%%%%%");
						FL.dd.displayEntities();
					}else{
						console.log(">>>>> syncLocalDictionary -> dictionary is empty in server");
					}
					def.resolve();
				});
				syncLocalDictionary.fail(function(err){console.log(">>>>> syncLocalDictionary FAILURE <<<<< "+err);def.reject();});
				return def.promise();
			},
			prepareJSONFromLocalEntity: function(entityName){//prepares JSON with entity and fields to be sent to _addWithFields
				var oEntity = FL.dd.getEntityBySingular(entityName);
				var eCN = null;
				var entityJSON = {"3": oEntity.singular, "4": oEntity.description, 'E': oEntity.plural, fields:[]};
				for (var i=0;i<oEntity.attributes.length;i++){//mounts field array
					var attribute = oEntity.attributes[i];
					// var attrJSON = {"3":attribute.name, "4":attribute.description, 'K': attribute.label, 'M': attribute.type, 'O':false,'N':attribute.enumerableArr};
					var attributeType =attribute.type;
					// if(attributeType == "enumerable")
					//	attributeType = "string";
					var attrJSON = {"3":attribute.name, "4":attribute.description, 'K': attribute.label,'9':attribute.typeUI, 'M': attribute.type, 'O':false,'N':attribute.enumerable};
					//"O" - attribute.repetable
					entityJSON.fields.push(attrJSON);
				}
				return entityJSON;
			},
			syncLocalDictionaryToServer: function(entityName) {//synch table entityName existing in local dictionary with server dict
				// entityName - singular name as it is in local dd
				console.log("....................................>beginning syncLocalDictionaryToServer....with token="+JSON.stringify(FL.login.token));
				var def = $.Deferred();
				var entityJSON = this.prepareJSONFromLocalEntity(entityName);
				// alert("entityJSON = "+JSON.stringify(entityJSON));
				var addWithFields=_addWithFields(entityJSON);
				addWithFields.done(function(){console.log(">>>>> syncLocalDictionaryToServer SUCCESS <<<<<");def.resolve();});
				addWithFields.fail(function(err){console.log(">>>>> syncLocalDictionaryToServer FAILURE <<<<< "+err);def.reject();});
				return def.promise();
			},
			loadAppDataForSignInUser2: function() {//
				console.log("....................................>beginning loadAppDataForSignInUser2....with token="+JSON.stringify(FL.login.token));
				var def = $.Deferred();
				//syncLocalDictionary ->restoreMainMenu  if it succeds -> restorePage
				var loadAppDataForSignInUser=FL.API.syncLocalDictionary()
				.then(_restoreMainMenuStyleANDfontFamily);
				loadAppDataForSignInUser.done(function(menuData){
					//data dictionary was loaded + menu was loaded
					FL.dd.displayEntities();
					var oMenu = FL.login.appToken.menu; //or menuData.oMenu
					var style = FL.login.appToken.style; //or menuData.style
					var fontFamily = FL.login.appToken.fontFamily; //or menuData.fontFamily
					var homePage = null; //or menuData.oMenu
					console.log(">>>>> loadAppDataForSignInUser2 SUCCESS loading menu+style+font <<<<< style=" + style + " font=" + fontFamily + "\nmenu="+ JSON.stringify(oMenu));
					var homePagePromise = _restorePage();
					homePagePromise.done(function(homeHTML){
						var appDescription = FL.login.token.appDescription;
						// FL.login.appToken.homePage = homeHTML;
						FL.login.appToken.homePage = insertMacrosOnHomePage(homeHTML);//only supports:<%= appDescription %>, <%= shortUserName %> and <%= userName %>
						console.log(">>>>> loadAppDataForSignInUser2 FULL SUCCESS <<<<< appToken=" + JSON.stringify(FL.login.appToken) );
						def.resolve(menuData,FL.login.appToken.homePage,appDescription);
					});
					homePagePromise.fail(function(err){console.log(">>>>> loadAppDataForSignInUser2 FAILURE <<<<< error retrieving Home page error="+err);def.reject();});
				});
				loadAppDataForSignInUser.fail(function(err){console.log(">>>>> loadAppDataForSignInUser2 FAILURE <<<<<"+err);def.reject();});
				return def.promise();
			},
			setHomePage: function(homeHTML){
				FL.login.appToken.homePage = homeHTML;
			},
			setMenu: function(oMenu){
				FL.login.appToken.menu = oMenu;
			},
			setStyle: function(style){
				FL.login.appToken.style = style;
			},
			setFontFamily: function(fontFamily){
				FL.login.appToken.fontFamily = fontFamily;
			},			
			saveHomePage: function(homeHTML) {//
				//can be used without parameter (it will use FL.login.appToken.homePage ) or with parameter
				if(homeHTML)
					FL.login.appToken.homePage = homeHTML;
				console.log("....................................>beginning saveHomePage....with appToken="+JSON.stringify(FL.login.appToken));
				var def = $.Deferred();
				var saveHomePage=_saveHomePage();
				saveHomePage.done(function(){console.log(">>>>> saveHomePage SUCCESS <<<<< ");def.resolve();});
				saveHomePage.fail(function(err){console.log(">>>>> saveHomePage FAILURE <<<<<"+err);def.reject();});
				return def.promise();
			},
			save_Menu_style_fontFamily: function() {//
				//it will use FL.login.appToken.oMenu, FL.login.appToken.style, and FL.login.appToken.fontFamily,
				console.log("....................................>beginning save_Menu_style_fontFamily....with appToken="+JSON.stringify(FL.login.appToken));
				var def = $.Deferred();
				var save_Menu_style_fontFamily=_saveMainMenuStyleANDfontFamily();
				save_Menu_style_fontFamily.done(function(){console.log(">>>>> save_Menu_style_fontFamily SUCCESS <<<<< ");def.resolve();});
				save_Menu_style_fontFamily.fail(function(err){console.log(">>>>> save_Menu_style_fontFamily FAILURE <<<<<"+err);def.reject();});
				return def.promise();
			},

			testFunc: function(x) {
				alert("FL.server.test() -->"+x);
			}			
		};
	})();
// });