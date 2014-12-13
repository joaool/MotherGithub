/*
	flData Client API tests

	version 1.0, N.Cuvillier

	this will be always the more up to date documentation..

*/

//var toolsDef=require('../../tools-1.js');
//var tools = new toolsDef('t_clientFlData');

var axDef= require('../ajaxNode.js');
var ax = new axDef();
var flMain=require('../flClient.js');
var fl = new flMain(ax.callAjax);
var apiSrv=process.env.FLAPISRV || 'localhost';
var cliTrace=process.env.FLCLITRACE || 0;
var srvTrace=process.env.FLTRACE || 0;
var fs=require('fs');
var assert=require('assert');
var test=require('tap').test;
var fa = new fl.app();
var fd = new fl.data();
fl.serverName(apiSrv);
fl.setTraceClient(cliTrace);
var appli;
var cliName;
var cliId1;
var cliId2;
var appLog;
var user1;
var cli2;
var cli1;
var jsonFinal;
var myAppFC;
var usrName;
var usrPassWord;
//fl.setTraceServer(srvTrace);
/*
test("test variables are well loaded", function(t){
	t.equal(fa!=undefined, true, "fl.app is loaded");
	t.equal(fd!=undefined, true, "fl.data is loaded");
	t.end();
});
*/
test('fullCreate', function(t){
	fl.applicationFullCreate({"adminName": "nico@framelink.co", "adminPassWord": "coLas"}, function (err, myApp){
		t.equal(err, null, "clientCreate should return no error");
		myAppFC=myApp;
		t.equal(myApp.clientId != null, true, "we got a Name "+myApp.clientId);
		t.equal(myApp.clientName != null, true, "we got a Name "+myApp.clientName);
		t.equal(myApp.userId != null, true, "we got a Name "+myApp.userId);
		t.equal(myApp.userName != null, true, "we got a Name "+myApp.userName);
		t.equal(myApp.userPassWord != null, true, "we got a Name "+myApp.userPassWord);
		t.equal(myApp.domainName != null, true, "we got a Name "+myApp.domainName);
		fl.login({"username": myApp.userName, "password": myApp.userPassWord, "domain": myApp.domainName}, function (err, data){
			t.equal(err, null, "fl.login should return no error");
			t.equal(data.applications.length, 1, "fl.login should return one application definition");
			var appDef =data.applications[0];
			fa.connect(appDef, function(err2, data2){
				t.equal(err2, null, "fl.app.connect should return no error");
				t.equal(data2.status, 'OK', "fl.app.connect should return a status OK");
				fa.disconnect(function(err5, data){
					t.equal(err5, null, "fl.disconnect should return no error");
					// we need to log with a user which get access right on the db
					//console.dir(myApp);
					usrPassWord = myApp.clientName;
					jsonFinal={
						"adminName": "nico@framelink.co", 
						"adminPassWord": "coLas",
						"userName": myApp.userName,
						"clientName": myApp.clientName,
						"domainName": myApp.domainName,
						"newUserName":"toto@framlink.co", 
						"newClientName": "toto",
						"newDescription":'first Application finalized'
					}
					t.end();
				})
			})
		})
	});
})
test("finalizeIt", function(t){
	var dt= new Date();
	usrName="toto-" + dt.getSeconds();
	jsonFinal.newUserName=usrName;
	fl.applicationFinalize(jsonFinal, function(err, result){
		t.equal(err, null, "applicationFinalize should return no error");
		fl.login({"username": usrName, "password": usrPassWord, "domain": jsonFinal.domainName}, function (err, data){
			t.equal(err, null, "fl.login should return no error");
			t.equal(data.applications.length, 1, "fl.login should return one application definition");
			var appDef =data.applications[0];
			fa.connect(appDef, function(err2, data2){
				console.log('connect return err: ' + err2);
				t.equal(err2, null, "fl.app.connect should return no error");
				t.equal(data2.status, 'OK', "fl.app.connect should return a status OK");
				fa.disconnect(function(err5, data){
					t.equal(err5, null, "fl.disconnect should return no error");
					t.end();
				})
			})
		})
	})
})

test("removeTryIt", function(t){
	fl.applicationRemove({"adminName": usrName, "adminPassWord": usrPassWord, "domain": myAppFC.domainName}, function (err, data){
		t.equal(err, null, "applicationRemove should return no error");
		fl.clientRemove({"adminName": "nico@framelink.co", "adminPassWord": "coLas", "clientName": jsonFinal.newClientName}, function (err, data){
			//console.log(JSON.stringify(err));
			t.equal(err, null, "clientRemove should return no error");
			t.equal(data, 1, "clientRemove should remove one document");
			t.end();
		});
	});
})
