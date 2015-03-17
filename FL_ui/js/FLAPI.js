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
		var tokenClear = function(){
			token = {
				"clientName":null,
				"userName":null,
				"userPassWord":null,
				"domainName":null,
				"dbName":null,
				// "fl":fl, //to maintain from start to end
				// "fa":fa,
				"appDef":null,
				"appDescription":null,
				"appMenuLevel":null,
				"appRestrictions":null,
				"error":null
			};
			return token;
		};
		//-------- PROMISE WRAPPERS ------------------
		var	_applicationFullCreate = function(jsonParam) {
			//ex _applicationFullCreate({"adminName": "nico@framelink.co", "adminPassWord": "coLas"}, function (err, myApp){
			console.log("....................................>beginning _applicationFullCreate....");
			var def = $.Deferred();
			var fl = new flMain();//FL.server.fl
			var fa = new fl.app();
			// fl.setTraceClient(2);
			fl.applicationFullCreate(jsonParam, function (err, myApp){
			// fl.applicationFullCreate({"adminName": "joao@framelink.co", "adminPassWord": "oLiVeIrA"}, function (err, myApp){
				// err = "abc";
				if(err){
					FL.login.token = tokenClear();
					// FL.login.token = {
					// 	"clientName":null,
					// 	"userName":null,
					// 	"userPassWord":null,
					// 	"domainName":null,
					// 	"dbName":null,
					// 	// "fl":fl, //to maintain from start to end
					// 	// "fa":fa,
					// 	"appDef":null,
					// 	"appDescription":null,
					// 	"appMenuLevel":null,
					// 	"appRestrictions":null,
					// 	"error":null						
					// };
					console.log("=================================>ERROR ON _applicationFullCreate err="+err);
					def.reject("ERROR ON _applicationFullCreate err="+ err);
				}else{
					// myAppFC=myApp;
					console.log("....................................>_applicationFullCreate RESPONSE OK ON _applicationFullCreate....");
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
			console.log("....................................>beginning _login....");
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

				});
				disconnectPromise.fail(function(){
					def.reject("disconnect failed inside _login");
				});				
			}else{
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
			}
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
					FL.login.token.dbName = FL.login.token.appDef.dbName;
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
		var _isUserExist = function(userName){
			console.log("....................................>beginning _isUserExist...."+JSON.stringify(FL.login.token));
			var def = $.Deferred();
			var fl = FL.login.token.fl;//new flMain();
			if(!fl){
				fl = new flMain();
				FL.login.token.fl = fl;
			}			
			fl.isUserExist({"adminName": "nico@framelink.co", "adminPassWord":"coLas","userName":userName}, function(err, result){
				console.log(".............................fa.isUserExist ON _isUserExist....");
				// err = "abc";
				if(err){
					// alert("ERROR ON _isUserExist err="+err);
					console.log("======================>ERROR ON _isUserExist err="+err);
					def.reject("ERROR ON _isUserExist err="+ err);
				}else{
					console.log("=====================================>_isUserExist: OK ");
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
			fl.clientRemove({"adminName": "nico@framelink.co", "adminPassWord": "coLas", "clientName": FL.login.token.clientName}, function (err, data){
			// fl.clientRemove({"adminName": FL.login.token.userName, "adminPassWord": FL.login.token.userPassWord, "clientName": FL.login.token.clientName}, function (err, data){
				console.log("............................._clientRemove....");
				// err = "abc";
				if(err){
					alert("ERROR ON _clientRemove err="+err);
					console.log("======================>ERROR ON _clientRemove err="+err);
					def.reject(err);
				}else{
					var oldUserName = FL.login.token.userName;
					FL.login.token = tokenClear();
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

				console.log("............................._applicationFinalize....with:"+userName+"/"+appDescription);
				// err = "abc";
				if(err){
					// alert("ERROR ON _applicationFinalize err="+err);
					console.log("======================>ERROR ON _applicationFinalize err="+err);
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
		var _userChangeNameAndPassWord = function(newUserName, newPassword){ //XXXXXX
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
		var _fieldUpdate = function(obj){//updates a field with _id=field_id defined inside object obj with all field definitions
			//obj - {_id:field_id,name_3:x1,description_4:x2,label_K:x3,type_M:x4,typeUI_9:x5,enumerable_N:x6} - all keys must be supplied
			var def = $.Deferred();
			var fl = FL.login.token.fl; //new flMain();
			// var fl = new flMain();
			// var fa = FL.login.token.fa;//new fl.app();
			var fField = new fl.field();
			var field_id = obj._id;
			fField.update({"query":{"_id":field_id},"update":{"3":obj.name_3,"4":obj.description_4,"K":obj.label_K,"M":obj.type_M,"9":obj.typeUI_9,"N":obj.enumerable_N,"O":obj.Nico_O }}, function (err, data){
				console.log("............................._fieldUpdate....");
				// err = "abc";
				if(err){
					// alert("ERROR ON _addWithFields err="+err);
					console.log("======================>ERROR ON _fieldUpdate err="+err);
					def.reject("ERROR: _fieldUpdate err="+err);
				}else{
					console.log("=====================================>_fieldUpdate: OK ");
					def.resolve(data);
				}
			});
			return def.promise();
		};
		var _fieldUpdateMultiple = function(arrOf_Obj){ //updates multiple fields
			var def = $.Deferred();
			var promise = FL.API.queueManager("_fieldUpdate","ignored",arrOf_Obj);
			promise.done(function(result){
				return def.resolve(arrOf_IdToRemove.length);
			});
			promise.fail(function(err){
				return def.reject(err);
			});
			return def.promise();		
		};
		var _userCreate = function(userName,userPassWord,userType){//username is always an email
	// fl.userCreate({"adminName": "nico@framelink.co", "adminPassWord": "coLas", "userName": "toto@gmail.com", "userPassWord": "dodo12345", 
	//		"userType": 'user'}, function (err, data){
			var def = $.Deferred();
			var fl = FL.login.token.fl; //new flMain();
			if(!fl){
				fl = new flMain();
			}
			// fl.userChangePassWord({"adminName":"nico@framelink.co", "adminPassWord":"coLas",
			//	"userName":FL.login.token.userName, "userPassWord":password}, function(err, result){
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
			console.log("rebuildsLocalDictionaryFromServer xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx entities=" + entities + " xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
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
		var _findAll = function(ecn,query,projection){ //entity compressed name
			var def = $.Deferred();
			var fl = FL.login.token.fl; //new flMain();
			var fd = new fl.data();
			// var fl = new flMain();
			// var fa = FL.login.token.fa;//new fl.app();
			var findAllParam={};
			if(!query)
				findAllParam.query ={};
			else
				findAllParam.query =query;
			if(projection)
				findAllParam.projection =projection;


			// fd.findAll(ecn, {"query":query}, function(err, data){
			fd.findAll(ecn, findAllParam, function(err, data){
			// fd.findAll(ecn, {"query":query,"projection":projection}, function(err, data){
				console.log("............................._findAll...");
				// err = "abc";
				if(err){
					alert("ERROR ON _findAll err="+err);
					console.log("======================>ERROR ON _findAll err="+err);
					def.reject(err);
				}else{
					console.log("=====================================>_findAll: OK ");
					def.resolve(data);//data is an array
				}
			});
			return def.promise();
		};
		var _insert = function(eCN,arrToSend){ //entity compressed name, arr with records to store
			//format of arrToSend ->[{"d":{"51":"cli1","52":"Lx","53":"Pt"}},{"d":{"51":"cli2","52":"Sintra","53":"Pt"}}]
			var def = $.Deferred();
			var fl = FL.login.token.fl; //new flMain();
			var fd = new fl.data();
			// var fl = new flMain();
			// var fa = FL.login.token.fa;//new fl.app();
			fd.insert(eCN,arrToSend,function(err, data){
				console.log("............................._insert...");
				// err = "abc";
				if(err){
					// alert('_insert: err=' + JSON.stringify(err));
					console.log("======================>ERROR ON _insert err="+err);
					return def.reject(err);
				}else{
					console.log("=====================================>_insert: OK ");
					return def.resolve(data);//data is an array
				}
			});
			return def.promise();
		};
		var _update = function(ecn,_idValue,jsonToSend){ //update a single row within table ecn entity compressed name, _idValue and jsonToSend (a single record)
			//	format of jsonToSend ->{"51":"cli1","52":"Lx","53":"Pt"}
			var def = $.Deferred();
			var fl = FL.login.token.fl; //new flMain();
			var fd = new fl.data();

			fd.update(ecn, {"query":{"_id":_idValue},"update":jsonToSend, "options":{"upsert":true}}, function(err, result){
				console.log("............................._update....i_id="+_idValue+" To ->"+JSON.stringify(jsonToSend));
				if(err){
					console.log("======================>ERROR ON _update err="+err);
					def.reject(err);
				}else{
					console.log("=====================================>_update: OK " + result.count + " records were updated.");
					def.resolve(result.count);
				}
			});
			return def.promise();
		};
		var _remove = function(ecn,_id){ //remove  a single row within table ecn (entity compressed name)
			var def = $.Deferred();
			var fl = FL.login.token.fl; //new flMain();
			var fd = new fl.data();
			fd.remove(ecn, {"query":{_id:_id}}, function(err, result){
				// console.log("............................._remove....i_id="+_id);
				if(err){
					console.log("======================>ERROR ON _remove err="+err);
					def.reject(err);
				}else{
					console.log("=====================================>_remove: OK ");
					def.resolve(result);
				}
            });
			return def.promise();
		};
		var X_removeMultiple = function(ecn,arrOf_IdToRemove){ //remove  a single row within table ecn (entity compressed name)
			var def = $.Deferred();
			var numberOfEl = arrOf_IdToRemove.length;
			var counter = 0;
            _.each(arrOf_IdToRemove, function (element) {
				var promise=_remove(ecn,element);
				promise.done(function(result){
					counter +=result;
					if(numberOfEl--=== 0)
						return def.resolve(counter);
				});
				promise.fail(function(err){
					return def.reject(err);
				});
            });
		};
		var _removeMultiple = function(ecn,arrOf_IdToRemove){ //remove  a single row within table ecn (entity compressed name)
			var def = $.Deferred();
			var promise = FL.API.queueManager("_remove",ecn,arrOf_IdToRemove);
			promise.done(function(result){
				return def.resolve(arrOf_IdToRemove.length);
			});
			promise.fail(function(err){
				return def.reject(err);
			});
			return def.promise();
		};
		var _dummy = function(ecn,_id){ //remove  a single row within table ecn (entity compressed name)
			var def = $.Deferred();
			setTimeout(function(){
				console.log("***********************************************************************************************");
				console.log("**************************  _dummy-------------------->execution="+_id);
				console.log("***********************************************************************************************");
				def.resolve(1);
				// def.reject("dummy failure !");
			},600);
			return def.promise();
		};
		var queueManager = function(funcName,param1,arrToDispatch){ //call a function each 200 milisecondsremove  a single row within table ecn (entity compressed name)
			// calls the same asynchronous function several times assuring that after the first call all subsequent calls are done after a successfull completion of the previous call.
			//   funcName = name of the function to be called...it must be in the list: _dummy,_remove,_fieldUpdate
			//	 param1 - a parameter constant between calls
			//   arrToDispatch - array where each element is passed in each call (one at a time)
			//		for "_remove" - a list of _ids to remove
			//		for "_fieldUpdate" - a list of objects. Each object has {name_3:x1,description_4:x2,label_K:x3,type_M:x4,typeUI_9:x5,enumerable_N:x6}
			//		for "updateAttribute" - runs FL.dd.updateAttribute() for multiple attributes. Each element of arrayToDispatch is an object
			//			with {singular:xSingular,oldname:xOldname,name_3:x1,description_4:x2,label_K:x3,type_M:x4,typeUI_9:x5,enumerable_N:x6}
			//			example: var promise = FL.API.queueManager("updateAttribute","dummy",bufferChangeObjs);
			// returns a promise  valid if all calls were successfully done, or a promise fillure  if any of the calls failled
			//    Parameters to adjust:
			//			delay = time to wait between tries
			//			maxRefused = just in case fuse.... a high number to prevent infinite loops
			
			// TESTING
			// var promise = FL.API.queueManager("_dummy","abc",[230,231,232,233]);
			// promise.done(function(result){
			// 	alert("queueManager - PROMISE DONE!!!");
			// });
			// promise.fail(function(result){
			// 	alert("queueManager - PROMISE FAIL!!!");
			// });
			var def = $.Deferred();

			// var param1=param1;
			
			var numberOfEl = arrToDispatch.length;
			var delay = 200;//time between tries to call promise
			var counter = 0;//number of well succeded calls
			var refusedCounter = 0;//number of refused calls
			var maxRefused = 100;//limit of refused - more than this limit =>error
			var next = true;
			var intervalId = setInterval(function () {
				if (next){
					if(counter<numberOfEl){
						next = false;
						promise = null;
						if (funcName == "_dummy")
							promise=_dummy(param1,arrToDispatch[counter]);
						else if(funcName == "_remove")
							promise=_remove(param1,arrToDispatch[counter]);
						else if(funcName == "_fieldUpdate")
							promise=_fieldUpdate(arrToDispatch[counter]);//no constant parameter between calls
						else if(funcName == "updateAttribute"){
							var changeObj = arrToDispatch[counter];
							promise=FL.dd.updateAttribute(changeObj.singular,changeObj.oldname,changeObj);
						}else{
							console.log("***************************  execution=rejected !!! ->Invalid funcName="+funcName);
							clearInterval(intervalId);
							return def.reject("function name ->"+funcName+" is INVALID.");
						}
						promise.done(function(result){
							counter +=1;
							if(counter == numberOfEl){
								clearInterval(intervalId);
								return def.resolve(counter);
							}
							next = true;
						});
						promise.fail(function(err){
							console.log("***************************  execution=fail !!! ->"+funcName+" failure. Err="+err);
							clearInterval(intervalId);
							return def.reject("Error in "+funcName+" err="+err);
						});
					}
				}else{
					if(refusedCounter>maxRefused){
						clearInterval(intervalId);
						alert("queueManager ERROR more than " + maxRefused + " =>too many refusals.")
						return def.reject("Refusals max exceeded !");		
					}
					console.log("***********************************************************************************************");
					console.log("***************************  step execution=refused -> " + counter + " --->"+arrToDispatch[counter]);
					console.log("***********************************************************************************************");
					refusedCounter++;
				}
			}, delay);
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
			recordEl = _.omit(recordEl, "_id"); 
			_.each(recordEl, function(value,key){
				fCN = oEntity.L2C[key];//with key ( a logical name) we get the compressed name
				retObj[fCN] = value;
			});
			return {d:retObj,r:[]};
		};
		var _mandrillRejectListForSender = function(senderEmail){ //update a single row within table ecn entity compressed name, _idValue and jsonToSend (a single record)
			//	format of jsonToSend ->{"51":"cli1","52":"Lx","53":"Pt"}
			var def = $.Deferred();
			var fl = FL.login.token.fl; //new flMain();
			// var fd = new fl.data();
			var md = new fl.mandrill();
			md.rejectList( {include_expired: true, sender: senderEmail}, function(err, data){
				console.log("............................._mandrillRejectListForSender....result="+JSON.stringify(data));
				if(err){
					console.log("======================>ERROR ON _mandrillRejectListForSender err="+err);
					def.reject(err);
				}else{
					console.log("=====================================>_mandrillRejectListForSender: OK ");
					def.resolve(data);
				}
			});
			return def.promise();
		};
		var _mandrillDeleteFromReject = function(arrayOfEmails){ //update a single row within table ecn entity compressed name, _idValue and jsonToSend (a single record)
			//	format of jsonToSend ->{"51":"cli1","52":"Lx","53":"Pt"}
			var def = $.Deferred();
			var fl = FL.login.token.fl; //new flMain();
			// var fd = new fl.data();
			var md = new fl.mandrill();
			md.rejectDelete( {email:arrayOfEmails[0]}, function(err, data){
				console.log("............................._mandrillDeleteFromReject....->"+JSON.stringify(data));
				if(err){
					console.log("======================>ERROR ON _mandrillDeleteFromReject err="+err);
					def.reject(err);
				}else{
					console.log("=====================================>_mandrillDeleteFromReject: OK deleted=" + data.deleted );
					console.log("............................._mandrillDeleteFromReject...SUCCESS .->"+JSON.stringify(data));
					def.resolve();
				}
			});
			return def.promise();
		};
		var _test =	function(){
			console.log("--- test ----");
		};
		//-------- END OF OTHER WRAPPERS ------------------		
		return{
			xx: "test",
			fl: new flMain(),//FL.server.fl
			fa: null,
			data:{},
			offline:true,
			trace:true,//to be removed
			debug:true,
			// getPageNo: function(pagName){ //to be used by savePage and restorePage
			//	var pageNoObj = {"home":1,"about":2};
			//	return  pageNoObj[pagName];
			// },
			clearServerToken: function(){
				FL.login.token = tokenClear();
			},
			queueManager:function(funcName,param1,arrToDispatch){
				return queueManager(funcName,param1,arrToDispatch);
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
			prepareTrialApp: function() {///create adHoc client, create adHoc user, create adHoc app 
				var def = $.Deferred();
				var fl = new flMain();//FL.server.fl
				console.log("....................................>beginning prepareTrialApp....");
				var prepareTrialAppPromise=_applicationFullCreate({"adminName": "nico@framelink.co", "adminPassWord": "coLas"})
				.then(_login).then(_connect);
				prepareTrialAppPromise.done(function(){console.log(">>>>> prepareTrialAppPromise SUCCESS <<<<<");def.resolve();});
				prepareTrialAppPromise.fail(function(err){console.log(">>>>> prepareTrialAppPromise FAILURE <<<<<");def.reject(err);});
				return def.promise();

				// to generate unique userName
				// var seconds = new Date().getTime() / 1000;
				// var userName = "toto"+ seconds;
			},
			removeClientWithOneApp: function() {//remove client, remove user, remove app - only works for subscribers with a single app
				console.log("....................................>beginning removeClientWithOneApp....with token="+JSON.stringify(FL.login.token));
				var def = $.Deferred();
				var removeClientWithOneAppPromise=_disconnect().then(_applicationRemove).then(_clientRemove);
				removeClientWithOneAppPromise.done(function(){console.log(">>>>> removeClientWithOneApp SUCCESS <<<<<");def.resolve();});
				removeClientWithOneAppPromise.fail(function(){console.log(">>>>> removeClientWithOneApp FAILURE <<<<<");def.reject();});
				return def.promise();
			},
			removeTrialApp: function() {//remove client, remove user, remove app - only works for subscribers with a single app
				console.log("....................................>beginning removeTrialApp....with token="+JSON.stringify(FL.login.token));
				var def = $.Deferred();
				var removeTrialAppPromise=_disconnect().then(_applicationRemove).then(_clientRemove);
				removeTrialAppPromise.done(function(){console.log(">>>>> removeTrialApp SUCCESS <<<<<");def.resolve();});
				removeTrialAppPromise.fail(function(){console.log(">>>>> removeTrialApp FAILURE <<<<<");def.reject();});
				return def.promise();
			},
			registerTrialApp: function(userName,password,appDescription) {//change adHoc client name, user name, passordd and appDescrition 
				console.log("....................................>beginning registerTrialApp....with token="+JSON.stringify(FL.login.token));
				var def = $.Deferred();
				// var registerTrialApp=_applicationFinalize(userName,appDescription).then(function(){_userChangePassWord(password);});
				var registerTrialApp=_applicationFinalize(userName,appDescription).then(function(){return _userChangePassWord(password);});
			
				registerTrialApp.done(function(){console.log(">>>>> registerTrialApp SUCCESS <<<<<");def.resolve();});
				registerTrialApp.fail(function(err){console.log(">>>>> registerTrialApp FAILURE <<<<< "+err);def.reject(err);});
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
				console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
				var fl = new flMain();//FL.server.fl
				// var fa = new fl.app();
				// fl.setTraceClient(2);
				// def.fail(function(){
				// 	alert("error on connectAdHocUser ! ");
				// });
				if(!appDescription)
					appDescription = "my App";
				console.log("....................................>beginning createUserAndDefaultApp....");
				var createUserAndDefaultAppPromise=_applicationFullCreate({"adminName": "nico@framelink.co", "adminPassWord": "coLas", 
					userName:userName, userPassWord:userPassWord, appDescription:appDescription})
					.then(_login).then(_connect);
				createUserAndDefaultAppPromise.done(function(){
					console.log(">>>>> createUserAndDefaultAppPromise SUCCESS <<<<<");
					console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
					return def.resolve();
				});
				createUserAndDefaultAppPromise.fail(function(err){
					console.log(">>>>> createUserAndDefaultAppPromise FAILURE <<<<<");
					console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
					return def.reject(err);
				});
				return def.promise();

				// to generate unique userName
				// var seconds = new Date().getTime() / 1000;
				// var userName = "toto"+ seconds;
			},	
			disconnect: function() {//change adHoc client name, user name, passordd and appDescrition 
				console.log("....................................>beginning disconnect....current token="+JSON.stringify(FL.login.token));
				var def = $.Deferred();
				var disconnect=_disconnect();
				disconnect.done(function(){console.log(">>>>> disconnect SUCCESS <<<<<");FL.login.token = tokenClear(); return def.resolve();});
				disconnect.fail(function(err){console.log(">>>>> disconnect FAILURE <<<<< "+err); return def.reject(err);});
				return def.promise();
			},
			connectUserToDefaultApp: function(userName,password) {//
				//if userName/password exists but has no application, one application is created
				// console.log("....................................>beginning connectUserToDefaultApp....with token="+JSON.stringify(FL.login.token));
				console.log("....................................>beginning connectUserToDefaultApp....");
				var def = $.Deferred();
				var tokenBackup = FL.login.token;//if it fails we will recover the initial token with this backup
				var fl = null;
				var fa = null;
				// if (FL === null || FL.login === null || FL.login.token === null){//FL.login.token is null
				// if (FL.login === null || FL.login.token === null){//FL.login.token is null
				if (FL.login.token.fl === null){//FL.login.token is null
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
				var connectUserToDefaultApp=_login()
					.then(_connect);
				connectUserToDefaultApp.done(function(){
					console.log(">>>>> connectUserToDefaultApp SUCCESS <<<<<");
					def.resolve();
				});
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
						def.reject(err);					
					}
				});
				return def.promise();	
			},
			isConnected: function(){//returns true if is connected, false otherwise
				isConnected = false;
				var tk = FL.login.token["fl"];
				var conn = null;
				if(tk){
					conn = tk.getsId();//flMain.getsId() - it will return a number if it is connected
					// console.log("FL.API.isConnected() -->conn="+conn);
					if(!isNaN(conn))
						isConnected = true;
				}
				return isConnected;
			},
			isUserExist: function(userName){
				var def = $.Deferred();
				console.log("....................................>beginning isUserExist....with token="+JSON.stringify(FL.login.token));
				var isUserExistPromise=_isUserExist(userName);
				// FL.API.trace = false;
				isUserExistPromise.done(function(exists){
					console.log(">>>>> isUserExist SUCCESS <<<<< exist="+exists);
					return def.resolve(exists);
				});
				isUserExistPromise.fail(function(err){console.log(">>>>> isUserExist FAILURE <<<<<"); return def.reject(err);});
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
					return def.resolve();
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
				addWithFields.done(function(){console.log(">>>>> syncLocalDictionaryToServer SUCCESS <<<<<");return def.resolve();});
				addWithFields.fail(function(err){console.log(">>>>> syncLocalDictionaryToServer FAILURE <<<<< "+err);return def.reject();});
				return def.promise();
			},
			updateDictionaryAttribute: function(fCN,oAttribute){//works with FL.dd.updateAttribute to update attribute to server
				var def = $.Deferred();
				var attrJSON = {"_id":fCN,"name_3":oAttribute.name, "description_4":oAttribute.description, 'label_K': oAttribute.label,'typeUI_9':oAttribute.typeUI, 'type_M': oAttribute.type, 'enumerable_N':oAttribute.enumerable, 'Nico_O':false };
				var fieldUpdatePromise=_fieldUpdate(attrJSON);
				fieldUpdatePromise.done(function(result){console.log(">>>>> updateDictionaryAttribute SUCCESS <<<<<");return def.resolve(result);});
				fieldUpdatePromise.fail(function(err){console.log(">>>>> updateDictionaryAttribute FAILURE <<<<< "+err);return def.reject(err);});
				return def.promise();
			},
			loadAppDataForSignInUser2: function() {//loads (local dict + menu + style + fontFamily) from server
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
				save_Menu_style_fontFamily.fail(function(err){console.log(">>>>> save_Menu_style_fontFamily FAILURE <<<<<"+err);def.reject(err);});
				return def.promise();
			},
			removeTable: function(entityName) {//remove existing or unexisting table - after this we are sure that table does not exist
				//assumes a connection to an application exists
				//Temporary instead of removing --> we rename tables on server to unique names beginning by $+ecn
				//
				// if logical name does not exists in local dictionary for sure it does not exist in server - no remove to do
				// if logical name exists in local dictionary in synch with server remove the table in server
				// if logical name exists in local dictionary but is not in synch ->force synchronization of local dict.
				//    (because synchoronization clears all local dict items we save the local entry in local var oEntity)
				//    After synch:
				//        	if logical name is not in local it is not in server ->nothing needs to be done in server - we 
				//			    only need to reintroduce oEntity in local dictionary
				//			if logical name is in local it is also in server ->we need to remove it and to reintroduce oEntity 
				//				in local dictionary
				console.log("........>beginning removeTable....with appToken="+JSON.stringify(FL.login.appToken));
				var def = $.Deferred();
				//forces synch from server to be sure 
				var ecn = FL.dd.getCEntity(entityName);
				if(ecn === null){
					console.log("........FL.API.removeTable() table="+entityName+ " not in local dict -> not necessary to remove it");
					return def.resolve();//not necessary to remove a table not existing in local dict
				}else{//the table exists in local dict but may be unsynchronized
					var oEntity = FL.dd.entities[entityName];
					if(oEntity.sync){//table exists and is in sync with server	
						console.log("........FL.API.removeTable() table="+entityName+ " is sync with local dict -> will be removed form server");
						var removeTablePromise =_entity_update({query:{"_id":ecn},update:{$set:{"3":'$'+ecn} } });
						removeTablePromise.then(function(){return def.resolve();},function(err){return def.reject(err);});
					}else{//table in local dict but may exist in server (if no synch was done...)
						console.log("........FL.API.removeTable() table="+entityName+ " is in local dict but unsync with server -> we force a synchronization");
						var syncPromise = FL.API.syncLocalDictionary();
						syncPromise.done(function(){
							var ecnAfterSync = FL.dd.getCEntity(entityName);
							if(ecnAfterSync === null){//entity name does not exists in the server
								console.log("........FL.API.removeTable() table="+entityName+ " not in server dict -> not necessary to remove it");
								FL.dd.entities[entityName] = oEntity;
								return def.resolve();//not necessary to remove a table not existing table in server
							}else{//entity name exists in the server
								//we need to remove the table from the server 
								console.log("........FL.API.removeTable() table="+entityName+ " not in sync with local dict but exists in server -> will be removed form server");
								var removeTablePromise =_entity_update({query:{"_id":ecn},update:{$set:{"3":'$'+ecn} } });
								removeTablePromise.then(function(){return def.resolve();},function(err){return def.reject(err);});
								//because FL.API.syncLocalDictionary() cleared the local dictionary we need to add oEntity to the local dict
								FL.dd.entities[entityName] = oEntity;
								return def.resolve();//Table was removed from server and unsynched <entityName> was resetted in local dict.
							}
						});
						syncPromise.fail(function(){return def.reject();});						
					}
				}
				return def.promise();
			},
			saveTable: function(entityName,recordsArray) {//creates a table (overriding any existing one) and saves a set of records in it
				//assumes a login to an application exists - if table is not in synch it synchs it
				//recordsArray [{"number":12,"code":"abc"},....]
				//returns array with input data and _id for each record
				console.log("....................................>beginning saveTable....with appToken="+JSON.stringify(FL.login.appToken));
				var def = $.Deferred();
				var ecn = FL.dd.getCEntity(entityName);
				//begins by removeTable, then sync local dict  to server, then inserting lines
				// var remove_synch = FL.API.removeTable(entityName).then(FL.API.syncLocalDictionaryToServer(entityName));
				// var remove_synch = FL.API.removeTable(entityName).then(FL.API.syncLocalDictionaryToServer(entityName));
				FL.API.removeTable(entityName)
				.then(function(){
					return FL.API.syncLocalDictionaryToServer(entityName);
				})
				.then(function(){
						ecn = FL.dd.getCEntity(entityName);
						console.log(">>>>>saveTable --> remove and synch SUCCESS <<<<<");
						console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
						var arrToSend = convertRecordsTo_arrToSend(entityName,recordsArray);
						console.log("saveTable --->"+JSON.stringify(arrToSend));
						console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
						insertPromise = _insert(ecn,arrToSend);
						insertPromise.then(function(data){console.log(">>>>>saveTable Ok");return def.resolve(data);},function(err){return def.reject(err);});
						//data has the format:
						// [{"d":{"55":"Jojox","56":"123"},"v":0,"_id":"546963669b04c9107942d32d"},{"d":{"55":"Anton","56":"456"},"v":0,"_id":"546963669b04c9107942d32e"}]
						// return def.resolve();
					}
				).fail(
					function(err){
						console.log(">>>>>saveTable --> remove and synch FAILURE <<<<< "+err);
						return def.reject(err);
					}
				);
				return def.promise();
			},
			//we need table CRUD: addRecordsToTable,getRecordsFromTable, updateRecordsToTable, removeRecordsFromTable
			// Method addRecordsToTable - has parameters  (entityName,recordsArray)
			//		where recordsArray has the format [{"number":12,"code":"abc"},....]
			// Methods getRecordsFromTable,updateRecordsToTable and removeRecordsFromTable - has parameters  (entityName,recordsId,withTS)
			//		where recordsId has the format [{"_id":1,timeStamp:"A"},{"_id":4},....]
			addRecordsToTable: function(entityName,recordsArray) {//add one or several records to existing table
				//assumes a login to an application exists and entitName exists in local and is in sync
				//recordsArray [{"number":12,"code":"abc"},....]
				console.log("....................................>beginning addRecordsToTable....with appToken="+JSON.stringify(FL.login.appToken));
				var def = $.Deferred();
				var ecn = FL.dd.getCEntity(entityName);
				if(ecn === null){
					console.log("........FL.API.addRecordsToTable() table="+entityName+ " not in local dict !");
					return def.reject("addRecordsToTable <table="+entityName+ "> does not exist in local dict !");//
				}else{//the table exists in local dict but may be unsynchronized
					var oEntity = FL.dd.entities[entityName];	
					if(!oEntity.sync){//table exists in local dict but is not in sync with server	
						console.log("........FL.API.addRecordsToTable() <table="+entityName+ "> exists in local dict but is not in sync");
						return def.reject("addRecordsToTable <table="+entityName+ "> not in sync !");//
					}else{//table exists and is in sync
						console.log("........FL.API.addRecordsToTable() table="+entityName+ " is ok. We will insert!");
						var arrToSend = convertRecordsTo_arrToSend(entityName,recordsArray);		
						insertPromise = _insert(ecn,arrToSend);
						insertPromise.then(function(data){return def.resolve(data);},function(err){return def.reject(err);});
					}
				}	
				return def.promise();
			},
			updateRecordToTable: function(entityName,record) {//update a single record to existing table
				//assumes a login to an application exists and entitName exists in local and is in sync
				//record is a JSON containing a _id key {"_id":12345,"id":1,"code":"abc"}
				console.log("....................................>beginning updateRecordToTable....with appToken="+JSON.stringify(FL.login.appToken));
				var def = $.Deferred();
				var ecn = FL.dd.getCEntity(entityName);
				if(ecn === null){
					console.log("........FL.API.updateRecordToTable() table="+entityName+ " not in local dict !");
					return def.reject("updateRecordToTable table="+entityName+ " does not exist");//
				}else{//the table exists in local dict but may be unsynchronized
					var oEntity = FL.dd.entities[entityName];
					if(!oEntity.sync){//table exists in local dict but is not in sync with server	
						console.log("........FL.API.updateRecordToTable() table="+entityName+ " exists in local dict but is not in sync");
						return def.reject("updateRecordToTable table="+entityName+ " not in sync");//
					}else{//table exists and is in sync
						console.log("........FL.API.updateRecordToTable() table="+entityName+ " is ok. We will insert!");
						var arrToSend = convertOneRecordTo_arrToSend(entityName,record);//returns {"d":{"51":"cli1","52":"Lx","53":"Pt"}} 
						if(record._id){
							console.log("update ->"+record._id+" record="+JSON.stringify(record));
							var updatePromise = _update(ecn,record._id,arrToSend.d);
							updatePromise.done(function(count){
								console.log(">>>>> updatePromise SUCCESS <<<<< " + count + " record updated!");
								def.resolve(count);
							});
							updatePromise.fail(function(err){console.log(">>>>> updatePromise FAILURE <<<<<"+err);def.reject(err);});
							// return def.resolve(data);
						}else{
							console.log("........FL.API.updateRecordToTable() table="+entityName+ " is ok but _id is missing");
							return def.reject("updateRecordToTable table="+entityName+ " -->error: missing _id");//
						}	
						// insertPromise.then(function(data){return def.resolve(data);},function(err){return def.reject(err);});
					}
				}	
				return def.promise();
			},
			// removeRecordFromTable: function(entityName,record) {//removes a single record from a table
			removeRecordFromTable: function(entityName,arrOf_Id) {//removes all _id in the array arrOf_Id
				//assumes a login to an application exists and entitName exists in local and is in sync
				//record is a JSON containing a _id key {"_id":12345,"id":1,"code":"abc"}
				//arrOf_Id is an array containing _id keys [12345,12312343]
				console.log("....................................>beginning removeRecordFromTable....with appToken="+JSON.stringify(FL.login.appToken));
				var def = $.Deferred();
				var ecn = FL.dd.getCEntity(entityName);
				if(ecn === null){
					console.log("........FL.API.removeRecordFromTable() table="+entityName+ " not in local dict !");
					return def.reject("removeRecordFromTable table="+entityName+ " does not exist");//
				}else{//the table exists in local dict but may be unsynchronized
					var oEntity = FL.dd.entities[entityName];
					if(!oEntity.sync){//table exists in local dict but is not in sync with server	
						console.log("........FL.API.removeRecordFromTable() table="+entityName+ " exists in local dict but is not in sync");
						return def.reject("removeRecordFromTable table="+entityName+ " not in sync");//
					}else{//table exists and is in sync
						console.log("........FL.API.removeRecordFromTable() table="+entityName+ " is ok. We will remove!");
						// if(record._id){
						if(arrOf_Id.length>0){
							// console.log("remove ->"+record._id+" record="+JSON.stringify(record));
							console.log("remove -> _Ids in array "+JSON.stringify(arrOf_Id));
							// var removePromise = _remove(ecn,record._id);
							var removePromise = _removeMultiple(ecn,arrOf_Id);
							removePromise.done(function(count){
								console.log(">>>>> removePromise SUCCESS <<<<< record removed!");
								def.resolve(count);
							});
							removePromise.fail(function(err){console.log(">>>>> removePromise FAILURE <<<<<"+err);def.reject(err);});
							// return def.resolve(data);
						}else{
							console.log("........FL.API.removeRecordFromTable() table="+entityName+ " is ok but _id is missing");
							return def.reject("removeRecordFromTable table="+entityName+ " -->error: array of _ids is empty");//
						}	
						// insertPromise.then(function(data){return def.resolve(data);},function(err){return def.reject(err);});
					}
				}	
				return def.promise();
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
					var arrLocallyTranslated = FL.API.convertArrC2LForEntity(entityName,dataArray);//dataArray =>[{"_id":123,d:{},r:[]},{"_id":124,d:{},r:[]},....{"_id":125,d:{},r:[]}]
					//arrLocallyTranslated is flatted with the format:
					// alert("arrLocallyTranslated="+arrLocallyTranslated);
					//[{"_id":123234234,"id":1,produto":"High","nome":"Rota dos Numeros, Lda","marca":"Rota dos Numeros","morada":"Av Ceuta, 21 B","cod postal":"2700-188","localidade":"Amadora","telefone":"21 4945431 ","email":"rota.dos.numeros@sapo.pt ","id":1,"_id":"545b4f9afa2b1a3233bb6781"},
					def.resolve(arrLocallyTranslated);
				});
				loadTable.fail(function(err){console.log(">>>>> loadTable FAILURE <<<<<"+err);def.reject(err);});
				return def.promise();
			},
			loadTableId: function(entityName,field2) {//returns only the _id field and optionally a second field from server
				//assumes a login to an application exists
				console.log("....................................>beginning loadTableId....with appToken="+JSON.stringify(FL.login.appToken));
				var def = $.Deferred();
				var ecn = FL.dd.getCEntity(entityName);
				if(!ecn){
					alert("Error in FL.API.loadTableId the table <<" + entityName + ">> not in local dictiionary!");
					return def.reject("Error in FL.API.loadTableId the table <<" + entityName + ">> not in local dictiionary!" );
				}
				var projections = {"_id":1};
				if(field2){
					var fCN=FL.dd.getFieldCompressedName(entityName,field2);
					projections[fCN] = 1;
				}	
				// var loadTableId=_findAll(ecn,{},{"_id":1});
				var loadTableId=_findAll(ecn,{},projections);
				loadTableId.done(function(dataArray){
					console.log(">>>>> loadTableId SUCCESS <<<<< ");
					//dataArray has a format: [{"_id":1,"d":{"53":"line 1 content of field1","54":"line 1 content of field2"},"v":0},
					//							{"_id":2,"d":{"53":"line 2 content of field1","54":"line 2 content of field2"},"v":0}...,]
					var arrLocallyTranslated = FL.API.convertArrC2LForEntity(entityName,dataArray);//dataArray =>[{"_id":123,d:{},r:[]},{"_id":124,d:{},r:[]},....{"_id":125,d:{},r:[]}]
					//arrLocallyTranslated is flatted with the format:
					// alert("arrLocallyTranslated="+arrLocallyTranslated);
					//[{"_id":123234234,"id":1,produto":"High","nome":"Rota dos Numeros, Lda","marca":"Rota dos Numeros","morada":"Av Ceuta, 21 B","cod postal":"2700-188","localidade":"Amadora","telefone":"21 4945431 ","email":"rota.dos.numeros@sapo.pt ","id":1,"_id":"545b4f9afa2b1a3233bb6781"},
					def.resolve(arrLocallyTranslated);
				});
				loadTableId.fail(function(err){console.log(">>>>> loadTableId FAILURE <<<<<"+err);def.reject(err);});
				return def.promise();
			},		
			syncLocalStoreToServer: function(){//saves menu,style and font to server, retrieving them from localStore
				var def = $.Deferred();
				var lastMenuStr  = localStorage.storedMenu
				var lastStyleStr = localStorage.style;// Retrieve last saved style ex.red or spacelab
				var lastFontFamilyStr = localStorage.fontFamily;// Retrieve last saved fontFamily ex.impact or georgia
				var oMenu = JSON.parse(lastMenuStr);
				FL.API.setMenu(oMenu);
				FL.API.setStyle(lastStyleStr);
				FL.API.setFontFamily(lastFontFamilyStr);
				var promise = FL.API.save_Menu_style_fontFamily();
				promise.done(function(){console.log(">>>>> syncLocalStoreToServer SUCCESS <<<<< ");def.resolve();});
				promise.fail(function(err){console.log(">>>>> syncLocalStoreToServer FAILURE <<<<<"+err);def.reject(err);});
			
				// FL.server.saveMainMenu(oMenu,lastStyleStr,lastFontFamilyStr,function(err){
				// 	console.log("FL.server syncLocalStoreToServer() -> menu style and font saved on server -->"+err);
				// 	// alert("FLMenu2.js saveMenuToLocalAndServer called FL.server.saveMainMenu with style="+lastStyleStr+ " font="+lastFontFamilyStr);
				// });
				return def.promise();
			},			
			createHistoMails_ifNotExisting: function() {//checks if histoMails exist. If not creates it
				var eCN = FL.dd.getCEntity("_histoMail");
				// eCN = 23;
				var def = $.Deferred();
				console.log(">>>>>> createHistoMails_ifNotExisting eCN="+eCN);
				if(eCN === null){ // does not exist we should create it
					console.log("....................................>beginning createHistoMails_ifNotExisting....with token="+JSON.stringify(FL.login.token));
					FL.dd.createEntity("_histoMail","mails histo entity");//update local dict
					FL.dd.addAttribute("_histoMail",'msg','events log','mail event','string','textbox',null);
					// FL.dd.displayEntities();
					var synch=FL.API.syncLocalDictionaryToServer('_histoMail');
					synch.done(function(){
						console.log(">>>>>createHistoMails_ifNotExisting syncLocalDictionaryToServer SUCCESS <<<<<");
						def.resolve();
					});
					synch.fail(function(err){
						console.log(">>>>>createHistoMails_ifNotExisting syncLocalDictionaryToServer FAILURE <<<<< "+err);
						def.reject(err);
					});
				}else{
					console.log(">>>>>createHistoMails_ifNotExisting _histoMail exists !");
					def.resolve();//it exists already
				}
				return def.promise();
			},
			createTableHistoMails_ifNotExisting: function(entityName) {// createHistoMails_ifNotExisting: function(entityName) {//creates "_histoMail_<eCN>" where eCN is the Entity Compressed name of entityName
				//Note: entityName must exist
				var def = $.Deferred();
				if(!FL.dd.isEntityInLocalDictionary(entityName)){
					alert("createTableHistoMails_ifNotExisting ERROR entity " + entityName + " does not exist in Local Data Dictionary");
				}else{
					var histoName = FL.dd.histoMailPeer(entityName);
					var eCN = FL.dd.getCEntity(histoName);
					console.log(">>>>>> createTableHistoMails_ifNotExisting for " + entityName + ". Peer table is " + histoName + " with eCN=" + eCN + " for table");
					if(eCN === null){ // does not exist in local DD we should create it
						console.log("....................................>beginning createTableHistoMails_ifNotExisting....with token="+JSON.stringify(FL.login.token));
						// FL.dd.createEntity(histoName,"mails histo peer for initial name="+entityName);//update local dict
						// FL.dd.addAttribute(histoName,'msg','events log','mail event','string','textbox',null);
						FL.dd.createHistoMailPeer(entityName);
						// FL.dd.displayEntities();
						var synch=FL.API.syncLocalDictionaryToServer(histoName);
						synch.done(function(){
							console.log(">>>>>createTableHistoMails_ifNotExisting syncLocalDictionaryToServer SUCCESS <<<<<");
							def.resolve();
						});
						synch.fail(function(err){
							console.log(">>>>>createTableHistoMails_ifNotExisting syncLocalDictionaryToServer FAILURE <<<<< "+err);
							def.reject(err);
						});
					}else{
						console.log(">>>>>createTableHistoMails_ifNotExisting _histoMail exists !");
						def.resolve();//it exists already
					}
				}
				return def.promise();
			},
			createTemplates_ifNotExisting: function() {//checks if templates exist. If not creates it
				var eCN = FL.dd.getCEntity("_templates");
				// eCN = 23;
				var def = $.Deferred();
				console.log(">>>>>> createTemplates_ifNotExisting eCN="+eCN);
				if(eCN === null){ // does not exist we should create it
					console.log("....................................>beginning createTemplates_ifNotExisting....with token="+JSON.stringify(FL.login.token));
					FL.dd.createEntity("_templates","templates entity");//update local dict
					FL.dd.addAttribute("_templates",'jsonTemplate','json of template','json of template','string','textbox',null);
					// FL.dd.displayEntities();
					var synch=FL.API.syncLocalDictionaryToServer('_templates');
					synch.done(function(){
						console.log(">>>>>createTemplates_ifNotExisting syncLocalDictionaryToServer SUCCESS <<<<<");
						def.resolve();
					});
					synch.fail(function(err){
						console.log(">>>>>createTemplates_ifNotExisting syncLocalDictionaryToServer FAILURE <<<<< "+err);
						def.reject(err);
					});
				}else{
					console.log(">>>>>createTemplates_ifNotExisting _templates exists !");
					def.resolve();//it exists already
				}
				return def.promise();
			},						
			mailRecipientsOfTemplate: function(entityName,templateName) {//for list entityName and templateName returns all emails received in Webhook
				//assumes a login to an application exists
				console.log("....................................>beginning mailRecipientsOfTemplate....with appToken="+JSON.stringify(FL.login.appToken));
				var def = $.Deferred();
				// var eCN = FL.dd.getCEntity(entityName);
				// var eCN = FL.dd.getCEntity("_histoMail");
				// var fCN = FL.dd.getFieldCompressedName("_histoMail","msg");//the field to search within eCN
				
				var histoName = FL.dd.histoMailPeer(entityName);
				var eCN = FL.dd.getCEntity(histoName);
				var fCN = FL.dd.getFieldCompressedName(histoName,"msg");//the field to search within eCN

				var par1 = {};
				par1[fCN+'.metadata.NName'] = templateName;
				// par1[fCN+'.sender'] = sender;

				var par2 = {};
				// par2[fCN+'.sender'] = 1;
				par2[fCN+'.email'] = 1;


				// var mailRecipientsTable=_findAll(eCN,{fCN+'.metadata.NName':templateName},{fCN+'.sender':1});
				var mailRecipientsTable=_findAll(eCN,par1,par2);
				//fd.findAll(ecn, {"query":{}}, function(err, data){..})
				mailRecipientsTable.done(function(data){
					console.log(">>>>> mailRecipientsTable SUCCESS <<<<< ");
					recipientsArray = _.map(data,function(element){//extracts emails only
						var xObj = element.d[fCN];
						return xObj.email;
					});
					def.resolve(recipientsArray);
				});
				mailRecipientsTable.fail(function(err){console.log(">>>>> mailRecipientsOfTemplate FAILURE <<<<<"+err);def.reject(err);});
				return def.promise();
			},			
			upsertByKey: function(keyFieldValue,entityName,record) {
				//upsert record for <keyField>=<keyFieldValue> in table entityName
				//record is a JSON that may contain _id key ex: {"_id":12345,"id":1,"code":"abc"}
				console.log("....................................>beginning upsertByKey....with appToken="+JSON.stringify(FL.login.appToken));
				var def = $.Deferred();
				var eCN = FL.dd.getCEntity(entityName);
				if(eCN === null){
					console.log("........FL.API.upsertByKey() table="+entityName+ " not in local dict !");
					return def.reject("upsertByKey table="+entityName+ " does not exist in local dict !");
				}else{//the table exists in local dict but may be unsynchronized
					var oEntity = FL.dd.entities[entityName];
					if(!oEntity.sync){//table exists in local dict but is not in sync with server	
						console.log("........FL.API.upsertByKey() table="+entityName+ " exists in local dict but is not in sync");
						return def.reject("upsertByKey table="+entityName+ " not in sync");//
					}else{//table exists and is in sync
						console.log("........FL.API.upsertByKey() table="+entityName+ " is ok. We will upsert!");
						// var _id = record["_id"];//it can be null or existing
						var recordWithFCN = convertOneRecordTo_arrToSend(entityName,record);//returns {"d":{"51":"cli1","52":"Lx","53":"Pt"}} 
						var upsertPromise = this.upsertByKeyOnECN(keyFieldValue,eCN,recordWithFCN.d);
						upsertPromise.done(function(){
							console.log(">>>>> FL.API.upsertByKey() upsertPromise SUCCESS <<<<< record updated!");
							return def.resolve();
						});
						upsertPromise.fail(function(err){console.log(">>>>> FL.API.upsertByKey() upsertPromise FAILURE <<<<<"+err); return def.reject(err);});
					}
				}
				return def.promise();
			},
			upsertByKeyOnECN: function(keyFieldValue,eCN,recordWithFCN) {//upsert for <keyField>=<keyFieldValue>for list entityName and templateName returns all emails received in Webhook
				//if _id exists =>direct update
				//upsert record with field compressed names  for <fCNkey>=<keyFieldValue> in table with compressed name eCN
				// assumes that: eCN exists and fCNKey exists in local dict and is in synch with server
				//ex FL.API.upsertByKeyOnECN('51','123','50',{"d":{"51":"cli1","52":"Lx","53":"Pt"}});
				console.log("....................................>beginning upsertByKeyOnECN....with appToken="+JSON.stringify(FL.login.appToken));
				var def = $.Deferred();
				
				_update(eCN,keyFieldValue,recordWithFCN)
				.then(function(){
					return def.resolve();
				}
					,function(err){
						console.log(">>>> upsertByKeyOnECN with _id =>unable to insert");
						return def.reject("upsertByKeyOnECN with _id unable to insert err="+err);
					});
				return def.promise();
			},
			mandrillRejectListForSender: function(senderEmail) {//get reject list from mandrill only for sender=sender
				console.log("....................................>beginning mandrillRejectListForSender....with appToken="+JSON.stringify(FL.login.appToken));
				var def = $.Deferred();		
				_mandrillRejectListForSender(senderEmail)
				.then(function(data){
					return def.resolve(data);
				}
					,function(err){
						console.log(">>>> mandrillRejectListForSender FAILURE");
						return def.reject("mandrillRejectListForSender FAILURE err="+err);
					});
				return def.promise();
			},
			mandrillDeleteFromReject: function(arrayOfEmails) {//get reject list from mandrill only for sender=sender
				console.log("....................................>beginning mandrillDeleteFromReject....with appToken="+JSON.stringify(FL.login.appToken));
				var def = $.Deferred();		
				_mandrillDeleteFromReject(arrayOfEmails)
				.then(function(data){
					return def.resolve(data);
				}
					,function(err){
						console.log(">>>> mandrillDeleteFromReject FAILURE");
						return def.reject("mandrillDeleteFromReject FAILURE err="+err);
					});
				return def.promise();
			},
			customTable: function(entityProps) {
				// Ex FL.API.customTable({singular:"shipment"});
				//uses --> FL.dd.createEntity("sales rep","employee responsable for sales");
				var def = $.Deferred();
				var singularDefault = FL.dd.nextEntityBeginningBy("unNamed");
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
			getFLContextFromBrowserLocationBar: function() {//to be used at the entry point of independent applications
				//reads the browser adress bar to get the connection string then connects to the default application
				var def = $.Deferred();
				if(FL.API.isConnected()){
					// alert("getFLContextFromBrowserLocationBar --> independent app already connected !!! how is this possible ?");
					def.reject("getFLContextFromBrowserLocationBar --> independent app already connected !!! how is this possible ?");
				}else{
					var fullUrl = window.location.href;
					var connectionString = FL.common.getTag(fullUrl,"connectionString","#");
					if(connectionString){
						connectionString = FL.common.enc(connectionString,-1);
						var loginObject = JSON.parse(connectionString);//ex {"email":"toto114@toto.com","userName":"","password":"123"}				
						// alert("getFLContextFromBrowserLocationBar ->"+loginObject.email+" token="+JSON.stringify(FL.API.token));
						var spinner=FL.common.loaderAnimationON('spinnerDiv');
						var connectionPromise = FL.API.connectUserToDefaultApp(loginObject.email,loginObject.password)
						// .then(function(){return appSetup(loginObject);})
							.then(function(){
								spinner.stop();
								console.log(">>>>> getFLContextFromBrowserLocationBar -> SUCCESS connecting to default app !<<<<< ");
								console.log("after connection->"+JSON.stringify(FL.login.token));
								def.resolve();
							},function(err){
								spinner.stop();
								console.log(">>>>> getFLContextFromBrowserLocationBar FAILURE <<<<<"+err);
								def.reject(err);
							});						
					}else{
						alert("getFrameLinkContext --> No connectionString available !!!");
						return;
					}
				}
				return def.promise();
			},			
			testFunc: function(x) {
				alert("FL.server.test() -->"+x);
			}
		};
	})();
// });