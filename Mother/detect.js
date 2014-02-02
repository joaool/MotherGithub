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
        // avatarAId: null,
        // avatarBId: null,
        topArea: null,
        
        previousTopContainerArea: null,//only to be use by this.borderRed()
        previousTopContainerAreaBorderThickness: null,//only to be use by this.borderRed()
        previousTopContainerAreaBorderColor: null,//only to be use by this.borderRed()
        
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
            
            this.avatarAId = detectorId+"_A";
            this.avatarA = new resizeMoveArea(this.avatarAId,initialLanding,initialBoundaries,{
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

            this.avatarBId = detectorId+"_B";
            this.avatarB = new resizeMoveArea(this.avatarBId,initialLanding,initialBoundaries,{
                label:"AvatarB",
                gridPattern:5,
                //borderThickness:4,
                //borderType:"inset",//"dotted",
                //borderColor:"blue",
                fillColor:"purple",
                opacity:0.6,
                tooltip:"B this is resize move over a dojo widget !"
            });
            this.avatarB.setCursorInactive("pointer");
            // this.avatar.mouseDownCallback = lang.hitch(this,function(){
            //     this.topArea.toggleVisible(false);//when user clicks the area to drag, makes topArea invisible
            // });

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
                    if(this.activeAvatar.isPointInside(x,y,6)) {
                        doesPreSelection = false;
                        this.avatar.setLanding({l: 0,t: 0,w: 0,h: 0});//undoes eventual PreSelection
                        topAreaCandidate = this.activeArea;
                        // console.log("mouse inside active area "+topAreaCandidate.name+" id="+ topAreaCandidate.id+
                        //         " previous id="+ this.lastDetectedAreaId);
                    } else {
                        // console.log("mouse outside active area. Current area is "+topAreaCandidate.name+" with id="+
                        //         topAreaCandidate.id+" previous id="+ this.lastDetectedAreaId +" does="+doesPreSelection);
                    }
                }
                // console.log(" does="+doesPreSelection);
                if (doesPreSelection) {
                    if (this.lastDetectedAreaId != topAreaCandidate.id) { //if cursor changed to a new area
                        var extraThickness = topAreaCandidate.totalBorderThicknessesBelowArea();
                        console.log("detect mouseMoveHandler "+this.avatar.avatarId+"-------------------> Change to new area "+topAreaCandidate.name+" x=" + x + " y="+ y +" type="+ topAreaCandidate.type +
                                " id="+ topAreaCandidate.id + "-->"+topAreaCandidate.left+","+
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
                console.log("@######## AvatarA ######### ------ resizeMoveEnd DETECTED in caller !!! engine="+this.detectorId+", area="+this.topArea.name);
                // this.topArea.deActivate();
                //this.isActive = false;
                if(this.activeAvatar)
                    this.activeAvatar.setLanding({l: 0,t: 0,w: 0,h: 0});//undoes eventual PreSelection
                this.avatar = this.avatarA;//a reset closing the circle
                if(this.activeArea)
                    this.activeArea.switchAvatarAllAreasTo(this.avatar);
                this.activeArea = null;
                this.activeAvatar = null;
                this.avatarAMouseDownHandler.resume();
                // this.topArea.containerParent.childDump();
            }));
        },
        setResizeMoveEndListernerForAvatarB: function() {
            this.avatarA.on("resizeMoveEnd",lang.hitch(this,function(oEvt){
                console.log("@######## AvatarB ######### ------ resizeMoveEnd DETECTED in caller !!! engine="+this.detectorId+", area="+this.topArea.name);
                // this.topArea.deActivate();
                //this.isActive = false;
                if(this.activeAvatar)
                    this.activeAvatar.setLanding({l: 0,t: 0,w: 0,h: 0});//undoes eventual PreSelection
                this.avatar = this.avatarA;// a reset closing the circle
                if(this.activeArea)
                    this.activeArea.switchAvatarAllAreasTo(this.avatar);
                this.activeArea = null;
                this.activeAvatar = null;
                this.avatarBMouseDownHandler.resume();
            }));
        },
        setResizeMovePartialListernerForAvatarA: function() {
            this.avatarA.on("resizeMovePartial",lang.hitch(this,function(oEvt){
                console.log("@################################################## A ------ resizeMovePartial DETECTED in caller !!! avatar.current.active="+this.avatar.current.active);
                var totalBorderThicknesses = this.activeArea.totalBorderThicknessesBelowArea();
                 this.activeArea.moveTo({//moves to absolute positions !!!
                    left: this.activeAvatar.position.x - totalBorderThicknesses + this.activeArea.borderThickness,
                    top: this.activeAvatar.position.y - totalBorderThicknesses + this.activeArea.borderThickness
                });
                this.activeArea.resize({width: this.activeAvatar.position.w - 2*this.activeArea.borderThickness,
                    height: this.activeAvatar.position.h - 2*this.activeArea.borderThickness});
                console.log("@### avatarA x,y="+this.activeAvatar.position.x+","+this.activeAvatar.position.y+
                        " activeArea name="+this.activeArea.name+" left,top="+this.activeArea.left+","+this.activeArea.top+" zIndex="+this.activeArea.zIndex);
                this.activeArea.toggleVisible(true);
            }));
        },
        setResizeMovePartialListernerForAvatarB: function() {
            this.avatarB.on("resizeMovePartial",lang.hitch(this,function(oEvt){
                console.log("@################################################## A ------ resizeMovePartial DETECTED in caller !!! avatar.current.active="+this.avatar.current.active);
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
            }));
        },
        setMouseDownHandlersPaused: function(){
            this.avatarAMouseDownHandler=on.pausable(dom.byId(this.avatarA.avatarId),"mousedown",lang.hitch(this,function(){
                if (this.activeArea)
                    this.activeArea.isActivated = false;//marks previous area as deactivate
                this.activeArea = this.topArea;
                this.activeArea.isActivated = true;
                this.activeAvatar =  this.avatar;
                this.activeAvatar.mouseDownCallback = lang.hitch(this,function(){
                    if (this.activeArea)
                      this.activeArea.toggleVisible(false);
                });
                // alert("montou this.activeAvatar.mouseDownCallback em A");
                console.log("Caller (A)====->Mouse down in "+this.avatarA.avatarId+" detected by engine " + this.detectorId +
                         ". The area="+this.activeArea.name + " was clicked ");
                this.avatar = this.avatarB;
                if(this.avatarB.current.active) {
                    this.avatarB.toggleHandles(false);

                }
                this.avatarA.toggleHandles(true);
                this.avatarAMouseDownHandler.pause(); //will be resumed by avatarBMouseDownHandler
                this.avatarBMouseDownHandler.resume();
                this.activeArea.switchAvatarForAllAreasExceptActivatedTo(this.avatar);//the detect avatar is passed to all areas except active
                // alert("switchAvatarForAllAreasExceptActivatedTo DONE!");
            }));
            this.avatarAMouseDownHandler.pause();
            // this.avatarA.mouseDownCallback = function(){
            //     alert("begin of a move or resize in avatar A");
            // };
            this.avatarBMouseDownHandler=on.pausable(dom.byId(this.avatarB.avatarId),"mousedown",lang.hitch(this,function(){
                if (this.activeArea)
                    this.activeArea.isActivated = false;//marks previous area as deactivate
                this.activeArea = this.topArea;
                this.activeArea.isActivated = true;
                this.activeAvatar =  this.avatar;
                this.activeAvatar.mouseDownCallback = lang.hitch(this,function(){
                     this.activeArea.toggleVisible(false);
                });
                console.log("Caller (B)====->Mouse down in "+this.avatarB.avatarId+" detected by engine " + this.detectorId +
                        ". The area="+this.activeArea.name + " was clicked ");
                this.avatar = this.avatarA;
                if(this.avatarA.current.active) {
                    this.avatarA.toggleHandles(false);
                }
                this.avatarB.toggleHandles(true);
                this.avatarBMouseDownHandler.pause(); //will be resumed by avatarAMouseDownHandler
                this.avatarAMouseDownHandler.resume();
                this.activeArea.switchAvatarForAllAreasExceptActivatedTo(this.avatar);//the detect avatar is passed to all areas except active
            }));
            this.avatarBMouseDownHandler.pause();
        },
        clearPreSelection: function(candidateArea) {// clears if candidateArea does not belong to an activated root
            if(candidateArea.rootDetectionArea.rootDetectionAreaActivated) {
                if(candidateArea.rootDetectionArea.rootDetectionActivationEngine == 1) {
                    //
                } else { //candidateArea.rootDetectionArea.rootDetectionActivationEngine == 2 !
                    //
                }

            } else {
                this.avatar.setLanding({l: 0,t: 0,w: 0,h: 0});//undoes eventual PreSelection
            }
         },
    });
}); //end of  module  