define([
    "dojo/_base/declare",
    "dojo/_base/window",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/Evented",
    "dojo/dom",
    "dojo/dom-style",
    "/pdojo/MotherGitHub/Mother/ResizeMoveArea8.js",
    "/pdojo/MotherGitHub/Mother/areasFactory.js",
], function(declare, win, lang, on, Evented, dom, domStyle, resizeMoveArea, canvas) {
    return declare(Evented,{
        canvas: null,
        avatar: null,
        //avatarId: null,
        detectorId: null,
        avatarA: null,
        avatarB: null,
        topArea: null,
              
        lastDetectedAreaId: null,
        avatarAMouseDownHandler: null,
        avatarBMouseDownHandler: null,
        mouseMoveHandler:null,
        activeArea: null,
        activeAvatar: null,
        // isActive: false,
        constructor: function(canvas,detectorId) {
            // alert("BEGIN detect);
            this.canvas = canvas;
            this.detectorId = detectorId;
            var initialLanding={l: 0,t: 0,w: 0,h: 0};
            var initialBoundaries={l: 0,t: 0,w:0,h:420};
            
            this.avatarA = new resizeMoveArea(detectorId+"_A",initialLanding,initialBoundaries,{
                label:"AvatarA",
                gridPattern:5,
                //borderThickness:4,
                //borderType:"inset",//"dotted",
                //borderColor:"blue",
                fillColor:"purple",
                opacity:0.6,
                tooltip:"A this is resize move over a dojo widget !"
            });
            this.avatarA.setCursorInactive("pointer");

            this.avatarB = new resizeMoveArea(detectorId+"_B",initialLanding,initialBoundaries,{
                label:"AvatarB",
                gridPattern:5,
                fillColor:"purple",
                opacity:0.6,
                tooltip:"B this is resize move over a dojo widget !"
            });
            this.avatarB.setCursorInactive("pointer");
            this.avatar = this.avatarA;
            var thiz = this;
            var mouseDownCallback = function () {
                console.log("                                @vai garantir que as boundaries são correctas...");
                if(thiz.activeArea){
                    console.log("                                @poe boundaries=" + this.oBoundaries.l+","+
                            this.oBoundaries.t+","+this.oBoundaries.w+","+this.oBoundaries.h);
                    declare.safeMixin(this.oBoundaries,thiz.activeArea.getBoundaries());
                } else {
                    console.log("                                @this.activeArea=null");
                }    
            };
            this.avatarA.mouseDownCallback = mouseDownCallback;
            this.avatarB.mouseDownCallback = mouseDownCallback;

            // console.log(" DETECT end of contructor "+this.avatar.current.label);
        },
        toggleActivation: function(isDetectOn){
            this.setEventHandlers();
            if(isDetectOn){//on
                this.avatarAMouseDownHandler.resume();
                this.avatarBMouseDownHandler.pause();
                this.mouseMoveHandler.resume();
                this.avatar = this.avatarA;
            }else{//off
                this.avatarAMouseDownHandler.pause();
                this.avatarBMouseDownHandler.pause();
                this.mouseMoveHandler.pause();
                this.avatar = null;
            }
        },
        setEventHandlers: function(){
            this.setMouseDownHandlersPaused();
            this.setResizeMovePartialListernerForAvatarA();
            this.setResizeMovePartialListernerForAvatarB();
            this.setResizeMoveEndListernerForAvatarA();
            this.setResizeMoveEndListernerForAvatarB();
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
                // console.log("topAreaCandidate.name="+topAreaCandidate.name);
                var doesPreSelection = true;
                if (this.activeAvatar) {
                    if(this.isAlternateAvatarBeingResized()) {
                        doesPreSelection = false;
                        this.avatar.setLanding({l: 0,t: 0,w: 0,h: 0});//undoes eventual PreSelection
                        topAreaCandidate = this.activeArea;
                    } else {
                        if (this.activeAvatar.isPointInside(x,y)) {
                            // console.log("cursor entered activated area !!!! boundaries="+this.activeAvatar.oBoundaries.l+","+
                            //         this.activeAvatar.oBoundaries.t+","+this.activeAvatar.oBoundaries.w+","+
                            //         this.activeAvatar.oBoundaries.h+" avatarId="+this.activeAvatar.avatarId);
                            this.avatar.setLanding({l: 0,t: 0,w: 0,h: 0});//undoes eventual PreSelection
                            doesPreSelection = false;
                       } else {
                            // console.log("cursor EXITED activated area !!!! Now cursor is over "+topAreaCandidate.name);
                        }
                    }
                    this.lastDetectedAreaId = this.activeAvatar.avatarId;
                }
                // console.log(" does="+doesPreSelection);
                if (doesPreSelection) {
                    if (this.lastDetectedAreaId != topAreaCandidate.id) { //if cursor changed to a new area
                        var extraThickness = topAreaCandidate.totalBorderThicknessesBelowArea()-topAreaCandidate.borderThickness;
                        console.log("detect mouseMoveHandler "+this.avatar.avatarId+"---> Change to new area "+
                                topAreaCandidate.name+" cursor(x=" + x + " y="+ y +") type="+ topAreaCandidate.type +
                                " id="+ topAreaCandidate.id + "-->x,y="+topAreaCandidate.left+","+
                                topAreaCandidate.top + " totalThicknesses=" + extraThickness+ " =>"+
                                (topAreaCandidate.left+extraThickness)+","+(topAreaCandidate.top+extraThickness)+" zIndex="+topAreaCandidate.zIndex);
     
                        if(!this.activeArea)
                             this.avatar.setLanding({l: 0,t: 0,w: 0,h: 0});//undoes eventual PreSelection
                        this.topArea = topAreaCandidate;
                        this.lastDetectedAreaId = this.topArea.id;
                        this.topArea.setAvatarPreSelection(this.avatar.avatarId);
                    }
                }
                this.lastDetectedAreaId = topAreaCandidate.id;
            }));
            this.mouseMoveHandler.pause();
        },//setEventHandlers  
        setResizeMoveEndListernerForAvatarA: function() {
            this.avatarA.on("resizeMoveEnd",lang.hitch(this,function(oEvt){
                this.resizeMoveEndCommonGovernance("A");
                this.avatarAMouseDownHandler.resume();
                // this.topArea.containerParent.childDump();
            }));
        },
        setResizeMoveEndListernerForAvatarB: function() {
            this.avatarA.on("resizeMoveEnd",lang.hitch(this,function(oEvt){
                this.resizeMoveEndCommonGovernance("B");
                this.avatarBMouseDownHandler.resume();
            }));
        },
        setResizeMovePartialListernerForAvatarA: function() {
            this.avatarA.on("resizeMovePartial",lang.hitch(this,function(oEvt){
                this.partialCommonGovernance();
            }));
        },
        setResizeMovePartialListernerForAvatarB: function() {
            this.avatarB.on("resizeMovePartial",lang.hitch(this,function(oEvt){
                this.partialCommonGovernance();
            }));
        },
        setMouseDownHandlersPaused: function(){
            this.avatarAMouseDownHandler=on.pausable(dom.byId(this.avatarA.avatarId),"mousedown",lang.hitch(this,function(){
                this.mouseDownCommonGovernance();
                this.avatarAMouseDownHandler.pause(); //will be resumed by avatarBMouseDownHandler
                this.avatarBMouseDownHandler.resume();
                this.activeArea.switchAvatarForAllAreasExceptActivatedTo(this.avatar);//the detect avatar is passed to all areas except active
            }));
            this.avatarAMouseDownHandler.pause();
            this.avatarBMouseDownHandler=on.pausable(dom.byId(this.avatarB.avatarId),"mousedown",lang.hitch(this,function(){
                this.mouseDownCommonGovernance();
                this.avatarBMouseDownHandler.pause(); //will be resumed by avatarAMouseDownHandler
                this.avatarAMouseDownHandler.resume();
                this.activeArea.switchAvatarForAllAreasExceptActivatedTo(this.avatar);//the detect avatar is passed to all areas except active
            }));
            this.avatarBMouseDownHandler.pause();
        },
        switchToAlternateAvatar: function(){
            if(this.avatar.avatarId == this.avatarA.avatarId)
                this.avatar = this.avatarB;
            else
                this.avatar = this.avatarA;
        },
        isAlternateAvatarBeingResized: function(){
            var beingResized = false;
            if(this.avatar.avatarId == this.avatarA.avatarId)
                beingResized = this.avatarB.beingMovedResized();
            else
                beingResized = this.avatarA.beingMovedResized();
            return beingResized;
        },
        switchActivationToCurrentAvatar: function(){
                if(this.avatarB.current.active) {
                    this.avatarB.toggleHandles(false);
                 }
                if(this.avatarA.current.active) {
                    this.avatarA.toggleHandles(false);
                }
                if(this.avatar.avatarId == this.avatarB.avatarId)
                    this.avatarA.toggleHandles(true);
                else
                    this.avatarB.toggleHandles(true);
        },
        mouseDownCommonGovernance: function() {
           if (this.activeArea)
                this.activeArea.isActivated = false;//marks previous area as deactivate
            this.activeArea = this.topArea;
            this.activeArea.isActivated = true;
            this.activeAvatar =  this.avatar;
            this.activeAvatar.mouseDownCallback = lang.hitch(this,function(){
                if (this.activeArea)
                  this.activeArea.toggleVisible(false);
            });
            this.switchToAlternateAvatar();//if current is avatarA sets current to avatarB otherwise sets current to avatarA
            // this.avatarA.setBoundaries(this.activeArea.getBoundaries());
            // this.avatarB.setBoundaries(this.activeArea.getBoundaries());
            // this.activeAvatar.mouseDownCallback = function () {
            //     console.log("                                vai garantir que as boundaries são correctas...");
            // };
            console.log("Caller ====->Mouse down in "+this.avatar.avatarId+" detected by engine " + this.detectorId +
                     ". The area="+this.activeArea.name + " was clicked. Boundaries="+this.avatar.oBoundaries.l+","+
                     this.avatar.oBoundaries.t+","+this.avatar.oBoundaries.w+","+this.avatar.oBoundaries.h);
            this.switchActivationToCurrentAvatar();
        },

        resizeMoveEndCommonGovernance: function(msg) {
            console.log("@######## "+ msg +" ######### ------ resizeMoveEnd DETECTED in caller !!! engine="+this.detectorId+", area="+this.topArea.name);
            if(this.activeAvatar)
                this.activeAvatar.setLanding({l: 0,t: 0,w: 0,h: 0});//undoes eventual PreSelection
            this.avatar = this.avatarA;//a reset closing the circle
            if(this.activeArea)
                this.activeArea.switchAvatarAllAreasTo(this.avatar);
            this.activeArea = null;
            this.activeAvatar = null;
        },
        partialCommonGovernance: function(){
            console.log("@###############  "+ this.activeAvatar.current.label+" ------ resizeMovePartial DETECTED in caller !!! avatar.current.active="+this.avatar.current.active);
            var totalBorderThicknesses = this.activeArea.totalBorderThicknessesBelowArea();
             this.activeArea.moveTo({//moves to absolute positions !!!
                left: this.activeAvatar.position.x - totalBorderThicknesses + this.activeArea.borderThickness,
                top: this.activeAvatar.position.y - totalBorderThicknesses + this.activeArea.borderThickness
            });
            this.activeArea.resize({width: this.activeAvatar.position.w - 2*this.activeArea.borderThickness,
                height: this.activeAvatar.position.h - 2*this.activeArea.borderThickness});
            console.log("@### activeAvatar x,y="+this.activeAvatar.position.x+","+this.activeAvatar.position.y+
                    " activeArea name="+this.activeArea.name+" left,top="+this.activeArea.left+","+this.activeArea.top+" zIndex="+this.activeArea.zIndex);
            this.activeArea.toggleVisible(true);
            if(this.activeArea.type == "container")//HACK
                this.activeAvatar.setZIndex(this.activeArea.highestZIndexAreaUnder(this.activeArea,this.activeArea)+1);
            console.log("@### avatar x,y="+this.activeAvatar.position.x+","+this.activeAvatar.position.y+
                        " activeArea name="+this.activeArea.name+" left,top="+this.activeArea.left+","+
                        this.activeArea.top+" zIndex="+this.activeArea.zIndex+
                        " activeAvatar.zIndex="+this.activeAvatar.getZIndex());
        },
    });
}); //end of  module  