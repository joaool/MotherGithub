define([
    "dojo/_base/declare",
    "dojo/_base/window",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/Evented",
    "dojo/dom",
    "dojo/dom-style",
    "/pdojo/MotherGitHub/Mother/areasFactory.js",
    "Mother/detect.js"
], function(declare, win, lang, on, Evented, dom, domStyle, canvas,detectEngine) {
    return declare(Evented,{
        canvas: null,
        enginePairId: null,
        detectEngineA: null,
        detectEngineB: null,
        currentActivatedArea: null,
        nextAreaToActivate: null,
        currentEngine: null,
        constructor: function(canvas,enginePairId) {
            // alert("BEGIN detect);
            this.canvas = canvas;
            this.enginePairId = enginePairId;
            this.detectEngineA = new detectEngine(canvas,enginePairId+"_A");//canvas is the mouse area where detection is possible for detectEngine1
            // this.detectEngineA.togglePossibleActivation(true);
            // canvas.baseContainer.detectableBy(detectEngine1);//canvas is now sensible to detection by detectEngine1
            //One area may be detectable by a one or two engines simultaneously - 
            // c0.detectableBy(detectEngine1);//c0 now is sensible to detection by detectEngine1 
            this.detectEngineB = new detectEngine(canvas,enginePairId+"_B");//canvas is the mouse area where detection is possible for detectEngine2
            // this.detectEngineB.togglePossibleActivation(true);
            // c0.detectableBy({engine1: detectEngine1, engine2: detectEngine2});//c0 now is sensible to detection by detectEngine1 
            this.canvas.baseContainer.detectableBy({engine1: this.detectEngineA, engine2: this.detectEngineB});//c0 now is sensible to detection by detectEngine1 
            this.setAvatarActivatedInAListerner();
            this.setAvatarActivatedInBListerner();
            this.setAvatarDeactivatedInAListerner();
            this.setAvatarDeactivatedInBListerner();
        },
        pairActivation: function(isActive){
            this.detectEngineA.togglePossibleActivation(isActive);
            this.currentEngine = "A";
            // this.detectEngineB.togglePossibleActivation(isActive);
        },
        setAvatarActivatedInAListerner: function() {
            this.detectEngineA.on("avatarActivated",lang.hitch(this,function(oEvt){
                console.log("enginePair event avatarActivated area " + oEvt.activatedArea.name + " was activated by engine A !!!");
                if(this.currentActivatedArea) {
                    this.currentActivatedArea = null;
                    this.nextAreaToActivate = oEvt.activatedArea;
                } else {
                    this.currentActivatedArea = oEvt.activatedArea;
                    this.currentActivatedArea.activate1();
                    this.detectEngineB.togglePossibleActivation(true);
                    this.currentEngine = "B";
                }
            }));
        },
        setAvatarActivatedInBListerner: function() {
            this.detectEngineB.on("avatarActivated",lang.hitch(this,function(oEvt){
                console.log("enginePair event avatarActivated area " + oEvt.activatedArea.name + " was activated by engine B !!!");
                if(this.currentActivatedArea) {
                    this.currentActivatedArea = null;
                    this.nextAreaToActivate = oEvt.activatedArea;
                } else {
                    this.currentActivatedArea = oEvt.activatedArea;
                    this.currentActivatedArea.activate1();
                    this.detectEngineA.togglePossibleActivation(true);
                    this.currentEngine = "A";
                }
            }));
        },
        setAvatarDeactivatedInAListerner: function() {
            this.detectEngineA.on("detectResizeMoveEnd",lang.hitch(this,function(oEvt){
                var msg = "";
                if (this.nextAreaToActivate) {
                    msg = " but " + this.nextAreaToActivate.name + "will be activated next ";
                }
                // alert("enginePair event detectResizeMoveEnd area " + oEvt.deActivatedArea.name + " was Deactivated by engine A " + msg + " !!!");
                if (this.nextAreaToActivate) {
            // this.nextAreaToActivate.prepareAreaActivation();
            // this.nextAreaToActivate.activate1();
            // alert ("enginePair.setAvatarDeactivatedInAListerner area="+this.nextAreaToActivate.name+ " was activated");
                    // alert("switches off engine "+this.detectEngineA.avatarId);
                    this.detectEngineA.togglePossibleActivation(false);
                    this.detectEngineB.togglePossibleActivation(true);
                    this.currentEngine = "B";
                    console.log("enginePair.setAvatarDeactivatedInAListerner current engine is "+ this.currentEngine+". Area="+
                            this.nextAreaToActivate.name+" is set in this.nextAreaToActivate to be activated !");

                    // alert ("enginePair.setAvatarDeactivatedInAListerner current engine is "+ this.currentEngine+". Area="+
                    //         this.nextAreaToActivate.name+" is set in this.nextAreaToActivate to be activated !");
                    // this.nextAreaToActivate.activate1();
                    on.emit(dom.byId(this.detectEngineB.avatar.avatarId), "mousedown", {
                        bubbles: true,
                        cancelable: true
                    });
                    this.detectEngineB.setMouseDownHandlerPausedToAvatar();

                }
                // this.currentActivatedArea = null;
            }));
        },
        setAvatarDeactivatedInBListerner: function() {
            this.detectEngineB.on("detectResizeMoveEnd",lang.hitch(this,function(oEvt){
                alert("enginePair event detectResizeMoveEnd area " + oEvt.deActivatedArea.name + " was Deactivated by engine B !!!");
                this.currentActivatedArea = null;
            }));
        },
     });
}); //end of  module  