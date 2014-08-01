/*
	flData Client API tests

	version 1.0, N.Cuvillier

	this will be always the more up to date documentation..

*/

var toolsDef=require('../../tools-1.js');
var tools = new toolsDef('t_clientFlEntity');

var axDef= require('../ajaxNode.js');
var ax = new axDef();
var flMain=require('../flClient.js');
var fl = new flMain(ax.callAjax);
var apiSrv=process.env.FLAPISRV || 'localhost';
var cliTrace=process.env.FLCLITRACE || 0;
var fs=require('fs');
var assert=require('assert');
var test=require('tap').test;
var fa = new fl.app();
var fd = new fl.data();
var fEntity = new fl.entity();
var eCN;
var eCN2;
var eDesc = "this is a full description";

test("test variables are well loaded", function(t){
	t.equal(fa!=undefined, true, "fl.app is loaded");
	t.equal(fd!=undefined, true, "fl.data is loaded");
	t.end();
});

test("can connect to flApiSrv", function(t){
	fl.serverName(apiSrv);
	fl.setTraceClient(cliTrace);
	fl.login({"username": "Nico", "password": "coLas"}, function (err, data){
		t.equal(err, null, "fl.login should return no error");
		var myApp =data.applications[0];
		fa.connect(myApp, function(err2, data2){
			t.equal(err2, null, "fl.app.connect should return no error");
			//t.equal(data.status, 'OK', "fl.app.connect should return a status OK");
			t.end();
		});
	});
});

test("simple entity.getOne on Master_0 (should return null because no options:{system:true} is specified)", function(t){
	fEntity.getOne({query: {_id: "0"}}, function(ee, dd){
		t.equal(ee, null, "simple entity.getOne on Master_0 returned no error");
		t.equal(dd, null, "simple entity.getOne on Master_0 returns null");
		t.end();
	});
});

test("simple entity.getOne on Master_0 with {system:true}", function(t){
	fEntity.getOne({query: {_id: "0"}, options:{system:true}}, function(ee, dd){
		t.equal(ee, null, "simple entity.getOne  on Master_0 with {options:{system:true}} returned no error");
		t.equal(dd.d["1"], "0", "simple entity.getOne  on Master_0 with {options:{system:true}} found our new entity");
		t.end();
	});
});

// test API going to the server
test("entity.add", function(t){
	fEntity.add({"3": "testEntity", "4": eDesc, 'E': 'testEntities'}, function (err, data){
		t.equal(err, null, 'entity.add should return no error');
		t.equal(data != null, true, 'entity.add should return the created entity');
		t.equal(data[0] != null && data[0]['_id'] != undefined, true, 'entity.add give us an _id');
		t.equal(data[0]['_id'], data[0]['d']['1'], 'entity.add initialized the field "1" (eCN)');
		eCN=data[0]['_id'];
		t.equal(data[0]['d']['2'], 'E', 'entity.add initialized the field "2" (dicoType)');
		t.end();
	})
});

test("update.entity", function(t){
	// fEntity.update({query:{"_id":eCN}, update:{"4":'new Name'}}, function(err, data){
	fEntity.update({query:{"_id":eCN}, update:{"3":'new Name',"E":'new names'}}, function(err, data){
		console.dir(data);
		t.equal(err, null, 'entity.update should return no error');
		t.equal(data.count , 1, 'entity.updated one row');
		t.end();		
	})
});

test("simple entity.getOne", function(t){
	fEntity.getOne({query:{_id: eCN}, projection:{"1":1, "4":1}}, function(ee, dd){
		t.equal(ee, null, "simple entity.getOne returns no error");
		t.equal(dd.d["1"], eCN, "simple entity.getOne found our new entity");
		t.equal(dd.d["4"], 'new Name', "we got our entity with the new name");
		t.equal(dd.d["2"]==undefined, true, "simple entity.getOne projection should not return field '2'");
		t.end();
	});
});
test("simple entity.getOne on Master_0", function(t){
	fEntity.getOne({query: {_id: "0"}, options:{system:true}}, function(ee, dd){
		t.equal(ee, null, "simple entity.getOne  on Master_0 returned no error");
		t.equal(dd.d["1"], "0", "simple entity.getOne  on Master_0 found our new entity");
		t.end();
	});
});
test("entity.getOne with projection", function(t){
	fEntity.getOne({query:{'1': eCN}, projection:{"1":1}}, function(ee, dd){
		t.equal(ee, null, "entity.getOne with projection returns no error");
		t.equal(dd.d["1"], eCN, "entity.getOne with projection returns the field '1'");
		t.equal(dd["_id"], eCN, "entity.getOne with projection returns an _id");
		t.equal(dd.d["3"], undefined, "entity.getOne with projection did not return the field '3'");
		t.end();
	});
});
test("simple entity.getAll with one document", function(t){
	fEntity.getAll({query:{_id: eCN}, projection:{"1":1}}, function(ee, dd){
		t.equal(ee, null, "simple entity.getAll with one document returns no error");
		t.equal(dd.length, 1, "simple entity.getAll with one document got only one document");
		t.equal(dd[0].d["1"], eCN, "simple entity.getAll with one document found our new entity");
		t.end();
	});
});
test("simple entity._findAll on Master_0 with one document", function(t){
	fEntity.getAll({query:{_id: "0"}, options:{system:true}, projection:{"1":1}}, function(ee, dd){
		t.equal(ee, null, "simple entity.getAll on Master_0 with one document returns no error");
		t.equal(dd.length, 1, "simple entity.getAll on Master_0 with one document got only one document");
		t.equal(dd[0].d["1"], "0", "simple entity.getAll on Master_0 with one document found our new entity");
		t.end();
	});
});
test("entity.getAll limit 2 documents with projection and limit", function(t){
	fEntity.getAll({query:{}, projection:{"1":1}, limit:2}, function(ee, dd){
		t.equal(ee, null, "entity.getAll limit 2 documents with projection returns no error");
		t.equal(dd.length, 2, "entity.getAll limit 2 documents with projection gor two documents");
		t.equal(dd[1]["_id"] != undefined, true, "entity.getAll limit 2 documents with projection returns an _id");
		t.equal(dd[1].d["3"], undefined, "entity.getAll limit 2 documents with projection did not return the field '3'");
		t.end();
	});
});
test("entity.getAll user entities - for Joao", function(t){
	fEntity.getAll({query:{}}, function(ee, dd){
		t.equal(ee, null, "entity.getAll user entities returns no error");
		t.equal(dd.length > 2, true, "entity.getAll user entities gor two documents");
		t.end();
	});
});

test("entity.getAll user and system entities - for Joao", function(t){
	fEntity.getAll({query:{}, options:{system:true}}, function(ee, dd){
		t.equal(ee, null, "entity.getAll user and system entities returns no error");
		t.equal(dd.length>9, true, "entity.getAll user and system entities got nine or more documents");
		t.end();
	});
});

/*
*/
test("Disconnect", function(t){
	fa.disconnect(function(e, d){
		t.equal(e, null, "disconnect returns no error");
		t.equal(d.message, 'bye', "we got the bye message");
		t.end();
	});
});
