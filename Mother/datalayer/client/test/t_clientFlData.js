/*
	flData Client API tests

	version 1.0, N.Cuvillier

	this will be always the more up to date documentation..

*/

var toolsDef=require('../../tools-1.js');
var tools = new toolsDef('t_clientFlData');

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
			//t.equal(data2.status, 'OK', "fl.app.connect should return a status OK");
			t.end();
		});
	});
});
test("remove all data in Master_4Z", function(t){
	fd.remove("4Z", {query:{}, options:{single:false}}, function(er, dr){
		t.equal(er, null, "remove returns no error");
		t.end();
	});
});

test("can insert data", function(t){
	var dt=new Date().toDateString();
	fd.insert("4Z", { 
					d:{"56": dt, "57": 0, "58": true},
					r:[ {r:"59", s: 0, "e": "50", l:[ {_id: "789fgd89", u:"x", j:{a:1}}]}]
					}, function (ei, d1){
		t.equal(ei, null, "data.insert returns no error");
		if(ei == null){
			t.equal(d1.length, 1, "we got one document back");
			t.equal(d1[0].d["57"], 0, "we got our data back");
			t.equal(d1[0]["_id"] != null, true, "we got an _id");
			t.equal(d1[0].r[0].l[0].u, 'n', "update flag has been resetted to 'n'");
		}
		t.end();
	});
});

test("can insert batch data", function(t){
	var dt=new Date().toDateString();
	var data=[];
	for(var no=1; no<=10; no++)
	{
		data.push({ 
					d:{"56": dt, "57": no, "58": true},
					r:[ {r:"59", s: 0, "e": "50", l:[ {_id: "789fgd89", u:"y", j:{a:1}}]}]
					}
			);
	}
	fd.insert("4Z", data, function (ei, di){
		t.equal(ei, null, "data.insert returns no error");
		if(ei==null){
			t.equal(di.length, 10, "we inserted 10 new documents");
			t.equal(di[2].d["57"], 3, "third document has a good '57'");
			t.end();
		}
	});
});

test("findOne with no relationInfo, only field 57 (and _id)", function(t){
	fd.findOne("4Z", {query:{"57":2}, relation:{info:0}, projection:{"57":1}}, function(ee, dd){
		t.equal(ee, null, "findOne with no relationInfo returns no error");
		t.equal(dd.d["57"], 2, "findOne with no relationInfo field '57' is found");
		t.equal(dd.d["56"], undefined, "findOne with no relationInfo field '58' is not returned");
		t.equal(JSON.stringify(dd.r) == '{}', true, "no relations are returned");
		t.end();
	});
});

test("can findOne with no relationInfo with prefix in the query clause", function(t){
	fd.findOne("4Z", {query:{"d.57":2}, noPrefix:true, relation:{info:0}, projection:{"d.57":1}}, function(ee, dd){
		t.equal(ee, null, "findOne with no relationInfo returns no error");
		t.equal(dd.d["57"], 2, "findOne with no relationInfo field '57' is found");
		t.equal(dd.d["56"], undefined, "findOne with no relationInfo field '58' is not returned");
		t.equal(JSON.stringify(dd.r) == '{}', true, "no relations are returned");
		t.end();
	});
});

test("findOne with relationInfo", function(t){
	fd.findOne("4Z", {query:{"57":2}, relation:{info:1}, projection:{'58':1, '_id':0}}, function(ee, dd){
		t.equal(ee, null, "findOne with relatiobsInfo returns no error");
		t.equal(dd["_id"], undefined, "findOne with relatiobsInfo field _id' is not returned");
		t.equal(dd.d["58"], true, "findOne with relatiobsInfo field '58' is returned");
		t.equal(dd.r[0].l[0]["_id"], "789fgd89", "findOne with relatiobsInfo relation information is given");
		t.end();
	});
});

test("findOne non existing documents", function(t){
	fd.findOne("4Z", {query:{"57":12345}}, function(ee, dd){
		t.equal(ee, null, "findOne returns no error");
		t.equal(dd, null, "no document is returned (normal)");
		t.end();
	});
});

test("findOne all with an error in the query clause", function(t){
	fd.findOne("4Z", {query:{"58": true}, projection:{"57":0}, relation:{info:2, relations:{"59":1}} }, function(ee, dd){
		t.equal(ee != null, true, "this findOne should return an error");
		t.end();
	});
});
test("findAll non existing documents", function(t){
	fd.findAll("4Z", {query:{"57":12345}}, function(ee, dd){
		t.equal(ee, null, "findAll on non existing documents returns no error");
		t.equal(dd, null, "no document are returned");
		t.end();
	});
});
test("findAll all documents", function(t){
	fd.findAll("4Z", {query:{}}, function(ee, dd){
		t.equal(ee, null, "findAll all documents returns no error");
		t.equal(dd.length, 11, "10 documents are returned");
		t.end();
	});
});
test("findAll all documents sorted", function(t){
	fd.findAll("4Z", {query:{}, sort:{"57":1}}, function(ee, dd){
		t.equal(ee, null, "findAll all documents sorted returns no error");
		t.equal(dd[0].d['57'], 0, "first document is the smaller");
		t.equal(dd[10].d['57'], 10, "last document is the bigger");
		t.end();
	});
});
test("findAll all documents reverse order sorted", function(t){
	fd.findAll("4Z", {query:{}, sort:{"57":-1}}, function(ee, dd){
		t.equal(ee, null, "findAll all documents sorted reverse order returns no error");
		t.equal(dd[0].d['57'], 10, "first document is the bigger");
		t.equal(dd[10].d['57'], 0, "last document is the smaller");
		t.end();
	});
});
test("findAll all documents skip and limit", function(t){
	fd.findAll("4Z", {query:{}, noPrefix:true, sort:{"d.57":1}, skip:3, limit:4}, function(ee, dd){
		t.equal(ee, null, "findAll all documents sorted returns no error");
		t.equal(dd.length, 4, "10 documents are returned");
		t.equal(dd[0].d['57'], 3, "first document is number 3");
		t.equal(dd[3].d['57'], 6, "last document is number 6");
		t.end();
	});
});

test("update on field", function(t){
	fd.update("4Z", {query:{"57":10}, update:{"57":25}}, function(ee, dd){
		t.equal(ee, null, "update simple returns no error");
		fd.findOne("4Z",{query:{"57":25}}, function (eu, du){
			t.equal(eu, null, "re-read returns no error");
			//console.dir(du);
			fd.findOne("4Z", {query:{"57": 25}, projection:{"57":1}, relation:{info:1, relations:{"59":1}} }, function(ee, dd){
				t.equal(ee, null, "this findOne should return an error");
				t.equal(du.d != null, true, "re-read find our document");
				t.equal(du.d["57"], 25, "data was updated");
				t.equal(du.d["56"] != undefined, true, "other fields are still here");
				t.end();
			});
		})
	});
});

test("update simple", function(t){
	fd.update("4Z", {query:{"57":6}, update:{$set:{"57":24}}}, function(ee, dd){
		t.equal(ee, null, "update simple returns no error");
		t.equal(dd.count, 1, 'update one rows');
		fd.findOne("4Z",{query:{"57":24}}, function (eu, du){
			t.equal(eu, null, "re-read returns no error");
			//console.dir(du);
			t.equal(du.d != null, true, "re-read find our document");
			t.equal(du.d["57"], 24, "data was updated");
			//console.dir(dd);
			t.end();
		})
	});
});

test("findAndModify getting the document before the update", function(t){
	fd.findAndModify("4Z", {query:{"57":9}, sort:{_id:1}, update:{$set:{"57":30}}}, function(ee, dd){
		//console.log(JSON.stringify(ee)+":" + JSON.stringify(dd));
		t.equal(ee, null, "findAndModify getting the document before the update returns no error");
		t.equal(dd != null && dd.d != null, true, "findAndModify getting the document before the update returns a document");
		t.equal((dd == null)? null : dd.d["57"], 9, "findAndModify receive the documents before the update");
		//console.dir(dd);
		t.end();

	});
});

test("findAndModify with new:true", function(t){
	fd.findAndModify("4Z", {query:{"57":8}, sort:{_id:1}, update:{$set:{"57":40}}, options:{new: true}}, function(ee, dd){
		//console.log(JSON.stringify(ee)+":" + JSON.stringify(dd));
		t.equal(ee, null, "findAndModify with new:true returns no error");
		t.equal(dd != null && dd.d != null, true, "findAndModify with new:true returns a document");
		t.equal((dd == null)? null : dd.d["57"], 40, "findAndModify receive the documents after the update");
		//console.dir(dd);
		t.end();

	});
});

//db.Master_4Z.findAndModify({"query":{"d.57":40}, new:true, "sort":{"_id":1},remove:true} )
test("findAndModify remove", function(t){
	fd.findAndModify("4Z", {query:{"57":7}, sort:{_id:1}, options:{remove:true}}, function(ee, dd){
		//console.log(JSON.stringify(ee)+":" + JSON.stringify(dd));
		t.equal(ee, null, "findAndModify remove returns no error");
		t.equal(dd != null && dd.d != null, true, "findAndModify remove getting the original document before the remove");
		t.equal((dd == null)? null : dd.d["57"], 7, "findAndModify receive the documents before the remove");
		//console.dir(dd);
		t.end();
	});
});

test("findAndModify remove a non existant document", function(t){
	fd.findAndModify("4Z", {query:{"57":12345}, sort:{_id:1}, options:{remove:true}}, function(ee, dd){
		//console.log("******" +JSON.stringify(ee)+":" + JSON.stringify(dd));
		t.equal(ee, null, "findAndModify remove a non existant document returns no error");
		t.equal(dd == null, true, "findAndModify remove a non existant document getting nothing");
		//console.dir(dd);
		t.end();

	});
});

test("findAndModify simple get new document", function(t){
	fd.findAndModify("4Z", {query:{"57":30}, sort:{_id:1}, update:{$set:{"57":99}}, options:{ new:true} }, function(ee, dd){
		t.equal(ee, null, "findAndModify simple get new doc returns no error");
		t.equal(dd !=null&&dd.d != null, true, "findAndModify returns the new document");
		t.equal((dd == null)? null: dd.d["57"], 99, "findAndModify receive the documents after the update");
		//console.dir(dd);
		t.end();
	});
});

test("count simple", function(t){
	fd.count("4Z", function(ee, dd){
		t.equal(ee, null, "count simple returns no error");
		t.equal(dd.count, 10, "11 documents in the entity");
		t.end();
	});
});

test("count not existing entity", function(t){
	fd.count("ZZZZZZZZZZZZZZZ", function(ee, dd){
		//console.dir(ee);
		t.equal(ee!=null, true, "non existing entity should returns an error");
		t.equal(dd, null, "count with an error should not have any data");
		t.end();
	});
});
test("count skip", function(t){
	fd.count("4Z", {skip:{skip:3}}, function(ee, dd){
		t.equal(ee, null, "count skip returns no error");
		t.equal(dd.count, 7, "10 documents in the entity");
		t.end();
	});
});

test("count with a query", function(t){
	fd.count("4Z", {query:{"57":0}}, function(ee, dd){
		t.equal(ee, null, "count with a query returns no error");
		t.equal(dd.count, 1, "1 document in the entity has d.57:0");
		t.end();
	});
});
test("remove without single:false Master_4Z", function(t){
	var nbDocs=0;
	fd.count("4Z", function(ee, dd){
		t.equal(ee, null, "count simple returns no error");
		nbDocs=dd.count;
		fd.remove("4Z", {query:{}}, function(er, dr){
			t.equal(er, null, "remove returns no error");
			fd.count("4Z", function(ee, dd){
				t.equal(ee, null, "count simple returns no error");
				t.equal(dd.count, nbDocs-1, "only one documents was removed");
				fd.remove("4Z", {query:{}, options:{single:false}}, function(er, dr){
					t.equal(er, null, "remove with single:false returns no error");
					fd.count("4Z", function(ee, dd){
						t.equal(ee, null, "count simple returns no error");
						t.equal(dd.count, 0, "all documents was removed");
						t.end();
					});
				});
			});
		});
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
