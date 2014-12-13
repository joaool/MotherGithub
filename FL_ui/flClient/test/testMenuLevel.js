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
var appLog;
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
		console.log('cliId: ' + cliId);
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
		t.equal(data.d['userName'], 'totoUser', 'we got the userName back');
		t.equal(data.d['userType'], 'clientAdmin', 'we got the userType back');
		fl.login({"username": "totoUser", "password": "dodo12345"}, function (err, data){
			t.equal(err, null, "fl.login should return no error");
			t.end();
		});
	});
});

test("create application", function(t){
	fl.applicationCreate({"adminName": "totoUser", "adminPassWord": "dodo12345", "domainPrefix": "flTest", 
		 				  "description": "this is an application to test !"}, function (err, data){
		//console.log(JSON.stringify(err));
		t.equal(err, null, "applicationCreate should return no error");
		t.equal(data!=null, true, 'we got our application information back');
		t.equal(data['_id'] != undefined, true, 'we got a new _id');
		t.equal(data.d['clientId'] != undefined, true, 'we got a clientId');
		t.equal(data.d['allowAnonymous'], true, 'Anonymous login is allowed');
		appli = data.d['domainName'];
		fl.login({"username": "totoUser", "password": "dodo12345", "domain": appli}, function (err, data){
			t.equal(err, null, "fl.login should return no error");
			appLog =data.applications[0];
			fa.connect(appLog, function(err2, data2){
				t.equal(err2, null, "fl.app.connect should return no error");
				t.equal(data2.status, 'OK', "fl.app.connect should return a status OK");
				fa.setMenuLevel({'0D':appLog.userId, '0E': 12345}, function(err3, data3){
					t.equal(err3, null, "fl.app.setMenuLevel should return no error");
					t.equal(data3.Status, 'OK', "fl.app.setMenuLevel should return a status OK");
					fa.setLoginRestriction({'1':'50', '0D':appLog.userId, '0E': 67890}, function(err4, data4){
						t.equal(err4, null, "fl.app.setLoginRestiction should return no error");
						t.equal(data4.Status, 'OK', "fl.app.setLoginRestiction should return a status OK");
						fa.disconnect(function(err5, data){
							t.equal(err5, null, "fl.disconnect should return no error");
							t.end();
						})
					});
				})
			});
		});
	});
});
test('menuLevel and loginRestriction', function(t){
	fl.login({"username": "totoUser", "password": "dodo12345", "domain": appli}, function (err, data){
		t.equal(err, null, "fl.login should return no error");
		var myApp =data.applications[0];
		fa.connect(myApp, function(err2, data2){
			t.equal(err2, null, "fl.app.connect should return no error");
			t.equal(data2.status, 'OK', "fl.app.connect should return a status OK");
			t.equal(data2.restrictions.length, 1, "this user has one restriction");
			t.equal(data2.restrictions[0]['1'], '50', "Restriction on entity 50");
			t.equal(data2.restrictions[0]['0D'], appLog.userId, "Restriction on userId");
			t.equal(data2.restrictions[0]['0E'].toString(), '67890'.toString(), "Restriction allowedId");
			t.equal(data2.menuLevel.toString(), '12345'.toString(), "We got our menuLevel");
			fa.disconnect(function(err5, data){
				t.equal(err5, null, "fl.disconnect should return no error");
				t.end();
			})
		})
	})
})
test("remove an application", function(t){
	fl.applicationRemove({"adminName": "totoUser", "adminPassWord": "dodo12345", "domain": appli}, function (err, data){
		t.equal(err, null, "applicationRemove should return no error");
		t.end();
	});
});
/*
test('remove user titi', function(t){
	fl.userRemove({"adminName": "totoUser", "adminPassWord": "dodo12345", "userName": "titi"}, function (err, data){
		//console.log(JSON.stringify(err));
		t.equal(err, null, "userRemove should return no error");
		t.equal(data, 1, "userRemove removed 1 user");
		//console.dir(data1);
		t.end();
	});	
})
/*
test('remove user totoUser', function(t){
	fl.userRemove({"adminName": "nico@framelink.co", "adminPassWord": "coLas", "userName": "totoUser"}, function (err, data){
		//console.log(JSON.stringify(err));
		t.equal(err, null, "userRemove should return no error");
		t.equal(data, 1, "userRemove removed 1 user");
		//console.dir(data1);
		t.end();
	});	
})
*/
test("remove client", function(t){
	fl.clientRemove({"adminName": "nico@framelink.co", "adminPassWord": "coLas", "clientName": cliName}, function (err, data){
		//console.log(JSON.stringify(err));
		t.equal(err, null, "clientRemove should return no error");
		t.equal(data, 1, "clientRemove should remove one document");
		t.end();
	});
});

/*
*/