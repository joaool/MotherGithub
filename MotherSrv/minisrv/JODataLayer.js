// Database Interface with MongoDB - The single place to access mongodb in this server.
//   build the function and always return json output to the callback function
var monk = require('monk');
var db =  monk('localhost:27017/FLApps');
var tabCodec=[
	// Entity
	{"entityCN":"_id", "singular":"6", "plural":"H", "description":"7", "index":"F", "cachedFI":"G", "indexName":"8", "indexKeys":"C", "indexProperties":"D"},
	{"_id":"entityCN", "6":"singular", "H":"plural", "7":"description", "F":"index", "G":"cachedFI", "8":"indexName", "C":"indexKeys", "D":"indexProperties"},
	// Field
	{"fieldCN":"_id", "name":"6", "description":"7", "typeUI":"A"},
	{"_id":"fieldCN", "6":"name", "7":"description", "A":"typeUI"},
	// Relation
	{"relationCN":"_id", "relationName":"6", "left":"K", "right":"L", "linkedCN":"M", "cardinality":"O", "verb":"P", "storeIndex":"Q", "dataCached":"R", "format":"S"},
	{"_id":"relationCN", "6":"relationName", "K":"left", "L":"right", "M":"linkedCN", "O":"cardinality", "P":"verb", "Q":"storeIndex", "R":"dataCached", "S":"format"},
	// for getName
	{"6":"name"},
	{"name":"6"}
	    ];

function dlEntityGetAll( callBack){
    try {
	console.log("Data Layer dlEntityGetAll will be called");
	var collection = db.get("Master_0");
	var where={};
	where["j.5"]="E";
	collection.find(where, {_id:0, "j":1}, function (rsl, docs){
		if (docs== null)
		    throw ("dlEntityGetAll: no Entities found");
		console.log('Mongo access done for :dlEntityGetAll before decode : ' + JSON.stringify(docs));
		console.log('\n');
		var j=[];
		var tmpJ={};
		for(var it in docs){
			tmpJ = decodeJSonDico(docs[it], 1);
			j.push(tmpJ);
		}
		console.log('Mongo access done for :dlEntityGetAll after decode : ' + JSON.stringify(j));
		console.log('\n');
		callBack(j);
	});
    }
    catch(err)
    {
	console.log("*** !!! Erreur dans dlEntityGetAll : " + err + " !!! ***");
	callBack({});
    }
}
function dlEntityGet(entityCN,callBack){
    try {
	if (entityCN== null )
	    throw ("invalid parameter");

	console.log("Data Layer dlEntityGet will be called for entityCN="+entityCN);
	var collection = db.get("Master_0");
	collection.findOne({_id: entityCN.toString(), "j.5":"E"}, {_id:0, "j":1}, function (rsl, docs){
		if (docs != null)
		{
			console.log('Mongo access done for :dlEntityGet before decode : docs=' + JSON.stringify(docs));
			console.log('\n');
	
			var j = decodeJSonDico(docs, 1);
			console.log('Mongo access done for :dlEntityGet after decode : ' + JSON.stringify(j));
			console.log('\n');
			callBack( j );
		}
		else{
		    console.log(' no entity found !');
		    callBack({});
		}
	});
    }
    catch(err)
    {
	console.log("*** !!! Erreur dans dlEntityGet : " + err + " !!! ***");
        callBack({});
    }
}
function dlDataGet(params, callBack){
	var entityCN=params.entityCN;
	var id=params.id;
	console.log("Data Layer dlDataGet will be called for entityCN="+entityCN+",id =" + id);
	
	try {
		var collecName = 'Master_' + entityCN;
		var collection = db.get(collecName);
		collection.findOne( {_id: id}, {}, function(e, docs){
			console.log('Mongo access done for :dlDataGet : ' + JSON.stringify(docs));
			console.log('Mongo access done for :dlDataGet : ' + e);
			if (docs != null){
				callBack(docs.j);
			} else{
				callBack({});
			}
		});
	}
	catch(err)
	{
		console.log("*** !!! Erreur dans dldataGet : " + err + " !!! ***");
		callBack({});
	}
}
function dlDataGetAll(params, callBack){
	var entityCN=params.entityCN;
	var where = params.where;
	console.log("Data Layer dlDataGetAll will be called for entityCN="+entityCN);
	if (where != null && where != "")
		console.log("      with where = <" + where + ">");
	else
		where = {};
	try {
		var collecName = 'Master_' + entityCN;
		var collection = db.get(collecName);
		collection.find(where,{},function(e,docs){
			console.log('Mongo access done for :dlDataGetAll : ' + JSON.stringify(docs));
			var j=[];
			for(var it in docs){
				j.push(docs[it].j);
			}
			callBack(j);
		});
	}
	catch(err)
	{
		console.log("*** !!! Erreur dans dlDataGeAllt : " + err + " !!! ***");
		callBack({});
	}
}
function dlDummyTableHeader(entityCN,callBack){
	//NOTE:This will be broken in one access to fields of entity CN and another acesss to corresponding grid titles (depend on the grid)
	console.log("Data Layer dlTableHeader will be called for entityCN="+entityCN);
	var tableHeader ={header:[
		{ "mData": "name", "sTitle":"Name from server" },
		{ "mData": "position", "sTitle":"Position" },
		{ "mData": "salary", "sTitle":"Salary" },
		{ "mData": "start_date", "sTitle":"Start date" },
		{ "mData": "office" , "sTitle":"Office" },
		{ "mData": "extn", "sTitle":"Phone" }
	]};
	console.log('Mongo access done for :dlDummyTableHeader');
	callBack(tableHeader);
}
function dlDummyTableData(entityCN,callBack){
	console.log("Data Layer dlDummyTableData will be called for entityCN="+entityCN);
	var tableData ={data:[
		{
			"name": "Tiger Nixon",
			"position": "System Architect",
			"salary": "$320,800",
			"start_date": "2011\/04\/25",
			"office": "Edinburgh",
			"extn": "5421"
		},
		{
			"name": "Garrett Winters",
			"position": "Accountant",
			"salary": "$170,750",
			"start_date": "2011\/07\/25",
			"office": "Tokyo",
			"extn": "8422"
		},
		{
			"name": "Ashton Cox",
			"position": "Junior Technical Author",
			"salary": "$86,000",
			"start_date": "2009\/01\/12",
			"office": "San Francisco",
			"extn": "1562"
		}
	]};
	console.log('Mongo access done for :dlDummyTableData');
	callBack(tableData);
}
function decodeJSonDico(j, sens){
    try {
	if (sens != 0 && sens != 1)
	    throw ("invalid argument sens");
	
	if (j["j"]["5"]== null)
	    throw ("invalid argument j");
	
	switch (j["j"]["5"])
	{
	    case "E":
		return decodeJSonDicoGeneric(j.j, sens);
	    case "F":
		return decodeJSonDicoGeneric(j.j, sens+2);
	    case "R":
		return decodeJSonDicoGeneric(j.j, sens+4);
	}
	throw ("Unknown type (5)");
    }
    catch(err)
    {
	console.log("decodeJSonDico erreur : " + err);
        throw ("decodeJsonDico: " + err);
    }    
}

function jsonConcat(o1, o2, prefix) {
 for (var key in o2) {
  //print ("key: " + prefix+key + " => " + 2[key]);
  o1[prefix+key] = o2[key];
 }
 return o1;
}

function decodeJSonDicoGeneric(js, indTab){
    //print("Entering DicoGeneric");
    //printjson(js);
    //print (indTab);
    //printjson(tabCodec[indTab]);

    var jd={};

    for ( var key in js ){
	//print ("Analyze: " + key + "->" + js[key] + ", type: " + typeof(js[key]) + ", tabCodec[indTab][k] ?: " + tabCodec[indTab][key] );

	// look for sub nodes
	if (typeof (js[key]) == "object" )
	{
		jsonConcat(jd, decodeJSonDicoGeneric(js[key], indTab), tabCodec[indTab][key]+"_");
	}
	else{
	    if (tabCodec[indTab][key] != null) {
		//print (key + ", type : " + typeof(js[key]) );
		jd[tabCodec[indTab][key]]=js[key];
	    }
	}
    }
    //print ("returning");
    //printjson(jd);
    return jd;
}

exports.dlEntityGetAll = dlEntityGetAll;
exports.dlEntityGet = dlEntityGet;
exports.dlDataGet = dlDataGet;
exports.dlDataGetAll = dlDataGetAll;
exports.dlDummyTableHeader = dlDummyTableHeader;
exports.dlDummyTableData = dlDummyTableData;
