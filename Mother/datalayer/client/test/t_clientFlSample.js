/*
	flData Client API tests

	version 1.0, N.Cuvillier

	Basic update to the sample DataBase

*/

var toolsDef=require('../../tools-1.js');
var tools = new toolsDef('t_clientFlData');

var axDef= require('../ajaxNode.js');
var ax = new axDef();
var flMain=require('../flClient.js');
var fl = new flMain(ax.callAjax);
var fs=require('fs');
var assert=require('assert');
var test=require('tap').test;
var apiSrv=process.env.FLAPISRV || 'localhost';
var cliTrace=process.env.FLCLITRACE || 0;
var fa = new fl.app();
var fd = new fl.data();
var custCN;

test("test variables are well loaded", function(t){
	t.equal(fa!=undefined, true, "fl.app is loaded");
	t.equal(fd!=undefined, true, "fl.data is loaded");
	t.end();
});
test("can connect to flApiSrv", function(t){
		fl.serverName(apiSrv);
		fl.setTraceClient(cliTrace);
		fl.login({"username": "Nico", "password": "coLas"}, function (err, data){
//		fl.login({"username": "Joao", "password": "oLiVeIrA"}, function (err, data){
		t.equal(err, null, "fl.login should return no error");
		var myApp =data.applications[0];
		fa.connect(myApp, function(err2, data2){
			t.equal(err2, null, "fl.app.connect should return no error");
			//t.equal(data2.status, 'OK', "fl.app.connect should return a status OK");
			t.end();
		});
	});
});
test("remove all customer living in Portugal", function(t){
	fl.setTraceServer(40);
	fd.remove("50", {query:{"53":'Portugal'}, options:{single:false}}, function(er, dr){
		t.equal(er, null, "remove is Done");
		t.end();
	});
});

test("insert Customer", function(t){
	var dt=new Date().toDateString();
	fd.insert("50", { 
					d:{"51":'Nome do cliente', '52':'Cascais', '53': 'Portugal', '54':['cliente@sapo.pt', 'clienteportugese@gmail.com']},
					r:[ {r:"59", s: 0, "e": "50", l:[ {_id: "789fgd89", u:"y", j:{a:1}}]}]
					}, function (ei, d1){
		t.equal(ei, null, "insert customer returns no error");
		if(ei == null){
			t.equal(d1.length, 1, "we got one document back");
			t.equal(d1[0].d["53"], 'Portugal', "we got our data back");
			t.equal(d1[0]["_id"] != null, true, "we got an _id");
		}
		t.end();
	});
});
// NCNC : chek option no stop on error + dans le code dbLayer!insertDataInt pour bien formater l option
test("insert Customer in batch mode", function(t){
	var dt=new Date().toDateString();
	fd.insert("50", [
		{d:{"51":'cliente 1', '52':'Lisboa', '53': 'Portugal', '54':['cliente@sapo.pt', 'clienteportugese@gmail.com']}},
		{d:{"51":'cliente 2', '52':'Sintra', '53': 'Portugal', '54':['cliente@sapo.pt', 'clienteportugese@gmail.com']}},
		{d:{"51":'cliente 3', '52':'Porto', '53': 'Portugal', '54':['cliente@sapo.pt', 'clienteportugese@gmail.com']}},
		{d:{"51":'cliente 4', '52':'Sintra', '53': 'Portugal', '54':['cliente@sapo.pt', 'clienteportugese@gmail.com']}},
		{d:{"51":'cliente 5', '52':'Aveiro', '53': 'Portugal', '54':['cliente@sapo.pt', 'clienteportugese@gmail.com']}}

			], function (ei, d1){
		t.equal(ei, null, "insert customer returns no error");
		if(ei == null){
			t.equal(d1.length, 5, "we got 5 documents back");
			t.equal(d1[4].d["53"], 'Portugal', "we got our data back");
			t.equal(d1[0]["_id"] != null, true, "cliente 1 got an _id");
			t.equal(d1[1]["_id"] != null, true, "cliente 2 got an _id");
			t.equal(d1[2]["_id"] != null, true, "cliente 3 got an _id");
			t.equal(d1[3]["_id"] != null, true, "cliente 4 got an _id");
			t.equal(d1[4]["_id"] != null, true, "cliente 5 got an _id");
			custCN=d1[2]["_id"];	// save an _id
		}
		t.end();
	});
});
test("count number of customer in Portugal", function(t){
	fd.count("50", {query:{"53":'Portugal'}}, function(ee, dd){
		t.equal(ee, null, "count with a query returns no error");
		t.equal(dd.count, 6, "6 customers are in Portugal");
		t.end();
	});
});
test("findOne non existing customer", function(t){
	fd.findOne("50", {query:{"_id":12345}}, function(ee, dd){
		t.equal(ee, null, "findOne returns no error");
		t.equal(dd, null, "no document is returned (normal)");
		t.end();
	});
});
test("findOne with a known _id", function(t){
	fd.findOne("50", {query:{"_id": custCN}}, function(ee, dd){
		t.equal(ee, null, "findOne with an _id should return no error");
		t.equal(dd.d["51"], 'cliente 3', "findOne with an _id found the good customer");
		t.end();
	});
});
test("findOne with a known _id", function(t){
	fd.findOne("50", {query:{"_id": custCN}, projection:{'51':1}}, function(ee, dd){
		t.equal(ee, null, "findOne with an _id should return no error");
		t.equal(dd.d["51"], 'cliente 3', "findOne with an _id found the good customer");
		t.end();
	});
});

test("findAll customers (name only)", function(t){
	fd.findAll("50", {query:{}, projection:{'51':1}}, function(ee, dd){
		t.equal(ee, null, "findAll on non existing documents returns no error");
		t.equal(dd.length > 20, true, "more than 20 customers");
		t.equal(dd[0].d["51"]!= undefined, true, "FindAll returns the name");
		t.equal(dd[0].d["52"]== undefined, true, "findAll didn't return the city");
		t.end();
	});
});
test("findAll all documents sorted", function(t){
	fd.findAll("50", {query:{}, sort:{"53":1}}, function(ee, dd){
		t.equal(ee, null, "findAll all documents sorted by country returns no error");
		t.end();
	});
});

test("findAndModify getting the customer before the update", function(t){
	fd.findAndModify("50", {query:{"_id":custCN}, sort:{_id:1}, update:{$set:{"52":'Sintra'}}}, function(ee, dd){
		//console.log(JSON.stringify(ee)+":" + JSON.stringify(dd));
		t.equal(ee, null, "findAndModify getting the document before the update returns no error");
		t.equal(dd != null && dd.d != null, true, "findAndModify getting the document before the update returns a document");
		t.equal((dd == null)? null : dd.d["52"], 'Porto', "findAndModify receive the documents before the update");
		fd.findOne("50", {query:{"_id": custCN}, projection:{'52':1} }, function(ee, dd){
			t.equal(ee, null, "findOne with an _id should return no error");
			t.equal(dd.d["52"], 'Sintra', "the city was updated");
			t.end();
		});
	});
});

test("findAndModify getting the customer after the update with new:true", function(t){
	fd.findAndModify("50", {query:{"_id":custCN}, sort:{_id:1}, update:{$set:{"52":'Cascais'}}, options:{new: true}}, function(ee, dd){
		//console.log(JSON.stringify(ee)+":" + JSON.stringify(dd));
		t.equal(ee, null, "findAndModify getting the document before the update returns no error");
		t.equal(dd != null && dd.d != null, true, "findAndModify getting the document before the update returns a document");
		t.equal((dd == null)? null : dd.d["52"], 'Cascais', "findAndModify receive the documents before the update");
		fd.findOne("50", {query:{"_id": custCN}, projection:{'52':1}}, function(ee, dd){
			t.equal(ee, null, "findOne with an _id should return no error");
			t.equal(dd.d["52"], 'Cascais', "the city was updated");
			t.end();
		});
	});
});

test("findAndModify remove", function(t){
	fd.findAndModify("50", {query:{"_id":custCN}, sort:{_id:1}, options:{remove:true}}, function(ee, dd){
		//console.log(JSON.stringify(ee)+":" + JSON.stringify(dd));
		t.equal(ee, null, "findAndModify remove returns no error");
		t.equal(dd != null && dd.d != null, true, "findAndModify remove getting the original document before the remove");
		fd.findOne("50", {query:{"_id": custCN}, projection:{'52':1}}, function(ee, dd){
			t.equal(ee, null, "findOne with an _id should return no error");
			t.equal(dd, null, "the customer was removed");
			t.end();
		});
	});
});

test("findAndModify remove a non existant document", function(t){
	fd.findAndModify("50", {query:{"_id":custCN}, sort:{_id:1}, options:{remove:true}}, function(ee, dd){
		//console.log(JSON.stringify(ee)+":" + JSON.stringify(dd));
		t.equal(ee, null, "findAndModify remove a non existant document returns no error");
		t.equal(dd == null, true, "findAndModify remove a non existant document getting nothing");
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
