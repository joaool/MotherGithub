/*! FLTour - v1.0.0 - 2014-05-14
Dependencies: JQuery, bootstrap-tour.min.js
* Copyright (c) 2014 FrameLink Co. - JO */
var FL = FL || {};
FL["tourActive"] = false;
FL["eventRegister"] = [{eventName:"signInDone",status:null},{eventName:"sidePanelOpened",status:null},{eventName:"inLogOnProcess",status:null},{eventName:"inMenuEdition",status:null}];
FL["currentTourMap"] = [true,true,true,true,true,true,true,true,true,true,true,true];
FL.stepBeforeEnd = -1;
FL.is_tourSaveOnEnd = true;//if user clicks end in tour end button this will be true, if save is ordered by an event it will be false.

FL["mixinTourMap"] = function(tourMap) { //puts in FL.currentTourMap the current possible steps for current eventRegister
	FL.currentTourMap = [true,true,true,true,true,true,true,true,true,true,true,true]; //each time FL.mixinTourMap() runs, it resets to natural sequence...
	for(var i=0;i<FL.eventRegister.length;i++){
		var eventName = FL.eventRegister[i].eventName;
		var eventStatus = FL.eventRegister[i].status;
		var stepTourMap = FL.findTourMapFor(eventName,eventStatus);
		if(stepTourMap) {
			FL.currentTourMap = _.map(FL.currentTourMap, function(n,i) {
				var booleanValue = ( stepTourMap[i] ) == 1 ? true:false;
				return n && booleanValue;
			});
		}		
	}
	// _.map(FL.currentTourMap, function(n,i) { console.log(i+"->"+n);});
};
FL["findTourMapFor"] = function(onEvent,onEventValue) { //finds the first stepsChangeEvents that matches a double key entry TEST OK
	var stepTourMap = _.find(FL.tourSettings.stepsChangeEvents,function(n) {
		return ( (n.onEvent == onEvent) && (n.onEventValue == onEventValue));
	});
	var toReturn = null;
	if(stepTourMap)
		toReturn = stepTourMap.tourMap;
	return toReturn;
};
FL["updatesEventRegister"] = function(eventName,eventValue) {
	var reg = _.find(FL.eventRegister,function(n){return n.eventName == eventName;});
	reg.status = eventValue;
};
FL["nextOnTourMap"] = function(currentPosition) {
	var next=null;
	for(var i=currentPosition+1;i<FL.currentTourMap.length;i++){
		if(FL.currentTourMap[i]){
			next = i;
			break;			
		}
	}
	return next;
};
FL["prevOnTourMap"] = function(currentPosition) {
	var prev=null;
	for(var i=currentPosition-1;i >= 0;i--){
		if(FL.currentTourMap[i]){
			prev = i;
			break;			
		}
	}
	return prev;
};
FL["getTruePositionFor"] = function(currentStep) {//sets tour internal pointer in the first true position - checks currentStep, then nex, then prev 
	//if everything is false sets pointer at 0
	if(!FL.currentTourMap[currentStep]){ //current is a false position !!!!
		// alert("getTruePositionFor is in currentStep ="+currentStep+ " a false position !!!");
		var next = FL.nextOnTourMap(currentStep);//tries to find any next position 
		if( next === null ){
			var prev = FL.prevOnTourMap(currentStep);
			if( prev === null ){//tries to find any previous position
				currentStep = 0;
				FL.tour.setCurrentStep(currentStep);
				// alert("getTruePositionFor found no true position ->forced a restart");
			}else{
				currentStep = prev;
				FL.tour.setCurrentStep(currentStep);
				// alert("getTruePositionFor found a prev true position in currentStep ="+currentStep);
			}
		}else{
			currentStep = next;
			FL.tour.setCurrentStep(currentStep);
			// alert("getTruePositionFor found a next true position in currentStep ="+currentStep);
		}
	}
}
FL["setNextPrevOfCurrentStep"] = function() {//normally this will return the currentStep existing before the call, but if the current position is false on the map, currentStep will change
	var currentStep = FL.tour.getCurrentStep();
	if (typeof currentStep == "undefined")
		currentStep = null;
	if(currentStep !== null ) { //to avoid error if currentStep is null (before FL.tourBegin();)
		// var hotSeatObj = FL.moveFromHotSeat(currentStep);//does an eventual move from false position in FL.currentTourMap
		if (!FL.currentTourMap[currentStep]) {// if currentStep is 'seated' in a false position we should move it first to a true position on FL.currentTourMap
			FL.stepBeforeEnd = currentStep;
			FL.is_tourSaveOnEnd = false;
			FL.tour.end();//when the user logs on the tour stops
		}else{
			var next = FL.nextOnTourMap(currentStep);
			if( next === null )
				next = currentStep;
			var prev = FL.prevOnTourMap(currentStep);
			if( prev === null )
				prev = currentStep;
			console.log("setNextPrevOfCurrentStep -> currentStep ="+currentStep+" next will be "+next+" and previous will be "+prev);
			FL.tourSettings.steps[currentStep].next = next;
			FL.tourSettings.steps[currentStep].prev = prev;
			
			// FL.tourSettings.steps[next].backdrop = true;

			// if(currentStep == next) {
			// 	alert("setNextPrevOfCurrentStep:  Step "+next+" will be blocked !");
			// }
		}
	}
	return currentStep;	
};
FL["positionOnPossibleStep"] = function(stepBefore) {//with reference stepBefore moves to the closest step 
	if(FL.currentTourMap[stepBefore]) {//tries to keep in the same position
		// alert("Global onEnd: the same position stepBefore="+stepBefore+" is possible");
		FL.tour.setCurrentStep(stepBefore);
	}else{
		var next = FL.nextOnTourMap(stepBefore);
		if (next){
			// alert("Global onEnd: Impossible to keep the same position but next=" + next + " is possible ! -  stepBefore="+stepBefore);
			FL.tour.setCurrentStep(next);
		}else{
			var prev = FL.prevOnTourMap(stepBefore);//tries to move back
			if (prev){//successful moving back
				// alert("Global onEnd: next does not exist but prev exists  at " + prev + " stepBefore="+stepBefore);
				FL.tour.setCurrentStep(prev);
			}else{//cannot move anywhere - tour will begin from 0
				// alert("Global onEnd: next,prev does not exist and resumes at 0 because stepBefore="+stepBefore+" is not acceptable");
				FL.tour.setCurrentStep(0);
			}
		}
	}
};	
FL["onTrueMoveToStep"] = function(onTrue,toStep) {//if actual step toMove equals fromStep moves to toStep
	if( onTrue) {
		FL.is_tourSaveOnEnd = false;//does not save on local storage
		FL.tour.end();//when the user logs on the tour stops
		FL.positionOnPossibleStep(toStep);

		// FL.tour.init();
		// FL.tour.start(true);
	}
};
// --------------------------- message handlers ---------------------------------
FL["suspend_ResumeSequence"] = function(logOnProcess) {
	// alert("***************************  suspend_ResumeSequence with logOnProcess="+logOnProcess+" FL.stepBeforeEnd="+FL.stepBeforeEnd);
	if(FL.tourActive) {
		if(logOnProcess){
			FL.stepBeforeEnd = FL.tour.getCurrentStep();
			// alert("SUSPEND with FL.stepBeforeEnd="+FL.stepBeforeEnd);
			FL.is_tourSaveOnEnd = false;
			FL.tour.end();//when the user logs on the tour stops
		}else{
			// alert("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! RESUME with FL.stepBeforeEnd="+FL.stepBeforeEnd);
			// FL.positionOnPossibleStep(FL.stepBeforeEnd);
			FL.onTrueMoveToStep( (FL.stepBeforeEnd ==1) ,2);
			FL.onTrueMoveToStep( (FL.stepBeforeEnd ==2) ,3);
			FL.tour.init();
			FL.tour.start(true);
			// FL.tourIn();//recalls last stopped tour
			// FL.tour.next();//as soon as the user logs on, tour should move on
		}
	}
};
FL["adjustSequenceOnLogin"] = function(loggedIn) {//subscribed "signInDone"
	FL.updatesEventRegister("signInDone",loggedIn);
	FL.mixinTourMap(FL.currentTourMap);
	// alert("adjustSequenceOnLogin -received a message !!! login is "+loggedIn);
	FL.setNextPrevOfCurrentStep();

	FL.is_tourSaveOnEnd = true;

	if(FL.tourActive) {
		if(loggedIn) {
			FL.onTrueMoveToStep( (FL.stepBeforeEnd ==1) ,2);//if step is 1 moves to 2 (Tour End - logout bug )
			if(FL.stepBeforeEnd ==1){
				FL.tour.init();
				FL.tour.start(true);
			}
		}else{//is log out
			// alert("tour is active !!!");
			FL.onTrueMoveToStep( (FL.stepBeforeEnd ==2) ,1);//if tour is active and step is 2 moves to 1
			if(FL.stepBeforeEnd ==2){
				FL.tour.init();
				FL.tour.start(true);
			}
		}		
	}else{//tour is silent
		if(!loggedIn) {//logOut
			FL.onTrueMoveToStep( (FL.stepBeforeEnd ==2) ,1);//if tour is active and step is 2 moves to 1
			// if(FL.stepBeforeEnd ==2){
			// 	FL.tour.init();
			// 	FL.tour.start(true);
			// }
		}		
	}	
};
FL["adjustSequenceOnSidePanel"] = function(opened) {//subscribed "sidePanelOpened"
	FL.updatesEventRegister("sidePanelOpened",opened);//subscribed "sidePanelOpened"
	FL.mixinTourMap(FL.currentTourMap);
	// alert("adjustSequenceOnSidePanel -received a message !!!");
	FL.setNextPrevOfCurrentStep();
	// alert("@@@@@@@@@@@@@@@@@@@@  adjustSequenceOnSidePanel with opened="+opened+" FL.stepBeforeEnd="+FL.stepBeforeEnd+" and FL.tourActive ="+FL.tourActive);
	if(opened) {
		FL.onTrueMoveToStep( (FL.stepBeforeEnd ==3) ,4);
		if(FL.tourActive) {
			if(FL.stepBeforeEnd ==3){
				FL.tour.init();
				FL.tour.start(true);
			}
		}
	}else{//side panel was closed
		if(FL.tourActive) {
			FL.onTrueMoveToStep( (FL.stepBeforeEnd ==4) ,3);
			if(FL.stepBeforeEnd ==4){
				FL.tour.init();
				FL.tour.start(true);
			}
			FL.onTrueMoveToStep( (FL.stepBeforeEnd ==5) ,3);
			if(FL.stepBeforeEnd ==5){
				FL.tour.init();
				FL.tour.start(true);
			}
			FL.onTrueMoveToStep( (FL.stepBeforeEnd ==6) ,3);
			if(FL.stepBeforeEnd ==6){
				FL.tour.init();
				FL.tour.start(true);
			}
			FL.onTrueMoveToStep( (FL.stepBeforeEnd ==7) ,3);
			if(FL.stepBeforeEnd ==7){
				FL.tour.init();
				FL.tour.start(true);
			}
			FL.onTrueMoveToStep( (FL.stepBeforeEnd ==8) ,3);
			if(FL.stepBeforeEnd ==8){
				FL.tour.init();
				FL.tour.start(true);
			}
			FL.onTrueMoveToStep( (FL.stepBeforeEnd ==9) ,3);
			if(FL.stepBeforeEnd ==9){
				FL.tour.init();
				FL.tour.start(true);
			}
			FL.onTrueMoveToStep( (FL.stepBeforeEnd ==10) ,3);
			if(FL.stepBeforeEnd ==10){
				FL.tour.init();
				FL.tour.start(true);
			}
			FL.onTrueMoveToStep( (FL.stepBeforeEnd ==11) ,3);
			if(FL.stepBeforeEnd ==11){
				FL.tour.init();
				FL.tour.start(true);
			}
		}else{//tour inactive
			// FL.onTrueMoveToStep( (true) ,3);
		}
	}
};
FL["styleChangeHandler"] = function(newStyle) {//subscribed "styleChange"
	// FL.tourSettings.steps[6].content = "click '" + newStyle +"' to pop up different site styles."
	// alert("Style change event !!!!");
	FL.tourSettings.steps[4].content = "1 - Click '" + newStyle +"'.<br>2 - Click the down arrow.<br>3 - Choose another style.<br>4 - Click the checkmark &#x2713.";//2 places ! 205/251
	if(FL.tour.getCurrentStep() == 4) { //a HACK to make a refresh of step 4
		FL.tour.prev();
		FL.onTrueMoveToStep( true ,4);
		FL.onTrueMoveToStep( true ,5);
		FL.tour.init();
		FL.tour.start(true);
	}
};
// -------------------------- end of message handlers ---------------------------
FL["is_tour"] = false;
FL["openTour"] = function(open) {//HACK if open is false =>closes, otherwise is a NOP
	if(!open){
		FL["tourActive"] = false;
		FL.tour.end();
	}
};
FL["tourIn"] = function() {//called by tour icon
	if(FL.is_tour){
		// alert("FL.tourIn was called !!!! with "+FL.stepBeforeEnd);
		FL["tourActive"] = true;//tour exists and is activated
		// var currentStep = FL.tour.getCurrentStep();
		var currentStep = FL.setNextPrevOfCurrentStep();
		// mixpanel.track("TourIcon", {//-----------------------------------------------mixpanel
		// 	"step":FL.setNextPrevOfCurrentStep()
		// });
		FL.mix("TourIcon",{step:FL.setNextPrevOfCurrentStep()});
		// alert("currentStep="+currentStep+" getCurrentStep()->"+FL.tour.getCurrentStep());
		if(currentStep == 0)
			FL.showTourStep0 = true;
		if(FL.showTourStep0) {
			currentStep = 0;//only runs the first time or after a reset.
			FL.tour.setCurrentStep(0);
		}
		FL.getTruePositionFor(currentStep);
		FL.tourSettings.steps[4].content = "1 - Click '" + FL.currentStyle +"'.<br>2 - Click the down arrow.<br>3 - Choose another style.<br>4 - Click the checkmark &#x2713.";//2 places ! 205/251
		localStorage.storedTourStatus  = JSON.stringify({tourActive:FL.tourActive});
		// --------- set of HACKs ----------
		// FL.stepBeforeEnd =  1; //just to be different from -1
		FL.is_tourSaveOnEnd = false;//it was already saved
		if(!FL.showTourStep0) {//this is skipped the first time it runs...
			if(!currentStep ) {
				// alert("Current step undefined we will have an error !!");
				// HACK --------   
				var lastLoginStr = localStorage.getItem("login");
				if(lastLoginStr) {
					FL.stepBeforeEnd=2;
					FL.tour.setCurrentStep(2);
				}else{
					// alert("FL.tourIn Error: Current step undefined and user is logged out !!!! ");
					FL.stepBeforeEnd=1;
					FL.tour.setCurrentStep(1);
					// FL.tour.restart();
				}
			}
			FL.showTourStep0 = false;
			FL.tour.end();
			FL.tour.init();
			FL.tour.start(true);
		}else{//to restart
			FL.stepBeforeEnd=0;
			FL.is_tourSaveOnEnd = false;
			FL.tour.init();
			
			FL.tourSettings.steps[0].backdrop = false; //bootstraptour GUG. without this patch, end() will give TypeError: this.backdrop.remove is not a function
			FL.tour.end();
			FL.tourSettings.steps[0].backdrop = true;

			FL.tour.restart();
		}
		FL.showTourStep0 = false;
	}else{
		console.log("No tour available...");
		BootstrapDialog.alert('No tour available for the moment.');
	}
};
FL["tourBegin"] = function() {
	// alert("TourIn !!!");
	if(FL.is_tour){
		FL.tourSettings.steps[4].content = "1 - Click '" + FL.currentStyle +"'.<br>2 - Click the down arrow.<br>3 - Choose another style.<br>4 - Click the checkmark &#x2713.";//2 places ! 205/251
		FL.tour.setCurrentStep(0);
		if(FL.tourActive) {
			// -------------- HACK if user is logged in tour starts at step 2 (toolbar)
			var lastLoginStr = localStorage.getItem("login");
			if(lastLoginStr) {
				// alert("USER is LOGGED IN  ! TOUR WILL START ON 2 FL.currentTourMap is adjusted to 101111 without any event");
				FL.updatesEventRegister("signInDone",true);
				// FL.currentTourMap = [true,false,true,true,false,false];//tourMap for logIn and side panel closed
				FL.stepBeforeEnd = 2;
				FL.tour.setCurrentStep(2);
			}
			// ------------------------------------------------------------------------

			FL.tour.init();
			FL.tour.start();
		}
	}else{
		console.log("No tour available...");
	}
};
FL["setTourOn"] = function(is_tour) {//if true, creates tour object with steps. Sets FL is_tour status
	// alert("TourIn !!!");
	if(is_tour){
		if(FL.tourSettings.steps){
			if(FL.tourSettings.steps.length>0){
				FL["tour"] = new Tour(FL.tourSettings);
				FL["is_tour"] = true;//if true tour exists
				$.Topic( 'signInDone' ).subscribe( FL.adjustSequenceOnLogin );
				$.Topic( 'sidePanelOpened' ).subscribe( FL.adjustSequenceOnSidePanel );
				$.Topic( 'inLogOnProcess' ).subscribe( FL.suspend_ResumeSequence );
				$.Topic( 'inMenuEdition' ).subscribe( FL.suspend_ResumeSequence );
				$.Topic( 'styleChange' ).subscribe( FL.styleChangeHandler );
				$.Topic( 'setTour' ).subscribe( FL.openTour );

				// FL.mixinTourMap(FL.currentTourMap);
				// FL.tour.init();// Initialize the tour
				// FL.tour.start();// Start the tour
			}else{
				alert("FL.setTourOn Error:Tour was called with FL.setTourOn(true) but no steps are defined !!!");
				is_tour = false;
			}
		}else{
			alert("FL.setTourOn Error:Tour was called with FL.setTourOn(true) but no steps key is defined !!!");
			is_tour = false;
		}
	}
	FL["is_tour"] = is_tour;
};
FL["getTourElement"] = function (tour) { //to solve a bootstraptour bug not working in chrome https://github.com/sorich87/bootstrap-tour/issues/166   solution by KyleMit
	// return tour._steps[tour._current].element //original solution
    return this.tourSettings.steps[tour._current].element; //dapted to FL
};  
FL["tourSettings"] = {
	container: "body",
	storage: false,
	template: "<div class='popover tour' style='max-width: 22em;'>"+
			"<div class='arrow'></div>"+
			"<h3 class='popover-title' align='center' style='background-color: #e8f0f5;line-height:1.0em;margin-top:1.0em;'></h3>"+
			"<div class='popover-content'></div>"+
			"<div class='popover-navigation'>"+
				"<button class='btn btn-default' data-role='prev'>« Prev</button>"+
				"<span data-role='separator'>|</span>"+
				"<button class='btn' data-role='next' style='background-color: #118bd4;color: white;'>Next »</button>"+
				"<button class='btn btn-default' data-role='end' >End tour</button>"+
			"</div>"+
		"</div>",
	onEnd : function() {
		// alert("Global onEnd FL.stepBeforeEnd=" + FL.stepBeforeEnd +" FL.is_tourSaveOnEnd="+FL.is_tourSaveOnEnd+" FL.tourActive="+FL.tourActive+" (237)");
		if(FL.is_tourSaveOnEnd) {
			FL.tourActive = false;
			FL.stepBeforeEnd = FL.tour.getCurrentStep();
			localStorage.storedTourStatus  = JSON.stringify({tourActive:false});
		}else{//event driven end()
			// FL.tourActive = true;
		}
		FL.is_tourSaveOnEnd = true;
	},
	// onShown : function() {
	// 	FL.setNextPrevOfCurrentStep();
	// },
    onShown: function(tour) { //next 3 lines to solve a bootstraptour bug not working in chrome https://github.com/sorich87/bootstrap-tour/issues/166   solution by KyleMit
        var stepElement = FL.getTourElement(FL.tour);
        $(stepElement).after($('.tour-step-background'));
        $(stepElement).after($('.tour-backdrop'));

		FL.setNextPrevOfCurrentStep();//old code
		// var currentStep = FL.tour.getCurrentStep();
		// // alert("onShown: currentStep = "+currentStep);
		// FL.is_tourSaveOnEnd = false;
		// FL.tour.end();
		// FL.tour.setCurrentStep(currentStep);
		// FL.tourSettings.steps[currentStep].backdrop = true;
    },
	stepsChangeEvents: [ //these are the events that may change the 'natural' sequence
		{onEvent: "signInDone",onEventValue: false,suspend: false,     tourMap: [1,1,0,0,0,0,0,0,0,0,0,0]},//if logout, tour only can be in brand or in login
		{onEvent: "signInDone",onEventValue: true,suspend: false,      tourMap: [1,0,1,1,1,1,1,1,1,1,1,1]},//if logout, tour can be everywhere e except login
		{onEvent: "sidePanelOpened",onEventValue: true,suspend: false, tourMap: [1,0,1,0,1,1,1,1,1,1,1,1]},
		{onEvent: "sidePanelOpened",onEventValue: false,suspend: false,tourMap: [1,1,1,1,0,0,0,0,0,0,0,0]},
		{onEvent: "inLogOnProcess",onEventValue: true,suspend: true},
		{onEvent: "inMenuEdition",onEventValue: false,suspend: true}
	],
	steps: [
		{
			// element: "#brand",//0
			placement: "right",
			backdrop: true,
			orphan:true,
			title: "<p align='center' style='line-height:1.0em;margin-top:1.0em;'><strong>FrameLink presentation</strong></p>",
			content: "<p>FrameLink works by transforming itself into YOUR own business web application.</p><img style='height: 10em;display: block;margin: 0 auto;' src='FL_ui/img/tourFrameLink.jpg'><p>You can change Framelink's menus into the menus that match your needs.</p>",
		},
		{
			element: "#_signIn",//1
			placement: "bottom",
			backdrop: true,
			title: "<p align='center' style='line-height:1.0em;margin-top:1.0em;'><strong>Sign in as a FrameLink designer</strong></p>",
			template: "<div class='popover tour' style='max-width: 22em;'>"+
					"<div class='arrow'></div>"+
					"<h3 class='popover-title' align='center' style='background-color: #e8f0f5;line-height:1.0em;margin-top:1.0em;'></h3>"+
					"<div class='popover-content'></div>"+
					"<div class='popover-navigation'>"+
						"<button class='btn btn-default' data-role='prev'>« Prev</button>"+
						// "<span data-role='separator'>|</span>"+
						// "<button class='btn' data-role='next' style='background-color: #118bd4;color: white;'>Next »</button>"+
						"<button class='btn btn-default' data-role='end' >End tour</button>"+
					"</div>"+
				"</div>",
			content: "<p>Click Sign In to change from 'normal' user to a 'DESIGNER' that can change this site.</p>"
		},
		{
			element: "#toolbar",//2
			placement: "bottom",
			backdrop: true,		
			title: "Edit this menu",
			content: "<p>Let's try changing the menu above !</p><p>RIGHT CLICK over any menu item.</p><img style='height: 10em;display: block;margin: 0 auto;' src='FL_ui/img/rightClick.jpg'>",
		},
		{
			element: "#_toggle",//3
			placement: "right",
			backdrop: true,
			title: "Access FrameLink side panel.",
			template: "<div class='popover tour' style='max-width: 22em;'>"+
					"<div class='arrow'></div>"+
					"<h3 class='popover-title' align='center' style='background-color: #e8f0f5;line-height:1.0em;margin-top:1.0em;'></h3>"+
					"<div class='popover-content'></div>"+
					"<div class='popover-navigation'>"+
						"<button class='btn btn-default' data-role='prev'>« Prev</button>"+
						// "<span data-role='separator'>|</span>"+
						// "<button class='btn' data-role='next' style='background-color: #118bd4;color: white;'>Next »</button>"+
						"<button class='btn btn-default' data-role='end' >End tour</button>"+
					"</div>"+
				"</div>",	
			// content: "<p>Click the top left icon to access the SIDE PANEL.</p>.<img style='height: 10em; display: block;margin: 0 auto;' src='FL_ui/img/clickSidePanel.jpg'>"
			content: "<p>Click the top left icon to access the SIDE PANEL.</p>"
		},
		{
			element: "#_globalStyles",//4
			placement: "right",
			backdrop: true,
			template: "<div class='popover tour' style='max-width: 22em;'>"+
					"<div class='arrow'></div>"+
					"<h3 class='popover-title' align='center' style='background-color: #e8f0f5;line-height:1.0em;margin-top:1.0em;'></h3>"+
					"<div class='popover-content' style='margin-left:2.0em;'></div>"+
					"<div class='popover-navigation'>"+
						"<button class='btn btn-default' data-role='prev'>« Prev</button>"+
						"<span data-role='separator'>|</span>"+
						"<button class='btn' data-role='next' style='background-color: #118bd4;color: white;'>Next »</button>"+
						"<button class='btn btn-default' data-role='end' >End tour</button>"+
					"</div>"+
				"</div>",			
			title: "Change the site style",
			content:""//defined in 199 and 245 !!
		},
		{
			element: "#_fonts",//5
			placement: "right",
			backdrop: true,
			title: "Select Fonts",
			content: "NOT AVAILABLE - Choose head and paragraph fonts."
		},
		{
			element: "#_reset",//6
			placement: "right",
			backdrop: true,
			title: "Factory defaults",
			content: "Click to reset original settings."
		},
		{
			element: "#_forms",//7
			placement: "right",
			backdrop: true,		
			title: "Create/edit Forms - Login Service",
			content: "NOT AVAILABLE - This will allow customization of forms to edit your data. Some of these forms may be accessed by users with permission to edit their own data."
		},
						{
			element: "#_newsLetters",//8
			placement: "right",
			backdrop: true,		
			title: "Send Newsletters/SMS/Voice",
			content: "NOT AVAILABLE - This will add an Email/Newsletters, SMS or Voice service to your FrameLink database."
		},
		{
			element: "#_appointments",//9
			placement: "right",
			backdrop: true,		
			title: "Set appointments",
			content: "NOT AVAILABLE - This will add a service to set appointments with people defined in your data."
		},
		{
			element: "#_cart",//10
			placement: "right",
			backdrop: true,		
			title: "Shopping cart",	
			content: "NOT AVAILABLE - This will add a shopping cart service to be used by users who can logon into your site."
		},
		{
			element: "#_invoicePayment",//11
			placement: "right",
			backdrop: true,
			template: "<div class='popover tour' style='max-width: 22em;'>"+
					"<div class='arrow'></div>"+
					"<h3 class='popover-title' align='center' style='background-color: #e8f0f5;line-height:1.0em;margin-top:1.0em;'></h3>"+
					"<div class='popover-content'></div>"+
					"<div class='popover-navigation'>"+
						"<button class='btn btn-default' data-role='prev'>« Prev</button>"+
						// "<span data-role='separator'>|</span>"+
						// "<button class='btn' data-role='next' style='background-color: #118bd4;color: white;'>Next »</button>"+
						"<button class='btn btn-default' data-role='end' >End tour</button>"+
					"</div>"+
				"</div>",						
			title: "Invoicing/Payments",
			content: "NOT AVAILABLE - This will add a Invoicing/Payment service to your FrameLink database. With this service active a 'Payment' button will be available in Forms/Grid service."
		},
	]
};
