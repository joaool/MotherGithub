var monk = require('monk');
var db =  monk('localhost:27017/FLApps');

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
function dtTable(response,postData){
	var callback = querystring.parse(callback);
	console.log("Request Handler dtTable was called with callback id = "+callback.text);
	var data={
	    "data": [
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
		]
	};  
	var strData = JSON.stringify(data);
	// response.writeHead(200, {"Content-Type": "application/json"});//{"Content-Type": "text/javascript"});//THIS WORKS WITH test_JO3.html
	// response.write('grid('+ strData + ');');//THIS WORKS WITH test_JO3.html

	response.writeHead(200, {"Content-Type": "application/json", 'Access-Control-Allow-Origin' : '*'});//{"Content-Type": "text/javascript"});

	response.write(strData);
	response.end();
	console.log('----------------------------------------------------------------------------');
	// return "Hello upload";
}
function entityGetAll(response,postData){
	console.log("Request Handler entityGetAll was called.");
	db.driver.collectionNames(function(e,names){
		response.writeHead(200, {"Content-Type": "application/json", 'Access-Control-Allow-Origin' : '*'});//{"Content-Type": "text/javascript"});
		console.log("entityGetAll ->"+JSON.stringify(names));
		response.write(JSON.stringify(names));//OK !!!
		response.end();
		console.log('-----------------------------entityGetAll-----------------------------------');
	});
}
function entityGet(response,postData,query){
	console.log("Request Handler entityGet was called with query = "+query);
	var entityCN = querystring.parse(query)["entityCN"];
	console.log("Request Handler entityGet will call entityCN = "+entityCN);
    var collecName = 'Master_' + entityCN;
	var collection = db.get(collecName);
	collection.find({},{},function(e,docs){
		var j=[];
		for(var it in docs){
			j.push(docs[it].j);
		}
		response.write(JSON.stringify(j));//OK !!!
		response.end();
		console.log('-----------------------------entityGet------------------------------------------');
	});
}
exports.start = start;
exports.dir = dir;
exports.upload = upload;
exports.grid = grid;
exports.dtTable = dtTable;
exports.entityGetAll = entityGetAll;
exports.entityGet = entityGet;
