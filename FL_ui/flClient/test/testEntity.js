/*
	flData Client API tests

	version 1.0, N.Cuvillier

	this will be always the more up to date documentation..

	findAndModify : non teste ici
	remove: to be implemented on the server side, with the entity.drop...
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
	fl.login({"username": "nico@framelink.co", "password": "coLas"}, function (err, data){
		t.equal(err, null, "fl.login should return no error");
		var myApp =data.applications[0];
		fa.connect(myApp, function(err2, data2){
			t.equal(err2, null, "fl.app.connect should return no error");
			//t.equal(data.status, 'OK', "fl.app.connect should return a status OK");
			fa.logMessage('***** salut Nico ********', function(err, data){
				t.end();
			});
		});
	});
});

test("entity.getAllWithField one entity", function(t){
	fEntity.getAllWithField({query: {_id: '5O'}}, function(ee, dd){
		t.equal(ee, null, "simple entity.getAllWithField returned no error");
//		t.equal(dd, null, "simple entity.getOne on Master_0 returns null");
		t.end();
	});
});

test("entity.getAllWithField all dictionary", function(t){
	fEntity.getAllWithField({query: {}}, function(ee, dd){
		t.equal(ee, null, "simple entity.getAllWithField returned no error");
//		t.equal(dd, null, "simple entity.getOne on Master_0 returns null");
		t.end();
	});
});

// test API going to the server
test("entity.add", function(t){
	fEntity.add({"3": "testEntity", "4": eDesc, 'E': 'testEntities'}, function (err, data){
		t.equal(err, null, 'entity.add should return no error');
		t.equal(data != null, true, 'entity.add should return the created entity');
		t.equal(data[0] != null && data[0]['_id'] != undefined, true, 'entity.add give us an _id');
		t.equal(data[0]['_id'] != null, true, 'entity.add initialized the field "_id" (eCN)');
		t.equal(data[0]['d']['1'], -1, 'entity.add initialized the field "1" (-1)');
		eCN=data[0]['_id'];
		t.equal(data[0]['d']['2'], 'E', 'entity.add initialized the field "2" (dicoType)');
		t.end();
	})
});
test("entity.addWithField (one Entity, 4 fields)", function(t){
	var superE=
	{'3': 'myNeEnt', '4': 'super description', 'E':'myNewEnts',
	 'fields':[
	 	{'3': 'name', '4': 'description for field name', 'K': 'label', 'M': 'string', '9':'textbox'},
	 	{'3': 'field2', '4': 'description for field2', 'K': 'label2', 'M': 'number', '9':'textbox'},
	 	{'3': 'field3', '4': 'description for field3', 'K': 'label3', 'M': 'boolean', '9':'checkbox'},
	 	{'3': 'fiedl4', '4': 'description for field4', 'K': 'label4', 'M': 'integer', '9':'textbox'}
	 ] }
	fEntity.addWithFields(superE, function(ee, dd){
		//console.log('err: ' + JSON.stringify(ee));
		t.equal(ee, null, "simple entity.getAllWithField returned no error");
		t.equal(dd[0].fields.length, 4, "getAllWithField created 4 fields");
		t.end();
	});
});

test("entity.addWithField (one Entity, 4 fields)", function(t){
	var tt={"3":"xClient","4":"asasasas","E":"xClients","fields":
	[
	//{"3":"id","4":"_unNamed's id","9":"textbox","K":"id","M":"string","O":false,"N":null},
	{"3":"id","4":"_unNamed s id","9":"textbox","K":"id","M":"string","O":false,"N":null},
	{"3":"nome","4":"_unNamed  nome","9":"textbox","K":"Nome","M":"string","O":false,"N":null},
	{"3":"marca","4":"_unNamed  marca","9":"textbox","K":"Marca","M":"string","O":false,"N":null},
	{"3":"morada","4":"_unNamed  morada","9":"textbox","K":"Morada","M":"string","O":false,"N":null},
	{"3":"cod postal","4":"_unNamed  cod postal","9":"textbox","K":"Cod Postal","M":"string","O":false,"N":null},
	{"3":"localidade","4":"_unNamed  localidade","9":"textbox","K":"Localidade","M":"string","O":false,"N":
		[
		"Amadora",
		"Lisboa",
		"Almada",
		"Mafra",
		"Belas",
		"Venda Pinheiro",
		"Porto",
		"Alverca",
		"Lavradio",
		"Famoes",
		"Parede",
		"Carnaxide",
		"Carcavelos",
		"Esposende",
		"Sintra",
		"Oeiras",
		"Povoa Sta Iria",
		"Odivelas",
		"Azeitao",
		"Barcarena",
		"Porto Salvo",
		"Povoa Sto Adriao",
		"S. Mamede Infesta",
		"Vila Nova Gaia",
		"Mem Martins",
		"Estoril",
		"Paço Arcos",
		"arcozelo",
		"Escapães",
		"Azambuja",
		"Loures",
		"Alges",
		"Cascais",
		"Vila Franca Xira",
		"Charneca Caparica",
		"Alhandra",
		"Vila Nova de Gaia"
		]},
	{"3":"telefone","4":"_unNamed' telefone","9":"textbox","K":"Telefone","M":"string","O":false,"N":null},
	{"3":"email","4":"_unNamed' email","9":"textbox","K":"Email","M":"string","O":false,"N":null},
	{"3":"produto","4":"_unNamed' produto","9":"textbox","K":"Produto","M":"string","O":false,"N":["High","Medium","Premium"]}
	]};

	fEntity.addWithFields(tt, function(ee, dd){
		//console.log('err: ' + JSON.stringify(ee));
		t.equal(ee, null, "simple entity.getAllWithField returned no error");
		//t.equal(dd[0].fields.length, 4, "getAllWithField created 4 fields");
		t.end();
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
		t.equal(dd.d["3"], 'flMaster', "simple entity.getOne  on Master_0 with {options:{system:true}} found our new entity");
		t.end();
	});
});
// test API going to the server
test("entity.add", function(t){
	fEntity.add({"3": "testEntity", "4": eDesc, 'E': 'testEntities'}, function (err, data){
		t.equal(err, null, 'entity.add should return no error');
		t.equal(data != null, true, 'entity.add should return the created entity');
		t.equal(data[0] != null && data[0]['_id'] != undefined, true, 'entity.add give us an _id');
		t.equal(data[0]['_id'] != null, true, 'entity.add initialized the field "_id" (eCN)');
		t.equal(data[0]['d']['1'], -1, 'entity.add initialized the field "1" (-1)');
		eCN=data[0]['_id'];
		t.equal(data[0]['d']['2'], 'E', 'entity.add initialized the field "2" (dicoType)');
		t.end();
	})
});

// test API going to the server
test("entity.add with missing fields", function(t){
	fEntity.add({"3": "testEntity", "4": eDesc}, function (err, data){
		t.equal(err, 'Invalid arguments', 'entity.add with missing arguments should return an error');
		t.end();
	})
});

test("update.entity", function(t){
	fEntity.update({query:{"_id":eCN}, update:{"4":'new Name'}}, function(err, data){
		t.equal(err, null, 'entity.update should return no error');
		t.equal(data.count , 1, 'entity.updated one row');
		t.end();		
	})
});
test("update.entity a non authorized field", function(t){
	fEntity.update({query:{"_id":eCN}, update:{"1":'00'}}, function(err, data){
		t.equal(err, 'Invalid arguments', 'entity.add a non authorized field should return an error');
		t.end();		
	})
});

test("simple entity.getOne", function(t){
	fEntity.getOne({query:{_id: eCN}, projection:{"1":1, "4":1}}, function(ee, dd){
		t.equal(ee, null, "simple entity.getOne returns no error");
		t.equal(dd.d["4"], 'new Name', "we got our entity with the new name");
		t.equal(dd.d["2"]==undefined, true, "simple entity.getOne projection should not return field '2'");
		t.end();
	});
});
test("simple entity.getOne on Master_0", function(t){
	fEntity.getOne({query: {_id: "0"}, options:{system:true}}, function(ee, dd){
		t.equal(ee, null, "simple entity.getOne  on Master_0 returned no error");
		t.equal(dd.d["3"], "flMaster", "simple entity.getOne  on Master_0 found our new entity");
		t.end();
	});
});
test("entity.getOne with projection", function(t){
	fEntity.getOne({query:{'_id': eCN}, projection:{"1":1}}, function(ee, dd){
		t.equal(ee, null, "entity.getOne with projection returns no error");
		t.equal(dd.d["1"], -1, "entity.getOne with projection returns the field '1'");
		t.equal(dd["_id"], eCN, "entity.getOne with projection returns an _id");
		t.equal(dd.d["3"], undefined, "entity.getOne with projection did not return the field '3'");
		t.end();
	});
});
test("simple entity.getAll with one document", function(t){
	fEntity.getAll({query:{_id: eCN}, projection:{"1":1}}, function(ee, dd){
		t.equal(ee, null, "simple entity.getAll with one document returns no error");
		t.equal(dd.length, 1, "simple entity.getAll with one document got only one document");
		t.equal(dd[0].d["1"], -1, "simple entity.getAll with one document found our new entity");
		t.end();
	});
});
test("simple entity.getAll on Master_0 with one document", function(t){
	fEntity.getAll({query:{_id: "0"}, options:{system:true}, projection:{"1":1}}, function(ee, dd){
		t.equal(ee, null, "simple entity.getAll on Master_0 with one document returns no error");
		t.equal(dd.length, 1, "simple entity.getAll on Master_0 with one document got only one document");
		t.equal(dd[0]["_id"], "0", "simple entity.getAll on Master_0 with one document found our new entity");
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
