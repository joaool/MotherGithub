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
var cliId;
var userTiti;
var userToto;
//fl.setTraceServer(srvTrace);
/*
test("test variables are well loaded", function(t){
	t.equal(fa!=undefined, true, "fl.app is loaded");
	t.equal(fd!=undefined, true, "fl.data is loaded");
	t.end();
});
*/
test("create Client", function(t){
	fl.clientCreate({"adminName": "nico@framelink.co", "adminPassWord": "coLas", "clientName": "newClient"}, function (err, data){
		//console.log(JSON.stringify(err));
		t.equal(err, null, "clientCreate should return no error");
		t.equal(data!=null, true, 'we got our client information back');
		t.equal(data['_id'] != undefined, true, 'we got a new _id');
		cliName=data.d['clientName'];
		cliId=data['_id']+'';
		//console.log('cliId: ' + cliId);
		t.end();
	});
});
test("create User", function(t){
	fl.userCreate({"adminName": "nico@framelink.co", "adminPassWord": "coLas", "userName": "totoUser", "userPassWord": "dodo12345", 
				   "userType": 'clientAdmin', "clientId": cliId}, function (err, data){
		//console.log(JSON.stringify(err));
		t.equal(err, null, "userCreate should return no error");
		t.equal(data!=null, true, 'we got our user information back');
		t.equal(data['_id'] != undefined, true, 'we got a new _id');
		userToto=data.d['userName'];
		t.equal(userToto.indexOf('totoUser')>-1 , true, 'we got the userName back');
		t.equal(data.d['userType'], 'clientAdmin', 'we got the userType back');
		fl.login({"username": userToto, "password": "dodo12345"}, function (err, data){
			t.equal(err, null, "fl.login should return no error");
			t.end();
		});
	});
});
test("create User", function(t){
	fl.userCreate({"adminName": userToto, "adminPassWord": "dodo12345", "userName": "titi", "userPassWord": "dodo12345", 
				   "userType": 'user', "clientId": cliId}, function (err, data){
		//console.log(JSON.stringify(err));
		t.equal(err, null, "userCreate should return no error");
		t.equal(data!=null, true, 'we got our user information back');
		t.equal(data['_id'] != undefined, true, 'we got a new _id');
		userTiti=data.d['userName'];
		t.equal(userTiti.indexOf('titi')>-1 , true, 'we got the userName back');
		t.equal(data.d['userType'], 'user', 'we got the userType back');
		fl.login({"username": userTiti, "password": "dodo12345"}, function (err, data){
			t.equal(err, null, "fl.login should return no error");
			t.end();
		});
	});
});

test("create application", function(t){
	fl.applicationCreate({"adminName": userToto, "adminPassWord": "dodo12345", "domainPrefix": "flTest", 
		 				  "description": "this is an application to test !"}, function (err, data){
		//console.log(JSON.stringify(err));
		t.equal(err, null, "applicationCreate should return no error");
		t.equal(data!=null, true, 'we got our application information back');
		t.equal(data['_id'] != undefined, true, 'we got a new _id');
		t.equal(data.d['clientId'] != undefined, true, 'we got a clientId');
		t.equal(data.d['allowAnonymous'], true, 'Anonymous login is allowed');
		appli = data.d['domainName'];
		fl.login({"username": userToto, "password": "dodo12345", "domain": appli}, function (err, data){
			t.equal(err, null, "fl.login should return no error");
			var myApp =data.applications[0];
			fa.connect(myApp, function(err2, data2){
				t.equal(err2, null, "fl.app.connect should return no error");
				t.equal(data2.status, 'OK', "fl.app.connect should return a status OK");
				fa.disconnect(function(err3, data){
					t.equal(err3, null, "fl.disonnect should return no error");
					t.end();
				});
			});
		});
	});
});
test("try to log with a non granted used", function(t){
	fl.login({"username": userTiti, "password": "dodo12345", "domain": appli}, function (err, data){
		t.equal(err, null, "fl.login should return no error");
		t.equal(data.applications.length, 0, "a non granted user should get no application");
		t.end();
	});
});

test("granted access and log in", function(t){
	fl.applicationGrantAccess({"adminName": userToto, "adminPassWord": "dodo12345", "userName": userTiti, "domainName": appli, accessLevel: 15}, 
										function(err, data){
		t.equal(err, null, "fl.grantAccess should return no error");
		t.equal(data.Status, 'OK', "fl.grantAccess should return a status OK");
		fl.login({"username": userTiti, "password": "dodo12345", "domain": appli}, function (err, data){
			t.equal(err, null, "fl.login should return no error");
			t.equal(data.applications.length, 1, "fl.login should return one and only one applicationDef");
			var myApp =data.applications[0];
			fa.connect(myApp, function(err2, data2){
				t.equal(err2, null, "fl.app.connect should return no error");
				t.equal(data2.status, 'OK', "fl.app.connect should return a status OK");
				fa.disconnect(function(err3, data){
					t.equal(err3, null, "fl.disconnect should return no error");
					t.end();
				});
			});
		});
	})
});
test("remove access and try to log in", function(t){
	fl.applicationGrantAccess({"adminName": userToto, "adminPassWord": "dodo12345", "userName": userTiti, "domainName": appli, accessLevel: 0}, 
										function(err, data){
		t.equal(err, null, "fl.grantAccess should return no error");
		t.equal(data.Status, 'OK', "fl.grantAccess should return a status OK");
		fl.login({"username": userTiti, "password": "dodo12345", "domain": appli}, function (err, data){
			t.equal(err, null, "fl.login should return no error");
			t.equal(data.applications.length, 0, "fl.login should return no applicationDef");
			t.end();
		});
	})
});
test("remove an application", function(t){
	fl.applicationRemove({"adminName": userToto, "adminPassWord": "dodo12345", "domain": appli}, function (err, data){
		t.equal(err, null, "applicationRemove should return no error");
		t.end();
	});
});
test("remove client", function(t){
	fl.clientRemove({"adminName": "nico@framelink.co", "adminPassWord": "coLas", "clientName": cliName}, function (err, data){
		//console.log(JSON.stringify(err));
		t.equal(err, null, "clientRemove should return no error");
		t.end();
	});
});
/*
*/