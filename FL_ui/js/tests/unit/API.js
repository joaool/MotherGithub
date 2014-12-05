$(function () {
  module("API");
  console.log(" ================================================= 1 ===================================================");
  test("XXbasic test & FL.common", function () { //one test can have several assertions
    console.log(" ================================================= 1.1 ===================================================");
    var actual = '1';
    var expected = 1;
    ok( actual == expected,"Validated !!!" ); //bolean expression
  });
  (function() {//hijack any JavaScript funct <----------- OK !!!
    //http://stackoverflow.com/questions/9216441/intercept-calls-to-console-log-in-chrome
      var Oldlog = console.log;
      // console.log = function(){};//activate this instead of next - to "remove" all console.logs
      console.log = function() {
        var nRepeat =  90 - arguments[0].length;
          var args = [].slice.apply(arguments).concat([FL.common.repeat("-",nRepeat),(new Error()).stack.split(/\n/)[2].trim()]);
          if(FL.API.debug){
            FL.API.fl.setTraceClient(2);
            Oldlog.apply(this, args);
          }else{
            FL.API.fl.setTraceClient(0);
          }
      };
  })();
  // FL.API.trace = false;
  // FL.API.setConsoleTrace(false);
  FL.API.debug = true; //a simple variable that  disables  the  display in the hijack function

  var existingUser = "jojo100@fl.co";
  console.log(" ================================================= 2 isUserExist ===================================================");
  asyncTest("FL.API.isUserExist(" + existingUser + ")", function () { //one test can have several assertions
    console.log(" ================================================= 2.1 isUserExist ===================================================");
    expect(1);
    FL.API.debug = true;
    var promise=FL.API.isUserExist(existingUser);
    // promise.then(function(){return def.resolve();},function(err){return def.reject(err);});
   
    promise.done(function(exist){
        equal(true,true,"TEST #1 isUserExist(" + existingUser + ") ->" +exist);//6
        console.log("test was done with success !");
        if(!exist){
          // FL.API.userCreate(existingUser,"123","clientAdmin")
        }
        FL.API.debug = false;
        QUnit.start();
    });
    promise.fail(function(err){
        // equal(false,true,"TEST #1 isUserExist(" + existingUser + ") err=" + err);//6
        equal(err,null,"TEST #1 isUserExist(" + existingUser + ")");// it shows the actual result (err)...
        FL.API.debug = false;
        QUnit.start();
    });
  });//asyncTest 

  // console.log(" ================================================= 3 prepareTrialApp ===================================================");
  // asyncTest("prepareTrialApp()", function () { //one test can have several assertions
  //   console.log(" ================================================= 3.1 prepareTrialApp ===================================================");
  //   expect(1);
  //   FL.API.debug = false;
  //   var promise= FL.API.prepareTrialApp();
  //   promise.done(function(){
  //       // console.log("==========================================================================================");
  //       // console.log(JSON.stringify(FL.login.token));
  //       var clientName = FL.login.token.clientName;
  //       actual = false;
  //       if(FL.login.token.clientName)
  //         actual = true;
  //       // console.log("==========================================================================================");
  //       equal(actual,true,"FL.login.token has a clientName=" + FL.login.token.clientName + ". This value was defined by FrameLink server.");//5
  //       QUnit.start();
  //       // var existingUser = "jojo100@fl.co";
  //       // var newInexistingUser = FL.login.token.userName +"@framelink.co8";// FL.login.token.userName has  an unique username for sure !
 
  //       // to generate unique userName
  //       var seconds = new Date().getTime() / 1000;
  //       var newInexistingUser = "test"+ seconds + "@framelink.co"; //it is surely unique !
  //       // var newInexistingUser = FL.login.token.userName +"@framelink.co8";// FL.login.token.userName has  an unique username for sure !
  //       asyncTest("registerTrialApp as Inexisting user:" + newInexistingUser + " (after prepareTrialApp)", function () { //one test can have several assertions
  //           expect(1);
  //           var promiseRegister = FL.API.registerTrialApp(newInexistingUser,"123","my first app");
  //           promiseRegister.done(function(){
  //             // console.log("$$$$$ ok name does not exist and was registered $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
  //             equal(newInexistingUser,FL.login.token.userName,"UserName was updated to " + newInexistingUser);//6
  //             FL.API.disconnect();
  //             FL.API.debug = false;
  //             QUnit.start();
  //           });
  //           promiseRegister.fail(function(err){
  //             console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
  //             console.log("Fail trying to registerTrialApp to user:" + newInexistingUser);
  //             console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
  //             equal(err,null,"registerTrialApp failed");//6
  //             FL.API.disconnect();
  //             FL.API.debug = false;
  //             QUnit.start();
  //           });
  //       });
  //   });//done prepareTrialApp
  //   promise.fail(function(err){
  //       equal(err,null,"prepareTrialApp() failed");//6
  //       FL.API.disconnect();
  //       FL.API.debug = false;
  //       QUnit.start();
  //   });//fail prepareTrialApp
  // });//asyncTest prepareTrialApp
  

// Tests in mode connect

// _log.off();
Test_createUserAndDefaultApp_connect()
  .then(Test_createHistoMails_ifNotExisting)
  .then(Test_removeTable_existing)
  .then(Test_removeTable_unexisting)
  .then(Test_saveTable)
  .then(Test_addRecord)
  .then(Test_loadTable)
  .then(emptyTest)
  .fail(function(err){console.log("BIG ERROR:"+err);})
  .always(function(){
    FL.API.debug = true; console.log("************ tests are done !!! *************");
    FL.API.debug = false;
    // FL.API.disconnect();//to see results with rock mongo....
    FL.API.removeClientWithOneApp().then(function(){FL.API.debug = true; console.log("Application was deleted !");});//the then is necessary to complete the promise 
});

function Test_createUserAndDefaultApp_connect(){
  var def = $.Deferred();
  var seconds = new Date().getTime() / 1000;
  var newInexistingUser = "testCreate"+ seconds + "@framelink.co";
  console.log(" ================================================= 4 createUserAndDefaultApp ===================================================");
  asyncTest("createUserAndDefaultApp for " + newInexistingUser + "--------->connect", function () { //one test can have several assertions
    FL.API.debug = false;
    console.log(" ================================================= 4.1 createUserAndDefaultApp  ===================================================");
    expect(1);
    var promise= FL.API.createUserAndDefaultApp(newInexistingUser,"123","test App");
    promise.done(function(){
        // console.log("Succeded creating user: "+newInexistingUser);
        equal(newInexistingUser,FL.login.token.userName,"createUserAndDefaultApp'" + FL.login.token.appDescription + "', domain="+ FL.login.token.domainName);//6
        FL.API.debug = false;
        QUnit.start();
        return def.resolve();
    });
    promise.fail(function(err){
        equal(err,null,"createUserAndDefaultApp failed");
        FL.API.debug = false;
        QUnit.start();
        return def.reject(err);
    });
  });//asyncTest  

  return def.promise();
}
function Test_createHistoMails_ifNotExisting(){
    var def = $.Deferred();
    asyncTest("--------->FL.API.createHistoMails_ifNotExisting()", function () { //one test can have several assertions
      FL.API.debug = false;
      // console.log(" =================================================  createHistoMails_ifNotExisting =================================================");
      expect(1);
      var promise=FL.API.createHistoMails_ifNotExisting();
      promise.done(function(){//both cases of recently created or existing como here...
          console.log("%%%----------------------------------------------------->createHistoMails_ifNotExisting OK");
          var eCN = FL.dd.getCEntity("_histoMail");
          equal(true,true,"_histoMail exist !!! ecn=" + eCN );//6
          FL.API.debug = false;
          QUnit.start();
          return def.resolve();
      });
      promise.fail(function(err){
          console.log("%%%----------------------------------------------------->createHistoMails_ifNotExisting err="+err);
          equal(err,null," error in FL.API.createHistoMails_ifNotExisting()");// it shows the actual result (err)...
          FL.API.debug = false;
          QUnit.start();
          return def.reject(err);
      });
    });//asyncTest     
    return def.promise();
}
function Test_removeTable_existing(){
    var def = $.Deferred();
    // _log.on(); 
    // FL.API.debug = true;
    asyncTest("--------->removeTable for existing table -->_histoMail" , function () { //one test can have several assertions
          // console.log(" ================================================= 5.1 removeTable for existing table ===================================================");
          expect(1);
          var histoPromise=FL.API.createHistoMails_ifNotExisting();
          histoPromise.done(function(){
            FL.API.debug = false;
            console.log(" ================================================= 5.1 removeTable for existing table ===================================================");
            var removePromise= FL.API.removeTable("_histoMail");
            removePromise.done(function(){
                equal(true,true,"Succeded removing table _histoMail");//6
                FL.API.debug = false;
                QUnit.start();
                return def.resolve();
            });
            removePromise.fail(function(err){
                equal(err,null," failed while trying to remove table _histoMail");
                QUnit.start();
                return def.reject(err);
            });
          });
          histoPromise.fail(function(err){
            // alert("fail in createHistoMails_ifNotExisting ->inside removeTable for existing table err="+err);
            QUnit.start();
            return def.reject(err);
          });
    });//asyncTes

  return def.promise();
}
function Test_removeTable_unexisting(){
  var def = $.Deferred();
  asyncTest("--------->removeTable for unexisting table" , function () { //one test can have several assertions
    FL.API.debug = false;
    console.log(" ================================================= 6.1 removeTable for unexisting table ===================================================");
    expect(1);
    var promise= FL.API.removeTable("blabla");
    promise.done(function(){
        // console.log("Succeded removing table");
        equal(true,true,"Succeded removing unexisting table !!!! (nico!) ");//6
        FL.API.debug = false;
        QUnit.start();
        return def.resolve();
    });
    promise.fail(function(err){
        equal(err,null," failed");
        FL.API.debug = false;
        QUnit.start();
        return def.reject(err);
    });
  });//asyncTest     
  return def.promise();
}

function Test_saveTable(){
  var def = $.Deferred();
  console.log(" ================================================= 8 saveTable sales_rep with content  =================================================");
  FL.dd.createEntity("sales_rep","employee responsable for sales");
  FL.dd.addAttribute("sales_rep","name","sales_rep's name","Rep Name","string","textbox",null);
  FL.dd.addAttribute("sales_rep","phone","sales_rep's phone","Rep Phone","string","textbox",null);
  var records=[{"name":"Jojox","phone":"123"},{"name":"Anton","phone":"456"}];
  asyncTest("--------->saveTable sales_rep with content [{'name':'Jojo','phone':'123'},{'name':'Anton','phone':'456'}]" , function () {
    FL.API.debug = false;
    console.log(" ================================================= 8.1 saveTable sales_rep with content  =================================================");
    expect(1);
    var promise = FL.API.saveTable("sales_rep",records);
    // var promise=FL.API.isUserExist("customer1@xyz");
    promise.done(function(data){
        console.log("Succeded saving table. returned:"+JSON.stringify(data));
        //data has the format:
        // [{"d":{"55":"Jojox","56":"123"},"v":0,"_id":"546963669b04c9107942d32d"},{"d":{"55":"Anton","56":"456"},"v":0,"_id":"546963669b04c9107942d32e"}]
        equal(true,true,"Succeded saving table sales_rep with 2 records !!!! ");//6
        // FL.dd.displayEntities();
        FL.API.debug = false;
        QUnit.start();
        return def.resolve();
    });
    promise.fail(function(err){
        equal(err,null," failed");
        FL.API.debug = false;
        QUnit.start();
        return def.reject(err);
    });
  });//asyncTest
  return def.promise();
}
  
function Test_addRecord(){
  var def = $.Deferred();
  console.log(" ================================================= 9 addRecordsToTable to sales_rep   =================================================");
  FL.dd.createEntity("sales_rep","employee responsable for sales");
  FL.dd.addAttribute("sales_rep","name","sales_rep's name","Rep Name","string","textbox",null);
  FL.dd.addAttribute("sales_rep","phone","sales_rep's phone","Rep Phone","string","textbox",null);
  var records=[{"name":"Jojo","phone":"123"},{"name":"Anton","phone":"456"}];
  asyncTest("--------->addRecordsToTable to sales_rep with content [{'name':'George','phone':'789'},{'name':'Ringo','phone':'012'}]" , function () {
    console.log(" ================================================= 9 addRecord to sales_rep  =================================================");
    expect(1);
    var saveTablePromise = FL.API.saveTable("sales_rep",records);
    // var promise=FL.API.isUserExist("customer1@xyz");
    saveTablePromise.done(function(data){
        FL.API.debug = false;
        var recordsToInsert = [{'name':'George','phone':'789'},{'name':'Ringo','phone':'012'}];
        var promise = FL.API.addRecordsToTable("sales_rep",recordsToInsert);
        promise.done(function(data){
            console.log("Succeded adding 2 records. returned:"+JSON.stringify(data));
            equal(true,true,"Succeded adding 2 records to table sales_rep !!!! ");
            FL.API.debug = false;
            QUnit.start();
            return def.resolve();
        });
        promise.fail(function(err){
            equal(err,null," failed");
            FL.API.debug = false;
            QUnit.start();
            return def.reject(err);
        });
    });
    saveTablePromise.fail(function(err){
        equal(err,null," failed");
        FL.API.debug = false;
        QUnit.start();
        return def.reject(err);
    });
  });//asyncTest

  return def.promise();
}
function Test_loadTable(){
  var def = $.Deferred();
  asyncTest("--------->loadTable sales_rep" , function () { //one test can have several assertions
    FL.API.debug = false;
    console.log(" ================================================= loadTable sales_rep ===================================================");
    expect(1);
    var promise= FL.API.loadTable("sales_rep");
    promise.done(function(data){
        console.log("Succeded loading table sales_rep. returned:"+JSON.stringify(data));
        equal(true,true,"Succeded loading sales_rep !!!!");//6
        FL.API.debug = false;
        QUnit.start();
        return def.resolve();
    });
    promise.fail(function(err){
        equal(err,null," failed");
        FL.API.debug = false;
        QUnit.start();
        return def.reject(err);
    });
  });//asyncTest       
  return def.promise();
}

function emptyTest(){
  var def = $.Deferred();
  return def.resolve();
  return def.promise();
}



   
  // // console.log(" ================================================= 5 FL.API.isUserExist =================================================");
  // // asyncTest("FL.API.customTable('shipment')", function () { //one test can have several assertions
  // //   console.log(" ================================================= 5.1 FL.API.customTable({singular:'shipment'}); =================================================");
  // //   expect(5);
  // //   promise=FL.API.customTable({singular:"shipment"});
  // //   console.log("********************************************name**************>"+FL.API.data.shipment.name);
  // //   console.log("********************************************descrption**************>"+FL.API.data.shipment.description);
  // //   console.log("********************************************eCN**************>"+FL.API.data.shipment.eCN);
  // //   console.log("**********************************************************>"+FL.API.data.shipment.get("singular"));
  // //   console.log("**********************************************************>"+FL.API.data.shipment.get("csingular"));
  // //   console.log("**********************************************************>"+FL.API.data.shipment.get("plural"));
  // //   console.log("**********************************************************>"+FL.API.data.shipment.get("description"));
  // //   console.log("**********************************************************>"+FL.API.data.shipment.get("sync"));
  // //   promise.done(function(exist){
  // //       var actual = FL.API.data.shipment.name;
  // //       equal(actual,"shipment","FL.API.data.shipment.name ->shipment");//1
  // //       actual = FL.API.data.shipment.get("singular");
  // //       equal(actual,"shipment","FL.API.data.shipment.get('singular')->shipment");//2
  // //       actual = FL.API.data.shipment.get("plural");
  // //       equal(actual,"shipments","FL.API.data.shipment.get('plural')->shipments");//3
  // //       actual = FL.API.data.shipment.eCN;
  // //       equal(actual,"01","FL.API.data.shipment.eCN ->01");//4
  // //       actual = FL.API.data.shipment.get("sync");
  // //       actual = FL.API.data.shipment.remove();

  // //       var shipment = FL.API.data.shipment.eCN;
  // //       actual = FL.API.data[shipment].remove();

  // //       equal(actual,false,"FL.API.data.shipment.get('sync') ->false");//5

  // //       // equal(actual,"shipment","FL.API.data.shipment.name ->shipment");//6
  // //       QUnit.start();
  // //   });
  // //   promise.fail(function(err){
  // //       // equal(false,true,"TEST #1 isUserExist(" + existingUser + ") err=" + err);//6
  // //       equal(true,null,"FL.API.data.shipment.name ->call failure !!!");// it shows the actual result (err)...
  // //       equal(true,null,"FL.API.data.shipment.eCN ->call failure !!!");// it shows the actual result (err)...
  // //       equal(true,null,"FL.API.data.shipment.eCN ->call failure !!!");// it shows the actual result (err)...
  // //       QUnit.start();
  // //   });
  // // });//asyncTest 





  // existingUser = "jojo100@fl.co";
  // // console.log(" ================================================= 2 isUserExist ===================================================");
  // asyncTest("saveTable sales_rep with content [{'name':'Jojo','phone':'123'},{'name':'Anton','phone':'456'}]", function () { //one test can have several assertions
  //   console.log(" ================================================= 8.1 saveTable sales_rep with content  =================================================");
  //   expect(1);
  //   FL.API.setConsoleTrace(true);
  //   // var promise=FL.API.isUserExist(existingUser);
  //   var promise = FL.API.saveTable("sales_rep",records);

  //   promise.done(function(exist){
  //       equal(true,true,"Succeded saving table sales_rep with 2 records !!!! ");//6
  //       FL.API.setConsoleTrace(false);
  //       QUnit.start();
  //   });
  //   promise.fail(function(err){
  //       // equal(false,true,"TEST #1 isUserExist(" + existingUser + ") err=" + err);//6
  //       equal(err,null,"saveTable faillure");// it shows the actual result (err)...
  //       FL.API.setConsoleTrace(false);
  //       QUnit.start();
  //   });
  // });//asyncTest 

});