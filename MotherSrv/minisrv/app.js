var mongo = require('mongodb');
var express = require('express');
var monk = require('monk');
var db =  monk('localhost:27017/FLApps');
var app = new express();

app.use(express.static(__dirname + '/public'));
app.get('/',function(req,res){
  db.driver.admin.listDatabases(function(e,dbs){
      res.json(dbs);
  });
});
app.get('/entityGetAll',function(req,res){
  db.driver.collectionNames(function(e,names){
    res.json(names);
  })
});
app.get('/test',function(req,res){
    fl = new Dico();
    var result = fl.getName("00");
    res.json(result);
});
app.get('/entityGet/:entityCN',function(req,res){
    var collecName = 'Master_' + req.params.entityCN;
    console.dir('db.' + collecName + '.find() in execution');
    
  var collection = db.get(collecName);
  collection.find({},{},function(e,docs){
    var j=[];
    
    for(var it in docs){
        j.push(docs[it].j);
    }

    res.json(j);
    console.dir('db.' + req.params.name + '.find() Done ***');

  })
});
app.listen(3000)