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
			FL.API.consoleTrace("....................................>beginning _applicationFullCreate....");
			var def = $.Deferred();
			var fl = new flMain();//FL.server.fl
			var fa = new fl.app();
			fl.setTraceClient(2);
			fl.applicationFullCreate(jsonParam, function (err, myApp){
			// fl.applicationFullCreate({"adminName": "joao@framelink.co", "adminPassWord": "oLiVeIrA"}, function (err, myApp){
				// err = "abc";
				if(err){
					FL.login.token = {
						"clientName":null,
						"userName":null,
						"userPassWord":null,
						"domainName":null,
						"dbName":null,
						"fl":fl,
						"fa":fa,
						"appDef":null,
						"appDescription":null,
						"appMenuLevel":null,
						"appRestrictions":null,
						"error":"fl.applicationFullCreate"
					};
					FL.API.consoleTrace("=================================>ERROR ON _applicationFullCreate err="+err);
					def.reject("ERROR ON _applicationFullCreate err="+ err);
				}else{
					// myAppFC=myApp;
					FL.API.consoleTrace("....................................>_applicationFullCreate RESPONSE OK ON _applicationFullCreate....");
					FL.login.token = {
						"clientName":myApp.clientName,
						"userName":myApp.userName,
						"userPassWord":myApp.userPassWord,
						"domainName":myApp.domainName,
						"dbName":myApp.dbName,
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
			FL.API.consoleTrace("....................................>beginning _login....");
			var def = $.Deferred();
			var fl = FL.login.token.fl; //new flMain();
			// var fa = new fl.app();
			if(fl.getsId()!=undefined){//if getsId() has a session number it is connected !. We need to disconnect
				var disconnectPromise = _disconnect();
				disconnectPromise.done(function(){
					fl.login({"username": FL.login.token.userName, "password": FL.login.token.userPassWord, "domain": FL.login.token.domainName}, function (err, data){
						// err = "abc";
						if(err){
							// alert("ERROR ON _login");
							FL.API.consoleTrace("============================>ERROR ON _login");
							FL.login.token.error = "_login";
							def.reject("ERROR ON _login err="+err);
						}else{
							var appDef =data.applications[0];//it has a single application because it was just created
							if(appDef){
								FL.API.consoleTrace("....................................>fl.login RESPONSE OK ON _login....");
								FL.login.token.appDef = appDef;
								FL.login.token.appDescription = appDef.description;
								def.resolve();
							}else{
								FL.login.token.appDef = null;
								FL.login.token.appDescription = null;
								FL.API.consoleTrace("....................................>fl.login RESPONSE OK ON _login but ERROR:no application available....");
								def.reject("no application available");
							}
						}
					});

				});
				disconnectPromise.fail(function(){
					def.reject("disconnect failed inside _login");
				});				
			}else{
				fl.login({"username": FL.login.token.userName, "password": FL.login.token.userPassWord, "domain": FL.login.token.domainName}, function (err, data){
					// err = "abc";
					if(err){
						// alert("ERROR ON _login");
						FL.API.consoleTrace("============================>ERROR ON _login");
						FL.login.token.error = "_login";
						def.reject("ERROR ON _login err="+err);
					}else{
						var appDef =data.applications[0];//it has a single application because it was just created
						if(appDef){
							FL.API.consoleTrace("....................................>fl.login RESPONSE OK ON _login....");
							FL.login.token.appDef = appDef;
							FL.login.token.appDescription = appDef.description;
							def.resolve();
						}else{
							FL.login.token.appDef = null;
							FL.login.token.appDescription = null;
							FL.API.consoleTrace("....................................>fl.login RESPONSE OK ON _login but ERROR:no application available....");
							def.reject("no application available");
						}
					}
				});
			}
			return def.promise();
		};
		var _connect = function() {
			// ex jsonParam = {"username": myApp.userName, "password": myApp.userPassWord, "domain": myApp.domainName}
			FL.API.consoleTrace("....................................>beginning _connect....");
			var def = $.Deferred();
			// var fl = FL.login.token.fl; //new flMain();
			var fa = FL.login.token.fa;//new fl.app();
			fa.connect(FL.login.token.appDef, function(err, data2){
				// err = "abc";
				if(err){
					// alert("ERROR ON _connect");
					FL.API.consoleTrace("=============================>ERROR ON _connect");
					FL.login.token.error = "_connect";
					def.reject(err);
				}else{
					FL.API.consoleTrace("....................................>fa.connect RESPONSE OK ON _connect....");
					FL.login.token.dbName = FL.login.token.appDef.dbName;
					// alert("OK USER CREATED AND CONNECTED  ->"+JSON.stringify(FL.login.token));
					FL.API.consoleTrace("=====================================>_connect: OK USER CONNECTED  ->"+JSON.stringify(FL.login.token));
					def.resolve();
				}
			});
			return def.promise();
		};
		var _disconnect = function(){
			FL.API.consoleTrace("....................................>beginning _disconnect...."+JSON.stringify(FL.login.token));
			var def = $.Deferred();
			var fl = FL.login.token.fl;//new flMain();
			var fa = FL.login.token.fa;//new fl.app();
			// var fa = new fl.app();
			// var fl= token.fl;
			// var fa= token.fa;
			fa.disconnect(function(err,data){
				FL.API.consoleTrace(".............................fa.disconnect ON _disconnect....");
				// err = "abc";
				if(err){
					alert("ERROR ON _disconnect err="+err);
					FL.API.consoleTrace("======================>ERROR ON _disconnect err="+err);
					def.reject(err);
				}else{
					FL.API.consoleTrace("=====================================>_disconnect: OK USER DISCONNECTED  ->token="+JSON.stringify(FL.login.token));
					def.resolve();
				}
			});
			return def.promise();
		};
		var _isUserExist = function(userName){
			FL.API.consoleTrace("....................................>beginning _isUserExist...."+JSON.stringify(FL.login.token));
			var def = $.Deferred();
			var fl = FL.login.token.fl;//new flMain();
			if(!fl){
				fl = new flMain();
				FL.login.token.fl = fl;
			}			
			fl.isUserExist({"adminName": "nico@framelink.co", "adminPassWord":"coLas","userName":userName}, function(err, result){
				FL.API.consoleTrace(".............................fa.disconnect ON _isUserExist....");
				// err = "abc";
				if(err){
					// alert("ERROR ON _isUserExist err="+err);
					FL.API.consoleTrace("======================>ERROR ON _isUserExist err="+err);
					def.reject("ERROR ON _isUserExist err="+ err);
				}else{
					FL.API.consoleTrace("=====================================>_isUserExist: OK ");
					var exists = false;
					if(result)
						exists = true; 
					def.resolve(exists);
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
		var _applicationCreate = function(appDescription){
			var def = $.Deferred();
			var fl = FL.login.token.fl; //new flMain();
			// var fl = new flMain();
			// var fa = FL.login.token.fa;//new fl.app();
			fl.applicationCreate({"adminName": FL.login.token.userName, "adminPassWord": FL.login.token.userPassWord, "domainPrefix": "test",
				"description": appDescription}, function (err, data){
				console.log("............................._applicationCreate....");
				// err = "abc";
				if(err){
					// alert("ERROR ON _applicationCreate err="+err);
					console.log("======================>ERROR ON _applicationCreate err="+err);
					def.reject("ERROR ON _applicationCreate err="+ err);
				}else{
					FL.login.token.appDef = data.d;
					FL.login.token.domainName = data.d['domainName'];
					FL.login.token.appDescription = appDescription;
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
			// fl.clientRemove({"adminName": "nico@framelink.co", "adminPassWord": "coLas", "clientName": FL.login.token.clientName}, function (err, data){
			fl.clientRemove({"adminName": FL.login.token.userName, "adminPassWord": FL.login.token.userPassWord, "clientName": FL.login.token.clientName}, function (err, data){
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
			// fl.applicationFinalize({"adminName":"nico@framelink.co","adminPassWord":"coLas",
			// 		"userName":FL.login.token.userName,"clientName":FL.login.token.clientName,"domainName":FL.login.token.domainName,
			// 		"newUserName":userName,"newClientName":userName,
			// 		"newDescription":FL.login.token.appDescription}, function(err, data){
			fl.applicationFinalize({"adminName":FL.login.token.userName,"adminPassWord":FL.login.token.userPassWord,
					"userName":FL.login.token.userName,"clientName":FL.login.token.clientName,"domainName":FL.login.token.domainName,
					"newUserName":userName,"newClientName":userName,
					"newDescription":FL.login.token.appDescription}, function(err, data){

				FL.API.consoleTrace("............................._applicationFinalize....with:"+userName+"/"+appDescription);
				// err = "abc";
				if(err){
					// alert("ERROR ON _applicationFinalize err="+err);
					FL.API.consoleTrace("======================>ERROR ON _applicationFinalize err="+err);
					var errMsg = "ERROR ON _applicationFinalize err="+ err;
					var posIndex = err.indexOf("already exist");//HACK this means that the error is because the user already exists
					if (posIndex>=0)
						errMsg = "existing user ERROR " + err;
					def.reject(errMsg);
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
					FL.API.consoleTrace("=====================================>_applicationFinalize: OK ->token="+JSON.stringify(FL.login.token));
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
				FL.API.consoleTrace("............................._userChangePassWord....TO "+password);
				// err = "abc";
				if(err){
					alert("ERROR ON _userChangePassWord err="+err);
					FL.API.consoleTrace("======================>ERROR ON _userChangePassWord err="+err);
					def.reject(err);
				}else{
					FL.login.token.userPassWord = password;
					FL.API.consoleTrace("=====================================>_userChangePassWord: OK Password changed to " + password + "  ->token="+JSON.stringify(FL.login.token));
					def.resolve();
				}
			});
			return def.promise();
		};
		var _userChangeNameAndPassWord = function(newUserName, newPassword){ //XXXXXX
			var def = $.Deferred();
			var fl = FL.login.token.fl; //new flMain();
			// var fl = new flMain();
			// var fa = FL.login.token.fa;//new fl.app();
			fl.userChangePassWord({"adminName":"nico@framelink.co", "adminPassWord":"coLas",
					"userName":FL.login.token.userName, "userPassWord":password}, function(err, result){
				FL.API.consoleTrace("............................._userChangePassWord....TO "+password);
				// err = "abc";
				if(err){
					alert("ERROR ON _userChangePassWord err="+err);
					FL.API.consoleTrace("======================>ERROR ON _userChangePassWord err="+err);
					def.reject(err);
				}else{
					FL.login.token.userPassWord = password;
					FL.API.consoleTrace("=====================================>_userChangePassWord: OK Password changed to " + password + "  ->token="+JSON.stringify(FL.login.token));
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
		var _entity_update = function(json){
			var def = $.Deferred();
			var fl = FL.login.token.fl; //new flMain();
			if(!fl){
				// console.log("======================>ERROR ON _getFullDictionary ->no connection");
				return def.reject("ERROR: no connection available");
			}
			var fEnt = new fl.entity();
			fEnt.update(json, function(err ,data){
				console.log(".............................fEnt.update ON _getFullDictionary");
				// err = "abc";
				if(err){
					// alert("ERROR ON _getFullDictionary err="+err);
					console.log("======================>ERROR ON _getFullDictionary err="+err);
					return def.reject(err);
				}else{
					console.log("=====================================>_entity_update: OK ");
					return def.resolve(data);
				}
			});
			return def.promise();
		};		
		var _addWithFields = function(entityJSON){//creates an entity with the fields in server, with one single call
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
		var _userCreate = function(userName,userPassWord,userType){//username is always an email
	// fl.userCreate({"adminName": "nico@framelink.co", "adminPassWord": "coLas", "userName": "toto@gmail.com", "userPassWord": "dodo12345", 
	// 			   "userType": 'user'}, function (err, data){
			var def = $.Deferred();
			var fl = FL.login.token.fl; //new flMain();
			if(!fl){
				fl = new flMain();
			}	
			// fl.userChangePassWord({"adminName":"nico@framelink.co", "adminPassWord":"coLas",
			// 		"userName":FL.login.token.userName, "userPassWord":password}, function(err, result){
			fl.userCreate({"adminName": "nico@framelink.co", "adminPassWord": "coLas", "userName": userName, "userPassWord":userPassWord, 
				"userType": userType}, function (err, data){//userType: user/clientAdmin/admin
				console.log("............................._userCreate....TO "+password);
				// err = "abc";
				if(err){
					// alert("ERROR ON _userCreate err="+err);
					console.log("======================>ERROR ON _userCreate err="+err);
					// test if user already exists..
					if(err ="Name already exists"){
						FL.login.token.userName = userName;
						// FL.login.token.userPassWord = userPassWord;
						FL.login.token.fl = fl;
						console.log("=====================================>_userCreate: OK user already exists  ->token="+JSON.stringify(FL.login.token));
						def.resolve();
					}else{
						def.reject(err);
					}
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
					FL.login.token.userName = userName;
					FL.login.token.userPassWord = userPassWord;
					FL.login.token.fl = fl;
					console.log("=====================================>_userCreate: OK  ->token="+JSON.stringify(FL.login.token));
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
		//-------- END OF OTHER WRAPPERS ------------------		
		
		//-------- Exchage data WRAPPERS ------------------		
		var _findAll = function(ecn){ //entity compressed name
			var def = $.Deferred();
			var fl = FL.login.token.fl; //new flMain();
			var fd = new fl.data();
			// var fl = new flMain();
			// var fa = FL.login.token.fa;//new fl.app();
			fd.findAll(ecn, {"query":{}}, function(err, data){
				FL.API.consoleTrace("............................._findAll...");
				// err = "abc";
				if(err){
					alert("ERROR ON _findAll err="+err);
					FL.API.consoleTrace("======================>ERROR ON _findAll err="+err);
					def.reject(err);
				}else{
					FL.API.consoleTrace("=====================================>_findAll: OK ");
					def.resolve(data);//data is an array
				}
			});
			return def.promise();
		};
		var _insert = function(ecn,arrToSend){ //entity compressed name, arr with records to store
			//format of arrToSend ->[{"d":{"51":"cli1","52":"Lx","53":"Pt"}},{"d":{"51":"cli2","52":"Sintra","53":"Pt"}}]
			var def = $.Deferred();
			var fl = FL.login.token.fl; //new flMain();
			var fd = new fl.data();
			// var fl = new flMain();
			// var fa = FL.login.token.fa;//new fl.app();
			fd.insert(eCN,arrToSend,function(err, data){
				FL.API.consoleTrace("............................._insert...");
				// err = "abc";
				if(err){
					// alert('_insert: err=' + JSON.stringify(err));
					FL.API.consoleTrace("======================>ERROR ON _insert err="+err);
					return def.reject(err);
				}else{
					FL.API.consoleTrace("=====================================>_insert: OK ");
					return def.resolve(data);//data is an array
				}
			});
			return def.promise();
		};
		var _update = function(ecn){ //entity compressed name
			var def = $.Deferred();
			var fl = FL.login.token.fl; //new flMain();
			// var fl = new flMain();
			// var fa = FL.login.token.fa;//new fl.app();
			// fd.update("50", {"query":{"_id":fCN1},"update":{"52":"Faro"}}, function(err, result){..})

			// fl.userChangePassWord({"adminName":"nico@framelink.co", "adminPassWord":"coLas",
			// 		"userName":FL.login.token.userName, "userPassWord":password}, function(err, result){
			// 	FL.API.consoleTrace("............................._userChangePassWord....TO "+password);
			// 	// err = "abc";
			// 	if(err){
			// 		alert("ERROR ON _userChangePassWord err="+err);
			// 		FL.API.consoleTrace("======================>ERROR ON _userChangePassWord err="+err);
			// 		def.reject(err);
			// 	}else{
			// 		FL.login.token.userPassWord = password;
			// 		FL.API.consoleTrace("=====================================>_userChangePassWord: OK Password changed to " + password + "  ->token="+JSON.stringify(FL.login.token));
			// 		def.resolve();
			// 	}
			// });
			return def.promise();
		};
		var convertRecordsTo_arrToSend = function(entityName,recordsArray){//used by saveTable()
			//Converts format: [{"name":cli1,"city":"Lx","country":"Pt"},{..},....] to 
			//	format of arrToSend ->[{"d":{"51":"cli1","52":"Lx","53":"Pt"}},{"d":{"51":"cli2","52":"Sintra","53":"Pt"}}]	
			var retArr = _.map(recordsArray, function(element){
				return convertOneRecordTo_arrToSend(entityName,element);
			});
			return retArr;
		};
		var convertOneRecordTo_arrToSend = function(entityName,recordEl){
			//Converts format: {"name":cli1,"city":"Lx","country":"Pt"} to {"d":{"51":"cli1","52":"Lx","53":"Pt"}} 
			var retObj = {};
			var fCN = null;
			var oEntity =  FL.dd.getEntityBySingular(entityName);
			_.each(recordEl, function(value,key){
				fCN = oEntity.L2C[key];//with key ( a logical name) we get the compressed name
				retObj[fCN] = value;
			});
			return {d:retObj,r:[]};
		};
		var _test =	function(){
			console.log("--- test ----");
		};
		//-------- END OF OTHER WRAPPERS ------------------		
		return{
			fl: new flMain(),//FL.server.fl
			fa: null,
			data:{},
			offline:true,
			trace:true,
			consoleTrace: function(text) {
				if(FL.API.trace)
					console.log(text);
			},
			// getPageNo: function(pagName){ //to be used by savePage and restorePage
			// 	var pageNoObj = {"home":1,"about":2};
			// 	return  pageNoObj[pagName];
			// },		
			prepareTrialApp: function() {///create adHoc client, create adHoc user, create adHoc app 
				var def = $.Deferred();
				// FL.API.trace = false;

				var fl = new flMain();//FL.server.fl
				// var fa = new fl.app();
				fl.setTraceClient(2);
				// def.fail(function(){
				// 	alert("error on connectAdHocUser ! ");
				// });
				FL.API.consoleTrace("....................................>beginning prepareTrialApp....");
				var prepareTrialAppPromise=_applicationFullCreate({"adminName": "nico@framelink.co", "adminPassWord": "coLas"})
				.then(_login).then(_connect);
				prepareTrialAppPromise.done(function(){FL.API.consoleTrace(">>>>> prepareTrialAppPromise SUCCESS <<<<<");def.resolve();});
				prepareTrialAppPromise.fail(function(err){FL.API.consoleTrace(">>>>> prepareTrialAppPromise FAILURE <<<<<");def.reject(err);});
				return def.promise();

				// to generate unique userName
				// var seconds = new Date().getTime() / 1000;
				// var userName = "toto"+ seconds;
			},
			removeTrialApp: function() {//remove client, remove user, remove app 
				FL.API.consoleTrace("....................................>beginning removeTrialApp....with token="+JSON.stringify(FL.login.token));
				var def = $.Deferred();
				var removeTrialAppPromise=_disconnect().then(_applicationRemove).then(_clientRemove);
				removeTrialAppPromise.done(function(){FL.API.consoleTrace(">>>>> removeTrialApp SUCCESS <<<<<");def.resolve();});
				removeTrialAppPromise.fail(function(){FL.API.consoleTrace(">>>>> removeTrialApp FAILURE <<<<<");def.reject();});
				return def.promise();
			},
			registerTrialApp: function(userName,password,appDescription) {//change adHoc client name, user name, passordd and appDescrition 
				FL.API.consoleTrace("....................................>beginning registerTrialApp....with token="+JSON.stringify(FL.login.token));
				var def = $.Deferred();
				// var registerTrialApp=_applicationFinalize(userName,appDescription).then(function(){_userChangePassWord(password);});
				var registerTrialApp=_applicationFinalize(userName,appDescription).then(function(){return _userChangePassWord(password);});
			
				registerTrialApp.done(function(){FL.API.consoleTrace(">>>>> registerTrialApp SUCCESS <<<<<");def.resolve();});
				registerTrialApp.fail(function(err){FL.API.consoleTrace(">>>>> registerTrialApp FAILURE <<<<< "+err);def.reject(err);});
				return def.promise();
			},
			removeUserAndApps: function(userName,password) {//remove client, remove user, remove app 
				console.log("....................................>beginning removeUserAndApps....with token="+JSON.stringify(FL.login.token));
				var def = $.Deferred();
				FL.login.token.userName = userName;
				FL.login.token.userPassWord = password;
				FL.login.token.domainName ="xxx";
				var removeUserAndAppsPromise=_login().then(_applicationRemove).then(_clientRemove);
				removeUserAndAppsPromise.done(function(){console.log(">>>>> removeUserAndApps SUCCESS <<<<<");def.resolve();});
				removeUserAndAppsPromise.fail(function(){console.log(">>>>> removeUserAndApps FAILURE <<<<<");def.reject();});
				return def.promise();
			},
			createUserAndDefaultApp: function(userName,userPassWord,appDescription) {///creates a client, create user and create first app 
				var def = $.Deferred();
				FL.API.trace = true;
				FL.API.consoleTrace("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
				var fl = new flMain();//FL.server.fl
				// var fa = new fl.app();
				fl.setTraceClient(2);
				// def.fail(function(){
				// 	alert("error on connectAdHocUser ! ");
				// });
				if(!appDescription)
					appDescription = "my App";
				FL.API.consoleTrace("....................................>beginning createUserAndDefaultApp....");
				var createUserAndDefaultAppPromise=_applicationFullCreate({"adminName": "nico@framelink.co", "adminPassWord": "coLas", 
					userName:userName, userPassWord:userPassWord, appDescription:appDescription})
					.then(_login).then(_connect);
				createUserAndDefaultAppPromise.done(function(){
					FL.API.consoleTrace(">>>>> createUserAndDefaultAppPromise SUCCESS <<<<<");
					FL.API.consoleTrace("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
					FL.API.trace = false;
					def.resolve();
				});
				createUserAndDefaultAppPromise.fail(function(err){
					FL.API.consoleTrace(">>>>> createUserAndDefaultAppPromise FAILURE <<<<<");
					FL.API.consoleTrace("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
					FL.API.trace = false;
					def.reject(err);
				});
				return def.promise();

				// to generate unique userName
				// var seconds = new Date().getTime() / 1000;
				// var userName = "toto"+ seconds;
			},	
			disconnect: function() {//change adHoc client name, user name, passordd and appDescrition 
				FL.API.consoleTrace("....................................>beginning disconnect....current token="+JSON.stringify(FL.login.token));
				var def = $.Deferred();
				var disconnect=_disconnect();
				disconnect.done(function(){FL.API.consoleTrace(">>>>> disconnect SUCCESS <<<<<");FL.login.token = null;def.resolve();});
				disconnect.fail(function(err){FL.API.consoleTrace(">>>>> disconnect FAILURE <<<<< "+err);def.reject(err);});
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
						var applicationCreatePromise = _applicationCreate("automatic sample");
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
			isUserExist: function(userName){
				var def = $.Deferred();
				var isUserExistPromise=_isUserExist(userName);
				// FL.API.trace = false;
				FL.API.consoleTrace("....................................>beginning isUserExist....with token="+JSON.stringify(FL.login.token));
				console.log("....................................>beginning isUserExist....with token="+JSON.stringify(FL.login.token));
				isUserExistPromise.done(function(exists){
					// console.log(">>>>> isUserExist SUCCESS <<<<< exist="+exists);
					FL.API.consoleTrace(">>>>> isUserExist SUCCESS <<<<< exist="+exists);
					def.resolve(exists);
				});
				isUserExistPromise.fail(function(err){FL.API.consoleTrace(">>>>> isUserExist FAILURE <<<<<");def.reject(err);});
				// FL.API.trace = true;
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
			removeTable: function(entityName) {//remove existing or unexisting table - after this we are sure that table does not exist
				//assumes a login to an application exists
				console.log("....................................>beginning removeTable....with appToken="+JSON.stringify(FL.login.appToken));
				var def = $.Deferred();
				var ecn = FL.dd.getCEntity(entityName);
				if(ecn === null)
					return def.resolve();
				var removeTablePromise =_entity_update({query:{"_id":ecn},update:{$set:{"3":'$'+ecn} } });
				removeTablePromise.then(function(){def.resolve();},function(err){def.reject(err);});
				// removeTablePromise.then(def.makeNodeResolver());
				return def.promise();
			},
			saveTable: function(entityName,recordsArray) {//creates a table (overriding any existing one) and saves a set of records in it
				//assumes a login to an application exists
				//recordsArray [{"number":12,"code":"abc"},....]
				console.log("....................................>beginning saveTable....with appToken="+JSON.stringify(FL.login.appToken));
				var def = $.Deferred();
				var ecn = FL.dd.getCEntity(entityName);
				//begins by removeTable 
				var remove_synch = FL.API.removeTable(entityName);//.then(FL.API.syncLocalDictionaryToServer(entityName));
				remove_synch.done(function(){
					FL.API.consoleTrace(">>>>>saveTable --> remove and synch SUCCESS <<<<<");
					console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
					var arrToSend = convertRecordsTo_arrToSend(entityName,recordsArray);
					console.log("saveTable --->"+JSON.stringify(arrToSend));
					console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
					return def.resolve();
				});
				remove_synch.fail(function(err){
					FL.API.consoleTrace(">>>>>saveTable --> remove and synch FAILURE <<<<< "+err);
					return def.reject(err);
				});
				return def.promise();

				//begins by synchronizing entityName to server to get the correct eCN and fCN


				//begins by removing the table and then recreates a non existing table and then insert records
				

				//format of arrToSend ->[{"d":{"51":"cli1","52":"Lx","53":"Pt"}},{"d":{"51":"cli2","52":"Sintra","53":"Pt"}}]	
						// var saveTablePromise =removeTable(entityName).then(syncLocalDictionaryToServer(entityName))
						// 	.then(_insert(ecn,arrToSend));

						// removeTablePromise.done(function(){
						// 	console.log(">>>>> saveTable removeTable was done <<<<< ");

						// 	//dataArray has a format: [{"_id":1,"d":{"53":"line 1 content of field1","54":"line 1 content of field2"},"v":0},
						// 	//							{"_id":2,"d":{"53":"line 2 content of field1","54":"line 2 content of field2"},"v":0}...,]
						// 	if(exist){
						// 		// var promiseExistence = FL.API.removeTable(entityName).then(createTable());//we remove table
						// 		// promiseExistence.done(function(){
						// 		// 	def.resolve();
						// 		// });

						// 	}else{
						// 		FL.API.createTable(entityName);
						// 		def.resolve();
						// 	}
						// 	//[{"_id":123234234,"id":1,produto":"High","nome":"Rota dos Numeros, Lda","marca":"Rota dos Numeros","morada":"Av Ceuta, 21 B","cod postal":"2700-188","localidade":"Amadora","telefone":"21 4945431 ","email":"rota.dos.numeros@sapo.pt ","id":1,"_id":"545b4f9afa2b1a3233bb6781"},
						// 	def.resolve(arrLocallyTranslated);
						// });
						// saveTablePromise.fail(function(err){console.log(">>>>> saveTable FAILURE <<<<<"+err);def.reject(err);});
						// return def.promise();
			},	
			loadTable: function(entityName) {//returns the full content of a table from server
				//assumes a login to an application exists
				console.log("....................................>beginning loadTable....with appToken="+JSON.stringify(FL.login.appToken));
				var def = $.Deferred();
				var ecn = FL.dd.getCEntity(entityName);
				var loadTable=_findAll(ecn);
				//fd.findAll(ecn, {"query":{}}, function(err, data){..})
				loadTable.done(function(dataArray){
					console.log(">>>>> loadTable SUCCESS <<<<< ");
					//dataArray has a format: [{"_id":1,"d":{"53":"line 1 content of field1","54":"line 1 content of field2"},"v":0},
					//							{"_id":2,"d":{"53":"line 2 content of field1","54":"line 2 content of field2"},"v":0}...,]
					var arrLocallyTranslated = FL.server.convertArrC2LForEntity(entityName,dataArray);//dataArray =>[{"_id":123,d:{},r:[]},{"_id":124,d:{},r:[]},....{"_id":125,d:{},r:[]}]
					//arrLocallyTranslated has the format:
					// alert("arrLocallyTranslated="+arrLocallyTranslated);
					//[{"_id":123234234,"id":1,produto":"High","nome":"Rota dos Numeros, Lda","marca":"Rota dos Numeros","morada":"Av Ceuta, 21 B","cod postal":"2700-188","localidade":"Amadora","telefone":"21 4945431 ","email":"rota.dos.numeros@sapo.pt ","id":1,"_id":"545b4f9afa2b1a3233bb6781"},
					def.resolve(arrLocallyTranslated);
				});
				loadTable.fail(function(err){console.log(">>>>> loadTable FAILURE <<<<<"+err);def.reject(err);});
				return def.promise();
			},
			createHistoMails_ifNotExisting: function() {//checks if histoMails exist. If not creates it
				var eCN = FL.dd.getCEntity("_histoMail");
				// eCN = 23;
				var def = $.Deferred();
				FL.API.trace = true;
				FL.API.consoleTrace(">>>>>> createHistoMails_ifNotExisting eCN="+eCN);
				if(eCN === null){ // does not exist we should create it
					FL.API.consoleTrace("....................................>beginning createHistoMails_ifNotExisting....with token="+JSON.stringify(FL.login.token));
					FL.dd.createEntity("_histoMail","mails histo entity");//update local dict
					FL.dd.addAttribute("_histoMail",'msg','events log','mail event','string','textbox',null);
					FL.dd.displayEntities();
					var synch=FL.API.syncLocalDictionaryToServer('_histoMail');
					synch.done(function(){
						FL.API.consoleTrace(">>>>>createHistoMails_ifNotExisting syncLocalDictionaryToServer SUCCESS <<<<<");
						def.resolve();
					});
					synch.fail(function(err){
						FL.API.consoleTrace(">>>>>createHistoMails_ifNotExisting syncLocalDictionaryToServer FAILURE <<<<< "+err);
						def.reject(err);
					});
				}else{
					FL.API.consoleTrace(">>>>>createHistoMails_ifNotExisting _histoMail exists !");
					def.resolve();//it exists already
				}
				return def.promise();
			},
			customTable: function(entityProps) {
				// Ex FL.API.customTable({singular:"shipment"});
				//uses --> FL.dd.createEntity("sales rep","employee responsable for sales");
				var def = $.Deferred();
				var singularDefault = FL.dd.nextEntityBeginningBy("_unNamed");
				entityProps = _.extend( {singular:singularDefault,description:null},entityProps);
				if(!entityProps.description)
					entityProps.description = entityProps.singular + "'s description";
				FL.dd.createEntity(entityProps.singular,entityProps.description);
				var singular = entityProps.singular;
				var oEntity = FL.dd.entities[entityProps.singular];

				// FL.API.data[entityName]={
				// 	name:entityName,tfunc:function(){console.log("--> "+this.name);}
				// };

				// it works !
				// FL.API.data[singular]={
				// 	name :singular,
				// 	get:function(prop){
				// 		var oEntity = FL.dd.entities[singular];
				// 		return oEntity[prop];
				// 	},
				// 	set:function(prop,value){
				// 		var oEntity = FL.dd.entities[singular];
				// 		oEntity[prop] = value;
				// 	}
				// };

				function entity(entityProps){			
					this.name = entityProps.singular;
					this.description = entityProps.description;
					var oEntity = FL.dd.entities[singular];
					this.eCN = oEntity.csingular;
				};
				entity.prototype.get = function(prop){
					var oEntity = FL.dd.entities[singular];
					return oEntity[prop];
				};
				entity.prototype.set = function(prop,value){
					var oEntity = FL.dd.entities[singular];
					oEntity[prop] = value;
				};				
				FL.API.data[singular]= new entity(entityProps);

				return def.resolve();
				// def.reject();//to test
				return def.promise();
				// alert("FL.server.test() -->"+x);
			},
			testFunc: function(x) {
				alert("FL.server.test() -->"+x);
			}
		};
	})();
// });