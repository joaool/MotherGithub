define([
    "dojo/_base/declare",
    "dojo/_base/window",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/Evented",
    "dojo/dom",
    "dojo/dom-style",
    "/pdojo/MotherGitHub/Mother/ResizeMoveArea7.js",
    "/pdojo/MotherGitHub/Mother/areasFactory.js",
], function(declare, win, lang, on, Evented, dom, domStyle, resizeMoveArea, canvas) {
    return declare(Evented,{
        canvas: null,
        avatar: null,
        topArea: null,
        lastDetectedAreaId: null,
        avatar1ClickInsideHandler:null,
        avatar1MouseDownHandler: null,
        avatar2ClickInsideHandler:null,
        avatar2MouseDownHandler: null,
        mouseMoveHandler:null,
        constructor: function(canvas) {
            // alert("BEGIN detect);
            this.canvas = canvas;
            var initialLanding={l: 0,t: 0,w: 0,h: 0};
            var initialBoundaries={l: 0,t: 0,w:0,h:420};
            this.avatar = new resizeMoveArea("avatar",initialLanding,initialBoundaries,{
                label:"AVATAR",
                gridPattern:5,
                //borderThickness:4,
                //borderType:"inset",//"dotted",
                //borderColor:"blue",
                fillColor:"purple",
                opacity:0.6,
                tooltip:"this is resize move over a dojo widget !"
            });
            this.avatar.mouseDownCallback = lang.hitch(this,function(){
                this.topArea.toggleVisible(false);//when user clicks the area to drag, makes topArea invisible
            });
            this.avatar.setCursorInactive("pointer");

            // console.log(" DETECT end of contructor "+this.avatar.current.label);
        },
        toggleDetector:function(isDetector){
            this.setEventHandlers();
            if(isDetector){//on
                // this.avatar1ClickInsideHandler.resume();
                this.avatar1MouseDownHandler.resume();
                this.mouseMoveHandler.resume();
            }else{//off
                this.avatar1ClickInsideHandler.pause();
                this.avatar1MouseDownHandler.pause();
                this.mouseMoveHandler.pause();
            }
        },
        setEventHandlers:function(){
            this.setClickInsideHandlerPausedToAvatar1_2(1);
            this.setMouseDownHandlerPausedToAvatar1_2(1);
            this.setResizeMovePartialListernerTo(1);
            this.setResizeMoveEndListernerTo(1);
            this.mouseMoveHandler = on.pausable(win.body(), "mousemove", lang.hitch(this,function(e){
                //this only works for areas under at least one container - built using (canvas) areaFactory class
                var x=e.pageX;
                var y=e.pageY;
                var oTotalThickness = {total: 0};
                var topAreaCandidate = this.canvas.baseContainer.topAreaUnderPoint({left: e.pageX, top: e.pageY},
                        this.canvas.baseContainer,oTotalThickness);
                if(topAreaCandidate.zIndex >= 0) {// if it is not the canvas
                    console.log(" x=" + x + " y="+ y +" type="+ topAreaCandidate.type +" id="+ topAreaCandidate.id +" name="+ topAreaCandidate.name);
                    if (this.lastDetectedAreaId != topAreaCandidate.id) { //if cursor changed to a new area
                        this.lstDetectedAreaId = topAreaCandidate.id;
                        console.log("-------------------> Change to new area  x=" + x + " y="+ y +" type="+ topAreaCandidate.type +
                                " id="+ topAreaCandidate.id +" name="+ topAreaCandidate.name + "-->"+topAreaCandidate.left+","+
                                topAreaCandidate.top + " totalThicknesses=" + oTotalThickness.total);
                        this.topArea = topAreaCandidate;
                        this.preparesAvatarToRepresentTopArea(oTotalThickness.total);
                        // tx=topArea;
                    }
                }
            }));
            this.mouseMoveHandler.pause();
        },//setEventHandlers  
        setResizeMoveEndListernerTo: function(avatar1_avatar2) {
            if (avatar1_avatar2 == 1) {
                this.avatar.on("resizeMoveEnd",lang.hitch(this,function(oEvt){
                    console.log("######## AVATAR ######### ------ resizeMoveEnd DETECTED in caller !!! inside="+oEvt.inside+", avatar.current.active="+this.avatar.current.active);
                    this.avatar1MouseDownHandler.resume();//put it ready to be detected when mouse clicks the area
                    this.topArea.isActivated = false;
                    this.setAvatarTooltipToActivatedStatus();
                    this.mouseMoveHandler.resume();
                    this.topArea.containerParent.childDump();
                }));
            } else if (avatar1_avatar2 == 2 ) {
                this.avatar.on("resizeMoveEnd",lang.hitch(this,function(oEvt){
                    console.log("######## AVATAR ######### ------ resizeMoveEnd DETECTED in caller !!! inside="+oEvt.inside+", avatar.current.active="+this.avatar.current.active);
                    this.avatar1MouseDownHandler.resume();//put it ready to be detected when mouse clicks the area
                    this.topArea.isActivated = false;
                    this.setAvatarTooltipToActivatedStatus();
                    this.mouseMoveHandler.resume();
                    this.topArea.containerParent.childDump();
                }));
            } else {
                alert("detect.setResizeMoveEndListernerTo Error: only suports 1 or 2 !!");
            }
        },
        setResizeMovePartialListernerTo: function(avatar1_avatar2) {
            if (avatar1_avatar2 == 1) {
                this.avatar.on("resizeMovePartial",lang.hitch(this,function(oEvt){
                    console.log("######################################################################## ------ resizeMovePartial DETECTED in caller !!! (W1) inside="+oEvt.inside+", avatar.current.active="+this.avatar.current.active);
                    var deltaLeft = this.topArea.containerParent.left;
                    var deltaTop = this.topArea.containerParent.top;
                    this.topArea.moveTo({
                        left: this.avatar.position.x - deltaLeft - this.topArea.containerParent.borderThickness,
                        top: this.avatar.position.y - deltaTop - this.topArea.containerParent.borderThickness
                    });
                    this.topArea.resize({width: this.avatar.position.w - 2*this.topArea.borderThickness,
                        height: this.avatar.position.h - 2*this.topArea.borderThickness});
                    this.topArea.toggleVisible(true);
                    // this.preparesAvatarToRepresentTopArea();
                }));
            } else if (avatar1_avatar2 == 2 ) {
                this.avatar.on("resizeMovePartial",lang.hitch(this,function(oEvt){
                    console.log("######################################################################## ------ resizeMovePartial DETECTED in caller !!! (W1) inside="+oEvt.inside+", avatar.current.active="+this.avatar.current.active);
                    var deltaLeft = this.topArea.containerParent.left;
                    var deltaTop = this.topArea.containerParent.top;
                    this.topArea.moveTo({
                        left: this.avatar.position.x - deltaLeft - this.topArea.containerParent.borderThickness,
                        top: this.avatar.position.y - deltaTop - this.topArea.containerParent.borderThickness
                    });
                    this.topArea.resize({width: this.avatar.position.w - 2*this.topArea.borderThickness,
                        height: this.avatar.position.h - 2*this.topArea.borderThickness});
                    this.topArea.toggleVisible(true);
                    // this.preparesAvatarToRepresentTopArea();
                }));
            } else {
                alert("detect.setResizeMovePartialListernerTo Error: only suports 1 or 2 !!");
            }
        },
        setMouseDownHandlerPausedToAvatar1_2: function(avatar1_avatar2){//clickInside and MouseDownHandler
             if (avatar1_avatar2 == 1) {
                this.avatar1MouseDownHandler=on.pausable(dom.byId(this.avatar.avatarId),"mousedown",lang.hitch(this,function(){
                    console.log("Caller =========================================->Mouse down in AVATAR1 <");
                    this.avatar.activate();
                    this.topArea.isActivated = true;
                    this.setAvatarTooltipToActivatedStatus();
                    this.avatar1MouseDownHandler.pause();
                    this.mouseMoveHandler.pause();
                }));                
                this.avatar1MouseDownHandler.pause();
            } else if (avatar1_avatar2 == 2 ) {
                 this.avatar2MouseDownHandler=on.pausable(dom.byId(this.avatar.avatarId),"mousedown",lang.hitch(this,function(){
                    console.log("Caller =========================================->Mouse down in AVATAR2 <");
                    this.avatar.activate();
                    this.topArea.isActivated = true;
                    this.setAvatarTooltipToActivatedStatus();
                    this.avatar2MouseDownHandler.pause();
                    this.mouseMoveHandler.pause();
                }));                
                this.avatar2MouseDownHandler.pause();
            } else {
                alert("detect.setMouseDownHandlerPausedToAvatar1_2 Error: only suports 1 or 2 !!");
            }
        },
        setClickInsideHandlerPausedToAvatar1_2: function(avatar1_avatar2){//clickInside and MouseDownHandler
             var clickInside = on.pausable(dom.byId(this.avatar.avatarId),"click",lang.hitch(this,function(){
                console.log("detect  avatarClickInsideHandler=================->Mouse click inside activated area");
                // this.emit("detectInsideActiveClick",{order:z,area:this.arrAreas[z]});
                alert("detect detectInsideActiveClick");
                this.emit("detectInsideActiveClick",{});
            }));
            if (avatar1_avatar2 == 1) {
                this.avatar1ClickInsideHandler = clickInside;
                this.avatar1ClickInsideHandler.pause();
            } else if (avatar1_avatar2 == 2 ) {
                this.avatar2ClickInsideHandler = clickInside;
                this.avatar2ClickInsideHandler.pause();
            } else {
                alert("detect.setClickInsideHandlerPausedToAvatar1_2 Error: only suports 1 or 2 !!");
            }
        },
        preparesAvatarToRepresentTopArea: function(extraThickness) {
            //extraThickness - is the total thickness to add to area due to the thickness of containers inside containers.
            var avatarLanding = {
                l: this.topArea.left + extraThickness,// + this.topArea.containerParent.borderThickness+1+extraThickness,
                // l: this.topArea.left + extraThickness,
                t: this.topArea.top + extraThickness, // + this.topArea.containerParent.borderThickness+1+extraThickness,
                // t: this.topArea.top + extraThickness,
                w: this.topArea.width+2*this.topArea.borderThickness,
                h: this.topArea.height+2*this.topArea.borderThickness
            };
            if (this.topArea.type == "container") {
                avatarLanding.l -= this.topArea.borderThickness;
                avatarLanding.t -= this.topArea.borderThickness;
            }
            var avatarBoundaries = null;
            if (this.topArea.containerParent) {
                avatarBoundaries = {
                    l:this.topArea.containerParent.left + this.topArea.containerParent.borderThickness,
                    t:this.topArea.containerParent.top + this.topArea.containerParent.borderThickness,
                    w:this.topArea.containerParent.width + 2,
                    h:this.topArea.containerParent.height + 2
                };
            } else {
                avatarBoundaries = {
                    l:this.canvas.baseContainer.left,
                    t:this.canvas.baseContainer.top,
                    w:this.canvas.baseContainer.width,
                    h:this.canvas.baseContainer.height
                };
            }
            this.avatar.setLanding(avatarLanding);
            this.avatar.setBoundaries(avatarBoundaries);
            this.setAvatarTooltipToActivatedStatus();
        },
        setAvatarTooltipToActivatedStatus: function() {
           var tooltip = null;
            if (this.topArea.isActivated)
                tooltip = "click outside " + this.topArea.type +" named " + this.topArea.name + " to stop move/resize";
            else
                tooltip = "click " + this.topArea.type +" named " + this.topArea.name +
                    this.topArea.getTooltipInsideString() + " to activate it";
            this.avatar.setTooltip(tooltip);
        },
    });
}); //end of  module  