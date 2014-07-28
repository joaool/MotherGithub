/*
	flData Client API tests

	version 1.0, N.Cuvillier

	this will be always the more up to date documentation..

*/

var toolsDef=require('../../tools-1.js');
var tools = new toolsDef('t_clientFlapplication');
var async=require('async');
var axDef= require('../ajaxNode.js');
var ax = new axDef();
var flMain=require('../flClient.js');
var fl = new flMain(ax.callAjax);
var fs=require('fs');
var assert=require('assert');
var test=require('tap').test;
var apiSrv=process.env.FLAPISRV || 'localhost';
var cliTrace=process.env.FLCLITRACE || 0;
var fa;
var fd;
var fEntity;
var fField;
var fRelation;
var entityName;
var fieldName;
var relationName;
var eCN={};
var eQte={};
var ent = 0;
var fifi = 0
var oneRelation = 0
var error=false;
var myApp;

var sample=
[
	{	entityName:'Customer', fields:[
		{name:'name', label:'label', dataType:'text', JsonType:'simple'},
		{name:'city', label:'label', dataType:'text', JsonType:'simple'},
		{name:'country', label:'label', dataType:'text', JsonType:'simple'},
		{name:'email', label:'label', dataType:'text', JsonType:'repeatable'}
									],
		loadItems:15,
		loadFunction: function(no){
			var entt={};
			var tmpCN=eCN['Customer'];
			tmpCN=flTools.add(tmpCN); entt[tmpCN]="name" + no;
			tmpCN=flTools.add(tmpCN); entt[tmpCN]="city_" + randomIntInc(1,5);
			tmpCN=flTools.add(tmpCN); entt[tmpCN]="country_" + randomIntInc(1,3);
			tmpCN=flTools.add(tmpCN); entt[tmpCN]=[ "email.cust" + no+"@empty.com", "second_email.cust" + no+"@empty.com","third_email.cust" + no+"@empty.com"];
			return entt;
		}
	 },
	 {	entityName:'Order', fields:[
		{name:'date', label:'label', dataType:'date', JsonType:'simple'},
		{name:'amount', label:'label', dataType:'currency', JsonType:'simple'},
		{name:'shipped', label:'label', dataType:'boolean', JsonType:'simple'}
								   ],
							relations:[
		{name:'CustomerOrder', between:
			[ {entityName:'Customer', cardinality:'1', verb:'xx', storedHere:false},
			  {entityName:'Order', cardinality:'N', verb:'xx', storedHere:true} ]},
		{name:'CustomerDelivery', between:
			[ {entityName:'Customer', cardinality:'1', verb:'xx', storedHere:false},
			  {entityName:'Order', cardinality:'N', verb:'xx', storedHere:true} ]}
									  ],
		loadItems:150,
		loadFunction: function(no){
			var entt={};
			var tmpCN=eCN['Order'];
			tmpCN=flTools.add(tmpCN); entt[tmpCN]=new Date(2014, randomIntInc(1,12),randomIntInc(1,28));
			tmpCN=flTools.add(tmpCN); entt[tmpCN]=randomIntInc(1,999)+ (randomIntInc(0,99)/100);
			tmpCN=flTools.add(tmpCN); entt[tmpCN]=(randomIntInc(1,100)%3==0)?true:false;
			return entt;
		}
	},
	{	entityName:'Product', fields:[
		{name:'name', label:'label', dataType:'text', JsonType:'simple'},
		{name:'family', label:'label', dataType:'text', JsonType:'simple'},
		{name:'price', label:'label', dataType:'currency', JsonType:'simple'}
								   ],
							relations:[
									  ],
		loadItems:20,
		loadFunction: function(no){
			var entt={};
			var tmpCN=eCN['Product'];
			tmpCN=flTools.add(tmpCN); entt[tmpCN]="Product_" + no;
			tmpCN=flTools.add(tmpCN); entt[tmpCN]=randomIntInc(1,7);
			tmpCN=flTools.add(tmpCN); entt[tmpCN]=randomIntInc(1,999)+ (randomIntInc(0,99)/100);
			return entt;
		}
	},
	{	entityName:'OrderLine', fields:[
		{name:'quantity', label:'label', dataType:'numeric', JsonType:'simple'},
		{name:'product', label:'label', dataType:'text', JsonType:'simple'},
		{name:'price', label:'label', dataType:'currency', JsonType:'simple'}
								   ],
							relations:[
		{name:'OrderOrderLine', between:
			[ {entityName:'Order', cardinality:'1', verb:'xx', storedHere:false},
			  {entityName:'OrderLine', cardinality:'N', verb:'xx', storedHere:true} ]},
		{name:'OrderLineProduct', between:
			[ {entityName:'OrderLine', cardinality:'N', verb:'xx', storedHere:true},
			  {entityName:'Product', cardinality:'1', verb:'xx', storedHere:false} ]}		  
									  ],
		loadItems:450,
		loadFunction: function(no){
			var entt={};
			var tmpCN=eCN['OrderLine'];
			tmpCN=flTools.add(tmpCN); entt[tmpCN]=randomIntInc(1, 20);
			tmpCN=flTools.add(tmpCN); entt[tmpCN]=randomIntInc(1, eQte['Product']);
			tmpCN=flTools.add(tmpCN); entt[tmpCN]=randomIntInc(1,999)+ (randomIntInc(0,99)/100);
			return entt;
		}
	}
];

function randomIntInc (low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}

var bIsNewDatabase;
async.series([
	// Connect to our services
    function(callback) { //This is the first task, and callback is its callback task
    	// connect to the server
    	fl.setTraceClient(cliTrace);
		fl.serverName(apiSrv);

		fl.login({"username": "Nico", "password": "coLas"}, function (err, data){
//		fl.login({"username": "Joao", "password": "oLiVeIrA"}, function (err, data){
			if(err)
				throw new Error("can't connect to the server, step1: " + JSON.stringify(err));
			myApp =data.applications[0];
			fa = new fl.app();
			fa.connect(myApp, function(err2, data2){
				console.log('init return err: '+err2 + ', data: ' + JSON.stringify(data2));
				if(err2 == null){
					if(data2.status== 'new DB'){
						console.log('new db');
						bIsNewDatabase=true;
					}
					else {
						if (data2.status == 'OK')
						{
							console.log('db ok');
							bIsNewDatabase=false;
						}
						else
							throw new Error('connect returned a stange status: ' + JSON.stringify(data2));
					}
					fd = new fl.data();
					fEntity = new fl.entity();
					fField = new fl.field();
					fRelation = new fl.relation();
					//console.log("connected");
		            return callback();
				}
				throw new Error("can't connect to the server, step2: " + JSON.stringify(err2));
 	       });
		});
    },
    // load new dictionary if needed
    function(callback) {
    	if (!bIsNewDatabase){
    		console.log('db ok I continue');
    		return callback(); 
    	}
		fa.init(function(er, dr){
    		if(er)
    			throw new Error('Error in fa.init: ' + JSON.stringify(er));
    		// we need to disconnect/reconnect in order to re-load the cache of dictionary
    		fa.disconnect(function(e, d){

    			fa.connect(myApp, function(err2, data2){
				if(err2)
					throw new Error("can't re-connect to the server, step2: " + JSON.stringify(err2));
			
		    		console.log("New dictionary created");
		    		return callback();
		    	});				
			});
		});
    },
    // load data samples
    function(callback) {
	    ent = 0;
		async.whilst(
		    function () { return ent < sample.length;},

		    function (cbLoadAll) {
				entityName = sample[ent].entityName;

		        // async.series([
				async.series([
				    function(cbEntity) {
						fEntity.add({'3': entityName, '4':'desciption of entity ' + entityName, 'E':entityName+'s'}, function (e,data){
							console.log("cb "+ e + ", " + JSON.stringify(data));
							eCN[entityName]=data[0]['_id'];
							console.log("---- Entity " + entityName + ' created with eCN: ' + data[0]['_id']);
							cbEntity();
						});
					},
				    function(cbEntity) {
				    	//console.log("creating fields for " + entityName);
				    	fifi = 0;
						async.whilst(
						    function () { return fifi < sample[ent].fields.length; },

						    function (cbInterne) {
								fieldName = sample[ent].fields[fifi].name;
								//console.log("creating field " + fieldName +' in entity ' + entityName+', CN: ' + eCN[entityName]);
								fField.add({"1":eCN[entityName], "3":fieldName, "4":'this is the field ' + fieldName, 
											"K": sample[ent].fields[fifi].label, "M":sample[ent].fields[fifi].dataType,
											"O":sample[ent].fields[fifi].JsonType} ,function (e,data){
									console.log("     field " + fieldName + ' was created');
									fifi++;
						    		cbInterne();
								});
							},
						    function (err) {
						        cbEntity();
						    }
						);
					},
				    function(cbEntity) {
				    	if(sample[ent].relations == undefined){
				    		console.log("no relations for " + entityName);
				    		return cbEntity();
				    	}
				    	//console.log("creating relations for entity "+entityName);
				    	oneRelation = 0;
						async.whilst(
						    function () { return oneRelation < sample[ent].relations.length; },

						    function (cbInterne) {
						    	var strRelCde ='{"1": "-1", "3": "';
								strRelCde += sample[ent].relations[oneRelation].name;
								strRelCde += '", "4": "this is the relation ';
								strRelCde += sample[ent].relations[oneRelation].name;
								strRelCde += '", "00":[';
								for (var side=0; side< 2; side++){
									strRelCde+='{"U": "' + eCN[sample[ent].relations[oneRelation].between[side].entityName] + '", ';
									strRelCde+='"Z": ' + side +', ';
									strRelCde+='"V": "' + sample[ent].relations[oneRelation].between[side].cardinality + '", ';
									strRelCde+='"W": "' + sample[ent].relations[oneRelation].between[side].verb + '", ';
									strRelCde+='"X": false, ';
									strRelCde+='"Y": ' + sample[ent].relations[oneRelation].between[side].storedHere + '}';
									if (side==0)
										strRelCde+=", ";
								}
								strRelCde += "]}";
								console.log(strRelCde);
								console.dir(JSON.parse(strRelCde));

								//console.log("creating field " + fieldName +' in entity ' + entityName+', CN: ' + eCN[entityName]);
								fRelation.add(JSON.parse(strRelCde), function (e,data){
									console.log("      relation " + fieldName + ' was not created');
									oneRelation++;
						    		cbInterne();
								});
							},
						    function (err) {
						        cbEntity();
						    }
						);
					},
				    function(cbEntity) {
				    	// loading data
				    	if(sample[ent].loadItems == undefined || sample[ent].loadFunction== undefined){
				    		console.log("no data to be loaded for " + entityName);
				    		return cbEntity();
				    	}
				    	console.log("     Loading " + sample[ent].loadItems + ' items');
						eQte[entityName]=sample[ent].loadItems;
				    	var loadFunction=sample[ent].loadFunction;
				    	var id=1;
						async.whilst(
						    function () { return id <= sample[ent].loadItems; },

						    function (cbInterne) {
						    	var js = loadFunction(id);
						    	fd.insert(eCN[entityName], {_id: id.toString(), d:js,r:{}}, function(err, data){
						    		if(err)
						    			console.log('fd.insert Error : ' + err);
						    		//console.log(err+', '+ JSON.stringify(data));
						    		id++;
									cbInterne();
						    	})
							},
						    function (err) {
						        cbEntity();
						    }
						);
					}
				], function(err) { //This is the final callback
				    ent++;
				    console.log("---- entity " + entityName + ' done !');
				    console.log("");
				    cbLoadAll();
				});
		    },	// end of function(cbLoadAll)
		    function (err) {
		    	callback();
		    }	// end of function(err)
		);		// asyncwhilst
    },
    // disconnect
    function(callback) {
		if(fa){
			fa.disconnect(function(e, d){
				//console.log("disconnected");
				callback();
			});
	    }
	    else{
	    	console.log("exit with no disconnect");
	    	callback()
	    }
	}
], function(err) { //This is the final callback
	console.log("Bye, it's done");
});
