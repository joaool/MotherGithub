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
        ok(actual == expected, "Validated !!!"); //bolean expression
        equal(actual, expected, "...are equal");//non strict assertion
        strictEqual(1, 1, "they are strictly equal");//non strict assertion
        // deepEqual(item1,item2,"all the elements in the array are equal"); /recursively vompares array elements and objects
        actual = FL.common.stringAfterLast('http://www.framelink.co/app?d=myDomain1', '=');
        ok(actual == "myDomain1", "FL.common.stringAfterLast('http://www.framelink.co/app?d=myDomain1','=') -> 'myDomain'");//4
        actual = FL.common.stringAfterLast('test phrase: my name is john', 'phrase:');
        ok(actual == " my name is john", "FL.common.stringAfterLast('test phrase: my name is john','phrase:') -> ' my name is john'");//5

        actual = FL.common.stringBeforeLast('test->phrase: my name is john', 'phrase:');
        ok(actual == "test->", "FL.common.stringBeforeLast('test->phrase: my name is john','phrase:') -> 'test->'");//6
        actual = FL.common.stringBeforeLast('this is (one) or (two) values', '(');
        ok(actual == "this is (one) or ", "FL.common.stringBeforeLast('this is (one) or (two) values','(' -> 'this is (one) or '");//7
        actual = FL.common.getLastTagInString(actual, '(', ')');
        ok(actual == "one", "FL.common.getLastTagInString extracted 'one' from 'this is (one) or (two) values' after extracting stringBeforeLast");//8


        //ex. FL.common.stringBeforeLast("this is (one) or (two) values","(") -->returns  "this is (one) or "


        actual = FL.common.getLastTagInString('http://www.framelink.co/app?d=myDomain1#', '=', '#'); //(str,separator,tagTerminator)
        ok(actual == "myDomain1", "FL.common.getLastTagInString('http://www.framelink.co/app?d=myDomain1','=','#') -> 'myDomain1'");//9
        actual = FL.common.getLastTagInString('test phrase: my name is john/ the phrase is over', 'phrase:', '/');
        ok(actual == " my name is john", "FL.common.getLastTagInString('test phrase: my name is john/ the phrase is over','phrase:','/') -> ' my name is john'");//10
        actual = FL.common.getLastTagInString('http://abc.com#myDomain1@abc', '#', '#@/'); //(str,separator,tagTerminator)
        ok(actual == "myDomain1", " FL.common.getLastTagInString('http://abc.com#myDomain1@abc','#','#@/') -> 'myDomain1'");//11
        actual = FL.common.getLastTagInString('http://abc.com#myDomain1/abc/', '#', '*z/@'); //(str,separator,setOfTagTerminators)
        ok(actual == "myDomain1", " FL.common.getLastTagInString('http://abc.com#myDomain1/abc/','#','*z/@') -> 'myDomain1'");//12
        actual = FL.common.getLastTagInString('http://abc.com#myDomain1@abc', '@', '#@/'); //(str,separator,tagTerminator)
        ok(actual == "abc", " FL.common.getLastTagInString('http://abc.com#myDomain1@abc','@','#@/') -> 'abc'");//13

        actual = FL.common.getLastTagInString('http://abc.com#myDomain1/abc', '#', '#@/'); //(str,separator,tagTerminator)
        ok(actual == "myDomain1", " FL.common.getLastTagInString('http://abc.com#myDomain1/abc','#','#@/') -> 'myDomain1'");//14

        actual = FL.common.getLastTagInString('the brown(fox) jumped the fence', '(', ')'); //(str,separator,tagTerminator)
        ok(actual == "fox", " FL.common.getLastTagInString('the brown(fox) jumped the fence','(',')') -> 'fox'");//15
        actual = FL.common.getLastTagInString('the brown(fox) and the white(rabbit) jumped the fence', '(', ')'); //(str,separator,tagTerminator)
        ok(actual == "rabbit", " FL.common.getLastTagInString('the brown(fox) and the white(rabbit) jumped the fence','(',')') -> 'rabbit'");//16

        // FL.common.printToConsole("<--------------test------------>");
        actual = FL.common.getLastTagInString('the brown*fox* is there', '(', ')'); //(str,separator,tagTerminator)
        ok(actual === null, " FL.common.getLastTagInString('the brown*fox* is there','(',')') -> null");//17
    });
    test("FL.menu primitives", function () { //one test can have several assertions
        var oMenu = {
            "menu": [
                {
                    "title": "MenuA/T1",//0
                    "uri": "http://www.microsoft.com"
                },
                {
                    "title": "MenuB/T1",//1
                    "uri": "#",
                    "menu": [
                        {
                            "title": "MenuB/T2-I",//2
                            "uri": "#1"
                        },
                        {
                            "title": "MenuB/T2-II",//3 Joachim
                            "uri": "#"
                        }
                    ]
                },
                {
                    "title": "MenuC/T1",//4
                    "uri": "#"
                }
            ]
        };
        var actual = '1';
        var expected = 1;
        ok(actual == expected, "Validated !!!"); //1
        var car1 = FL.menu.createCar("Fiat", "1990");
        ok(car1.model == "Fiat", "car is Fiat Validated !!!");//2
        ok(car1.phrase() == "Fiat of 1990", "phrase function Validated !!!");//3
        //var myMenu1 = FL.menu.createMenu({jsonMenu: oMenu, initialMenu: "_home", editable: false});

        //ok(myMenu1.jsonMenu.menu[1].title == "MenuB/T1", "Getting menu title 'MenuB/T1' (at root)");//4
        //ok(myMenu1.jsonMenu.menu[1].menu[1].title == "MenuB/T2-II", "Getting menu title 'MenuB/T2-II' at second level");//5
        //myMenu1.jsonMenu.menu[1].menu[1].title = "Joachim";
        //ok(myMenu1.jsonMenu.menu[1].menu[1].title == "Joachim", "Setting menu 'MenuB/T2-II' to 'Joachim'");//6
        //myMenu1.test_Add_Id_Top();
        //ok(myMenu1.jsonMenu.menu[1].menu[1].id == 3, "testAdd_Id_Top placed id=3 in menu 'Joachim'");//7
        //ok(myMenu1.jsonMenu.menu[2].id == 4, "testAdd_Id_Top placed id=4 in last menu");//8
        //ok(myMenu1.jsonMenu.menu[1].menu[1].top === false, "testAdd_Id_Top placed top = false in menu 'Joachim'");//9
        //ok(myMenu1.jsonMenu.menu[2].top === true, "testAdd_Id_Top placed top = true in last menu");//10
        //var oEl = myMenu1.test_menuFindById(4);//previous myMenu1.test_menuFindById(oMenu.menu,4);
        //deepEqual(myMenu1.jsonMenu.menu[2], oEl, "menuFindById() got last menu element");//11
        //oEl = myMenu1.test_menuFindById(3);
        //deepEqual(myMenu1.jsonMenu.menu[1].menu[1], oEl, "menuFindById() got menu element 'Joachim'");//12
        //oEl = myMenu1.test_menuFindById(0);
        //deepEqual(myMenu1.jsonMenu.menu[0], oEl, "menuFindById(0) got first menu element");//13
        //oEl = myMenu1.test_menuFindById(10);
        //ok(oEl === null, "menuFindById(10) returned null because Id=10 does not exist");//14
        //oMenu = {
        //    "menu": [
        //        {
        //            "title": "MenuA/T1",//0
        //            "uri": "http://www.microsoft.com"
        //        },
        //        {
        //            "title": "MenuB/T1",//4
        //            "uri": "#"
        //        }
        //    ]
        //};
        //myMenu1 = FL.menu.createMenu({jsonMenu:oMenu,initialMenu:"_home",editable:false});
        //oEl = myMenu1.test_menuFindById(0);
        //deepEqual(myMenu1.jsonMenu.menu[0],oEl,"menuFindById(0) got first menu element in the case of 2 flat elements");//15
        //oEl = myMenu1.test_menuFindById("1");//same result for 1 or "1"
        //deepEqual(myMenu1.jsonMenu.menu[1],oEl,"menuFindById(1) got first menu element in the case of 2 flat elements");//16
    });
    test("FL.menu DOM editable=false", function () {
        var oMenu = {
            "menu": [
                {
                    "title": "MenuA/T1",//0
                    "uri": "http://www.microsoft.com"
                },
                {
                    "title": "MenuB/T1",//1
                    "uri": "#",
                    "menu": [
                        {
                            "title": "MenuB/T2-I",//2
                            "uri": "_home"
                        },
                        {
                            "title": "MenuB/T2-II",//3
                            "uri": "#"
                        }
                    ]
                },
                {
                    "title": "MenuC/T1",//4
                    "uri": "_mission"
                }
            ]
        };
        var actual = '1';
        var expected = 1;
        ok(actual == expected, "Validated !!!"); //bolean expression
        // ---- example for DOM testing --------------------------------------
        $('<input id="ResultTestBox" type="text"/>').appendTo('#qunit-fixture');//#qunit-fixture is the invisible DOM sandbox
        var add = function (a, b) {
            var result = a + b;
            $("input#ResultTestBox").val(result);
        };
        var result = add(2, 3);
        equal(5, $('input#ResultTestBox').val(), "DOM Dummy test -> testing result box value");
        // -----------------------------------------------------------------------
        // $('<ul id="begin_menu" class="nav navbar-nav"></ul>').appendTo('#qunit-fixture');//necessary for menuRefresh()
        $('<div id="menuContainer"><div id="toolbar"><ul id="main-menu"></ul><div></div>').appendTo('#qunit-fixture');//necessary for menuRefresh() and
        $('<div id="_placeHolder"></div>').appendTo('#qunit-fixture');//necessary for menuRefresh()
        //var myMenu1 = FL.menu.createMenu({jsonMenu:oMenu,initialMenu:"_home",editable:false});
        //myMenu1.menuRefresh([//receives a menu array and displays it. If empty assumes settings.jsonMenu.menu
        //           {
        //               "title" : "MenuA/T1",//0
        //               "uri":"http://www.microsoft.com"
        //           },
        //           {
        //               "title" : "MenuB/T1",//1
        //               "uri" : "#",
        //               "menu" : [
        //                   {
        //                       "title" : "MenuB/T2-I",//2
        //                       "uri":"_home"
        //                   }
        //               ]
        //           },
        //           {
        //               "title" : "MenuC/T1",//3
        //               "uri":"#"
        //           }
        //       ]);
        //       equal("MenuA/T1", $('#0').text(), "menuRefresh() with argument ->title 'MenuA/T1' was placed in DOM id=0");
        //       equal("MenuB/T2-I", $('#2').text(), "menuRefresh() title with argument ->'MenuA/T1' was placed in DOM id=2");
        //       myMenu1.menuRefresh();
        //       equal("MenuB/T2-II", $('#3').text(), "menuRefresh() no args ->title 'MenuB/T2-II' is on DOM id=3");
        //       equal("MenuC/T1", $('#4').text(), "menuRefresh() no args ->title 'MenuC/T1' is on DOM id=4");
        //       // -----------------------------------------------------------------------
    });
    test("FL.menu DOM editable=true", function () {
        var oMenu = {
            "menu": [
                {
                    "title": "MenuA/T1",//0
                    "uri": "http://www.microsoft.com"
                },
                {
                    "title": "MenuB/T1",//1
                    "uri": "#",
                    "menu": [
                        {
                            "title": "MenuB/T2-I",//2
                            "uri": "_home"
                        },
                        {
                            "title": "MenuB/T2-II",//3
                            "uri": "#"
                        }
                    ]
                },
                {
                    "title": "MenuC/T1",//4
                    "uri": "_mission"
                }
            ]
        };
        var actual = '1';
        var expected = 1;
        ok(actual == expected, "Validated !!!"); //bolean expression
        $('<div id="menuContainer"><ul id="main-menu"></ul></div>').appendTo('#qunit-fixture');
        //var myMenu1 = FL.menu.createMenu({jsonMenu:oMenu,initialMenu:"_home",editable:true});
        //var $itemClicked = $( "#toolbar" );
        //FL.common.printToConsole("before click myMenu1.is_menuHide="+myMenu1.is_menuHide);
        //FL.common.printToConsole("before click myMenu1.is_contextOn="+myMenu1.is_contextOn);
        //
        //$itemClicked.trigger( {type:"mousedown",which:3} );//the same as pressing the right mouse on toolbar OK !!!
        //FL.common.printToConsole("after click myMenu1.is_menuHide="+myMenu1.is_menuHide);
        //FL.common.printToConsole("after click myMenu1.is_contextOn="+myMenu1.is_contextOn);
        //equal(true, myMenu1.is_menuHide, "right click in toolbar => myMenu1.is_menuHide=true ");
        //equal(false, myMenu1.is_contextOn, "right click in toolbar => myMenu1.is_contextOn=false ");
        //$itemClicked.trigger( {type:"mousedown",which:2} );//the same as pressing the right mouse on toolbar OK !!!
        ///*
        // // -----------------------------------------------------------------------
        // // $('<ul id="begin_menu" class="nav navbar-nav"></ul>').appendTo('#qunit-fixture');//necessary for menuRefresh()
        // $('<div id="menuContainer"><ul id="main-menu"></ul></div>').appendTo('#qunit-fixture');//necessary for menuRefresh() and
        // var myMenu1 = new FL.menu({jsonMenu:oMenu,initialMenu:"_home",editable:true});
        // // alert("--->"+$('#0').text());
        // var $itemClicked = $( "#toolbar" );
        // // alert("for #2 $itemClicked.length=" + $itemClicked.length + " -->"+ $itemClicked.text());
        //
        // $itemClicked.trigger( {type:"mousedown",which:3} );//the same as pressing the right mouse on toolbar OK !!!
        // // alert("is_menuHide="+myMenu1.is_menuHide+" is_contextOn="+myMenu1.is_contextOn);
        // equal(true, myMenu1.is_menuHide, "right click in toolbar => myMenu1.is_menuHide=true ");
        //
        // equal(false, myMenu1.is_contextOn, "right click in toolbar => myMenu1.is_contextOn=false ");
        // $itemClicked = $( "#2" );
        // $itemClicked.trigger( {type:"mousedown",which:3} );//the same as pressing the right mouse on id=2 a 2nd level menu !!!
        // // alert("is_menuHide="+myMenu1.is_menuHide+" is_contextOn="+myMenu1.is_contextOn);
        // */
    });
    test("type tests in FL.common", function () {

        //typeOf
        var xVar = "abc";
        var success = FL.common.typeOf(xVar);
        ok(success == "string", "FL.common.typeOf('abc') -->'string'");//1
        xVar = 123;
        success = FL.common.typeOf(xVar);
        ok(success == "number", "FL.common.typeOf(123) -->'number'");//2
        xVar = true;
        success = FL.common.typeOf(xVar);
        ok(success == "boolean", "FL.common.typeOf(true) -->'boolean'");//3
        xVar = {key1: "abc"};
        success = FL.common.typeOf(xVar);
        ok(success == "object", "FL.common.typeOf({key1:'abc'}) -->'object'");//4
        xVar = [1, 2, 3];
        success = FL.common.typeOf(xVar);
        ok(success == "array", "FL.common.typeOf([1,2,3]) -->'array'");//5
        xVar = new Date();
        success = FL.common.typeOf(xVar);
        ok(success == "date", "FL.common.typeOf(new Date()) -->'date'");//6
        var foo;
        success = FL.common.typeOf(foo);
        ok(success == "undefined", "FL.common.typeOf(foo) foo is undefined -->'undefined'");//7

        xVar = "abc@link.com";
        success = FL.common.typeUIOf(xVar);
        ok(success == "email", "FL.common.typeUIOf('abc@link.com') -->'email'");//8

        xVar = "jojo@mail.telepac.pt";
        success = FL.common.typeUIOf(xVar);
        ok(success == "email", "FL.common.typeUIOf('jojo@mail.telepac.pt') -->'email'");//9

        xVar = "jojo@.mail.telepac.pt";
        success = FL.common.typeUIOf(xVar);
        ok(success === null, "FL.common.typeUIOf('jojo@.mail.telepac.pt') -->'invalid email'");//10

        xVar = "http://www.framelink.co";
        success = FL.common.typeUIOf(xVar);
        ok(success == "url", "FL.common.typeUIOf('http://www.framelink.co') -->'url'");//11

        xVar = "http://www.framelink..co";
        success = FL.common.typeUIOf(xVar);
        ok(success === null, "FL.common.typeUIOf('http://www.framelink..co') -->'invalid url'");//12

        xVar = "351219244558";
        success = FL.common.typeUIOf(xVar);
        ok(success == "phone", "FL.common.typeUIOf('351219244558') -->'valid phone'");//13

        xVar = "3512192445582";
        success = FL.common.typeUIOf(xVar);
        ok(success === null, "FL.common.typeUIOf('951219244558') -->'invalid phone'");//14

        xVar = "abc-.123def";
        var result = FL.common.digitPrefixInEmbededDigit(xVar);
        ok(result =="-.", "FL.common.digitPrefixInEmbededDigit('" + xVar + "') -->'-.' -------------------------------------------FL.common.digitPrefixInEmbededDigit()");//15

        xVar = "£-9.734.123,45 GBP";
        var result = FL.common.digitPrefixInEmbededDigit(xVar);
        ok(result =="-", "FL.common.digitPrefixInEmbededDigit('" + xVar + "') -->'-'");//15

        xVar = "£.945 GBP";
        var result = FL.common.digitPrefixInEmbededDigit(xVar);
        ok(result ==".", "FL.common.digitPrefixInEmbededDigit('" + xVar + "') -->'.'");//15

        xVar = "£,945 GBP";
        var result = FL.common.digitPrefixInEmbededDigit(xVar,",");
        ok(result ==",", "FL.common.digitPrefixInEmbededDigit('" + xVar + "',',') -->','");//15

        xVar = "abc-q123def";
        var result = FL.common.digitPrefixInEmbededDigit(xVar);
        ok(result =="", "FL.common.digitPrefixInEmbededDigit('" + xVar + "') -->''");

        xVar = "abc--123";
        var result = FL.common.digitPrefixInEmbededDigit(xVar);
        ok(result =="-", "FL.common.digitPrefixInEmbededDigit('" + xVar + "') -->'-'");

        xVar = "abc..123";
        var result = FL.common.digitPrefixInEmbededDigit(xVar);
        ok(result ==".", "FL.common.digitPrefixInEmbededDigit('" + xVar + "') -->'.'");

        xVar = "-.11";
        var result = FL.common.digitPrefixInEmbededDigit(xVar);
        ok(result =="-.", "FL.common.digitPrefixInEmbededDigit('" + xVar + "') -->'-.'");

        xVar = "-,11";
        var result = FL.common.digitPrefixInEmbededDigit(xVar,",");
        ok(result =="-,", "FL.common.digitPrefixInEmbededDigit('" + xVar + "') -->'-,'");

        xVar = "abc-,123";
        var result = FL.common.digitPrefixInEmbededDigit(xVar,",");
        ok(result =="-,", "FL.common.digitPrefixInEmbededDigit('" + xVar + ",',') -->'-,'");

        xVar = "abc.-123";
        var result = FL.common.digitPrefixInEmbededDigit(xVar,".");
        ok(result =="-", "FL.common.digitPrefixInEmbededDigit('" + xVar + ",'.') -->'-'");

        xVar = "abc,-123";
        var result = FL.common.digitPrefixInEmbededDigit(xVar,",");
        ok(result =="-", "FL.common.digitPrefixInEmbededDigit('" + xVar + ",',') -->'-'");

        xVar = "abc..123";
        var result = FL.common.digitPrefixInEmbededDigit(xVar,".");
        ok(result ==".", "FL.common.digitPrefixInEmbededDigit('" + xVar + ",'.') -->'.'");

        xVar = "£-9.734.123,45 GBP";
        var result = FL.common.digitPrefixInEmbededDigit(xVar,".");
        ok(result =="-", "FL.common.digitPrefixInEmbededDigit('" + xVar + ",'.') -->'.'");

        xVar = "abc,,123";
        var result = FL.common.digitPrefixInEmbededDigit(xVar,",");
        ok(result ==",", "FL.common.digitPrefixInEmbededDigit('" + xVar + ",',') -->','");

        xVar = "abc,,def";
        var result = FL.common.digitPrefixInEmbededDigit(xVar,",");
        ok(result =="", "FL.common.digitPrefixInEmbededDigit('" + xVar + ",',') -->''");

        xVar = "abc";
        var result = FL.common.excludeDigitPrefixFromStringEnd(xVar);
        ok(result =="abc", "FL.common.excludeDigitPrefixFromStringEnd('" + xVar + "') -->'abc' -------------------------------------------FL.common.excludeDigitPrefixFromStringEnd()");//15

        xVar = "abc-";
        var result = FL.common.excludeDigitPrefixFromStringEnd(xVar);
        ok(result =="abc", "FL.common.excludeDigitPrefixFromStringEnd('" + xVar + "') -->abc''");

        xVar = "abc.";
        var result = FL.common.excludeDigitPrefixFromStringEnd(xVar);
        ok(result =="abc", "FL.common.excludeDigitPrefixFromStringEnd('" + xVar + "') -->'abc'");

        xVar = "abc,";
        var result = FL.common.excludeDigitPrefixFromStringEnd(xVar);
        ok(result =="abc", "FL.common.excludeDigitPrefixFromStringEnd('" + xVar + "') -->'abc'");

        xVar = "abc ,";
        var result = FL.common.excludeDigitPrefixFromStringEnd(xVar);
        ok(result =="abc ", "FL.common.excludeDigitPrefixFromStringEnd('" + xVar + "') -->'abc '");

        xVar = "S/. ";
        var result = FL.common.excludeDigitPrefixFromStringEnd(xVar);
        ok(result =="S/. ", "FL.common.excludeDigitPrefixFromStringEnd('" + xVar + "') -->'S/. '");

        xVar = "S/.";
        var result = FL.common.excludeDigitPrefixFromStringEnd(xVar);
        ok(result =="S/", "FL.common.excludeDigitPrefixFromStringEnd('" + xVar + "') -->'S/'");

        xVar = "351,2,19244,5582";
        ok(xVar.getOcurrencesOf(",") === 3, "FL.common  ---> (" + xVar + ").getOcurrencesOf(',') -->3 --------------------------------------------(xVar).getOcurrencesOf(',') ");//15

        xVar = "351xx2xx19244xx5582";
        ok(xVar.getOcurrencesOf("xx") === 3, "FL.common  ---> (" + xVar + ").getOcurrencesOf('xx') -->3");//16

        xVar = "1234";
        ok(xVar.isNumeric_US(), "FL.common  ---> (" + xVar + ").isNumeric_US() -->true");//17

        xVar = "-1234";
        ok(xVar.isNumeric_US(), "FL.common  ---> (" + xVar + ").isNumeric_US() -->true");//17

        xVar = "1234.5";
        ok(xVar.isNumeric_US(), "FL.common  ---> (" + xVar + ").isNumeric_US() -->true");//18

        xVar = "1,234.5";
        ok(xVar.isNumeric_US(), "FL.common  ---> (" + xVar + ").isNumeric_US() -->true");//19

        xVar = "1,234.5,6";
        ok(!xVar.isNumeric_US(), "FL.common  ---> (" + xVar + ").isNumeric_US() -->false");//20

        xVar = "abcd.6";
        ok(!xVar.isNumeric_US(), "FL.common  ---> (" + xVar + ").isNumeric_US() -->false");//21

        xVar = "-1234.56";
        ok(xVar.isNumeric(), "FL.common  ---> (" + xVar + ").isNumeric() -->true");//22

        xVar = "1234.567";
        ok(xVar.isNumeric(), "FL.common  ---> (" + xVar + ").isNumeric() 23-->true");//23

        xVar = "1234.567.8";
        ok(xVar.isNumeric(), "FL.common  ---> (" + xVar + ").isNumeric() 24-->true");//24

        xVar = "1.234,5678";
        ok(xVar.isNumeric(), "FL.common  ---> (" + xVar + ").isNumeric() 25-->true");//20

        xVar = "-1.234,5678";
        ok(xVar.isNumeric(), "FL.common  ---> (" + xVar + ").isNumeric() 25-->true");//20

        xVar = "1 234,5678";
        ok(xVar.isNumeric(), "FL.common  ---> (" + xVar + ").isNumeric() -->true");//20

        xVar = "1 234,567,8";
        ok(!xVar.isNumeric(), "FL.common  ---> (" + xVar + ").isNumeric() -->false");//20

        xVar = "1 234 567,8";
        ok(xVar.isNumeric(), "FL.common  ---> (" + xVar + ").isNumeric() -->true");//20

        xVar = "1 234 567.89";
        ok(!xVar.isNumeric(), "FL.common  ---> (" + xVar + ").isNumeric() -->false if thousands is space radix must be comma");//20

        xVar = "1,234,567.8";
        ok(xVar.isNumeric(), "FL.common  ---> (" + xVar + ").isNumeric() -->true");//20

        xVar = "1,234,567.89.2";
        ok(!xVar.isNumeric(), "FL.common  ---> (" + xVar + ").isNumeric() -->false");//20

        xVar = "28-04-1956";
        ok(!xVar.isNumeric(), "FL.common  ---> (" + xVar + ").isNumeric() -->false");//20

        xVar = "1200";
        ok(xVar.isInteger(), "FL.common  ---> (" + xVar + ").isInteger() -->true  --------------------------------------------------------- xVar.isInteger()  ");//20

        xVar = "1";
        ok(xVar.isInteger(), "FL.common  ---> (" + xVar + ").isInteger() -->true ");//20

        xVar = " 1200";
        ok(xVar.isInteger(), "FL.common  ---> (" + xVar + ").isInteger() -->true");//20

        xVar = " 1200 ";
        ok(xVar.isInteger(), "FL.common  ---> (" + xVar + ").isInteger() -->true");//20

        xVar = "1200.200";
        ok(!xVar.isInteger(), "FL.common  ---> (" + xVar + ").isInteger() -->false it has separator or radix");//20

        xVar = "1200,200";
        ok(!xVar.isInteger(), "FL.common  ---> (" + xVar + ").isInteger() -->false it has separator or radix");//20

        xVar = "1200 200";
        ok(!xVar.isInteger(), "FL.common  ---> (" + xVar + ").isInteger() -->false it has separator or radix");//20

        xVar = " 12,00 %";
        ok(xVar.isPercent(), "FL.common  ---> (" + xVar + ").isPercent() -->true  --------------------------------------------------------- xVar.isPercent()  ");//20

        xVar = "-12,00 %";
        ok(xVar.isPercent(), "FL.common  ---> (" + xVar + ").isPercent() -->true");//20

        xVar = "-12.540 %";
        ok(xVar.isPercent(), "FL.common  ---> (" + xVar + ").isPercent() -->true");//20

        xVar = "1%";
        ok(xVar.isPercent(), "FL.common  ---> (" + xVar + ").isPercent() -->true");//20

        xVar = "1%x";
        ok(!xVar.isPercent(), "FL.common  ---> (" + xVar + ").isPercent() -->false");//20

        xVar = "1.234,56";
        ok(xVar.ToNumeric_US()=="1234.56", "FL.common  ---> (" + xVar + ").ToNumeric_US() -->"+xVar.ToNumeric_US() + " ----------------------------------------------xVar.ToNumeric_US");//20

        xVar = "1,234.56";
        ok(xVar.ToNumeric_US()=="1234.56", "FL.common  ---> (" + xVar + ").ToNumeric_US() -->"+xVar.ToNumeric_US());//20

        xVar = "1,234";
        ok(xVar.ToNumeric_US()=="1234", "FL.common  ---> (" + xVar + ").ToNumeric_US() -->"+xVar.ToNumeric_US());//20

        xVar = "1.234";
        ok(xVar.ToNumeric_US()=="1.234", "FL.common  ---> (" + xVar + ").ToNumeric_US() -->"+xVar.ToNumeric_US());//20

        xVar = "1.234";
        ok(xVar.ToNumeric_US(".")=="1.234", "FL.common  ---> (" + xVar + ",'.').ToNumeric_US() -->"+xVar.ToNumeric_US("."));//20

        xVar = "1,234";
        ok(xVar.ToNumeric_US(",")=="1.234", "FL.common  ---> (" + xVar + ",',').ToNumeric_US() -->"+xVar.ToNumeric_US(","));//20

        xVar = "1.234";
        ok(xVar.ToNumeric_US(",")=="1234", "FL.common  ---> (" + xVar + ",',').ToNumeric_US() -->"+xVar.ToNumeric_US(","));//20


        xVar = "xx1,234yyy";
        var result = FL.common.extractContentBetweenFirstAndLastDigit(xVar);
        ok(result == "1,234", "FL.common.extractContentBetweenFirstAndLastDigit('" + xVar + "') -->" + result + "-----------------------------------FL.common.extractContentBetweenFirstAndLastDigit(");//20

        xVar = "xx-1,234yyy";
        var result = FL.common.extractContentBetweenFirstAndLastDigit(xVar);
        ok(result == "1,234", "FL.common.extractContentBetweenFirstAndLastDigit('" + xVar + "') -->" + result);//20


        xVar = "xx 12,3yy1 yweqw";
        var result = FL.common.extractContentBetweenFirstAndLastDigit(xVar);
        ok(result == "12,3yy1", "FL.common.extractContentBetweenFirstAndLastDigit('" + xVar + "') -->" + result);//20

        xVar = "US$1.253,45";
        var result = FL.common.extractContentBetweenFirstAndLastDigit(xVar);
        ok(result == "1.253,45", "FL.common.extractContentBetweenFirstAndLastDigit('" + xVar + "') -->" + result);//20

        xVar = "US$1.253,45";
        ok(xVar.isCurrency(), "FL.common  ---> (" + xVar + ").isCurrency() -->true ----------------------------------------------------xVar.isCurrency()");//20

        xVar = "S/. 1.250,45   ";
        ok(xVar.isCurrency(), "FL.common  ---> (" + xVar + ").isCurrency() -->true");//20

        xVar = "1.253,45 USD";
        ok(xVar.isCurrency(), "FL.common  ---> (" + xVar + ").isCurrency() -->true");//20

        xVar = "US$1.2x53,45";
        ok(!xVar.isCurrency(), "FL.common  ---> (" + xVar + ").isCurrency() -->false");//20

        xVar = "1.253,45";
        ok(!xVar.isCurrency(), "FL.common  ---> (" + xVar + ").isCurrency() -->false because it lacks any currency sign");//20

        xVar = "-1.253,45";
        ok(!xVar.isCurrency(), "FL.common  ---> (" + xVar + ").isCurrency() -->false because it lacks any currency sign");//20

        xVar = "1.253,45x";
        ok(!xVar.isCurrency(), "FL.common  ---> (" + xVar + ").isCurrency() -->false there is no currency 'x'");//20

        xVar = "R$ 1 253,45";
        ok(xVar.isCurrency(), "FL.common  ---> (" + xVar + ").isCurrency() -->true");//20

        xVar = "R$ 1 253.45";
        ok(!xVar.isCurrency(), "FL.common  ---> (" + xVar + ").isCurrency() -->false because if decimal separator is space radix must be comma");//20

        xVar = "¥1,467";
        ok(xVar.isCurrency(), "FL.common  ---> (" + xVar + ").isCurrency() -->true");//20

        xVar = "£1.234.567,89 GBP";
        ok(xVar.isCurrency(), "FL.common  ---> (" + xVar + ").isCurrency() -->true");//20

        xVar = "$1,234,567.89 CAD";
        ok(xVar.isCurrency(), "FL.common  ---> (" + xVar + ").isCurrency() -->true");//20

        xVar = "$-1,234,567.89 CAD";
        ok(xVar.isCurrency(), "FL.common  ---> (" + xVar + ").isCurrency() -->true");//20

        xVar = "S/.-1,234,567.89 ";
        ok(xVar.isCurrency(), "FL.common  ---> (" + xVar + ").isCurrency() -->true");//20

        xVar = "S/.1,234,567.89 ";
        ok(xVar.isCurrency(), "FL.common  ---> (" + xVar + ").isCurrency() -->true");//20

        //----------------------- FL.common.extractRadixFrom

        xVar = "12,345,678.9";
        var result = FL.common.extractRadixFrom(xVar);
        ok(result == ".", "FL.common.extractRadixFrom('"+ xVar + "') -->'.' -------------------------------------------------  FL.common.extractRadixFrom");//1

        xVar = "12.345.678,9";
        var result = FL.common.extractRadixFrom(xVar);
        ok(result == ",", "FL.common.extractRadixFrom('"+ xVar + "') -->','");

        xVar = "12,345.9";
        var result = FL.common.extractRadixFrom(xVar);
        ok(result == ".", "FL.common.extractRadixFrom('"+ xVar + "') -->'.'");

        xVar = "12.345,9";
        var result = FL.common.extractRadixFrom(xVar);
        ok(result == ",", "FL.common.extractRadixFrom('"+ xVar + "') -->','");

        xVar = "12,345";
        var result = FL.common.extractRadixFrom(xVar);
        ok(result === null, "FL.common.extractRadixFrom('"+ xVar + "') -->null because we dont know if is 12,345.00(US) or 12,345(Europe)");

        xVar = "12.345";
        var result = FL.common.extractRadixFrom(xVar);
        ok(result == null, "FL.common.extractRadixFrom('"+ xVar + "') -->null because we dont know if is 12.345,00(Europe) or 12.345(US)");

        xVar = "12345";
        var result = FL.common.extractRadixFrom(xVar);
        ok(result == null, "FL.common.extractRadixFrom('"+ xVar + "') -->null because it is an integer");

        xVar = "1.234,5";
        var result = FL.common.extractThousandsSeparatorFrom(xVar);
        ok(result == ".", "FL.common.extractThousandsSeparatorFrom('"+ xVar + "') -->point ---------------------------------------------FL.common.extractThousandsSeparatorFrom ");

        xVar = "1,234.5";
        var result = FL.common.extractThousandsSeparatorFrom(xVar);
        ok(result == ",", "FL.common.extractThousandsSeparatorFrom('"+ xVar + "') -->comma");

        xVar = "1,234,125";
        var result = FL.common.extractThousandsSeparatorFrom(xVar);
        ok(result == ",", "FL.common.extractThousandsSeparatorFrom('"+ xVar + "') -->comma");

        xVar = "1.234.125";
        var result = FL.common.extractThousandsSeparatorFrom(xVar);
        ok(result == ".", "FL.common.extractThousandsSeparatorFrom('"+ xVar + "') -->point");

        xVar = "12345";
        var result = FL.common.extractThousandsSeparatorFrom(xVar);
        ok(result == null, "FL.common.extractThousandsSeparatorFrom('"+ xVar + "') -->null because it is an integer");



        //----------------------- FL.common.isArrOf<XXXX> Currency, number, email, url, check, phone,datetime
        var arrOfRowValues = [
            "$-1,234,567.89 CAD",
            "£1.234.567,89 GBP",
            "US$1.253,45",
            "1.253,45 USD",
            "1,253.45$"
        ];
        var success = FL.common.isArrOfCurrency(arrOfRowValues);
        ok(success == true, "FL.common.isArrOfCurrency('array of valid currency') -->'true' ---------------------------------- FL.common.isArrOf<XXXX> ");//19

        var arrOfRowValues = [
            "$-1,234,567.89 CAD",
            "£1.234.567,89 GBP",
            "1.253,45",// ofending value - is a number not a currency
            "1.253,45 USD",
            "1,253.45$"
        ];
        var success = FL.common.isArrOfCurrency(arrOfRowValues);
        ok(success == false, "FL.common.isArrOfCurrency('array with one invalid currency') -->'false'");//19

        var arrOfRowValues = [
            "123",
            "1.234.567,89",
            "1.253,45",
            "1 253,45",
            "1,253.45"
        ];
        var success = FL.common.isArrOfNumber(arrOfRowValues);
        ok(success == true, "FL.common.isArrOfNumber('array with valid numbers') -->'true'");//19

        var arrOfRowValues = [
            "123",
            "1.234.567,89",
            "1.253,45$",//ofending value is a currency
            "1 253,45",
            "1,253.45"
        ];
        var success = FL.common.isArrOfNumber(arrOfRowValues);
        ok(success == false, "FL.common.isArrOfNumber('array with one invalid number') -->'false'");//19

        var arrOfRowValues = [
            "123%",
            "1.234%",
            "0.5%",
            "0,26 %",
            "-5%"
        ];
        var success = FL.common.isArrOfPercent(arrOfRowValues);
        ok(success == true, "FL.common.isArrOfPercent('array with valid percents') -->'true'");//19

        var arrOfRowValues = [
            "123%",
            "1.234%",
            "0.5%x",//ofending value is not a percent
            "0,26 %",
            "-5%"
        ];
        var success = FL.common.isArrOfPercent(arrOfRowValues);
        ok(success == false, "FL.common.isArrOfPercent('array with invalid percent') -->'false'");//19

        var arrOfRowValues = [
            "jojo@jojo.com",
            "toto@toto.com",
            "toto@toto.telepac.pt",
            "joaocarloscoliveira@gmail.com",
            "joaoccoliveira@live.com",
        ];
        var success = FL.common.isArrOfEmail(arrOfRowValues);
        ok(success == true, "FL.common.isArrOfEmail('array with valid emails') -->'true'");//19

        var arrOfRowValues = [
            "jojo@jojo.com",
            "toto@toto.com",
            "totototo.telepac.pt",//ofending value
            "joaocarloscoliveira@gmail.com",
            "joaoccoliveira@live.com",
        ];
        var success = FL.common.isArrOfEmail(arrOfRowValues);
        ok(success == false, "FL.common.isArrOfEmail('array with one invalid email') -->'false'");//19

        var arrOfRowValues = [
            "http://microsoft.com",
            "http://www.framelink.co",
            "https://babeljs.io/",
            "https://github.com/joaool/MotherGithub",
            "http://appendto.com/",
        ];
        var success = FL.common.isArrOfURL(arrOfRowValues);
        ok(success == true, "FL.common.isArrOfURL('array with valid URLs') -->'true'");//19

        var arrOfRowValues = [
            "http://microsoft.com",
            "http://www.framelink..co",//ofending value
            "babeljs.io/",//ofending value
            "https://github.com/joaool/MotherGithub",
            "http://appendto.com/",
        ];
        var success = FL.common.isArrOfURL(arrOfRowValues);
        ok(success == false, "FL.common.isArrOfURL('array with one invalid url') -->'false'");//19

        var arrOfRowValues = [
            "TRUE",
            "false",
            "FALSE",
            "True",
            "False",
        ];
        var success = FL.common.isArrOfCheck(arrOfRowValues);
        ok(success == true, "FL.common.isArrOfCheck('array with valid true/false string') -->'true'");//19

        var arrOfRowValues = [
            "TRUE",
            "falsex",//ofending value
            "FALSE",
            "True",
            "False",
        ];
        var success = FL.common.isArrOfCheck(arrOfRowValues);
        ok(success == false, "FL.common.isArrOfCheck('array with one invalid true/false string') -->'false'");//19

        /*
         var arrOfRowValues = [
         "415-555-1212",
         "415-555-1212",
         ];
         var success = FL.common.isArrOfPhone(arrOfRowValues);
         ok(success == true, "FL.common.isArrOfPhone('array with valid phone string') -->'true'");//19

         var arrOfRowValues = [
         "415-555-1212",
         "415-555-1212",
         ];
         var success = FL.common.isArrOfPhone(arrOfRowValues);
         ok(success == false, "FL.common.isArrOfPhone('array with one invalid phone string') -->'false'");//19
         */
        //----------------------- FL.common.is_dateArrInStringFormat
        arrOfRowValues = [
            "March 21, 2012",
            "03-21-2012",
            //var d = Date.parse("15-21-12");//NaN
            "03/21/2012",
            "21-Mar-2012"
        ];
        var success = FL.common.is_dateArrInStringFormat(arrOfRowValues);
        ok(success == true, "FL.common.is_dateArrInStringFormat('array of values with all valid') -->'true'");//19

        arrOfRowValues = [
            "March 21, 2012",
            "03-21-12",
            "15-21-12",//ofending value
            "03/21/2012",
            "21-Mar-2012"
        ];
        success = FL.common.is_dateArrInStringFormat(arrOfRowValues);
        ok(success == false, "FL.common.is_dateArrInStringFormat('array of values with one invalid') -->'false'");//20

        arrOfRowValues = [
            " ",
            "",
            "",
            " ",
            " "
        ];
        success = FL.common.is_dateArrInStringFormat(arrOfRowValues);
        ok(success === false, "FL.common.is_dateArrInStringFormat('array of spaces and empty values') -->'false'");//21
    });
    test("FL.common tests", function (assert) {
        FL.common.appsettings.radixpoint = ",";
        FL.common.appsettings.thousandsSeparator = ".";

        //----------------------- tail()
        var xVar = "12345.567";
        var result = FL.common.getTail(xVar, ".");
        ok(result == "567", "FL.common.getTail('" + xVar + "','.') -->'" + result + "' with defined radixpoint='.')");//1
        var result = FL.common.getTail(xVar);
        ok(result == "", "FL.common.getTail('" + xVar + "') -->'" + result + "' with undefined radixpoint --> appsettings.radixpoint=',')");//1
        var xVar = "12345,567";
        var result = FL.common.getTail(xVar);
        ok(result == "567", "FL.common.getTail('" + xVar + "') -->'" + result + "' with undefined radixpoint --> appsettings.radixpoint=',')");//1
        var xVar = "12345";
        var result = FL.common.getTail(xVar);
        ok(result == "", "FL.common.getTail('" + xVar + "') -->'" + result + "' with undefined radixpoint --> appsettings.radixpoint=',')");//1


        //----------------------- Number.toFormattedString()
        FL.common.appsettings.radixpoint = ",";
        FL.common.appsettings.thousandsSeparator = ".";
        var x = 12345.567;
        var result = x.toFormattedString();
        ok(result == "12.345,567", "Numeric x=" + x + "   x.toFormattedString() -->'" + result + "' with radixpoint=',' thousandsSeparator='.') -----------------------(<Number>).toFormattedString()");//1

        x = 123456789;
        var result = x.toFormattedString();
        ok(result == "123.456.789", "Numeric x=" + x + "   x.toFormattedString() -->'" + result + "' with radixpoint=',' thousandsSeparator='.')");//1

        x = 12345.6789;
        var decimals = 2;
        var result = x.toFormattedString(decimals);
        ok(result == "12.345,68", "Numeric x=" + x + "   x.toFormattedString('" + decimals + "') -->'" + result + "' with radixpoint=',' thousandsSeparator='.')");//1

        x = 12345.4789;
        var decimals = 0;
        var result = x.toFormattedString(decimals);
        ok(result == "12.345", "Numeric x=" + x + "   x.toFormattedString('" + decimals + "') -->'" + result + "' with radixpoint=',' thousandsSeparator='.')");//1

        x = 12345.5789;
        var decimals = 0;
        var result = x.toFormattedString(decimals);
        ok(result == "12.346", "Numeric x=" + x + "   x.toFormattedString('" + decimals + "') -->'" + result + "' with radixpoint=',' thousandsSeparator='.')");//1

        var x = Number("-1234567.25");
        var result = x.toFormattedString();
        ok(result == "-1.234.567,25", "Numeric x=" + x + "   x.toFormattedString(" + x + ") -->'" + result + "' with radixpoint='.' thousandsSeparator=',')");//1

        var x = Number("-1.25");
        var result = x.toFormattedString();
        ok(result == "-1,25", "Numeric x=" + x + "   x.toFormattedString(" + x + ") -->'" + result + "' with radixpoint='.' thousandsSeparator=',')");//1

        var x = Number("-0.25");
        var result = x.toFormattedString();
        ok(result == "-0,25", "Numeric x=" + x + "   x.toFormattedString(" + x + ") -->'" + result + "' with radixpoint='.' thousandsSeparator=',')");//1

        var x = Number("-.25");
        var result = x.toFormattedString();
        ok(result == "-0,25", "Numeric x=" + x + "   x.toFormattedString(" + x + ") -->'" + result + "' with radixpoint='.' thousandsSeparator=',')");//1

        FL.common.appsettings.radixpoint = ".";
        FL.common.appsettings.thousandsSeparator = ",";
        x = 12345.567;
        var result = x.toFormattedString();
        ok(result == "12,345.567", "Numeric x=" + x + "   x.toFormattedString() -->'" + result + "' with radixpoint='.' thousandsSeparator=',')");//1

        x = 123456789;
        var result = x.toFormattedString();
        ok(result == "123,456,789", "Numeric x=" + x + "   x.toFormattedString() -->'" + result + "' with radixpoint='.' thousandsSeparator=',')");//1

        x = -123456789;
        var result = x.toFormattedString();
        ok(result == "-123,456,789", "Numeric x=" + x + "   x.toFormattedString() -->'" + result + "' with radixpoint='.' thousandsSeparator=',')");//1

        x = +123456789;
        var result = x.toFormattedString();
        ok(result == "123,456,789", "Numeric x=" + x + "   x.toFormattedString() -->'" + result + "' with radixpoint='.' thousandsSeparator=',')");//1

        x = 12345.6789;
        var decimals = 3;
        var result = x.toFormattedString(decimals);
        ok(result == "12,345.679", "Numeric x=" + x + "   x.toFormattedString('" + decimals + "') -->'" + result + "' with radixpoint='.' thousandsSeparator=',')");//1

        x = 12345.6789;
        var decimals = 0;
        var result = x.toFormattedString(decimals);
        ok(result == "12,346", "Numeric x=" + x + "   x.toFormattedString('" + decimals + "') -->'" + result + "' with radixpoint='.' thousandsSeparator=',')");//1


        var x = Number("12A23");
        var result = x.toFormattedString();
        ok(result === null, "Numeric x=" + x + "   x.toFormattedString(" + x + ") -->'" + result + "' with radixpoint='.' thousandsSeparator=',')");//1

        var x = Number("-1234567.25");
        var result = x.toFormattedString();
        ok(result == "-1,234,567.25", "Numeric x=" + x + "   x.toFormattedString(" + x + ") -->'" + result + "' with radixpoint='.' thousandsSeparator=',')");//1

        var x = Number("-1.25");
        var result = x.toFormattedString();
        ok(result == "-1.25", "Numeric x=" + x + "   x.toFormattedString(" + x + ") -->'" + result + "' with radixpoint='.' thousandsSeparator=',')");//1


        //----------------------- String.pad()
        var xVar = "567";
        var result = xVar.pad(5, "0", 1);//string to have length=5, add "0" to the right side (1)
        ok(result == "56700", "String ('" + xVar + "').pad(5,'0',1) -->'" + result + " string to have length=5, add '0' to the right side (1))");//1
        var result = xVar.pad(5, "0", 0);//string to have length=5, add "0" to the left side (0)
        ok(result == "00567", "String ('" + xVar + "').pad(5,'0',0) -->'" + result + " string to have length=5, add '0' to the left side (0))");//1
        var result = xVar.pad(5, "0", 2);//string to have length=5, add "0" to the left side (0)
        ok(result == "05670", "String ('" + xVar + "').pad(5,'0',2) -->'" + result + " string to have length=5, add '0' to both sides (2))");//1
        var result = xVar.pad(6, "0", 2);//string to have length=8, add "0" to the left side (0)
        ok(result == "005670", "String ('" + xVar + "').pad(6,'0',2) -->'" + result + " string to have length=6, add '0' to both sides (2))");//1
        var result = xVar.pad(2, "0", 2);//string to have length=8, add "0" to the left side (0)
        ok(result == "567", "String ('" + xVar + "').pad(2,'0',2) -->'" + result + " string to have length=2, add '0' to both sides (2))");//1


        //----------------------- timeTo24()
        var xVar = "11:00 pm";
        var xRet = FL.common.timeTo24(xVar);
        ok(xRet == "23:00", "timeTo24('" + xVar + "')  -->" + xRet);

        xVar = "11:43 am";
        xRet = FL.common.timeTo24(xVar);
        ok(xRet == "11:43", "timeTo24('" + xVar + "')  -->" + xRet);

        xVar = "00:00 am";
        xRet = FL.common.timeTo24(xVar);
        ok(xRet == "00:00", "timeTo24('" + xVar + "')  -->" + xRet);


        xVar = "12:00 pm";
        xRet = FL.common.timeTo24(xVar);
        ok(xRet === null, "timeTo24('" + xVar + "')  -->" + xRet + " Bad Input Format");

        xVar = "13:00 pm";
        xRet = FL.common.timeTo24(xVar);
        ok(xRet === null, "timeTo24('" + xVar + "')  -->" + xRet + " Bad Input Format");


        //----------------------- formatShortLocalToISODate()
        var isoDate = FL.common.formatShortLocalToISODate("2015/6/25 11:21 am");//YMD
        ok(isoDate == "2015-06-25T10:21:00.000Z", "YMD am formatShortLocalToISODate returns 2015-06-25T10:21:00.000Z");//1

        var isoDate = FL.common.formatShortLocalToISODate("6/25/2015 11:21 am");//MDY
        ok(isoDate == "2015-06-25T10:21:00.000Z", "MDY am formatShortLocalToISODate returns 2015-06-25T10:21:00.000Z");//1

        var isoDate = FL.common.formatShortLocalToISODate("6/12/2015 03:21 pm");//MDY
        ok(isoDate == "2015-06-12T14:21:00.000Z", "MDY pm formatShortLocalToISODate returns 2015-06-12T14:2100.000Z");//1

        var isoDate = FL.common.formatShortLocalToISODate("6/12/2015 03:21 pm", "DMY");//DMY
        ok(isoDate == "2015-12-06T15:21:00.000Z", "DMY pm formatShortLocalToISODate returns 2015-12-06T15:2100.000Z - The returned value is not a constant, because of the practice of using Daylight Saving Time.");//1

        //----------------------- toISODate()
        var xVar = "2015/06/12";//YMD(China)
        var isoDate = FL.common.toISODate(xVar);
        ok(isoDate === FL.common.formatShortLocalToISODate(xVar), "FL.common.toISODate('2015/06/12') ISO -->" + isoDate);//10

        var xVar = "2015/06/12 07:00 pm";//YMD(China)
        var isoDate = FL.common.toISODate(xVar);
        ok(isoDate === FL.common.formatShortLocalToISODate(xVar), "YMD FL.common.toISODate('2015/06/12 07:00 pm') ISO -->" + isoDate);//1

        var xVar = "2015/06/01 12:00 am";//YMD
        var isoDate = FL.common.toISODate(xVar, "YMD");
        ok(isoDate == "2015-06-01T11:00:00.000Z", "DMY FL.common.toISODate('" + xVar + "','DMY') ISO -->" + isoDate + " assuming 1 h of timezone diff");//1

        var xVar = "2015/06/01 12:00 pm";//YMD
        var isoDate = FL.common.toISODate(xVar, "YMD");
        ok(isoDate === null, "DMY FL.common.toISODate('" + xVar + "','DMY') ISO -->null because 12:00 pm is a bad format");//1

        var xVar = "2015/06/01 00:30 am";//YMD
        var isoDate = FL.common.toISODate(xVar, "YMD");
        ok(isoDate == "2015-05-31T23:30:00.000Z", "DMY FL.common.toISODate('" + xVar + "','DMY') ISO -->" + isoDate + " assuming 1 h of timezone diff");//1

        var xVar = "06/12/2015 07:00 pm";//MDY
        var isoDate = FL.common.toISODate(xVar);
        ok(isoDate === FL.common.formatShortLocalToISODate(xVar), "MDY FL.common.toISODate('" + xVar + "') ISO -->" + isoDate);//1

        var xVar = "06/12/2015 07:00 pm";//DMY
        var isoDate = FL.common.toISODate(xVar, "DMY");
        ok(isoDate === FL.common.formatShortLocalToISODate(xVar, "DMY"), "DMY FL.common.toISODate('" + xVar + "','DMY') ISO -->" + isoDate);//1


        //----------------------- fromISODateToShortdate()
        var xVar = "2015-12-06T05:00:00.000Z";
        var shortDate = FL.common.fromISODateToShortdate(xVar, "YMD");
        ok(shortDate == "2015/12/06", "YMD FL.common.fromISODateToShortdate('" + xVar + "','YMD') -->" + shortDate);//

        var shortDate = FL.common.fromISODateToShortdate(xVar, "MDY");
        ok(shortDate == "12/06/2015", "YMD FL.common.fromISODateToShortdate('" + xVar + "','YMD') -->" + shortDate);//

        var shortDate = FL.common.fromISODateToShortdate(xVar, "DMY");
        ok(shortDate == "06/12/2015", "YMD FL.common.fromISODateToShortdate('" + xVar + "','YMD') -->" + shortDate);//

        var shortDate = FL.common.fromISODateToShortdate("2015-12-06X05:00:00.000Z", "DMY");
        ok(shortDate == null, "if isoDate was a wrong format ('2015-12-06X05:00:00.000Z'), FL.common.fromISODateToShortdate() returns null ");//

        var shortDate = FL.common.fromISODateToShortdate("2015-12-06T05:00:00.000X", "DMY");
        ok(shortDate == null, "if isoDate was a wrong format ('2015-12-06T05:00:00.000X'), FL.common.fromISODateToShortdate() returns null ");//

        var shortDate = FL.common.fromISODateToShortdate("2015-12-06T25:00:00.000Z", "DMY");
        ok(shortDate == null, "if isoDate was a wrong format ('2015-12-06T25:00:00.000Z'), FL.common.fromISODateToShortdate() returns null ");//

        var shortDate = FL.common.fromISODateToShortdate("2015-12-06T05:61:00.000Z", "DMY");
        ok(shortDate == null, "if isoDate was a wrong format ('2015-12-06T05:61:00.000Z'), FL.common.fromISODateToShortdate() returns null ");//

        var shortDate = FL.common.fromISODateToShortdate("2015-12-06T05:01:61.000Z", "DMY");
        ok(shortDate == null, "if isoDate was a wrong format ('2015-12-06T05:01:61.000Z'), FL.common.fromISODateToShortdate() returns null ");//

        var shortDate = FL.common.fromISODateToShortdate("2015-12-06T05:01:01-000Z", "DMY");
        ok(shortDate == null, "if isoDate was a wrong format ('2015-12-06T05:01:01-000Z'), FL.common.fromISODateToShortdate() returns null ");//

        var shortDate = FL.common.fromISODateToShortdate("2015-13-06T05:01:01-000Z", "DMY");
        ok(shortDate == null, "if isoDate was a wrong format ('2015-13-06T05:01:01-000Z'), FL.common.fromISODateToShortdate() returns null ");//

        var shortDate = FL.common.fromISODateToShortdate("2015-12-06T05:01", "DMY");
        ok(shortDate == "06/12/2015", "if isoDate was a shorter format ('2015-12-06T05:01'), FL.common.fromISODateToShortdate() returns 06/12/2015 OK! ");//

        //----------------------- fromISODateToTime()
        var xVar = "2015-12-06T05:00:00.000Z";
        var time = FL.common.fromISODateToTime(xVar);
        ok(time == "06:00 am", "YMD FL.common.fromISODateToTime('" + xVar + ") -->" + time + "-->assumes 1 hr timezone difference");//

        var xVar = "2015-12-06T15:45:00.000Z";
        var time = FL.common.fromISODateToTime(xVar);
        ok(time == "04:45 pm", "YMD FL.common.fromISODateToTime('" + xVar + "') -->" + time + "-->assumes 1 hr timezone difference");//

        //----------------------- fromISODateToShortdateTime()
        var xVar = "2015-12-06T05:00:00.000Z";
        var shortDatetime = FL.common.fromISODateToShortdateTime(xVar, "MDY");
        ok(shortDatetime == "12/06/2015 06:00 am", "YMD FL.common.fromISODateToShortdateTime('" + xVar + "','MDY') -->" + shortDatetime + "-->assumes 1 hr timezone difference");//

        var xVar = "2015-12-06T15:45:00.000Z";
        var shortDatetime = FL.common.fromISODateToShortdateTime(xVar, "DMY");
        ok(shortDatetime == "06/12/2015 04:45 pm", "YMD FL.common.fromISODateToShortdateTime('" + xVar + "','DMY') -->" + shortDatetime + "-->assumes 1 hr timezone difference");//

        var xVar = "2015-12-006T15:45:00.000Z";
        var shortDatetime = FL.common.fromISODateToShortdateTime(xVar, "DMY");
        ok(shortDatetime === null, "if isoDate was a wrong format, FL.common.fromISODateToShortdateTime() returns null ");//

        var d = new Date();
        var xVar = d.toISOString();
        var shortDatetime = FL.common.fromISODateToShortdateTime(xVar, "DMY");
        ok(shortDatetime == shortDatetime, "YMD FL.common.fromISODateToShortdateTime('" + xVar + "','DMY') -->" + shortDatetime + "-->Shows time NOW this passes allways...");//


        //----------------------- is_validShortDate()
        var xVar = "2015/06/2";//YMD(China)
        var success = FL.common.is_validShortDate(xVar);
        ok(success === true, "FL.common.is_validShortDate('2015/06/2') YMD -->'true'");//1

        var xVar = "2015-06-2";//YMD(China)
        var success = FL.common.is_validShortDate(xVar);
        ok(success === true, "FL.common.is_validShortDate('2015-06-2') YMD -->'true'");//1

        var xVar = "2015.06.2";//YMD(China)
        var success = FL.common.is_validShortDate(xVar);
        ok(success === true, "FL.common.is_validShortDate('2015.06.2') YMD -->'true'");//1

        var xVar = "15.06.2";//YMD(China)
        var success = FL.common.is_validShortDate(xVar);
        ok(success === false, "FL.common.is_validShortDate('15.06.2') YMD -->'unacceptable'");//1

        var xVar = "2015.6.2";//YMD(China)
        var success = FL.common.is_validShortDate(xVar);
        ok(success === true, "FL.common.is_validShortDate('2015.6.2') YMD -->'true'");//1

        var xVar = "2015 6 2";//YMD(China)
        var success = FL.common.is_validShortDate(xVar);
        ok(success === true, "FL.common.is_validShortDate('2015 6 2') YMD -->'true'");//1

        var xVar = "3/12/2015";//DMY(Europe)
        var success = FL.common.is_validShortDate(xVar);
        ok(success === true, "FL.common.is_validShortDate('3/12/2015') DMY -->'true'");//1

        var xVar = "30/12/2015";//DMY(Europe)
        var success = FL.common.is_validShortDate(xVar);
        ok(success === true, "FL.common.is_validShortDate('30/12/2015') DMY -->'true'");//1

        var xVar = "30/12/15";//DMY(Europe)
        var success = FL.common.is_validShortDate(xVar);
        ok(success === false, "FL.common.is_validShortDate('30/12/15') DMY -->'unacceptable'");//1

        var xVar = "3/3/2015";//DMY(Europe)
        var success = FL.common.is_validShortDate(xVar);
        ok(success === true, "FL.common.is_validShortDate('3/3/2015') DMY -->'true'");//1


        var xVar = "12/30/2015";//MDY(US)
        var success = FL.common.is_validShortDate(xVar);
        ok(success === true, "FL.common.is_validShortDate('12/30/2015') MDY -->'true'");//1

        var xVar = "12/3/2015";//MDY(US)
        var success = FL.common.is_validShortDate(xVar);
        ok(success === true, "FL.common.is_validShortDate('12/3/2015') MDY -->'true'");//1


        var xVar = "March 21, 2012";
        var success = FL.common.is_ValidDate(xVar);
        ok(success === true, "FL.common.is_ValidDate('March 21, 2012') -->'true'");//1

        xVar = "March";
        success = FL.common.is_ValidDate(xVar);
        ok(success === false, "FL.common.is_ValidDate('March') -->'false'");//2

        var xVar = "Mar 21, 2012";
        var success = FL.common.is_ValidDate(xVar);
        ok(success === true, "FL.common.is_ValidDate('Mar 21, 2012') -->'true'");//3

        var xVar = "Wednesday Mar 21 2012";
        var success = FL.common.is_ValidDate(xVar);
        ok(success === true, "FL.common.is_ValidDate('Wednesday Mar 21 2012') -->'true'");//4

        var xVar = "Thursday Mar 21 2012"; //this date is a Wednesday !!!!
        var success = FL.common.is_ValidDate(xVar);
        ok(success === false, "FL.common.is_ValidDate('Thursday Mar 21 2012') -->'false because this date is a Wednesday'");//5

        var xVar = "Wed Mar 21 2012";
        var success = FL.common.is_ValidDate(xVar);
        ok(success === true, "FL.common.is_ValidDate('Wed Mar 21 2012') -->'true'");//6

        var xVar = "Sun Mar 21 2012";//this date is a Wednesday !!!!
        var success = FL.common.is_ValidDate(xVar);
        ok(success === false, "FL.common.is_ValidDate('Sun Mar 21 2012') -->'false'");//7

        var xVar = "Wed 21 2012";//no month
        var success = FL.common.is_ValidDate(xVar);
        ok(success === false, "FL.common.is_ValidDate('Wed 21 2012') -->'false'");//8

        xVar = "03-21-12";
        success = FL.common.is_ValidDate(xVar);
        ok(success === false, "FL.common.is_ValidDate('03-21-12') -->'false year must be complete'");//9

        xVar = "03-21-2012";
        success = FL.common.is_ValidDate(xVar);
        ok(success === true, "FL.common.is_ValidDate('03-21-2012') -->'true'");//10

        xVar = "03-21-1812";
        success = FL.common.is_ValidDate(xVar);
        ok(success === false, "FL.common.is_ValidDate('03-21-1812') -->'false'");//11

        xVar = "03/21/2012";
        success = FL.common.is_ValidDate(xVar);
        ok(success === true, "FL.common.is_ValidDate('03/21/2012') -->'true'");//12

        xVar = "21/03/2012";//this is read has month/day/year----ç->MUST BE OK !!!  DMY(europe)
        success = FL.common.is_ValidDate(xVar);
        ok(success === true, "FL.common.is_ValidDate('21/03/2012') -->'DMY europe true'");//13

        xVar = "21-Mar-2012";
        success = FL.common.is_ValidDate(xVar);
        ok(success === true, "FL.common.is_ValidDate('21-Mar-2012') -->'true'");//14

        xVar = "21/Mar/12";
        success = FL.common.is_ValidDate(xVar);
        ok(success === true, "FL.common.is_ValidDate('21/Mar/12') -->'true'");//15

        xVar = "03 21 2012";
        success = FL.common.is_ValidDate(xVar);
        ok(success === true, "FL.common.is_ValidDate('03 21 2012') -->'true MDY'");//16

        xVar = "Stage Paris 2014";
        success = FL.common.is_ValidDate(xVar);
        ok(success === false, "FL.common.is_ValidDate('Stage Paris 2014') -->'false'");//17

        xVar = "209999";
        success = FL.common.is_ValidDate(xVar);
        ok(success === false, "FL.common.is_ValidDate('209999') -->'false'");//18

        //------------------- currencyToStringNumber
        FL.common.appsettings.radixpoint = ",";
        xVar = "€ 12345,67";
        var result = FL.common.currencyToStringNumber(xVar);
        ok(result == "12345.67", "FL.common.currencyToStringNumber('" + xVar + "') -->radixpoint=','-->" + result + "' --------------------------->FL.common.currencyToStringNumber");//67
        xVar = "kr. 9.734.123,45";
        result = FL.common.currencyToStringNumber(xVar);
        ok(result == "9734123.45", "FL.common.currencyToStringNumber('" + xVar + "') -->radixpoint=','-->" + result + "'");
        xVar = "9.734.123,45 kr.";
        result = FL.common.currencyToStringNumber(xVar);
        ok(result == "9734123.45", "FL.common.currencyToStringNumber('" + xVar + "') -->radixpoint=','-->" + result + "'");

        xVar = "-9.734.123,45 kr.";
        result = FL.common.currencyToStringNumber(xVar);
        ok(result == "-9734123.45", "FL.common.currencyToStringNumber('" + xVar + "') -->radixpoint=','-->" + result + "' --- negative value");

        xVar = "£-9.734.123,45 GBP";
        result = FL.common.currencyToStringNumber(xVar);
        ok(result == "-9734123.45", "FL.common.currencyToStringNumber('" + xVar + "') -->radixpoint=','-->" + result + "' --- negative value");

        xVar = "-11,33";
        result = FL.common.currencyToStringNumber(xVar);
        ok(result == "-11.33", "FL.common.currencyToStringNumber('" + xVar + "') -->radixpoint=','-->" + result + "'");

        FL.common.appsettings.radixpoint = ":";
        xVar = "€ 12345:67";
        var result = FL.common.currencyToStringNumber(xVar);
        ok(result ===null, "FL.common.currencyToStringNumber('" + xVar + "') -->radixpoint=':'-->" + result + "'  not a valid number");//67

        FL.common.appsettings.radixpoint = ",";
        //FL.common.appsettings.thousandsSeparator = "_";
        xVar = "€ 12345,67";
        var result = FL.common.currencyToStringNumber(xVar);
        ok(result == "12345.67", "FL.common.currencyToStringNumber('" + xVar + "') -->radixpoint=':'-->" + result + "'");//67


        FL.common.appsettings.radixpoint = ".";
        xVar = "Din. 1,235.45";
        result = FL.common.currencyToStringNumber(xVar);
        ok(result == "1235.45", "FL.common.currencyToStringNumber('" + xVar + "') -->radixpoint='.'-->" + result + "'");
        xVar = "1,235.45 Din";
        result = FL.common.currencyToStringNumber(xVar);
        ok(result == "1235.45", "FL.common.currencyToStringNumber('" + xVar + "') -->radixpoint='.'-->" + result + "'");

        FL.common.appsettings.radixpoint = ",";
        // FL.common.formatStringNumberWithMask needs a pre-existent dom div with id="_freeSlots" .this was created in index.html under qunit-fixture
        xVar = "1234.56";
        result = FL.common.formatStringNumberWithMask(xVar, "99-AAA-999");
        ok(result == "12-AAA-345", "FL.common.formatStringNumberWithMask('" + xVar + "') -->radixpoint='.'-->" + result + "'");

        result = FL.common.formatStringNumberWithMask(xVar, "999-HELLO-999-OK");
        ok(result == "123-HELLO-456-OK", "FL.common.formatStringNumberWithMask('" + xVar + "') -->radixpoint='.'-->" + result + "'");

        result = FL.common.formatStringNumberWithMask(xVar, "99999-HELLO-999-OK");
        ok(result == "12345-HELLO-6__-OK", "FL.common.formatStringNumberWithMask('" + xVar + "') -->radixpoint='.'-->" + result + "'");

        success = FL.common.isNumberSep('4,294,967,295.00', ',');
        ok(success === true, "FL.common.isNumberSep('4,294,967,295.00', ',') -->'true'");//22
        success = FL.common.isNumberSep('4.294.967.295,00', '.');
        ok(success === true, "FL.common.isNumberSep('4.294.967.295,00', '.') -->'true'");//23
        success = FL.common.isNumberSep('4 294 967 295,00', ' ');
        ok(success === true, "FL.common.isNumberSep('4 294 967 295,00', ' ') -->'true'");//24
        success = FL.common.isNumberSep('4,294,,967,295.00', ',');
        ok(success === false, "FL.common.isNumberSep('4,294,,967,295.00', ',') -->'false'");//25
        success = FL.common.isNumberSep('4,294 967,295.00', ',');
        ok(success === false, "FL.common.isNumberSep('4,294 967,295.00', ',') -->'false'");//26
        success = FL.common.isNumberSep('4 294  967 295,00', ',');
        ok(success === false, "FL.common.isNumberSep('4 294  967 295,00', ',') -->'false'");//27
        success = FL.common.isNumberSep('1234567', ',');
        ok(success === true, "FL.common.isNumberSep('1234567', ',') -->'true'");//28
        success = FL.common.isNumberSep('1234567', '.');
        ok(success === true, "FL.common.isNumberSep('1234567', '.') -->'true'");//29
        success = FL.common.isNumberSep('1234567', ' ');
        ok(success === true, "FL.common.isNumberSep('1234567', ' ') -->'true'");//30

        success = FL.common.isNumberSep('1234567.12', ',');
        ok(success === true, "FL.common.isNumberSep('1234567.12', ',') -->'true'");//31
        success = FL.common.isNumberSep('1234567.12', '.');//This is ambiguous =>interpret has US number without separators
        ok(success === true, "FL.common.isNumberSep('1234567.12', '.') -->'true'");//32
        success = FL.common.isNumberSep('1234567', ' ');
        ok(success === true, "FL.common.isNumberSep('1234567.12', ' ') -->'true'");//33

        success = FL.common.isNumberSep('1234567,12', ',');
        ok(success === true, "FL.common.isNumberSep('1234567,12', ',') -->'true'");//34
        success = FL.common.isNumberSep('1234567,12', '.');//if sep="." =>decimal = "," =>TRUE
        ok(success === true, "FL.common.isNumberSep('1234567,12', '.') -->'true'");//35
        success = FL.common.isNumberSep('1234567,12', ' ');//if sep=" " =>France decimal = "," =>TRUE
        ok(success === true, "FL.common.isNumberSep('1234567,12', ' ') -->'true'");//36

        success = FL.common.isNumberSep('1a4567,12', ',');
        ok(success === false, "FL.common.isNumberSep('1a4567,12', ',') -->'false'");//37
        success = FL.common.isNumberSep('1a4567,12', '.');
        ok(success === false, "FL.common.isNumberSep('1a4567,12', '.') -->'false'");//38
        success = FL.common.isNumberSep('1a4567,12', ' ');
        ok(success === false, "FL.common.isNumberSep('1a4567,12', ' ') -->'false'");//39

        success = FL.common.isNumberSep('abc12', ',');
        ok(success === false, "FL.common.isNumberSep('abc12', ',') -->'false'");//40
        success = FL.common.isNumberSep('abc12', '.');
        ok(success === false, "FL.common.isNumberSep('abc12', '.') -->'false'");//41
        success = FL.common.isNumberSep('abc12', ' ');
        ok(success === false, "FL.common.isNumberSep('abc,12', ' ') -->'false'");//42
        success = FL.common.isNumberSep('1.000,3', ',');
        ok(success === false, "FL.common.isNumberSep('1.000,3', ',') -->'false'");//43
        success = FL.common.isNumberSep('1,000.3', ',');
        ok(success === true, "FL.common.isNumberSep('1.000,3', ',') -->'true'");//44
        success = FL.common.isNumberSep('1 000.3', ' ');
        ok(success === false, "FL.common.isNumberSep('1 000.3', ' ') -->'false'");//45
        success = FL.common.isNumberSep('1 000,3', ' ');
        ok(success === true, "FL.common.isNumberSep('1 000,3', ' ') -->'true'");//46
        success = FL.common.isNumberSep('1,000 3', ' ');
        ok(success === false, "FL.common.isNumberSep('1,000 3', ' ') -->'false'");//47

        arrOfRowValues = [
            "4.294.967.295,00",
            "1000",
            "1000,3",
            "0,324",
            "-27,2 "
        ];
        var xRet = FL.common.getArrNumberFormat(arrOfRowValues);
        ok(xRet.number === true && xRet.format == "de", "FL.common.getArrNumberFormat(arrOfRowValues) -->'number:true, format:'de'");//48
        arrOfRowValues = [
            "4.294.967.295,00",
            "1000",
            "1000,3",
            "0,,324",
            "-27,2 "
        ];
        xRet = FL.common.getArrNumberFormat(arrOfRowValues);
        ok(xRet.number === false && xRet.format === null, "FL.common.getArrNumberFormat(arrOfRowValues) -->'number:false, format:null ");//49
        arrOfRowValues = [
            "-4294",
            "1000",
            "1000,3",
            "0,324",
            "-27,2 "
        ];
        xRet = FL.common.getArrNumberFormat(arrOfRowValues);
        ok(xRet.number === true && xRet.format == "de", "FL.common.getArrNumberFormat(arrOfRowValues) -->'number:true, format:'de'");//50
        arrOfRowValues = [
            "-4294",
            "1 000 102",
            "1000,3",
            "0,324",
            "-27,2"
        ];
        xRet = FL.common.getArrNumberFormat(arrOfRowValues);
        ok(xRet.number === true && xRet.format == "fr", "FL.common.getArrNumberFormat(arrOfRowValues) -->'number:true, format:'fr'");//51
        arrOfRowValues = [
            "-4294",
            "1,000,102",
            "1000,3",//this is Us format (comma is a separator)..it could also be "de" format
            "0,324",
            "-27,2"
        ];
        xRet = FL.common.getArrNumberFormat(arrOfRowValues);
        ok(xRet.number === true && xRet.format === "us", "FL.common.getArrNumberFormat(arrOfRowValues) -->'number:false, format:'us'");//52
        arrOfRowValues = [
            "-4294",
            "1,000,102",
            "1000.3",//this is Us format (comma is a decimal )..it could also be "de" format
            "0.324",
            "-27"
        ];
        xRet = FL.common.getArrNumberFormat(arrOfRowValues);
        ok(xRet.number === true && xRet.format == "us", "FL.common.getArrNumberFormat(arrOfRowValues) -->'number:true, format:'us'");//53

        arrOfRowValues = [
            "-4294",
            "1,000,102",//us
            "1.000,3",
            "0.324",
            "-27"
        ];
        xRet = FL.common.getArrNumberFormat(arrOfRowValues);
        ok(xRet.number === false && xRet.format === null, "FL.common.getArrNumberFormat(arrOfRowValues) -->'number:false, format:null");//54

        success = FL.common.is_oneOfCharsInString('abc12', '*1');
        ok(success === true, "is_oneOfCharsInString('abc12', '*1') -->'true'");//55
        success = FL.common.is_oneOfCharsInString('1 102 200', ', ');
        ok(success === true, "is_oneOfCharsInString('1 102 200', ', ') -->'true'");//56
        success = FL.common.is_oneOfCharsInString('1 102 200', '.,');
        ok(success === false, "is_oneOfCharsInString('1 102 200', '.,') -->'false'");//57

        success = FL.common.localeStringToNumber('1,002,003.4', 'us');
        ok(success === 1002003.4, "localeStringToNumber('1,002,003.4', 'us') -->1002003.4");//58
        success = FL.common.localeStringToNumber('1.002.003,4', 'de');
        ok(success === 1002003.4, "localeStringToNumber('1.002.003,4', 'de') -->1002003.4");//59
        success = FL.common.localeStringToNumber('1 002 003,4', 'fr');
        ok(success === 1002003.4, "localeStringToNumber('1 002 003 4', 'fr') -->1002003.4");//60
        success = FL.common.localeStringToNumber('1.002.003', 'de');
        ok(success === 1002003, "localeStringToNumber('1.002.003', 'de') -->1002003");//61
        success = FL.common.localeStringToNumber('1 002 003', 'fr');
        ok(success === 1002003, "localeStringToNumber('1 002 003', 'fr') -->1002003");//62
        success = FL.common.localeStringToNumber('-1 002 003,4', 'fr');
        ok(success === -1002003.4, "localeStringToNumber('-1 002 003,4', 'fr') -->1002003.4");//63
        //extreme values
        success = FL.common.localeStringToNumber(3.8, 'us');
        ok(success === 3.8, "localeStringToNumber(3.8, 'us') -->3.8");//64
        success = FL.common.localeStringToNumber('3.8', 'xx');
        ok(success === 3.8, "localeStringToNumber('3.8', 'xx') -->3.8");//65
        success = FL.common.localeStringToNumber('3,8', 'xx');
        ok(success === 0, "localeStringToNumber('3,8', 'xx') -->0");//66
        success = FL.common.localeStringToNumber('3.8,23.3', 'us');
        ok(success === 0, "localeStringToNumber('3.8,23.3', 'us')) -->0");//67

        arrOfRowValues = [
            "-4294",
            "1,000,102",//us
            "1.000,3",
            "0.324",//is already in a valid format
            "-27"
        ];
        success = FL.common.convertStringVectorToNumber(arrOfRowValues, 'de');
        var okResult = [-4294, 0, 1000.3, 0.324, -27];
        ok(JSON.stringify(success) === JSON.stringify(okResult), "convertStringVectorToNumber(arrOfRowValues, 'de') -->ok");//68

        arrOfRowValues = [
            "-4294",
            "1 000 102",
            "1 000,3",
            "0,324",
            "-27"
        ];
        success = FL.common.convertStringVectorToNumber(arrOfRowValues, 'fr');
        okResult = [-4294, 1000102, 1000.3, 0.324, -27];

        ok(JSON.stringify(success) === JSON.stringify(okResult), "convertStringVectorToNumber(arrOfRowValues, 'fr') -->ok for format mismatch");//69

        success = FL.common.convertStringVectorToNumber(arrOfRowValues, 'de');
        okResult = [-4294, 0, 0, 0.324, -27];
        ok(JSON.stringify(success) === JSON.stringify(okResult), "convertStringVectorToNumber(arrOfRowValues, 'de') -->ok for format mismatch");//70

        success = FL.common.convertStringVectorToNumber(arrOfRowValues, 'us');
        okResult = [-4294, 0, 0, 324, -27];
        ok(JSON.stringify(success) === JSON.stringify(okResult), "convertStringVectorToNumber(arrOfRowValues, 'us') -->ok for format mismatch");//71
        arrOfRowValues = [
            "-4294",
            "1.a00.102",
            "1.000,3",
            "0,324",
            "-27"
        ];
        success = FL.common.convertStringVectorToNumber(arrOfRowValues, 'de');
        okResult = [-4294, 0, 1000.3, 0.324, -27];
        ok(JSON.stringify(success) === JSON.stringify(okResult), "convertStringVectorToNumber(arrOfRowValues, 'de') -->ok for 'a' among numbers");//72
        var structure = {
            "root": {
                "name": "Main Level",
                nodes: {
                    "node1": {
                        "name": "Node 1"
                    },
                    "node2": {
                        "name": "Node 2"
                    },
                    "node3": {
                        "name": "Node 3"
                    }
                }
            },
            "zz": 132,
            "zzText": "abcde",
            "abc": {
                abcFirst: {
                    insideAbcFirst: {x: 32, y: 27},
                    abcFunc: function () {
                        alert("abcFunc");
                    },
                    insideAbcFirstB: {
                        x: 32,
                        y: 27,
                        z: {a: 1, b: 2}
                    },
                },
                z: 32,
                abcSecond: {name: "jojo", address: "Street A"}
            }
        };
        FL.common.setParent(structure);
        assert.deepEqual(structure.root.nodes.node3, {
            name: "Node 3",
            parent: structure.root.nodes
        }, "FL.common.setParent()- added a parent to structure.root.nodes.node3");
        assert.deepEqual(structure.root.nodes.node3.parent.parent.parent.zz, 132, "FL.common.setParent()- structure.root.nodes.node3.parent.parent.parent.zz=132");
        assert.deepEqual(structure.root.nodes.node3.parent.parent.parent.abc.z, 32, "FL.common.setParent()-structure.root.nodes.node3.parent.parent.parent.zz=32");
        assert.deepEqual(structure.abc, structure.abc.abcFirst.parent, "FL.common.setParent()- structure.abc=structure.abc.abcFirst.parent");
        assert.deepEqual(structure.abc.abcFirst.insideAbcFirstB, structure.abc.abcFirst.insideAbcFirst.parent.insideAbcFirstB, "FL.common.setParent()- accessing brother - a child of the parent");
        assert.deepEqual(structure.abc.abcSecond, structure.abc.abcFirst.insideAbcFirst.parent.parent.abcSecond, "FL.common.setParent()- accessing oncle - a child of the grand parent");
        assert.deepEqual(structure.abc.abcFirst.insideAbcFirst.parent.parent.abcSecond.name, "jojo", "FL.common.setParent()- accessing 'jojo' from structure.abc.abcFirst.insideAbcFirst");


        var objToSend = {a: 10, b: 20, c: 30};
        FL.common.setParametersTo("abc", objToSend);
        // before get "abc" entry exists in FL.common.generalParametersObj
        var z = FL.common.generalParametersObj["abc"];
        ok(FL.common.typeOf(z) == "object", " FL.common.setParametersTo('abc',{}) creates a abc buffer -->ok");//68

        var result = FL.common.getParametersFrom("abc");//returns the same object as {a:10,b:20,c:30} (same reference)
        var z = FL.common.generalParametersObj["abc"];
        var zz = FL.common.typeOf(z);
        // after get "abc" entry is deleted from  FL.common.generalParametersObj
        ok(FL.common.typeOf(z) == "undefined", " FL.common.getParametersFrom('abc') deletes  abc buffer -->ok");//68
        //QUnit.inArray(result, [10,20,30], ' FL.common.getParametersFrom returned 10,20,30 +JSON.stringify(list)' );
        assert.deepEqual(result, objToSend, "FL.common.getParametersFrom returned " + JSON.stringify(objToSend));


        FL.common.setParametersTo("abc", {p1: {name: "jojo", address: "Nairobi"}, p2: [10, 20, 30]});
        ok(FL.common.getParametersFrom("abc").p1.name == "jojo", " FL.common.getParametersFrom('abc').p1.name = 'jojo' -->ok");//68
        //
        FL.common.setParametersTo("abc", {p1: {name: "jojo", address: "Nairobi"}, p2: [10, 20, 30]});
        // We had to resend ->REMEBER THAT getParametersFrom CAN BE USED ONLY ONCE FOR EACH BUFFER NAME (it is deleted after each getParametersFrom()
        ok(FL.common.getParametersFrom("abc").p2[1] == 20, " FL.common.getParametersFrom('abc').p2[1] = 20 -->ok");//68

    });

});