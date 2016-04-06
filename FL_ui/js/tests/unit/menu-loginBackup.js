QUnit.extend(QUnit, {//QUnit extension to support inArray
    inArray: function (actual, expectedValues, message) {
        var xOk = ( JSON.stringify(actual.sort()) === JSON.stringify(expectedValues.sort()) );
        ok(xOk, message);
    }
});
$(function () {
  module("menu-login");

  test("basic test & FL.common & FL.dd", function () { //one test can have several assertions
    var actual = '1';
    var expected = 1;
    ok( actual == expected,"Validated !!!" ); //bolean expression
    equal(actual,expected,"...are equal");//non strict assertion
    strictEqual(1,1,"they are strictly equal");//non strict assertion
    // deepEqual(item1,item2,"all the elements in the array are equal"); /recursively vompares array elements and objects 
    actual =  FL.common.stringAfterLast('http://www.framelink.co/app?d=myDomain1','=');
    ok( actual == "myDomain1","FL.common.stringAfterLast('http://www.framelink.co/app?d=myDomain1','=') -> 'myDomain'");//4 
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

    // FL.common.printToConsole("<--------------test------------>");
    actual =  FL.common.getLastTagInString('the brown*fox* is there','(',')'); //(str,separator,tagTerminator)
    ok( actual === null," FL.common.getLastTagInString('the brown*fox* is there','(',')') -> null");//17
    // FL.common.printToConsole("------------------------------->"+actual);



  });
  // test("login test", function () { //one test can have several assertions
  //   var lastLoginStr = localStorage.login;// Retrieve format {email:x1,userName:x2,password:x3};
  //   var actual = null;
  //   var expected = null;
  //   if(lastLoginStr) { //login exists
  //     var lastLoginObj = JSON.parse(lastLoginStr);
  //     expected = lastLoginObj.email;
  //   }else{// not signed In
  //     expected = " Sign In";
  //   }
  //   var actual = '1';
  //   var expected = 1;
  //   equal(actual,expected,"...are equal");//non strict assertion
  // });  
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
    FL.common.printToConsole(car1.phrase());
    ok( car1.phrase() == "Fiat of 1990","phrase function Validated !!!" );//3
    var myMenu1 = FL.menu.createMenu({jsonMenu:oMenu,initialMenu:"_home",editable:false});
    FL.common.printToConsole(myMenu1.toString());
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


    /*
    var myMenu1 = new FL.menu({jsonMenu:oMenu,initialMenu:"_home",editable:false});
    ok( myMenu1.settings.jsonMenu.menu[1].title == "MenuB/T1","Getting menu title 'MenuB/T1' (at root)" );
    ok( myMenu1.settings.jsonMenu.menu[1].menu[1].title == "MenuB/T2-II","Getting menu title 'MenuB/T2-II' at second level" );
    myMenu1.settings.jsonMenu.menu[1].menu[1].title = "Joachim";
    ok( myMenu1.settings.jsonMenu.menu[1].menu[1].title == "Joachim","Setting menu 'MenuB/T2-II' to 'Joachim'");
    myMenu1.test_Add_Id_Top();
    ok( myMenu1.settings.jsonMenu.menu[1].menu[1].id == 3,"testAdd_Id_Top placed id=3 in menu 'Joachim'");
    ok( myMenu1.settings.jsonMenu.menu[2].id == 4,"testAdd_Id_Top placed id=4 in last menu");
    ok( myMenu1.settings.jsonMenu.menu[1].menu[1].top === false,"testAdd_Id_Top placed top = false in menu 'Joachim'");
    ok( myMenu1.settings.jsonMenu.menu[2].top === true,"testAdd_Id_Top placed top = true in last menu");
    var oEl = myMenu1.test_menuFindById(oMenu.menu,4);
    deepEqual(myMenu1.settings.jsonMenu.menu[2],oEl,"menuFindById() got last menu element");
    oEl = myMenu1.test_menuFindById(oMenu.menu,3);
    deepEqual(myMenu1.settings.jsonMenu.menu[1].menu[1],oEl,"menuFindById() got menu element 'Joachim'");
    */
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
    /*
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
    /*
    /*    
    var myMenu1 = new FL.menu({jsonMenu:oMenu,initialMenu:"_home",editable:false});
    // ok( myMenu1.settings.jsonMenu.menu[1].title == "MenuB/T1","Getting menu title 'MenuB/T1' (at root)" );
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
    // alert("--->"+$('#0').text());
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
    // alert("for #2 $itemClicked.length=" + $itemClicked.length + " -->"+ $itemClicked.text());
    // $itemClicked.trigger( {type:"mousedown",which:3} );//the same as pressing the right mouse on #3 OK !!!
    $itemClicked.trigger( {type:"click"} );//the same as clicking the mouse on #2 OK !!!
    // the test need some type to wait for the page "_home.html" to load before checking for id="_home" 
    stop();//waits for a start() before continuing
    setTimeout(function(){
      // alert("1-->"+$("#_home").length);
      ok($("#_home").length !== 0, "the internal page '_home.html' was loaded");
      start();//stops test runner and waits for start to continue
      var $itemClicked = $( "#4" );
      // alert("for #4 $itemClicked.length="+$itemClicked.length+" -->"+$itemClicked.text());
      $itemClicked.trigger( {type:"click"} );//the same as clicking the mouse on #4 OK !!!
      // the test need some type to wait for the page "_mission.html" to load before checking for id="_mission" 
      stop();
      setTimeout(function(){ok($("#_mission").length !== 0, "the internal page '_mission.html' was loaded");start();},100);
    },100);
    */
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
    FL.common.printToConsole("before click myMenu1.is_menuHide="+myMenu1.is_menuHide);
    FL.common.printToConsole("before click myMenu1.is_contextOn="+myMenu1.is_contextOn);

    $itemClicked.trigger( {type:"mousedown",which:3} );//the same as pressing the right mouse on toolbar OK !!!
    FL.common.printToConsole("after click myMenu1.is_menuHide="+myMenu1.is_menuHide);
    FL.common.printToConsole("after click myMenu1.is_contextOn="+myMenu1.is_contextOn);
    equal(true, myMenu1.is_menuHide, "right click in toolbar => myMenu1.is_menuHide=true ");
    equal(false, myMenu1.is_contextOn, "right click in toolbar => myMenu1.is_contextOn=false ");
    $itemClicked.trigger( {type:"mousedown",which:2} );//the same as pressing the right mouse on toolbar OK !!!
     /*
    // -----------------------------------------------------------------------
    // $('<ul id="begin_menu" class="nav navbar-nav"></ul>').appendTo('#qunit-fixture');//necessary for menuRefresh()
    $('<div id="menuContainer"><ul id="main-menu"></ul></div>').appendTo('#qunit-fixture');//necessary for menuRefresh() and 
    var myMenu1 = new FL.menu({jsonMenu:oMenu,initialMenu:"_home",editable:true});
    // alert("--->"+$('#0').text());
    var $itemClicked = $( "#toolbar" );
    // alert("for #2 $itemClicked.length=" + $itemClicked.length + " -->"+ $itemClicked.text());

    $itemClicked.trigger( {type:"mousedown",which:3} );//the same as pressing the right mouse on toolbar OK !!!
    // alert("is_menuHide="+myMenu1.is_menuHide+" is_contextOn="+myMenu1.is_contextOn);
    equal(true, myMenu1.is_menuHide, "right click in toolbar => myMenu1.is_menuHide=true ");

    equal(false, myMenu1.is_contextOn, "right click in toolbar => myMenu1.is_contextOn=false ");
    $itemClicked = $( "#2" );
    $itemClicked.trigger( {type:"mousedown",which:3} );//the same as pressing the right mouse on id=2 a 2nd level menu !!!
    // alert("is_menuHide="+myMenu1.is_menuHide+" is_contextOn="+myMenu1.is_contextOn);
    */
  });
 
  // ensure all the required form elements are in place
  // //http://blog.newrelic.com/2013/05/15/new-simple-javascript-testing-with-qunit/
  // test( "All required form elements exist", 7, function() {
  //     ok($("#originalAmount").length != 0, "original amount element exists");
  //     ok($("#repaymentFrequency").length != 0, "repayment frequency element exists");
  //     ok($("#loanTerm").length != 0, "loan term element exists");
  //     ok($("#interestRate").length != 0, "interest rate element exists");
  //     ok($("#submit").length != 0, "submit button element exists");
  //     ok($("#repaymentAmount").length != 0, "total repayment amount output element exists");
  //     ok($("#totalToRepay").length != 0, "total amount to repay output button element exists");
  // });
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

    // xVar = "abc@link.com";
    // success = utils.typeOf(xVar);
    // ok(success == "email" , "FL.util.typeOf('abc@link.com') -->'email'");//6

    xVar = new Date();
    success = utils.typeOf(xVar);
    ok(success == "date" , "utils.typeOf(new Date()) -->'date'");//6
    var foo;
    success = utils.typeOf(foo);
    ok(success == "undefined" , "utils.typeOf(foo) foo is undefined -->'undefined'");//7

    xVar = "abc@link.com";
    success = utils.typeUIOf(xVar);
    ok(success == "email" , "utils.typeUIOf('abc@link.com') -->'email'");//8
    
    xVar = "jojo@mail.telepac.pt";
    success = utils.typeUIOf(xVar);
    ok(success == "email" , "utils.typeUIOf('jojo@mail.telepac.pt') -->'email'");//9

    xVar = "jojo@.mail.telepac.pt";
    success = utils.typeUIOf(xVar);
    ok(success === null , "utils.typeUIOf('jojo@.mail.telepac.pt') -->'invalid email'");//10

    xVar = "http://www.framelink.co";
    success = utils.typeUIOf(xVar);
    ok(success == "url" , "utils.typeUIOf('http://www.framelink.co') -->'url'");//11

    xVar = "http://www.framelink..co";
    success = utils.typeUIOf(xVar);
    ok(success === null , "utils.typeUIOf('http://www.framelink..co') -->'invalid url'");//12
    
    xVar = "351219244558";
    success = utils.typeUIOf(xVar);
    ok(success == "phone" , "utils.typeUIOf('351219244558') -->'valid phone'");//13

    xVar = "3512192445582";
    success = utils.typeUIOf(xVar);
    ok(success === null , "utils.typeUIOf('951219244558') -->'invalid phone'");//14

  });
  test("FL.common tests", function () {
    FL.common.appsettings.radixpoint = ",";
    FL.common.appsettings.thousandsSeparator = "."; 

    //----------------------- tail()
    var xVar = "12345.567"; 
    var result = FL.common.getTail(xVar,".");
    ok(result == "567" , "FL.common.getTail('" + xVar + "','.') -->'" + result + "' with defined radixpoint='.')");//1
    var result = FL.common.getTail(xVar);
    ok(result == "" , "FL.common.getTail('" + xVar + "') -->'" + result + "' with undefined radixpoint --> appsettings.radixpoint=',')");//1
    var xVar = "12345,567"; 
    var result = FL.common.getTail(xVar);
    ok(result == "567" , "FL.common.getTail('" + xVar + "') -->'"  + result + "' with undefined radixpoint --> appsettings.radixpoint=',')");//1
    var xVar = "12345"; 
    var result = FL.common.getTail(xVar);
    ok(result == "" , "FL.common.getTail('" + xVar + "') -->'"  + result + "' with undefined radixpoint --> appsettings.radixpoint=',')");//1


    //----------------------- Number.toFormattedString()
    FL.common.appsettings.radixpoint = ",";
    FL.common.appsettings.thousandsSeparator = ".";   
    var x = 12345.567;
    var result = x.toFormattedString();
    ok(result == "12.345,567" , "Numeric x="+ x +"   x.toFormattedString() -->'" + result + "' with radixpoint=',' thousandsSeparator='.')");//1

    x = 123456789;
    var result = x.toFormattedString();
    ok(result == "123.456.789" , "Numeric x="+ x +"   x.toFormattedString() -->'" + result + "' with radixpoint=',' thousandsSeparator='.')");//1

    x = 12345.6789;
    var decimals = 2;
    var result = x.toFormattedString(decimals);
    ok(result == "12.345,68" , "Numeric x="+ x +"   x.toFormattedString('" + decimals + "') -->'" + result + "' with radixpoint=',' thousandsSeparator='.')");//1

    x = 12345.4789;
    var decimals = 0;
    var result = x.toFormattedString(decimals);
    ok(result == "12.345" , "Numeric x="+ x +"   x.toFormattedString('" + decimals + "') -->'" + result + "' with radixpoint=',' thousandsSeparator='.')");//1

    x = 12345.5789;
    var decimals = 0;
    var result = x.toFormattedString(decimals);
    ok(result == "12.346" , "Numeric x="+ x +"   x.toFormattedString('" + decimals + "') -->'" + result + "' with radixpoint=',' thousandsSeparator='.')");//1


    FL.common.appsettings.radixpoint = ".";
    FL.common.appsettings.thousandsSeparator = ",";   
    x = 12345.567;
    var result = x.toFormattedString();
    ok(result == "12,345.567" , "Numeric x="+ x +"   x.toFormattedString() -->'" + result + "' with radixpoint='.' thousandsSeparator=',')");//1

    x = 123456789;
    var result = x.toFormattedString();
    ok(result == "123,456,789" , "Numeric x="+ x +"   x.toFormattedString() -->'" + result + "' with radixpoint='.' thousandsSeparator=',')");//1

    x = -123456789;
    var result = x.toFormattedString();
    ok(result == "-123,456,789" , "Numeric x="+ x +"   x.toFormattedString() -->'" + result + "' with radixpoint='.' thousandsSeparator=',')");//1

    x = +123456789;
    var result = x.toFormattedString();
    ok(result == "123,456,789" , "Numeric x="+ x +"   x.toFormattedString() -->'" + result + "' with radixpoint='.' thousandsSeparator=',')");//1

    x = 12345.6789;
    var decimals = 3;
    var result = x.toFormattedString(decimals);
    ok(result == "12,345.679" , "Numeric x="+ x +"   x.toFormattedString('" + decimals + "') -->'" + result + "' with radixpoint='.' thousandsSeparator=',')");//1

    x = 12345.6789;
    var decimals = 0;
    var result = x.toFormattedString(decimals);
    ok(result == "12,346" , "Numeric x="+ x +"   x.toFormattedString('" + decimals + "') -->'" + result + "' with radixpoint='.' thousandsSeparator=',')");//1


    var x = Number("12A23");
    var result = x.toFormattedString();
    ok(result === null, "Numeric x="+ x +"   x.toFormattedString(" + x + ") -->'" + result + "' with radixpoint='.' thousandsSeparator=',')");//1
    
    //----------------------- String.pad()
    var xVar = "567";
    var result = xVar.pad(5,"0",1);//string to have length=5, add "0" to the right side (1)
    ok(result == "56700" , "String ('" + xVar+ "').pad(5,'0',1) -->'" + result + " string to have length=5, add '0' to the right side (1))");//1
    var result = xVar.pad(5,"0",0);//string to have length=5, add "0" to the left side (0)
    ok(result == "00567" , "String ('" + xVar+ "').pad(5,'0',0) -->'" + result + " string to have length=5, add '0' to the left side (0))");//1
    var result = xVar.pad(5,"0",2);//string to have length=5, add "0" to the left side (0)
    ok(result == "05670" , "String ('" + xVar+ "').pad(5,'0',2) -->'" + result + " string to have length=5, add '0' to both sides (2))");//1
    var result = xVar.pad(6,"0",2);//string to have length=8, add "0" to the left side (0)
    ok(result == "005670" , "String ('" + xVar+ "').pad(6,'0',2) -->'" + result + " string to have length=6, add '0' to both sides (2))");//1
    var result = xVar.pad(2,"0",2);//string to have length=8, add "0" to the left side (0)
    ok(result == "567" , "String ('" + xVar+ "').pad(2,'0',2) -->'" + result + " string to have length=2, add '0' to both sides (2))");//1


    //----------------------- timeTo24()
    var xVar = "11:00 pm";
    var xRet = FL.common.timeTo24(xVar);
    ok(xRet == "23:00" , "timeTo24('"+xVar+"')  -->"+xRet);

    xVar = "11:43 am"; xRet = FL.common.timeTo24(xVar);
    ok(xRet == "11:43" , "timeTo24('"+xVar+"')  -->"+xRet);
    
    xVar = "00:00 am"; xRet = FL.common.timeTo24(xVar);
    ok(xRet == "00:00" , "timeTo24('"+xVar+"')  -->"+xRet);


    xVar = "12:00 pm"; xRet = FL.common.timeTo24(xVar);
    ok(xRet === null , "timeTo24('"+xVar+"')  -->"+xRet+" Bad Input Format");
   
    xVar = "13:00 pm"; xRet = FL.common.timeTo24(xVar);
    ok(xRet === null , "timeTo24('"+xVar+"')  -->"+xRet+" Bad Input Format");


    //----------------------- formatShortLocalToISODate()
    var isoDate = FL.common.formatShortLocalToISODate("2015/6/25 11:21 am");//YMD
    ok(isoDate == "2015-06-25T10:21:00.000Z" , "YMD am formatShortLocalToISODate returns 2015-06-25T10:21:00.000Z");//1

    var isoDate = FL.common.formatShortLocalToISODate("6/25/2015 11:21 am");//MDY
    ok(isoDate == "2015-06-25T10:21:00.000Z" , "MDY am formatShortLocalToISODate returns 2015-06-25T10:21:00.000Z");//1

    var isoDate = FL.common.formatShortLocalToISODate("6/12/2015 03:21 pm");//MDY
    ok(isoDate == "2015-06-12T14:21:00.000Z" , "MDY pm formatShortLocalToISODate returns 2015-06-12T14:2100.000Z");//1
    
    var isoDate = FL.common.formatShortLocalToISODate("6/12/2015 03:21 pm","DMY");//DMY
    ok(isoDate == "2015-12-06T15:21:00.000Z" , "DMY pm formatShortLocalToISODate returns 2015-12-06T15:2100.000Z - The returned value is not a constant, because of the practice of using Daylight Saving Time.");//1

    //----------------------- toISODate()
    var xVar = "2015/06/12";//YMD(China)
    var isoDate = FL.common.toISODate(xVar);
    ok(isoDate === FL.common.formatShortLocalToISODate(xVar) , "FL.common.toISODate('2015/06/12') ISO -->"+isoDate);//10

    var xVar = "2015/06/12 07:00 pm";//YMD(China)
    var isoDate = FL.common.toISODate(xVar);
    ok(isoDate === FL.common.formatShortLocalToISODate(xVar) , "YMD FL.common.toISODate('2015/06/12 07:00 pm') ISO -->"+isoDate);//1

    var xVar = "2015/06/01 12:00 am";//YMD
    var isoDate = FL.common.toISODate(xVar,"YMD");
    ok(isoDate == "2015-06-01T11:00:00.000Z" , "DMY FL.common.toISODate('"+xVar+"','DMY') ISO -->"+isoDate+" assuming 1 h of timezone diff");//1

    var xVar = "2015/06/01 12:00 pm";//YMD
    var isoDate = FL.common.toISODate(xVar,"YMD");
    ok(isoDate === null, "DMY FL.common.toISODate('"+xVar+"','DMY') ISO -->null because 12:00 pm is a bad format");//1
    
    var xVar = "2015/06/01 00:30 am";//YMD
    var isoDate = FL.common.toISODate(xVar,"YMD");
    ok(isoDate == "2015-05-31T23:30:00.000Z" , "DMY FL.common.toISODate('"+xVar+"','DMY') ISO -->"+isoDate+" assuming 1 h of timezone diff");//1

    var xVar = "06/12/2015 07:00 pm";//MDY
    var isoDate = FL.common.toISODate(xVar);
    ok(isoDate === FL.common.formatShortLocalToISODate(xVar) , "MDY FL.common.toISODate('"+xVar+"') ISO -->"+isoDate);//1

    var xVar = "06/12/2015 07:00 pm";//DMY
    var isoDate = FL.common.toISODate(xVar,"DMY");
    ok(isoDate === FL.common.formatShortLocalToISODate(xVar,"DMY") , "DMY FL.common.toISODate('"+xVar+"','DMY') ISO -->"+isoDate);//1


    //----------------------- fromISODateToShortdate()
    var xVar = "2015-12-06T05:00:00.000Z";
    var shortDate = FL.common.fromISODateToShortdate(xVar,"YMD");
    ok(shortDate == "2015/12/06", "YMD FL.common.fromISODateToShortdate('"+xVar+"','YMD') -->"+shortDate);//

    var shortDate = FL.common.fromISODateToShortdate(xVar,"MDY");
    ok(shortDate == "12/06/2015", "YMD FL.common.fromISODateToShortdate('"+xVar+"','YMD') -->"+shortDate);//

    var shortDate = FL.common.fromISODateToShortdate(xVar,"DMY");
    ok(shortDate == "06/12/2015", "YMD FL.common.fromISODateToShortdate('"+xVar+"','YMD') -->"+shortDate);//

    var shortDate = FL.common.fromISODateToShortdate("2015-12-06X05:00:00.000Z","DMY");
    ok(shortDate == null, "if isoDate was a wrong format ('2015-12-06X05:00:00.000Z'), FL.common.fromISODateToShortdate() returns null ");//

    var shortDate = FL.common.fromISODateToShortdate("2015-12-06T05:00:00.000X","DMY");
    ok(shortDate == null, "if isoDate was a wrong format ('2015-12-06T05:00:00.000X'), FL.common.fromISODateToShortdate() returns null ");//

    var shortDate = FL.common.fromISODateToShortdate("2015-12-06T25:00:00.000Z","DMY");
    ok(shortDate == null, "if isoDate was a wrong format ('2015-12-06T25:00:00.000Z'), FL.common.fromISODateToShortdate() returns null ");//

    var shortDate = FL.common.fromISODateToShortdate("2015-12-06T05:61:00.000Z","DMY");
    ok(shortDate == null, "if isoDate was a wrong format ('2015-12-06T05:61:00.000Z'), FL.common.fromISODateToShortdate() returns null ");//

    var shortDate = FL.common.fromISODateToShortdate("2015-12-06T05:01:61.000Z","DMY");
    ok(shortDate == null, "if isoDate was a wrong format ('2015-12-06T05:01:61.000Z'), FL.common.fromISODateToShortdate() returns null ");//

    var shortDate = FL.common.fromISODateToShortdate("2015-12-06T05:01:01-000Z","DMY");
    ok(shortDate == null, "if isoDate was a wrong format ('2015-12-06T05:01:01-000Z'), FL.common.fromISODateToShortdate() returns null ");//

    var shortDate = FL.common.fromISODateToShortdate("2015-13-06T05:01:01-000Z","DMY");
    ok(shortDate == null, "if isoDate was a wrong format ('2015-13-06T05:01:01-000Z'), FL.common.fromISODateToShortdate() returns null ");//

    var shortDate = FL.common.fromISODateToShortdate("2015-12-06T05:01","DMY");
    ok(shortDate == "06/12/2015", "if isoDate was a shorter format ('2015-12-06T05:01'), FL.common.fromISODateToShortdate() returns 06/12/2015 OK! ");//

    //----------------------- fromISODateToTime()
    var xVar = "2015-12-06T05:00:00.000Z";
    var time = FL.common.fromISODateToTime(xVar);
    ok(time == "06:00 am", "YMD FL.common.fromISODateToTime('"+xVar+") -->"+time+ "-->assumes 1 hr timezone difference");//
 
    var xVar = "2015-12-06T15:45:00.000Z";
    var time = FL.common.fromISODateToTime(xVar);
    ok(time == "04:45 pm", "YMD FL.common.fromISODateToTime('"+xVar+"') -->"+time+ "-->assumes 1 hr timezone difference");//

    //----------------------- fromISODateToShortdateTime()
    var xVar = "2015-12-06T05:00:00.000Z";
    var shortDatetime = FL.common.fromISODateToShortdateTime(xVar,"MDY");
    ok(shortDatetime == "12/06/2015 06:00 am", "YMD FL.common.fromISODateToShortdateTime('"+xVar+"','MDY') -->"+shortDatetime+ "-->assumes 1 hr timezone difference");//

    var xVar = "2015-12-06T15:45:00.000Z";
    var shortDatetime = FL.common.fromISODateToShortdateTime(xVar,"DMY");
    ok(shortDatetime == "06/12/2015 04:45 pm", "YMD FL.common.fromISODateToShortdateTime('"+xVar+"','DMY') -->"+shortDatetime+ "-->assumes 1 hr timezone difference");//

    var xVar = "2015-12-006T15:45:00.000Z";
    var shortDatetime = FL.common.fromISODateToShortdateTime(xVar,"DMY");
    ok(shortDatetime === null, "if isoDate was a wrong format, FL.common.fromISODateToShortdateTime() returns null ");//

    var d = new Date();
    var xVar = d.toISOString();
    var shortDatetime = FL.common.fromISODateToShortdateTime(xVar,"DMY");
    ok(shortDatetime == shortDatetime, "YMD FL.common.fromISODateToShortdateTime('"+xVar+"','DMY') -->"+shortDatetime+ "-->Shows time NOW this passes allways...");//


    //----------------------- is_validShortDate()
    var xVar = "2015/06/2";//YMD(China)
    var success = FL.common.is_validShortDate(xVar);
    ok(success === true , "FL.common.is_validShortDate('2015/06/2') YMD -->'true'");//1
    
    var xVar = "2015-06-2";//YMD(China)
    var success = FL.common.is_validShortDate(xVar);
    ok(success === true , "FL.common.is_validShortDate('2015-06-2') YMD -->'true'");//1

    var xVar = "2015.06.2";//YMD(China)
    var success = FL.common.is_validShortDate(xVar);
    ok(success === true , "FL.common.is_validShortDate('2015.06.2') YMD -->'true'");//1
    
    var xVar = "15.06.2";//YMD(China)
    var success = FL.common.is_validShortDate(xVar);
    ok(success === false , "FL.common.is_validShortDate('15.06.2') YMD -->'unacceptable'");//1

    var xVar = "2015.6.2";//YMD(China)
    var success = FL.common.is_validShortDate(xVar);
    ok(success === true , "FL.common.is_validShortDate('2015.6.2') YMD -->'true'");//1

    var xVar = "2015 6 2";//YMD(China)
    var success = FL.common.is_validShortDate(xVar);
    ok(success === true , "FL.common.is_validShortDate('2015 6 2') YMD -->'true'");//1

    var xVar = "3/12/2015";//DMY(Europe)
    var success = FL.common.is_validShortDate(xVar);
    ok(success === true , "FL.common.is_validShortDate('3/12/2015') DMY -->'true'");//1

    var xVar = "30/12/2015";//DMY(Europe)
    var success = FL.common.is_validShortDate(xVar);
    ok(success === true , "FL.common.is_validShortDate('30/12/2015') DMY -->'true'");//1

    var xVar = "30/12/15";//DMY(Europe)
    var success = FL.common.is_validShortDate(xVar);
    ok(success === false , "FL.common.is_validShortDate('30/12/15') DMY -->'unacceptable'");//1

    var xVar = "3/3/2015";//DMY(Europe)
    var success = FL.common.is_validShortDate(xVar);
    ok(success === true , "FL.common.is_validShortDate('3/3/2015') DMY -->'true'");//1


    var xVar = "12/30/2015";//MDY(US)
    var success = FL.common.is_validShortDate(xVar);
    ok(success === true , "FL.common.is_validShortDate('12/30/2015') MDY -->'true'");//1

    var xVar = "12/3/2015";//MDY(US)
    var success = FL.common.is_validShortDate(xVar);
    ok(success === true , "FL.common.is_validShortDate('12/3/2015') MDY -->'true'");//1


    var xVar = "March 21, 2012";
    var success = FL.common.is_ValidDate(xVar);
    ok(success === true , "FL.common.is_ValidDate('March 21, 2012') -->'true'");//1

    xVar = "March";
    success = FL.common.is_ValidDate(xVar);
    ok(success === false , "FL.common.is_ValidDate('March') -->'false'");//2

    var xVar = "Mar 21, 2012";
    var success = FL.common.is_ValidDate(xVar);
    ok(success === true , "FL.common.is_ValidDate('Mar 21, 2012') -->'true'");//3

    var xVar = "Wednesday Mar 21 2012";
    var success = FL.common.is_ValidDate(xVar);
    ok(success === true , "FL.common.is_ValidDate('Wednesday Mar 21 2012') -->'true'");//4

    var xVar = "Thursday Mar 21 2012"; //this date is a Wednesday !!!!
    var success = FL.common.is_ValidDate(xVar);
    ok(success === false , "FL.common.is_ValidDate('Thursday Mar 21 2012') -->'false because this date is a Wednesday'");//5

    var xVar = "Wed Mar 21 2012";
    var success = FL.common.is_ValidDate(xVar);
    ok(success === true , "FL.common.is_ValidDate('Wed Mar 21 2012') -->'true'");//6

    var xVar = "Sun Mar 21 2012";//this date is a Wednesday !!!!
    var success = FL.common.is_ValidDate(xVar);
    ok(success === false , "FL.common.is_ValidDate('Sun Mar 21 2012') -->'false'");//7

    var xVar = "Wed 21 2012";//no month
    var success = FL.common.is_ValidDate(xVar);
    ok(success === false , "FL.common.is_ValidDate('Wed 21 2012') -->'false'");//8

    xVar = "03-21-12";
    success = FL.common.is_ValidDate(xVar);
    ok(success === false , "FL.common.is_ValidDate('03-21-12') -->'false year must be complete'");//9

    xVar = "03-21-2012";
    success = FL.common.is_ValidDate(xVar);
    ok(success === true , "FL.common.is_ValidDate('03-21-2012') -->'true'");//10
    
    xVar = "03-21-1812";
    success = FL.common.is_ValidDate(xVar);
    ok(success === false , "FL.common.is_ValidDate('03-21-1812') -->'false'");//11

    xVar = "03/21/2012";
    success = FL.common.is_ValidDate(xVar);
    ok(success === true , "FL.common.is_ValidDate('03/21/2012') -->'true'");//12

    xVar = "21/03/2012";//this is read has month/day/year----ç->MUST BE OK !!!  DMY(europe)
    success = FL.common.is_ValidDate(xVar);
    ok(success === true , "FL.common.is_ValidDate('21/03/2012') -->'DMY europe true'");//13

    xVar = "21-Mar-2012";
    success = FL.common.is_ValidDate(xVar);
    ok(success === true , "FL.common.is_ValidDate('21-Mar-2012') -->'true'");//14

    xVar = "21/Mar/12";
    success = FL.common.is_ValidDate(xVar);
    ok(success === true , "FL.common.is_ValidDate('21/Mar/12') -->'true'");//15

    xVar = "03 21 2012";
    success = FL.common.is_ValidDate(xVar);
    ok(success === true , "FL.common.is_ValidDate('03 21 2012') -->'true MDY'");//16

    xVar = "Stage Paris 2014";
    success = FL.common.is_ValidDate(xVar);
    ok(success === false , "FL.common.is_ValidDate('Stage Paris 2014') -->'false'");//17

    xVar = "209999";
    success = FL.common.is_ValidDate(xVar);
    ok(success === false , "FL.common.is_ValidDate('209999') -->'false'");//18


    var arrOfRowValues = [
           "March 21, 2012",
           "03-21-2012",
            //var d = Date.parse("15-21-12");//NaN
           "03/21/2012",
           "21-Mar-2012"
    ];
    var success = FL.common.is_dateArrInStringFormat(arrOfRowValues);
    ok(success == true , "FL.common.is_dateArrInStringFormat('array of values with all valid') -->'true'" );//19
    arrOfRowValues = [
           "March 21, 2012",
           "03-21-12",
           "15-21-12",//ofending value
           "03/21/2012",
           "21-Mar-2012"
    ];    
    success = FL.common.is_dateArrInStringFormat(arrOfRowValues);
    ok(success == false , "FL.common.is_dateArrInStringFormat('array of values with one invalid') -->'false'" );//20
    arrOfRowValues = [
           " ",
           "",
           "",
           " ",
           " "
    ];    
    success = FL.common.is_dateArrInStringFormat(arrOfRowValues);
    ok(success === false , "FL.common.is_dateArrInStringFormat('array of spaces and empty values') -->'false'" );//21


    //------------------- currencyToStringNumber
    FL.common.appsettings.radixpoint = ",";
    xVar ="€ 12345,67";
    var result =  FL.common.currencyToStringNumber(xVar);
    ok(result == "12345.67" , "FL.common.currencyToStringNumber('"+xVar+"') -->radixpoint=','-->"+result+"'" );//67
    xVar ="kr. 9.734.123,45";
    result =  FL.common.currencyToStringNumber(xVar);
    ok(result == "9734123.45" , "FL.common.currencyToStringNumber('"+xVar+"') -->radixpoint=','-->"+result+"'" );
    xVar ="9.734.123,45 kr.";
    result =  FL.common.currencyToStringNumber(xVar);
    ok(result == "9734123.45" , "FL.common.currencyToStringNumber('"+xVar+"') -->radixpoint=','-->"+result+"'" );

    FL.common.appsettings.radixpoint = ":";
    xVar ="€ 12345:67";
    var result =  FL.common.currencyToStringNumber(xVar);
    ok(result == "12345.67" , "FL.common.currencyToStringNumber('"+xVar+"') -->radixpoint=':'-->"+result+"'" );//67

    FL.common.appsettings.radixpoint = ":";
    FL.common.appsettings.thousandsSeparator = "."; 
    xVar ="€ 12345:67";
    var result =  FL.common.currencyToStringNumber(xVar);
    ok(result == "12345.67" , "FL.common.currencyToStringNumber('"+xVar+"') -->radixpoint=':'-->"+result+"'" );//67

    xVar ="€ 12.345:67";
    var result =  FL.common.currencyToStringNumber(xVar);
    ok(result == "12345.67" , "FL.common.currencyToStringNumber('"+xVar+"') -->radixpoint=':'-->"+result+"'" );//67

    FL.common.appsettings.thousandsSeparator = "_"; 
    xVar ="€ 12_345:67";
    var result =  FL.common.currencyToStringNumber(xVar);
    ok(result == "12345.67" , "FL.common.currencyToStringNumber('"+xVar+"') -->radixpoint=':'-->"+result+"'" );//67


    FL.common.appsettings.radixpoint = ".";
    xVar ="Din. 1,235.45";
    result =  FL.common.currencyToStringNumber(xVar);
    ok(result == "1235.45" , "FL.common.currencyToStringNumber('"+xVar+"') -->radixpoint='.'-->"+result+"'" );
    xVar ="1,235.45 Din";
    result =  FL.common.currencyToStringNumber(xVar);
    ok(result == "1235.45" , "FL.common.currencyToStringNumber('"+xVar+"') -->radixpoint='.'-->"+result+"'" );

    FL.common.appsettings.radixpoint = ",";
    // FL.common.formatStringNumberWithMask needs a pre-existent dom div with id="_freeSlots" .this was created in index.html under qunit-fixture
    xVar ="1234.56";
    result =  FL.common.formatStringNumberWithMask(xVar,"99-AAA-999");
    ok(result == "12-AAA-345" , "FL.common.formatStringNumberWithMask('"+xVar+"') -->radixpoint='.'-->"+result+"'" );

    result =  FL.common.formatStringNumberWithMask(xVar,"999-HELLO-999-OK");
    ok(result == "123-HELLO-456-OK" , "FL.common.formatStringNumberWithMask('"+xVar+"') -->radixpoint='.'-->"+result+"'" );

    result =  FL.common.formatStringNumberWithMask(xVar,"99999-HELLO-999-OK");
    ok(result == "12345-HELLO-6__-OK" , "FL.common.formatStringNumberWithMask('"+xVar+"') -->radixpoint='.'-->"+result+"'" );

    success = FL.common.isNumberSep('4,294,967,295.00',',');
    ok(success === true , "FL.common.isNumberSep('4,294,967,295.00', ',') -->'true'" );//22
    success = FL.common.isNumberSep('4.294.967.295,00','.');
    ok(success === true , "FL.common.isNumberSep('4.294.967.295,00', '.') -->'true'" );//23
    success = FL.common.isNumberSep('4 294 967 295,00',' ');
    ok(success === true , "FL.common.isNumberSep('4 294 967 295,00', ' ') -->'true'" );//24
    success = FL.common.isNumberSep('4,294,,967,295.00',',');
    ok(success === false , "FL.common.isNumberSep('4,294,,967,295.00', ',') -->'false'" );//25
    success = FL.common.isNumberSep('4,294 967,295.00',',');
    ok(success === false , "FL.common.isNumberSep('4,294 967,295.00', ',') -->'false'" );//26
    success = FL.common.isNumberSep('4 294  967 295,00',',');
    ok(success === false , "FL.common.isNumberSep('4 294  967 295,00', ',') -->'false'" );//27
    success = FL.common.isNumberSep('1234567', ',');
    ok(success === true , "FL.common.isNumberSep('1234567', ',') -->'true'" );//28
    success = FL.common.isNumberSep('1234567', '.');
    ok(success === true , "FL.common.isNumberSep('1234567', '.') -->'true'" );//29
    success = FL.common.isNumberSep('1234567', ' ');
    ok(success === true , "FL.common.isNumberSep('1234567', ' ') -->'true'" );//30

    success = FL.common.isNumberSep('1234567.12', ',');
    ok(success === true , "FL.common.isNumberSep('1234567.12', ',') -->'true'" );//31
    success = FL.common.isNumberSep('1234567.12', '.');//This is ambiguous =>interpret has US number without separators
    ok(success === true , "FL.common.isNumberSep('1234567.12', '.') -->'true'" );//32
    success = FL.common.isNumberSep('1234567', ' ');
    ok(success === true , "FL.common.isNumberSep('1234567.12', ' ') -->'true'" );//33

    success = FL.common.isNumberSep('1234567,12', ',');
    ok(success === true , "FL.common.isNumberSep('1234567,12', ',') -->'true'" );//34
    success = FL.common.isNumberSep('1234567,12', '.');//if sep="." =>decimal = "," =>TRUE 
    ok(success === true , "FL.common.isNumberSep('1234567,12', '.') -->'true'" );//35
    success = FL.common.isNumberSep('1234567,12', ' ');//if sep=" " =>France decimal = "," =>TRUE
    ok(success === true , "FL.common.isNumberSep('1234567,12', ' ') -->'true'" );//36

    success = FL.common.isNumberSep('1a4567,12', ',');
    ok(success === false , "FL.common.isNumberSep('1a4567,12', ',') -->'false'" );//37
    success = FL.common.isNumberSep('1a4567,12', '.');
    ok(success === false , "FL.common.isNumberSep('1a4567,12', '.') -->'false'" );//38
    success = FL.common.isNumberSep('1a4567,12', ' ');
    ok(success === false , "FL.common.isNumberSep('1a4567,12', ' ') -->'false'" );//39

    success = FL.common.isNumberSep('abc12', ',');
    ok(success === false , "FL.common.isNumberSep('abc12', ',') -->'false'" );//40
    success = FL.common.isNumberSep('abc12', '.');
    ok(success === false , "FL.common.isNumberSep('abc12', '.') -->'false'" );//41
    success = FL.common.isNumberSep('abc12', ' ');
    ok(success === false , "FL.common.isNumberSep('abc,12', ' ') -->'false'" );//42
    success = FL.common.isNumberSep('1.000,3', ',');
    ok(success === false , "FL.common.isNumberSep('1.000,3', ',') -->'false'" );//43
    success = FL.common.isNumberSep('1,000.3', ',');
    ok(success === true , "FL.common.isNumberSep('1.000,3', ',') -->'true'" );//44
    success = FL.common.isNumberSep('1 000.3', ' ');
    ok(success === false , "FL.common.isNumberSep('1 000.3', ' ') -->'false'" );//45
    success = FL.common.isNumberSep('1 000,3', ' ');
    ok(success === true , "FL.common.isNumberSep('1 000,3', ' ') -->'true'" );//46
    success = FL.common.isNumberSep('1,000 3', ' ');
    ok(success === false , "FL.common.isNumberSep('1,000 3', ' ') -->'false'" );//47

    arrOfRowValues = [
           "4.294.967.295,00",
           "1000",
           "1000,3",
           "0,324",
           "-27,2 "
    ];
    var xRet = FL.common.getArrNumberFormat(arrOfRowValues);
    ok(xRet.number === true && xRet.format == "de" , "FL.common.getArrNumberFormat(arrOfRowValues) -->'number:true, format:'de'" );//48
    arrOfRowValues = [
           "4.294.967.295,00",
           "1000",
           "1000,3",
           "0,,324",
           "-27,2 "
    ];
    xRet = FL.common.getArrNumberFormat(arrOfRowValues);
    ok(xRet.number === false && xRet.format === null , "FL.common.getArrNumberFormat(arrOfRowValues) -->'number:false, format:null " );//49
    arrOfRowValues = [
           "-4294",
           "1000",
           "1000,3",
           "0,324",
           "-27,2 "
    ];
    xRet = FL.common.getArrNumberFormat(arrOfRowValues);
    ok(xRet.number === true && xRet.format == "de" , "FL.common.getArrNumberFormat(arrOfRowValues) -->'number:true, format:'de'" );//50
    arrOfRowValues = [
           "-4294",
           "1 000 102",
           "1000,3",
           "0,324",
           "-27,2"
    ];
    xRet = FL.common.getArrNumberFormat(arrOfRowValues);
    ok(xRet.number === true && xRet.format == "fr" , "FL.common.getArrNumberFormat(arrOfRowValues) -->'number:true, format:'fr'" );//51
    arrOfRowValues = [
           "-4294",
           "1,000,102",
           "1000,3",//this is Us format (comma is a separator)..it could also be "de" format
           "0,324",
           "-27,2"
    ];
    xRet = FL.common.getArrNumberFormat(arrOfRowValues);
    ok(xRet.number === true && xRet.format === "us" , "FL.common.getArrNumberFormat(arrOfRowValues) -->'number:false, format:'us'" );//52
    arrOfRowValues = [
           "-4294",
           "1,000,102",
           "1000.3",//this is Us format (comma is a decimal )..it could also be "de" format
           "0.324",
           "-27"
    ];
    xRet = FL.common.getArrNumberFormat(arrOfRowValues);
    ok(xRet.number === true && xRet.format == "us", "FL.common.getArrNumberFormat(arrOfRowValues) -->'number:true, format:'us'" );//53

    arrOfRowValues = [
           "-4294",
           "1,000,102",//us
           "1.000,3",
           "0.324",
           "-27"
    ];
    xRet = FL.common.getArrNumberFormat(arrOfRowValues);
    ok(xRet.number === false && xRet.format === null, "FL.common.getArrNumberFormat(arrOfRowValues) -->'number:false, format:null" );//54

    success = FL.common.is_oneOfCharsInString('abc12', '*1');
    ok(success === true , "is_oneOfCharsInString('abc12', '*1') -->'true'" );//55
    success = FL.common.is_oneOfCharsInString('1 102 200', ', ');
    ok(success === true , "is_oneOfCharsInString('1 102 200', ', ') -->'true'" );//56
    success = FL.common.is_oneOfCharsInString('1 102 200', '.,');
    ok(success === false , "is_oneOfCharsInString('1 102 200', '.,') -->'false'" );//57

    success = FL.common.localeStringToNumber('1,002,003.4', 'us');
    ok(success === 1002003.4 , "localeStringToNumber('1,002,003.4', 'us') -->1002003.4" );//58
    success = FL.common.localeStringToNumber('1.002.003,4', 'de');
    ok(success === 1002003.4 , "localeStringToNumber('1.002.003,4', 'de') -->1002003.4" );//59    
    success = FL.common.localeStringToNumber('1 002 003,4', 'fr');
    ok(success === 1002003.4 , "localeStringToNumber('1 002 003 4', 'fr') -->1002003.4" );//60  
    success = FL.common.localeStringToNumber('1.002.003', 'de');
    ok(success === 1002003 , "localeStringToNumber('1.002.003', 'de') -->1002003" );//61  
    success = FL.common.localeStringToNumber('1 002 003', 'fr');
    ok(success === 1002003 , "localeStringToNumber('1 002 003', 'fr') -->1002003" );//62 
    success = FL.common.localeStringToNumber('-1 002 003,4', 'fr');
    ok(success === -1002003.4 , "localeStringToNumber('-1 002 003,4', 'fr') -->1002003.4" );//63
    //extreme values
    success = FL.common.localeStringToNumber(3.8, 'us');
    ok(success === 3.8, "localeStringToNumber(3.8, 'us') -->3.8" );//64
    success = FL.common.localeStringToNumber('3.8', 'xx');
    ok(success === 3.8, "localeStringToNumber('3.8', 'xx') -->3.8" );//65
    success = FL.common.localeStringToNumber('3,8', 'xx');
    ok(success === 0, "localeStringToNumber('3,8', 'xx') -->0" );//66
    success = FL.common.localeStringToNumber('3.8,23.3', 'us');
    ok(success === 0, "localeStringToNumber('3.8,23.3', 'us')) -->0" );//67

    arrOfRowValues = [
           "-4294",
           "1,000,102",//us
           "1.000,3",
           "0.324",//is already in a valid format
           "-27"
    ];
    success = FL.common.convertStringVectorToNumber(arrOfRowValues, 'de');
    var okResult = [-4294,0,1000.3,0.324,-27];
    ok(JSON.stringify(success) === JSON.stringify(okResult), "convertStringVectorToNumber(arrOfRowValues, 'de') -->ok" );//68

    arrOfRowValues = [
           "-4294",
           "1 000 102",
           "1 000,3",
           "0,324",
           "-27"
    ];
    success = FL.common.convertStringVectorToNumber(arrOfRowValues, 'fr');
    okResult = [-4294,1000102,1000.3,0.324,-27];
    
    ok(JSON.stringify(success) === JSON.stringify(okResult), "convertStringVectorToNumber(arrOfRowValues, 'fr') -->ok for format mismatch" );//69
 
    success = FL.common.convertStringVectorToNumber(arrOfRowValues, 'de');
    okResult = [-4294,0,0,0.324,-27];
    ok(JSON.stringify(success) === JSON.stringify(okResult), "convertStringVectorToNumber(arrOfRowValues, 'de') -->ok for format mismatch" );//70

    success = FL.common.convertStringVectorToNumber(arrOfRowValues, 'us');
    okResult = [-4294,0,0,324,-27];
    ok(JSON.stringify(success) === JSON.stringify(okResult), "convertStringVectorToNumber(arrOfRowValues, 'us') -->ok for format mismatch" );//71
    arrOfRowValues = [
           "-4294",
           "1.a00.102",
           "1.000,3",
           "0,324",
           "-27"
    ];
    success = FL.common.convertStringVectorToNumber(arrOfRowValues, 'de');
    okResult = [-4294,0,1000.3,0.324,-27];
    ok(JSON.stringify(success) === JSON.stringify(okResult), "convertStringVectorToNumber(arrOfRowValues, 'de') -->ok for 'a' among numbers" );//72



  });
  test("client Dictionary tests", function () { //one test can have several assertions
    //client
    var success = FL.dd.createEntity("client","company we may invoice");
    ok(success === true , "createEntity operation successfull for first entity !" );
    actual = FL.dd.entities["client"];
    ok(actual.csingular == "2ls", "Compressed code for first entity = '2ls'");//first entity is 9999 + 1
    ok(actual.description == "company we may invoice", "description is correct");
    ok(actual.plural == "clients", "plural is clients");
    success = FL.dd.createEntity("client","another company we may invoice");
    ok(success === false , "createEntity refused because client exists already !" );

    //order
    success = FL.dd.createEntity("order","client's product request");
    ok(success === true , "createEntity operation successfull for 2nd entity !" );
    actual = FL.dd.entities["order"];
    ok(actual.csingular == "2lS", "Compressed code for 2nd entity = '2lS'");
    ok(actual.description == "client's product request", "description is correct for 2nd entity");
    ok(actual.plural == "orders", "plural is orders");

    // updateEntityBySingular - updates the server dictionary !!!! - it needs a working connection
    //success = FL.dd.updateEntityBySingular("client",{plural:"customers",description:"frequent buyer"});
    //ok(success === true , "updateEntityBySingular operation successfull for client" );//10

    actual = FL.dd.entities["client"];
    ok(actual.csingular == "2ls", "Compressed code for first entity = '2ls'");
    // ok(actual.description == "frequent buyer", "description was updated correctely");
    // ok(actual.plural == "customers", "plural has changed to customers");

    // updateEntityBySingular - updates the server dictionary !!!! - it needs a working connection
    // success = FL.dd.updateEntityBySingular("client",{singular:"customer", plural:"customers",description:"frequent buyer"});
    // actual = FL.dd.entities["customer"];
    // ok(success === true && actual.singular == "customer", "updateEntityBySingular SUCCESS changing entity singular FROM client TO customer" );//14

    // success = FL.dd.updateEntityBySingular("customer",{singular:"client", plural:"customers",description:"frequent buyer"});
    // actual = FL.dd.entities["client"];
    // ok(success === true && actual.singular == "client" , "updateEntityBySingular SUCCESS changing entity singular FROM customer TO client" );//15

    success = FL.dd.updateEntityByCName("2ls",{plural:"clients",description:"very frequent buyer"});
    ok(success === true , "updateEntityByCName operation successfull for client" );
    actual = FL.dd.entities["client"];
    ok(actual.csingular == "2ls", "Compressed code for first entity = '2ls'");
    ok(actual.description == "very frequent buyer", "description was updated correctely");
    ok(actual.plural == "clients", "plural has changed back to clients");

    var entityCN = FL.dd.getCEntity("order");
    ok(entityCN == "2lS", "FL.dd.getCEntity ->Compressed code for 'order' is = '2lS'");
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
    ok(actual === "patolinas", "nextEntityBeginningBy('patolinas') is 'patolinas'");//27
    
    actual = FL.dd.getEntityBySingular("order").sync;
    ok(actual === false, "order sync status is:'not synchronized'");//28
    FL.dd.setSync("order",true);
    actual = FL.dd.getEntityBySingular("order").sync;
    ok(actual === true, "FL.dd.setSync-->order sync status is now:'synchronized'");//29
    FL.dd.setSync("order",false);
    actual = FL.dd.getEntityBySingular("order").sync;
    ok(actual === false, "FL.dd.setSync-->order sync status is again:'not synchronized'");//30

    actual = FL.dd.getFieldCompressedName("order","id");
    ok(actual === "00", "FL.dd.getFieldCompressedName -->compressed name for id='00'");//31
    actual = FL.dd.getFieldCompressedName("order","shipped");
    ok(actual === "01", "FL.dd.getFieldCompressedName -->compressed name for shipped='01'");//32

    FL.dd.addAttribute("order","product","unique order item","product","string","textbox",null);
    actual = FL.dd.getFieldCompressedName("order","product");
    ok(actual === "02", "FL.dd.getFieldCompressedName -->compressed name is '02'");//33


    FL.common.printToConsole("%%%%%%%%%%%%%% begin %%%%%%%%%%%%%%%%%%%%%%%%");
    FL.dd.displayEntities();

    // FL.dd.updateAttribute('order','shipped',{type:'date',typeUI:'datebox'});//change type and typeUI for attribute "shipped" - previously type="boolean" typeUI="checkbox"
    // actual = FL.dd.getEntityAttribute("order","shipped");
    // ok(actual.type == "date" && actual.typeUI == "datebox", "FL.dd.updateAttribute('order','shipped',{type:'date',typeUI:'datebox'}) -->update done!");//34

    // FL.dd.updateAttribute('order','shipped',{type:'boolean',typeUI:'checkbox'});//change type and typeUI for attribute "shipped" - previously type="boolean" typeUI="checkbox"
    // actual = FL.dd.getEntityAttribute("order","shipped");
    // FL.common.printToConsole(JSON.stringify(actual));
    // ok(actual.type == "boolean" && actual.typeUI == "checkbox", "FL.dd.updateAttribute('order','shipped',{type:'boolean',typeUI:'checkbox'}) -->update done!");//35

    // FL.dd.updateAttribute('order','shipped',{name:'sent',label:'Sent'});//change type and typeUI for attribute "shipped" - previously type="boolean" typeUI="checkbox"
    // actual = FL.dd.getEntityAttribute("order","sent");
    // FL.common.printToConsole(JSON.stringify(actual));
    // ok(actual.name == "sent" && actual.label == "Sent", "FL.dd.updateAttribute('order','shipped',{name:'sent',label:'Sent'}) -->update done!");//36

    // FL.dd.updateAttribute('order','sent',{name:'shipped',label:'Shipped'});//change type and typeUI for attribute "shipped" - previously type="boolean" typeUI="checkbox"
    // actual = FL.dd.getEntityAttribute("order","shipped");
    // FL.common.printToConsole(JSON.stringify(actual));
    // ok(actual.name == "shipped" && actual.label == "Shipped", "FL.dd.updateAttribute('order','sent',{name:'shipped',label:'Shipped'}) -->update done!");//37

    // FL.dd.displayEntities();


    //addRelation: function(xSingular,rCN,withEntityName,verb,cardinality,side,storedHere) {//adds a new relation to the array of relations of entity xSingular
    FL.dd.createEntity("sales_rep","employee responsable for sales");
    // FL.dd.addAttribute(xSingular,xAttribute,xDescription,xLabel,xType,xTypeUI,arrEnumerable);
    FL.dd.addAttribute("sales_rep","name","sales_rep's name","Rep Name","string","textbox",null);
    FL.dd.addAttribute("sales_rep","phone","sales_rep's phone","Rep Phone","number","numberbox",null);
    FL.dd.addAttribute("sales_rep","eMail","sales_rep's eMail","Rep eMail","string","emailbox",null);

    FL.dd.upsertAttribute("client","pointer to sales Rep",{
      label:"sales rep",
      typeUI:"lookupbox",
      specialTypeDef:"2lT" //for lookup this means the compressed name of the foreigner table
    });
    FL.dd.displayEntities();
    
    //------------ test FL.dd.t.xxx 
    FL.dd.init_t();
    var listAll = FL.dd.t.entities.list();
    var list = [];
    _.each(listAll,function(element){list.push(element.singular)});
    //assert.deepEqual( obj, { foo: "bar" }, "Two objects can be the same in value" );
    QUnit.inArray(list, ["order","client","client1","sales_rep"], 'FL.dd.t.entities.list() returned singular '+JSON.stringify(list) + " -------------------------------------------------------------------------------------------------------------------------------------- FL.dd.t.entities.list() ");
    // ok(list == "12345.67" , "FL.common.currencyToStringNumber('"+xVar+"') -->radixpoint=','-->"+result+"'" );//67
    list = [];
    _.each(listAll,function(element){list.push(element.csingular)});
    QUnit.inArray(list, ["2lS","2ls","2lt","2lT"], 'FL.dd.t.entities.list() returned csingular '+JSON.stringify(list) );
    ok(FL.dd.t.entities["2ls"].singular == "client" , "FL.dd.t.entities['2ls'].singular == 'client'");
    xVar = FL.dd.t.entities["2ls"].plural;
    ok(FL.dd.t.entities["2ls"].plural == "clients" , "FL.dd.t.entities['2ls'].plural == 'clients'");
    ok(FL.dd.t.entities["2ls"].csingular == "2ls" , "FL.dd.t.entities['2ls'].csingular == '2ls'");
    ok(FL.dd.t.entities["2ls"].description == "very frequent buyer" , "FL.dd.t.entities['2ls'].description == 'very frequent buyer'");

    FL.dd.t.entities["2ls"].set({description:"company we may invoice"})
    ok(FL.dd.t.entities["2ls"].description == "company we may invoice" , "FL.dd.t.entities['2ls'].set({description:'company we may invoice'})");
      //alert("JujuXXYY");


    FL.dd.addRelation("client","order","has","N",0,true,"En");//
    FL.dd.addRelation("client","sales_rep","is managed by ","1",0,true,"En");
    FL.dd.addRelation("sales_rep","client","is responsable by complaints of ","N",0,true,"En");


    FL.common.printToConsole("------- after ---------------");
    FL.dd.displayEntities();
    actual = FL.dd.relationsOf("sales_rep");
    ok(actual[0].rCN === "02", "first relation from FL.dd.relationsOf('sales_rep') has rCN=='02'"+ " -------------------------------------------------------------------------------------------------------------------------------------- FL.dd.relationsOf() ");
    ok(actual[0].semantic === "sales_rep manages many clients", "first relation from FL.dd.relationsOf('sales_rep') has semantic 'sales_rep manages many clients'");//33
    ok(actual[1].rCN === "03", "first relation from FL.dd.relationsOf('sales_rep') has rCN=='03'");//34
    ok(actual[1].semantic === "sales_rep is responsable by complaints of  many clients", "first relation from FL.dd.relationsOf('sales_rep') has semantic 'sales_rep is responsable by complaints of  many clients'");//35
    FL.common.printToConsole("relations ="+JSON.stringify(actual));

    actual = FL.dd.relationsOf("client");
    ok(actual[0].rCN === "01", "first relation from FL.dd.relationsOf('client') has rCN=='01'");//36+4
    ok(actual[0].semantic === "client has many orders", "first relation from FL.dd.relationsOf('client') has semantic 'client has many orders'");//37
    FL.common.printToConsole("relations="+JSON.stringify(actual));

    actual = FL.dd.relationsOf("order");
    FL.common.printToConsole("relations="+JSON.stringify(actual));

    ok(actual[0].rCN === "01", "first relation from FL.dd.relationsOf('order') has rCN=='01'");//36
    ok(actual[0].semantic === "order is referred by one and only one client", "first relation from FL.dd.relationsOf('order') has semantic 'order is referred by one and only one client'");//37


    FL.common.printToConsole("%%%%%%%%%%%%%%% end %%%%%%%%%%%%%%%%%%%%%%%%");
    //FL.API.customTable({singular:"shipment"});
    //FL.common.printToConsole("********************************************name**************>"+FL.API.data.shipment.name);
    //FL.common.printToConsole("********************************************descrption**************>"+FL.API.data.shipment.description);
    //FL.common.printToConsole("********************************************eCN**************>"+FL.API.data.shipment.eCN);
    //FL.common.printToConsole("**********************************************************>"+FL.API.data.shipment.get("singular"));
    //FL.common.printToConsole("**********************************************************>"+FL.API.data.shipment.get("csingular"));
    //FL.common.printToConsole("**********************************************************>"+FL.API.data.shipment.get("plural"));
    //FL.common.printToConsole("**********************************************************>"+FL.API.data.shipment.get("description"));
    //FL.common.printToConsole("**********************************************************>"+FL.API.data.shipment.get("sync"));
    //// // FL.API.data.shipment.tfunc();
    //FL.API.data.shipment.set("description","place to send merchandise");
    //FL.common.printToConsole("***************after set*******************************************>"+FL.API.data.shipment.get("description"));
    // var records=[{"name":"Joao","phone":"123"},{"name":"Anton","phone":"456"}];
    // FL.API.saveTable("sales_rep",records);
    // FL.common.printToConsole("*********************************after saveTable*******************************************");

    actual = FL.dd.isEntityInLocalDictionary("order");
    ok(actual === true, "FL.dd.isEntityInLocalDictionary -->'order' exists in local dictionary.");//45
    actual = FL.dd.isEntityInLocalDictionary("orderz");
    ok(actual === false, "FL.dd.isEntityInLocalDictionary -->'orderz' does not exists in local dictionary.");//47
    
    actual = FL.dd.getEntityByCName("2lS");
    ok(actual == "order", "FL.dd.getEntityByCName --> returns 'order' for entity compressed name = '2lS'");//48
    actual = FL.dd.getEntityByCName("0A");
    ok(actual === null, "FL.dd.getEntityByCName --> returns null for entity compressed name = '0A'");//49
    // FL.dd.displayEntities();
    actual = FL.dd.getEntityByCName("2ls");
    ok(actual === "client", "FL.dd.getEntityByCName --> returns 'client' for entity compressed name = '2ls'");//50

    //now testing relations functions
    actual = FL.dd.isRelation("client","01");
    ok(actual === false, "FL.dd.isRelation --> relation compressed name '01' does not exist");//51

    //now testing is functions
    actual = FL.dd.isEntityInLocalDictionary("client");
    ok(actual === true, "FL.dd.isEntityInLocalDictionary --> entity client exists in local dictionary");//52
    actual = FL.dd.isEntityInLocalDictionary("clientx");
    ok(actual === false, "FL.dd.isEntityInLocalDictionary --> entity clientx does not exist in local dictionary");//53
    actual = FL.dd.isEntityWithTypeUI("sales_rep","emailbox");
    ok(actual === true, "FL.dd.isEntityWithTypeUI --> in sales_rep exists an email field - typeUI='emailbox'");//54
    actual = FL.dd.isEntityWithTypeUI("client","emailbox");
    ok(actual === false, "FL.dd.isEntityWithTypeUI --> in client does not exist an email field - typeUI='emailbox'");//55
    actual = FL.dd.isEntityWithTypeUI("sales_rep","phonebox");
    ok(actual === false, "FL.dd.isEntityWithTypeUI --> in sales_rep does not exist a phone field - typeUI='phonebox'");//56
    FL.dd.setFieldTypeUI("sales_rep","phone","phonebox");
    actual = FL.dd.isEntityWithTypeUI("sales_rep","phonebox");
    ok(actual === true, "FL.dd.isEntityWithTypeUI --> Now after FL.dd.setFieldTypeUI sales_rep has a phone field - typeUI='phonebox'");//57
    
    //FL.common.printToConsole("====================================================================================");
    //FL.common.printToConsole("histoMailPeer for sales_rep is "+FL.dd.histoMailPeer("histoMail","sales_rep"));
    //FL.common.printToConsole("====================================================================================");
    //actual = FL.dd.isHistoMailPeer("sales_rep");
    //ok(actual === false, "FL.dd.isHistoMailPeer --> sales_rep has no " + FL.dd.histoMailPeer("sales_rep") + " =>'_histoMail_<eCN>' peer table");//58

    //FL.dd.createHistoMailPeer("sales_rep");
    //actual = FL.dd.isHistoMailPeer("sales_rep");
    //ok(actual === true, "FL.dd.isHistoMailPeer -->after createHistoMailPeer, sales_rep has " + FL.dd.histoMailPeer("sales_rep") + " =>'_histoMail_<eCN>' peer table !");//59
    //
    //FL.dd.removeHistoMailPeer("sales_rep");
    //actual = FL.dd.isHistoMailPeer("sales_rep");
    //ok(actual === false, "FL.dd.isHistoMailPeer -->after removeHistoMailPeer, sales_rep has no " + FL.dd.histoMailPeer("sales_rep") + " =>'_histoMail_<eCN>' peer table !");//60

    //creates peer
  
    // FL.dd.addRelation("client","01","order","orders","N");//(xSingular,rCN,withEntityName,verb,cardinality,side,storedHere)
    // obj = FL.dd.entities["client"].relations[0];
    // deepEqual( obj, {"rCN":"01","withEntity":"order","verb":"orders","cardinality":"N","semantic":"client orders many orders","side":null,"storedHere":null,"withEntityCN":null},"FL.dd.addRelation --> added relation client to order ");//38

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
    FL.grid.csvToStore(rowsArr);//id is injected here...
    FL.common.printToConsole("---->csvStore.csvRows="+JSON.stringify(csvStore.csvRows));

    //var obj = FL.server.preparePutRowFromCsvStoreById("order",1);
    //FL.common.printToConsole("---->preparePutRowFromCsvStoreById="+JSON.stringify(obj));
    //deepEqual( obj, {d:{ "00":1,"01":true,"02":"Super 1" },r:[]}, "FL.server.preparePutRowFromCsvStoreById correct for id=1" );//61
    //obj = FL.server.preparePutRowFromCsvStoreById("order",3);
    //FL.common.printToConsole("---->preparePutRowFromCsvStoreById="+JSON.stringify(obj));
    //deepEqual( obj, {d:{ "00":3,"01":false,"02":"Super 3" },r:[]}, "FL.server.getSavingObjFromCsvStoreById correct for id=3" );//62
    //arrOfObj = FL.server.preparePutAllCsvStore("order");
    //FL.common.printToConsole("---->preparePutAllCsvStore="+JSON.stringify(arrOfObj));
    
    //now we force compressed names to match those in server 
    //FL.common.printToConsole("before setFieldCompressedName ");
    //FL.dd.displayEntities();
    //FL.dd.setFieldCompressedName("order","id","62");
    //FL.dd.setFieldCompressedName("order","shipped","63");
    //FL.dd.setFieldCompressedName("order","product","64");
    //FL.common.printToConsole("after setFieldCompressedName ");
    //FL.dd.displayEntities();
    //
    //
    //csvStore.csvRows = {};
    //FL.dd.setSync("order",true);//force sync
    //FL.common.printToConsole("test 0  convertToCsvStore csvStore.csvRows ="+JSON.stringify(csvStore.csvRows));
    //// var simulObjFromServer = _.map(arrOfObj,function(element){return element.d;});
    //var simulObjFromServer = arrOfObj;
    //FL.common.printToConsole("test 1 convertArrC2LForEntity ---->before function: simulObjFromServer="+JSON.stringify(simulObjFromServer));
    //var csvStoreArray = FL.server.convertArrC2LForEntity("order",simulObjFromServer);
    ////FL.server.loadCsvStoreFromEntity("order");
    //FL.common.printToConsole("test 2  convertArrC2LForEntity csvStoreArray ="+JSON.stringify(csvStoreArray));
    //
    //FL.server.offline = false;
    var oEntity =  FL.dd.getEntityBySingular("order");
    oEntity.csingular = "61";//we force entity compressed name for test
    FL.dd.displayEntities();

    actual = FL.dd.isEntityInLocalDictionaryByCN('2lu');
    ok(actual === true, "FL.dd.isEntityInLocalDictionaryByCN('2lu') =>true (exists!)" );//59

    actual = FL.dd.isEntityInLocalDictionaryByCN('2lx');
    ok(actual === false, "FL.dd.isEntityInLocalDictionaryByCN('2lx') =>false (does not exists!)" );//60

    actual = FL.dd.isEntityByCNInSync('2lu');
    ok(actual === false, "FL.dd.isEntityByCNInSync('2lu') =>false (it is not in sync)" );//61

    actual = FL.dd.isEntityByCNInSync('2lu');
    ok(actual === false, "FL.dd.isEntityByCNInSync('2lu') =>false (it is not in sync)" );//61

    var entityName = FL.dd.getEntityByCName('2lu');
    FL.dd.setSync(entityName,true);//forces sync
    actual = FL.dd.isEntityByCNInSync('2lu');
    ok(actual === true, "FL.dd.isEntityByCNInSync('2lu') =>true (it is in sync)" );//62
    
    actual = FL.dd.isEntityByCNInSync('2lx');
    ok(actual === false, "FL.dd.isEntityByCNInSync('2lx') =>false (ask if a non existing entity is in sync returns false)" );//63

    var oEntity = FL.dd.entities["order"];
    var oAttribute = FL.dd.getEntityAttribute("order","shipped");//to introduce enumerable in order.shipped
    oAttribute.enumerable = ["on hold","ready","shipped","arrived"];
    var backup = FL.dd.getDictEntityBackup("order");
    // assert.deepEqual( oEntity, backup, "The backup is a perfect copy of 'order' entity" );
    ok( oEntity.attributes[1].enumerable[0] === backup.attributes[1].enumerable[0], "The backup is a perfect copy of 'order' entity" );
    // now he change the enumerable of one of the attributes of "order"
    oAttribute.enumerable[0] = "xxx";
    // assert.notDeepEqual( oEntity, backup, "after changing the dictionary the backup is not changed" );
    ok( oEntity.attributes[1].enumerable[0] != backup.attributes[1].enumerable[0],  "after changing the dictionary the backup is not changed" );
    FL.dd.displayEntities();



    //we need to force field compressed names for test

    // FL.server.connect("Joao","oLiVeIrA",function(err){//TEST loadCsvStoreFromEntity
    //     // ok(err === true, "Good connection");
    //     if(err){
    //       if(err.status != "offline")
    //         FL.common.printToConsole("Connection Error !!!"+err);
    //     }else{
    //       FL.common.printToConsole("Good connection--> begin loadCsvStoreFromEntity(entity)-------------------");
    //       FL.server.loadCsvStoreFromEntity("order",function(err){//all csvStore will be stored in server as "order" content
    //           FL.common.printToConsole("loadCsvStoreFromEntity is done !!! Error:"+err);
    //           FL.server.disconnect();
    //           FL.common.printToConsole("show csvStore="+JSON.stringify(csvStore.csvRows));
    //       });
    //     }
    // });


  });
});