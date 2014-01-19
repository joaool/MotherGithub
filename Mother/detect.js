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
        avatarId: null,
        topArea: null,
        
        previousTopContainerArea: null,//only to be use by this.borderRed()
        previousTopContainerAreaBorderThickness: null,//only to be use by this.borderRed()
        previousTopContainerAreaBorderColor: null,//only to be use by this.borderRed()
        
        lastDetectedAreaId: null,
        avatar1ClickInsideHandler:null,
        avatar1MouseDownHandler: null,
        avatar2ClickInsideHandler:null,
        avatar2MouseDownHandler: null,
        mouseMoveHandler:null,
        constructor: function(canvas,avatarId) {
            // alert("BEGIN detect);
            this.canvas = canvas;
            this.avatarId = avatarId;
            var initialLanding={l: 0,t: 0,w: 0,h: 0};
            var initialBoundaries={l: 0,t: 0,w:0,h:420};
            this.avatar = new resizeMoveArea(avatarId,initialLanding,initialBoundaries,{
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
        togglePossibleActivation: function(isDetector){
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
        setEventHandlers: function(){
            this.setClickInsideHandlerPausedToAvatar();
            this.setMouseDownHandlerPausedToAvatar();
            this.setResizeMovePartialListernerTo();
            this.setResizeMoveEndListernerTo();
            this.mouseMoveHandler = on.pausable(win.body(), "mousemove", lang.hitch(this,function(e){
                //this only works for areas under at least one container - built using (canvas) areaFactory class
                var x=e.pageX;
                var y=e.pageY;
                var topAreaCandidate = this.canvas.baseContainer.topAreaUnderPoint({left: e.pageX, top: e.pageY},
                        this.canvas.baseContainer);
                if (topAreaCandidate.containerParent) {
                    if (topAreaCandidate.isPointOnContainerBorderMargin(x,y))
                        topAreaCandidate = topAreaCandidate.containerParent;
                }
                if (this.lastDetectedAreaId != topAreaCandidate.id) { //if cursor changed to a new area
                    this.lstDetectedAreaId = topAreaCandidate.id;

                    var extraThickness = topAreaCandidate.totalBorderThicknessesBelowArea();
                    console.log(this.avatarId+"-------------------> Change to new area "+topAreaCandidate.name+" x=" + x + " y="+ y +" type="+ topAreaCandidate.type +
                            " id="+ topAreaCandidate.id + "-->"+topAreaCandidate.left+","+
                            topAreaCandidate.top + " totalThicknesses=" + extraThickness+ " =>"+
                            (topAreaCandidate.left+extraThickness)+","+(topAreaCandidate.top+extraThickness)+" zIndex="+topAreaCandidate.zIndex);
 
                    this.avatar.setLanding({l: 0,t: 0,w: 0,h: 0});//undoes eventual PreSelection
                    this.topArea = topAreaCandidate;
                    this.lastDetectedAreaId = this.topArea.id;
                    // this.preparesAvatarToRepresentTopArea();
                    this.topArea.setAvatarPreSelection(true);
                }
            }));
            this.mouseMoveHandler.pause();
        },//setEventHandlers  
        setResizeMoveEndListernerTo: function() {
            this.avatar.on("resizeMoveEnd",lang.hitch(this,function(oEvt){
                console.log("@######## AVATAR ######### ------ resizeMoveEnd DETECTED in caller !!! inside="+oEvt.inside+", avatar.current.active="+this.avatar.current.active);
                this.avatar1MouseDownHandler.resume();//put it ready to be detected when mouse clicks the area
                this.topArea.isActivated = false;
                this.mouseMoveHandler.resume();
                this.topArea.containerParent.childDump();
            }));
        },
        setResizeMovePartialListernerTo: function() {
            this.avatar.on("resizeMovePartial",lang.hitch(this,function(oEvt){
                console.log("@######################################################################## ------ resizeMovePartial DETECTED in caller !!! (W1) inside="+oEvt.inside+", avatar.current.active="+this.avatar.current.active);
                var totalBorderThicknesses = this.topArea.totalBorderThicknessesBelowArea();
                 this.topArea.moveTo({//moves to absolute positions !!!
                    left: this.avatar.position.x - totalBorderThicknesses + this.topArea.borderThickness,
                    top: this.avatar.position.y - totalBorderThicknesses + this.topArea.borderThickness
                });
                this.topArea.resize({width: this.avatar.position.w - 2*this.topArea.borderThickness,
                    height: this.avatar.position.h - 2*this.topArea.borderThickness});
                console.log("@### avatar x,y="+this.avatar.position.x+","+this.avatar.position.y+
                        " topArea name="+this.topArea.name+" left,top="+this.topArea.left+","+this.topArea.top+" zIndex="+this.topArea.zIndex);
                this.topArea.toggleVisible(true);
            }));
        },
        setMouseDownHandlerPausedToAvatar: function(){//clickInside and MouseDownHandler
             this.avatar1MouseDownHandler=on.pausable(dom.byId(this.avatar.avatarId),"mousedown",lang.hitch(this,function(){
                console.log("@@Caller =========================================->Mouse down in AVATAR <");
                this.avatar.activate();
                this.topArea.isActivated = true;
                this.avatar1MouseDownHandler.pause();
                this.mouseMoveHandler.pause();
            }));
            this.avatar1MouseDownHandler.pause();
        },
        setClickInsideHandlerPausedToAvatar: function(){//clickInside and MouseDownHandler
             var clickInside = on.pausable(dom.byId(this.avatar.avatarId),"click",lang.hitch(this,function(){
                console.log("detect  avatarClickInsideHandler=================->Mouse click inside activated area");
                // this.emit("detectInsideActiveClick",{order:z,area:this.arrAreas[z]});
                alert("detect detectInsideActiveClick");
                this.emit("detectInsideActiveClick",{});
            }));
            this.avatar1ClickInsideHandler = clickInside;
            this.avatar1ClickInsideHandler.pause();
         },
        XXXpreparesAvatarToRepresentTopArea: function() {
            var avatarLanding = null;
            var avatarBoundaries = null;
            var extraThickness = this.topArea.totalBorderThicknessesBelowArea();//the total thickness to add to area due to the thickness of containers inside containers.
            if (this.topArea.zIndex >= 0) {
                avatarLanding = {
                    l: this.topArea.left + extraThickness - this.topArea.borderThickness,
                    t: this.topArea.top + extraThickness - this.topArea.borderThickness,
                    w: this.topArea.width+3+2*this.topArea.borderThickness,
                    h: this.topArea.height+3+2*this.topArea.borderThickness
                };
                if (this.topArea.containerParent) {
                    avatarBoundaries = {
                        l:this.topArea.containerParent.left + extraThickness - this.topArea.borderThickness,// + this.topArea.containerParent.borderThickness,
                        t:this.topArea.containerParent.top + extraThickness - this.topArea.borderThickness,// + this.topArea.containerParent.borderThickness,
                        w:this.topArea.containerParent.width + 0,
                        h:this.topArea.containerParent.height + 0
                    };
                } else {
                    avatarBoundaries = {
                        l:this.canvas.baseContainer.left,
                        t:this.canvas.baseContainer.top,
                        w:this.canvas.baseContainer.width,
                        h:this.canvas.baseContainer.height
                    };
                }
            } else { //it is the canvas
                avatarLanding = {l: 0,t: 0,w: 0,h: 0};
                avatarBoundaries = {l: 0,t: 0,w:0,h:420};
            }
            this.avatar.setLanding(avatarLanding);
            // console.log("preparesAvatarToRepresentTopArea -> this.topArea.name="+this.topArea.name+" value="+this.topArea.getValue());

            this.avatar.setBoundaries(avatarBoundaries);
            this.containerSensibleBorder("gold");
        },
        containerSensibleBorder: function(sensibleBorderColor) { //used to access container thru borders - if forces a dotted sensibleBorderColor border to all containers
            if (this.previousTopContainerArea) {//resets previous area to its own border
                 this.previousTopContainerArea.setBorder({borderThickness: this.previousTopContainerAreaBorderThickness,
                            borderColor: this.previousTopContainerAreaBorderColor});
            }
            var containerArea = this.topArea;   
            if (this.topArea.type != "container" ) 
                containerArea = this.topArea.containerParent;

            this.previousTopContainerArea = containerArea;//saves for future reset
            this.previousTopContainerAreaBorderThickness = containerArea.borderThickness;
            this.previousTopContainerAreaBorderColor = containerArea.borderColor;
         
            if (containerArea.name != "canvas") { //dont do it for canvas
                if (containerArea.borderThickness < 4) {//if border is 5 or greater...no neeed to create it
                    containerArea.setBorder({borderThickness: 4, borderStyle: "dotted", borderColor: sensibleBorderColor });
                    // this.topArea.setBorder({borderColor: "red"});
                }
            }
        },
    });
}); //end of  module  