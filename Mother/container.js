define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/window",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/dom-class",
    "dijit/form/Form",
    "dijit/Dialog",
    "dijit/layout/ContentPane",//--
    "/pdojo/MotherGitHub/Mother/area.js"
], function(declare,lang,win,domStyle,domConstruct,domClass,Form,Dialog,ContentPane,area){
    return declare(area,{
        children:[],
        highestZIndex:null, //the zIndex of the child with higest zIndex
        floatingType:"nonFloat",// possible values("nonFloat" => form in pane ), ("modal" =>modal floating form), ("nonModal" => floating form)
        dojoObject:null,//the pane object is the first dojo object for containers
        dojoFormObj:null,// the form that is placed over the pane
        dojoDialogObj:null,// only exists if the container is "modal" or "nonModal". Otherwise is null
        type:"container",
        CSSTemplate:null,
        constructor: function(containerProperties){
            // The "constructor" method is special: the parent class areaWithText and area constructor are called automatically before this one.
            //If your class contains arrays or other objects, they should be declared in the constructor() so that each instance gets its own copy. 
            this.children = []; // to force per-instance object.
            //REVIEW: Imported from MotherLib10 for speed
            var allPossibleProperties =
                {value:"", name:"", preCode:"", posCode:"", changeCode:"", title:"@|", headers:"", template:null, zIndex:0};
            declare.safeMixin(allPossibleProperties,this.left, this.top, this.width, this.height, this.zIndex);//priority to inherited defaults  
            if (containerProperties)
                declare.safeMixin(allPossibleProperties,containerProperties);
            // console.log("INSIDE CONTAINER id="+this.id+" left="+this.left+" top="+this.top+" width="+this.width+" height="+this.height+" zIndex="+this.zIndex+" domId="+this.domId);
            this.mountPaneInContainer();//sets this.dojoObject, this.dojoFormObj and places this.dojoFormObj over this.dojoObject
            if (this.floatingType!="nonFloat")
                this.mountDialog();//sets dojoDialogObj and places this.dojoObject over it (it already has this.dojoFormObj over it)
        },
        addExistingChild: function(childrenArr){
            // console.log("addExistingChild() $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ BEGIN "+this.name+" id="+this.id+" zIndex="+this.zIndex);
            for(var i = 0; i < childrenArr.length; i++){
                if(!childrenArr[i].id) {
                    alert("container.addExistingChild(): You attemped to add an object that is not widget nor container !");
                    throw new Error("container.addExistingChild(): You attemped to add an object that is not widget nor container !");
                }
                var zIndexBefore = childrenArr[i].zIndex;
                if (this.name != "canvas") {
                    childrenArr[i].zIndex = this.highestZIndexAreaUnder(childrenArr[i],this)+1;
                    // console.log("--------------------------->addExistingChild() adding "+childrenArr[i].name+"/"+childrenArr[i].zIndex+"---------------->to "+this.name+"/"+this.zIndex);
                    this._removeChildFromPreviousContainerChildrenList(childrenArr[i]);
                    childrenArr[i].containerParent = this;
                }
                if (childrenArr[i].type!="container"){
                    var dojoId="widget_"+childrenArr[i].id;
                    domStyle.set(dojoId,"left",(childrenArr[i].left - this.left)+"px");// updates dojo object over widget with relative position
                    domStyle.set(dojoId,"top",(childrenArr[i].top - this.top)+"px");
                    this.dojoFormObj.domNode.appendChild(childrenArr[i].dojoObj.domNode);
                }else{//a container was added
                    //FIXME - if we do not remove a container from its previous container the append will go on infinitively
                    this.dojoFormObj.domNode.appendChild(childrenArr[i].dojoObject.domNode);
                }
                this.children.push(childrenArr[i]);
                // console.log("------------------->add Child="+childrenArr[i].name+" id="+childrenArr[i].id+" zIndex before="+zIndexBefore+" zIndex after="+childrenArr[i].zIndex);
            }
            // console.log("addExistingChild() $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ END "+this.name);
        },
        _removeChildrenFromPreviousContainer: function(childrenArr){//cannot be called outside the class 
            for(var i = 0; i < childrenArr.length; i++){
                var previousContainer = childrenArr[i].containerParent;
                if (previousContainer) {//free containers have containerParent = null
                    // console.log("----------------- >REMOVES id="+childrenArr[i].id+" value="+"someValue"+" from "+previousContainer.name);
                    previousContainer._removeChild(childrenArr[i]);
                }
             }
        },
        _removeChild: function(child){ //cannot be called outside the class  
            for(var i = 0; i < this.children.length; i++){
                if (this.children[i].id == child.id) {//match by id (it is always unique)
                    this.children.splice(i,1);
                    break;
                }
            }
         },
        _removeChildFromPreviousContainerChildrenList: function(child){ //cannot be called outside the class  
            var previousContainer = child.containerParent;
            for(var i = 0; i < previousContainer.children.length; i++){
                if (previousContainer.children[i].id == child.id) {//match by id (it is always unique)
                    previousContainer.children.splice(i,1);
                    break;
                }
            }
         },
        moveTo: function(leftTopCoordinates){//overrides the area moveTo() method
            //http://apphacker.wordpress.com/2010/01/31/how-to-call-the-base-method-when-using-inheritance-in-dojo-1-4/
            this.inherited(arguments);//it will call area.moveTo() and the will folow the next code...
            // console.log("container.moveTo first left="+this.left+" top="+this.top);
            this.adjustAllChildrenByDelta({left: this.left - this.previousLeft, top: this.top - this.previousTop},this);
        },
        adjustAllChildrenByDelta: function(deltaCoordinates,container){
            for(var i = 0; i < container.children.length; i++){
                // console.log("container.adjustAllChildrenByDelta i="+i+" BEFORE left="+container.children[i].left+" top="+container.children[i].top);             
                container.children[i].left += deltaCoordinates.left;
                container.children[i].top += deltaCoordinates.top;
                if (container.children[i].type == "container")
                    this.adjustAllChildrenByDelta(deltaCoordinates,container.children[i]);
                // console.log("                                   i="+i+" AFTER  left="+container.children[i].left+" top="+container.children[i].top);
            };
        },
        topAreaUnderPoint: function(pointLeft,pointTop){
            var topAreaIndex=-1;
            var topZIndexOfChildren=this.zIndex;//the container zIndex
            var topArea = this;
            for(var i = 0; i < this.children.length; i++){
                 if (this.children[i].isPointInsideArea(pointLeft,pointTop)) {
                    if(this.children[i].zIndex > topArea.zIndex) {
                            topArea = this.children[i];
                    }
                }
            }
        },
        highestZIndexAreaUnder: function(candidateArea,containerAreaRecipient){
            //given an area to be placed in a containerArea returns the highest zIndex of all areas in the container (recursively)
            //  that intersects with candidateArea          
            var topZIndex = containerAreaRecipient.zIndex;
            var z = null;
            for (var i = 0; i < containerAreaRecipient.children.length; i++) { //scans all containerArea childrens except candidateArea
                if (containerAreaRecipient.children[i].id!=candidateArea.id) {//the own area is excluded from the scan
                    if (containerAreaRecipient.children[i].intersectsArea(candidateArea)) { //only intersecting areas are interesting
                        if (containerAreaRecipient.children[i].type == "container") {
                            z = containerAreaRecipient.children[i].highestZIndexAreaUnder(candidateArea,containerAreaRecipient.children[i]);//recursive method
                        } else {
                            z = containerAreaRecipient.children[i].zIndex;
                        }
                        if( z>topZIndex)
                            topZIndex = z;
                    }
                }
            }
            return topZIndex;
        },
        childDump: function() {
            var showContainerParentName = "Canvas Parent...";
            if (this.containerParent) {//most frequent case where area is inside a container
                showContainerParentName = "No name but id=" + this.containerParent.id;
                if (this.containerParent.name)
                    showContainerParentName = this.containerParent.name;
            }
            console.log ("%%%%%%%%%%%%%%%%%%%%%%%%%%% container name="+ this.name+" id="+this.id+" parentContainerName="+showContainerParentName+" zIndex="+this.zIndex+" l,t="+this.left+","+this.top+" %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
            for (var i = 0; i < this.children.length; i++) {
                var showValue = "NoValue";
                if (this.children[i].type!="container")
                    showValue = this.children[i].dojoObj.value; //"someValue";
                console.log(i+" Name="+this.children[i].name+" id="+this.children[i].id+" type="+this.children[i].type+" value="+showValue+" zIndex="+this.children[i].zIndex+" containerParent.name="+this.children[i].containerParent.name+" l,t="+this.children[i].left+","+this.children[i].top);
            }
            console.log ("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
        },
        topWidgetUnderMouse: function(mouseEvent){
            var topChild = null;
            for(var i = 0; i < this.children.length; i++){
                if(this.children[i].isUnderMouse(mouseEvent))
                    if(this.children[i].zIndex > topChild.zIndex)
                        topChild = this.children[i];
            }
            if(topChild.isContainer)
                return topChild.topWidgetUnderMouse();
        },
        isUnderMouse: function(e){
            var x = e.pageX;
            var y = e.pageY;
            // code here
        },
        mountPaneInContainer: function(){
            var paneDivId="_PaneDiv" + this.id;
            var paneDiv = domConstruct.create("div");
            paneDiv.innerHTML="<div id='"+paneDivId+"'></div>";
            win.body().appendChild(paneDiv);//places paneDiv in DOM

            var paneStyleProperty = null;
            if (this.floatingType == "nonFloat" ) {
                paneStyleProperty = "position:absolute; left:" + this.left +"px;top:"+ this.top +"px;width:"+ this.width +"px;height:";
                paneStyleProperty += this.height +"px; padding:0px; overflow: visible; border: "+ this.borderThickness +"px "+ this.borderStyle +" "+this.borderColor+";'";
            } else {// ("modal" =>modal floating form) or ("nonModal" => floating form)
                paneStyleProperty = "position:absolute;left:0px;top:0px;width:"+ this.width +"px;height:";
                paneStyleProperty += this.height +"px; padding:0px; overflow: visible;";
             }
            this.dojoObject = new ContentPane( {
                id: this.id,
                content: "",
                //style:'position:absolute;left:800px;top:5px;width:200px;height:30px;border: 1px dotted green;'
                style: paneStyleProperty
            }, paneDivId); //content Pane is placed over the div with name paneDivId

            var JSON_f=this.JSON_Form("_form"+this.id);
            this.dojoFormObj = new Form(JSON_f.props, dojo.doc.createElement("div"));
            this.dojoFormObj.placeAt(this.id);
            if (this.CSSTemplate) {
                domClass.add(this.dojoObject.domNode, "Mother_" + this.CSSTemplate);//add the CSS class "Mother_"+A,B,C,D,E,F to ContentPane - Match with Mother.CSS
            }
        },
        mountDialog: function() {
             this.dojoDialogObj = new Dialog({
                id   :this.prefix+"_DialogId",
                title: this.name,
                style: "width:" + this.width + "px;height:" + this.height + "px; overflow: visible;",
                //style: "left:"+this.viewPort.l+"px;top:"+this.viewPort.t+"px;width:"+this.viewPort.w+"px;height:"+this.viewPort.h+"px; overflow: visible;",
                //'class':this.getVP().floatF//just to use this in CSS with .nonModal_underlay { display:none} (in MotherBuilder.css) MAGIC !!! "modal" makes it modal
                //onShow: function() { domStyle.set(this.containerNode.parentNode,'visibility','hidden'); },
                //onLoad: function() { domStyle.set(this.containerNode.parentNode,{top:'10px', visibility:'visible'}); }    
            });//there is  no dom node with content for the Dialog 
            this.dojoDialogObj.containerNode.appendChild(this.dojoObject.domNode);//OK this includes the contentPane - all forms (including floating) will be over a content pane  !!!!!!!!!
        },
        //-------------------------------------------------------------------------------------------
        JSON_Form: function(xId){//prepares properties object for DOJO form
        //-------------------------------------------------------------------------------------------
        // Builds a JSON object with the format {type:"form",props:JSON_props} for the default form
        // Param: xId=form Id
        // returns:a JSON Object representing the form object
        //-------------------------------------------------------------------------------------------
            var props = {
                id       : xId,
                title    : "Base Form",
                encType  : 'multipart/form-data',
                action   : '',
                method   : '',
                content  : "",
                style    : "margin-top: 14px;",
                onSubmit : function(event) {
                    if (this.validate()) {
                        return confirm('Ok !!! Form is valid, press OK to submit');
                    } else {
                        alert('Corrige lá isso antes de continuar');
                        return false;
                    }
                }
            };
            return {"type":"form","props":props};
        }
    });
}); //end of  module  