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
var app1;
var app2;
var app3;
var nextDomain;
var totoName=null;
//fl.setTraceServer(srvTrace);
/*
test("test variables are well loaded", function(t){
	t.equal(fa!=undefined, true, "fl.app is loaded");
	t.equal(fd!=undefined, true, "fl.data is loaded");
	t.end();
});
*/
test("create application", function(t){
	fl.applicationCreate({"adminName": "nico@framelink.co", "adminPassWord": "coLas", "domainPrefix": "test", 
		 				  "description": "sample Application"}, function (err, data){
		//console.log(JSON.stringify(err));
		t.equal(err, null, "applicationCreate should return no error");
		t.equal(data!=null, true, 'we got our application information back');
		t.equal(data['_id'] != undefined, true, 'we got a new _id');
		t.equal(data.d['clientId'] != undefined, true, 'we got a clientId');
		t.equal(data.d['allowAnonymous'], true, 'Anonymous login is allowed');
		app1 = data.d['domainName'];
		fl.login({"username": "nico@framelink.co", "password": "coLas", "domain": app1}, function (err, data){
			var myApp =data.applications[0];
			t.equal(err, null, "fl.login should return no error");
			for (var idx in data.applications){
				if(data.applications[idx].domainName == app1)
					myApp = data.applications[idx];
			}
			fa.connect(myApp, function(err2, data2){
				t.equal(err2, null, "fl.app.connect should return no error");
				t.equal(data2.status, 'OK', "fl.app.connect should return a status OK");
				t.end();
			});
		});
	});
});

test("create a second application, and check the name with getNextDomainName", function(t){
	fl.applicationGetNextDomainName({domainPrefix: "flTest"}, function(err, nextDomain){
		//console.dir(nextDomain);
		t.equal(err, null, "getNextdomainName should return no error");
		fl.applicationCreate({"adminName": "nico@framelink.co", "adminPassWord": "coLas", "domainPrefix": "flTest", 
			 				  "description": "this is an application to test !", "allowAnonymous": false}, function (err, data){
			//console.log(JSON.stringify(err));
			t.equal(err, null, "applicationCreate should return no error");
			t.equal(data!=null, true, 'we got our application information back');
			t.equal(data['_id'] != undefined, true, 'we got a new _id');
			t.equal(data.d['clientId'] != undefined, true, 'we got a clientId');
			t.equal(data.d['allowAnonymous'], false, 'Anonymous login is not allowed');
			app2 = data.d['domainName'];
			t.equal(app2, nextDomain.nextDomain, "the name of the next available domain should have been used");
			t.end();
		});
	})
});
test("change description", function(t){
	var vNewDesc = "nouvelle description";
	fl.applicationChangeDescription({"adminName": "nico@framelink.co", "adminPassWord": "coLas", "domainName": app1, "newDescription": vNewDesc}, function (err, data){
		//console.log(JSON.stringify(err));
		t.equal(err, null, "applicationChangeDescription should return no error");
		fl.login({"username": "nico@framelink.co", "password": "coLas", "domain": app1}, function (err, data){
			t.equal(err, null, "fl.login should return no error");
			t.equal(data.applications[0].description, vNewDesc, "fl.login should return the new description");
			var myApp =data.applications[0];
			t.end();
		});
	});
});
/*
test("changeDomainName", function(t){
	// find a domainName which does not exist
	fl.applicationGetNextDomainName({domainPrefix: "toto"}, function(err, domainNm){
		//console.dir(nextDomain);
		if (domainNm.nextDomain != 'toto'){
			console.log("The application toto still exist... can not test");
			t.equal(domainNm.nextDomain, "toto", "the application toto should be non existing");
			t.end();
			return;
		}
		totoName="toto";
		t.equal(err, null, "getNextdomainName should return no error");
		fl.applicationChangeDomainName({"adminName": "nico@framelink.co", "adminPassWord": "coLas", "domainName": app1, "newDomainName": nextDomain}, function (err, data){
			//console.log(JSON.stringify(err));
			t.equal(err, null, "applicationChangeDomainName should return no error");
			fl.login({"username": "nico@framelink.co", "password": "coLas", "domain": nextDomain}, function (err, data){
				t.equal(err, null, "fl.login should return no error");
				t.equal(data.applications.length, 1, "fl.login should return the new DomainName");
				var myApp =data.applications[0];
				fa.connect(myApp, function(err2, data2){
					t.equal(err2, null, "fl.app.connect should return no error");
					t.equal(data2.status, 'OK', "fl.app.connect should return a status OK");
					fa.logMessage('***** salut Nico ********', function(err3, data){
						t.equal(err3, null, "fl.message should return no error");
						t.end();
					});
				});
			});
		});
	});
});
*/
test("remove an application", function(t){
	fl.applicationRemove({"adminName": "nico@framelink.co", "adminPassWord": "coLas", "domain": app2}, function (err, data){
		//console.log(JSON.stringify(err));
		t.equal(err, null, "applicationRemove should return no error");
//		fl.applicationRemove({"adminName": "nico@framelink.co", "adminPassWord": "coLas", "domain": totoName}, function (err, data){
//			//console.log(JSON.stringify(err));
//			t.equal(err, null, "applicationRemove should return no error");
			t.end();
//		});
	});
});

test("remove a non existing application", function(t){
	fl.applicationRemove({"adminName": "nico@framelink.co", "adminPassWord": "coLas", "domain": "xyz"}, function (err, data){
		//console.log(JSON.stringify(err));
		t.equal(err == 'Application xyz not found', true, "applicationRemove should return no error");
		t.end();
	});
});
/*
*/