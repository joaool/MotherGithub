//define(["doh/runner"], function(doh) {
define([
    "doh",
    "dojo/dom",
    "dojo/dom-construct",
    "dijit/registry",
    "simple/Mother/textbox",
    "simple/Mother/numberbox",
    "simple/Mother/container",
    "simple/Mother/areasFactory"
    ], function(doh,dom,domConstruct,registry,textbox,numberbox,container,areasFactory){
    doh.register("textbox 101",{
        "Should instantiate successfully":{
            setUp:function(){
                this.txt = new textbox({left:500, top:150, width:340, height:300, value:"Michael"});
            },
            runTest:function(){
            }
        },
        "Should return value,left,top,width and weight":{
            setUp:function(){
                this.txt = new textbox({left:500, top:150, width:340, height:300, value:"Michael"});
            },
            runTest:function(){
                doh.assertEqual("Michael", this.txt.value);
                doh.assertEqual("500", this.txt.left);
                doh.assertEqual("150", this.txt.top);
                doh.assertEqual("340", this.txt.width);
                doh.assertEqual("300", this.txt.height);
            }
        },
        "Should return default values left,top,width,height":{
            setUp:function(){
                this.txt = new textbox({value:"Michael"});
            },
            runTest:function(){
                doh.assertEqual("500", this.txt.left);
                doh.assertEqual("100", this.txt.top);
                doh.assertEqual("100", this.txt.width);
                doh.assertEqual("30", this.txt.height);
            }
        },
        "Should set border thickness to 5 and color to blue":{
            setUp:function(){
                this.txt = new textbox({left:500, top:100, width:300, height:300, value:"Pukas"});
                this.txt.setBorder({borderThickness:5, borderColor:"blue"});
            },
            runTest:function(){
                doh.assertEqual("5", this.txt.borderThickness);
                doh.assertEqual("blue", this.txt.borderColor);
            }
        },
        "Should move to new position":{
            setUp:function(){
                this.txt = new textbox({left:500, top:100, width:300, height:300, value:"Pukas"});
                this.txt.moveTo({left:1000, top:200});
            },
            runTest:function(){
                doh.assertEqual("1000", this.txt.left);
                doh.assertEqual("200", this.txt.top);
            }
        }
    });
    doh.register("numberbox 101",{
        "Should instantiate successfully":{
            setUp:function(){
                this.n = new numberbox({left:500, top:150, width:340, height:300, value:129.2});
            },
            runTest:function(){
            }
        },
        "Should return value,left,top,width and weight":{
            setUp:function(){
                this.n = new numberbox({left:501, top:150, width:340, height:300, value:129.2});
                doh.assertEqual("501", this.n.left);
                doh.assertEqual("150", this.n.top);
                doh.assertEqual("340", this.n.width);
                doh.assertEqual("300", this.n.height);
            },
            runTest:function(){
                 console.log("===========================>value="+this.n.value);
                 doh.assertEqual(129.2, this.n.value);
            }
        },
        "Should return default values left,top,width,height":{
            setUp:function(){
                this.n = new numberbox({value:129.2});
            },
            runTest:function(){
                doh.assertEqual("500", this.n.left);
                doh.assertEqual("100", this.n.top);
                doh.assertEqual("100", this.n.width);
                doh.assertEqual("30", this.n.height);
            }
        },
        "Should set border thickness to 5 and color to blue":{
            setUp:function(){
                this.n = new numberbox({left:500, top:100, width:300, height:300, value:129.2});
                this.n.setBorder({borderThickness:5, borderColor:"blue"});
            },
            runTest:function(){
                 doh.assertEqual("5", this.n.borderThickness);
                 doh.assertEqual("blue", this.n.borderColor);
            }
        }
    });
    doh.register("General widgets",{
        "Should return counters for area,textboxes,numberboxes":{
            setUp:function(){
                //http://kevinandre.com/dev/jsunittest-amd-doh-1/
                this.af = new areasFactory();//this generates a baseContainer
                this.num1 = this.af.createNumberbox({left:500, top:50, width:340, height:100, value:129.2, borderColor:"purple"});
                this.num2 = this.af.createNumberbox({left:1000, top:50, width:340, height:50, value:123});
                this.txt1 = this.af.createTextbox({left:100, top:50, width:340, height:300, value:"junkas"});
            },
            runTest:function(){
                doh.assertEqual("4", this.af.lastAreaOrder);
                doh.assertEqual("1", this.af.lastTextboxOrder);
                doh.assertEqual("2", this.af.lastNumberboxOrder);
            }
        },
    });
    doh.register("containers 101", {
        //http://kevinandre.com/dev/jsunittest-amd-doh-1/ ---//define(["doh","simple/Mother/textbox"], function(doh,textbox) {
        "Should instantiate succesfully":{
            setUp:function(){
                this.af = new areasFactory();
                this.c1 = this.af.createContainer({left: 450, top: 100, width: 240, height: 150,borderColor: "red"});
                this.c1.setBorder({borderThickness: 10, borderColor: "green"});
            },
            runTest:function(){
                doh.assertEqual("green", this.c1.borderColor,"The container does not remember borderColor: 'green'");
                doh.assertEqual("10", this.c1.borderThickness);
                doh.assertEqual("450", this.c1.left);
                doh.assertEqual("100", this.c1.top);
                doh.assertEqual("240", this.c1.width);
                doh.assertEqual("150", this.c1.height);
            }
        },
        "free container: set borderThickness to 10 and borderColor to green":{
            setUp:function(){
                this.c1 = container({left: 680, top: 140, width: 500, height: 250, borderThickness: 7, borderColor: "red"});
                this.c1.setBorder({borderThickness: 10, borderColor: "green"});
            },
            runTest:function(){
                doh.assertEqual("10", this.c1.borderThickness,"The container does nor remember borderThickness: 10");
                doh.assertEqual("green", this.c1.borderColor, "The container does nor remember borderColor: 'green'");
            }
        },
        "change # of children and containerParent.name on addExistingChild() ": {
            setUp:function(){
                this.af = new areasFactory();
                this.c1 = this.af.createContainer({left: 450, top: 100, width: 240, height: 150,borderColor: "red"});
                this.num1 = this.af.createNumberbox({left:500, top:50, width:340, height:100, value:129.2, borderColor:"purple"});
                this.txt1 = this.af.createTextbox({left:500, top:50, width:340, height:100, value:129.2, borderColor:"purple"});
                this.c1.addExistingChild([this.num1,this.txt1]);
            },
            runTest: function() {
                doh.assertEqual("2", this.c1.children.length);
                doh.assertEqual("container1", this.num1.containerParent.name);//"container1" is the default name for the first container
            }
        },
        "zIndex should change when we addExistingChild to container": {
            setUp:function(){
                this.af = new areasFactory();
                this.c1 = this.af.createContainer({left: 567+10, top: 78+10, width: 500, height: 500,borderColor: "red"});//zIndex=0
                this.num1 = this.af.createNumberbox({left: 567+20, top: 78+20, width:100, height:30, value:129.2, borderColor:"purple"});//zIndex=1
                this.c1.addExistingChild([this.num1]);//num1.zIndex=1
                this.c2 = this.af.createContainer({left: 567+30, top: 78+30, width: 400, height: 400,borderColor: "blue"});//zIndex=0
                this.num2 = this.af.createNumberbox({left: 567+40, top: 78+40, width: 100, height: 30, value:129.2, borderColor:"purple"});//zIndex=0
                this.c2.addExistingChild([this.num2]);//num2.zIndex=1
                this.c1.addExistingChild([this.c2]);//c2.zIndex=2, num2.zIndex=3
            },
            runTest: function() {
                // doh.assertEqual("23", this.c1.zIndex);
                doh.assertEqual("3", this.num2.zIndex);
            } 
        }           
     });
    doh.register("DOH test 4 release Model ", [
        //http://kevinandre.com/dev/jsunittest-amd-doh-1/ ---//define(["doh","simple/Mother/textbox"], function(doh,textbox) {
        function assertTrueTest() {
            doh.assertTrue(true);
            doh.assertFalse(false);
            doh.assertEqual("Kevin", String('Kevin'));
            doh.assertNotEqual("Kevin", String('Kevin A'));
        }
    ]);
});