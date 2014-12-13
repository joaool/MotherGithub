var async=require('async');

var axDef= require('../ajaxNode.js');
var ax = new axDef();
var flMain=require('../flClient.js');
var fl = new flMain(ax.callAjax);
var apiSrv=process.env.FLAPISRV || 'localhost';
var cliTrace=process.env.FLCLITRACE || 0;
var fa = new fl.app();
var fd = new fl.data();
var fEnt= new fl.entity();
var fField=new fl.field();
var fRel=new fl.relation();

fl.serverName(apiSrv);
fl.setTraceClient(cliTrace);
/*
fl.login({"username": "nico@framelink.co", "password": "coLas"}, function (err, data){
	if(err)
		return console.log("I cannot connect to the service#1 !!");
	var myApp =data.applications[0];
	fa.connect(myApp, function(err2, data2){
		if (err)
			return console.log("I cannot connect to the service#2 !!");
*/
		test(function(){console.log("Bye");});
/*	});
});
*/
function test(cb)
{
	try
	{

		async.waterfall([
			/////////////// INSERT CODE HERE
   function(callback){
       console.log('fl.clientCreate({"adminName":"nico@framelink.co","adminPassWord":"coLas","clientName":"newClient"}) ');
       fl.clientCreate({"adminName":"nico@framelink.co","adminPassWord":"coLas","clientName":"newClient"}, function(err, result){
           if(err) console.log("** ERROR ** : " + JSON.stringify(err)); else console.log("    --> returns: " + JSON.stringify(result));
           console.log(" "); callback(null);
       })
   },
   function(callback){
       console.log('fl.clientCreate({"adminName":"nico@framelink.co","adminPassWord":"coLas","clientName":"newClient"}) ');
       fl.clientCreate({"adminName":"nico@framelink.co","adminPassWord":"coLas","clientName":"newClient"}, function(err, result){
           if(err) console.log("** ERROR ** : " + JSON.stringify(err)); else console.log("    --> returns: " + JSON.stringify(result));
           console.log(" "); callback(null);
       })
   },
   function(callback){
       console.log('fl.clientCreate({"adminName":"nico@framelink.co","adminPassWord":"coLas","clientName":"fRaMeLiNk"}) ');
       fl.clientCreate({"adminName":"nico@framelink.co","adminPassWord":"coLas","clientName":"fRaMeLiNk"}, function(err, result){
           if(err) console.log("** ERROR ** : " + JSON.stringify(err)); else console.log("    --> returns: " + JSON.stringify(result));
           console.log(" "); callback(null);
       })
   },
   function(callback){
       console.log('fl.clientGetList({"adminName":"nico@framelink.co","adminPassWord":"coLas"}) ');
       fl.clientGetList({"adminName":"nico@framelink.co","adminPassWord":"coLas"}, function(err, result){
           if(err) console.log("** ERROR ** : " + JSON.stringify(err)); else console.log("    --> returns: " + JSON.stringify(result));
           console.log(" "); callback(null);
       })
   },
   function(callback){
       console.log('fl.clientRemove({"adminName":"nico@framelink.co","adminPassWord":"coLas","clientName":"newClient"}) ');
       fl.clientRemove({"adminName":"nico@framelink.co","adminPassWord":"coLas","clientName":"newClient"}, function(err, result){
           if(err) console.log("** ERROR ** : " + JSON.stringify(err)); else console.log("    --> returns: " + JSON.stringify(result));
           console.log(" "); callback(null);
       })
   },
   function(callback){
       console.log('fl.clientRemove({"adminName":"nico@framelink.co","adminPassWord":"coLas","clientName":"newClient1"}) ');
       fl.clientRemove({"adminName":"nico@framelink.co","adminPassWord":"coLas","clientName":"newClient1"}, function(err, result){
           if(err) console.log("** ERROR ** : " + JSON.stringify(err)); else console.log("    --> returns: " + JSON.stringify(result));
           console.log(" "); callback(null);
       })
   },

 
/*
*/
			//////////////// LEAVE THIS PART
			function(callback){
				fa.disconnect(function(e, d){
					callback(e);
				})
			}
           ], function (err) {
	            if(err)
	                console.log("******** Erreur in test: " + JSON.stringify(err));
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
