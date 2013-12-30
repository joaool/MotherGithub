define([
    "dojo/_base/declare",
    "dijit/registry",
    "/pdojo/MotherGitHub/Mother/textbox.js",
    "/pdojo/MotherGitHub/Mother/numberbox.js",
    "/pdojo/MotherGitHub/Mother/container.js",
], function(declare,registry,textbox,numberbox,container) {
    return declare(null,{
        lastAreaOrder:0,
        lastTextboxOrder:0,
        lastNumberboxOrder:0,
        lastContainerOrder:-1, //0 is reserved for the base container
        baseContainer:null,
        constructor: function(baseContainer) {
            var canvasContainer = registry.byId("_1"); //to destroy a dijit widget by id
            if(canvasContainer){
                // alert("You attemped to recreate the canvas, but canvas already exists !!!");
                throw new Error("You attemped to recreate the canvas, but canvas already exists !!!");
            }
            var left = 0;
            var top = 0;
            var width = window.screen.width;
            var height = window.screen.height;
            //alert("width="+width+" height="+height);
            //baseContainer = this.createContainer({name: "canvas", left: left, top: top, width: width, height: height, zIndex: 0, borderColor: "blue"});
            this.baseContainer = this.createContainer({name: "canvas", left: left, top: top, width: width, height: height});
            var z=32;
         },
        createTextbox: function(widgetProperties) {//always refer to a container if no container is present default container is selected
            //alert("OBJECT "+widgetProperties+" value="+widgetProperties.value);
            console.log("------------------------------------------>createTextbox");
            this.lastAreaOrder++;
            this.lastTextboxOrder++;
            //id will be used inside dojo objects, domId will be used to access dom outside dojo...
            declare.safeMixin(widgetProperties, {domId:  "widget_id" + this.lastAreaOrder, id:"_"+this.lastAreaOrder, areaOrder:this.lastAreaOrder });
            //we verify wich zIndex should be selected for the current area
            //we need to know the zIndex of the top area (if any) under the area being constructed
            return new textbox(widgetProperties);
        },
        createNumberbox: function(widgetProperties) {
            console.log("------------------------------------------>createNumberbox");
            this.lastAreaOrder++;
            this.lastNumberboxOrder++;
            declare.safeMixin(widgetProperties, {domId:  "widget_id" + this.lastAreaOrder, id:"_"+this.lastAreaOrder, areaOrder:this.lastAreaOrder });
            return new numberbox(widgetProperties);
        },
        createContainer: function(containerProperties) {
            console.log("------------------------------------------>createContainer");
            this.lastAreaOrder++;
            this.lastContainerOrder++;
            declare.safeMixin(containerProperties, {domId:  "container_id" + this.lastContainerOrder, id:"_"+this.lastAreaOrder,  areaOrder:this.lastAreaOrder });
            return new container(containerProperties);
        }
    });
}); //end of  module  