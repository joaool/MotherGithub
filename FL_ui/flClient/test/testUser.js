/*
	flData Client API tests

	version 1.0, N.Cuvillier

	this will be always the more up to date documentation..

*/

//var toolsDef=require('../../tools-1.js');
//var tools = new toolsDef('t_clientFlData');

var axDef= require('../ajaxNode.js');
var ax = new axDef();
var flMain=require('../flClient.js');
var fl = new flMain(ax.callAjax);
var apiSrv=process.env.FLAPISRV || 'localhost';
var cliTrace=process.env.FLCLITRACE || 0;
var srvTrace=process.env.FLTRACE || 0;
var fs=require('fs');
var assert=require('assert');
var test=require('tap').test;
var fa = new fl.app();
var fd = new fl.data();
fl.serverName(apiSrv);
fl.setTraceClient(cliTrace);
//fl.setTraceServer(srvTrace);
/*
test("test variables are well loaded", function(t){
	t.equal(fa!=undefined, true, "fl.app is loaded");
	t.equal(fd!=undefined, true, "fl.data is loaded");
	t.end();
});
*/
test("be Sure that toto@gmail.com does not exist", function(t){
	fl.isUserExist({"adminName": "nico@framelink.co", "adminPassWord": "coLas", "userName": "toto@gmail.com"}, function (err, data){
		//console.log(JSON.stringify(err));
		t.equal(err, null, "isUserExist returns no error");
		if(data == null){
			return t.end();
		}
		fl.userRemove({"adminName": "nico@framelink.co", "adminPassWord": "coLas", "userName": "toto@gmail.com"}, function (err, data){
			//console.log(JSON.stringify(err));
			t.equal(err, null, "userRemove should return no error");
			t.end();
		});
	});
});

test("create User", function(t){
	fl.userCreate({"adminName": "nico@framelink.co", "adminPassWord": "coLas", "userName": "toto@gmail.com", "userPassWord": "dodo12345", 
				   "userType": 'user'}, function (err, data){
		//console.log(JSON.stringify(err));
		t.equal(err, null, "userCreate should return no error");
		fl.userCreate({"adminName": "nico@framelink.co", "adminPassWord": "coLas", "userName": "toto@gmail.com", "userPassWord": "dodo12345", 
					   "userType": 'user'}, function (err, data){
			//console.log(JSON.stringify(err));
			t.equal(err, null, "userCreate should return no error");
		t.equal(data!=null, true, 'we got our user information back');
		t.equal(data['_id'] != undefined, true, 'we got a new _id');
		t.equal(data.d['userName'], 'toto@gmail.com', 'we got the userName back');
		t.equal(data.d['userType'], 'user', 'we got the userType back');
		fl.login({"username": "toto@gmail.com", "password": "dodo12345"}, function (err, data){
			t.equal(err, null, "fl.login should return no error");
			t.end();
		});
	});
	});
});
test("isUserExist", function(t){
	fl.isUserExist({"adminName": "nico@framelink.co", "adminPassWord": "coLas", "userName": "toto@gmail.com"}, function (err, data){
		//console.log(JSON.stringify(err));
		t.equal(err, null, "isUserExist returns no error");
		t.equal(data.userName, "toto@gmail.com", "isUserExist returns a userName");
		t.equal(data.isClientAdmin, false, "isUserExist returns false in isClientAdmin");
		t.end();
	});
});
test("isUserExist for non existing user", function(t){
	fl.isUserExist({"adminName": "nico@framelink.co", "adminPassWord": "coLas", "userName": "toto@a.donotexist.com"}, function (err, data){
		//console.log(JSON.stringify(err));
		t.equal(err, null, "isUserExist returns no error");
		t.equal(data, null, "isUserExist returns null for a non existing user");
		t.end();
	});
});
test("create User with wrong admin right", function(t){
	fl.userCreate({"adminName": "toto@gmail.com", "adminPassWord": "dodo12345", "userName": "test", "userPassWord": "dodo12345", "userType": 'user'}, function (err, data){
		//console.log(JSON.stringify(err));
		t.equal(err, 'Access denied', "A user can NOT create a new user");
		t.end();
	});
});
test("create User with wrong type", function(t){
	fl.userCreate({"adminName": "nico@framelink.co", "adminPassWord": "coLas", "userName": "test", "userPassWord": "dodo12345", 
					"userType": 'badType'}, function (err, data){
		//console.log(JSON.stringify(err));
		t.equal(err, 'Invalid type: badType', "userCreate with a wrong userType should return an error");
		t.end();
	});
});

test("change Password", function(t){
	fl.userChangePassWord({"adminName": "nico@framelink.co", "adminPassWord": "coLas", "userName": "toto@gmail.com", "userPassWord": "dodoDeMaurice"}, function (err, data){
		//console.log(JSON.stringify(err));
		t.equal(err, null, "userChangePassWord should return no error");
		t.equal(data, 1, 'we updated one user ');
		t.end();
	});
});
test("change Type", function(t){
	fl.userChangeType({"adminName": "nico@framelink.co", "adminPassWord": "coLas", "userName": "toto@gmail.com", "userPassWord": "dodoDeMaurice", "userType": 'clientAdmin'}, function (err, data){
		//console.log(JSON.stringify(err));
		t.equal(err, null, "userChangeType should return no error");
		t.equal(data, 1, 'we updated one user');
		t.end();
	});
});
test("change Name", function(t){
	fl.userChangeName({"userName": "toto@gmail.com", "userPassWord": "dodoDeMaurice", "newName": "titi@gmail.com", "newPassWord": "dodo2DeMaurice"}, function (err, data){
		//console.log(JSON.stringify(err));
		t.equal(err, null, "userChangePassWord should return no error");
		t.equal(data, 1, 'we updated one user ');
		t.end();
	});
});

test("userGetList", function(t){
	fl.userGetList({"adminName": "nico@framelink.co", "adminPassWord": "coLas"}, function (err, data){
		//console.log(JSON.stringify(err));
		t.equal(err, null, "userChangeType should return no error");
		//console.dir(data);
		t.equal(data.length >= 2, true, 'we got our list');
		fl.userRemove({"adminName": "nico@framelink.co", "adminPassWord": "coLas", "userName": "titi@gmail.com"}, function (err, data){
			//console.log(JSON.stringify(err));
			t.equal(err, null, "userRemove should return no error");
			t.equal(data, 1, "userRemove removed 1 user");
			t.end();
		});
	});
});
test("create User", function(t){
	fl.userCreate({"adminName": "nico@framelink.co", "adminPassWord": "coLas", "userName": "toto", "userPassWord": "titi", 
				   "userType": 'user'}, function (err, data1){
		//console.log(JSON.stringify(err));
		t.equal(err, null, "userCreate should return no error");
		//console.dir(data1);
		fl.userCreate({"adminName": "nico@framelink.co", "adminPassWord": "coLas", "userName": "toto", "userPassWord": "titi", 
					"userType": 'user'}, function (err, data2){
			t.equal(err, null, "userCreate should return no error");
			fl.userRemove({"adminName": "nico@framelink.co", "adminPassWord": "coLas", "userName": data2.d.userName}, function (err, data){
				t.equal(err, null, "userRemove should return no error");
				t.equal(data, 1, "userRemove removed 1 user");
				fl.userRemove({"adminName": "nico@framelink.co", "adminPassWord": "coLas", "userName": data1.d.userName}, function (err, data){
					t.equal(err, null, "userRemove should return no error");
					t.equal(data, 1, "userRemove removed 1 user");
					//console.dir(data2);
					t.end();
				});
			});
		});
	});
});
test("create User", function(t){
	fl.userCreate({"adminName": "nico@framelink.co", "adminPassWord": "coLas", "userName": "titi@gmail.com", "userPassWord": "titi", "userType": 'user'}, function (err, data1){
		//console.log(JSON.stringify(err));
		t.equal(err, null, "userCreate with an existing email should return an error");
		fl.userCreate({"adminName": "nico@framelink.co", "adminPassWord": "coLas", "userName": "titi@gmail.com", "userPassWord": "titi", "userType": 'user'}, function (err, data1){
			//console.log(JSON.stringify(err));
			t.equal(err, "Name already exists", "userCreate with an existing email should return an error");
			fl.userRemove({"adminName": "nico@framelink.co", "adminPassWord": "coLas", "userName": "titi@gmail.com"}, function (err, data){
				//console.log(JSON.stringify(err));
				t.equal(err, null, "userRemove should return no error");
				t.equal(data, 1, "userRemove removed 1 user");
				//console.dir(data1);
				t.end();
			});
		});
	});
});
/*
*/
test("remove a non existing user", function(t){
	fl.userRemove({"adminName": "nico@framelink.co", "adminPassWord": "coLas", "userName": "toto@gmail.com"}, function (err, data){
		//console.log(JSON.stringify(err));
		t.equal(err, 'User not found', "userRemove a non existing user should return an error");
		t.end();
	});
});
/*
*/