define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/window",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dijit/layout/ContentPane",//--
    "/pdojo/M19/Mother/area.js"
], function(declare,lang,win,domStyle,domConstruct,ContentPane,area){
    //return declare(null,{
    return declare(area,{
        name:"",
        //viewPort:{l:100,t:100,w:200,h:100},
        //borderColor:"black",
        //borderType:"solid",
        //borderThickness:1,
        floatF:"nonFloat", //"nonFloat" => form in pane, "modal" =>modal floating form,  "nonModal" => floating form
        children:[],
        parentId:0,//id numer of the parent container or 0 if none 
        dojoObject:null,

        // obj:null,//the dojo object 
        constructor: function(containerProperties){
           // The "constructor" method is special: the parent class areaWithText and area constructor are called automatically before this one.
            console.log("container class BEGIN OF CONSTRUCTOR");
            var allPossibleProperties={value:"", name:"", required:false, invalidMessage:"Error...please correct",
                missingMessage:"Must have a value !", regExp:"[^\t]*", preCode:"", posCode:"", changeCode:"", pattern:"0.###", disable:false,
                disabled:false, title:"@|", headers:"", placeHolder:"", propercase:false, readOnly:false, template:null, zIndex:0};
            declare.safeMixin(allPossibleProperties,this.left, this.top, this.width, this.height);//priority to inherited defaults  
            if (containerProperties)
                declare.safeMixin(allPossibleProperties,containerProperties);
            console.log("INSIDE CONTAINER id="+this.id+" left="+this.left+" top="+this.top+" width="+this.width+" height="+this.height);
            
            var paneDivId="_PaneDiv" + this.id;
            //var paneDivId = this.domId;
            var paneDiv = domConstruct.create("div");
            //var xDivId=this.prefix+"_PaneDiv";
            paneDiv.innerHTML="<div id='"+paneDivId+"'></div>";
            win.body().appendChild(paneDiv);//places paneDiv in DOM

            var paneStyleProperty = "position:absolute; left:" + this.left +"px;top:"+ this.top +"px;width:"+ this.width +"px;height:";
            paneStyleProperty+= this.height +"px; padding:0px; overflow: visible; border: "+ this.borderThickness +"px "+ this.borderStyle +" "+this.borderColor+";'";
            this.dojoObject = new ContentPane({ //x Pane is a form variable. we need this to do a this.xPane.startup() necessary for tabs - to avoid 3 bar probelm
                id: this.domId,
                content: "",
                //style:'position:absolute;left:800px;top:5px;width:200px;height:30px;border: 1px dotted green;'
                style: paneStyleProperty
            }, paneDivId); //content Pane is placed over the div with name paneDivId
            //this.setBorder({borderThickness: 5});            
            console.log("container class END OF CONSTRUCTOR");
        },
        XXXXaddChild: function(widgetType, properties){
            var indexes = {"textBox": 0, "label":1, "numberBox":2,"textArea":3,"checkBox":4,"dateTextBox":5,"button":6,"comboBox":7,"grid":8,"tabs":9,"picture":10,"door":11,"summary":12,"services":100,"buttonS1":101,"buttonS2":102,"_btnSubmit":103,"_btnSearch":104,"_btnNew":105,"_btnDelete":106};
            var xInt = indexes[xType];
            if (xInt === null)
                alert("fBuilder.counterIndex: the type " + xType + " is unknown");
            children.push(oObj);
        },
        addExistingChild: function(childrenArr){
            //this.changeFromAbsoluteCoordinatesToContainerCoordinates(childrenArr);
            this.children = this.children.concat(childrenArr);
        },
        moveTo: function(newCoordinates){//overrides the area moveTo() method
            //declare.safeMixin(this.viewPort,newViewPort);
            var leftDelta = newCoordinates.left - this.left;
            var topDelta = newCoordinates.top - this.top;
            this.moveAllWidgetsByDelta({left: leftDelta, top: topDelta});
            // declare.safeMixin({left: this.left, top: this.top}, newCoordinates);
            this.inherited(arguments);//the magic call to parent class
        },
        moveAllWidgetsByDelta: function(deltaCoordinates){
            for(var i = 0; i < this.children.length; i++){
                this.children[i].moveTo({
                    left: this.children[i].left + deltaCoordinates.left,
                    top: this.children[i].top + deltaCoordinates.top});
            }
        },



        resizeViewPort: function(newPositions){//{l:xL,t:xT,w:xW,h:xH}
            //declare.safeMixin(this.viewPort,newViewPort);
            declare.safeMixin({left: this.left, top: this.top, width: this.width, height: this.height}, newPositions);
            this.redisplayAllWidgets();
        },    
        changeFromAbsoluteCoordinatesToContainerCoordinates: function(ArrayOfWidgetObjects){
            for(var i = 0; i < ArrayOfWidgetObjects.length; i++){
                ArrayOfWidgetObjects[i].left -= this.left;
                ArrayOfWidgetObjects[i].top -= this.top;
            };
        },
        redisplayAllWidgets: function(){
            //var domId=null;
            for(var i = 0; i < this.children.length; i++){
                domId = this.children[i].domId;
                domStyle.set(domId,"left",this.left+this.children[i].left);
                domStyle.set(domId,"top",this.top+this.children[i].top);
            };
        },
        topAreaUnderMouse: function(mouseEvent){

        },    
        topWidgetUnderMouse: function(mouseEvent){
            var topChild = null;
            for(var i = 0; i < this.children.length; i++){
                if(this.children[i].isUnderMouse(mouseEvent))
                    if(this.children[i].zIndex > topChild.zIndex) 
                        topChild = this.children[i];
            };
            if(topChild.isContainer)
                return topChild.topWidgetUnderMouse();
        },
        isUnderMouse: function(e){
            var x = e.pageX;
            var y = e.pageY;
            // code here
        }    
    });
}); //end of  module  