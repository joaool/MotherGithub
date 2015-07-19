// jQuery(document).ready(function($){
/**
	* data dictionary UI methods 
	*/ // FL = FL || {}; //gives undefined if FL is undefined 
// FL = {};
// // a="A";
// b="B";
// var a = (typeof a === 'undefined') ? b : a;//if a is defined returns "A" otherwise returns the content of b
// alert("zzz="+a);//sets "B"
"use strict";FL = typeof FL === "undefined"?{}:FL;FL["API"] = (function(){ //name space FL.API
var internalTest=function internalTest(x){ //
alert("internalTest() -->" + x);};var tokenClear=function tokenClear(){token = {"clientName":null,"userName":null,"userPassWord":null,"domainName":null,"dbName":null, // "fl":fl, //to maintain from start to end
// "fa":fa,
"appDef":null,"appDescription":null,"appMenuLevel":null,"appRestrictions":null,"error":null};return token;}; //-------- PROMISE WRAPPERS ------------------
var _applicationFullCreate=function _applicationFullCreate(jsonParam){ //ex _applicationFullCreate({"adminName": "nico@framelink.co", "adminPassWord": "coLas"}, function (err, myApp){
FL.common.printToConsole("....................................>beginning _applicationFullCreate....");var def=$.Deferred(); // var fl = new flMain();//FL.server.fl
var fl=FL.fl;var fa=new fl.app(); // fl.setTraceClient(2);
fl.applicationFullCreate(jsonParam,function(err,myApp){ // fl.applicationFullCreate({"adminName": "joao@framelink.co", "adminPassWord": "oLiVeIrA"}, function (err, myApp){
// err = "abc";
if(err){FL.login.token = tokenClear(); // FL.login.token = {
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
FL.common.printToConsole("=================================>ERROR ON _applicationFullCreate err=" + err);def.reject("ERROR ON _applicationFullCreate err=" + err);}else { // myAppFC=myApp;
FL.common.printToConsole("....................................>_applicationFullCreate RESPONSE OK ON _applicationFullCreate....");FL.login.token = {"clientName":myApp.clientName,"userName":myApp.userName,"userPassWord":myApp.userPassWord,"domainName":myApp.domainName,"dbName":myApp.dbName,"fl":fl,"fa":fa,"appDef":null,"appDescription":null,"appMenuLevel":null,"appRestrictions":null,"error":null};def.resolve();}});return def.promise();};var _login=function _login(){ //notice that login can be done without any application =>FL.login.token.appDef = null;
FL.common.printToConsole("....................................>beginning _login....");var def=$.Deferred();var fl=FL.fl; //new flMain();
// var fa = new fl.app();
// var currentURL =window.location.href;
// var server = FL.common.stringAfterLast(currentURL,"//");
// server = FL.common.stringBeforeFirst(server,"/");
// // alert(server);
// if (server =="localhost")
// 	server = "test.framelink.co";
fl.serverName(FL.common.getServerName());if(fl.getsId() != undefined){ //if getsId() has a session number it is connected !. We need to disconnect
var disconnectPromise=_disconnect();disconnectPromise.done(function(){FL.dd.clear();fl.login({"username":FL.login.token.userName,"password":FL.login.token.userPassWord,"domain":FL.login.token.domainName},function(err,data){ // err = "abc";
if(err){ // alert("ERROR ON _login");
FL.common.printToConsole("============================>ERROR ON _login");FL.login.token.error = "_login";return def.reject("ERROR ON _login err=" + err);}else {var appDef=data.applications[0]; //it has a single application because it was just created
if(appDef){FL.common.printToConsole("....................................>fl.login RESPONSE OK ON _login....");FL.login.token.appDef = appDef;FL.login.token.appDescription = appDef.description;return def.resolve();}else {FL.login.token.appDef = null;FL.login.token.appDescription = null;FL.common.printToConsole("....................................>fl.login RESPONSE OK ON _login but ERROR:no application available....");return def.reject("no application available");}}});});disconnectPromise.fail(function(){def.reject("disconnect failed inside _login");});}else {FL.dd.clear();fl.login({"username":FL.login.token.userName,"password":FL.login.token.userPassWord,"domain":FL.login.token.domainName},function(err,data){ // err = "abc";
if(err){ // alert("ERROR ON _login");
FL.common.printToConsole("============================>ERROR ON _login");FL.login.token.error = "_login";def.reject("ERROR ON _login err=" + err);}else {var appDef=data.applications[0]; //it has a single application because it was just created
if(appDef){FL.common.printToConsole("....................................>fl.login RESPONSE OK ON _login....");FL.login.token.appDef = appDef;FL.login.token.appDescription = appDef.description;return def.resolve();}else {FL.login.token.appDef = null;FL.login.token.appDescription = null;FL.common.printToConsole("....................................>fl.login RESPONSE OK ON _login but ERROR:no application available....");return def.reject("no application available");}}});}return def.promise();};var _connect=function _connect(){ // ex jsonParam = {"username": myApp.userName, "password": myApp.userPassWord, "domain": myApp.domainName}
FL.common.printToConsole("....................................>beginning _connect....");var def=$.Deferred(); // var fl = FL.fl; //new flMain();
var fa=FL.login.token.fa; //new fl.app();
fa.connect(FL.login.token.appDef,function(err,data2){ // err = "abc";
if(err){FL.common.printToConsole("=============================>ERROR ON _connect");FL.login.token.error = "_connect";def.reject(err);}else {FL.common.printToConsole("....................................>fa.connect RESPONSE OK ON _connect....");FL.login.token.dbName = FL.login.token.appDef.dbName; // alert("OK USER CREATED AND CONNECTED  ->"+JSON.stringify(FL.login.token));
FL.common.printToConsole("=====================================>_connect: OK USER CONNECTED  ->" + JSON.stringify(FL.login.token));var md=new FL.fl.mandrill();md.init({key:FL.common.getMandrillKey()},function(err,data){if(err){alert("_connect --> error in Mandrill initialization ");return def.reject("_connect --> error in Mandrill initialization");}else {FL.common.printToConsole("_connect --> Mandrill initialization Successfull");return def.resolve();}}); //call once
}});return def.promise();};var _disconnect=function _disconnect(){FL.common.printToConsole("....................................>beginning _disconnect...." + JSON.stringify(FL.login.token));var def=$.Deferred();var fl=FL.fl; //new flMain();
var fa=FL.login.token.fa; //new fl.app();
// var fa = new fl.app();
// var fl= token.fl;
// var fa= token.fa;
fa.disconnect(function(err,data){FL.common.printToConsole(".............................fa.disconnect ON _disconnect...."); // err = "abc";
if(err){alert("ERROR ON _disconnect err=" + err);FL.common.printToConsole("======================>ERROR ON _disconnect err=" + err);def.reject(err);}else {FL.common.printToConsole("=====================================>_disconnect: OK USER DISCONNECTED  ->token=" + JSON.stringify(FL.login.token));def.resolve();}});return def.promise();};var _isUserExist=function _isUserExist(userName){FL.common.printToConsole("....................................>beginning _isUserExist...." + JSON.stringify(FL.login.token),"API");var def=$.Deferred();var fl=FL.fl; //new flMain();
// if(!fl){
// 	fl = new flMain();
// 	FL.fl = fl;
// }		
fl.isUserExist({"adminName":"nico@framelink.co","adminPassWord":"coLas","userName":userName},function(err,result){FL.common.printToConsole(".............................fa.isUserExist ON _isUserExist...."); // err = "abc";
if(err){ // alert("ERROR ON _isUserExist err="+err);
FL.common.printToConsole("======================>ERROR ON _isUserExist err=" + err);def.reject("ERROR ON _isUserExist err=" + err);}else {FL.common.printToConsole("=====================================>_isUserExist: OK ");var exists=false;if(result)exists = true;def.resolve(exists);}});return def.promise();};var _applicationRemove=function _applicationRemove(){var def=$.Deferred();var fl=FL.fl; //new flMain();
// var fl = new flMain();
// var fa = FL.login.token.fa;//new fl.app();
fl.applicationRemove({"adminName":FL.login.token.userName,"adminPassWord":FL.login.token.userPassWord,"domain":FL.login.token.domainName},function(err,data){FL.common.printToConsole("............................._applicationRemove...."); // err = "abc";
if(err){alert("ERROR ON _applicationRemove err=" + err);FL.common.printToConsole("======================>ERROR ON _applicationRemove err=" + err);def.reject(err);}else {FL.login.token.appDef = null;FL.common.printToConsole("=====================================>_applicationRemove: OK APPLICATION REMOVED  ->token=" + JSON.stringify(FL.login.token));def.resolve();}});return def.promise();};var _applicationCreate=function _applicationCreate(appDescription){var def=$.Deferred();var fl=FL.fl; //new flMain();
// var fl = new flMain();
// var fa = FL.login.token.fa;//new fl.app();
fl.applicationCreate({"adminName":FL.login.token.userName,"adminPassWord":FL.login.token.userPassWord,"domainPrefix":"test","description":appDescription},function(err,data){FL.common.printToConsole("............................._applicationCreate...."); // err = "abc";
if(err){ // alert("ERROR ON _applicationCreate err="+err);
FL.common.printToConsole("======================>ERROR ON _applicationCreate err=" + err);def.reject("ERROR ON _applicationCreate err=" + err);}else {FL.login.token.appDef = data.d;FL.login.token.domainName = data.d["domainName"];FL.login.token.appDescription = appDescription;FL.common.printToConsole("=====================================>_applicationCreate: OK APPLICATION CREATED  ->token=" + JSON.stringify(FL.login.token));def.resolve();}});return def.promise();};var _clientRemove=function _clientRemove(){var def=$.Deferred();var fl=FL.fl; //new flMain();
var fa=FL.login.token.fa; //new fl.app();
fl.clientRemove({"adminName":"nico@framelink.co","adminPassWord":"coLas","clientName":FL.login.token.clientName},function(err,data){ // fl.clientRemove({"adminName": FL.login.token.userName, "adminPassWord": FL.login.token.userPassWord, "clientName": FL.login.token.clientName}, function (err, data){
FL.common.printToConsole("............................._clientRemove...."); // err = "abc";
if(err){alert("ERROR ON _clientRemove err=" + err);FL.common.printToConsole("======================>ERROR ON _clientRemove err=" + err);def.reject(err);}else {var oldUserName=FL.login.token.userName;FL.login.token = tokenClear(); // alert("_clientRemove DONE user=" + oldUserName + "was removed!  ->token="+JSON.stringify(FL.login.token));
FL.common.printToConsole("=====================================>_clientRemove DONE user=" + oldUserName + "was removed! ->token=" + JSON.stringify(FL.login.token));def.resolve();}});return def.promise();};var _applicationFinalize=function _applicationFinalize(userName,appDescription){var def=$.Deferred();FL.login.token.appDescription = "application of user " + userName;if(appDescription)FL.login.token.appDescription = appDescription;var fl=FL.fl; //new flMain();
var fa=FL.login.token.fa; //new fl.app();
// fl.applicationFinalize({"adminName":"nico@framelink.co","adminPassWord":"coLas",
// 		"userName":FL.login.token.userName,"clientName":FL.login.token.clientName,"domainName":FL.login.token.domainName,
// 		"newUserName":userName,"newClientName":userName,
// 		"newDescription":FL.login.token.appDescription}, function(err, data){
fl.applicationFinalize({"adminName":FL.login.token.userName,"adminPassWord":FL.login.token.userPassWord,"userName":FL.login.token.userName,"clientName":FL.login.token.clientName,"domainName":FL.login.token.domainName,"newUserName":userName,"newClientName":userName,"newDescription":FL.login.token.appDescription},function(err,data){FL.common.printToConsole("............................._applicationFinalize....with:" + userName + "/" + appDescription); // err = "abc";
if(err){ // alert("ERROR ON _applicationFinalize err="+err);
FL.common.printToConsole("======================>ERROR ON _applicationFinalize err=" + err);var errMsg="ERROR ON _applicationFinalize err=" + err;var posIndex=err.indexOf("already exist"); //HACK this means that the error is because the user already exists
if(posIndex >= 0)errMsg = "existing user ERROR " + err;def.reject(errMsg);}else { // FL.login.token = {
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
FL.login.token.clientName = userName;FL.login.token.userName = userName; // FL.login.token.userPassWord = null;
FL.common.printToConsole("=====================================>_applicationFinalize: OK ->token=" + JSON.stringify(FL.login.token));def.resolve();}});return def.promise();};var _userChangePassWord=function _userChangePassWord(password){var def=$.Deferred();var fl=FL.fl; //new flMain();
// var fl = new flMain();
// var fa = FL.login.token.fa;//new fl.app();
fl.userChangePassWord({"adminName":"nico@framelink.co","adminPassWord":"coLas","userName":FL.login.token.userName,"userPassWord":password},function(err,result){FL.common.printToConsole("............................._userChangePassWord....TO " + password); // err = "abc";
if(err){alert("ERROR ON _userChangePassWord err=" + err);FL.common.printToConsole("======================>ERROR ON _userChangePassWord err=" + err);def.reject(err);}else {FL.login.token.userPassWord = password;FL.common.printToConsole("=====================================>_userChangePassWord: OK Password changed to " + password + "  ->token=" + JSON.stringify(FL.login.token));def.resolve();}});return def.promise();};var _userChangeNameAndPassWord=function _userChangeNameAndPassWord(newUserName,newPassword){ //XXXXXX
var def=$.Deferred();var fl=FL.fl; //new flMain();
// var fl = new flMain();
// var fa = FL.login.token.fa;//new fl.app();
fl.userChangePassWord({"adminName":"nico@framelink.co","adminPassWord":"coLas","userName":FL.login.token.userName,"userPassWord":password},function(err,result){FL.common.printToConsole("............................._userChangePassWord....TO " + password); // err = "abc";
if(err){alert("ERROR ON _userChangePassWord err=" + err);FL.common.printToConsole("======================>ERROR ON _userChangePassWord err=" + err);def.reject(err);}else {FL.login.token.userPassWord = password;FL.common.printToConsole("=====================================>_userChangePassWord: OK Password changed to " + password + "  ->token=" + JSON.stringify(FL.login.token));def.resolve();}});return def.promise();}; //-------- END OF LOGIN WRAPPERS ------------------		
//-------- OTHER WRAPPERS ------------------		
var _getFullDictionary=function _getFullDictionary(){var def=$.Deferred();var fl=FL.fl; //new flMain();
if(!fl){ // FL.common.printToConsole("======================>ERROR ON _getFullDictionary ->no connection");
def.reject("ERROR: no connection available");}else {var fEnt=new fl.entity();fEnt.getAllWithField({"query":{}},function(err,entities){FL.common.printToConsole(".............................fEnt.getAllWithField ON _getFullDictionary"); // err = "abc";
if(err){ // alert("ERROR ON _getFullDictionary err="+err);
FL.common.printToConsole("======================>ERROR ON _getFullDictionary err=" + err);def.reject(err);}else {FL.common.printToConsole("=====================================>_getFullDictionary: OK ->entites=" + JSON.stringify(entities));def.resolve(entities);}});}return def.promise();};var _entity_update=function _entity_update(json){ //ex 	var removeTablePromise =_entity_update({query:{"_id":ecn},update:{$set:{"3":'$'+ecn} } });
var def=$.Deferred();var fl=FL.fl; //new flMain();
if(!fl){ // FL.common.printToConsole("======================>ERROR ON _getFullDictionary ->no connection");
return def.reject("ERROR: no connection available");}var fEnt=new fl.entity();fEnt.update(json,function(err,data){FL.common.printToConsole(".............................fEnt.update ON _getFullDictionary"); // err = "abc";
if(err){ // alert("ERROR ON _getFullDictionary err="+err);
FL.common.printToConsole("======================>ERROR ON _getFullDictionary err=" + err);return def.reject(err);}else {FL.common.printToConsole("=====================================>_entity_update: OK ");return def.resolve(data);}});return def.promise();};var _addWithFields=function _addWithFields(entityJSON){ //creates an entity with the fields in server, with one single call
var def=$.Deferred();var fl=FL.fl; //new flMain();
// var fl = new flMain();
// var fa = FL.login.token.fa;//new fl.app();
var fEntity=new fl.entity();fEntity.addWithFields(entityJSON,function(err,data){FL.common.printToConsole("............................._addWithFields...."); // err = "abc";
if(err){ // alert("ERROR ON _addWithFields err="+err);
FL.common.printToConsole("======================>ERROR ON _addWithFields err=" + err);def.reject("ERROR: _addWithFields err=" + err);}else {var entityName=entityJSON["3"]; //the same as oEntity.singular
var oEntity=FL.dd.getEntityBySingular(entityName);var eCN=data[0]["_id"];oEntity.csingular = eCN;for(var i=0;i < data[0].fields.length;i++) { //
FL.dd.setFieldCompressedName(entityName,data[0].fields[i].d["3"],data[0].fields[i]["_id"]); //xSingular,fieldName,fieldCN
}FL.dd.setSync(entityName,true);FL.common.printToConsole("=====================================>_addWithFields: OK " + entityName + " stored on server and local Dict in synch");def.resolve();}});return def.promise();};var _fieldUpdate=function _fieldUpdate(obj){ //updates a field with _id=field_id defined inside object obj with all field definitions
//obj - {_id:field_id,name_3:x1,description_4:x2,label_K:x3,type_M:x4,typeUI_9:x5,enumerable_N:x6} - all keys must be supplied
var def=$.Deferred();var fl=FL.fl; //new flMain();
// var fl = new flMain();
// var fa = FL.login.token.fa;//new fl.app();
var fField=new fl.field();var field_id=obj._id;fField.update({"query":{"_id":field_id},"update":{"3":obj.name_3,"4":obj.description_4,"K":obj.label_K,"M":obj.type_M,"9":obj.typeUI_9,"N":obj.enumerable_N,"O":obj.Nico_O}},function(err,data){FL.common.printToConsole("............................._fieldUpdate...."); // err = "abc";
if(err){ // alert("ERROR ON _addWithFields err="+err);
FL.common.printToConsole("======================>ERROR ON _fieldUpdate err=" + err);def.reject("ERROR: _fieldUpdate err=" + err);}else {FL.common.printToConsole("=====================================>_fieldUpdate: OK ");def.resolve(data);}});return def.promise();};var _fieldUpdateMultiple=function _fieldUpdateMultiple(arrOf_Obj){ //updates multiple fields
var def=$.Deferred();var promise=FL.API.queueManager("_fieldUpdate","ignored",arrOf_Obj);promise.done(function(result){return def.resolve(arrOf_IdToRemove.length);});promise.fail(function(err){return def.reject(err);});return def.promise();};var _userCreate=function _userCreate(userName,userPassWord,userType){ //username is always an email
// fl.userCreate({"adminName": "nico@framelink.co", "adminPassWord": "coLas", "userName": "toto@gmail.com", "userPassWord": "dodo12345", 
//		"userType": 'user'}, function (err, data){
var def=$.Deferred();var fl=FL.fl; //new flMain();
// if(!fl){
// 	fl = new flMain();
// }
// fl.userChangePassWord({"adminName":"nico@framelink.co", "adminPassWord":"coLas",
//	"userName":FL.login.token.userName, "userPassWord":password}, function(err, result){
fl.userCreate({"adminName":"nico@framelink.co","adminPassWord":"coLas","userName":userName,"userPassWord":userPassWord,"userType":userType},function(err,data){ //userType: user/clientAdmin/admin
FL.common.printToConsole("............................._userCreate....TO " + password); // err = "abc";
if(err){ // alert("ERROR ON _userCreate err="+err);
FL.common.printToConsole("======================>ERROR ON _userCreate err=" + err); // test if user already exists..
if(err = "Name already exists"){FL.login.token.userName = userName; // FL.login.token.userPassWord = userPassWord;
FL.fl = fl;FL.common.printToConsole("=====================================>_userCreate: OK user already exists  ->token=" + JSON.stringify(FL.login.token));def.resolve();}else {def.reject(err);}}else { // FL.login.token = {
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
FL.login.token.userName = userName;FL.login.token.userPassWord = userPassWord;FL.fl = fl;FL.common.printToConsole("=====================================>_userCreate: OK  ->token=" + JSON.stringify(FL.login.token));def.resolve();}});return def.promise();};var _restoreMainMenuStyleANDfontFamily=function _restoreMainMenuStyleANDfontFamily(){ //restores main menu, style and fontFamily
var def=$.Deferred();var fl=FL.fl; //new flMain();
// var fl = new flMain();
// var fa = FL.login.token.fa;//new fl.app();
FL.login.appToken = {"menu":null,"style":null,"fontFamily":null,"homePage":null,"error":null};var fd=new fl.data();fd.findOne("40",{"query":{"_id":1}},function(err,data){FL.common.printToConsole("............................._restoreMainMenuStyleANDfontFamily...."); // err = "abc";
if(err){ // alert("ERROR ON _addWithFields err="+err);
FL.login.appToken.error = "_restoreMainMenuStyleANDfontFamily err=" + err;FL.common.printToConsole("======================>ERROR ON " + FL.login.appToken.error);def.reject("ERROR: " + FL.login.appToken.error);}else {FL.common.printToConsole("=====================================>_restoreMainMenuStyleANDfontFamily: OK checks for nulls");var retData=null;var oMenu=FL.login.defaultMenu;var style=FL.login.defaultStyle;var fontFamily=FL.login.defaultFontFamily;if(!data){FL.common.printToConsole("=====================================>_restoreMainMenuStyleANDfontFamily: OK With null data");}else {if(!data.d){FL.common.printToConsole("=====================================>_restoreMainMenuStyleANDfontFamily: OK With null data.d");}else {if(data.d["45"]) //menu
oMenu = data.d["45"];if(data.d["46"]) //style
style = data.d["46"];if(data.d["47"]) //fontFamily
fontFamily = data.d["47"];FL.common.printToConsole("=====================================>_restoreMainMenuStyleANDfontFamily: OK ");}}retData = {oMenu:oMenu,style:style,fontFamily:fontFamily};FL.login.appToken.menu = oMenu;FL.login.appToken.style = style;FL.login.appToken.fontFamily = fontFamily;FL.login.appToken.homePage = null;FL.login.appToken.error = null;def.resolve(retData);}});return def.promise();};var insertMacrosOnHomePage=function insertMacrosOnHomePage(textHTML){ //only supports:<%= appDescription %>, <%= shortUserName %> and <%= userName %>
var templateFunction=_.template(textHTML);var pos=FL.login.token.userName.indexOf("@");var shortUserName=FL.login.token.userName.substring(0,pos);var templateArg={appDescription:FL.login.token.appDescription,userName:FL.login.token.userName,shortUserName:shortUserName};return templateFunction(templateArg);};var _restorePage=function _restorePage(){ //restores main menu, style and fontFamily
var def=$.Deferred();var fl=FL.fl; //new flMain();
var pagNo=getPageNo("home"); // var fl = new flMain();
// var fa = FL.login.token.fa;//new fl.app();
var fd=new fl.data();fd.findOne("43",{"query":{"_id":pagNo}},function(err,data){FL.common.printToConsole("............................._restorePage...."); // err = "abc";
if(err){ // alert("ERROR ON _addWithFields err="+err);
FL.common.printToConsole("======================>ERROR ON _restorePage err=" + err);def.reject("ERROR: _restorePage err=" + err);}else {var retData=insertMacrosOnHomePage(FL.login.defaultPage); // data = null;
if(!data){FL.common.printToConsole("=====================================>_restorePage: OK With null data");}else { // data.d = null;
if(!data.d){FL.common.printToConsole("=====================================>_restorePage: OK With null data.d");}else { // data.d.html = null;
if(!data.d.html){FL.common.printToConsole("=====================================>_restorePage: OK With null data.d.html");}else {retData = data.d.html;FL.common.printToConsole("=====================================>_restorePage: OK ");}}}def.resolve(retData);}});return def.promise();};var _saveMainMenuStyleANDfontFamily=function _saveMainMenuStyleANDfontFamily(){ //updates menu,style and fontFamily defined on FL.login.appToken. to server - inspired on FL.server.saveMainMenu
//it tries to update if it fails (because _id:1  does not exist) then inserts
var def=$.Deferred();var fl=FL.fl; //new flMain();
// var fl = new flMain();
// var fa = FL.login.token.fa;//new fl.app();
var fd=new fl.data();var oMenu=FL.login.appToken.menu; // instead of localStorage.storedMenu;//Retrieve last saved menu
var lastStyleStr=FL.login.appToken.style; // instead of localStorage.style;// Retrieve last saved style ex.red or spacelab
var lastFontFamilyStr=FL.login.appToken.fontFamily; //instead of localStorage.fontFamily;// Retrieve last saved fontFamily ex.impact or georgia
fd.update("40",{"query":{"_id":1},"update":{"45":oMenu,"46":lastStyleStr,"47":lastFontFamilyStr}},function(err,data){FL.common.printToConsole("............................._saveMainMenuStyleANDfontFamily...."); // err = "abc";
if(err){alert("======================>ERROR ON _saveMainMenuStyleANDfontFamily err=" + err);FL.API.serverCallBlocked = false;def.reject("ERROR: _saveMainMenuStyleANDfontFamily err=" + err);}else {if(data.count == 0){ //data.count == 0 =>we need to insert
FL.common.printToConsole("=====================================>_saveMainMenuStyleANDfontFamily: OK no existing record, we need to insert");fd.insert("40",{_id:1,d:{"45":oMenu,"46":lastStyleStr,"47":lastFontFamilyStr}},function(err,data){FL.API.serverCallBlocked = false;FL.common.printToConsole("............................._saveMainMenuStyleANDfontFamily...trying to insert..."); // err = "abc";
if(err){alert("======================>ERROR ON _saveMainMenuStyleANDfontFamily FAIL TO INSERT err=" + err);def.reject("ERROR: _saveMainMenuStyleANDfontFamily FAIL TO INSERT err=" + err);}else {FL.common.printToConsole("=====================================>_saveMainMenuStyleANDfontFamily: INSERTED OK ");def.resolve();}});}else {FL.API.serverCallBlocked = false;FL.common.printToConsole("=====================================>_saveMainMenuStyleANDfontFamily: OK ");def.resolve();}}});return def.promise();};var _saveHomePage=function _saveHomePage(){ //save page in FL.login.appToken.homePage - inspired in FL.server.savePage
var def=$.Deferred();var fl=FL.fl; //new flMain();
var pagNo=getPageNo("home"); // var fl = new flMain();
// var fa = FL.login.token.fa;//new fl.app();
var htmlContent=FL.login.appToken.homePage;var fd=new fl.data();fd.update("43",{"query":{"_id":pagNo},"update":{html:htmlContent}},function(err,data){FL.common.printToConsole("............................._saveHomePage...."); // err = "abc";
if(err){ // alert("ERROR ON _addWithFields err="+err);
FL.common.printToConsole("======================>ERROR ON _saveHomePage err=" + err);def.reject("ERROR: _saveHomePage err=" + err);}else {if(data.count == 0){ //data.count == 0 =>we need to insert
FL.common.printToConsole("=====================================>_saveHomePage: OK no existing record, we need to insert");fd.insert("43",{_id:pagNo,d:{html:htmlContent}},function(err,data){FL.common.printToConsole("............................._saveHomePage...trying to insert..."); // err = "abc";
if(err){FL.common.printToConsole("======================>ERROR ON _saveHomePage FAIL TO INSERT err=" + err);def.reject("ERROR: _saveHomePage FAIL TO INSERT err=" + err);}else {FL.common.printToConsole("=====================================>_saveHomePage: INSERTED OK ");def.resolve();}});}else {FL.common.printToConsole("=====================================>_saveHomePage: OK ");def.resolve();}}});return def.promise();};var rebuildsLocalDictionaryFromServer=function rebuildsLocalDictionaryFromServer(entities){ //interprets entity JSON received from server to local dd
FL.common.printToConsole("rebuildsLocalDictionaryFromServer xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx entities=" + entities + " xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");var sucess=null;var oEntity=null; // FL.common.printToConsole("&&&&&&&&&&&&&&&&&&& begin syncLocalDictionary &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
FL.dd.clear(); //clears local dictionary
// FL.common.printToConsole("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% after FL.dd.clear %%%%%%%%%%%%%%%%%");
// FL.dd.displayEntities();
// FL.common.printToConsole("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
// FL.common.printToConsole("--- *** Entities *** ---");
for(var i=0;i < entities.length;i++) { // FL.common.printToConsole("Entity eCN=" + entities[i]._id + " singular=" + entities[i].d["3"] );
success = FL.dd.createEntity(entities[i].d["3"],entities[i].d["4"]); //singular,description ex:("client","company we may invoice")
oEntity = FL.dd.entities[entities[i].d["3"]];oEntity.plural = entities[i].d["E"];oEntity.csingular = entities[i]._id; // FL.common.printToConsole("--- *** fields *** ---");
for(var fieldIndex=0;fieldIndex < entities[i].fields.length;fieldIndex++) { //boucle fields
// FL.common.printToConsole("--->field fCN=" + entities[i].fields[fieldIndex]._id + " fieldName=" + entities[i].fields[fieldIndex].d["3"] );
FL.dd.addAttribute(entities[i].d["3"],entities[i].fields[fieldIndex].d["3"],entities[i].fields[fieldIndex].d["4"],entities[i].fields[fieldIndex].d["K"],entities[i].fields[fieldIndex].d["M"],entities[i].fields[fieldIndex].d["9"],entities[i].fields[fieldIndex].d["N"]); //("order","shipped","expedition status","Shipped","boolean",null)
//addAttribute uses a local compressed name. Now we have to force the field compressed name comming from server								
FL.dd.setFieldCompressedName(entities[i].d["3"],entities[i].fields[fieldIndex].d["3"],entities[i].fields[fieldIndex]._id);} // FL.common.printToConsole("--- *** relations *** ---");
var rCN=null;var relationName=null;var withEntityCN=null;var side=null;var verb=null;var cardinality=null;var semantic=null;var storedHere=null;var relation=null;oEntity.relations = [];for(var relationIndex=0;relationIndex < entities[i].relations.length;relationIndex++) { //boucle relations
// FL.common.printToConsole("--->relation  rCN=" + entities[i].relations[relationIndex]._id );
relation = {};relation["rCN"] = entities[i].relations[relationIndex]._id;relation["withEntityCN"] = entities[i].relations[relationIndex].d["00"][0]["U"];relation["withEntity"] = null;relation["verb"] = entities[i].relations[relationIndex].d["00"][0]["V"];relation["cardinality"] = entities[i].relations[relationIndex].d["00"][0]["W"];relation["side"] = entities[i].relations[relationIndex].d["00"][0]["Z"];relation["storedHere"] = entities[i].relations[relationIndex].d["00"][0]["Y"]; //if true this is the side to read the relation from left to rigth
relation["semantic"] = null; //semantic = to be formed in local dictionary ex://"customer has many orders"
//FL.dd.addRelation(entities[i].d["3"],rCN,withEntity,verb,cardinality,side,storedHere);
//we cannot use addRelation() because withEntity is unknown here. we only know its compressed name = withEntityCN
//    because of this it is impossible to call FL.dd.relationSemantics
//    we need a second pass to fill withEntity and semantic
oEntity.relations.push(relation);}} //When we sync in a serial way we are creating relations before having the other side entity.
//Synchronizing relations needs 2 steps. Step 1 is done above saving  the auxiliary "withEntityCN" without filling "withEntity"
// - Step 2 is done below filling "withEntity" from "withEntityCN" (saved in step 1) and setting sync=true at entity level. 
FL.dd.relationPass2(); //goes thru all entities and for all relations of each entity fills withEntity and semantic using withEntityCN
// FL.dd.displayEntities();
// FL.common.printToConsole("&&&&&&&&&&&&&&&&&&&& end syncLocalDictionary &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
};var getPageNo=function getPageNo(pagName){ //to be used by savePage and restorePage
var pageNoObj={"home":1,"about":2};return pageNoObj[pagName];}; //-------- END OF OTHER WRAPPERS ------------------		
//-------- Exchage data WRAPPERS ------------------		
var _findAll=function _findAll(ecn,query,projection){ //entity compressed name
var def=$.Deferred();var fl=FL.fl; //new flMain();
var fd=new fl.data(); // var fl = new flMain();
// var fa = FL.login.token.fa;//new fl.app();
var findAllParam={};if(!query)findAllParam.query = {};else findAllParam.query = query;if(projection)findAllParam.projection = projection; // fd.findAll(ecn, {"query":query}, function(err, data){
fd.findAll(ecn,findAllParam,function(err,data){ // fd.findAll(ecn, {"query":query,"projection":projection}, function(err, data){
FL.common.printToConsole("............................._findAll..."); // err = "abc";
if(err){alert("ERROR ON _findAll err=" + err);FL.common.printToConsole("======================>ERROR ON _findAll err=" + err);def.reject(err);}else {FL.common.printToConsole("=====================================>_findAll: OK ");def.resolve(data); //data is an array
}});return def.promise();};var _nicoTestDuplicateIds=function _nicoTestDuplicateIds(arrToTest){ //checks if any of the  _id's value is repeated
var is_Duplicated=false;var testJSON={};_.each(arrToTest,function(element){if(!_.isUndefined(element["_id"])){if(!_.isUndefined(testJSON[element["_id"]])){is_Duplicated = true;}testJSON[element["_id"]] = "1"; //_ide is placed as key....
}});return is_Duplicated;};var _insert=function _insert(eCN,arrToSend){ //entity compressed name, arr with records to store
//format of arrToSend ->["_id":"1234",{"d":{"51":"cli1","52":"Lx","53":"Pt"}},{"d":{"51":"cli2","52":"Sintra","53":"Pt"}}]
var def=$.Deferred();var fl=FL.fl; //new flMain();
var fd=new fl.data(); // var fl = new flMain();
// var fa = FL.login.token.fa;//new fl.app();
// var testJSON = {};
// _.each(arrToSend,function(element){
// 	if(!_.isUndefined(element["_id"])){
// 		if( !_.isUndefined( testJSON[ element["_id" ] ] ) ){
// 			alert("FL.API _insert -> Repeated _id - protection to prevent server blockage activated !!!!");
// 			return def.reject("Duplicate _id -protection to prevent server blockage");
// 		}
// 		testJSON[element["_id"]] = "1";
// 	}
// });
if(_nicoTestDuplicateIds(arrToSend)){alert("FL.API _insert -> Repeated _id - protection to prevent server blockage activated !!!!");return def.reject("Duplicate _id -protection to prevent server blockage");}fd.insert(eCN,arrToSend,function(err,data){FL.common.printToConsole("............................._insert..."); // err = "abc";
if(err){alert("_insert: err=" + JSON.stringify(err)); // FL.common.printToConsole("======================>ERROR ON _insert err="+err);
return def.reject(err);}else {FL.common.printToConsole("=====================================>_insert: OK ");return def.resolve(data); //data is an array
}});return def.promise();};var _update=function _update(ecn,_idValue,jsonToSend){ //update a single row within table ecn entity compressed name, _idValue and jsonToSend (a single record)
//	format of jsonToSend ->{"51":"cli1","52":"Lx","53":"Pt"}
var def=$.Deferred();var fl=FL.fl; //new flMain();
var fd=new fl.data();fd.update(ecn,{"query":{"_id":_idValue},"update":jsonToSend,"options":{"upsert":true}},function(err,result){FL.common.printToConsole("............................._update....i_id=" + _idValue + " To ->" + JSON.stringify(jsonToSend));if(err){FL.common.printToConsole("======================>ERROR ON _update err=" + err);def.reject(err);}else {FL.common.printToConsole("=====================================>_update: OK " + result.count + " records were updated.");def.resolve(result.count);}});return def.promise();};var _remove=function _remove(ecn,_id){ //remove  a single row within table ecn (entity compressed name)
var def=$.Deferred();var fl=FL.fl; //new flMain();
var fd=new fl.data();fd.remove(ecn,{"query":{_id:_id}},function(err,result){ // FL.common.printToConsole("............................._remove....i_id="+_id);
if(err){FL.common.printToConsole("======================>ERROR ON _remove err=" + err);def.reject(err);}else {FL.common.printToConsole("=====================================>_remove: OK ");def.resolve(result);}});return def.promise();};var _removeAll=function _removeAll(ecn){ //remove  all rows of table ecn 
var def=$.Deferred();var fl=FL.fl; //new flMain();
var fd=new fl.data();fd.remove(ecn,{"query":{},options:{single:false}},function(err,result){if(err){FL.common.printToConsole("======================>ERROR ON _removeAll err=" + err);return def.reject(err);}else {FL.common.printToConsole("=====================================>_removeAll: OK ");return def.resolve(result);}});return def.promise();};var _removeMultiple=function _removeMultiple(ecn,arrOf_IdToRemove){ //remove  a single row within table ecn (entity compressed name)
var def=$.Deferred();var spinner=FL.common.loaderAnimationON("spinnerDiv");var promise=FL.API.queueManager("_remove",ecn,arrOf_IdToRemove);promise.done(function(result){spinner.stop();return def.resolve(arrOf_IdToRemove.length);});promise.fail(function(err){spinner.stop();return def.reject(err);});return def.promise();};var _dummy=function _dummy(ecn,_id){ //remove  a single row within table ecn (entity compressed name)
var def=$.Deferred();setTimeout(function(){FL.common.printToConsole("***********************************************************************************************");FL.common.printToConsole("**************************  _dummy-------------------->execution=" + _id);FL.common.printToConsole("***********************************************************************************************");def.resolve(1); // def.reject("dummy failure !");
},600);return def.promise();};var _queueManager=function _queueManager(funcName,param1,arrToDispatch){ //call a function each 200 milisecondsremove  a single row within table ecn (entity compressed name)
// calls the same asynchronous function several times assuring that after the first call all subsequent calls are done after a successfull completion of the previous call.
//   funcName = name of the function to be called...it must be in the list: _dummy,_remove,_fieldUpdate,updateAttribute
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
var def=$.Deferred(); // var param1=param1;
var numberOfEl=arrToDispatch.length;var delay=200; //time between tries to call promise
var counter=0; //number of well succeded calls
var refusedCounter=0; //number of refused calls
var maxRefused=200; //limit of refused - more than this limit =>error
var next=true;var intervalId=setInterval(function(){if(next){if(counter < numberOfEl){next = false;promise = null;if(funcName == "_dummy")promise = _dummy(param1,arrToDispatch[counter]);else if(funcName == "_remove")promise = _remove(param1,arrToDispatch[counter]);else if(funcName == "_fieldUpdate")promise = _fieldUpdate(arrToDispatch[counter]); //no constant parameter between calls
else if(funcName == "updateAttribute"){var changeObj=arrToDispatch[counter];promise = FL.dd.updateAttribute(changeObj.singular,changeObj.oldname,changeObj);}else {FL.common.printToConsole("***************************  execution=rejected !!! ->Invalid funcName=" + funcName);clearInterval(intervalId);return def.reject("function name ->" + funcName + " is INVALID.");}promise.done(function(result){counter += 1;if(counter == numberOfEl){clearInterval(intervalId);return def.resolve(counter);}next = true;});promise.fail(function(err){FL.common.printToConsole("***************************  execution=fail !!! ->" + funcName + " failure. Err=" + err);clearInterval(intervalId);return def.reject("Error in " + funcName + " err=" + err);});}}else {if(refusedCounter > maxRefused){clearInterval(intervalId);alert("queueManager ERROR more than " + maxRefused + " =>too many refusals.");return def.reject("Refusals max exceeded !");}FL.common.printToConsole("***********************************************************************************************");FL.common.printToConsole("***************************  step execution=refused -> " + counter + " --->" + arrToDispatch[counter]);FL.common.printToConsole("***********************************************************************************************");refusedCounter++;}},delay);return def.promise();};var _checkServerCallBlocked=function _checkServerCallBlocked(){ //waits until FL.API.serverCallBlocked is true or a limit is exceeded
var def=$.Deferred();if(FL.API.serverCallBlocked){var delay=100; //time between tries to check if FL.API.serverCallBlocked was set to false
var counter=0; //number of check attempts
var maxRefused=100; //limit of refused - more than this limit =>error
var intervalId=setInterval(function(){counter++;FL.common.printToConsole("_checkServerCallBlocked counter=" + counter + "/" + maxRefused,"checkServerCall");if(counter >= maxRefused){clearInterval(intervalId);FL.API.serverCallBlocked = false;return def.reject("_checkServerCallBlocked limit of tries exceeded ->counter=" + counter);}if(!FL.API.serverCallBlocked){clearInterval(intervalId);return def.resolve(counter);}},delay);}else {FL.common.printToConsole("No checkServerCallBlocked ->passed on first attempt","checkServerCall");return def.resolve();}return def.promise();};var convertRecordsTo_arrToSend=function convertRecordsTo_arrToSend(entityName,recordsArray,withId){ //used by saveTable()
//withId flag (default = false) if true all _id will be forced in the add.
//Converts format: [{"name":cli1,"city":"Lx","country":"Pt"},{..},....] to 
//	format of arrToSend ->[{"d":{"51":"cli1","52":"Lx","53":"Pt"}},{"d":{"51":"cli2","52":"Sintra","53":"Pt"}}]	
// or (if withId=true) Converts format: [{"_id":"3f1",name":cli1,"city":"Lx","country":"Pt"},{..},....] to 
//	format of arrToSend ->[{"_id":"3f1","d":{"51":"cli1","52":"Lx","53":"Pt"}},{"_id":"3f2","d":{"51":"cli2","52":"Sintra","53":"Pt"}}]	
var retArr=_.map(recordsArray,function(element){return convertOneRecordTo_arrToSend(entityName,element,withId);});return retArr;};var convertOneRecordTo_arrToSend=function convertOneRecordTo_arrToSend(entityName,recordEl,withId){ //withId flag (default = false) if true all _id will be forced in the add.
//Converts format: {"name":cli1,"city":"Lx","country":"Pt"} to {"d":{"51":"cli1","52":"Lx","53":"Pt"}}  OR
//				{"_id":"3f1",name":cli1,"city":"Lx","country":"Pt"} to {"_id":"3f1","d":{"51":"cli1","52":"Lx","53":"Pt"} if withId=true
var retObj={};var fCN=null;var oEntity=FL.dd.getEntityBySingular(entityName);if(withId)var _id=recordEl._id;recordEl = _.omit(recordEl,"_id");_.each(recordEl,function(value,key){fCN = oEntity.L2C[key]; //with key ( a logical name) we get the compressed name
retObj[fCN] = value;});if(withId)return {"_id":_id,d:retObj,r:[]};return {d:retObj,r:[]};};var _mandrillRejectListForSender=function _mandrillRejectListForSender(senderEmail){ //update a single row within table ecn entity compressed name, _idValue and jsonToSend (a single record)
//	format of jsonToSend ->{"51":"cli1","52":"Lx","53":"Pt"}
var def=$.Deferred();var fl=FL.fl; //new flMain();
// var fd = new fl.data();
var md=new fl.mandrill();md.rejectList({include_expired:true,sender:senderEmail},function(err,data){FL.common.printToConsole("............................._mandrillRejectListForSender....result=" + JSON.stringify(data));if(err){FL.common.printToConsole("======================>ERROR ON _mandrillRejectListForSender err=" + err);def.reject(err);}else {FL.common.printToConsole("=====================================>_mandrillRejectListForSender: OK ");def.resolve(data);}});return def.promise();};var _mandrillDeleteFromReject=function _mandrillDeleteFromReject(arrayOfEmails){ //update a single row within table ecn entity compressed name, _idValue and jsonToSend (a single record)
//	format of jsonToSend ->{"51":"cli1","52":"Lx","53":"Pt"}
var def=$.Deferred();var fl=FL.fl; //new flMain();
// var fd = new fl.data();
var md=new fl.mandrill();md.rejectDelete({email:arrayOfEmails[0]},function(err,data){FL.common.printToConsole("............................._mandrillDeleteFromReject....->" + JSON.stringify(data));if(err){FL.common.printToConsole("======================>ERROR ON _mandrillDeleteFromReject err=" + err);def.reject(err);}else {FL.common.printToConsole("=====================================>_mandrillDeleteFromReject: OK deleted=" + data.deleted);FL.common.printToConsole("............................._mandrillDeleteFromReject...SUCCESS .->" + JSON.stringify(data));def.resolve();}});return def.promise();};var _test=function _test(){FL.common.printToConsole("--- test ----");}; //-------- END OF OTHER WRAPPERS ------------------		
return {xx:"test",fl:new flMain(), //FL.server.fl
fa:null,data:{},offline:true,trace:true, //to be removed
debug:true, //if it is false  no console log will be shown
debugStyle:0, // 0=>means shows numbers to jump to, 1=> no line Numbers to jump to (this only works if debug=true)
// getPageNo: function(pagName){ //to be used by savePage and restorePage
//	var pageNoObj = {"home":1,"about":2};
//	return  pageNoObj[pagName];
// },
debugFiltersToShow:null,serverCallBlocked:false, //HACK to prevent server call (menu calling a grid) before last call is dispatched (ex:cell update) - a promise must be resolved to unblock
clearServerToken:function clearServerToken(){FL.login.token = tokenClear();},convertOneRecordTo_arrToSend:(function(_convertOneRecordTo_arrToSend){function convertOneRecordTo_arrToSend(_x,_x2){return _convertOneRecordTo_arrToSend.apply(this,arguments);}convertOneRecordTo_arrToSend.toString = function(){return _convertOneRecordTo_arrToSend.toString();};return convertOneRecordTo_arrToSend;})(function(entityName,recordEl){return convertOneRecordTo_arrToSend(entityName,recordEl);}),queueManager:function queueManager(funcName,param1,arrToDispatch){return _queueManager(funcName,param1,arrToDispatch);},checkServerCallBlocked:function checkServerCallBlocked(){return _checkServerCallBlocked();},convertArrC2LForEntity:function convertArrC2LForEntity(entityName,serverArr){ //serverArr =>[{"_id":123,d:{},r:[]},{"_id":124,d:{},r:[]},....{"_id":125,d:{},r:[]}]
//Use the dictionary for entityName to convert compressed field names in keys in serverArr to logical field names
//Ex: from server [{"d":{"01":true,"02":"Super 1","00":1},"r":[]},{"d":{"01":false,"02":"Super 2","00":2},"r":[]}]
//     ==============> [{"_id":123,id:1,"shipped":true,"product":"Super 1","id":1},{"_id":124,id:2,"shipped":false,"product":"Super 2","id":2}]	
// If serverArr elements inside d object have no compressed name corresponding to "id" in local dictionary, id will be added
// if serverArr elements have a "_id" property/value "_id" will be included in the return array 
var oEntity=FL.dd.getEntityBySingular(entityName);var arrOfCKeys=null;var arrOfValues=null;var arrOfLKeys=null;var dContent=null;var el=null;var index=1;var retArr=_.map(serverArr,function(element){ //each element is JSON =>{"_id":123,d:{},r:[]}
dContent = element.d; //only d will be processed. d is a JSON ex.=>{ "62":1, "63":true,"64":"Super 1" }
arrOfCKeys = _.keys(dContent); //ex. ["62","63","64"]
arrOfValues = _.values(dContent); //ex. [1,true,"Super1"]
arrOfLKeys = _.map(arrOfCKeys,function(element2){var logicalName=oEntity.C2L[element2]; // return oEntity.C2L[element2]; 
return logicalName;});el = _.object(arrOfLKeys,arrOfValues); //reassembles the object from two aligned arrays
if(!el.id)el["id"] = index;index++;if(element._id)el["_id"] = element._id;return el;});return retArr;},prepareTrialApp:function prepareTrialApp(){ ///create adHoc client, create adHoc user, create adHoc app 
var def=$.Deferred(); // var fl = new flMain();//FL.server.fl
var fl=FL.fl;FL.common.printToConsole("....................................>beginning prepareTrialApp....");var prepareTrialAppPromise=_applicationFullCreate({"adminName":"nico@framelink.co","adminPassWord":"coLas"}).then(_login).then(_connect);prepareTrialAppPromise.done(function(){FL.common.printToConsole(">>>>> prepareTrialAppPromise SUCCESS <<<<<");def.resolve();});prepareTrialAppPromise.fail(function(err){FL.common.printToConsole(">>>>> prepareTrialAppPromise FAILURE <<<<<");def.reject(err);});return def.promise(); // to generate unique userName
// var seconds = new Date().getTime() / 1000;
// var userName = "toto"+ seconds;
},removeClientWithOneApp:function removeClientWithOneApp(){ //remove client, remove user, remove app - only works for subscribers with a single app
FL.common.printToConsole("....................................>beginning removeClientWithOneApp....with token=" + JSON.stringify(FL.login.token));var def=$.Deferred();var removeClientWithOneAppPromise=_disconnect().then(_applicationRemove).then(_clientRemove);removeClientWithOneAppPromise.done(function(){FL.common.printToConsole(">>>>> removeClientWithOneApp SUCCESS <<<<<");def.resolve();});removeClientWithOneAppPromise.fail(function(){FL.common.printToConsole(">>>>> removeClientWithOneApp FAILURE <<<<<");def.reject();});return def.promise();},removeTrialApp:function removeTrialApp(){ //remove client, remove user, remove app - only works for subscribers with a single app
FL.common.printToConsole("....................................>beginning removeTrialApp....with token=" + JSON.stringify(FL.login.token));var def=$.Deferred();var removeTrialAppPromise=_disconnect().then(_applicationRemove).then(_clientRemove);removeTrialAppPromise.done(function(){FL.common.printToConsole(">>>>> removeTrialApp SUCCESS <<<<<");def.resolve();});removeTrialAppPromise.fail(function(){FL.common.printToConsole(">>>>> removeTrialApp FAILURE <<<<<");def.reject();});return def.promise();},registerTrialApp:function registerTrialApp(userName,password,appDescription){ //change adHoc client name, user name, passordd and appDescrition 
FL.common.printToConsole("....................................>beginning registerTrialApp....with token=" + JSON.stringify(FL.login.token));var def=$.Deferred(); // var registerTrialApp=_applicationFinalize(userName,appDescription).then(function(){_userChangePassWord(password);});
var registerTrialApp=_applicationFinalize(userName,appDescription).then(function(){return _userChangePassWord(password);});registerTrialApp.done(function(){FL.common.printToConsole(">>>>> registerTrialApp SUCCESS <<<<<");def.resolve();});registerTrialApp.fail(function(err){FL.common.printToConsole(">>>>> registerTrialApp FAILURE <<<<< " + err);def.reject(err);});return def.promise();},removeUserAndApps:function removeUserAndApps(userName,password){ //remove client, remove user, remove app 
FL.common.printToConsole("....................................>beginning removeUserAndApps....with token=" + JSON.stringify(FL.login.token));var def=$.Deferred();FL.login.token.userName = userName;FL.login.token.userPassWord = password;FL.login.token.domainName = "xxx";var removeUserAndAppsPromise=_login().then(_applicationRemove).then(_clientRemove);removeUserAndAppsPromise.done(function(){FL.common.printToConsole(">>>>> removeUserAndApps SUCCESS <<<<<");def.resolve();});removeUserAndAppsPromise.fail(function(){FL.common.printToConsole(">>>>> removeUserAndApps FAILURE <<<<<");def.reject();});return def.promise();},createUserAndDefaultApp:function createUserAndDefaultApp(userName,userPassWord,appDescription){ ///creates a client, create user and create first app 
var def=$.Deferred();FL.common.printToConsole("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%"); // var fl = new flMain();//FL.server.fl
var fl=FL.fl; // var fa = new fl.app();
// fl.setTraceClient(2);
// def.fail(function(){
// 	alert("error on connectAdHocUser ! ");
// });
if(!appDescription)appDescription = "my App";FL.common.printToConsole("....................................>beginning createUserAndDefaultApp....");var createUserAndDefaultAppPromise=_applicationFullCreate({"adminName":"nico@framelink.co","adminPassWord":"coLas",userName:userName,userPassWord:userPassWord,appDescription:appDescription}).then(_login).then(_connect);createUserAndDefaultAppPromise.done(function(){FL.common.printToConsole(">>>>> createUserAndDefaultAppPromise SUCCESS <<<<<");FL.common.printToConsole("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");return def.resolve();});createUserAndDefaultAppPromise.fail(function(err){FL.common.printToConsole(">>>>> createUserAndDefaultAppPromise FAILURE <<<<<");FL.common.printToConsole("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");return def.reject(err);});return def.promise(); // to generate unique userName
// var seconds = new Date().getTime() / 1000;
// var userName = "toto"+ seconds;
},disconnect:function disconnect(){ //change adHoc client name, user name, passordd and appDescrition 
FL.common.printToConsole("....................................>beginning disconnect....current token=" + JSON.stringify(FL.login.token));var def=$.Deferred();var disconnect=_disconnect();disconnect.done(function(){FL.common.printToConsole(">>>>> disconnect SUCCESS <<<<<");FL.login.token = tokenClear();return def.resolve();});disconnect.fail(function(err){FL.common.printToConsole(">>>>> disconnect FAILURE <<<<< " + err);return def.reject(err);});return def.promise();},connectUserToDefaultApp:function connectUserToDefaultApp(userName,password){ //
//if userName/password exists but has no application, one application is created
// FL.common.printToConsole("....................................>beginning connectUserToDefaultApp....with token="+JSON.stringify(FL.login.token));
FL.common.printToConsole("....................................>beginning connectUserToDefaultApp....");var def=$.Deferred();var tokenBackup=FL.login.token; //if it fails we will recover the initial token with this backup
var fl=null;var fa=null; // if (FL === null || FL.login === null || FL.login.token === null){//FL.login.token is null
// if (FL.login === null || FL.login.token === null){//FL.login.token is null
if(FL.fl === null){ //FL.login.token is null
alert("connectUserToDefaultApp ->FL.fl === null !!!!");fl = new flMain();fa = new fl.app();FL.login.token["fl"] = fl;FL.login.token["fa"] = fa;}else { //FL.login.token exists
if(FL.fl){fl = FL.fl; //new flMain();
}else {fl = new flMain();}fa = new fl.app();FL.login.token["fl"] = fl;FL.login.token["fa"] = fa;}FL.login.token.userName = userName;FL.login.token.userPassWord = password;var connectUserToDefaultApp=_login().then(_connect);connectUserToDefaultApp.done(function(){FL.common.printToConsole(">>>>> connectUserToDefaultApp SUCCESS <<<<<");def.resolve();});connectUserToDefaultApp.fail(function(err){if(err == "no application available"){ //we will try to recover the error creating one application
// alert("Recovering from no application");
FL.common.printToConsole("....................................>connectUserToDefaultApp....Recovering from no application...");var applicationCreatePromise=_applicationCreate("automatic sample");applicationCreatePromise.done(function(){FL.common.printToConsole("....................................>connectUserToDefaultApp applicationCreate DONE");def.resolve();});applicationCreatePromise.fail(function(err){FL.common.printToConsole("....................................>connectUserToDefaultApp applicationCreate FAIL");def.reject("ERROR:connectUserToDefaultApp ->applicationCreate FAIL err=" + err);});}else {FL.common.printToConsole(">>>>> connectUserToDefaultApp FAILURE <<<<< Error:" + err);FL.login.token = tokenBackup;def.reject(err);}});return def.promise();},isConnected:(function(_isConnected){function isConnected(){return _isConnected.apply(this,arguments);}isConnected.toString = function(){return _isConnected.toString();};return isConnected;})(function(){ //returns true if is connected, false otherwise
isConnected = false;var tk=FL.login.token["fl"];var conn=null;if(tk){conn = tk.getsId(); //flMain.getsId() - it will return a number if it is connected
// FL.common.printToConsole("FL.API.isConnected() -->conn="+conn);
if(!isNaN(conn))isConnected = true;}return isConnected;}),isUserExist:function isUserExist(userName){var def=$.Deferred();FL.common.printToConsole("....................................>beginning isUserExist....with token=" + JSON.stringify(FL.login.token),"API");var isUserExistPromise=_isUserExist(userName);isUserExistPromise.done(function(exists){FL.common.printToConsole(">>>>> isUserExist SUCCESS <<<<< exist=" + exists,"API");return def.resolve(exists);});isUserExistPromise.fail(function(err){FL.common.printToConsole(">>>>> isUserExist FAILURE <<<<<","API");return def.reject(err);});return def.promise();},temporaryRebuildsLocalDictionaryFromServer:function temporaryRebuildsLocalDictionaryFromServer(entities){ // FL.common.printToConsole("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx entities=" + entities + " xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
FL.common.printToConsole("xxxxxxxxx #$%#%#%5 xxxxxxx");},syncLocalDictionary:function syncLocalDictionary(){ //clears local dictionary and updates it from server dictionary
FL.common.printToConsole("....................................>beginning syncLocalDictionary....with token=" + JSON.stringify(FL.login.token));var def=$.Deferred(); //_getFullDictionary->FL.dd.clear()->rebuildsLocalDictionary()
// temporaryRebuildsLocalDictionaryFromServer("ABC");
// _test();
var syncLocalDictionary=_getFullDictionary();syncLocalDictionary.done(function(entities){FL.common.printToConsole(">>>>> syncLocalDictionary SUCCESS <<<<< entities=" + entities);FL.dd.clear();if(entities){FL.common.printToConsole(">>>>> syncLocalDictionary -> does temporaryRebuildsLocalDictionaryFromServer(entities)");rebuildsLocalDictionaryFromServer(entities); //interprets entity JSON received from server to local dd
// FL.common.printToConsole("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% after rebuildsLocalDictionaryFromServer %%%%%%%%%%%%%%%%%");
FL.dd.displayEntities();}else {FL.common.printToConsole(">>>>> syncLocalDictionary -> dictionary is empty in server");}return def.resolve();});syncLocalDictionary.fail(function(err){FL.common.printToConsole(">>>>> syncLocalDictionary FAILURE <<<<< " + err);def.reject();});return def.promise();},prepareJSONFromLocalEntity:function prepareJSONFromLocalEntity(entityName){ //prepares JSON with entity and fields to be sent to _addWithFields
var oEntity=FL.dd.getEntityBySingular(entityName);var eCN=null;var entityJSON={"3":oEntity.singular,"4":oEntity.description,"E":oEntity.plural,fields:[]};for(var i=0;i < oEntity.attributes.length;i++) { //mounts field array
var attribute=oEntity.attributes[i]; // var attrJSON = {"3":attribute.name, "4":attribute.description, 'K': attribute.label, 'M': attribute.type, 'O':false,'N':attribute.enumerableArr};
var attributeType=attribute.type; // if(attributeType == "enumerable")
//	attributeType = "string";
var attrJSON={"3":attribute.name,"4":attribute.description,"K":attribute.label,"9":attribute.typeUI,"M":attribute.type,"O":false,"N":attribute.enumerable}; //"O" - attribute.repetable
entityJSON.fields.push(attrJSON);}return entityJSON;},syncLocalDictionaryToServer:function syncLocalDictionaryToServer(entityName){ //synch table entityName existing in local dictionary with server dict
// entityName - singular name as it is in local dd
FL.common.printToConsole("....................................>beginning syncLocalDictionaryToServer....with token=" + JSON.stringify(FL.login.token));var def=$.Deferred();var entityJSON=this.prepareJSONFromLocalEntity(entityName); // alert("entityJSON = "+JSON.stringify(entityJSON));
var addWithFields=_addWithFields(entityJSON);addWithFields.done(function(){FL.common.printToConsole(">>>>> syncLocalDictionaryToServer SUCCESS <<<<<");return def.resolve();});addWithFields.fail(function(err){FL.common.printToConsole(">>>>> syncLocalDictionaryToServer FAILURE <<<<< " + err);return def.reject();});return def.promise();},updateDictionaryEntityProperties:function updateDictionaryEntityProperties(eCN,oProperties){ //works with FL.dd.updateEntityBySingular to update singular,plural and description properties to server
//ex:updateDictionaryEntityProperties("50",{singular:singular,plural:xPlural,description:description});entityName,{singular:singular,plural:xPlural,description:description});
var def=$.Deferred();var propertiesJSON={query:{"_id":eCN},update:{$set:{"3":oProperties.singular,"E":oProperties.plural,"4":oProperties.description}}};var entityUpdatePromise=_entity_update(propertiesJSON);entityUpdatePromise.done(function(result){FL.common.printToConsole(">>>>> updateDictionaryEntityProperties SUCCESS count=" + result + "<<<<<");return def.resolve(result);});entityUpdatePromise.fail(function(err){FL.common.printToConsole(">>>>> updateDictionaryEntityProperties FAILURE <<<<< " + err);return def.reject(err);});return def.promise();},updateDictionaryAttribute:function updateDictionaryAttribute(fCN,oAttribute){ //works with FL.dd.updateAttribute to update attribute to server
var def=$.Deferred();var attrJSON={"_id":fCN,"name_3":oAttribute.name,"description_4":oAttribute.description,"label_K":oAttribute.label,"typeUI_9":oAttribute.typeUI,"type_M":oAttribute.type,"enumerable_N":oAttribute.enumerable,"Nico_P":[oAttribute.specialTypeDef],"Nico_O":false};var fieldUpdatePromise=_fieldUpdate(attrJSON);fieldUpdatePromise.done(function(result){FL.common.printToConsole(">>>>> updateDictionaryAttribute SUCCESS <<<<<");return def.resolve(result);});fieldUpdatePromise.fail(function(err){FL.common.printToConsole(">>>>> updateDictionaryAttribute FAILURE <<<<< " + err);return def.reject(err);});return def.promise();},updateDictionaryAllAttributes:function updateDictionaryAllAttributes(entityName,singular,description,newAttributesArr){ //updates the dict with all content related to table
// entityName - original entity name to be updated
// singular - new entity  name (eventually the same as entityName )
// description - new entity description
// newAttributesArr - new array of objects each element corresponding to a diferent attribute - and extra key: oldName must be included with the old attribute Name
//		ex: {name:"address",description:"address to send invoices",label:"Address",type:"string",typeUI:"textbox",enumerable:null,key:false,oldName:"Address"}
// if it fails the dictionary  it is not rolled back - the roll back task must be done above this code (ex.FLGrid2 updateDictionaryAndTypesInServer)
var def=$.Deferred();var xPlural=FL.dd.plural(singular,"En"); //+"s";
var updatePromise=FL.dd.updateEntityBySingular(entityName,{singular:singular,plural:xPlural,description:description});updatePromise.done(function(result){FL.common.printToConsole(">>>>> updateEntityBySingular SUCCESS count=" + result + "<<<<<","API"); // return def.resolve(result);});
var bufferChangeObjs=[];_.each(newAttributesArr,function(element){ //change type based on old attributes
if(element.name != "id"){var changeObj={name:element.name,description:element.description,label:element.label,type:element.type,typeUI:element.typeUI,enumerable:element.enumerable};changeObj["singular"] = singular;changeObj["oldname"] = element.oldName;bufferChangeObjs.push(changeObj);}},this);var promise=FL.API.queueManager("updateAttribute","dummy",bufferChangeObjs);promise.done(function(result){FL.dd.setSync(entityName,true);return def.resolve(result);});promise.fail(function(err){return def.reject(err);});});updatePromise.fail(function(err){FL.common.printToConsole(">>>>> updateEntityBySingular  FAILURE <<<<< " + err,"API");return def.reject(err);});return def.promise();},loadAppDataForSignInUser2:function loadAppDataForSignInUser2(){ //loads (local dict + menu + style + fontFamily) from server
FL.common.printToConsole("....................................>beginning loadAppDataForSignInUser2....with token=" + JSON.stringify(FL.login.token));var def=$.Deferred(); //syncLocalDictionary ->restoreMainMenu  if it succeds -> restorePage
var loadAppDataForSignInUser=FL.API.syncLocalDictionary().then(_restoreMainMenuStyleANDfontFamily);loadAppDataForSignInUser.done(function(menuData){ //data dictionary was loaded + menu was loaded
FL.dd.displayEntities();var oMenu=FL.login.appToken.menu; //or menuData.oMenu
var style=FL.login.appToken.style; //or menuData.style
var fontFamily=FL.login.appToken.fontFamily; //or menuData.fontFamily
var homePage=null; //or menuData.oMenu
FL.common.printToConsole(">>>>> loadAppDataForSignInUser2 SUCCESS loading menu+style+font <<<<< style=" + style + " font=" + fontFamily + "\nmenu=" + JSON.stringify(oMenu));var homePagePromise=_restorePage();homePagePromise.done(function(homeHTML){var appDescription=FL.login.token.appDescription; // FL.login.appToken.homePage = homeHTML;
FL.login.appToken.homePage = insertMacrosOnHomePage(homeHTML); //only supports:<%= appDescription %>, <%= shortUserName %> and <%= userName %>
FL.common.printToConsole(">>>>> loadAppDataForSignInUser2 FULL SUCCESS <<<<< appToken=" + JSON.stringify(FL.login.appToken));def.resolve(menuData,FL.login.appToken.homePage,appDescription);});homePagePromise.fail(function(err){FL.common.printToConsole(">>>>> loadAppDataForSignInUser2 FAILURE <<<<< error retrieving Home page error=" + err);def.reject();});});loadAppDataForSignInUser.fail(function(err){FL.common.printToConsole(">>>>> loadAppDataForSignInUser2 FAILURE <<<<<" + err);def.reject();});return def.promise();},setHomePage:function setHomePage(homeHTML){FL.login.appToken.homePage = homeHTML;},setMenu:function setMenu(oMenu){FL.login.appToken.menu = oMenu;},setStyle:function setStyle(style){FL.login.appToken.style = style;},setFontFamily:function setFontFamily(fontFamily){FL.login.appToken.fontFamily = fontFamily;},saveHomePage:function saveHomePage(homeHTML){ //
//can be used without parameter (it will use FL.login.appToken.homePage ) or with parameter
if(homeHTML)FL.login.appToken.homePage = homeHTML;FL.common.printToConsole("....................................>beginning saveHomePage....with appToken=" + JSON.stringify(FL.login.appToken));var def=$.Deferred();var saveHomePage=_saveHomePage();saveHomePage.done(function(){FL.common.printToConsole(">>>>> saveHomePage SUCCESS <<<<< ");def.resolve();});saveHomePage.fail(function(err){FL.common.printToConsole(">>>>> saveHomePage FAILURE <<<<<" + err);def.reject();});return def.promise();},save_Menu_style_fontFamily:function save_Menu_style_fontFamily(){ //
//it will use FL.login.appToken.oMenu, FL.login.appToken.style, and FL.login.appToken.fontFamily,
FL.common.printToConsole("....................................>beginning save_Menu_style_fontFamily....with appToken=" + JSON.stringify(FL.login.appToken));var def=$.Deferred();var save_Menu_style_fontFamily=_saveMainMenuStyleANDfontFamily();save_Menu_style_fontFamily.done(function(){FL.common.printToConsole(">>>>> save_Menu_style_fontFamily SUCCESS <<<<< ");def.resolve();});save_Menu_style_fontFamily.fail(function(err){FL.common.printToConsole(">>>>> save_Menu_style_fontFamily FAILURE <<<<<" + err);def.reject(err);});return def.promise();},loadDefaultApp:function loadDefaultApp(loginObject){ //returns menuData,homeHTML for user loginObject or 
//																err={code:<[1,2,3,4]>,message:<error message>}	
//	1-user not existing  2-isUserExist faillure  3-connectUserToDefaultApp faillure  
//	4-loadAppDataForSignInUser2 faillure 5-wrong password on existing user
//  Check if user exists with FL.API.isUserExist
//		if it exists => FL.API.connectUserToDefaultApp
//			if it is connected  =>FL.API.loadAppDataForSignInUser2  =>loads dd and returns menuData and homeHTML
//				Now we have the dictionary loaded and objects menuData and homeHTML
var def=$.Deferred();FL.common.printToConsole("....................................>beginning loadDefaultApp....","API");var existingUserPromise=FL.API.isUserExist(loginObject.email);existingUserPromise.done(function(exist){if(exist){ //the user exists
FL.common.printToConsole(loginObject.email + " exists !!!!","login");var setupExistingUserPromise=FL.API.connectUserToDefaultApp(loginObject.email,loginObject.password);setupExistingUserPromise.done(function(){var loadAppPromise=FL.API.loadAppDataForSignInUser2(); //gets data dictionary + main menu + style + fontFamily + home page
loadAppPromise.done(function(menuData,homeHTML){return def.resolve(menuData,homeHTML);});loadAppPromise.fail(function(err){FL.common.printToConsole("loadAppDataForSignInUser2 FAILURE  <<<<< error=" + err,"API");return def.reject({code:4,message:"loadAppDataForSignInUser2 FAILURE  <<<<< error=" + err});});});setupExistingUserPromise.fail(function(err){if(err.indexOf("Access denied") >= 0){ //user exist but password is wrong
return def.reject({code:5,message:"wrong password for existing user"});}else {FL.common.printToConsole("connectUserToDefaultApp FAILURE  <<<<< error=" + err,"API");return def.reject({code:3,message:"connectUserToDefaultApp FAILURE  <<<<< error=" + err});}});}else { //user does not exist !!!
FL.common.printToConsole("FL.API.loadDefaultApp >>>>> user " + loginObject.email + " does not exist !","API");return def.reject({code:1,message:"user " + loginObject.email + " does not exist !"});}});existingUserPromise.fail(function(err){FL.common.printToConsole("FL.API.loadDefaultApp >>>>> isUserExist FAILURE Service no accessible<<<<<","API");return def.reject({code:2,message:"isUserExist FAILURE"});});return def.promise();},loadDefaultAppByAPI_Key:function loadDefaultAppByAPI_Key(API_Key){ //returns menuData,homeHTML for API_key or 
//																err={code:<[1,2,3,4]>,message:<error message>}	
//	1-user not existing  2-isUserExist faillure  3-connectUserToDefaultApp faillure  4-loadAppDataForSignInUser2 faillure				
// API_Key - is the database access key
var def=$.Deferred();FL.common.printToConsole("....................................>beginning loadDefaultAppByAPI_Key....","API");var pairString=FL.common.enc(API_Key,-1); //pairString is "{email:x1,password:x2}". Encripted with API_Key = FL.common.enc(pairString,1);
var loginObject=JSON.parse(pairString);var loadDefaultAppPromise=FL.API.loadDefaultApp(loginObject).then(function(menuData,homeHTML){return def.resolve(menuData,homeHTML);},function(err){return def.reject(err);});return def.promise();},generateAPI_key:function generateAPI_key(loginObject){ //loginObject has format {email:x1,password:x3,domain:x4};->domain key is optional 
return FL.common.enc(JSON.stringify(loginObject),1);},removeTable:function removeTable(entityName){ //remove existing or unexisting table - after this we are sure that table does not exist
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
FL.common.printToConsole("........>beginning removeTable....with appToken=" + JSON.stringify(FL.login.appToken));var def=$.Deferred(); //forces synch from server to be sure 
var ecn=FL.dd.getCEntity(entityName);if(ecn === null){FL.common.printToConsole("........FL.API.removeTable() table=" + entityName + " not in local dict -> not necessary to remove it");return def.resolve(); //not necessary to remove a table not existing in local dict
}else { //the table exists in local dict but may be unsynchronized
var oEntity=FL.dd.entities[entityName];if(oEntity.sync){ //table exists and is in sync with server	
FL.common.printToConsole("........FL.API.removeTable() table=" + entityName + " is sync with local dict -> will be removed form server");var removeTablePromise=_entity_update({query:{"_id":ecn},update:{$set:{"3":"$" + ecn}}});removeTablePromise.then(function(){return def.resolve();},function(err){return def.reject(err);});}else { //table in local dict but may exist in server (if no synch was done...)
FL.common.printToConsole("........FL.API.removeTable() table=" + entityName + " is in local dict but unsync with server -> we force a synchronization");var syncPromise=FL.API.syncLocalDictionary();syncPromise.done(function(){var ecnAfterSync=FL.dd.getCEntity(entityName);if(ecnAfterSync === null){ //entity name does not exists in the server
FL.common.printToConsole("........FL.API.removeTable() table=" + entityName + " not in server dict -> not necessary to remove it");FL.dd.entities[entityName] = oEntity;return def.resolve(); //not necessary to remove a table not existing table in server
}else { //entity name exists in the server
//we need to remove the table from the server 
FL.common.printToConsole("........FL.API.removeTable() table=" + entityName + " not in sync with local dict but exists in server -> will be removed form server");var removeTablePromise=_entity_update({query:{"_id":ecn},update:{$set:{"3":"$" + ecn}}});removeTablePromise.then(function(){return def.resolve();},function(err){return def.reject(err);}); //because FL.API.syncLocalDictionary() cleared the local dictionary we need to add oEntity to the local dict
FL.dd.entities[entityName] = oEntity;return def.resolve(); //Table was removed from server and unsynched <entityName> was resetted in local dict.
}});syncPromise.fail(function(){return def.reject();});}}return def.promise();},saveTable:function saveTable(entityName,recordsArray){ //creates a table (overriding any existing one) and saves a set of records in it
//assumes a login to an application exists - if table is not in synch it synchs it
//recordsArray [{"number":12,"code":"abc"},....]
//returns array with input data and _id for each record
FL.common.printToConsole("....................................>beginning saveTable....with appToken=" + JSON.stringify(FL.login.appToken));var def=$.Deferred();var ecn=FL.dd.getCEntity(entityName); //begins by removeTable, then sync local dict  to server, then inserting lines
// var remove_synch = FL.API.removeTable(entityName).then(FL.API.syncLocalDictionaryToServer(entityName));
// var remove_synch = FL.API.removeTable(entityName).then(FL.API.syncLocalDictionaryToServer(entityName));
FL.API.removeTable(entityName).then(function(){return FL.API.syncLocalDictionaryToServer(entityName);}).then(function(){ecn = FL.dd.getCEntity(entityName);FL.common.printToConsole(">>>>>saveTable --> remove and synch SUCCESS <<<<<");FL.common.printToConsole("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");var arrToSend=convertRecordsTo_arrToSend(entityName,recordsArray);FL.common.printToConsole("saveTable --->" + JSON.stringify(arrToSend));FL.common.printToConsole("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");insertPromise = _insert(ecn,arrToSend);insertPromise.then(function(data){FL.common.printToConsole(">>>>>saveTable Ok");return def.resolve(data);},function(err){return def.reject(err);}); //data has the format:
// [{"d":{"55":"Jojox","56":"123"},"v":0,"_id":"546963669b04c9107942d32d"},{"d":{"55":"Anton","56":"456"},"v":0,"_id":"546963669b04c9107942d32e"}]
// return def.resolve();
}).fail(function(err){FL.common.printToConsole(">>>>>saveTable --> remove and synch FAILURE <<<<< " + err);return def.reject(err);});return def.promise();}, //we need table CRUD: addRecordsToTable,getRecordsFromTable, updateRecordsToTable, removeRecordsFromTable
// Method addRecordsToTable - has parameters  (entityName,recordsArray)
//		where recordsArray has the format [{"number":12,"code":"abc"},....]
// Methods getRecordsFromTable,updateRecordsToTable and removeRecordsFromTable - has parameters  (entityName,recordsId,withTS)
//		where recordsId has the format [{"_id":1,timeStamp:"A"},{"_id":4},....]
addRecordsToTable:function addRecordsToTable(entityName,recordsArray,withId){ //add one or several records to existing table
//assumes a login to an application exists and entitName exists in local and is in sync
//recordsArray [{"number":12,"code":"abc"},....]
//withId flag (default = false) if true all _id will be forced in the add.
FL.common.printToConsole("....................................>beginning addRecordsToTable....with appToken=" + JSON.stringify(FL.login.appToken));var def=$.Deferred();if(_.isUndefined(withId))var withId=false;var ecn=FL.dd.getCEntity(entityName);if(ecn === null){FL.common.printToConsole("........FL.API.addRecordsToTable() table=" + entityName + " not in local dict !");return def.reject("addRecordsToTable <table=" + entityName + "> does not exist in local dict !"); //
}else { //the table exists in local dict but may be unsynchronized
var oEntity=FL.dd.entities[entityName];if(!oEntity.sync){ //table exists in local dict but is not in sync with server	
FL.common.printToConsole("........FL.API.addRecordsToTable() <table=" + entityName + "> exists in local dict but is not in sync");return def.reject("addRecordsToTable <table=" + entityName + "> not in sync !"); //
}else { //table exists and is in sync
FL.common.printToConsole("........FL.API.addRecordsToTable() table=" + entityName + " is ok. We will insert!");var arrToSend=convertRecordsTo_arrToSend(entityName,recordsArray,withId);insertPromise = _insert(ecn,arrToSend);insertPromise.then(function(data){return def.resolve(data);},function(err){return def.reject(err);});}}return def.promise();},addRecordsToTableByCN:function addRecordsToTableByCN(eCN,recordsArray,withId){ //add one or several records to existing table
// eCN - Entity compressed name
// recordsArray - array where each element is a JSON with pairs fCN:<content to insert>
//   ex:[{"51":125,"52":"abc"},....]
//the same as addRecordsToTable() but by compressed name
//assumes a login to an application exists and entitName exists in local and is in sync
//recordsArray [{"number":12,"code":"abc"},....]
//withId flag (default = false) if true all _id will be forced in the add.
FL.common.printToConsole("....................................>beginning addRecordsToTable....with appToken=" + JSON.stringify(FL.login.appToken));var def=$.Deferred();if(_.isUndefined(withId))var withId=false;var ecn=eCN; //FL.dd.getCEntity(entityName);
var entityName=FL.dd.getEntityByCName(ecn);if(ecn === null){FL.common.printToConsole("........FL.API.addRecordsToTable() table=" + entityName + " not in local dict !");return def.reject("addRecordsToTable <table=" + entityName + "> does not exist in local dict !"); //
}else { //the table exists in local dict but may be unsynchronized
var oEntity=FL.dd.entities[entityName];if(!oEntity.sync){ //table exists in local dict but is not in sync with server	
FL.common.printToConsole("........FL.API.addRecordsToTable() <table=" + entityName + "> exists in local dict but is not in sync");return def.reject("addRecordsToTable <table=" + entityName + "> not in sync !"); //
}else { //table exists and is in sync
FL.common.printToConsole("........FL.API.addRecordsToTable() table=" + entityName + " is ok. We will insert!");var arrToSend=convertRecordsTo_arrToSend(entityName,recordsArray,withId);insertPromise = _insert(ecn,arrToSend);insertPromise.then(function(data){return def.resolve(data);},function(err){return def.reject(err);});}}return def.promise();},updateRecordToTable:function updateRecordToTable(entityName,record){ //update a single record to existing table
//assumes a login to an application exists and entitName exists in local and is in sync
//record is a JSON containing a _id key {"_id":12345,"id":1,"code":"abc"}
FL.common.printToConsole("....................................>beginning updateRecordToTable....with appToken=" + JSON.stringify(FL.login.appToken));var def=$.Deferred();var ecn=FL.dd.getCEntity(entityName);if(ecn === null){FL.common.printToConsole("........FL.API.updateRecordToTable() table=" + entityName + " not in local dict !");return def.reject("updateRecordToTable table=" + entityName + " does not exist"); //
}else { //the table exists in local dict but may be unsynchronized
var oEntity=FL.dd.entities[entityName];if(!oEntity.sync){ //table exists in local dict but is not in sync with server	
FL.common.printToConsole("........FL.API.updateRecordToTable() table=" + entityName + " exists in local dict but is not in sync");return def.reject("updateRecordToTable table=" + entityName + " not in sync"); //
}else { //table exists and is in sync
FL.common.printToConsole("........FL.API.updateRecordToTable() table=" + entityName + " is ok. We will insert!");var arrToSend=convertOneRecordTo_arrToSend(entityName,record); //returns {"d":{"51":"cli1","52":"Lx","53":"Pt"}} 
if(record._id){FL.common.printToConsole("update ->" + record._id + " record=" + JSON.stringify(record));var updatePromise=_update(ecn,record._id,arrToSend.d);updatePromise.done(function(count){FL.common.printToConsole(">>>>> updatePromise SUCCESS <<<<< " + count + " record updated!");def.resolve(count);});updatePromise.fail(function(err){FL.common.printToConsole(">>>>> updatePromise FAILURE <<<<<" + err);def.reject(err);}); // return def.resolve(data);
}else {FL.common.printToConsole("........FL.API.updateRecordToTable() table=" + entityName + " is ok but _id is missing");return def.reject("updateRecordToTable table=" + entityName + " -->error: missing _id"); //
} // insertPromise.then(function(data){return def.resolve(data);},function(err){return def.reject(err);});
}}return def.promise();}, // removeRecordFromTable: function(entityName,record) {//removes a single record from a table
removeRecordFromTable:function removeRecordFromTable(entityName,arrOf_Id){ //removes all _id in the array arrOf_Id
//assumes a login to an application exists and entitName exists in local and is in sync
//record is a JSON containing a _id key {"_id":12345,"id":1,"code":"abc"}
//arrOf_Id is an array containing _id keys [12345,12312343]
FL.common.printToConsole("....................................>beginning removeRecordFromTable....with appToken=" + JSON.stringify(FL.login.appToken));var def=$.Deferred();var ecn=FL.dd.getCEntity(entityName);if(ecn === null){FL.common.printToConsole("........FL.API.removeRecordFromTable() table=" + entityName + " not in local dict !");return def.reject("removeRecordFromTable table=" + entityName + " does not exist"); //
}else { //the table exists in local dict but may be unsynchronized
var oEntity=FL.dd.entities[entityName];if(!oEntity.sync){ //table exists in local dict but is not in sync with server	
FL.common.printToConsole("........FL.API.removeRecordFromTable() table=" + entityName + " exists in local dict but is not in sync");return def.reject("removeRecordFromTable table=" + entityName + " not in sync"); //
}else { //table exists and is in sync
FL.common.printToConsole("........FL.API.removeRecordFromTable() table=" + entityName + " is ok. We will remove!"); // if(record._id){
if(arrOf_Id.length > 0){ // FL.common.printToConsole("remove ->"+record._id+" record="+JSON.stringify(record));
FL.common.printToConsole("remove -> _Ids in array " + JSON.stringify(arrOf_Id)); // var removePromise = _remove(ecn,record._id);
var removePromise=_removeMultiple(ecn,arrOf_Id);removePromise.done(function(count){FL.common.printToConsole(">>>>> removePromise SUCCESS <<<<< record removed!");def.resolve(count);});removePromise.fail(function(err){FL.common.printToConsole(">>>>> removePromise FAILURE <<<<<" + err);def.reject(err);}); // return def.resolve(data);
}else {FL.common.printToConsole("........FL.API.removeRecordFromTable() table=" + entityName + " is ok but _id is missing");return def.reject("removeRecordFromTable table=" + entityName + " -->error: array of _ids is empty"); //
} // insertPromise.then(function(data){return def.resolve(data);},function(err){return def.reject(err);});
}}return def.promise();},removeAllRecords:function removeAllRecords(eCN){ //remove all records from eCN
var def=$.Deferred();var removeAllPromise=_removeAll(eCN);removeAllPromise.done(function(count){FL.common.printToConsole(">>>>> removeAllPromise SUCCESS <<<<< ");return def.resolve(count);});removeAllPromise.fail(function(err){FL.common.printToConsole(">>>>> removeAllPromise FAILURE <<<<<" + err);return def.reject(err);});return def.promise();},loadTable:function loadTable(entityName){ //returns the full content of a table from server
//assumes a login to an application exists
FL.common.printToConsole("....................................>beginning loadTable....with appToken=" + JSON.stringify(FL.login.appToken));var def=$.Deferred();var ecn=FL.dd.getCEntity(entityName);var loadTable=_findAll(ecn); //fd.findAll(ecn, {"query":{}}, function(err, data){..})
loadTable.done(function(dataArray){FL.common.printToConsole(">>>>> loadTable SUCCESS <<<<< "); //dataArray has a format: [{"_id":1,"d":{"53":"line 1 content of field1","54":"line 1 content of field2"},"v":0},
//							{"_id":2,"d":{"53":"line 2 content of field1","54":"line 2 content of field2"},"v":0}...,]
var arrLocallyTranslated=FL.API.convertArrC2LForEntity(entityName,dataArray); //dataArray =>[{"_id":123,d:{},r:[]},{"_id":124,d:{},r:[]},....{"_id":125,d:{},r:[]}]
//arrLocallyTranslated is flatted with the format:
// alert("arrLocallyTranslated="+arrLocallyTranslated);
//[{"_id":123234234,"id":1,produto":"High","nome":"Rota dos Numeros, Lda","marca":"Rota dos Numeros","morada":"Av Ceuta, 21 B","cod postal":"2700-188","localidade":"Amadora","telefone":"21 4945431 ","email":"rota.dos.numeros@sapo.pt ","id":1,"_id":"545b4f9afa2b1a3233bb6781"},
def.resolve(arrLocallyTranslated);});loadTable.fail(function(err){FL.common.printToConsole(">>>>> loadTable FAILURE <<<<<" + err);def.reject(err);});return def.promise();},xloadTableByCN:[{eCN:"6A",_id:"1",fCN:"51"},{eCN:"6A",_id:"1",fCN:"51"},{eCN:"6A",_id:"1",fCN:"51"}],loadTableByCN:function loadTableByCN(eCN){ //returns the full content of a table from server 
// format:
//    [{"_id":1,"d":{"53":"line 1 content of field1","54":"line 1 content of field2"},"v":0},
//  	{"_id":2,"d":{"53":"line 2 content of field1","54":"line 2 content of field2"},"v":0}...,]
//
//assumes a login to an application exists
FL.common.printToConsole("....................................>beginning loadTableByCN....with appToken=" + JSON.stringify(FL.login.appToken));var def=$.Deferred(); // var eCN = FL.dd.getCEntity(entityName);
var loadTable=_findAll(eCN); //fd.findAll(eCN, {"query":{}}, function(err, data){..})
loadTable.done(function(dataArray){FL.common.printToConsole(">>>>> loadTableByCN SUCCESS <<<<< ");def.resolve(dataArray);});loadTable.fail(function(err){FL.common.printToConsole(">>>>> loadTableByCN FAILURE <<<<<" + err);def.reject(err);});return def.promise();},openTable:function openTable(eCN){ // use openTable("50").id("1") - returns {"53":"line 1 content of field1","54":"line 1 content of field2"}
// use openTable("50").id("1")["53"] - returns "line 1 content of field1"
// use openTable("50").search({"63":"jojo"}).read["63"]
FL.common.printToConsole("....................................>beginning loadTableByCN....with appToken=" + JSON.stringify(FL.login.appToken));var def=$.Deferred();var loadPromise=this.loadTableByCN(eCN);loadPromise.done(function(dataArray){ //dataArray format--> [{"_id":1,"d":{"53":"line 1 content of field1","54":"line 1 content of field2"},"v":0},...]
FL.common.printToConsole(">>>>> openTable SUCCESS <<<<< ","API"); // var tableOBj = {
// 	id: function(id){
// 		alert("openTable[<>].id()"+id);
// 		return def.resolve(dataArray[id]);
// 	},
// 	search: function(searchObj){//searchObj 
// 		format
// 		// equality condition { <fCN>: <value> } to select all documents that contain the <fCN> with the specified <value>
// 		// or condition { <fCN>:$in: [ <value1>,<value2>] } } to select all documents that contain the <fCN> with values <value1> or <value2>
// 		alert("openTable[<>].search()"+JSON.stringify(searchObj));
// 		return def.resolve();
// 	},						
// };
def.resolve(dataArray);});loadPromise.fail(function(err){FL.common.printToConsole(">>>>> openTable FAILURE <<<<<" + err);def.reject(err);});return def.promise();},loadTableId:function loadTableId(entityName,field2){ //returns only the _id field and optionally a second field from server
//assumes a login to an application exists
FL.common.printToConsole("....................................>beginning loadTableId....with appToken=" + JSON.stringify(FL.login.appToken));var def=$.Deferred();var ecn=FL.dd.getCEntity(entityName);if(!ecn){alert("Error in FL.API.loadTableId the table <<" + entityName + ">> not in local dictiionary!");return def.reject("Error in FL.API.loadTableId the table <<" + entityName + ">> not in local dictiionary!");}var projections={"_id":1};if(field2){var fCN=FL.dd.getFieldCompressedName(entityName,field2);projections[fCN] = 1;} // var loadTableId=_findAll(ecn,{},{"_id":1});
var loadTableId=_findAll(ecn,{},projections);loadTableId.done(function(dataArray){FL.common.printToConsole(">>>>> loadTableId SUCCESS <<<<< "); //dataArray has a format: [{"_id":1,"d":{"53":"line 1 content of field1","54":"line 1 content of field2"},"v":0},
//							{"_id":2,"d":{"53":"line 2 content of field1","54":"line 2 content of field2"},"v":0}...,]
var arrLocallyTranslated=FL.API.convertArrC2LForEntity(entityName,dataArray); //dataArray =>[{"_id":123,d:{},r:[]},{"_id":124,d:{},r:[]},....{"_id":125,d:{},r:[]}]
//arrLocallyTranslated is flatted with the format:
// alert("arrLocallyTranslated="+arrLocallyTranslated);
//[{"_id":123234234,"id":1,produto":"High","nome":"Rota dos Numeros, Lda","marca":"Rota dos Numeros","morada":"Av Ceuta, 21 B","cod postal":"2700-188","localidade":"Amadora","telefone":"21 4945431 ","email":"rota.dos.numeros@sapo.pt ","id":1,"_id":"545b4f9afa2b1a3233bb6781"},
def.resolve(arrLocallyTranslated);});loadTableId.fail(function(err){FL.common.printToConsole(">>>>> loadTableId FAILURE <<<<<" + err);def.reject(err);});return def.promise();},syncLocalStoreToServer:function syncLocalStoreToServer(){ //saves menu,style and font to server, retrieving them from localStore
var def=$.Deferred();var lastMenuStr=localStorage.storedMenu;var lastStyleStr=localStorage.style; // Retrieve last saved style ex.red or spacelab
var lastFontFamilyStr=localStorage.fontFamily; // Retrieve last saved fontFamily ex.impact or georgia
var oMenu=JSON.parse(lastMenuStr);FL.API.setMenu(oMenu);FL.API.setStyle(lastStyleStr);FL.API.setFontFamily(lastFontFamilyStr);var promise=FL.API.save_Menu_style_fontFamily();promise.done(function(){FL.common.printToConsole(">>>>> syncLocalStoreToServer SUCCESS <<<<< ");def.resolve();});promise.fail(function(err){FL.common.printToConsole(">>>>> syncLocalStoreToServer FAILURE <<<<<" + err);def.reject(err);}); // FL.server.saveMainMenu(oMenu,lastStyleStr,lastFontFamilyStr,function(err){
// 	FL.common.printToConsole("FL.server syncLocalStoreToServer() -> menu style and font saved on server -->"+err);
// 	// alert("FLMenu2.js saveMenuToLocalAndServer called FL.server.saveMainMenu with style="+lastStyleStr+ " font="+lastFontFamilyStr);
// });
return def.promise();},XcreateHistoMails_ifNotExisting:function XcreateHistoMails_ifNotExisting(){ //checks if histoMails exist. If not creates it
var eCN=FL.dd.getCEntity("_histoMail"); // eCN = 23;
var def=$.Deferred();FL.common.printToConsole(">>>>>> createHistoMails_ifNotExisting eCN=" + eCN);if(eCN === null){ // does not exist we should create it
FL.common.printToConsole("....................................>beginning createHistoMails_ifNotExisting....with token=" + JSON.stringify(FL.login.token));FL.dd.createEntity("_histoMail","mails histo entity"); //update local dict
FL.dd.addAttribute("_histoMail","msg","events log","mail event","string","textbox",null); // FL.dd.displayEntities();
var synch=FL.API.syncLocalDictionaryToServer("_histoMail");synch.done(function(){FL.common.printToConsole(">>>>>createHistoMails_ifNotExisting syncLocalDictionaryToServer SUCCESS <<<<<");def.resolve();});synch.fail(function(err){FL.common.printToConsole(">>>>>createHistoMails_ifNotExisting syncLocalDictionaryToServer FAILURE <<<<< " + err);def.reject(err);});}else {FL.common.printToConsole(">>>>>createHistoMails_ifNotExisting _histoMail exists !");def.resolve(); //it exists already
}return def.promise();},createTableHistoMails_ifNotExisting:function createTableHistoMails_ifNotExisting(entityName){ // createHistoMails_ifNotExisting: function(entityName) {//creates "_histoMail_<eCN>" where eCN is the Entity Compressed name of entityName
//Note: entityName must exist
var def=$.Deferred();if(!FL.dd.isEntityInLocalDictionary(entityName)){alert("createTableHistoMails_ifNotExisting ERROR entity " + entityName + " does not exist in Local Data Dictionary");}else {var histoName=FL.dd.histoMailPeer(entityName);var eCN=FL.dd.getCEntity(histoName);FL.common.printToConsole(">>>>>> createTableHistoMails_ifNotExisting for " + entityName + ". Peer table is " + histoName + " with eCN=" + eCN + " for table");if(eCN === null){ // does not exist in local DD we should create it
FL.common.printToConsole("....................................>beginning createTableHistoMails_ifNotExisting....with token=" + JSON.stringify(FL.login.token)); // FL.dd.createEntity(histoName,"mails histo peer for initial name="+entityName);//update local dict
// FL.dd.addAttribute(histoName,'msg','events log','mail event','string','textbox',null);
FL.dd.createHistoMailPeer(entityName); // FL.dd.displayEntities();
var synch=FL.API.syncLocalDictionaryToServer(histoName);synch.done(function(){FL.common.printToConsole(">>>>>createTableHistoMails_ifNotExisting syncLocalDictionaryToServer SUCCESS <<<<<");def.resolve();});synch.fail(function(err){FL.common.printToConsole(">>>>>createTableHistoMails_ifNotExisting syncLocalDictionaryToServer FAILURE <<<<< " + err);def.reject(err);});}else {FL.common.printToConsole(">>>>>createTableHistoMails_ifNotExisting _histoMail exists !");def.resolve(); //it exists already
}}return def.promise();},createTemplates_ifNotExisting:function createTemplates_ifNotExisting(){ //checks if templates exist. If not creates it
var eCN=FL.dd.getCEntity("_templates"); // eCN = 23;
var def=$.Deferred();FL.common.printToConsole(">>>>>> createTemplates_ifNotExisting eCN=" + eCN);if(eCN === null){ // does not exist we should create it
FL.common.printToConsole("....................................>beginning createTemplates_ifNotExisting....with token=" + JSON.stringify(FL.login.token));FL.dd.createEntity("_templates","templates entity"); //update local dict
FL.dd.addAttribute("_templates","jsonTemplate","json of template","json of template","string","textbox",null); // FL.dd.displayEntities();
var synch=FL.API.syncLocalDictionaryToServer("_templates");synch.done(function(){FL.common.printToConsole(">>>>>createTemplates_ifNotExisting syncLocalDictionaryToServer SUCCESS <<<<<");def.resolve();});synch.fail(function(err){FL.common.printToConsole(">>>>>createTemplates_ifNotExisting syncLocalDictionaryToServer FAILURE <<<<< " + err);def.reject(err);});}else {FL.common.printToConsole(">>>>>createTemplates_ifNotExisting _templates exists !");def.resolve(); //it exists already
}return def.promise();},mailRecipientsOfTemplate:function mailRecipientsOfTemplate(entityName,templateName){ //for list entityName and templateName returns all emails received in Webhook
//assumes a login to an application exists
FL.common.printToConsole("....................................>beginning mailRecipientsOfTemplate....with appToken=" + JSON.stringify(FL.login.appToken));var def=$.Deferred(); // var eCN = FL.dd.getCEntity(entityName);
// var eCN = FL.dd.getCEntity("_histoMail");
// var fCN = FL.dd.getFieldCompressedName("_histoMail","msg");//the field to search within eCN
var histoName=FL.dd.histoMailPeer(entityName);var eCN=FL.dd.getCEntity(histoName);var fCN=FL.dd.getFieldCompressedName(histoName,"msg"); //the field to search within eCN
var par1={};par1[fCN + ".metadata.NName"] = templateName; // par1[fCN+'.sender'] = sender;
var par2={}; // par2[fCN+'.sender'] = 1;
par2[fCN + ".email"] = 1; // var mailRecipientsTable=_findAll(eCN,{fCN+'.metadata.NName':templateName},{fCN+'.sender':1});
var mailRecipientsTable=_findAll(eCN,par1,par2); //fd.findAll(ecn, {"query":{}}, function(err, data){..})
mailRecipientsTable.done(function(data){FL.common.printToConsole(">>>>> mailRecipientsTable SUCCESS <<<<< ");recipientsArray = _.map(data,function(element){ //extracts emails only
var xObj=element.d[fCN];return xObj.email;});def.resolve(recipientsArray);});mailRecipientsTable.fail(function(err){FL.common.printToConsole(">>>>> mailRecipientsOfTemplate FAILURE <<<<<" + err);def.reject(err);});return def.promise();},upsertByKey:function upsertByKey(keyFieldValue,entityName,record){ //upsert record for <keyField>=<keyFieldValue> in table entityName
//record is a JSON that may contain _id key ex: {"_id":12345,"id":1,"code":"abc"}
FL.common.printToConsole("....................................>beginning upsertByKey....with appToken=" + JSON.stringify(FL.login.appToken));var def=$.Deferred();var eCN=FL.dd.getCEntity(entityName);if(eCN === null){FL.common.printToConsole("........FL.API.upsertByKey() table=" + entityName + " not in local dict !");return def.reject("upsertByKey table=" + entityName + " does not exist in local dict !");}else { //the table exists in local dict but may be unsynchronized
var oEntity=FL.dd.entities[entityName];if(!oEntity.sync){ //table exists in local dict but is not in sync with server	
FL.common.printToConsole("........FL.API.upsertByKey() table=" + entityName + " exists in local dict but is not in sync");return def.reject("upsertByKey table=" + entityName + " not in sync"); //
}else { //table exists and is in sync
FL.common.printToConsole("........FL.API.upsertByKey() table=" + entityName + " is ok. We will upsert!"); // var _id = record["_id"];//it can be null or existing
var recordWithFCN=convertOneRecordTo_arrToSend(entityName,record); //returns {"d":{"51":"cli1","52":"Lx","53":"Pt"}} 
var upsertPromise=this.upsertByKeyOnECN(keyFieldValue,eCN,recordWithFCN.d);upsertPromise.done(function(){FL.common.printToConsole(">>>>> FL.API.upsertByKey() upsertPromise SUCCESS <<<<< record updated!");return def.resolve();});upsertPromise.fail(function(err){FL.common.printToConsole(">>>>> FL.API.upsertByKey() upsertPromise FAILURE <<<<<" + err);return def.reject(err);});}}return def.promise();},upsertByKeyOnECN:function upsertByKeyOnECN(keyFieldValue,eCN,recordWithFCN){ //upsert for <keyField>=<keyFieldValue>for list entityName and templateName returns all emails received in Webhook
//if _id exists =>direct update
//upsert record with field compressed names  for <fCNkey>=<keyFieldValue> in table with compressed name eCN
// assumes that: eCN exists and fCNKey exists in local dict and is in synch with server
//ex FL.API.upsertByKeyOnECN('51','123','50',{"d":{"51":"cli1","52":"Lx","53":"Pt"}});
FL.common.printToConsole("....................................>beginning upsertByKeyOnECN....with appToken=" + JSON.stringify(FL.login.appToken));var def=$.Deferred();_update(eCN,keyFieldValue,recordWithFCN).then(function(){return def.resolve();},function(err){FL.common.printToConsole(">>>> upsertByKeyOnECN with _id =>unable to insert");return def.reject("upsertByKeyOnECN with _id unable to insert err=" + err);});return def.promise();},mandrillRejectListForSender:function mandrillRejectListForSender(senderEmail){ //get reject list from mandrill only for sender=sender
FL.common.printToConsole("....................................>beginning mandrillRejectListForSender....with appToken=" + JSON.stringify(FL.login.appToken));var def=$.Deferred();_mandrillRejectListForSender(senderEmail).then(function(data){return def.resolve(data);},function(err){FL.common.printToConsole(">>>> mandrillRejectListForSender FAILURE");return def.reject("mandrillRejectListForSender FAILURE err=" + err);});return def.promise();},mandrillDeleteFromReject:function mandrillDeleteFromReject(arrayOfEmails){ //get reject list from mandrill only for sender=sender
FL.common.printToConsole("....................................>beginning mandrillDeleteFromReject....with appToken=" + JSON.stringify(FL.login.appToken));var def=$.Deferred();_mandrillDeleteFromReject(arrayOfEmails).then(function(data){return def.resolve(data);},function(err){FL.common.printToConsole(">>>> mandrillDeleteFromReject FAILURE");return def.reject("mandrillDeleteFromReject FAILURE err=" + err);});return def.promise();},customTable:function customTable(entityProps){ // Ex FL.API.customTable({singular:"shipment"});
//uses --> FL.dd.createEntity("sales rep","employee responsable for sales");
var def=$.Deferred();var singularDefault=FL.dd.nextEntityBeginningBy("unNamed");entityProps = _.extend({singular:singularDefault,description:null},entityProps);if(!entityProps.description)entityProps.description = entityProps.singular + "'s description";FL.dd.createEntity(entityProps.singular,entityProps.description);var singular=entityProps.singular;var oEntity=FL.dd.entities[entityProps.singular]; // FL.API.data[entityName]={
// 	name:entityName,tfunc:function(){FL.common.printToConsole("--> "+this.name);}
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
function entity(entityProps){this.name = entityProps.singular;this.description = entityProps.description;var oEntity=FL.dd.entities[singular];this.eCN = oEntity.csingular;};entity.prototype.get = function(prop){var oEntity=FL.dd.entities[singular];return oEntity[prop];};entity.prototype.set = function(prop,value){var oEntity=FL.dd.entities[singular];oEntity[prop] = value;};FL.API.data[singular] = new entity(entityProps);return def.resolve(); // def.reject();//to test
return def.promise(); // alert("FL.server.test() -->"+x);
},getFLContextFromBrowserLocationBar:function getFLContextFromBrowserLocationBar(){ //to be used at the entry point of independent applications
//reads the browser adress bar to get the connection string then connects to the default application
var def=$.Deferred();if(FL.API.isConnected()){ // alert("getFLContextFromBrowserLocationBar --> independent app already connected !!! how is this possible ?");
def.reject("getFLContextFromBrowserLocationBar --> independent app already connected !!! how is this possible ?");}else {var fullUrl=window.location.href;var connectionString=FL.common.getTag(fullUrl,"connectionString","#");if(connectionString){connectionString = FL.common.enc(connectionString,-1);var loginObject=JSON.parse(connectionString); //ex {"email":"toto114@toto.com","userName":"","password":"123"}				
var fl=new flMain(); //only place where this must exist !!!!
FL.fl = fl;fl.serverName(FL.common.getServerName());var spinner=FL.common.loaderAnimationON("spinnerDiv");var connectionPromise=FL.API.connectUserToDefaultApp(loginObject.email,loginObject.password) // .then(function(){return appSetup(loginObject);})
.then(function(){spinner.stop();FL.common.printToConsole(">>>>> getFLContextFromBrowserLocationBar -> SUCCESS connecting to default app !<<<<< ");FL.common.printToConsole("after connection->" + JSON.stringify(FL.login.token));def.resolve();},function(err){spinner.stop();FL.common.printToConsole(">>>>> getFLContextFromBrowserLocationBar FAILURE <<<<<" + err);def.reject(err);});}else {alert("getFrameLinkContext --> No connectionString available !!!");return;}}return def.promise();},nicoTestDuplicateIds:function nicoTestDuplicateIds(arrToTest){return _nicoTestDuplicateIds(arrToTest);},nicoTestDuplicateIds:function nicoTestDuplicateIds(arrToTest){return _nicoTestDuplicateIds(arrToTest);},testFunc:function testFunc(x){alert("FL.server.test() -->" + x);}};})(); // });

//# sourceMappingURL=FLAPI-compiled.js.map