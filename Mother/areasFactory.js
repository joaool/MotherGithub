define([
    "dojo/_base/declare",
    "/pdojo/M19/Mother/textbox.js",
    "/pdojo/M19/Mother/numberbox.js",
    "/pdojo/M19/Mother/container.js",
], function(declare,textbox,numberbox,container) {
    return declare(null,{
        lastAreaOrder:0,
        lastTextboxOrder:0,
        lastNumberboxOrder:0,
        lastContainerOrder:0,
        constructor: function() {

         },
        createTextbox: function(widgetProperties) {//always refer to a container if no container is present default container is selected
            //alert("OBJECT "+widgetProperties+" value="+widgetProperties.value);
            this.lastAreaOrder++;
            this.lastTextboxOrder++;
            declare.safeMixin(widgetProperties, {domId:  "widget_id" + this.lastAreaOrder});
            return new textbox(widgetProperties);
        },                  
        createNumberbox: function(widgetProperties) {
            this.lastAreaOrder++;
            this.lastNumberboxOrder++;
            declare.safeMixin(widgetProperties, {domId:  "widget_id" + this.lastAreaOrder});
            return new numberbox(widgetProperties);
        },                  
        createContainer: function(containerProperties) {
            this.lastAreaOrder++;
            this.lastContainerOrder++;
            declare.safeMixin(containerProperties, {domId:  "container_id" + this.lastContainerOrder});
            return new container(containerProperties);
        }
    });
}); //end of  module  