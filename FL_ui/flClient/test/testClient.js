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
//fl.setTraceServer(srvTrace);
/*
test("test variables are well loaded", function(t){
	t.equal(fa!=undefined, true, "fl.app is loaded");
	t.equal(fd!=undefined, true, "fl.data is loaded");
	t.end();
});
var cli1;
var cli2;
*/

test("create Client", function(t){
	fl.clientCreate({"adminName": "nico@framelink.co", "adminPassWord": "coLas", "clientName": "newClient"}, function (err, data){
		//console.log(JSON.stringify(err));
		t.equal(err, null, "clientCreate should return no error");
		t.equal(data!=null, true, 'we got our client information back');
		t.equal(data['_id'] != undefined, true, 'we got a new _id');
		cli1=data.d['clientName'];
		fl.clientCreate({"adminName": "nico@framelink.co", "adminPassWord": "coLas", "clientName": "newClient"}, function (err, data){
			//console.log(JSON.stringify(err));
			t.equal(err, null, "clientCreate should return no error");
			t.equal(data!=null, true, 'we got our client information back');
			t.equal(data['_id'] != undefined, true, 'we got a new _id');
			cli2=data.d['clientName'];
			t.end();
		});
	});
});

test("create Client", function(t){
	fl.clientCreate({"adminName": "nico@framelink.co", "adminPassWord": "coLas", "clientName": "fRaMeLiNk"}, function (err, data){
		console.log(JSON.stringify(err));
		t.equal(err, 'Reserved name', "clientCreate is not allwed to create a client named framelink");
		t.end();
	});
});

test("clientGetList", function(t){
	fl.clientGetList({"adminName": "nico@framelink.co", "adminPassWord": "coLas"}, function (err, data){
		//console.log(JSON.stringify(err));
		t.equal(err, null, "clientGetList should return no error");
		//console.dir(data);
		t.equal(data.length >= 2, true, 'we got our list');
		t.end();
	});
});

test("remove client", function(t){
	fl.clientRemove({"adminName": "nico@framelink.co", "adminPassWord": "coLas", "clientName": cli1}, function (err, data){
		//console.log(JSON.stringify(err));
		t.equal(err, null, "clientRemove should return no error");
		fl.clientRemove({"adminName": "nico@framelink.co", "adminPassWord": "coLas", "clientName": cli2}, function (err, data){
			//console.log(JSON.stringify(err));
			t.equal(err, null, "clientRemove should return no error");
			t.end();
		});
	});
});
test('get session trace', function(t){
	console.log( fl.flushTraceClient() );
	t.end();
});
/*
*/
