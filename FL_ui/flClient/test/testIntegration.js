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
					jsonFinal={
						"adminName": myApp.userName, 
						"adminPassWord": myApp.userPassWord,
						"userName": myApp.userName,
						"clientName": myApp.clientName,
						"domainName": myApp.domainName,
						"newUserName":"toto@framlink.co", 
						"newClientName": "totoFrameLink",
						"newDescription":'first Application finalized'
					}
					t.end();
				})
			})
		})
	});
})
test("finalizeIt", function(t){
	fl.applicationFinalize(jsonFinal, function(err, result){
		t.equal(err, null, "applicationFinalize should return no error");
		t.end();

	})
})

test("removeTryIt", function(t){
	fl.applicationRemove({"adminName": jsonFinal.newUserName, "adminPassWord": myAppFC.userPassWord, "domain": myAppFC.domainName}, function (err, data){
		t.equal(err, null, "applicationRemove should return no error");
		fl.clientRemove({"adminName": "nico@framelink.co", "adminPassWord": "coLas", "clientName": jsonFinal.newClientName}, function (err, data){
			//console.log(JSON.stringify(err));
			t.equal(err, null, "clientRemove should return no error");
			t.equal(data, 1, "clientRemove should remove one document");
			t.end();
		});
	});
})

test("create Client1", function(t){
	fl.clientCreate({"adminName": "nico@framelink.co", "adminPassWord": "coLas", "clientName": "newClient"}, function (err, data){
		//console.log(JSON.stringify(err));
		t.equal(err, null, "client1Create should return no error");
		t.equal(data!=null, true, 'we got our client1 information back');
		t.equal(data['_id'] != undefined, true, 'we got a new _id');
		cli1=data.d['clientName'];
		cliId1=data['_id']+'';
		console.log('cliId: ' + cliId1);
		t.end();
	});
});
test("create Client2", function(t){
	fl.clientCreate({"adminName": "nico@framelink.co", "adminPassWord": "coLas", "clientName": "newClient"}, function (err, data){
		//console.log(JSON.stringify(err));
		t.equal(err, null, "client2Create should return no error");
		t.equal(data!=null, true, 'we got our client2 information back');
		t.equal(data['_id'] != undefined, true, 'we got a new _id');
		cli2=data.d['clientName'];
		cliId2=data['_id']+'';
		console.log('cliId: ' + cliId2);
		t.end();
	});
});
test("create User", function(t){
	fl.userCreate({"adminName": "nico@framelink.co", "adminPassWord": "coLas", "userName": "totoUser", "userPassWord": "dodo12345", 
				   "userType": 'user', "clientId": cliId1}, function (err, data){
		//console.log(JSON.stringify(err));
		t.equal(err, null, "userCreate should return no error");
		t.equal(data['_id'] != undefined, true, 'we got a new _id');
		user1=data.d['userName'];
		t.equal(data.d['userName'].indexOf('totoUser') >=0, true, 'we got the userName back');
		t.equal(data.d['userType'], 'user', 'we got the userType back');
		fl.login({"username": user1, "password": "dodo12345"}, function (err, data){
			t.equal(err, null, "fl.login should return no error");
			t.end();
		});
	});
});
test('promoteAsClientAdmin', function(t){
	fl.promoteAsClientAdmin({"adminName": "nico@framelink.co", "adminPassWord": "coLas", "userName": "totoUser", 
		"userPassWord": '12345ThisIsNew', 
				"newClientName": cli2}, function(err, data){
		t.equal(err, null, "promoteAsClientAdmin should return no error");
		t.equal(data, 1, 'we updated one user ');
		t.end();
	})
});

test("create application", function(t){
	fl.applicationCreate({"adminName": "totoUser", "adminPassWord": "12345ThisIsNew", "domainPrefix": "flTest", 
		 				  "description": "this is an application to test !"}, function (err, data){
		//console.log(JSON.stringify(err));
		t.equal(err, null, "applicationCreate should return no error");
		t.equal(data!=null, true, 'we got our application information back');
		t.equal(data['_id'] != undefined, true, 'we got a new _id');
		t.equal(data.d['clientId'], cliId2, 'totoUser is assigned now to our second client');
		t.equal(data.d['allowAnonymous'], true, 'Anonymous login is allowed');
		appli=data.d['domainName'];
		t.end();
	});
});
test("remove an application", function(t){
	fl.applicationRemove({"adminName": "totoUser", "adminPassWord": "12345ThisIsNew", "domain": appli}, function (err, data){
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
	fl.clientRemove({"adminName": "nico@framelink.co", "adminPassWord": "coLas", "clientName": cli2}, function (err, data){
		//console.log(JSON.stringify(err));
		t.equal(err, null, "clientRemove should return no error");
		t.equal(data, 1, "clientRemove should remove one document");
		fl.clientRemove({"adminName": "nico@framelink.co", "adminPassWord": "coLas", "clientName": cli1}, function (err, data){
			//console.log(JSON.stringify(err));
			t.equal(err, null, "clientRemove should return no error");
			t.equal(data, 1, "clientRemove should remove one document");
			t.end();
		});
	});
});

/*
*/