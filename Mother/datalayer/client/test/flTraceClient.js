var async=require('async');
var toolsDef=require('../../tools-1.js');
var tools = new toolsDef('t_clientFlData');

var axDef= require('../ajaxNode.js');
var ax = new axDef();
var flMain=require('../flClient.js');
var fl = new flMain(ax.callAjax);
var fa = new fl.app();
var fd = new fl.data();
var fEnt= new fl.entity();
var fField=new fl.field();
var fRel=new fl.relation();

fl.serverName('localhost');
//fl.setTraceClient(2);
//fl.setTraceServer(18)
fl.login({"username": "Nico", "password": "coLas"}, function (err, data){
	if(err)
		return console.log("I cannot connect to the service#1 !!");
	var myApp =data.applications[0];
	fa.connect(myApp, function(err2, data2){
		if (err)
			return console.log("I cannot connect to the service#2 !!");

		test(function(){console.log("Bye");});
	});
});

function test(cb)
{
	try
	{
		async.waterfall([
			/////////////// INSERT CODE HERE


 

			//////////////// LEAVE THIS PART
			function(callback){
				fa.disconnect(function(e, d){
					callback(e);
				})
			}
           ], function (err) {
	            if(err)
	                console.log("Erreur in test: " + JSON.stringify(err));
	            else
	            	console.log("Done with no error");
				fa.disconnect(cb);
	        });
    }
    catch(e)
    {
        cb(e.stack);
    }
}
