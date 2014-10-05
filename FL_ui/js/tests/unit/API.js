$(function () {
  module("API");

  asyncTest("Create, Access, Remove user/database", function () { //one test can have several assertions
    expect(5);
    // QUnit.stop();
    var actual = '1';
    var expected = 1;
    ok( actual == expected,"Validated !!!" ); //bolean expression //1
    equal(actual,expected,"...are equal");//non strict assertion//2
    strictEqual(1,1,"they are strictly equal");//non strict assertion//3
    // deepEqual(item1,item2,"all the elements in the array are equal"); /recursively vompares array elements and objects 
    console.log(JSON.stringify(FL.login.token));
    equal(JSON.stringify(FL.login.token),"{}","FL.login.token == {} at the beginning");//non strict assertion//4
    
    // test connectAdHocUser --------------------------------------------------------------------
    // PRE-CONDITIONS
    // "jojo100@fl.co" - is an existing user
    // "jojo101@fl.co" - is a non-existing user
    //
    // 1) Generates an adHocUser [TEST #5], 2)Tries to register the adHoc user as existing user "jojo100@fl.co"
    //
    //     if "jojo100@fl.co" does not exist:=> TEST #6 Register done! Old clientName=" + clientName + " changed to " + FL.login.token.clientName
    //     if "jojo100@fl.co" exists: =>connects that user to the default application, then remove it, then   
    var promise= FL.API.connectAdHocUser();
    promise.done(function(){
        console.log("==========================================================================================");
        console.log(JSON.stringify(FL.login.token));
        var clientName = FL.login.token.clientName;
        actual = false;
        if(FL.login.token.clientName)
          actual = true;
        console.log("==========================================================================================");
          equal(actual,true,"TEST #5 SUCCESS FL.login.token has a clientName=" + FL.login.token.clientName + ". This value was defined by FrameLink server.");//5
        QUnit.start();
        var existingUser = "jojo100@fl.co";
        //test attempt to register an user that is already registered
        asyncTest("registerAdHocUser existing user " + existingUser + " (after connectAdHocUser)", function () { //one test can have several assertions
          expect(1);
          var promiseRegister = FL.API.registerAdHocUser(existingUser,"123","my first app");
          promiseRegister.done(function(){
              equal(false,true,"TEST #5A Register done! Old clientName=" + clientName + " changed to " + FL.login.token.clientName);//6
              QUnit.start();
          });
          promiseRegister.fail(function(err){
              if(err.substring(0,13)=="existing user"){//error because user already exist !!!
                equal(true,true,"TEST #5A Register cannot be done because " + existingUser + " is an existing user ");//6
                QUnit.start();
              }else{
                equal(false,true,"TEST #5A Attempt to Register failled by error="+err);//6
                QUnit.start();
              }
          });
        });//asyncTest          
        asyncTest("connectUserToDefaultApp for existing user " + existingUser, function () { //one test can have several assertions
          expect(1);
          var existingUser = "jojo100@fl.co";
          var promise2= FL.API.connectUserToDefaultApp(existingUser,"123");
          promise2.done(function(){
              equal(true,true,"TEST #6 Connected to application '" + FL.login.token.appDescription + "', domain="+ FL.login.token.domainName);//6
              QUnit.start();
          });
          promise2.fail(function(err){
              equal(false,true,"TEST #5 FAILURE in connectAdHocUser err="+err);//5
              QUnit.start();
          });
        });//asyncTest
        var newUser = "jojo101@fl.co";
        asyncTest("connectAdHocUser and registered it as new user " + newUser, function () { //one test can have several assertions
          expect(1);
          var existingUser = "jojo100@fl.co";
          var promise = FL.API.connectAdHocUser().then(function(){FL.API.registerAdHocUser(newUser,"123","new user's app");});//OK
          promise.done(function(){
              equal(true,true,"adHoc user become registered as '" + FL.login.token.userName  + "' with app='" + FL.login.token.appDescription + "', and domain="+ FL.login.token.domainName);
              QUnit.start();
              asyncTest("removeCurrentUser " + FL.login.token.userName, function () { //one test can have several assertions
                expect(1);
                var promise = FL.API.removeCurrentUser();
                promise.done(function(){
                  equal(true,true,"current user ex-adhoc user '" + FL.login.token.userName  + "' successfully removed");
                  QUnit.start();
                });
                promise.fail(function(){
                  equal(true,true,"Failure trying to remove ex-adhoc user '" + FL.login.token.userName  + "' !!!");
                   QUnit.start();
                });
              });
          });
          promise.fail(function(err){
              equal(false,true,"FAILURE trying to register adHoc user err="+err);//
              QUnit.start();
          });
        });//asyncTest        
    });
    promise.fail(function(err){
        equal(false,true,"TEST #5 FAILURE in connectAdHocUser err="+err);//5
        QUnit.start();
    });
    // END OF test connectAdHocUser --------------------------------------------------------------------




    // // test isUserExist ---- CHECK WITH NICO ------------------------------------------------------------
    // var promise2= FL.API.isUserExist("jojo100@fl.co");
    // promise2.done(function(exists){
    //     if(exists){
    //         console.log("jojo100@fl.co exists !");
    //         equal(true,true,"TEST #6 user 'jojo100@fl.co' exists in FrameLink server we do not need to create it");//5
    //     }else{
    //         console.log("jojo100 does not exist !");
    //         equal(true,true,"TEST #6 user 'jojo100@fl.co' does not exists in FrameLink server");//5
    //     }
    //     QUnit.start();
    // });
    // promise2.fail(function(err){
    //     console.log("fail testing if jojo100@fl.co exist.");
    //     equal(false,true,"TEST #6 FAILURE in isUserExist err="+err);//5
    //     QUnit.start();
    // });
    // // END OF test isUserExist --------------------------------------------------------------------


    // ok( actual == "myDomain1","FL.common.stringAfterLast('http://www.framelink.co/app?d=myDomain1','=') -> 'myDomain'");//4 
 
      // asyncTest("Test connectAdHocUser()", function () { //one test can have several assertions
      //   console.log("=====================> before calling FL.API.connectAdHocUser()");
      //   QUnit.start();
      //   console.log("==========================================================================================");
      //   console.log(JSON.stringify(FL.login.token));
      //   actual = false;
      //   if(FL.login.token.clientName)
      //     actual = true;
      //   console.log("==========================================================================================");
      //   equal(actual,true,"6-FL.login.token has a value defined by FrameLInk server");//5
      // });

    // console.log("==> after calling setTimeout()");

    // QUnit.stop();
    // console.log("==> before calling asyncTest()");

    // asyncTest("testing FL.API.connectAdHocUser",function(assert) {
    //   expect(1);
      // console.log("=====================> before calling FL.API.connectAdHocUser()");
      // FL.API.connectAdHocUser().then(function(){
      //     console.log("==========================================================================================");
      //     console.log(JSON.stringify(FL.login.token));
      //     actual = false;
      //     if(FL.login.token.clientName)
      //       actual = true;
      //     console.log("==========================================================================================");
      //     equal(actual,true,"6-FL.login.token has a value defined by FrameLInk server");//5
      //     QUnit.start();
      // });
    // });
    // });
   
    // console.log("before FL.common.stringAfterLast() test");
    // actual =  FL.common.stringAfterLast('http://www.framelink.co/app?d=myDomain1','=');
    // ok( actual == "myDomain1","FL.common.stringAfterLast('http://www.framelink.co/app?d=myDomain1','=') -> 'myDomain'");//4 
/*    
    actual =  FL.common.stringAfterLast('test phrase: my name is john','phrase:');
    ok( actual == " my name is john","FL.common.stringAfterLast('test phrase: my name is john','phrase:') -> ' my name is john'");//5

    actual =  FL.common.stringBeforeLast('test->phrase: my name is john','phrase:');
    ok( actual == "test->","FL.common.stringBeforeLast('test->phrase: my name is john','phrase:') -> 'test->'");//6
    actual =  FL.common.stringBeforeLast('this is (one) or (two) values','(');
    ok( actual == "this is (one) or ","FL.common.stringBeforeLast('this is (one) or (two) values','(' -> 'this is (one) or '");//7
    actual =  FL.common.getLastTagInString(actual,'(',')');
    ok( actual == "one","FL.common.getLastTagInString extracted 'one' from 'this is (one) or (two) values' after extracting stringBeforeLast");//8


          //ex. FL.common.stringBeforeLast("this is (one) or (two) values","(") -->returns  "this is (one) or "


    actual =  FL.common.getLastTagInString('http://www.framelink.co/app?d=myDomain1#','=','#'); //(str,separator,tagTerminator)
    ok( actual == "myDomain1","FL.common.getLastTagInString('http://www.framelink.co/app?d=myDomain1','=','#') -> 'myDomain1'");//9
    actual =  FL.common.getLastTagInString('test phrase: my name is john/ the phrase is over','phrase:','/');
    ok( actual == " my name is john","FL.common.getLastTagInString('test phrase: my name is john/ the phrase is over','phrase:','/') -> ' my name is john'");//10
    actual =  FL.common.getLastTagInString('http://abc.com#myDomain1@abc','#','#@/'); //(str,separator,tagTerminator)
    ok( actual == "myDomain1"," FL.common.getLastTagInString('http://abc.com#myDomain1@abc','#','#@/') -> 'myDomain1'");//11
    actual =  FL.common.getLastTagInString('http://abc.com#myDomain1/abc/','#','*z/@'); //(str,separator,setOfTagTerminators)
    ok( actual == "myDomain1"," FL.common.getLastTagInString('http://abc.com#myDomain1/abc/','#','*z/@') -> 'myDomain1'");//12
    actual =  FL.common.getLastTagInString('http://abc.com#myDomain1@abc','@','#@/'); //(str,separator,tagTerminator)
    ok( actual == "abc"," FL.common.getLastTagInString('http://abc.com#myDomain1@abc','@','#@/') -> 'abc'");//13

    actual =  FL.common.getLastTagInString('http://abc.com#myDomain1/abc','#','#@/'); //(str,separator,tagTerminator)
    ok( actual == "myDomain1"," FL.common.getLastTagInString('http://abc.com#myDomain1/abc','#','#@/') -> 'myDomain1'");//14

    actual =  FL.common.getLastTagInString('the brown(fox) jumped the fence','(',')'); //(str,separator,tagTerminator)
    ok( actual == "fox"," FL.common.getLastTagInString('the brown(fox) jumped the fence','(',')') -> 'fox'");//15  
    actual =  FL.common.getLastTagInString('the brown(fox) and the white(rabbit) jumped the fence','(',')'); //(str,separator,tagTerminator)
    ok( actual == "rabbit"," FL.common.getLastTagInString('the brown(fox) and the white(rabbit) jumped the fence','(',')') -> 'rabbit'");//16

    // console.log("<--------------test------------>");
    actual =  FL.common.getLastTagInString('the brown*fox* is there','(',')'); //(str,separator,tagTerminator)
    ok( actual === null," FL.common.getLastTagInString('the brown*fox* is there','(',')') -> null");//17
    // console.log("------------------------------->"+actual);
*/


  });
/*
  test("FL.menu primitives", function () { //one test can have several assertions
     var oMenu = {
      "menu" : [
          {
              "title" : "MenuA/T1",//0
              "uri":"http://www.microsoft.com"
          },
          {
              "title" : "MenuB/T1",//1
              "uri" : "#",
              "menu" : [
                  {
                      "title" : "MenuB/T2-I",//2
                      "uri":"#1"
                  },
                  {
                      "title" : "MenuB/T2-II",//3 Joachim
                      "uri":"#"
                  }
              ]
          },
          {
              "title" : "MenuC/T1",//4
              "uri":"#"
          }
      ]
    };
    var actual = '1';
    var expected = 1;
    ok( actual == expected,"Validated !!!" ); //1
    var car1 = FL.menu.createCar("Fiat","1990");
    ok( car1.model == "Fiat","car is Fiat Validated !!!" );//2
    console.log(car1.phrase());
    ok( car1.phrase() == "Fiat of 1990","phrase function Validated !!!" );//3
    var myMenu1 = FL.menu.createMenu({jsonMenu:oMenu,initialMenu:"_home",editable:false});
    console.log(myMenu1.toString());
    ok( myMenu1.jsonMenu.menu[1].title == "MenuB/T1","Getting menu title 'MenuB/T1' (at root)" );//4
    ok( myMenu1.jsonMenu.menu[1].menu[1].title == "MenuB/T2-II","Getting menu title 'MenuB/T2-II' at second level" );//5
    myMenu1.jsonMenu.menu[1].menu[1].title = "Joachim";
    ok( myMenu1.jsonMenu.menu[1].menu[1].title == "Joachim","Setting menu 'MenuB/T2-II' to 'Joachim'");//6
    myMenu1.test_Add_Id_Top();
    ok( myMenu1.jsonMenu.menu[1].menu[1].id == 3,"testAdd_Id_Top placed id=3 in menu 'Joachim'");//7
    ok( myMenu1.jsonMenu.menu[2].id == 4,"testAdd_Id_Top placed id=4 in last menu");//8
    ok( myMenu1.jsonMenu.menu[1].menu[1].top === false,"testAdd_Id_Top placed top = false in menu 'Joachim'");//9
    ok( myMenu1.jsonMenu.menu[2].top === true,"testAdd_Id_Top placed top = true in last menu");//10
    var oEl = myMenu1.test_menuFindById(4);//previous myMenu1.test_menuFindById(oMenu.menu,4);
    deepEqual(myMenu1.jsonMenu.menu[2],oEl,"menuFindById() got last menu element");//11
    oEl = myMenu1.test_menuFindById(3);
    deepEqual(myMenu1.jsonMenu.menu[1].menu[1],oEl,"menuFindById() got menu element 'Joachim'");//12
    oEl = myMenu1.test_menuFindById(0);
    deepEqual(myMenu1.jsonMenu.menu[0],oEl,"menuFindById(0) got first menu element");//13
    oEl = myMenu1.test_menuFindById(10);
    ok(oEl === null,"menuFindById(10) returned null because Id=10 does not exist");//14
    oMenu = {
      "menu" : [
          {
              "title" : "MenuA/T1",//0
              "uri":"http://www.microsoft.com"
          },
          {
              "title" : "MenuB/T1",//4
              "uri":"#"
          }
      ]
    };
    myMenu1 = FL.menu.createMenu({jsonMenu:oMenu,initialMenu:"_home",editable:false});
    oEl = myMenu1.test_menuFindById(0);
    deepEqual(myMenu1.jsonMenu.menu[0],oEl,"menuFindById(0) got first menu element in the case of 2 flat elements");//15
    oEl = myMenu1.test_menuFindById("1");//same result for 1 or "1"
    deepEqual(myMenu1.jsonMenu.menu[1],oEl,"menuFindById(1) got first menu element in the case of 2 flat elements");//16
  });
  test("FL.menu DOM editable=false", function () {
     var oMenu = {
      "menu" : [
          {
              "title" : "MenuA/T1",//0
              "uri":"http://www.microsoft.com"
          },
          {
              "title" : "MenuB/T1",//1
              "uri" : "#",
              "menu" : [
                  {
                      "title" : "MenuB/T2-I",//2
                      "uri":"_home"
                  },
                  {
                      "title" : "MenuB/T2-II",//3
                      "uri":"#"
                  }
              ]
          },
          {
              "title" : "MenuC/T1",//4
              "uri":"_mission"
          }
      ]
    };
    var actual = '1';
    var expected = 1;
    ok( actual == expected,"Validated !!!" ); //bolean expression
    // ---- example for DOM testing --------------------------------------
    $('<input id="ResultTestBox" type="text"/>').appendTo('#qunit-fixture');//#qunit-fixture is the invisible DOM sandbox
    var add = function (a, b) { var result = a + b; $("input#ResultTestBox").val(result);};
    var result = add(2, 3);
    equal(5, $('input#ResultTestBox').val(), "DOM Dummy test -> testing result box value");
    // -----------------------------------------------------------------------
    // $('<ul id="begin_menu" class="nav navbar-nav"></ul>').appendTo('#qunit-fixture');//necessary for menuRefresh()
    $('<div id="menuContainer"><div id="toolbar"><ul id="main-menu"></ul><div></div>').appendTo('#qunit-fixture');//necessary for menuRefresh() and 
    $('<div id="_placeHolder"></div>').appendTo('#qunit-fixture');//necessary for menuRefresh()
    var myMenu1 = FL.menu.createMenu({jsonMenu:oMenu,initialMenu:"_home",editable:false});
    myMenu1.menuRefresh([//receives a menu array and displays it. If empty assumes settings.jsonMenu.menu
        {
          "title" : "MenuA/T1",//0
          "uri":"http://www.microsoft.com"
        },
        {
          "title" : "MenuB/T1",//1
          "uri" : "#",
          "menu" : [
            {
              "title" : "MenuB/T2-I",//2
              "uri":"_home"
            }
          ]
        },
        {
          "title" : "MenuC/T1",//3
          "uri":"#"
        }
    ]);
    equal("MenuA/T1", $('#0').text(), "menuRefresh() with argument ->title 'MenuA/T1' was placed in DOM id=0");
    equal("MenuB/T2-I", $('#2').text(), "menuRefresh() title with argument ->'MenuA/T1' was placed in DOM id=2");
    myMenu1.menuRefresh();
    equal("MenuB/T2-II", $('#3').text(), "menuRefresh() no args ->title 'MenuB/T2-II' is on DOM id=3");
    equal("MenuC/T1", $('#4').text(), "menuRefresh() no args ->title 'MenuC/T1' is on DOM id=4");
    // -----------------------------------------------------------------------
    //test internal page loading 
    //  - ALL TESTS REFER TO THE oMenu STRUCTURE - (THE FIRST IN THIS CODE...)
    $('<div id="_placeHolder"></div>').appendTo('#qunit-fixture');//necessary to place FrameLink internal pages
    var $itemClicked = $( "#2" );
    $itemClicked.trigger( {type:"click"} );//the same as clicking the mouse on #2 OK !!!
    // the test need some type to wait for the page "_home.html" to load before checking for id="_home" 
    stop();//waits for a start() before continuing
    setTimeout(function(){
      ok($("#_home").length !== 0, "the internal page '_home.html' was loaded");
      start();//stops test runner and waits for start to continue
      var $itemClicked = $( "#4" );
      $itemClicked.trigger( {type:"click"} );//the same as clicking the mouse on #4 OK !!!
      // the test need some type to wait for the page "_mission.html" to load before checking for id="_mission" 
      stop();
      setTimeout(function(){ok($("#_mission").length !== 0, "the internal page '_mission.html' was loaded");start();},100);
    },100);
  });
  test("FL.menu DOM editable=true", function () {
     var oMenu = {
      "menu" : [
          {
              "title" : "MenuA/T1",//0
              "uri":"http://www.microsoft.com"
          },
          {
              "title" : "MenuB/T1",//1
              "uri" : "#",
              "menu" : [
                  {
                      "title" : "MenuB/T2-I",//2
                      "uri":"_home"
                  },
                  {
                      "title" : "MenuB/T2-II",//3
                      "uri":"#"
                  }
              ]
          },
          {
              "title" : "MenuC/T1",//4
              "uri":"_mission"
          }
      ]
    };
    var actual = '1';
    var expected = 1;
    ok( actual == expected,"Validated !!!" ); //bolean expression
    $('<div id="menuContainer"><ul id="main-menu"></ul></div>').appendTo('#qunit-fixture');
    var myMenu1 = FL.menu.createMenu({jsonMenu:oMenu,initialMenu:"_home",editable:true});
    var $itemClicked = $( "#toolbar" );
    console.log("before click myMenu1.is_menuHide="+myMenu1.is_menuHide);
    console.log("before click myMenu1.is_contextOn="+myMenu1.is_contextOn);

    $itemClicked.trigger( {type:"mousedown",which:3} );//the same as pressing the right mouse on toolbar OK !!!
    console.log("after click myMenu1.is_menuHide="+myMenu1.is_menuHide);
    console.log("after click myMenu1.is_contextOn="+myMenu1.is_contextOn);
    equal(true, myMenu1.is_menuHide, "right click in toolbar => myMenu1.is_menuHide=true ");
    equal(false, myMenu1.is_contextOn, "right click in toolbar => myMenu1.is_contextOn=false ");
    $itemClicked.trigger( {type:"mousedown",which:2} );//the same as pressing the right mouse on toolbar OK !!!
   });

  test("util2 tests", function () { 
    //typeOf
    var xVar = "abc";
    var success = utils.typeOf(xVar);
    ok(success == "string" , "FL.util.typeOf('abc') -->'string'" );//1
    xVar = 123;
    success = utils.typeOf(xVar);
    ok(success == "number" , "FL.util.typeOf(123) -->'number'" );//2
    xVar = true;
    success = utils.typeOf(xVar);
    ok(success == "boolean" , "FL.util.typeOf(true) -->'boolean'" );//3
    xVar = {key1:"abc"};
    success = utils.typeOf(xVar);
    ok(success == "object" , "FL.util.typeOf({key1:'abc'}) -->'object'" );//4
    xVar = [1,2,3];
    success = utils.typeOf(xVar);
    ok(success == "array" , "FL.util.typeOf([1,2,3]) -->'array'");//5
    xVar = "abc@link.com";
    success = utils.typeOf(xVar);
    ok(success == "email" , "FL.util.typeOf('abc@link.com') -->'email'");//6
    xVar = new Date();
    success = utils.typeOf(xVar);
    ok(success == "date" , "FL.util.typeOf(new Date()) -->'date'");//6
    var foo;
    success = utils.typeOf(foo);
    ok(success == "undefined" , "FL.util.typeOf(foo) foo is undefined -->'undefined'");//6

  });
  test("client Dictionary tests", function () { //one test can have several assertions
    //client
    var success = FL.dd.createEntity("client","company we may invoice");
    ok(success === true , "createEntity operation successfull for first entity !" );
    actual = FL.dd.entities["client"];
    ok(actual.csingular == "01", "Compressed code for first entity = '01'");
    ok(actual.description == "company we may invoice", "description is correct");
    ok(actual.plural == "clients", "plural is clients");
    success = FL.dd.createEntity("client","another company we may invoice");
    ok(success === false , "createEntity refused because client exists already !" );

    //order
    success = FL.dd.createEntity("order","client's product request");
    ok(success === true , "createEntity operation successfull for 2nd entity !" );
    actual = FL.dd.entities["order"];
    ok(actual.csingular == "02", "Compressed code for 2nd entity = '02'");
    ok(actual.description == "client's product request", "description is correct for 2nd entity");
    ok(actual.plural == "orders", "plural is orders");

    success = FL.dd.updateEntityBySingular("client",{plural:"customers",description:"frequent buyer"});
    ok(success === true , "updateEntityBySingular operation successfull for client" );//10
    actual = FL.dd.entities["client"];
    ok(actual.csingular == "01", "Compressed code for first entity = '01'");
    ok(actual.description == "frequent buyer", "description was updated correctely");
    ok(actual.plural == "customers", "plural has changed to customers");

    success = FL.dd.updateEntityByCName("01",{plural:"clients",description:"very frequent buyer"});
    ok(success === true , "updateEntityByCName operation successfull for client" );
    actual = FL.dd.entities["client"];
    ok(actual.csingular == "01", "Compressed code for first entity = '01'");
    ok(actual.description == "very frequent buyer", "description was updated correctely");
    ok(actual.plural == "clients", "plural has changed back to clients");

    var entityCN = FL.dd.getCEntity("order");
    ok(entityCN == "02", "FL.dd.getCEntity ->Compressed code for 'order' is = '02'");
    entityCN = FL.dd.getCEntity("patolinas");
    ok(entityCN === null, "FL.dd.getCEntity ->Compressed code for patolinas is null - not existing");
    
    FL.dd.addAttribute("order","shipped","expedition status","Shipped","boolean","checkbox",null);
    actual = FL.dd.getEntityBySingular("order");
    ok(actual.attributes.length == 2, "Order has 2 attributes");//20

    actual = FL.dd.countEntitiesBeginningBy("client");
    ok(actual == 1, "countEntitiesBeginningBy('client') is 1");

    success = FL.dd.createEntity("client1","another company we may invoice");
    actual = FL.dd.countEntitiesBeginningBy("client");
    ok(actual == 2, "countEntitiesBeginningBy('client') is 2");
    actual = FL.dd.countEntitiesBeginningBy("patolinas");
    ok(actual === 0, "countEntitiesBeginningBy('patolinas') is 0");
    actual = FL.dd.nextEntityBeginningBy("client");
    ok(actual === "client2", "nextEntityBeginningBy('client') is 'client2'");
    actual = FL.dd.nextEntityBeginningBy("patolinas");
    ok(actual === "patolinas", "nextEntityBeginningBy('patolinas') is 'patolinas'");//25
    
    actual = FL.dd.getEntityBySingular("order").sync;
    ok(actual === false, "order sync status is:'not synchronized'");//26
    FL.dd.setSync("order",true);
    actual = FL.dd.getEntityBySingular("order").sync;
    ok(actual === true, "FL.dd.setSync-->order sync status is now:'synchronized'");//27
    FL.dd.setSync("order",false);
    actual = FL.dd.getEntityBySingular("order").sync;
    ok(actual === false, "FL.dd.setSync-->order sync status is again:'not synchronized'");//28

    actual = FL.dd.getFieldCompressedName("order","id");
    ok(actual === "00", "FL.dd.getFieldCompressedName -->compressed name for id='00'");//29
    actual = FL.dd.getFieldCompressedName("order","shipped");
    ok(actual === "01", "FL.dd.getFieldCompressedName -->compressed name for shipped='01'");//30

    FL.dd.addAttribute("order","product","unique order item","product","string","textbox",null);
    actual = FL.dd.getFieldCompressedName("order","product");
    ok(actual === "02", "FL.dd.getFieldCompressedName -->compressed name is '02'");//31
    actual = FL.dd.isEntityInLocalDictionary("order");
    ok(actual === true, "FL.dd.isEntityInLocalDictionary -->'order' exists in local dictionary.");//32
    actual = FL.dd.isEntityInLocalDictionary("orderz");
    ok(actual === false, "FL.dd.isEntityInLocalDictionary -->'orderz' does not exists in local dictionary.");//33
    
    actual = FL.dd.getEntityByCName("02");
    ok(actual == "order", "FL.dd.getEntityByCName --> returns 'order' for entity compressed name = '02'");//34
    actual = FL.dd.getEntityByCName("0A");
    ok(actual === null, "FL.dd.getEntityByCName --> returns null for entity compressed name = '0A'");//35
    // FL.dd.displayEntities();
    actual = FL.dd.getEntityByCName("01");
    ok(actual === "client", "FL.dd.getEntityByCName --> returns 'client' for entity compressed name = '01'");//36

    //now testing relations functions
    actual = FL.dd.isRelation("client","01");
    ok(actual === false, "FL.dd.isRelation --> relation compressed name '01' does not exist");//37
    FL.dd.addRelation("client","01","order","orders","N");//(xSingular,rCN,withEntityName,verb,cardinality,side,storedHere)
    obj = FL.dd.entities["client"].relations[0];
    deepEqual( obj, {"rCN":"01","withEntity":"order","verb":"orders","cardinality":"N","semantic":"client orders many orders","side":null,"storedHere":null,"withEntityCN":null},"FL.dd.addRelation --> added relation client to order ");//38

    //FL.dd.displayEntities();

    // deepEqual( obj, {d:{ "00":3,"01":false,"02":"Super 3" },r:[]}, "FL.server.getSavingObjFromCsvStoreById correct for id=3" );

    //ok(actual === false, "FL.dd.isRelation --> relation compressed name '01' does not exist");//37


    var rowsArr = [
      // {id:1,shipped:true,product:"Super 1"},
      // {id:2,shipped:false,product:"Super 2"},
      // {id:3,shipped:false,product:"Super 3"},
      // {id:4,shipped:true,product:"Super 4"}
      {shipped:true,product:"Super 1"},
      {shipped:false,product:"Super 2"},
      {shipped:false,product:"Super 3"},
      {shipped:true,product:"Super 4"}
    ];
    utils.csvToStore(rowsArr);//id is injected here...
    console.log("---->csvStore.csvRows="+JSON.stringify(csvStore.csvRows));

    var obj = FL.server.preparePutRowFromCsvStoreById("order",1);
    console.log("---->preparePutRowFromCsvStoreById="+JSON.stringify(obj));
    deepEqual( obj, {d:{ "00":1,"01":true,"02":"Super 1" },r:[]}, "FL.server.preparePutRowFromCsvStoreById correct for id=1" );//39
    obj = FL.server.preparePutRowFromCsvStoreById("order",3);
    console.log("---->preparePutRowFromCsvStoreById="+JSON.stringify(obj));
    deepEqual( obj, {d:{ "00":3,"01":false,"02":"Super 3" },r:[]}, "FL.server.getSavingObjFromCsvStoreById correct for id=3" );//40
    arrOfObj = FL.server.preparePutAllCsvStore("order");
    console.log("---->preparePutAllCsvStore="+JSON.stringify(arrOfObj));
    
    //now we force compressed names to match those in server 
    console.log("before setFieldCompressedName ");
    FL.dd.displayEntities();
    FL.dd.setFieldCompressedName("order","id","62");
    FL.dd.setFieldCompressedName("order","shipped","63");
    FL.dd.setFieldCompressedName("order","product","64");
    console.log("after setFieldCompressedName ");
    FL.dd.displayEntities();

    csvStore.csvRows = {};
    FL.dd.setSync("order",true);//force sync
    console.log("test 0  convertToCsvStore csvStore.csvRows ="+JSON.stringify(csvStore.csvRows));
    // var simulObjFromServer = _.map(arrOfObj,function(element){return element.d;});
    var simulObjFromServer = arrOfObj;
    console.log("test 1 convertArrC2LForEntity ---->before function: simulObjFromServer="+JSON.stringify(simulObjFromServer));
    var csvStoreArray = FL.server.convertArrC2LForEntity("order",simulObjFromServer);
    //FL.server.loadCsvStoreFromEntity("order");
    console.log("test 2  convertArrC2LForEntity csvStoreArray ="+JSON.stringify(csvStoreArray));

    FL.server.offline = false;
    var oEntity =  FL.dd.getEntityBySingular("order");
    oEntity.csingular = "61";//we force entity compressed name for test
    //we need to force field compressed names for test

    // FL.server.connect("Joao","oLiVeIrA",function(err){//TEST loadCsvStoreFromEntity
    //     // ok(err === true, "Good connection");
    //     if(err){
    //       if(err.status != "offline")
    //         console.log("Connection Error !!!"+err);
    //     }else{
    //       console.log("Good connection--> begin loadCsvStoreFromEntity(entity)-------------------");
    //       FL.server.loadCsvStoreFromEntity("order",function(err){//all csvStore will be stored in server as "order" content
    //           console.log("loadCsvStoreFromEntity is done !!! Error:"+err);
    //           FL.server.disconnect();
    //           console.log("show csvStore="+JSON.stringify(csvStore.csvRows));
    //       });
    //     }
    // });


  });
  test("FL.server testing server interface functions (no connection need)", function () { //
    //--------------------- Test Setup ----------------------------------------
    //We need at least one entity in local dictionary
    var success = FL.dd.createEntity("order","client's product request");
    FL.dd.addAttribute("order","shipped","expedition status","Shipped","boolean","checkbox",null);
    FL.dd.addAttribute("order","product","unique order item","product","string","textbox",null);
    //forcing compressed field names
    FL.dd.setFieldCompressedName("order","id","62");
    FL.dd.setFieldCompressedName("order","shipped","63");
    FL.dd.setFieldCompressedName("order","product","64");


    //rowsArr is the array to be stored in csvStore.csvRows
    var rowsArr = [
      {shipped:true,product:"Super 1"},
      {shipped:false,product:"Super 2"},
      {shipped:false,product:"Super 3"},
      {shipped:true,product:"Super 4"}
    ];
    utils.csvToStore(rowsArr);// store in csvStore() after converting keys to lowercase and injecting ids
    //--------------------------------------------------------------------------
    //Test 1 - Extract a single id from csvStore.csvRows and prepare it to be added to server
    // extract from format: {"1":{"shipped":true,"product":"Super 1","id":1},"2":{"shipped":false,"product":"Super 2"}}
    //            returns : {"d":{"01":true,"02":"Super 1","00":1},"r":[]} for id=1  
    var obj = FL.server.preparePutRowFromCsvStoreById("order",1);
    deepEqual( obj, {d:{ "62":1,"63":true,"64":"Super 1" },r:[]}, "FL.server.preparePutRowFromCsvStoreById correct for id=1" );//1
    obj = FL.server.preparePutRowFromCsvStoreById("order",3);
    deepEqual( obj, {d:{ "62":3,"63":false,"64":"Super 3" },r:[]}, "FL.server.preparePutRowFromCsvStoreById correct for id=3" );//2
    
    //Test 2 - Extract all lines from csvStore.csvRows and prepare it to be added to server
    // extract from format: {"1":{"shipped":true,"product":"Super 1","id":1},"2":{"shipped":false,"product":"Super 2"}}
    //            returns : [{"d":{"01":true,"02":"Super 1","00":1},"r":[]}, {"d":{"01":false,"02":"Super 2","00":2},"r":[]}]
    var arrOfObj = FL.server.preparePutAllCsvStore("order",1);
    deepEqual( arrOfObj, [{d:{ "62":1, "63":true,"64":"Super 1" },r:[]}, {d:{ "62":2,"63":false,"64":"Super 2" },r:[]}, {d:{ "62":3,"63":false,"64":"Super 3" },r:[]}, {d:{ "62":4,"63":true,"64":"Super 4" },r:[]} ], "FL.server.preparePutAllCsvStore correct" );//3
    
    //Test 3 - Using local Dictionary Converts array received from server (each line has keys=field compressed names) to equivalent array with logical names
    //           received from sever : [{d:{"01":true,"02":"Super 1","00":1},r:[]},{d:{"01":false,"02":"Super 2","00":2},r:[]}]
    //     array to store in csvStore: [{"shipped":true,"product":"Super 1","id":1},{"shipped":false,"product":"Super 2","id":2}]
    var simulObjFromServer = arrOfObj;
    var csvStoreArray = FL.server.convertArrC2LForEntity("order",simulObjFromServer);
    deepEqual( csvStoreArray, [{ "id":1,"shipped":true,"product":"Super 1" }, { "id":2,"shipped":false,"product":"Super 2" }, { "id":3,"shipped":false,"product":"Super 3" }, { "id":4,"shipped":true,"product":"Super 4" } ], "FL.server.convertArrC2LForEntity correct in case a id is compressed in the input array" );//4
    
    // In the case where no compressed field name is translatable into "id" convertArrC2LForEntity generates the id !!!
    simulObjFromServer = [{d:{ "63":true,"64":"Super 1" },r:[]}, {d:{ "63":false,"64":"Super 2" },r:[]}, {d:{"63":false,"64":"Super 3" },r:[]}, {d:{"63":true,"64":"Super 4" },r:[]} ];
    csvStoreArray = FL.server.convertArrC2LForEntity("order",simulObjFromServer);
    deepEqual( csvStoreArray, [{ "id":1,"shipped":true,"product":"Super 1" }, { "id":2,"shipped":false,"product":"Super 2" }, { "id":3,"shipped":false,"product":"Super 3" }, { "id":4,"shipped":true,"product":"Super 4" } ], "FL.server.convertArrC2LForEntity correct in case no field is translatable into 'id'" );//5
  });
*/
});