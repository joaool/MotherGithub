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
        avatarClickInsideHandler:null,
        avatarMouseDownHandler: null,
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
            // console.log(" DETECT end of contructor "+this.avatar.current.label);
        },
        toggleDetector:function(isDetector){
            this.setEventHandlers();
            if(isDetector){//on
                // this.avatarClickInsideHandler.resume();
                this.avatarMouseDownHandler.resume();
                this.mouseMoveHandler.resume();
            }else{//off
                this.avatarClickInsideHandler.pause();
                this.avatarMouseDownHandler.pause();
                this.mouseMoveHandler.pause();
            }
        },
        setEventHandlers:function(){
            this.avatarClickInsideHandler=on.pausable(dom.byId(this.avatar.avatarId),"click",lang.hitch(this,function(){
                console.log("DetectAreas  avatarClickInsideHandler=================->Mouse click inside activated area");
                // this.emit("detectInsideActiveClick",{order:z,area:this.arrAreas[z]});
                alert("detect detectInsideActiveClick");
                this.emit("detectInsideActiveClick",{});
            }));
            this.avatarClickInsideHandler.pause();

            this.avatarMouseDownHandler=on.pausable(dom.byId(this.avatar.avatarId),"mousedown",lang.hitch(this,function(){
                console.log("Caller =========================================->Mouse down in AVATAR <");
                this.avatar.activate();
                this.avatarMouseDownHandler.pause();
                this.mouseMoveHandler.pause();
            }));
            this.avatarMouseDownHandler.pause();

            this.avatar.mouseDownCallback = lang.hitch(this,function(){
                this.topArea.toggleVisible(false);//when user clicks the area to drag, makes topArea invisible
            });
            this.avatar.on("resizeMovePartial",lang.hitch(this,function(oEvt){
                console.log("######################################################################## ------ resizeMovePartial DETECTED in caller !!! (W1) inside="+oEvt.inside+", avatar.current.active="+this.avatar.current.active);
                var deltaLeft = this.topArea.containerParent.left;
                var deltaTop = this.topArea.containerParent.top;
                this.topArea.moveTo({left: this.avatar.position.x - deltaLeft,top: this.avatar.position.y - deltaTop});
                // tx.resize({width: avatar.position.w-2*tx.borderThickness+2,height: avatar.position.h-2*tx.borderThickness+2});
                this.topArea.resize({width: this.avatar.position.w,height: this.avatar.position.h});
                this.topArea.toggleVisible(true);
                if(this.topArea.borderColor=="red")
                    this.topArea.setBorder({borderColor: "blue"});
                else
                    this.topArea.setBorder({borderColor: "red"});
            }));
            this.avatar.on("resizeMoveEnd",lang.hitch(this,function(oEvt){
                console.log("######## AVATAR ######### ------ resizeMoveEnd DETECTED in caller !!! inside="+oEvt.inside+", avatar.current.active="+this.avatar.current.active);
                this.avatarMouseDownHandler.resume();//put it ready to be detected when mouse clicks the area
                this.mouseMoveHandler.resume();
                this.topArea.containerParent.childDump();
            }));
            this.mouseMoveHandler = on.pausable(win.body(), "mousemove", lang.hitch(this,function(e){
                //this only works for areas under at least one container - built using (canvas) areaFactory class
                var x=e.pageX;
                var y=e.pageY;
                var topAreaCandidate = this.canvas.baseContainer.topAreaUnderPoint({left: e.pageX, top: e.pageY},this.canvas.baseContainer);
                if(topAreaCandidate.zIndex >= 0) {// if it is not the canvas
                    // console.log("detect class x=" + x + " y="+ y +" type="+ topArea.type +" id="+ topArea.id +" name="+ topArea.name);
                    if (this.lastDetectedAreaId != topAreaCandidate.id) { //if cursor changed to a new area
                        this.lastDetectedAreaId = topAreaCandidate.id;
                        console.log(" x=" + x + " y="+ y +" type="+ topAreaCandidate.type +" id="+ topAreaCandidate.id +" name="+ topAreaCandidate.name + "-->"+topAreaCandidate.left+","+topAreaCandidate.top);
                        this.topArea = topAreaCandidate;
                        this.adjustAvatarToTopArea();
                        // tx=topArea;
                    }
                }
            }));
            this.mouseMoveHandler.pause();
        },//setEventHandlers  
        adjustAvatarToTopArea: function() {//put avatar serving this area
            var avatarLanding={l: this.topArea.left,t: this.topArea.top,w: this.topArea.width+2*this.topArea.borderThickness+2,h: this.topArea.height+2*this.topArea.borderThickness+2};
            var avatarBoundaries = null;
            if (this.topArea.containerParent) {
                avatarBoundaries = {
                    l:this.topArea.containerParent.left,
                    t:this.topArea.containerParent.top,
                    w:this.topArea.containerParent.width,
                    h:this.topArea.containerParent.height
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
            // alert("adjustAvatarToTopArea "+this.avatar.current.label);
        },
    });
}); //end of  module  