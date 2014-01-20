define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/dom",
    "dojo/dom-style",
    "/pdojo/MotherGitHub/Mother/area.js",
], function(declare,lang,dom,domStyle,area){
    return declare(area,{
        //http://dojotoolkit.org/reference-guide/1.9/dojo/_base/declare.html
        //http://dojotoolkit.org/reference-guide/1.9/dojo/_base/lang.html#mixins-with-classes
        //https://dojotoolkit.org/reference-guide/1.9/dijit/_editor/plugins/TextColor.html
        //http://learningdojotoolkit.blogspot.pt/2011/06/change-background-color-of.html
        fontSize:null,
        isItalic:false,
        isBold:false,
        fontFamily:"arial",
        constructor: function(args) {
            // The "constructor" method is special: the parent class (area)constructor is called automatically before this one.
            // alert("AreaWithText !!!");
            lang.mixin(this, args);//mixin is used to mix an object-hash of properties passed has argument with default values in the class 
            this.fontSize = this.height;
            // this.setFontSize(this.fontSize);
        },
        resize: function() {
            this.inherited(arguments);//it will call area.moveTo() and the will folow the next code...
            //alert("hello !!! this is areaWithText width="+this.width+" height="+this.height);
            this.setFontSize(this.height);
        },
        setFontSize:function(size){//notice that when border changes fontSize must change to fit the border
            this.fontSize = size;
            this.updateTextInDOM("fontSize", size); //so that edition fits inside border              
        },
        toggleItalic:function(isItalic){
            this.isItalic = isItalic;
            if (isItalic)
                this.updateTextInDOM("fontStyle", "italic");
            else
                this.updateTextInDOM("fontStyle", "normal");
        },
        toggleBold:function(isBold){
            this.isBold = isBold;
            if (isBold)
                this.updateTextInDOM("fontWeight", "bold");
            else
                this.updateTextInDOM("fontWeight", "normal");
        },
        setFontFamily:function(fontFamily){//"arial","verdana","Georgia","Times New Roman","Comic Sans MS","Palatino Linotype","Impact,Charcoal,sans-serif"
            this.fontFamily = fontFamily;
            alert("area_text Class - setFontFamily not implemented !!!");
        },
        updateTextInDOM: function(propertyName, value){//an hack over on dojo DOM
            if (propertyName == "fontSize") {
                value = (value < this.height - 5) ? value: 0.85 * value - 3;//without this font will cross border...
            }
            // console.log("----------------->areaWithText.updateTextInDOM(): id="+this.id+" trying to change property " + propertyName + " to " + value);
            var domIdExists = (dom.byId(this.id) === null)? false: true;
            if (domIdExists) {
                domStyle.set(dom.byId(this.id), propertyName, value);
            } else {
                // throw new Error("area.updateTextInDOM(): In area order " + this.order +
                //     " you tried to change property " + propertyName + " to " + value + ", but DOM id is null !");
                console.log("area.updateTextInDOM(): In area id=" + this.id +
                    " you tried to change property " + propertyName + " to " + value + ", but DOM id is null !");
            }
        },
    });
}); //end of  module  