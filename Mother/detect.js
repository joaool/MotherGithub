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
        // avatar2ClickInsideHandler:null,
        // avatar2MouseDownHandler: null,
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
                    this.topArea.setAvatarPreSelection(true);
                }
            }));
            this.mouseMoveHandler.pause();
        },//setEventHandlers  
        setResizeMoveEndListernerTo: function() {
            this.avatar.on("resizeMoveEnd",lang.hitch(this,function(oEvt){
                console.log("@######## AVATAR ######### ------ resizeMoveEnd DETECTED in caller !!! inside="+oEvt.inside+", avatar.current.active="+this.avatar.current.active);
                this.topArea.deActivate();
                this.avatar1MouseDownHandler.resume();//put it ready to be detected when mouse clicks the area
                this.mouseMoveHandler.resume();
                // this.topArea.containerParent.childDump();
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
                this.topArea.activate();
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
    });
}); //end of  module  