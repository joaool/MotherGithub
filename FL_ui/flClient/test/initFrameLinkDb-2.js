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

test("create application", function(t){
	fl.applicationCreate({"adminName": "nico@framelink.co", "adminPassWord": "coLas", "domainPrefix": "SampleN", 
		 				  "description": "sample Application for Nico"}, function (err, data){
		//console.log(JSON.stringify(err));
		t.equal(err, null, "applicationCreate should return no error");
		t.equal(data!=null, true, 'we got our application information back');
		t.equal(data['_id'] != undefined, true, 'we got a new _id');
		t.equal(data.d['clientId'] != undefined, true, 'we got a clientId');
		t.equal(data.d['allowAnonymous'], true, 'Anonymous login is allowed');
		app1 = data.d['domainName'];
		console.log('app Name for Nico: ' + app1);
		fl.login({"username": "nico@framelink.co", "password": "coLas", "domain": app1}, function (err, data){
			t.equal(err, null, "fl.login should return no error");
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
test("create application", function(t){
	fl.applicationCreate({"adminName": "joao@framelink.co", "adminPassWord": "oLiVeIrA", "domainPrefix": "SampleJ", 
		 				  "description": "sample Application for Joao"}, function (err, data){
		//console.log(JSON.stringify(err));
		t.equal(err, null, "applicationCreate should return no error");
		t.equal(data!=null, true, 'we got our application information back');
		t.equal(data['_id'] != undefined, true, 'we got a new _id');
		t.equal(data.d['clientId'] != undefined, true, 'we got a clientId');
		t.equal(data.d['allowAnonymous'], true, 'Anonymous login is allowed');
		app2 = data.d['domainName'];
		console.log('app name for Joao: ' + app2);
		fl.login({"username": "joao@framelink.co", "password": "oLiVeIrA", "domain": app2}, function (err, data){
			console.log('err ' + JSON.stringify(err));
			t.equal(err, null, "fl.login should return no error");
			var myApp =data.applications[0];
			fa.connect(myApp, function(err2, data2){
				t.equal(err2, null, "fl.app.connect should return no error");
				t.equal(data2.status, 'OK', "fl.app.connect should return a status OK");
				fa.logMessage('***** salut Jaoo ********', function(err3, data){
					t.equal(err3, null, "fl.message should return no error");
					t.end();
				});
			});
		});
	});
});