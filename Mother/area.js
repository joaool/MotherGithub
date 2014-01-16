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
        name:null,
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
        isVisible:true,
        isActivated:false,
        areaOrder:null,
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
        setBorder: function(borderProperties) {
            if(borderProperties){
                var border = {borderThickness:this.borderThickness,  borderStyle: this.borderStyle, borderColor: this.borderColor};
                declare.safeMixin(border,borderProperties);
                lang.mixin(this,border);
            }
            var borderString = this.borderThickness+"px "+this.borderStyle+" "+this.borderColor;
            // console.log("area class setBorder for type="+this.type+" ------------------------>  borderThickness="+this.borderThickness+", borderStyle="+this.borderStyle+", borderColor="+this.borderColor+")");
            this.updateDOMPropertyWithValue("border", borderString);
        },
        resize: function(widthHeight) {
            lang.mixin(this, widthHeight);
        },
        toggleVisible:function(isVisible){
            this.isVisible = isVisible;
            var visibleHTMLProperty=(isVisible)? "visible":"hidden";
            // domStyle.set(this.id,"visibility",visibleHTMLProperty);   
            var widget = dijit.byId(this.id);
            if (widget) {
                domStyle.set(dijit.byId(this.id).domNode,"visibility",visibleHTMLProperty);
            } else {
                alert("area.toggleVisible(): area is not a dojo widget. Missing code !");
                throw new Error("area.toggleVisible(): area is not a dojo widget. Missing code !");
            }
        },
        moveTo: function(leftTopProperties) {//coordinates {left: xl,top: xt} are absolute coordinates !!!
            if(leftTopProperties) {
                this.previousLeft = this.left; //if area is container this is used by moveTo override 
                this.previousTop = this.top; //if area is container this is used by moveTo override in container
                lang.mixin(this, leftTopProperties);
                // console.log("area.moveTo first left="+this.left+" top="+this.top);
                var left = this.left;
                var top = this.top;
                if (this.containerParent) {//if it is not a free area
                    left -= this.containerParent.left;//to force display of absolute coordinates !
                    top -= this.containerParent.top;//to force display of absolute coordinates !
                    this.zIndex = this.containerParent.highestZIndexAreaUnder(this,this.containerParent)+1;
                    this.updateDOMPropertyWithValue("zIndex", this.zIndex);
                }
                this.updateDOMPropertyWithValue("left", left);//these coordinates are container relative
                this.updateDOMPropertyWithValue("top", top);
            }
        },
        moveInContainerTo: function(leftTopProperties) {//coordinates {left: xl,top: xt} are container relative
            if (this.containerParent) {//if it is not a free area
                leftTopProperties.left += this.containerParent.left;
                leftTopProperties.top += this.containerParent.top;
                this.moveTo(leftTopProperties)
            } else {
                alert("area.moveInContainerTo(): area is not inside a container !!!");
                throw new Error("area.moveInContainerTo(): area is not inside a container !!!");
            }                
        },        
        updateDOMPropertyWithValue: function(propertyName, value){//in the case of left,top properties they are relative to the container !!!            
            //because the id uses "widget_" prefix left,top are container relative (it is a dom element contructed by dojo )
            var domId = "widget_"+this.id;//this makes left top container relative !!!
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
        isPointInsideArea: function(point, sumOfBordersThickness) {//given a point{left:xL, top:xT} verifies if that point is inside the current area
            // sumOfBordersThickness has the sum of all container borders until the current area
            var isInside = false;
            if (this.isPointBelowRight(point,sumOfBordersThickness)) {
                // if (point.left < (this.left + this.width) &&  point.top < (this.top + this.height)){
                if (point.left < (this.left + this.width + 2*this.borderThickness + sumOfBordersThickness) &&
                        point.top < (this.top + this.height +  2*this.borderThickness +sumOfBordersThickness)){
                    isInside = true;
                }
            }
            return isInside;
        },
        isPointBelowRight: function(point, sumOfBordersThickness){//given a point{left:xL, top:xT} verifies if that point is below and to the right of the area top right point 
            // sumOfBordersThickness has the sum of all container borders until the current area
            var isBelowRight = false;
            if (point.left > this.left + sumOfBordersThickness - this.borderThickness)
                if (point.top > this.top + sumOfBordersThickness - this.borderThickness)
                    isBelowRight = true;
            return isBelowRight;
        },
        totalBorderThicknessesBelowArea: function() { //including the current area borderThickness
            // var total = 0;
            var total = this.borderThickness;
            var parentArea = this.containerParent;
            while (parentArea) {
                total += parentArea.borderThickness;
                parentArea = parentArea.containerParent;
            }
            return total;
        },
        intersectsArea: function(candidateArea) {// true if current candidateArea intersects candidateArea parameter, false otherwise
            var intersects = false;
            var pointSumOfBordersThicknesses = candidateArea.totalBorderThicknessesBelowArea();
            var sumOfBordersThicknesses = this.totalBorderThicknessesBelowArea();
            var pointTopLeft = {
                left: candidateArea.left + pointSumOfBordersThicknesses - candidateArea.borderThickness,//pointSumOfBordersThicknesses includes this.borderThickness
                top:candidateArea.top + pointSumOfBordersThicknesses - candidateArea.borderThickness
            };
            var pointBottomRight = {
                left: candidateArea.left + candidateArea.width + pointSumOfBordersThicknesses + candidateArea.borderThickness,
                top: candidateArea.top + candidateArea.height + pointSumOfBordersThicknesses + candidateArea.borderThickness
            };            
            if (this.isPointUpLeftFromAreaBottomRight(pointTopLeft,sumOfBordersThicknesses) && this.isPointBelowRight(pointBottomRight, sumOfBordersThicknesses))
                intersects = true;
            return intersects;
        },
        isPointUpLeftFromAreaBottomRight: function(point,sumOfBordersThickness){//given a point verifies if that point is below and to the right of the area 
            // sumOfBordersThickness has the sum of all container borders until the current area
            // alert("area.isPointUpLeftFromAreaBottomRight BEGIN");
            var isUpLeft = false;
            // if (point.left < (this.left + this.width))
            if (point.left < (this.left + this.width + sumOfBordersThickness + 2*this.borderThickness))
                if (point.top < (this.top + this.height + sumOfBordersThickness + 2*this.borderThickness))
                    isUpLeft = true;
            return isUpLeft;
        },
        getTooltipInsideString: function() {// returns ", inside 'form f1', inside 'form f0'" to insert in tooltip
            var insideString = "";
            var currentParent = this.containerParent;
            if (currentParent) {
                while (currentParent.zIndex >= 0) {
                    insideString += ", inside '"+currentParent.name+"'";
                    currentParent = currentParent.containerParent;
                }
            }
            return insideString;
        }
    });
}); //end of  module  