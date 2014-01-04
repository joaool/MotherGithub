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
        previousLeft: null, //only used by moveTo 
        previousTop: null,//only used by moveTo 
        width:100,
        height:30, //default area
        borderThickness:1,
        borderStyle:"solid",
        borderColor:"black",
        areaOrder:null,
        name:null,
        zIndex:-1,//all areas have a zIndex that is the next zIndex after the top highest area being covered 
        containerParent:null,//all areas have a parent (parent of baseContainer is null)
        constructor: function(areaProperties) {
            // alert("BEGIN AREA CONTRUCTOR AREA this.id="+this.id+" id="+areaProperties.id+" order="+areaProperties.order);
            lang.mixin(this, areaProperties);//mixin is used to mix an object-hash of properties passed has argument with default values in the class 
            if (!this.id){ //case where area is built outside areasFactory
                this.areas.lastId++;
                this.id = "_free"+this.areas.lastId;
                this.areaOrder = "Free" +  this.areas.lastId;
                this.domId = "widget_"+this.id;
            }
            var showContainerParentName = "Canvas Parent...";
            if (this.containerParent) {//most frequent case where area is inside a container
                this.zIndex = this.containerParent.highestZIndexAreaUnder(this,this.containerParent)+1;
                showContainerParentName = "No name but id=" + this.containerParent.id;
                if (this.containerParent.name)
                    showContainerParentName = this.containerParent.name;
            }
            // console.log("area class ---------------------------------------->areaOrder=" + this.areaOrder +" id=" + this.id + " name=" + this.name + " left="+this.left+" top="+this.top);
            // console.log("area class ------------------------------------------------>  width="+this.width+" height="+this.height+" zIndex="+this.zIndex+" containerParentName="+showContainerParentName);
            // console.log("area class ------------------------------------------------>  borderThickness="+this.borderThickness+", borderStyle="+this.borderStyle+", borderColor="+this.borderColor+")");
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
            // console.log("area class setBorder for type="+this.type+" ------------------------>  borderThickness="+this.borderThickness+", borderStyle="+this.borderStyle+", borderColor="+this.borderColor+")");
            this.updateDOMPropertyWithValue("border", borderString);
        },
        moveTo: function(leftTopCoordinates) {
            if(leftTopCoordinates) {
                this.previousLeft = this.left; //if area is container this is used by moveTo override 
                this.previousTop = this.top; //if area is container this is used by moveTo override in container
                lang.mixin(this, leftTopCoordinates);
                // console.log("area.moveTo first left="+this.left+" top="+this.top);
                if(this.containerParent)//if it is not a free area
                    this.zIndex = this.containerParent.highestZIndexAreaUnder(this,this.containerParent)+1;
                this.updateDOMPropertyWithValue("left", this.left);
                this.updateDOMPropertyWithValue("top", this.top);
            }
        },
        updateDOMPropertyWithValue: function(propertyName, value){
            var domId = "widget_"+this.id;
            if(this.type=="container")
                domId=this.id;
            // console.log("----------------->area.updateDOMPropertyWithValue(): domId="+ domId +" trying to change property " + propertyName + " to " + value);
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
        isPointInsideArea: function(point) {//given a point{left:xL, top:xT} verifies if that point is inside the area
            var isInside = false;
            if (this.isPointBelowRight(point)) {
                if (point.left < (this.left + this.width) &&  point.top < (this.top + this.height)){
                    isInside = true;
                }
            }
            return isInside;
        },
        isPointBelowRight: function(point){//given a point{left:xL, top:xT} verifies if that point is below and to the right of the area top right point 
            var isBelowRight = false;
            if (point.left > this.left)
                if (point.top > this.top)
                    isBelowRight = true;
            return isBelowRight;
        },
        intersectsArea: function(area) {// true if current area intersects area parameter, false otherwise
            var intersects = false;
            var pointTopLeft = {left: area.left, top:area.top};
            var pointBottomRight = {left: area.left + area.width, top: area.top + area.height };
            if (this.isPointUpLeftFromAreaBottomRight(pointTopLeft) && this.isPointBelowRight(pointBottomRight))
                 intersects = true;
            return intersects;
        },
        isPointUpLeftFromAreaBottomRight: function(point){//given a point verifies if that point is below and to the right of the area 
            var isUpLeft = false;
            if (point.left < (this.left + this.width))
                if (point.top < (this.top + this.height))
                    isUpLeft = true;
            return isUpLeft;
        }                
    });
}); //end of  module  