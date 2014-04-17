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
		response.write(JSON.stringify(json));
		response.end();
		console.log('-----------------------------entityGet------------------------------------------');
	};
	dataLayer.dlEntityGet(entityCN,getJsonForEntityGet); // 
}
function dataGet(response,postData,query){
	console.log("Handler requested:dataGet with query:"+query);
	var jParam={};
	jParam.entityCN = querystring.parse(query)["entityCN"];
	jParam.id = querystring.parse(query)["id"];
	var getJsonForDataGet = function( json){
		response.write(JSON.stringify(json));
		response.end();
		console.log('-----------------------------dataGet------------------------------------------');
	};
	dataLayer.dlDataGet(jParam, getJsonForDataGet); // 
}

function tableDataGet(response,postData,query){
	console.log("Handler requested:tableDataGet with query:"+query);
	var jParam={};
	jParam.entityCN = querystring.parse(query)["entityCN"];
	jParam.id = querystring.parse(query)["id"];
	var getJsonForTableDataGet = function( json){
		response.write(JSON.stringify(json));
		response.end();
		console.log('-----------------------------tableDataGet--------------------------------------');
	};
	dataLayer.dlTableDataGet(jParam, getJsonForTableDataGet); // 
}
function tableDataGetAll(response,postData,query){
	console.log("Handler requested:tableDataGetAll with query:"+query);
	var jParam={};
	jParam.entityCN = querystring.parse(query)["entityCN"];
	jParam.where = querystring.parse(query)["where"];
	var getJsonForTableDataGetAll = function( json){
		response.write(JSON.stringify(json));
		response.end();
		console.log('-----------------------------tableDataGetAll----------------------------------');
	};
	dataLayer.dlTableDataGetAll(jParam, getJsonForTableDataGetAll); // 
}
function dataGetAll(response,postData,query){
	console.log("Handler requested:dataGet with query:"+query);
	var jParam={};
	jParam.entityCN = querystring.parse(query)["entityCN"];
	jParam.where = querystring.parse(query)["where"];
	var getJsonForDataGetAll = function( json){
		response.write(JSON.stringify(json));
		response.end();
		console.log('-----------------------------dataGetAll---------------------------------------');
	};
	dataLayer.dlDataGetAll(jParam, getJsonForDataGetAll); // 
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
exports.dtTableCRUD = dtTableCRUD;
exports.entityGetAll = entityGetAll;
exports.entityGet = entityGet;
exports.dataGet = dataGet;
exports.dataGetAll = dataGetAll;
exports.tableEntityGetAll = tableEntityGetAll;
exports.tableEntityGet = tableEntityGet;
exports.tableDataGetAll = tableDataGetAll;
exports.tableDataGet = tableDataGet;
