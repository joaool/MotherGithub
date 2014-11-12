$(function () {
  module("API");
  console.log(" ================================================= 1 ===================================================");
  test("XXbasic test & FL.common", function () { //one test can have several assertions
    console.log(" ================================================= 1.1 ===================================================");
    var actual = '1';
    var expected = 1;
    ok( actual == expected,"Validated !!!" ); //bolean expression
  });
  FL.API.trace = false;
  var existingUser = "jojo100@fl.co";
  console.log(" ================================================= 2 isUserExist ===================================================");
  asyncTest("FL.API.isUserExist(" + existingUser + ")", function () { //one test can have several assertions
    console.log(" ================================================= 2.1 isUserExist ===================================================");
    expect(1);
    console.log("######################################isUserExist ");
    var promise=FL.API.isUserExist(existingUser);
    promise.done(function(exist){
        equal(true,true,"TEST #1 isUserExist(" + existingUser + ") ->" +exist);//6
        if(!exist){
          // FL.API.userCreate(existingUser,"123","clientAdmin")
        }
        QUnit.start();
    });
    promise.fail(function(err){
        // equal(false,true,"TEST #1 isUserExist(" + existingUser + ") err=" + err);//6
        equal(err,null,"TEST #1 isUserExist(" + existingUser + ")");// it shows the actual result (err)...
        QUnit.start();
    });
  });//asyncTest 
  console.log(" ================================================= 3 prepareTrialApp ===================================================");
  asyncTest("prepareTrialApp()", function () { //one test can have several assertions
    console.log(" ================================================= 3.1 prepareTrialApp ===================================================");
    expect(1);
    var promise= FL.API.prepareTrialApp();
    promise.done(function(){
        console.log("==========================================================================================");
        console.log(JSON.stringify(FL.login.token));
        var clientName = FL.login.token.clientName;
        actual = false;
        if(FL.login.token.clientName)
          actual = true;
        console.log("==========================================================================================");
        equal(actual,true,"FL.login.token has a clientName=" + FL.login.token.clientName + ". This value was defined by FrameLink server.");//5
        QUnit.start();
        // var existingUser = "jojo100@fl.co";
        // var newInexistingUser = FL.login.token.userName +"@framelink.co8";// FL.login.token.userName has  an unique username for sure !
 
        // to generate unique userName
        var seconds = new Date().getTime() / 1000;
        var newInexistingUser = "test"+ seconds + "@framelink.co"; //it is surely unique !
        // var newInexistingUser = FL.login.token.userName +"@framelink.co8";// FL.login.token.userName has  an unique username for sure !
        asyncTest("registerTrialApp as Inexisting user:" + newInexistingUser + " (after prepareTrialApp)", function () { //one test can have several assertions
            expect(1);
            var promiseRegister = FL.API.registerTrialApp(newInexistingUser,"123","my first app");
            promiseRegister.done(function(){
              console.log("$$$$$ ok name does not exist and was registered $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
              equal(newInexistingUser,FL.login.token.userName,"UserName was updated to " + newInexistingUser);//6
              FL.API.disconnect();
              QUnit.start();
            });
            promiseRegister.fail(function(err){
              console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
              console.log("Fail trying to registerTrialApp to user:" + newInexistingUser);
              console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
              equal(err,null,"registerTrialApp failed");//6
              FL.API.disconnect();
              QUnit.start();
            });
        });
    });//done prepareTrialApp
    promise.fail(function(err){
        equal(err,null,"prepareTrialApp() failed");//6
        FL.API.disconnect();
        QUnit.start();
    });//fail prepareTrialApp
  });//asyncTest prepareTrialApp
  
  var seconds = new Date().getTime() / 1000;
  var newInexistingUser = "testCreate"+ seconds + "@framelink.co";
  console.log(" ================================================= 4 createUserAndDefaultApp ===================================================");
  asyncTest("createUserAndDefaultApp for " + newInexistingUser, function () { //one test can have several assertions
    console.log(" ================================================= 4.1 createUserAndDefaultApp  ===================================================");
    expect(1);
    // var newInexistingUser = "jojo100@fl.co";
    // console.log("Is going to create user: "+newInexistingUser);
    var promise= FL.API.createUserAndDefaultApp(newInexistingUser,"123","test App");
    promise.done(function(){
        console.log("Succeded creating user: "+newInexistingUser);
         equal(newInexistingUser,FL.login.token.userName,"createUserAndDefaultApp'" + FL.login.token.appDescription + "', domain="+ FL.login.token.domainName);//6
        QUnit.start();
    });
    promise.fail(function(err){
        equal(err,null,"createUserAndDefaultApp failed");
        QUnit.start();
    });
  });//asyncTest

  asyncTest("removeTable for existing table" , function () { //one test can have several assertions
    expect(1);
    var histoPromise=FL.API.createHistoMails_ifNotExisting();
    histoPromise.done(function(){
      console.log("++++++++++++++++++++++++++++++++++++++++++++++ succeed with histoPromise");
      var removePromise= FL.API.removeTable("_histoMail");
      removePromise.done(function(){
          console.log("++++++++++++++++++++++++++++++++++++++++++++++ Succeded removing table _histoMail");
          equal(true,true,"Succeded removing table _histoMail");//6
          console.log("++++++++++++++ after equal");
          QUnit.start();
      });
      removePromise.fail(function(err){
          equal(err,null," failed while trying to remove table _histoMail");
          QUnit.start();
      });
    });
    histoPromise.fail(function(err){
      alert("fail in createHistoMails_ifNotExisting ->inside removeTable for existing table err="+err);
    });
  });//asyncTes

  asyncTest("removeTable for unexisting table" , function () { //one test can have several assertions
    expect(1);
    var promise= FL.API.removeTable("blabla");
    promise.done(function(){
        console.log("Succeded removing table");
        equal(true,true,"Succeded removing unexisting table !!!! (nico!) ");//6
        QUnit.start();
    });
    promise.fail(function(err){
        equal(err,null," failed");
        QUnit.start();
    });
  });//asyncTest    
  // console.log(" ================================================= 5 FL.API.isUserExist =================================================");
  // asyncTest("FL.API.customTable('shipment')", function () { //one test can have several assertions
  //   console.log(" ================================================= 5.1 FL.API.customTable({singular:'shipment'}); =================================================");
  //   expect(5);
  //   promise=FL.API.customTable({singular:"shipment"});
  //   console.log("********************************************name**************>"+FL.API.data.shipment.name);
  //   console.log("********************************************descrption**************>"+FL.API.data.shipment.description);
  //   console.log("********************************************eCN**************>"+FL.API.data.shipment.eCN);
  //   console.log("**********************************************************>"+FL.API.data.shipment.get("singular"));
  //   console.log("**********************************************************>"+FL.API.data.shipment.get("csingular"));
  //   console.log("**********************************************************>"+FL.API.data.shipment.get("plural"));
  //   console.log("**********************************************************>"+FL.API.data.shipment.get("description"));
  //   console.log("**********************************************************>"+FL.API.data.shipment.get("sync"));
  //   promise.done(function(exist){
  //       var actual = FL.API.data.shipment.name;
  //       equal(actual,"shipment","FL.API.data.shipment.name ->shipment");//1
  //       actual = FL.API.data.shipment.get("singular");
  //       equal(actual,"shipment","FL.API.data.shipment.get('singular')->shipment");//2
  //       actual = FL.API.data.shipment.get("plural");
  //       equal(actual,"shipments","FL.API.data.shipment.get('plural')->shipments");//3
  //       actual = FL.API.data.shipment.eCN;
  //       equal(actual,"01","FL.API.data.shipment.eCN ->01");//4
  //       actual = FL.API.data.shipment.get("sync");
  //       actual = FL.API.data.shipment.remove();

  //       var shipment = FL.API.data.shipment.eCN;
  //       actual = FL.API.data[shipment].remove();

  //       equal(actual,false,"FL.API.data.shipment.get('sync') ->false");//5

  //       // equal(actual,"shipment","FL.API.data.shipment.name ->shipment");//6
  //       QUnit.start();
  //   });
  //   promise.fail(function(err){
  //       // equal(false,true,"TEST #1 isUserExist(" + existingUser + ") err=" + err);//6
  //       equal(true,null,"FL.API.data.shipment.name ->call failure !!!");// it shows the actual result (err)...
  //       equal(true,null,"FL.API.data.shipment.eCN ->call failure !!!");// it shows the actual result (err)...
  //       equal(true,null,"FL.API.data.shipment.eCN ->call failure !!!");// it shows the actual result (err)...
  //       QUnit.start();
  //   });
  // });//asyncTest 

  console.log(" ================================================= 6 createHistoMails_ifNotExisting =================================================");
  asyncTest("FL.API.createHistoMails_ifNotExisting()", function () { //one test can have several assertions
    console.log(" ================================================= 6.1 createHistoMails_ifNotExisting =================================================");
    expect(1);
    // FL.API.trace = true;
    var promise=FL.API.createHistoMails_ifNotExisting();
    // var promise=FL.API.isUserExist(existingUser);
     promise.done(function(){//both cases of recently created or existing como here...
        console.log("----------------------------------------------------->createHistoMails_ifNotExisting OK");
        var eCN = FL.dd.getCEntity("_histoMail");
        equal(true,true,"_histoMail exist !!! ecn=" + eCN );//6
        QUnit.start();
    });
    promise.fail(function(err){
        // equal(false,true,"TEST #1 isUserExist(" + existingUser + ") err=" + err);//6
        console.log("----------------------------------------------------->createHistoMails_ifNotExisting err="+err);
        equal(err,null," error in FL.API.createHistoMails_ifNotExisting()");// it shows the actual result (err)...
        QUnit.start();
    });
  });//asyncTest 

  asyncTest("saveTable sales_rep with content [{'name':'Joao','phone':'123'},{'name':'Anton','phone':'456'}]" , function () {
    expect(1);
    
    FL.dd.createEntity("sales_rep","employee responsable for sales");
    FL.dd.addAttribute("sales_rep","name","sales_rep's name","Rep Name","string","textbox",null);
    FL.dd.addAttribute("sales_rep","phone","sales_rep's phone","Rep Phone","string","textbox",null);
    var records=[{"name":"Joao","phone":"123"},{"name":"Anton","phone":"456"}];
    var promise = FL.API.saveTable("sales_rep",records);

    promise.done(function(){
        console.log("Succeded saving table");
        equal(true,true,"Succeded saving table sales_rep with 2 records !!!! ");//6
        QUnit.start();
    });
    promise.fail(function(err){
        equal(err,null," failed");
        QUnit.start();
    });
  });//asyncTest

});