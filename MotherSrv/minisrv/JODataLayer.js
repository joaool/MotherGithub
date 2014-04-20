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
	{"5":"typeCN", "6":"name"},
	{"typeCN":"5", "name":"6"},
	// for CN
	{"5":"typeCN", "_id":"CN"},
	{"typeCN":"5", "CN":"_id"}
	    ];

// Entity series
function dlEntityAdd(params, callBack){
    try {
	var name =params.name;
	var names =params.names;
	var desc = params.desc;
	var query={};
    
	var collection = db.get("Master_0");
	query["j.6"]=params.name;
	collection.findOne( query, function(e, docs){
	    if (docs != null ){
			throw ("Collection " + params.name + " already exists");
	    }
	    query["j.6"]=params.names;
	    collection.findOne( query, function(ee, doc2s){
			if (doc2s != null)
			    throw ("Collection " + params.names + " already exists");
		    console.log("entityAdd: " + name + "/" + names + " not found, I got a new CN");
			getNewCN( function(e, CN) {
				if (e!= null){
					console.log ("dlEntityAdd Error in callback from getNewCN: " + e);
					callBack (formatResponseError(99, "dlEntityAdd: " + e));
				}
				console.log ("entityAdd, callbacked by getNewCN, CN = " + JSON.stringify(CN));
				var coll2 = db.get("Master_"+CN);
				coll2.insert({_id:0});
				coll2.remove({_id:0});
				console.log("entityAdd: entity " + "Master_"+CN + " created");

				var e = jSonToMaster_E (CN, name, names, desc);
				var ee = {_id:CN, j:e, r:{}};
				collection.insert(ee); 
				console.log("dlentityAdd: data dictionnary updated");
				callBack ( formatResponseOK({entityCN:CN}) );			
			});
	    });
	});
    }
    catch(err)
    {
	console.log( "dlEntityAdd: " + err);
        callBack( formatResponseError(99, "dlEntityAdd: " + err));
    }
}

function dlEntityGetAll( callBack){
	console.log("Data Layer dlEntityGetAll will be called");
	dlTableEntityGetAll(function(j){
		callBack(formatResponseOK( j) );
	});
}
function dlTableEntityGetAll( callBack){
    try {
	console.log("Data Layer dlTableEntityGetAll will be called");
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
	console.log("Data Layer dlEntityGet will be called");
	dlTableEntityGet(entityCN, function(j){
		callBack(formatResponseOK( j ));
	});
}
function dlTableEntityGet(entityCN,callBack){
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
// field series
function dlFieldGet(fieldCN, callBack){
    try {
	console.log("entering :dlFieldGet");
	var collection = db.get("Master_0");
	collection.findOne( {_id: fieldCN}, {_id:1, "j":1}, function(e, docs){
	    if (docs != null){
		callBack (formatResponseOK( decodeJSonDico(docs, 1) ));
	    } else {
		callBack( formatResponseOK({}) );
	    }
	});
    }
    catch(err)
    {
        console.log("entityGet: " + err);
	callBack( formatResponseError(99, "entityGet: " + err));
    }
}
function dlFieldAdd(param, callBack) {
    try {
    	console.log("dlFieldAdd: entering the dl");
	   	var entityCN =param.entityCN;
		var name =param.name;
		var desc = param.desc;
		var textUI = param.textUI;
		console.log("dlFieldAdd: entityCN: "+ entityCN +", name: " + name + ", desc: "+ desc + ", textUI: " + textUI);

		var collection = db.get("Master_0");
		query={};
		query["_id"]=entityCN;
		query["j.5"]="E";
		collection.findOne( query, function(e, docs){
	    	console.log("dlFieldAdd: check entity: " + docs);
			if (docs !=null){
				query={};
				query["j.6"]=name;
				query["j.5"]="E";
				collection.findOne( query, function(e, docs){
			    	console.log("dlFieldAdd: check for name for this entity  : " + docs);
					if (docs == null) {
						getNewCN( function(e, CN) {
							if (e!= null){
								console.log ("dlfieldAdd Error in callback from getNewCN: " + e);
								callBack (formatResponseError(99, "dlFieldAdd: " + e));
							}
							console.log ("dlFieldAdd, callbacked by getNewCN, CN = " + JSON.stringify(CN));

							var m = jSonToMaster_F(entityCN, CN, name, desc, textUI);
							var mm = {_id:CN, j:m, r:{}};
							console.log ("dlFieldAdd: json for Dico : " + JSON.stringify(mm));
							var rsl = collection.insert(mm); 
							console.log("dlFieldAdd: Dictionary updated: " + rsl);
							
							return formatResponseOK({fieldCN:CN});
						});
					}
					else
						callBack("flEntityAdd: name " + name + "already used for this entity");
				});
			}
			else
				callBack("dlFieldAdd: wrong entityCN", null);
		
	    });
	}
	catch(err)
	{
            return formatResponseError( 99, "fieldAdd: " + err);
	}

}

function dlFieldGetAll(entityCN, callBack){
    try {
	console.log("entering :dlFieldGetAll");
	var collection = db.get("Master_0");
	collection.find( {"j.4": entityCN, "j.5":"F"}, {_id:1, "j":1}, function(e,docs){
	    if (docs != null){
		var result=[];
		for(var it in docs){
		    result.push( decodeJSonDico(docs[it], 1) );
		}
		callBack (formatResponseOK( result ));
	    } else {
		callBack( formatResponseOK({}) );
	    }
	} );
    }
    catch(err)
    {
        console.log("dtFieldGetAll: " + err);
	callBack( formatResponseError(99, "dtFieldGetAllByName: " + err));
    }
}

function dlFieldGetByName(param, callBack){
    try {
	console.log("entering :dlFieldGetByName");
	var collection = db.get("Master_0");
	collection.findOne( {"j.4": param.entityCN, "j.6":param.fieldName}, {_id:1, "j":1}, function(e, docs){
	    if (docs != null){
		callBack (formatResponseOK( decodeJSonDico(docs, 1) ));
	    } else {
		callBack( formatResponseOK({}) );
	    }
	} );
    }
    catch(err)
    {
        console.log("entityGetByName: " + err);
	callBack( formatResponseError(99, "entityGetByName: " + err));
    }
}
function dlFieldGetAllByName(fieldName, callBack){
    try {
	console.log("entering :dlFieldGetAllByName");
	
	var collection = db.get("Master_0");
	collection.find( {"j.5": "F", "j.6":fieldName}, {_id:1, "j":1}, function(e,docs){
	    if (docs != null){
		var result=[];
		for(var it in docs){
		    result.push( decodeJSonDico(docs[it], 1) );
		}
		callBack (formatResponseOK( result ));
	    } else {
		callBack( formatResponseOK({}) );
	    }
	} );
    }
    catch(err)
    {
        console.log("entityGetAllByName: " + err);
	callBack( formatResponseError(99, "entityGetAllByName: " + err));
    }
}
// getName series
function dlNameGet(CN, callBack) {
    try {
	console.log("entering :dlNameGet");
	var collection = db.get("Master_0");
	collection.findOne( {_id: CN}, {_id:0, "j.5":1, "j.6":1}, function(e, docs){
	    if (docs != null){
		callBack (formatResponseOK( decodeJSonDicoGeneric(docs.j, 6) ));
	    } else {
		callBack( formatResponseOK({}) );
	    }
	});
    }
    catch(err)
    {
        console.log("dlNameGet: " + err);
	callBack( formatResponseError(99, "dlNameGet: " + err));
    }
}

function dlCNGet(name, callBack) {
    try {
	console.log("entering :dlCNGet");
	var collection = db.get("Master_0");
	collection.findOne( {"j.6": name}, {_id:1, "j.5":1}, function(e, docs){
	    if (docs != null){
		console.log("before decode: "+ JSON.stringify(docs));
		callBack (formatResponseOK( decodeJSonDicoGeneric(docs.j, 8) ));
	    } else {
		callBack( formatResponseOK({}) );
	    }
	});
    }
    catch(err)
    {
        console.log("dlCNGet: " + err);
	callBack( formatResponseError(99, "dlCNGet: " + err));
    }
}

// data series
function dlDataGet(params, callBack){
	console.log("Data Layer dlDataGet will be called");
	dlTableDataGet(params, function(j){
		callBack(formatResponseOK( j) );
	});
}
function dlTableDataGet(params, callBack){
	var entityCN=params.entityCN;
	var id=params.id;
	console.log("Data Layer dlTableDataGet will be called for entityCN="+entityCN+",id =" + id);
	
	try {
		var collecName = 'Master_' + entityCN;
		var collection = db.get(collecName);
		collection.findOne( {_id: id}, {}, function(e, docs){
			console.log('Mongo access done for :dlTableDataGet : ' + JSON.stringify(docs));
			if (docs != null){
				callBack(docs.j);
			} else{
				callBack({});
			}
		});
	}
	catch(err)
	{
		console.log("*** !!! Erreur dans dlTabledataGet : " + err + " !!! ***");
		callBack({});
	}
}
function dlTableDataGetAll(params, callBack){
	var entityCN=params.entityCN;
	var where = params.where;
	console.log("Data Layer dlTableDataGetAll will be called for entityCN="+entityCN);
	if (where != null && where != "")
		console.log("      with where = <" + where + ">");
	else
		where = {};
	try {
		var collecName = 'Master_' + entityCN;
		var collection = db.get(collecName);
		collection.find(where,{},function(e,docs){
			console.log('Mongo access done for :dlTableDataGetAll : ' + JSON.stringify(docs));
			var j=[];
			for(var it in docs){
				j.push(docs[it].j);
			}
			callBack(j);
		});
	}
	catch(err)
	{
		console.log("*** !!! Erreur dans dlTableDataGetAll : " + err + " !!! ***");
		callBack({});
	}
}
function dlDataGetAll(params, callBack){
	console.log("Data Layer dlDataGetAll will be called");
	dlTableDataGetAll(params, function(j){
		callBack(formatResponseOK( j) );
	});
}

function dlDataInsert(params, callBack){
	var entityCN=params.entityCN;
	var j = JSON.parse(params.j);
	console.log("dlDataInsert called for entityCN="+entityCN+",j =" + JSON.stringify(j));
	console.log("j: " + j["1E"]);
	try {
		var collecName = 'Master_' + entityCN;
		var collection = db.get(collecName);
		var ins = {};
		if (typeof(j['_id']) != "undefined")
			ins[_id]=j['_id'];
		ins['j']=j;
		ins['r']={};
		collection.insert( ins, {}, function(e, docs){
			console.log('Mongo access done for :dlTableDataInsert : ' + JSON.stringify(docs));
			callBack(e, docs);
		});
	}
	catch(err)
	{
		console.log("*** !!! Erreur dans dlTabledataInsert : " + err + " !!! ***");
		callBack("dlDataInsert: " + err, {});
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
    console.log("Entering DicoGeneric");
    console.log(JSON.stringify (js));
    console.log (indTab);
    console.log(JSON.stringify( tabCodec[indTab] ));

    var jd={};

    for ( var key in js ){
	console.log ("Analyze: " + key + "->" + js[key] + ", type: " + typeof(js[key]) + ", tabCodec[indTab][k] ?: " + tabCodec[indTab][key] );

	// look for sub nodes
	if (typeof (js[key]) == "object" )
	{
		jsonConcat(jd, decodeJSonDicoGeneric(js[key], indTab), tabCodec[indTab][key]+"_");
	}
	else{
	    if (tabCodec[indTab][key] != null) {
		console.log (key + ", type : " + typeof(js[key]) );
		jd[tabCodec[indTab][key]]=js[key];
	    }
	}
    }
    console.log ("returning");
    console.log(JSON.stringify( jd ));
    return jd;
}


function add(CN) {
    return addUnit(CN, "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ");
};
function addUnit(CN, strRef)  {

    if (CN == null)
	throw ("addUnit : can't have a null CN in parameter");

    if (strRef == null || strRef.length == 0)
	throw ("addUnit : strRef is null, or empty !");

    if (CN.length == 0)
    {
	return "0";
    }

    var lastChar = CN[CN.length -1];
    var CN2 = CN.substr(0, CN.length -1);
    
    var iPos = strRef.indexOf(lastChar, 0);

    if (iPos == -1)
	    throw ("addUnit: lastChar not found in ref...");
    if (iPos == strRef.length-1)
    {
	    CN2=addUnit (CN2, strRef);
	    return CN2 + '0';
    }
    lastChar = strRef[strRef.indexOf(lastChar, 0) + 1];
    return CN2 + lastChar;
};

function getVersion(){
    var collection = db.get("Master_0");
	var ver = collection.findOne( {_id:"0"}, {_id:0, "j.flInt.ver":1} );

    if (ver == null || ver == "" ){
	    return 0.00;
    }
    return ver["j"]["flInt"]["ver"];
}
function getNewCN(callBack) {
    try {
    	//console.log("getNewCN: entering the function");
		var collection = db.get("Master_0");
		var CN = {};
		collection.findOne( {_id:"0"}, {_id:0, "j.flInt.J":1}, function(e, CN){
		    if (CN == null || CN == "" ){
			    throw ("getNewCN: Master_0, _id:0 not found");
		    }
		    CN=CN["j"]["flInt"]["J"];
		    //console.log("getNewCN: getNewCN got _id:0, current CN = " + CN);
		    
		    var CN2=add(CN);
		    
		    // If another user requested a new CN, rsl.lastErrorObject.n will be 0
		    var collection = db.get("Master_0");
			var rsl = collection.findAndModify({
				query: {_id:"0", "j.flInt.J":CN },
				update: {$set: {"j.flInt.J":CN2}} });

		    //console.log("getNewCN: updated _id:0, with CN = " + CN2);
		    if (rsl != null)
				callBack(null, CN2);
			else
				callback("Erreur getNewCN", null);
		});
    }
    catch(err)
    {
        return formatResponseError(99, "getNewCN: " + err);
    }
};


// Format JSON
function jSonToMaster_F (eid, cn, name, desc, textUI){
    return {
	    _id: cn,
	    4: eid,
	    5: "F",
	    6: name,
	    7: desc,
	    A: textUI
    };
}

function jSonToMaster_E(CN, singulier, pluriel, description){
    if (CN=="0")
	return {
		_id: CN,
		"4": "",
		"5": "E",
		"6": singulier,
		"7": description,
		"F":[],
		"G":[],
		"H": pluriel,
		"flInt": {"J": "0", "ver": flVersion, "lock":"no"}
	};
    
    return {
	    _id: CN,
	    "4": "",
	    "5": "E",
	    "6": singulier,
	    "7": description,
	    "F":[],
	    "G":[],
	    "H": pluriel
    };
}
   
function jSonToMaster_R(cn, name, lEid, lDesc, lCard, lStroreHere, lCached, lFormat, rEid, rDesc, rCard, rStoreHere, rCached, rFormat) { 
    
    return {
	    _id: cn,
	    "4": "",
	    "5": "R",
	    "6": name,
	    "7": lDesc,
	    "K":{
		"M": lEid,
		"N": 0,
		"O": lCard,
		"P": lDesc,
		"Q": lStroreHere,
		"R": lCached,
		"S": lFormat
		},
	    "L":{
		"M": rEid,
		"N": 1,
		"O": rCard,
		"P": rDesc,
		"Q": rStoreHere,
		"R": rCached,
		"S": rFormat
		}
    };
}

function entityAdd(name, names, desc){
    try {
	var query={};
    var collection = db.get("Master_0");

	query["j.6"]=name;
	if ( collection.findOne( query ).toArray() != "")
		throw ("Collection " + name + " already exists");
	    
	query["j.6"]=names;
	if ( collection.findOne( query ).toArray() != "")
		throw ("Collection " + names + " already exists");
	
	var CN = getNewCN();
    
	var e = jSonToMaster_E (CN, name, names, desc);
	db.createCollection("Master_"+CN);
    
	dataInsert(0, e);
	return formatResponseOK({entityCN:CN});
    }
    catch(err)
    {
        return formatResponseError(99, "entityAdd: " + err);
    }
}
//
function formatResponseOK(j, r){
    ctrl = {isOk:true};
    
    if (j==null)
	j={};
	
    if (r==null)
	r={};

    var rtn = {};

    rtn.ctrl = ctrl;
    rtn.j = j;
    rtn.r = r;

    return rtn;    
}
function formatResponseError(errNo, errMsg){
    if (errMsg == null)
	errMsg = "formatResponseError: no error message provided";
	
    if (errNo == null)
	ctrl = {isOk:false, errNo:9999, errMsg: errMsg};
    
    var rtn = {};

    rtn.ctrl = {isOk:false, errNo: errNo, errMsg:errMsg};
    rtn.j = {};
    rtn.r = {};

    return rtn;    
}


// API Exports
exports.dlEntityGet = dlEntityGet;
exports.dlEntityAdd = dlEntityAdd;
exports.dlEntityGetAll = dlEntityGetAll;

exports.dlFieldGet = dlFieldGet;
exports.dlFieldAdd = dlFieldAdd;
exports.dlFieldGetAll = dlFieldGetAll;
exports.dlFieldGetByName = dlFieldGetByName;
exports.dlFieldGetAllByName = dlFieldGetAllByName;

exports.dlDataGet = dlDataGet;
exports.dlDataGetAll = dlDataGetAll;
exports.dlDataInsert = dlDataInsert;

exports.dlCNGet = dlCNGet;
exports.dlNameGet = dlNameGet;

// DtTable calls
exports.dlTableEntityGet = dlTableEntityGet;
exports.dlTableEntityGetAll = dlTableEntityGetAll;
exports.dlTableDataGet = dlTableDataGet;
exports.dlTableDataGetAll = dlTableDataGetAll;
// dummy
exports.dlDummyTableHeader = dlDummyTableHeader;
exports.dlDummyTableData = dlDummyTableData;
