/*
	flData Client API tests

	version 1.0, N.Cuvillier

	this will be always the more up to date documentation..

	findAndModify: non teste ici
	remove non implemente

	manque le flEnt.groupFieldAsJson call
	manque le ffield.remove, non implemente
*/

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
var ffield = new fl.field();
var eCN;
var fCN2;
var eDesc = "this is a full description";

test("test variables are well loaded", function(t){
	t.equal(fa!=undefined, true, "fl.app is loaded");
	t.equal(fd!=undefined, true, "fl.data is loaded");
	t.end();
});

test("can connect to flApiSrv", function(t){
	fl.serverName(apiSrv);
	fl.setTraceClient(cliTrace);
	fl.login({"username": "nico@framelink.co", "password": "coLas"}, function (err, data){
		t.equal(err, null, "fl.login should return no error");
		var myApp =data.applications[0];
		fa.connect(myApp, function(err2, data2){
			t.equal(err2, null, "fl.app.connect should return no error");
			//t.equal(data.status, 'OK', "fl.app.connect should return a status OK");
			t.end();
		});
	});
});
// test API going to the server
test("entity.add", function(t){
	fEntity.add({"3": "testEntity", "4": eDesc, 'E': 'testEntities'}, function (err, data){
		t.equal(err, null, 'entity.add should return no error');
		t.equal(data != null, true, 'entity.add should return the created entity');
		t.equal(data[0] != null && data[0]['_id'] != undefined, true, 'entity.add give us an _id');
		eCN=data[0]['_id'];
		t.end();
	})
});
// test API going to the server
test("field.add with default values", function(t){
	ffield.add(	{"1": eCN, "3": "newField", "4": eDesc, 'K': 'label', 'M':'string', '9':'textbox'}, function (err, data){
		//console.dir(data);
		t.equal(err, null, 'field.add should return no error');
		t.equal(data != null, true, 'field.add should return the created field');
		t.equal(data[0] != null && data[0]['_id'] != undefined, true, 'field.add give us an _id');
		t.equal(data[0]['d']['1'], eCN, 'field.add initialized the field "1" (eCN)');
		fCN=data[0]['_id'];
		t.equal(data[0]['d']['2'], 'F', 'field.add initialized the field "2" (dicoType)');
		t.equal(data[0]['d']['3'], 'newField', 'field.add initialized the field "3" (name)');
		t.equal(data[0]['d']['4'], eDesc, 'field.add initialized the field "4" (description)');
		t.equal(data[0]['d']['K'], 'label', 'field.add initialized the field "K" (label)');
		t.equal(data[0]['d']['L'], ('d.'+fCN), 'field.add initialized the field "L" (prefix)');
		t.equal(data[0]['d']['M'], 'string', 'field.add initialized the field "M" (dataType)');
		t.equal(data[0]['d']['O'], false, 'field.add initialized the field "O" (dataType)');
		t.equal(data[0]['d']['9'], 'textbox', 'field.add initialized the field "O" (dataType)');
		t.end();
	})
});
// test API going to the server
test("field.add all values", function(t){
	ffield.add(	{"1": eCN, "3": "newField", "4": eDesc, 'K': 'lbl', 'M': 'boolean', 'O':true, '9':'combobox'}, function (err, data){
		//console.dir(data);
		t.equal(err, null, 'field.add should return no error');
		t.equal(data != null, true, 'field.add should return the created field');
		t.equal(data[0] != null && data[0]['_id'] != undefined, true, 'field.add give us an _id');
		t.equal(data[0]['d']['1'], eCN, 'field.add initialized the field "1" (eCN)');
		fCN=data[0]['_id'];
		t.equal(data[0]['d']['2'], 'F', 'field.add initialized the field "2" (dicoType)');
		t.equal(data[0]['d']['3'], 'newField', 'field.add initialized the field "3" (name)');
		t.equal(data[0]['d']['4'], eDesc, 'field.add initialized the field "4" (description)');
		t.equal(data[0]['d']['K'], 'lbl', 'field.add initialized the field "K" (label)');
		t.equal(data[0]['d']['L'], ('d.'+fCN), 'field.add initialized the field "L" (prefix)');
		t.equal(data[0]['d']['M'], 'boolean', 'field.add initialized the field "M" (dataType)');
		t.equal(data[0]['d']['O'], true, 'field.add initialized the field "O" (dataType)');
		t.equal(data[0]['d']['9'], 'combobox', 'field.add initialized the field "O" (dataType)');
		t.end();
	})
});
// test API going to the server
test("field.add missing values", function(t){
	ffield.add(	{"1": eCN, "3": "newField", "4": eDesc, 'K': 'lbl', 'M': 'boolean', 'O':true}, function (err, data){
		//console.dir(data);
		t.equal(err, "Invalid arguments", 'field.add with missing argument should an error');
		t.end();
	})
});

test("simple field.getOne", function(t){
	ffield.getOne({query:{_id: fCN}}, function(ee, dd){
		t.equal(ee, null, "simple field.getOne returns no error");
		t.equal(dd.d["K"] != undefined, true, "simple field.getOne found the prefix field");
		t.equal(dd.d["L"], undefined, "default projection do not return the L field");
		t.end();
	});
});
test("field.getOne with projection", function(t){
	ffield.getOne({query:{'_id': fCN}, projection:{"1":1}}, function(ee, dd){
		t.equal(ee, null, "field.getOne with projection returns no error");
		t.equal(dd.d["1"], eCN, "field.getOne with projection returns the field '1'");
		t.equal(dd["_id"], fCN, "field.getOne with projection returns an _id");
		t.equal(dd.d["3"], undefined, "field.getOne with projection did not return the field '3'");
		t.end();
	});
});
test("simple field.getAll for a specific entity", function(t){
	ffield.getAll({query:{'1': eCN}, sort:{'K':-1}}, function(ee, dd){
		t.equal(ee, null, "simple field.getAll for a specific entity returns no error");
		t.equal(dd.length, 2, "we created two fields for this entity");
		t.equal(dd[0]["d"]["K"], 'lbl', "field.getAll for an entity sort the fields in ZA mode (first is bigger)");
		t.equal(dd[1]["d"]["K"], 'label', "field.getAll for an entity sort the fields in ZA mode (last is smaller)");
		t.end();
	});
});

test("field.getAll limit 2 documents with projection and limit", function(t){
	ffield.getAll({query:{'2': 'F'}, projection:{"1":1}, limit:2}, function(ee, dd){
		t.equal(ee, null, "field.getAll limit 2 documents with projection returns no error");
		t.equal(dd.length, 2, "field.getAll limit 2 documents with projection gor two documents");
		t.equal(dd[1]["_id"] != undefined, true, "field.getAll limit 2 documents with projection returns an _id");
		t.equal(dd[1]["d"]["2"] == undefined, true, "field.getAll projection hides fields not on the list");
		t.equal(dd[1]["d"]["3"], undefined, "field.getAll limit 2 documents with projection did not return the field '3'");
		t.end();
	});
});
test("simple update", function(t){
	ffield.update({query:{_id: fCN}, update:{'3':'NewName'}}, function(ee, dd){
		t.equal(ee, null, "simple field.update returns no error");
		t.equal(dd.count, 1, "simple update updates one row");
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
