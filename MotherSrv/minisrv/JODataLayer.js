// Database Interface with MongoDB - The single place to access mongodb in this server.
//   build the function and always return json output to the callback function
var monk = require('monk');
var db =  monk('localhost:27017/FLApps');

function dlEntityGetAll( callBack){
	console.log("Data Layer dlEntityGetAll will be called.");
	db.driver.collectionNames(function(e,names){
		console.log('Mongo access done for :dlEntityGetAll');
		callBack(names);
	});
}
function dlEntityGet(entityCN,callBack){
	console.log("Data Layer dlEntityGet will be called for entityCN="+entityCN);
    var collecName = 'Master_' + entityCN;
	var collection = db.get(collecName);
	collection.find({},{},function(e,docs){
		var j=[];
		for(var it in docs){
			j.push(docs[it].j);
		}
		console.log('Mongo access done for :dlEntityGet');
		callBack(j);
	});
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
exports.dlEntityGetAll = dlEntityGetAll;
exports.dlEntityGet = dlEntityGet;
exports.dlDummyTableHeader = dlDummyTableHeader;
exports.dlDummyTableData = dlDummyTableData;
