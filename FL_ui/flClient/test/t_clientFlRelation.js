/*
	flData Client API tests

	version 1.0, N.Cuvillier

	this will be always the more up to date documentation..

*/

var toolsDef=require('../../tools-1.js');
var tools = new toolsDef('t_clientField');

var axDef= require('../ajaxNode.js');
var ax = new axDef();
var flMain=require('../flClient.js');
var fl = new flMain(ax.callAjax);
var apiSrv=process.env.FLAPISRV || 'localhost';
var cliTrace=process.env.FLCLITRACE || 0;
var fs=require('fs');
var assert=require('assert');
var test=require('tap').test;
var async=require('async');
var fa = new fl.app();
var fd = new fl.data();
var fEntity = new fl.entity();
var ffield = new fl.field();
var fRel = new fl.relation();
var eCN;
var fCN1;
var fCN2;
var rCN;
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
// test API going to the server
test("entity.add", function(t){
	fEntity.add({"3": "testEntity", "4": eDesc, 'E': 'testEntities'}, function (err, data){
		t.equal(err, null, 'entity.add should return no error');
		t.equal(data != null, true, 'entity.add should return the created entity');
		t.equal(data[0] != null && data[0]['_id'] != undefined, true, 'entity.add give us an _id');
		t.equal(data[0]['_id'], data[0]['d']['1'], 'entity.add initialized the field "1" (eCN)');
		eCN=data[0]['_id'];
		t.end();
	})
});
// test API going to the server
test("field.add with default values", function(t){
	ffield.add(	{"1": eCN, "3": "newField", "4": eDesc}, function (err, data){
		//console.dir(data);
		t.equal(err, null, 'field.add should return no error');
		t.equal(data != null, true, 'field.add should return the created field');
		t.equal(data[0] != null && data[0]['_id'] != undefined, true, 'field.add give us an _id');
		t.equal(data[0]['d']['1'], eCN, 'field.add initialized the field "1" (eCN)');
		fCN1=data[0]['_id'];
		t.end();
	})
});
// test API going to the server
test("field.add all values", function(t){
	ffield.add(	{"1": eCN, "3": "newField", "4": eDesc, 'K': 'lbl', 'M': 'txt', 'O':'smpl'}, function (err, data){
		//console.dir(data);
		t.equal(err, null, 'field.add should return no error');
		t.equal(data != null, true, 'field.add should return the created field');
		t.equal(data[0] != null && data[0]['_id'] != undefined, true, 'field.add give us an _id');
		t.equal(data[0]['d']['1'], eCN, 'field.add initialized the field "1" (eCN)');
		fCN2=data[0]['_id'];
		t.end();
	})
});
test("load data", function(t){
	var id=1;
	async.whilst(
	    function () { return id <= 10; },

	    function (cbInterne) {
	    	fd.insert(eCN, {_id: id, d:{fCN1: 'field1_'+id, fCN2: 'field2_____'+id}}, function(err, data){
	    		if(err){
	    			i = 10;
	    			return cbInterne(err);
	    		}
	    		id++;
				cbInterne(null);
	    	})
		},
	    function (err) {
	    	t.equal(err, undefined, 'insert of 10 documents ok');
	    	fd.count(eCN, {query:{}}, function(err, data){
	    		t.equal(err, null, "10 documents in the new entity");
	    		t.end();
	    	})
	    }
	);
})
test("insert a relation", function(t){
	fRel.add({"3":"relRelexive", "4": 'description of test relation', "00":[
		{'U': eCN, 'Z':0, 'V': 'owns', 'W': '1', 'X': false, 'Y': false},
		{'U': eCN, 'Z':1, 'V': 'owned by', 'W': 'N', 'X': false, 'Y': true}		
		]}, function (err, data){
	    	console.dir(err);
			t.equal(err, null, 'insert with no error');
			t.equal(data != null && data[0]['_id']!= null, true, 'we got a relation back');
			rCN=data[0]['_id'];
			t.equal(data[0].d['3'], "relRelexive", "relation name is ok");
			t.equal(data[0].d['00'].length, 2, "2 entities connected");
			
			t.equal(data[0].d['00'][0]['U'], eCN, "eCN side 0 is ok");
			t.equal(data[0].d['00'][0]['V'], 'owns', "verb side 0 is ok");
			t.equal(data[0].d['00'][0]['W'], '1', "cardinality side 0 is ok");
			t.equal(data[0].d['00'][0]['X'], false, "cachedHere side 0 is ok");
			t.equal(data[0].d['00'][0]['Y'], false, "storedHere side 0 is ok");
			t.equal(data[0].d['00'][0]['Z'], 0, "side side 0 is ok");

			t.equal(data[0].d['00'][1]['U'], eCN, "eCN side 1 is ok");
			t.equal(data[0].d['00'][1]['V'], 'owned by', "verb side 1 is ok");
			t.equal(data[0].d['00'][1]['W'], 'N', "cardinality side 1 is ok");
			t.equal(data[0].d['00'][1]['X'], false, "cachedHere side 1 is ok");
			t.equal(data[0].d['00'][1]['Y'], true, "storedHere side 1 is ok");
			t.equal(data[0].d['00'][1]['Z'], 1, "side side 1 is ok");

			t.end();
	})
})

test("insert two other relations", function(t){
	fRel.add({"3":"testCustomer", "4": 'description of testCustomer', "00":[
		{'U': eCN, 'Z':0, 'V': 'owns', 'W': '1', 'X': false, 'Y': false},
		{'U': '50', 'Z':1, 'V': 'owned by', 'W': 'N', 'X': false, 'Y': true}		
		]}, function (err, data){
	    	console.dir(err);
			t.equal(err, null, 'insert with no error');
			fRel.add({"3":"customerTest", "4": 'description of customerTest', "00":[
				{'U': '50', 'Z':0, 'V': 'owns', 'W': 'N', 'X': false, 'Y': false},
				{'U': eCN, 'Z':1, 'V': 'owned by', 'W': 'N', 'X': false, 'Y': true}		
				]}, function (err, data){
			    	console.dir(err);
					t.equal(err, null, 'insert with no error');

					t.end();
				})
		})
})
test("simple relation.getOne", function(t){
	fRel.getOne({query:{_id: rCN}}, function(ee, dd){
		t.equal(ee, null, "simple field.getOne returns no error");
		t.equal(dd["_id"], rCN, "we ound our relation definition");
		t.end();
	});
});
test("find relation using an entity", function(t){
	fRel.getAll({query:{'00.U': eCN}, projection:{"1":1}}, function(ee, dd){
		t.equal(ee, null, "field.getOne with projection returns no error");
		t.equal(dd.length, 3, "we got 3 item");
		t.end();
	});
});
test("simple update", function(t){
	fRel.update({query:{_id: rCN}, update:{'3':'NewName'}}, function(ee, dd){
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
