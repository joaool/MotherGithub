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
        id:null,//to be passed to dojo object as an id
        domId:null, //to access dom directly
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
        areaOrder:null,
        name:null,
        constructor: function(areaProperties) {
            // alert("BEGIN AREA CONTRUCTOR AREA this.id="+this.id+" id="+areaProperties.id+" order="+areaProperties.order);
            lang.mixin(this, areaProperties);//mixin is used to mix an object-hash of properties passed has argument with default values in the class 
            //this.areaOrder = this.areaOrder + 1;
            if (!this.id){ //case where area is built outside areasFactory
                this.areas.lastId++;
                this.id = "_free"+this.areas.lastId;
                this.areaOrder = "Free" +  this.areas.lastId;
                this.domId = "widget_"+this.id;
            }    
            console.log("area class ---------------------------------------->areaOrder=" + this.areaOrder +" id=" + this.id + " domId=" + this.domId + " left="+this.left+" top="+this.top);
            console.log("area class ------------------------------------------------>  width="+this.width+" height="+this.height+" zIndex="+this.zIndex);
            console.log("area class ------------------------------------------------>  borderThickness="+this.borderThickness+", borderStyle="+this.borderStyle+", borderColor="+this.borderColor+")");
        },
        getArea: function () {
            return {left: this.left, top: this.top, width: this.width, height: this.height};
        },
        setArea: function(areaProperties){
            if(areaProperties)
                lang.mixin(this, areaProperties);
        },
        setBorder: function(areaProperties) {
            if(areaProperties){
                var border = {borderThickness:this.borderThickness,  borderStyle: this.borderStyle, borderColor: this.borderColor};
                declare.safeMixin(border,areaProperties);
                lang.mixin(this,border);
            }
            var borderString = this.borderThickness+"px "+this.borderStyle+" "+this.borderColor;
            console.log("area class setBorder for type="+this.type+" ------------------------>  borderThickness="+this.borderThickness+", borderStyle="+this.borderStyle+", borderColor="+this.borderColor+")");
            this.updateDOMPropertyWithValue("border", borderString);
        },
        moveTo: function(leftTopCoordinates) {
            if(leftTopCoordinates) {
                lang.mixin(this, leftTopCoordinates);
                this.updateDOMPropertyWithValue("left", this.left);
                this.updateDOMPropertyWithValue("top", this.top);
            }
        },
        updateDOMPropertyWithValue: function(propertyName, value){
            var domId = "widget_"+this.id;
            // if(this.domId.substr(0,9)=="container")
            if(this.type=="container")
                domId=this.id;
            console.log("----------------->area.updateDOMPropertyWithValue(): domId="+ domId +" trying to change property " + propertyName + " to " + value);
            var domIdExists = (dom.byId(domId) === null)? false: true;
            if (domIdExists) {
                domStyle.set(dom.byId(domId), propertyName, value);
            } else {
                // console.log(" Error: area.updateDOMPropertyWithValue(): In area order " + this.order +
                //     " you tried to change property " + propertyName + " to " + value + ", but DOM id is null !");
                throw new Error("area.updateDOMPropertyWithValue(): In area order " + this.order +
                    " you tried to change property " + propertyName + " to " + value + ", but DOM id is null !");
            }
        },
        isPointInsideArea: function(pointLeft,pointTop) {//given a point verifies if that point is inside the area
            var isInside = false;
            if(isPointBelowRight) {
                if( pointLeft < this.left + this.width &&  pointTop < this.top + this.height ){
                    isInside = true;
                }
            }
            return isInside;
        },
        isPointBelowRight: function(pointLeft,pointTop){//given a point verifies if that point is below and to the right of the area 
            var isBelowRight = false;
            if( pointLeft > this.left )
                if( pointTop > this.top )
                    isBelowRight = true;
            return isBelowRight
        }
    });
}); //end of  module  