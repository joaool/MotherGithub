		define([ "Mother/resizeWCoord5.js",
				"dojo/_base/declare",
				"dojo/_base/window",
				"dojo/on",
				"dojo/Evented",
				"dojo/dnd/move",
				"dojo/dom",
				"dojo/dom-attr",
				"dojo/dom-geometry",
				"dojo/dom-construct",
				"dojo/dom-style",
				"dojo/_base/lang",
				"dojo/domReady!"],
			function(ResizeWidget,Declare,Win,On,Evented,Move,Dom,DomAttr,DomGeom,DomConstruct,DomStyle,Lang){
				return Declare("resizeMoveArea", [Evented],{
			        //http://dojotoolkit.org/reference-guide/1.9/dojo/_base/declare.html - objects declared in contructor so that each instance gets its own copy
					//This class allows the resize and move of a screen area within boundaries. The screen area can be an avatar of anything.
					//	Use:
					//    1 - Create ResizeMoveArea - this will show the area non activated (without handles)
					//        Ex:	
					/*				var oLanding={l:20,t:30,w:120,h:30};
									var oBoundaries={l:20,t:20,w:1270,h:420};
									x1=new ResizeMoveArea("test",oLanding,oBoundaries,{
										label:"Area",
										gridPattern:5,
										opacity:.9
									});
					*/
					//        The area will be activated by a click on it.
					//	2- Version8 will be activated whenever the user does a mouse down inside the area. However if the user wants to catch 
					/*
								var handlerArea=On.pausable(Dom.byId(x1.moveResizeDivId), "mousedown", Lang.hitch(this,function(evt){ 
									if(x1.lastExitInside){//previous was inside the area
										x1.lastExitInside=false;.
									}else{//first time (lastExitInside default is false) or previous click was outside the area
										x1.activate();
										handlerArea.pause();//prevents "click" event reentry
									};	
								}));
					*/
					//			NOTICE: the click handler must allways test lastExitInside and set it to false if it is true
					//					the click handler must allways activate ResizeMoveArea and pause itsel if lastExitInside=false
					//
					//    3- ResizeMoveArea emits the "resizeMovePartial" event at the end of every resize 
					//			YOU DO NOT NEED TO CATCH THIS EVENT. CATCH IT IF YOU WANT TO DO SOMETHING SPECIAL BETWEEN MOVES/RESIZES
					//			x1.on("resizeMovePartial",Lang.hitch(this,function(oEvt){
					//				console.log("x1->  left="+x1.position.x+" top="+x1.position.y+" width="+x1.position.w+" height="+x1.position.h+" move="+oEvt.move);
					//			}));
					//
					//			the "resizeMovePartial" event, allows a customized adjustment of the area after every resize.
					//
					//    4- ResizeMoveArea emits the "resizeMoveEnd" event when the user clicks inside the area to signal that she has finished the area definition
					//			x1.on("resizeMoveEnd",Lang.hitch(this,function(oEvt){
								//alert("x1->  left="+x1.position.x+" top="+x1.position.y+" width="+x1.position.w+" height="+x1.position.h);
					//				handlerArea.resume();//put it ready to be detected when mouse clicks the area
					//			}));
					//
					//			NOTICE: the resizeMoveEnd handler must reactivate the area handler (it is disarmed in every activation)
					//
					//     It is possible to keep the handles activated while clicking outside the area with the suspend()  method
					/*     Example:
								var handler=On.pausable(f0.formObj.domNode,"mouseenter",function(){
									x1.suspend(true);//mouse entered f0
								});
								var handler=On.pausable(f0.formObj.domNode,"mouseleave",function(){
									x1.suspend(false);
								});
					*/
					//
					//  NOTE ON EVENTS: 
					//          ResizeMoveArea  uses resizeWidget (resizeWCoord4.js) events:
					//				_onResizeComplete <- when user finishes a parcial resize
					//   			_endResize <- when user terminates the rezise operation by clicking outside the area
					//				_insideEndResize <- when user terminates the rezise operation by clicking inside the area
					//			Normally ResizeMoveArea deals internally with "onResizeComplete" by adjusting the avatar of the area to the new rectangle
					//				resulting from resizeWidget object and only emits an event "resizeMoveEnd" when 
					//				resizing and moving are complete. However we may need to change the undelaying frame (hidden by the avatar) 
					//				for instance to adjust an <img> element...
					//
					//   ResizeMoveArea Events (to be used by callers) are: 
					//     "resizeMovePartial" - equivalent to onResizeComplete but including avatar adjustment
					//	   "resizeMoveEnd" - normal finishing of area resizing - click inside or outside handles
					//				The event argument has the property inside with true for click inside the event and false otherwise.
					//
					// DOM NOTES:
					//   ResizeMoveArea uses a DOM area under the node id="_moveResizeBaseDiv" as an umbrella to all handled frames
					//   each frame is under "_moveResizeBaseDiv" has:
					//   <div>
					//       <div id="_moveResizeDiv0_"+<xId> ... where xId is param 1
					//			<div style="display: block;">
					//				<input id="_avatarId0_"+<xId> ... where xId is param 1 
					//						...visible position and value are defined here>
					//			</div>
					//       </div>
					//	</div>
					//  The above DOM structure is all that exists when handles are not active
					//  When handles are activated an extra temporary DOM structure appears at the
					//         style="display: block;"  level
					//			<div style="display: block;">
					//				<input id="_avatarId0"+<xId> ... where xId is param 1 
					//						...visible position and value are defined here>
					//			</div>					
					//			<div class="resize_NW" style="position: absolute; height: 6px; width: 6px;..."></div>
					//			<div class="resize_NE" style="position: absolute; height: 6px; width: 6px;..."></div>
					//			<div class="resize_SE" style="position: absolute; height: 6px; width: 6px;..."></div>
					//			<div class="resize_SW" style="position: absolute; height: 6px; width: 6px;..."></div>
					//			<div class="resize_N" style="position: absolute; height: 6px; width: 6px;..."></div>
					//			<div class="resize_S" style="position: absolute; height: 6px; width: 6px;..."></div>
					//			<div class="resize_W" style="position: absolute; height: 6px; width: 6px;..."></div>
					//			<div class="resize_E" style="position: absolute; height: 6px; width: 6px;..."></div>
					//
					// ----- HOW TO USE (not rechecked in version 5)--------
					// Example 1:Add a button to an existing FBuilder object (fMan) to move an FBuilder Object.
					// the function mveWindow() Runs when we click the button.
					//		1-The original area when created has the dimensions of fMan (the object we want to move)
					//			When we activate the area we hide the object we want to move (fMan in the example)
					//      2-We loose control until the resizeMoveEnd event is capturad.
					//			We reposition the object to "move", make it visible and make the "avatar" invisible.
					//
					//  fMan.addChild("button",{name:"moveFMan",value:"<-Mve->",left:5,top:xBtnOffset+13*xBtnH,width:162,title:"Move this Window",clickCode:"mveWindow()"});
					//  mveWindow=function(){	
					//		var oVP=fMan.viewPort;
					//		var mve=new ResizeMoveArea("test","test Area",5, oVP.l, oVP.t, oVP.w+18, oVP.h+18,2,"dotted","gold");//borderType:solid, dotted,dashed
					//		handlerArea=On.once(Dom.byId(mve.moveResizeDivId), "mouseenter", Lang.hitch(this,function(evt){ 
					//			mve.activate();//qdo o mouse entra no area esta é activada
					//			fMan.visible(false);
					//		}));	
					//		mve.on("resizeMoveEnd",Lang.hitch(this,function(){
					//			var iLeft = mve.position.x;//
					//			var iTop  = mve.position.y;// 
					//			fMan.resizeVPort(iLeft, iTop);
					//			fMan.visible(true);
					//			mve.visible(false);
					//		}));	
					// };
					moveResizeDivId:null, //this will have "_moveResizeDiv0_"+xId;
					avatarId:null,//this will have "_avatarId0_"+xId;
					position:null,//to return positions ex { w: 300, h: 150, x: 700, y: 900, }
					current:{},
					element:null,
					visibleElement:null,
					objMove:null,//moveable object
					oExchanger:null,//exchanger object
					objResizeWidget:null,//resizeWidget instance
					partialResizeHandler:null,
					mouseDownInsideHandlerArea: null,//when user clicks the area
					mouseUpInsideHandler:null,
					mouseUpOutsideHandler:null,
					//mouseDownHandler:null,
					mouseDownOutsideHandler:null,
					moveStatus:false,
					resizeStatus:true,//default
					initStatus:false,
					lastExitInside:false,
					mousedownStatus:false, //to prepare an exit if mouseUp occurs with signal this.mousedownStatus=true
					mouseupStatus:false,
					//readyToExit:false, 
					activeCursor:"move",
					inactiveCursor:"default",
					z:0,
					z1:0,
					oProps:{label:"Area",gridPattern:5,borderThickness:2,borderType:"dotted",borderColor:"gold",fillColor:"azure",opacity:1,tooltip:""},	//default
					// oLanding:{l:0,t:0,w:100,h:30},	//default
					oLanding: null,	//default
					// oBoundaries:{l:0,t:0,w:1350,h:500},	//default boundaries
					oBoundaries: null,	//default boundaries
					mouseDownCallback:null,
					forceTerminationStatus:false,
					onMoveHandler:null,
					xxxName:"",
					moveCounter:0,
					beginCallback:null,
					endCallback:null,
					swapCallback:null,
					handlesStatus: false,//no handles at the beginning
					constructor:function(xId,oLanding,oBoundaries,oProps){
						/*
						Parameters:
							xId - area Id to be composed in DOM - NOTICE: different instances require different IDs.
							oLanding - inicial landing position and inicial area size
								ex: {l:20,t:20,w:200,h:20}	 
							oBoundaries - boundaries where area can move or resize
								ex: {l:20,t:20,w:1270,h:420}
							oAreaProperties:
								label - text to be shown inside the area.	(default="Area")		 
								gridPattern - grid where handles snap to. (default=5)
								borderThickness - border thickness around area.(default=2)
								borderType - border style.(default="dotted")
									- ex “solid”, “dotted”, ”dashed”,”inset” etc 
								activeColor - border color.(default="gold")
								fillColor - internal area color.(default="azure")
								opacity -opacity grade (0=transparent, 1=solid) (default=1)
								tooltip -area tooltip.  (default="")
						*/
						this.oLanding = {l: 0,t: 0,w: 100,h: 30};//default
						Declare.safeMixin(this.oLanding, oLanding);
						// console.log("ResizeMoveArea Landing: l="+this.oLanding.l+" t="+this.oLanding.t+" w="+this.oLanding.w+" h="+this.oLanding.h);
						this.oBoundaries = {l: 0,t: 0,w: 1350,h: 500};	//default boundaries
						Declare.safeMixin(this.oBoundaries, oBoundaries);
						// console.log("ResizeMoveArea Boundaries: l="+this.oBoundaries.l+" t="+this.oBoundaries.t+" w="+this.oBoundaries.w+" h="+this.oBoundaries.h);
						if(oProps)
							Declare.safeMixin(this.oProps, oProps);
						var xBaseNode=Dom.byId("_moveResizeBaseDiv");
						if(!xBaseNode){//if it does not exist cereates it
							this.element = DomConstruct.create("div",{id:"_moveResizeBaseDiv", style:"position:inherit; top:0; left:0;"}); //cria HTML div -
							Win.body().appendChild(this.element);
						}else{
							this.element =xBaseNode;
							this.element.style.position="inherit"; //necessary to prevent JUMP in move....
						}
						this.moveResizeDivId="_moveResizeDiv0_"+xId;
						if(Dom.byId(this.moveResizeDivId)){//if it exists, destroy its parent
							var node2Destroy=Dom.byId(this.moveResizeDivId).parentNode;
							DomConstruct.destroy(node2Destroy);
						}
						this.avatarId="_avatarId0_"+xId;
						this.current={label:this.oProps.label,active:false,l:this.oLanding.l,t:this.oLanding.t,w:this.oLanding.w,h:this.oLanding.h,borderThickness:this.oProps.borderThickness,borderType:this.oProps.borderType,borderColor:this.oProps.borderColor,fillColor:this.oProps.fillColor,opacity:this.oProps.opacity,tooltip:this.oProps.tooltip};
						// alert("resizeMoveArea CONSTRUCTOR current l="+this.current.l+" t="+this.current.t);
						var xInner0="<div id='"+this.moveResizeDivId+"' style='position: absolute; left:"+this.current.l+"px; top:"+this.current.t+"px; width:"+this.current.w+"px; height:"+this.current.h+"px;'></div>";
						DomConstruct.create("div",{innerHTML:xInner0},this.element);
						this.visibleElement = DomConstruct.create("div"); //cria outro HTML div 
						
						var xStyle="position: absolute; height: "+this.current.h+"px; width: "+this.current.w+"px;";
						xStyle+=" border:"+this.current.borderThickness+"px "+this.current.borderType+" "+this.current.borderColor+";";
						var xInner="<input id='"+this.avatarId+"' class='avatar' type='text' name='textBox' title='' value='"+this.current.label+"' style='"+xStyle+"'>";
						this.visibleElement.innerHTML=xInner;

						dojo.byId(this.moveResizeDivId).appendChild(this.visibleElement); //textarea will be child of inner element instead of child of element (element.appendChild(visibleElement))		
						this.refreshFillColor(this.oProps.fillColor);
						this.setOpacity(this.oProps.opacity);
						this.setTooltip(this.oProps.tooltip);
						// alert("constructor");
						this.setupEvents();
						this.mouseDownInsideHandlerArea.resume();
						this.mouseDownOutsideHandler.resume();
						// console.log("ResizeMoveArea8 END OF CONSTRUCTOR for "+this.avatarId);
						// console.log("-------------------------------------------------------------------------------------------");
					},//constructor
					setupEvents:function(){
						this.mouseDownInsideHandlerArea=On.pausable(Dom.byId(this.avatarId),"mousedown", Lang.hitch(this,function(e){
							// console.log(" - resizeMoveArea8.setupEvents   <<"+this.current.label+
							// 		" >> was ACTIVATED mouseDownInsideHandlerArea");
							this.mouseDownInsideHandlerArea.pause();
							this.mouseDownOutsideHandler.resume();
							this.activate();
						}));
						this.mouseDownInsideHandlerArea.pause();

						this.mouseDownOutsideHandler=On.pausable(window,"mousedown", Lang.hitch(this,function(e){
							// console.log(" - resizeMoveArea8.setupEvents  <<"+this.current.label+
							// 		">> was DEACTIVATED mouseDownOutsideHandler EXIT ");
							if(this.endCallback)
								this.endCallback();
							this.emitEvent({inside:false,l:e.pageX,t:e.pageY});
						}));
						this.mouseDownOutsideHandler.pause();
						this.mouseUpOutsideHandler=On.pausable(window,"mouseup", Lang.hitch(this,function(e){
							alert("ResizeMoveArea  mouseUpOutsideHandler");
							console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  ResizeMoveArea mouseUpOutsideHandler EXIT ");
							if(this.mousedownStatus){
								console.log("mouseUpOutsideHandler EXIT ");
								this.emitEvent({inside:true,l:e.pageX,t:e.pageY});
							}
						}));
						this.mouseUpOutsideHandler.pause();
					},//setupEvents
					toggleHandles: function(isHandles) {
						if (this.objResizeWidget) {
							this.handlesStatus = (isHandles)? true:false;
							if(!this.handlesStatus) {
								this.objResizeWidget.clearResizeHandles();
							} else {
								this.objResizeWidget.createResizeHandles();
							}
						}
					},
					isPointInside: function(x,y,enlargeMargin) {//checks if x,y is inside considering rectangle growth by optional enlargeMargin pixels
						if(!enlargeMargin)
							enlargeMargin = 0;
						// enlargeMargin = 0;
						var isInside = false;
						if (this._isPointBelowRight(x, y, enlargeMargin )) {
							// console.log("resizeMoveArea.isPointInside POINT "+x +","+y +" IS BelowRight ("+this.current.l+","+this.current.t+")");
							// console.log("resizeMoveArea.isPointInside ooooo-> checks if "+ x+" < ("+this.current.l+" + "+this.current.w+")");
							if (x < (this.current.l + this.current.w + enlargeMargin ) && y < (this.current.t + this.current.h + enlargeMargin)){
								isInside = true;
							}
						}
						// if (isInside)
						// 	console.log("resizeMoveArea.isPointInside point "+(x-enlargeMargin)+","+(y-enlargeMargin)+" is INSIDE area ");
						// else
						// 	console.log("resizeMoveArea.isPointInside point "+(x-enlargeMargin)+","+(y-enlargeMargin)+" is OUTSIDE area ");
						return isInside;
					},
					_isPointBelowRight: function(x,y,enlargeMargin){//given a point verifies if that point is below and to the right of area
						var isBelowRight = false;
						if (x > this.current.l - enlargeMargin)
							if (y > this.current.t - enlargeMargin)
								isBelowRight = true;
						return isBelowRight;
					},
					refreshLabel:function(xLabel){//writes xLabel inside the area
						this.current.label=xLabel;
						var xNode=Dom.byId(this.avatarId);
						DomAttr.set(xNode,"value",xLabel); //Dojo way to do it...
						DomStyle.set(this.avatarId,"cursor",this.inactiveCursor);
					},//refreshLabel
					refreshFillColor:function(xR,xG,xB){//receives color text/hexadecimal single parameter/ or 3 RGB color parameters (0-255)
						var xRGB=null;
						var xNode=Dom.byId(this.avatarId);
						if(xG){
							this.current.fillColor.r=xR;
							this.current.fillColor.g=xG;
							this.current.fillColor.b=xB;
							var xRGB="rgb(" + xR + "," + xG + "," + xB +")";
						} else {
							xRGB=xR;//xRGB is taking an hexadecimal format
						}
						DomStyle.set(xNode,"backgroundColor",xRGB); //,"#F09EED"; ,"red"; 
					},//refreshFillColor
					setOpacity:function(xOpacity){//updates opacity level
						//areaOpacity=xOpacity;
						var xNode=Dom.byId(this.avatarId);
						//DomStyle.set(xNode,"opacity",areaOpacity); 
						DomStyle.set(xNode,"opacity",xOpacity);
					},//setOpacity
					setTooltip:function(xTitle){//sets xTitle as the area tooltip
						var xNode=Dom.byId(this.avatarId);
						DomAttr.set(xNode,"title",xTitle); //notice that title is a dom node attribute (not a style element)
					},//setTooltip
					setCursorActive:function(xActiveCursor){//defines the cursor that will show up when area becomes active (with handles)
						//"default"(arrow),"move","pointer"(hand)
						//"text","vertical-text","crosshair","wait","help","<x>-resize"(n,ne,nw,s,se,sw,e,w),"progress","no-drop"
						//"col-resize","row-resize"
						this.activeCursor=xActiveCursor;
					},//setCursorActive
					setCursorInactive:function(xInactiveCursor){//defines the cursor that will show up when area is inactive (no handles)
						this.inactiveCursor=xInactiveCursor;
						this.setCursor(xInactiveCursor);
					},//setCursorActive
					setCursor:function(xCursor){//defines a cursor to the area (this is for internal use)
						DomStyle.set(this.avatarId,"cursor", xCursor); //#### move
					},//setCursorActive
					setLanding:function(oLanding){//updates boundaries where area can be resized/moved.
						Declare.safeMixin(this.oLanding, oLanding);
						this.current.l=this.oLanding.l;
						this.current.t=this.oLanding.t;
						this.current.w=this.oLanding.w;
						this.current.h=this.oLanding.h;
						if(Dom.byId(this.moveResizeDivId)){//it must exist!!!
							DomStyle.set(this.moveResizeDivId,"left",this.current.l);
							DomStyle.set(this.moveResizeDivId,"top",this.current.t);
							DomStyle.set(this.moveResizeDivId,"width",this.current.w);
							DomStyle.set(this.moveResizeDivId,"height",this.current.h);
							if(Dom.byId(this.avatarId)) {
								DomStyle.set(this.avatarId,"width",this.current.w);
								DomStyle.set(this.avatarId,"height",this.current.h);
							}
						}
					},//setBoundaries
					setBoundaries:function(oBoundaries){//updates boundaries where area can be resized/moved.
						Declare.safeMixin(this.oBoundaries, oBoundaries);
					},//setBoundaries
					getZIndex:function(){//gets area's zIndex 
						var xNode=Dom.byId(this.avatarId);
						return DomStyle.get(xNode,"zIndex");
					},//getZIndex
					setZIndex:function(xZIndex){//updates  area's zIndex 
						var xNode=Dom.byId(this.avatarId);
						DomStyle.set(xNode,"zIndex",xZIndex);
					},//setZIndex

					getDim:function(){//returns object w/area dimensions and text ({l:xl,t:xt,w:xw,h:xh,text:xText})
						var xDim={l:null,t:null,w:null,h:null,text:null};
						var xNode=Dom.byId(this.moveResizeDivId);
						var xxNode=Dom.byId(this.avatarId);
						xDim.l = parseInt(DomStyle.get(xNode,"left"));
						xDim.t = parseInt(DomStyle.get(xNode,"top"));
						xDim.w = parseInt(DomStyle.get(xxNode,"width"));
						xDim.h = parseInt(DomStyle.get(xxNode,"height"));
						xDim.text = DomAttr.get(xxNode,"value");
					return xDim;
					},//getDim
					visible:function(bSet){//shows or hides area
						var xNode=Dom.byId(this.moveResizeDivId);
						if(xNode){//pnly acts if node exists
							if(bSet){
								DomStyle.set(xNode,"visibility","visible");
							}else{
								DomStyle.set(xNode,"visibility","hidden");
							}
						}
					},//visible	
					resize:function(oDim){//repositions and resize oDim ({l:xl,t:xt,w:xw,h:xh})
						var xNode=Dom.byId(this.moveResizeDivId);
						if(xNode){
							DomStyle.set(xNode, "left",oDim.l);
							DomStyle.set(xNode, "top",oDim.t);
							DomStyle.set(xNode, "width",oDim.w);
							DomStyle.set(xNode, "height",oDim.h);
						}
						var xxNode=Dom.byId(this.avatarId);
						if(xxNode){
							DomStyle.set(xxNode, "width",oDim.w);
							DomStyle.set(xxNode, "height",oDim.h);
						}
						if(this.current.active){
							this.objResizeWidget.clearResizeHandles();
							this.objResizeWidget.createResizeHandles();
						}
					},//resize	
					colorToHex:function(c) {//converts rgb format to hex format
						//example equals(colorToHex('rgb(120, 120, 240)'), '#7878f0');
						var m = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/.exec(c);
						return m ? '#' + (1 << 24 | m[1] << 16 | m[2] << 8 | m[3]).toString(16).substr(1) : c;
					},
					activate:function(){
						//Activates only one element at a time.
						//when activated one element has 2 states "Handles on" and "drag"
						//		from "Handles on" it is possible to resize or to drag(mouse down)
						//		from "Handles on" it is possible to finish with a click outside the element
						//      from "drag" --->with mouse up --->"handles on"
						//
						// the property __isResize ->defines the status resizing(true) or moving(false) --->default=false
						//     this property is updated by this.setStatus(true) [isResize] or false [is Moving]
						//			the update is done at resizeWidget when resizes begins (resizeWidget._onMouseDown) or 
						//          at moveCoord when onMouseMove begins (moveCoord.onMouseMove)
						//
						if(this.beginCallback)
							this.beginCallback();
						console.log("resizeMove.activate INITIAL POSITION l="+this.current.l+" t="+this.current.t);
						// this.setupEvents();
						//DomStyle.set(this.avatarId,"cursor", "move"); //#### move
						DomStyle.set(this.avatarId,"cursor", this.activeCursor); //#### move
						DomStyle.set(this.visibleElement,"display","block");//to make element visible all times
						//---------- Regista o evento para saida (click sobre o element) ------------
						this.current.active=true;
						this.forceTerminationStatus=false;
						//DomStyle.set(this.avatarId,"border",this.current.borderThickness+"px dotted "+this.current.activeColor);
						DomStyle.set(this.avatarId,"border",this.current.borderThickness+"px "+this.current.borderType+" "+this.current.activeColor);
							this.objResizeWidget=new ResizeWidget({"targetNode":this.moveResizeDivId,"targetType":"textArea"},this,this.oBoundaries);
							// console.log("-----------------------------------------------------------------------------------------");
							// console.log("--------------------------  this.objResizeWidget CREATED for "+this.current.label+" -------------------------------");
							// console.log("-----------------------------------------------------------------------------------------");
							this.objResizeWidget.mouseDownCallback=this.mouseDownCallback;
							if(this.mouseDownCallback) {
								this.objResizeWidget.mouseDownCallback();
								// this.mouseDownCallback();
							}
							this.objResizeWidget.gridPattern=this.oProps.gridPattern;
							//console.log("ResizeMoveArea.activate this.objResizeWidget WAS BUILT for "+this.current.label);
							//this.objResizeWidget.upHandler.pause();
							this.resizeStatus=true;
							this.initStatus=true;
							this.objResizeWidget.on("_endResize",Lang.hitch(this,function(evt){//mouse down outside the area !!!
								console.log("ERRORRRRRRRRRRRRRRRR ResizeMoveArea.activate _endResize CATCHED - TERMINATION resizeStatus="+this.resizeStatus);
								alert("ERRORRRRRRRRRRRRRRRR ResizeMoveArea.activate _endResize CATCHED - TERMINATION resizeStatus="+this.resizeStatus);
								this.emitEvent({inside:false});
							}));

							this.objResizeWidget.on("_insideEndResize",Lang.hitch(this,function(evt){//mouse down outside the area !!!
								//console.log("ResizeMoveArea.activate _insideEndResize CATCHED - a MOVE MAY FOLLOW resizeStatus="+this.resizeStatus);
								this.moveStatus=false;
								this.resizeStatus=false;
							}));

							// this.toggleHandles(true);


							var thiz=this;
							this.partialResizeHandler=this.objResizeWidget.on("_onResizeComplete",Lang.hitch(this,function(e){//callback with an anonimous function
								// console.log("ResizeMoveArea8.activate ---->@@@@@@@@-onResizeParcial-@@@@@@@ "+thiz.current.label+
								//		"---> catch _onResizeComplete EVENT W,H="+e.w+","+e.h);
								// DomStyle.set(this.avatarId,"width",this.objResizeWidget.targetW);
								// DomStyle.set(this.avatarId,"height",this.objResizeWidget.targetH);
								DomStyle.set(this.avatarId,"width",e.w);//HACK why is this.objResizeWidget.targetW different ?
								DomStyle.set(this.avatarId,"height",e.h);//HACK
								thiz.resizeStatus=true;
							// this.position = DomGeom.position(dojo.byId(this.avatarId));
							this.position = {x: e.x,y: e.y,w: e.w,h: e.h};
								this.position["move"]=false;
								thiz.objResizeWidget.upHandler.pause();

								// thiz.setLanding({l:this.position.x,t: this.position.y,w: this.position.w,h: this.position.h});
								this.emit("resizeMovePartial",this.position);//- new on/event system - 
							}));//partialResizeHandler
							this.mouseDownOutsideHandler.resume();
						//};
						//-----------------------------------------this.ready2Move();--------------------------------------------------------------
						this.position = DomGeom.position(this.moveResizeDivId,true);//o arg é o id não o node. use true to get the x/y relative to the document root
						//* -- move preparation
						var thiz = this;
						/*
							this.objMove = new Moveable(Dom.byId(this.moveResizeDivId),{// o HTML element passa a mover-se. a classe moveable vai alterar a sua style property indicando as posições...
							delay:5 //moveable only triggers after a drag of 5 pixels
							//mover:MoveCoord //Moveable instanciates moveCoord (coordinated by this class) when we click on element
						});
						*/
						this.objMove = new Move.boxConstrainedMoveable(Dom.byId(this.moveResizeDivId),{
							//to have the snap to grid effect inside this object we dont need moveCoord class nor exchange anymore
							//the event "Moving" occurs at the beginning of any move step 
							box:this.oBoundaries,
							within:true,
							//mover:moveCoord, //removing the line =>works without gridPattern...Moveable instanciates moveCoord (coordinated by this class) when we click on element
							delay:5 //moveable only triggers after a drag of 5 pixels
						});
						
						//this.onMoveHandler=Connect.connect(this.objMove, "onMove", function (mover) { //return from from moveable when mouse is up
						//this.onMoveHandler=On.once(this.objMove, "Move", function (mover) { //return from from moveable when mouse is up
						this.onMoveHandler=On(this.objMove, "Move", function (mover,leftTop,e) {//called at every onmousemove event
							// necessary to make snapToGrid to work on move
							//console.log("ResizeMoveArea Move ///////////////////////////////////////////////////////////////////////////////////////////////////////  ON MOVE !!!!");
							var x=e.pageX;//this is mouse x position inside this.objectMove
							var y=e.pageY;

							// console.log("ResizeMoveArea7.activate this.onMoveHandler x="+x+" y="+y+" with gridPattern="+thiz.oProps.gridPattern);
							this.onMoving(mover, leftTop);
							var s = mover.node.style;
							s.left = thiz.snapToGrid(leftTop.l) + "px";
							s.top  = thiz.snapToGrid(leftTop.t) + "px";
							// console.log("resizeMove.onMoveHandler - l="+leftTop.l+" t="+leftTop.t);
							thiz.current.l=leftTop.l;
							thiz.current.t=leftTop.t;
							this.onMoved(mover, leftTop);
						});
						
						//Connect.connect(this.objMove, "onMoveStart", function (mover) { //return from from moveable when mouse is up
						On(this.objMove, "MoveStart", function (mover) { //return from from moveable when mouse is up
							thiz.moveStatus=true;
							thiz.resizeStatus=false;
							thiz.initStatus=false;
							thiz.moveCounter++;
							thiz.objResizeWidget.upHandler.pause();//pause resizeWCoord upHandler
							// if(thiz.objResizeWidget.mouseDownCallback)
							// 	thiz.objResizeWidget.mouseDownCallback();
							if(thiz.mouseDownCallback)
								thiz.mouseDownCallback();
							thiz.objResizeWidget.upHandler.pause();

							thiz.position = DomGeom.position(dojo.byId(thiz.avatarId));
							var x=thiz.position.x;
							var y=thiz.position.y;

							// console.log("@@@@@@@@-onMoveStart-@@@@@@@ ResizeMoveArea7.activate "+thiz.current.label+" move#"+thiz.moveCounter+" ---> catch onMoveStart EVENT x="+x+" y="+y);
						});
						//Connect.connect(this.objMove, "onMoveStop", function (mover) { //return from from moveable when mouse is up
						On(this.objMove, "MoveStop", function (mover) { //return from from moveable when mouse is up
							//alert("ResizeMoveArea onMoveStop STOP"+mover);
							thiz.moveStatus=false;
							thiz.resizeStatus=false;

							thiz.mousedownStatus=false;
							thiz.mouseupStatus=true;

							thiz.position = DomGeom.position(dojo.byId(thiz.avatarId));

							var x=thiz.position.x;
							var y=thiz.position.y;
							// console.log("@@@@@@@@-onMoveStop-@@@@@@@@ ResizeMoveArea7.activate "+thiz.current.label+" MoveStop EVENT x="+x+" y="+y);

							thiz.position["move"]=true;
							// thiz.setLanding({l:thiz.position.x,t: thiz.position.y,w: thiz.position.w,h: thiz.position.h});
							thiz.emit("resizeMovePartial",thiz.position);//- new on/event system - 
						//thiz.objResizeWidget.upHandler.resume();
							thiz.objResizeWidget.upHandler.pause();
							if(thiz.swapCallback)
								thiz.swapCallback();
						});
					},//activate
					forceTermination:function(){
						this.forceTerminationStatus=true;
						this.emitEvent({inside:true,l:0,t:0});//runs normally emitevent() except emiting the event
						// this.forceTerminationStatus=false;
						this.current.active=false;
						alert("resizeMoveArea.forceTermination");
						this.mouseDownOutsideHandler.pause();
					},//forceTermination
					emitEvent:function(oEvt){//colects events from resizeWCoord and moveCoord 
						this.z1++;
				
						if(this.objMove){
							this.objMove.mover=null;
							delete this.objMove.mover;
							//console.log("-->resizeMoveArea.emitEvent - destruiu a prop mover de this.objMove ficou="+this.objMove.mover);
							this.objMove.destroy();
							//console.log("-->resizeMoveArea.emitEvent - destruiu this.objMove");
						}else{
							//alert("resizeMoveArea.emitEvent IMPOSSIBILITY:this.objMove DOES NOT EXIST !");
						};
						//console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@ ResizeMove.emitEvent ANTES DO TESTE !!! this.objResizeWidget="+this.objResizeWidget);
						if(this.objResizeWidget){
							//this.mouseDownHandler.remove();
							// this.mouseDownOutsideHandler.remove();
							//this.mouseUpInsideHandler.remove();
							this.mouseUpOutsideHandler.remove();
							this.objResizeWidget.upHandler.remove();
							this.objResizeWidget.mouseDownInsideHandler.remove();
							this.objResizeWidget.moveHandler.remove();
							this.objResizeWidget.clearResizeHandles();
							delete this.objResizeWidget;
							//console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@ ResizeMove.emitEvent event handlers removed !!!");
						}else{
							//alert("resizeMoveArea.emitEvent IMPOSSIBILITY:this.objResizeWidget MUST NOT EXIST !");
						}
						//console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@ ResizeMove.emitEvent resizeMoveEnd EVENT !!! inside="+oEvt.inside+" terminationStatus="+this.forceTerminationStatus);
						//console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@ ResizeMove.emitEvent resizeMoveEnd EVENT !!! this.objResizeWidget="+this.objResizeWidget+" InactiveCursor="+this.inactiveCursor);
						this.lastExitInside=oEvt.inside;//to be used if true (inside) in the begining of activate()
						this.setCursor(this.inactiveCursor);
						this.current.active=false;
						//alert("@@@@@@@ ResizeMove.emitEvent endResize EVENT !!! inside="+oEvt.inside);
						this.mouseDownInsideHandlerArea.resume();
						this.mouseDownOutsideHandler.resume();
						if(!this.forceTerminationStatus)
							this.emit("resizeMoveEnd",oEvt);//- new on/event system - 
					},
					suspend:function(bSet){//if bSet=true suspend all ResizeMove events. If bSet=false resume them.
						if(this.current.active){//if area is not active nothing is done
							if(bSet){
								//this.mouseDownHandler.pause();
								if(this.mouseDownOutsideHandler){
									this.mouseDownOutsideHandler.pause();
									console.log("resizeMoveArea.suspend TRUE for"+this.current.label+" this.mouseDownOutsideHandler PAUSED !!!")
								};	
								if(this.objResizeWidget){
									this.objResizeWidget.upHandler.pause();//pause resizeWCoord upHandler
									console.log("resizeMoveArea.suspend TRUE for "+this.current.label+" this.objResizeWidget.upHandler PAUSED !!!")
								};
							}else{
								this.setupEvents();
								if(this.mouseDownOutsideHandler)
									this.mouseDownOutsideHandler.resume();
								console.log("resizeMoveArea.suspend FALSE for "+this.current.label+" this.mouseDownOutsideHandler RESUMED !!!")
								/*
								if(this.objResizeWidget){
									this.objResizeWidget.upHandler.resume();//pause resizeWCoord upHandler
									console.log("resizeMoveArea.suspend FALSE for "+this.current.label+" this.objResizeWidget.upHandler RESUMED !!!")
								};
								*/	
							};
						};	
					},
					snapToGrid:function(xVal){ //transform the input number xVal into a number according to a gridPattern
						var gridPattern =this.oProps.gridPattern;
						var xMod=xVal%gridPattern;
						if(xMod==0) //no transform
							return(xVal);
						if(xMod<gridPattern/2) //snap no inferior number
							return(xVal-xMod);
						return(xVal+(gridPattern-xMod));
					},//snapToGrid
					__isResize:true,
					setStatus:function(isResize){//status is resize or moving - the first one to run locks the status for him...
						if(isResize){
							//console.log("ResizeMoveArea3 -> status changed to Resize !");
							// if(this.oDbg.isDbg("setStatus")) this.oDbg.display("ResizeMoveArea6 -> status changed to Resize !");
						}else{
							//console.log("ResizeMoveArea3 -> status changed to Move !");
							// if(this.oDbg.isDbg("setStatus")) this.oDbg.display("ResizeMoveArea6 -> status changed to Move !");
						};	
						this.__isResize=isResize;
					},
					getStatus:function(){
						return this.__isResize;						
					},				
					removeHandlers:function(){//remove resizeWcoord upHandler and moveHandler if objResizeWidget exists
						//if objResizeWidget does not exist is a NOP
						if(this.objResizeWidget){
							this.objResizeWidget.upHandler.remove(); //se não fizer isto os eventos pendentes podem disparar qdo menos se espera...
							this.objResizeWidget.moveHandler.remove();//se não fizer isto os eventos pendentes podem disparar qdo menos se espera...
							console.log("ResizeMoveArea.removeHandlers  -->handlers in objResizeWidget were removed ");
						};
					}
				});//end of classe moveResizeArea
			}//call back function
		); //end of define for module moveResizeArea
