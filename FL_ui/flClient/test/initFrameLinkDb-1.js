/*
	flData Client API tests

	version 1.0, N.Cuvillier

	this will be always the more up to date documentation..

*/

var db=connect('localhost:27017/frameLink');
print('deleting frameLink');
db.dropDatabase();
var db=connect('localhost:27017/frameLink');
print('database frameLink re-created');

db.Master_07.insert({
  "d" : { 
    "clientName" : "frameLink", 
    "clientPrefix" : "frameLink", 
    "clientSuffix" : -1, 
    "defaultABEProtocol" : "http:", 
    "defaultABEServer" : "62.210.97.101", 
    "defaultABEPort" : 8123, 
    "defaultStoreServer" : "localhost", 
    "defaultStorePort" : 27017, 
    "contract" : [ ] 
  }, 
  "v" : 1, 
  "r" : [ ] 
});

var idClient =db.Master_07.find({})[0]["_id"]+''

db.Master_07.ensureIndex({"d.clientName":1},{unique:true});

db.Master_07.insert({
  "d" : { 
    "clientName" : "Joao", 
    "clientPrefix" : "Joao", 
    "clientSuffix" : 0,
    "defaultABEProtocol" : "http:", 
    "defaultABEServer" : "62.210.97.101", 
    "defaultABEPort" : 8123, 
    "defaultStoreServer" : "localhost", 
    "defaultStorePort" : 27017, 
    "contract" : [ ] 
  }, 
  "v" : 1, 
  "r" : [ ] 
});
var idClientJoao =db.Master_07.find({})[1]["_id"]+''

print(idClient);
print(idClientJoao);

print("Master_07 initialized");

db.Master_06.insert({
  "d" : {
    "userName" : "nico@framelink.co",
    "userPrefix" : "nico@framelink.co",
    "userSuffix" : 0,
    "userPassWord" : "$2a$10$Hstsh86bOt8uOtUBttFZxuQBRZ2WfKnkRc70fyl2a/q7gYvXukgj.",
    "userType" : "admin",
    "clientId" : idClient
  },
  "v" : 1,
  "r" : [ ]
});
print("user nico@framelink.co loaded");

db.Master_06.insert({
  "d" : {
    "userName" : "joao@framelink.co",
    "userPrefix" : "joao@framelink.co",
    "userSuffix" : 0,
    "userPassWord" : "$2a$10$1byX6bkflNptxZytzQJ4uetKwT7wPlz4.7.72RR9RkUvNCm75zJsO",
    "userType" : "admin",
    "clientId" : idClientJoao
  },
  "v" : 1,
  "r" : [ ]
});
print("user joao@framelink.co loaded");

db.Master_06.insert({
  _id: 10,
  "d" : {
    "userName" : "guest",
    "userPrefix" : "guest",
    "userSuffix" : 99,
    "userPassWord" : "$2a$10$gbEuBwHMHvN.zBitO986Ze4KF.CvhEVjB4aj5rMC2u99JVSLNNczi",
    "userType" : "user",
    "clientId" : idClient
  },
  "v" : 1,
  "r" : [ ]
});

db.Master_06.ensureIndex({"d.userName":1},{unique:true});
print("user guest loaded");

db.Master_08.ensureIndex({"d.domainName":1},{unique:true});
db.Master_08.ensureIndex({"d.access.userId":1});
print('index ready for Master_08');
