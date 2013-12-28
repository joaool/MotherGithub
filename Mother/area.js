define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/dom",
    "dojo/dom-style",
    "dojo/ready"
], function(declare, lang, dom, domStyle, ready) {
    return declare(null,{
        //http://dojotoolkit.org/reference-guide/1.9/dojo/_base/declare.html
        //http://dojotoolkit.org/reference-guide/1.9/dojo/_base/lang.html#mixins-with-classes
        id:null,
        //id0:null,
        areas:{lastId:0},
        left:500,
        top:100,
        width:100,
        height:30, //default area
        //border:{thickness:1,style:"solid",color:"black"},
        borderThickness:1,
        borderStyle:"solid",
        borderColor:"black",
        order:null,
        domId:null,
        idPrefix:null,
        constructor: function(args) {
            lang.mixin(this, args);//mixin is used to mix an object-hash of properties passed has argument with default values in the class 
            this.areas.lastId++;
            // this.order=application.lastId;
            this.order = this.areas.lastId;
            this.id = "id"+this.areas.lastId;
            //this.domId = "widget_id"+this.order;
            console.log("area class ----------------------------------------> id=" + this.id + " domId=" + this.domId + " left="+this.left+" top="+this.top);
            console.log("area class ------------------------------------------------>  width="+this.width+" height="+this.height);
            console.log("area class ------------------------------------------------>  borderThickness="+this.borderThickness+", borderStyle="+this.borderStyle+", borderColor="+this.borderColor+")");
            //this.setBorder();            
       },
        getArea: function () {
            return {left: this.left, top: this.top, width: this.width, height: this.height};
        },
        setArea: function(args){
            if(args)
                lang.mixin(this, args);
        },
        setBorder: function(args) {
            if(args)
                lang.mixin(this, args);
            var borderString = this.borderThickness+"px "+this.borderStyle+" "+this.borderColor;
            console.log("area class setBorder----------------------------------------->  borderThickness="+this.borderThickness+", borderStyle="+this.borderStyle+", borderColor="+this.borderColor+")");
            this.updateVisualRepresentation("border", borderString);
        },
        moveTo: function(leftTopCoordinates) {
            if(leftTopCoordinates) {
                lang.mixin(this, leftTopCoordinates);
                //declare.safeMixin({left: this.left, top: this.top}, leftTopCoordinates);
                // domStyle.set(dom.byId(this.domId), left, this.left);
                // domStyle.set(dom.byId(this.domId), top, this.top);
                this.updateVisualRepresentation("left", this.left);
                this.updateVisualRepresentation("top", this.top);
            }
        },
        updateVisualRepresentation: function(propertyName, value){
            var thiz = this;
            ready(function() {
                if (propertyName == "fontSize") {
                    value = (value < thiz.height - 5) ? value: 0.85 * value - 3;//without this font will cross border...
                }
                console.log("----------------->area.updateVisualRepresentation():  trying change property " + propertyName + " to " + value);
                var domIdExists = (dom.byId(thiz.domId) === null)? false: true;
                if (domIdExists) {
                    domStyle.set(dom.byId(thiz.domId), propertyName, value);
                } else {
                    throw new Error("area.updateVisualRepresentation(): In area order " + thiz.order +
                        " you tried to change property " + propertyName + " to " + value + ", but domId is null !");
                }
            });
        }
    });
}); //end of  module  