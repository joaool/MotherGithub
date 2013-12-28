define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/dom",
    "dojo/dom-style",
    "/pdojo/M19/Mother/area.js"
], function(declare,lang,dom,domStyle,area){
    return declare(area,{
        //http://dojotoolkit.org/reference-guide/1.9/dojo/_base/declare.html
        //http://dojotoolkit.org/reference-guide/1.9/dojo/_base/lang.html#mixins-with-classes
        //https://dojotoolkit.org/reference-guide/1.9/dijit/_editor/plugins/TextColor.html
        fontSize:null,
        isItalic:false,
        isBold:false,
        fontFamily:"arial",
        constructor: function(args) {
            // The "constructor" method is special: the parent class (area)constructor is called automatically before this one.
            lang.mixin(this, args);//mixin is used to mix an object-hash of properties passed has argument with default values in the class 
            this.fontSize = this.height;
            this.setFontSize(this.fontSize);
        },
        setFontSize:function(size){//notice that when border changes fontSize must change to fit the border
            this.fontSize = size;
            this.updateVisualRepresentation("fontSize", size); //so that edition fits inside border              
        },
        toggleItalic:function(isItalic){
            this.isItalic = isItalic;
            if (isItalic)
                this.updateVisualRepresentation("fontStyle", "italic");
            else
                this.updateVisualRepresentation("fontStyle", "normal");
        },
        toggleBold:function(isBold){
            this.isBold = isBold;
            if (isBold)
                this.updateVisualRepresentation("fontWeight", "bold");
            else
                this.updateVisualRepresentation("fontWeight", "normal");
        },
        setFontFamily:function(fontFamily){//"arial","verdana","Georgia","Times New Roman","Comic Sans MS","Palatino Linotype","Impact,Charcoal,sans-serif"
            this.fontFamily = fontFamily;
            alert("area_text Class - setFontFamily not implemented !!!");
        }
    });
}); //end of  module  