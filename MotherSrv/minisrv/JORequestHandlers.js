var dataLayer = require('./JODataLayer');

var exec = require("child_process").exec;//executes a shell command from withun node.js
var querystring = require("querystring");
function start(response){
	console.log("Request Handler start was called");
	var body = '<html>'+
		'<head>'+
			'<meta http-equiv="Content-Type" content="text/html; '+
			'charset=UTF-8" />'+
		'</head>'+
		'<body>'+
			'<form action="/upload" method="post">'+
			'<textarea name="text" rows="20" cols="60"></textarea><br>'+
			'<input type="submit" value="Submit text" />'+
			'</form>'+
		'</body>'+
		'</html>';
	response.writeHead(200, {"Content-Type": "text/html"});
	response.write(body);
	response.end();
}
function dir(response){
	console.log("Request Handler dir was called");
	exec("dir *.*", function (error, stdout, stderr) {//Non-blocking code to get a list (ls -lah) of all files in current directory (-l:longlisy format, a:include . entries, h:human readable)
		response.writeHead(200, {"Content-Type": "text/plain"});
		response.write(stdout);
		response.end();
		console.log('----------------------------------------------------------------------------');
	});
	// sleep(10000);//a blocking operation
}
function upload(response,postData){
	console.log("Request Handler upoad was called");
	response.writeHead(200, {"Content-Type": "text/plain"});
	response.write("Hello upload. Received text:" + querystring.parse(postData).text);
	response.end();
	console.log('----------------------------------------------------------------------------');
	// return "Hello upload";
}
function grid(response,postData){
	var callback = querystring.parse(callback);
	console.log("Request Handler grid was called with callback id = "+callback.text);
	response.writeHead(200, {"Content-Type": "application/json"});//{"Content-Type": "text/javascript"});
	response.write('grid({msg:"Hello grid. Received text:' + querystring.parse(postData).text+'"});');
	response.end();
	console.log('----------------------------------------------------------------------------');
	// return "Hello upload";
}
function entityGetAll(response,postData,query){
	console.log("Handler requested:entityGetAll");
	var getJsonForEntityGetAll = function( json){
		response.writeHead(200, {"Content-Type": "application/json", 'Access-Control-Allow-Origin' : '*'});//{"Content-Type": "text/javascript"});
		response.write(JSON.stringify(json));//OK !!!
		response.end();
		console.log('-----------------------------entityGetAll--------------------------------------');
	};
	dataLayer.dlEntityGetAll(getJsonForEntityGetAll); // 
}
function tableEntityGetAll(response,postData,query){
	console.log("Handler requested:tableEntityGetAll");
	var getJsonForEntityGetAll = function( json){
		response.writeHead(200, {"Content-Type": "application/json", 'Access-Control-Allow-Origin' : '*'});//{"Content-Type": "text/javascript"});
		response.write(JSON.stringify(json));//OK !!!
		response.end();
		console.log('-----------------------------tableEntityGetAll--------------------------------------');
	};
	dataLayer.dlTableEntityGetAll(getJsonForEntityGetAll); // 
}
function tableEntityGet(response,postData,query){
	console.log("Handler requested:tableEntityGet with query:"+query);
	var entityCN = querystring.parse(query)["entityCN"];
	var getJsonForTableEntityGet = function( json){
		response.writeHead(200, {"Content-Type": "application/json", 'Access-Control-Allow-Origin' : '*'});//{"Content-Type": "text/javascript"});
		response.write(JSON.stringify(json));
		response.end();
		console.log('-----------------------------tableEntityGet------------------------------------------');
	};
	dataLayer.dlTableEntityGet(entityCN,getJsonForTableEntityGet); // 
}

function entityGet(response,postData,query){
	console.log("Handler requested:entityGet with query:"+query);
	var entityCN = querystring.parse(query)["entityCN"];
	var getJsonForEntityGet = function( json){
		response.writeHead(200, {"Content-Type": "application/json", 'Access-Control-Allow-Origin' : '*'});//{"Content-Type": "text/javascript"});
		response.write(JSON.stringify(json));
		response.end();
		console.log('-----------------------------entityGet------------------------------------------');
	};
	dataLayer.dlEntityGet(entityCN,getJsonForEntityGet); // 
}

function entityAdd(response,postData,query){
	console.log("Handler requested:entityAdd with query:"+query);
	var param={};
	param["name"]= querystring.parse(query)["name"];
	param["names"]= querystring.parse(query)["names"];
	param["desc"]= querystring.parse(query)["desc"];
	var getJsonForEntityAdd = function( json){
		response.writeHead(200, {"Content-Type": "application/json", 'Access-Control-Allow-Origin' : '*'});//{"Content-Type": "text/javascript"});
		response.write(JSON.stringify(json));
		response.end();
		console.log('-----------------------------entityAdd------------------------------------------');
	};
	dataLayer.dlEntityAdd(param,getJsonForEntityAdd); // 
}
// field series
function fieldGet(response,postData,query){
	console.log("Handler requested:fieldGet with query:"+query);
	var fieldCN = querystring.parse(query)["fieldCN"];
	var getJsonForFieldGet = function( json){
		response.writeHead(200, {"Content-Type": "application/json", 'Access-Control-Allow-Origin' : '*'});//{"Content-Type": "text/javascript"});
		response.write(JSON.stringify(json));
		response.end();
		console.log('-----------------------------fieldGet------------------------------------------');
	};
	dataLayer.dlFieldGet(fieldCN,getJsonForFieldGet); // 
}
// field series
function fieldAdd(response,postData,query){
	console.log("Handler requested:fieldAdd with query:"+query);
	var param={};
	param["entityCN"]= querystring.parse(query)["entityCN"];
	param["name"]= querystring.parse(query)["name"];
	param["desc"]= querystring.parse(query)["desc"];
	param["textUI"]= querystring.parse(query)["textUI"];
	console.log("fieldAdd: entityCN: "+ param["entityCN"] +", name: " + param["name"] + ", desc: "+ param["desc"] + ", textUI: " + param["textUI"]);

	var getJsonForFieldAdd = function( json){
		response.writeHead(200, {"Content-Type": "application/json", 'Access-Control-Allow-Origin' : '*'});//{"Content-Type": "text/javascript"});
		response.write(JSON.stringify(json));
		response.end();
		console.log('-----------------------------fieldAdd------------------------------------------');
	};
	dataLayer.dlFieldAdd(param,getJsonForFieldAdd); // 
}
function fieldGetAll(response,postData,query){
	console.log("Handler requested:fieldGetAll with query:"+query);
	var entityCN = querystring.parse(query)["entityCN"];
	var getJsonForFieldGetAll = function( json){
		response.writeHead(200, {"Content-Type": "application/json", 'Access-Control-Allow-Origin' : '*'});//{"Content-Type": "text/javascript"});
		response.write(JSON.stringify(json));
		response.end();
		console.log('-----------------------------fieldGetAll---------------------------------------');
	};
	dataLayer.dlFieldGetAll(entityCN,getJsonForFieldGetAll); // 
}
function fieldGetByName(response,postData,query){
	console.log("Handler requested:fieldGetByName with query:"+query);
	var param={};
	param["entityCN"]= querystring.parse(query)["entityCN"];
	param["fieldName"]= querystring.parse(query)["fieldName"];
	var entityCN = querystring.parse(query)["entityCN"];
	var getJsonForfieldGetByName = function( json){
		response.writeHead(200, {"Content-Type": "application/json", 'Access-Control-Allow-Origin' : '*'});//{"Content-Type": "text/javascript"});
		response.write(JSON.stringify(json));
		response.end();
		console.log('-----------------------------fieldGetByName------------------------------------');
	};
	dataLayer.dlFieldGetByName(param,getJsonForfieldGetByName); // 
}
function fieldGetAllByName(response,postData,query){
	console.log("Handler requested:fieldGetAllByName with query:"+query);
	var fieldName= querystring.parse(query)["fieldName"];
	var getJsonForfieldGetAllByName = function( json){
		response.writeHead(200, {"Content-Type": "application/json", 'Access-Control-Allow-Origin' : '*'});//{"Content-Type": "text/javascript"});
		response.write(JSON.stringify(json));
		response.end();
		console.log('-----------------------------fieldGetAllByName------------------------------------');
	};
	dataLayer.dlFieldGetAllByName(fieldName,getJsonForfieldGetAllByName); // 
}
// getName series
function nameGet(response,postData,query){
	console.log("Handler requested:nameGet with query:"+query);
	var CN = querystring.parse(query)["CN"];
	var getJsonForNameGet = function( json){
		response.writeHead(200, {"Content-Type": "application/json", 'Access-Control-Allow-Origin' : '*'});//{"Content-Type": "text/javascript"});
		response.write(JSON.stringify(json));
		response.end();
		console.log('-----------------------------nameGet------------------------------------------');
	};
	dataLayer.dlNameGet(CN,getJsonForNameGet); // 
}
function CNGet(response,postData,query){
	console.log("Handler requested:CNGet with query:"+query);
	var name = querystring.parse(query)["name"];
	var getJsonForCNGet = function( json){
		response.writeHead(200, {"Content-Type": "application/json", 'Access-Control-Allow-Origin' : '*'});//{"Content-Type": "text/javascript"});
		response.write(JSON.stringify(json));
		response.end();
		console.log('-----------------------------CNGet------------------------------------------');
	};
	dataLayer.dlCNGet(name,getJsonForCNGet); // 
}

// data series
function dataGet(response,postData,query){
	console.log("Handler requested:dataGet with query:"+query);
	var jParam={};
	jParam.entityCN = querystring.parse(query)["entityCN"];
	jParam.id = querystring.parse(query)["id"];
	var getJsonForDataGet = function( json){
		response.writeHead(200, {"Content-Type": "application/json", 'Access-Control-Allow-Origin' : '*'});//{"Content-Type": "text/javascript"});
		response.write(JSON.stringify(json));
		response.end();
		console.log('-----------------------------dataGet------------------------------------------');
	};
	dataLayer.dlDataGet(jParam, getJsonForDataGet); // 
}
// data series
function dataInsert(response,postData,query){
	console.log("Handler requested:dataInsert");
 	var superJ=JSON.parse(postData);
	var getJsonForDataInsert = function( json){
		response.writeHead(200, {"Content-Type": "application/json", 'Access-Control-Allow-Origin' : '*'});//{"Content-Type": "text/javascript"});
		response.write(JSON.stringify(json));
		response.end();
		console.log('-----------------------------dataInsert----------------------------------------');
	};
	dataLayer.dlDataInsert(superJ, getJsonForDataInsert); // 
}
// data series
/*
$.ajax({
    type: "post",
    url: "http://localhost:8888/ajaxRequest", 
    dataType: "json",
    contentType: "application/json; charset=UTF-8",
    data:  JSON.stringify({name: "Manish", address: {city: "BBSR", country: "IN"}})
}).done(function ( data ) {
    console.log("ajax callback response:" + data);
});
This way, your request body will reach the server with the stringified JSON, so you'll be able to do the following:

request.on('end', function() {
    store = JSON.parse(store);
    console.log(store); // ta-daaa, Object!
    response.end(store);
});
*/
function dataUpdate(response,postData,query){
	console.log("Handler requested:dataUpdate");
 	var superJ=JSON.parse(postData);
	var getJsonForDataUpdate = function( json){
		response.writeHead(200, {"Content-Type": "application/json", 'Access-Control-Allow-Origin' : '*'});//{"Content-Type": "text/javascript"});
		response.write(JSON.stringify(json));
		response.end();
		console.log('-----------------------------dataUpdate----------------------------------------');
	};
	dataLayer.dlDataUpdate(superJ, getJsonForDataUpdate); // 
}
function dataGetAll(response,postData,query){
	console.log("Handler requested:dataGet");
	var superJ=JSON.parse(postData);
	console.log("       dataGetAll, superJ: "+ JSON.stringify(superJ));
	var getJsonForDataGetAll = function( json){
		response.writeHead(200, {"Content-Type": "application/json", 'Access-Control-Allow-Origin' : '*'});//{"Content-Type": "text/javascript"});
		response.write(JSON.stringify(json));
		response.end();
		console.log('-----------------------------dataGetAll---------------------------------------');
	};
	dataLayer.dlDataGetAll(superJ, getJsonForDataGetAll); // 
}

function tableDataGet(response,postData,query){
	console.log("Handler requested:tableDataGet with query:"+query);
	var jParam={};
	jParam.entityCN = querystring.parse(query)["entityCN"];
	jParam.id = querystring.parse(query)["id"];
	var getJsonForTableDataGet = function( json){
		response.writeHead(200, {"Content-Type": "application/json", 'Access-Control-Allow-Origin' : '*'});//{"Content-Type": "text/javascript"});
		response.write(JSON.stringify(json));
		response.end();
		console.log('-----------------------------tableDataGet--------------------------------------');
	};
	dataLayer.dlTableDataGet(jParam, getJsonForTableDataGet); // 
}
function tableDataGetAll(response,postData,query){
	console.log("Handler requested:tableDataGetAll with query:"+query);
	var jParam=JSON.parse(postData);
	var getJsonForTableDataGetAll = function( json){
		response.header("Access-Control-Allow-Origin", "*");
    	response.header("Access-Control-Allow-Headers", "X-Requested-With");
		response.write(JSON.stringify(json));
		response.end();
		console.log('-----------------------------tableDataGetAll----------------------------------');
	};
	dataLayer.dlTableDataGetAll(jParam, getJsonForTableDataGetAll); // 
}
function dtTable(response,postData,query){
	console.log("Handler requested:dtTable with query:"+query);
	var getJsonForTableHeader = function(jsonHeader) {
		var getJsonForTableData= function(jsonData) {
			var data={"aoColumns":jsonHeader.header, "data": jsonData.data};
			var strData = JSON.stringify(data);
			response.writeHead(200, {"Content-Type": "application/json", 'Access-Control-Allow-Origin' : '*'});//{"Content-Type": "text/javascript"});
			response.write(strData);
			response.end();
			console.log('----------------------------------dtTable---------------------------------------');
		};
		dataLayer.dlDummyTableData("Dummy",getJsonForTableData);//first param is a NOP for now
	};
	dataLayer.dlDummyTableHeader("Dummy",getJsonForTableHeader );//first param is a NOP for now
}
function dtGrid(response,postData,query){
	console.log("Handler requested:dtGrid with query:"+query);
	var getJsonForGrid = function(jsonHeaderAndData) {
		var fields = [];
		for (var i=0; i < jsonHeaderAndData.header.length; i++ ) {//this is redundant with aoColumns, but it is necessary for datatables
			fields.push({
				"label":jsonHeaderAndData.header[i].sTitle,"name":jsonHeaderAndData.header[i].mData
			});
		}
		var data={"fields":fields, "aoColumns":jsonHeaderAndData.header, "data": jsonHeaderAndData.data};
		var strData = JSON.stringify(data);
		response.writeHead(200, {"Content-Type": "application/json", 'Access-Control-Allow-Origin' : '*'});//{"Content-Type": "text/javascript"});
		response.write(strData);
		response.end();
		console.log('----------------------------------dtGrid---------------------------------------');
	};
	dataLayer.dlHalfDummyGrid("Dummy",getJsonForGrid );//first param is a NOP for now
}
function dtTableCRUD(response,postData,query){
	var callback = querystring.parse(callback);
	var action = querystring.parse(postData).action;//sent by POST
	var id = querystring.parse(postData).id;//sent by POST
	var postDataJSON=querystring.parse(postData);

	var data = null;
	console.log("Request Handler dtTableCRUD was called with callback id = "+callback.text+" and postData="+querystring.parse(postData).text);
	console.log(">>>>Action = "+action);

	var dataEdit={
		"id": id,
		"error": "",
		"fieldErrors": [],
		"data": [],
		"row": {
			"DT_RowId":id,
			"name":postDataJSON["data[name]"],
			"position": postDataJSON["data[position]"],
			"salary": postDataJSON["data[salary]"],
			"start_date": postDataJSON["data[start_date]"],
			"office": postDataJSON["data[office]"],
			"extn": postDataJSON["data[extn]"]
		}
	};
	if(action == "create"){
		data = dataEdit;
	}else if(action == "edit"){
		data = dataEdit;
		data.row["OBJECTID"]="278";
	}
	var strData = JSON.stringify(data);
	response.writeHead(200, {"Content-Type": "application/json", 'Access-Control-Allow-Origin' : '*'});//{"Content-Type": "text/javascript"});
	response.write(strData);
	response.end();
	console.log('-------------------------------dtTableCRUD--------------------------------------');
}
exports.start = start;
exports.dir = dir;
exports.upload = upload;
exports.grid = grid;
exports.dtTable = dtTable;
exports.dtGrid = dtGrid;
exports.dtTableCRUD = dtTableCRUD;

exports.entityGetAll = entityGetAll;
exports.entityGet = entityGet;
exports.entityAdd = entityAdd;

exports.fieldGet = fieldGet;
exports.fieldAdd = fieldAdd;
exports.fieldGetAll = fieldGetAll;
exports.fieldGetByName = fieldGetByName;
exports.fieldGetAllByName = fieldGetAllByName;

exports.CNGet = CNGet;
exports.nameGet = nameGet;

exports.dataGet = dataGet;
exports.dataGetAll = dataGetAll;
exports.dataInsert = dataInsert;
exports.dataUpdate = dataUpdate;

exports.tableEntityGetAll = tableEntityGetAll;
exports.tableEntityGet = tableEntityGet;
exports.tableDataGetAll = tableDataGetAll;
exports.tableDataGet = tableDataGet;
