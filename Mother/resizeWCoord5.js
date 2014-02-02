		define(["dojo",
				"dojo/_base/declare",
				"dojo/_base/window",
				"dojo/_base/lang",
				"dojo/_base/event",
				"dojo/_base/array",
				"dojo/on",
				"dojo/mouse",
				"dojo/topic",
				"dojo/query",
				"dojo/dom-style",
				"dojo/dom-geometry",
				"dojo/dom-construct",
				"dojo/dom-class",
				"dojo/dom",
				"dojo/dom-attr",
				"Mother/exchanger3.js",
				"dojo/Evented"],
				// "dojo/Evented",
				// "dijit/_WidgetBase"],
		//function(dojo,Declare,Dbg,Win,Lang,Event,Array,On,Mouse,Topic,Query,DomStyle,DomGeom,DomConstruct,DomClass,Dom,DomAttr,Exchanger,Evented,Widget){
		function(dojo,Declare,Win,Lang,Event,Array,On,Mouse,Topic,Query,DomStyle,DomGeom,DomConstruct,DomClass,Dom,DomAttr,Exchanger,Evented){
			return Declare("resizeWidget", [Evented], {
			//return Declare("resizeWidget", [Widget,Evented], {
				// ex:var objToSize=new ResizeWidget({"targetNode":"resizeIdx","targetType":"zzz"});
				//	par1 - targetNode:the node that resizeWidget will use to position the handles
				//	par2 - dummy
				//  Properties:
				//		exitNormally - normally true. It will be false if the instance terminate with a mouseup over a scrollbar
				//		setEndResize: call back function that will run when the user clicked outside an handle
				//		targetIL: Initial Left
				//		targetIT: Initial Top
				//		targetIW: Initial Width
				//		targetIH: Initial Height
				//		targetL: current (and final)  Left
				//		targetT: current (and final)  Top
				//		targetW: current (and final)  Width
				//		targetH: current (and final)  Height
				//
				//  Note:the handle squares have a zIndex of 101. To assure that they will be shown the avatar bust be under 101 !!!
				//  Methods:
				//		clearResizeHandles():if the programmer wants to clear the handles inside the "onResizeComplete" event
				//	Events:
				//      onResizeComplete - called after each resize handle cycle
				// Ex:
				// creating the targetNode:
				//	var xResize=DomConstruct.create("div"); //it should be defined outside Ready() in order to be destroyed afterEnd 
				//	xResize.innerHTML=util.makeHTML("div","resizeIdx","A","ResizeWidget Test",xLeft,xTop,xWidth,xHeight,xResizeBorderThickness,"solid","gold");		
				//	Win.body().appendChild(xResize); 	
				//				
				// if the programmer wants to update the inside contents after each handle's resize she should use an avatar inside the "onResizeComplete" event
				// Ex:
				// 1) create the avatar in the DOM -this should be created BEFORE creating the targetNode (to assure that the handles will be upfront)
				// 		var xAvatar=DomConstruct.create("div"); 
				//  	xAvatar.innerHTML=util.makeHTML("textBox","xAvatarId","A","ResizeWidget Test",xLeft+xInsideAvatarAdjust,xTop+xInsideAvatarAdjust,xWidth-xInsideAvatarAdjust,xHeight-xInsideAvatarAdjust,null,null,null);		
				//  	Win.body().appendChild(xAvatar); 
				//
				// 2) call resizeWidget inside Ready() and create the onResizeComplete event and the exit way
				//		Ready(function(){
				//			var objToSize=new ResizeWidget({"targetNode":"resizeIdx","targetType":"zzz"});
				//			dojo.connect(objToSize, "onResizeComplete", function() {//this is the slot to any intermediate adjustment to the image of the element being resized...
				//				//adjust the avatar: DomStyle.set("xAvatarId", "left", this.targetL+xInsideAvatarAdjust);//do the same for "top","width" and "height"
				//			});
				//			objToSize.setEndResize(function(){//the exit way
				//				afterEnd();//defined inside programmer's code
				//			});	
				//		});	
				//
				//The programmer shoulds use a callback function to End Resize (setEndResize)
				//   EndResize is called when the users clicks Up outside an handle
				// 		the programmer  can intercept each onResizeComplete connecting an event to this function
				//Use:
				//   var objResizeWidget=new ResizeWidget({"targetNode":this.moveResizeDivId,"targetType":"textArea"});
			    //														|the Id or node of an HTML object with the dimensions we want for resize andles
				//																			|not important
				//   ATENTION - the node targetNode (or the Id) must be IN THE DOM !!!otherwise you will get :node is null		
				//   The handles will stick around the HTML object defined has param 1	
				//	
				//	 resizeWidget Objects comunicate with its caller in two diferent cycles:
				//		cycle:1 - When the user does mouse up after risizing one of the 8 avalilable handles
				//			in order to intercept the code the caller uses the "onResizeComplete" event.
				//		cycle:2 - When the user clicks outside an handle - indication to finish the resize operation
				//			in order to intercept the code the caller uses the "setEndResize" property to define a callback function
				//   In both cycles the programmer can collect the  state of the handles with this.targetL,this.targetT,this.targetW,this.targetH
				//
				// If the programmer wants to adjust the object being resized she should use "onResizeComplete"
				//		to do this the programmer needs to create an avatar in the DOM that will be placed inside (visually) targetNode 
				//	    the target node should be constructed after the avatar so that handles will be in the forefront
				//		inside the "onResizeComplete" the avatar should be adjusted 
				//
				//
				// If the programmer wants a single cycle (only once) she should clearResizeHandles in the call back and destroy the object 
				//    Remember that in this case when the users click outside handles "setEndResize"  will be called, therefore should be defined
				// Ex:
				//  	dojo.connect(objToSize, "onResizeComplete", function() {
				//			alert("The new value for height: height="+this.targetH);
				//			chooseSetStyleProp(xZone,"height",this.targetH);// doing something before finishing the process in cycle 1
				//			this.destroy();
				//			DomConstruct.destroy("xAvatarId");//destroy visble node keeping its invisible root 
				//		});
				//
				//  EVENTS:
				//
				//	  "onResizeComplete" - each time mouse is up immediatly after dragging an handle (IMPLEMENTED IN THE OLD FASHION WITHOUT EMIT...)
				//    "endResize" when the user clicks outside an handle (mouse up after a mouse down outside an handle)
				//    THE EVENTS ONLY TRIGGERS IF THE OPERATION IS LOCKED TO resizeWidget
				//      (this.coordinator=true - locked for resize... when we move the frame this.coordinator=false and the event is inhibited)
				//
				//  GridPattern is setted by the caller simply accessing this object. Ex this.objResizeWidget.gridPattern=this.gridPattern;
				targetNode: null,
				avatarNode: null,//the innerHTML node of targetNode first child
				targetId: null,
				targetIL:null,//Initial dimensions
				targetIT:null,
				targetIW:null,
				targetIH:null,
				targetL:null,//final dimensions
				targetT:null,
				targetW:null,
				targetH:null,
				targetType:null,
				inside:null,//outside or inside element...
				lastX:null,//last cursor x position 
				lastY:null,//last cursor y position
				upHandler:null,
				moveHandler:null,
				mouseDownInsideHandler:null,
				callerObj:null,
				resizeMoveStatus:0, //0- just entered, 1-resize, 2- move
				endCallback:null,//the address of callback function. It is set by method setEndResize
				exitNormally:true,
				squareBorderSize:null,
				squareSize:null,
				squareSizeHalf:null,
				squareSizePx:null,
				squareSizeHalfPx:null,
				squareSizeHalfNegPx:null,
				firstMouseUp:true,
				gridPattern:1,//null,
				positions:[],//array with 8 positions NW,NE,SE,SW,N,S,W,E used in create handles and clear handles - it will be defined in constructor to avoid static effect 
				k:0,	//for test only this.upHandler and this.moveHandler
				k1:0,	//for test only this.upHandler and this.moveHandler	
				//pos:{x:null,y:null},
				oBoundaries:{l:0,t:0,w:1350,h:500},
				mouseDownCallback:null,
				lastMoveX:null,
				lastMoveY:null,
				lastMoveW:null,
				lastMoveH:null,
				//constructor:function(args){
				constructor:function(args,thiz,oBoundaries){
					//mixes the passed argument into "this"
					this.callerObj=thiz;
					//dojo.safeMixin(this, oBoundaries);//args vem na forma {"targetNode": "target"} e monta logo this.targetNode="target"
					if(oBoundaries)
						Declare.safeMixin(this.oBoundaries, oBoundaries);
					//console.log("resizeWidget Boundaries: l="+this.oBoundaries.l+" t="+this.oBoundaries.t+" w="+this.oBoundaries.w+" h="+this.oBoundaries.h);
					this.callerObj.resizeStatus=true;
					Declare.safeMixin(this, args);//args vem na forma {"targetNode": "target"} e monta logo this.targetNode="target"
					//alert("Em resizeWidget 1.5 com par1="+this.targetNode+" par2="+this.targetType);
					var xNode=Dom.byId(this.targetNode); //if this.targetNode is already a node dojo.byId will be a NOP, 
					//										if it is an id node will be node, if not in the DOM node will be null
					if(xNode){
						this.targetId=this.targetNode; //to preserve the input format...if input is string
						//alert("NodeId="+this.targetId+" Left="+DomStyle.get(this.targetId, "left")+" Top="+DomStyle.get(this.targetId, "top"));

						this.targetNode = xNode; //deixa de ser um Id e passa a ser um node 
						this.avatarNode=Dom.byId(this.callerObj.avatarId);
						this.lastMoveX=DomStyle.get(this.targetNode,"left");
						this.lastMoveY=DomStyle.get(this.targetNode,"top");
						this.lastMoveW=DomStyle.get(this.avatarNode,"width");
						this.lastMoveH=DomStyle.get(this.avatarNode,"height");
						// console.log("resizeWCoord CONSTRUCTOR ++++++++++++++++++ lastMoveX="+this.lastMoveX+", lastMoveY="+this.lastMoveY+", lastMoveW="+this.lastMoveW+", lastMoveH="+this.lastMoveH+" +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
					}else{
						alert("resizeWidget.constructor - Error: targetNode "+this.targetNode+" is not in the DOM.");
					}
					//var coords = dojo.coords(dojo.byId(this.targetNode)); //targetNode tem a string que foi passada na construção ex"avatarId"
					var coords = DomGeom.position(dojo.byId(this.targetNode)); //targetNode tem a string que foi passada na construção ex"avatarId"
					//alert("Em resizeWidget 1.6 com par1="+this.targetNode+" par2="+this.targetType);
					this.targetIL=coords.x;
					this.targetL=coords.x;
					this.targetIT=coords.y;
					this.targetT=coords.y;
					this.targetIW=coords.w;
					this.targetW=coords.w;
					this.targetIH=coords.h;
					this.targetH=coords.h;
					var exchange= new Exchanger(); // SINGLETON 
					//console.log("resizeWidget.constructor - ***************************************** gridPattern="+this.gridPattern);
					this.squareBorderSize = 1;//BorderThikness
					this.squareSize = 6; //px
					this.squareSizeHalf = (this.squareSize / 2) + this.squareBorderSize;
					this.squareSizePx = this.squareSize + "px";
					this.squareSizeHalfPx = this.squareSizeHalf + "px";
					this.squareSizeHalfNegPx = "-" + this.squareSizeHalf + "px";//metade do square size , negativado e com+"px"
					
					this.positions=[]; //to avoid sharing of array between diferent instances 

					//console.log("resizeWCoord CONSTRUCTOR END with thiz.resizeStatus="+this.callerObj.resizeStatus);
					this.postCreate();
				},
				postCreate: function() {
					//console.log("1-resizeWidget.postCreate ------- INICIO DE POSCREATE");
					//alert("1-resizeWidget.postCreate ------- INICIO DE POSCREATE");
					//alert("resizeWCoord 3 postCreate resizeStatus="+this.callerObj.resizeStatus);
					if (dojo.isString(this.targetNode)) {
						this.targetNode = Dom.byId(this.targetNode); //deixa de ser um Id e passa a ser um node 
					}
					//this.upHandler=this.connect(dojo.doc, "onmouseup", dojo.hitch(this, "_onMouseUp"));
					//  var buttonHandler = on.pausable(button, "click", clickHandler);
					//  var signal = on(win.doc, "click", function(){

					//this.upHandler=On(dojo.doc, "mouseup", dojo.hitch(this, "_onMouseUp"));
					//this.upHandler=On(Win.doc, "mouseup", dojo.hitch(this, "_onMouseUp"));
					this.upHandler=On.pausable(Win.doc, "mouseup", Lang.hitch(this,function(e){
						this.k++;
						//console.log("resizeWidget2 vez="+this.k+" (mouseup event)------------------------->corre mouse up event que vai chamar _onMouseUp() !!!!");
						this._onMouseUp(e);
					}));
					this.upHandler.pause();
					this.moveHandler=On.pausable(Win.doc,"mousemove", Lang.hitch(this,function(e){
						//alert("this.moveHandler mousemove");
						this._onMouseMove(e);
					}));
					
					this.mouseDownInsideHandler=On.pausable(this.targetNode,"mousedown", Lang.hitch(this,function(e){
						//this method is called whenever a mousedown is done inside the handlers area (this.targetNode)
						//this.upHandler.resume();
						var isResize=this.callerObj.resizeStatus;
						if(this.resizeMoveStatus>0){
							//alert("resizeWCoord mouseDownInsideHandler emit EVENT 'endResize' AND EXIT !!!!");
							//*
							this.inside=true;
							//this.clearResizeHandles();
							//this.upHandler.remove();
							//this.moveHandler.remove();
							// if(this.oDbg.isDbg("postCreate")) this.oDbg.display("Next step will emit EVENT '_insideEndResize'");
							//console.log("resizeWCoord.postCreate Next step will emit EVENT '_insideEndResize'");
							this.emit("_insideEndResize",{inside:true,fromMover:false});//a move may follow
						}
						///
							//alert("resizeWCoord mouseDownInsideHandler emit EVENT 'endResize' AND EXIT !!!!");
					}));
					this.createResizeHandles();
				},
				_mouseDown: false,
				_lastDirection: "",
				/*
				_lastPosition: {
					x: 0,
					y: 0,
					w: 0,
					h: 0
				},
				*/
				onResizeComplete: function(marginBox) {
					var coords = DomGeom.position(dojo.byId(this.targetNode));//this refere-se a moveResize
					this.targetL=coords.x;
					this.targetT=coords.y;
					this.targetW=coords.w;
					this.targetH=coords.h;
					// console.log("@@@@@@@@@@ resizeWCoord.onResizeComplete before emiting _onResizeComplete EVENT... this.targetL="+
					// 		this.targetL+","+this.targetT+","+this.targetW+","+this.targetH);
					this.emit("_onResizeComplete",{x: this.targetL,y: this.targetT,w: this.targetW,h: this.targetH});
				},
				_onMouseDown: function(e) {//Only enters here when mouse is down over an handl for resizing
					console.log("---->resizeWCoord._onMouseDown in "+this.callerObj.current.label+"<----------------------------------------------");
					if(this.mouseDownCallback)
						this.mouseDownCallback(); //each time mouse down is pressed runs callback
					this.lastMoveX=this.snapToGrid(DomStyle.get(this.targetNode,"left"));
					this.lastMoveY=this.snapToGrid(DomStyle.get(this.targetNode,"top"));
					//console.log("resizeWCoord._onMouseDown ++++++++++++++++++ lastMoveX="+this.lastMoveX+", lastMoveY="+this.lastMoveY+", lastMoveW="+this.lastMoveW+", lastMoveH="+this.lastMoveH+" +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
					this.upHandler.resume();
					this.callerObj.mousedownStatus=false;//to prevent to sequence mouse down,mouseup in caller
					this.callerObj.resizeStatus=true;
					this.callerObj.initStatus=false;
					this.resizeMoveStatus=1;// 1- resize status
					// if(this.oDbg.isDbg("_onMouseDown")) this.oDbg.display("User did 'mouse down'. The leading object is now resizeWidget");
					var x = e.clientX;
					var y = e.clientY;
					
					this._mouseDown = true;
					var handle = e.target;
					var direction = dojo.attr(handle, "className");
					//N,S,W,E,NW,NE,SW,SE
					this._lastDirection = direction.substr(direction.length - 2, 3).replace("_", "");

					e.cancelBubble = true;
					//console.log("resizeWidget._onMouseDown END OF _onMouseDown !!!");
				},
				_onMouseUp: function(e) {
					// ---- JO This will receive mouseUp comming after handles drag (this._mouseDown=true) and mouseUp after mouse down outside
					//console.log("resizeWCoord._onMouseUp in "+this.callerObj.current.label+"<----------------------------------------------");
					if(this.callerObj.swapCallback)
						this.callerObj.swapCallback();
					var isResize=this.callerObj.resizeStatus;
					if(isResize){//only enters if not under moveCoord control
						var x = e.clientX; 
						var y = e.clientY; 
						if(x>DomStyle.get(Win.body(), "width"))
							this.exitNormally=false;
						if(y>DomStyle.get(Win.body(), "height"))
							this.exitNormally=false;
		
						//if (this._mouseDown === true) {
						if (this._mouseDown) {
							//console.log("resizeWidget._onMouseUp %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% com mouseDown=true");
							this.onResizeComplete(DomGeom.getMarginBox(this.targetNode));
							this._mouseDown = false;
						}else{ //mouse up sem estar mouse down !!!
							//console.log("--- --- resizeWidget._onMouseUp vai sair com L,T,W,H = "+this.targetL+","+this.targetT+","+this.targetW+","+this.targetH);
							this.inside=false;
							if((x>=this.targetL) && (x<=this.targetL+this.targetW) && (y>=this.targetT) && (y<=this.targetT+this.targetH)){
								this.inside=true;//mouse is inside frame
							}
							this.lastX=x;
							this.lastY=y;
						//alert("resizeWidget _onMouseUp vai sair x="+x+" y="+y+" inside="+this.inside);
							this.clearResizeHandles();
							//this.destroy();
							//console.log("--- --- resizeWidget._onMouseUp vai sair. Corre:"+this.endCallback);
							//alert("--- --- resizeWidget._onMouseUp vai sair. Corre:"+this.endCallback);
						//this.endCallback(); //the way out !!!
							this.upHandler.remove();
							this.moveHandler.remove();
							this.mouseDownInsideHandler.remove();
							//console.log("----> resizeWidget._onMouseUp emite EVENT 'endResize'");
							if(this.inside)
								alert("resizeWCoord._onMouseUp ESTRANHO this.inside está TRUE !!!");
							this.emit("_endResize",{inside:this.inside,fromMover:false});
						}
					}else{
						// alert("ResizeWCoord _onMouseUp isResize=false !!!");
					}
				},
				_onMouseMove: function(e) {
					var x = this.snapToGrid(e.clientX);
					//var x= e.clientX;
					var y = this.snapToGrid(e.clientY);
					//var y= e.clientY;
					//keep handles within boundaries !!!
					x=(x<this.oBoundaries.l)?this.oBoundaries.l:x;
					x=(x>this.oBoundaries.l+this.oBoundaries.w)?this.oBoundaries.l+this.oBoundaries.w:x;
					y=(y<this.oBoundaries.t)?this.oBoundaries.t:y;
					y=(y>this.oBoundaries.t+this.oBoundaries.h)?this.oBoundaries.t+this.oBoundaries.h:y;


					if (this._mouseDown === true) {
						//console.log("Class resizeWidget2 _onMouseMove /mouseDown with gridPattern="+this.gridPattern+" x="+x+" y="+y+" mouse down="+this._mouseDown);
						//console.log("//////////////////////////////////////////////////////////////////////////////////////////////////////x="+x+" y="+y+" gridPattern="+this.gridPattern);
						var xMin = 15;
						var yMin = 20;
						//console.log("///////////////////////////////////////////////////////////// Width Inicial = ->"+this.lastMoveW);
						//console.log("///////////////////////////////////////////////////////////// x     Inicial = ->"+this.lastMoveX);
						if (this._lastDirection.indexOf("E") != -1){
							var xW=Math.max(xMin, x - parseInt(this.targetNode.style.left,10));
							this.lastMoveW=xW;
							this.targetNode.style.width = xW + "px";
							this.avatarNode.style.width = xW + "px";
						}
						if (this._lastDirection.indexOf("S") != -1){
							var xH=Math.max(yMin, y - parseInt(this.targetNode.style.top,10));
							this.lastMoveH=xH;
							//console.log("////////////// S ->"+xH);
							this.targetNode.style.height = xH + "px";
							this.avatarNode.style.height = xH + "px";
						}
						if (this._lastDirection.indexOf("W") != -1) {
							//console.log("////////////West this.lastMoveW="+this.lastMoveW);
							var difX=x-this.lastMoveX;//this is 1 if mouse moves to right or -1 if it moves to left
							if((this.lastMoveW-difX)>xMin){//width still greater than minimum - x change and w change accepted !
								this.targetNode.style.left = x + "px";
								this.callerObj.current.l = x;//informs caller about current position
								var xW = this.lastMoveW-difX;
								this.targetNode.style.width = xW + "px";
								this.avatarNode.style.width = xW + "px";
								//console.log("//////////////////////////West   x  = ->"+x);
								//console.log("//////////////////////////West  difX= ->"+difX);
								//console.log("//////////////////////////West Width= ->"+xW);
								this.lastMoveX=x;
								this.lastMoveW=xW;
							}else{
								console.log("xxxxx across limit xxxxxxxxxxxx W ->"+x);
							}
						}
						if (this._lastDirection.indexOf("N") != -1) {
							//console.log("////////////North this.lastMoveH="+this.lastMoveH);
							var difY=y-this.lastMoveY;//this is 1 if mouse moves lower or -1 if it moves upper
							if((this.lastMoveH-difY)>yMin){//width still greater than minimum - x change and w change accepted !
								this.targetNode.style.top = y + "px";
								this.callerObj.current.t = y;//informs caller about current position
								var xH=this.lastMoveH-difY;
								this.targetNode.style.height = xH + "px";
								this.avatarNode.style.height = xH + "px";
								//console.log("//////////////////////////North   y  = ->"+y);
								//console.log("//////////////////////////North  difY= ->"+difY);
								//console.log("//////////////////////////North height= ->"+xH);
								this.lastMoveY=y;
								this.lastMoveH=xH;
							} else {
								console.log("resizeWCoord4 xxxxx across limit xxxxxxxxxxxx H ->"+y);
							}
						}
						// console.log("------->_onMouseMove.resizeWCoord x,y="+this.callerObj.current.l+","+this.callerObj.current.t);
						this.createResizeHandles();
						dojo.stopEvent(e);
					}
				},
				createResizeHandles: function() {
					/*
					var squareBorderSize = 1;
					var squareSize = 6; //px
					var squareSizeHalf = (squareSize / 2) + squareBorderSize;
					var squareSizePx = squareSize + "px";
					var squareSizeHalfPx = squareSizeHalf + "px";
					var squareSizeHalfNegPx = "-" + squareSizeHalf + "px";//metade do square size , negativado e com+"px"
					*/
			//console.log("createResizeHandles squareSizeHalfNegPx="+this.squareSizeHalfNegPx);
			
					var square =DomConstruct.create("div", {
						"style": {
							"position": "absolute",
							"height": this.squareSizePx,
							"width": this.squareSizePx,
							"backgroundColor": "white",
							"visibility":"visible",//added in v.4
							"zIndex":101,
							"border": this.squareBorderSize + "px solid black"
						}
					});
					this.setPositions();// to define the array of //N,S,W,E,NW,NE,SW,SE

					Array.forEach(this.positions, function(item) {
						var node = undefined;

						//if (node = dojo.query("." + "wuhiDesignerResizeSquare_" + item.direction, this.targetNode)[0]) {               
						if (node = Query(".resize_" + this.targetId + item.direction, this.targetNode)[0]) {
						} else {
							node = Lang.clone(square);
							// DomClass.add(node, "resize_"+item.direction);//poe no CSS a classe resize_NW, resize_NE etc para poder mudar o cursor em cima do node
							DomClass.add(node, "resize_"+ this.targetId + item.direction);//poe no CSS a classe resize_NW, resize_NE etc para poder mudar o cursor em cima do node
							DomStyle.set(node, "cursor", item.direction + "-resize");// o cursor "NW-resize" é dupla seta diagonal esq ...etc...
							DomConstruct.place(node, this.targetNode);//coloca o square no element cujo id foi o input (recordar que o id foi substituido pelo node node=dojo.byId(xId))
							//this.connect(node, "onmousedown", dojo.hitch(this, "_onMouseDown"));//old version
							On(node, "mousedown", Lang.hitch(this, function(e){
								var xClass=DomAttr.get(node,"class");
								// console.log("resizeWidget2 ----------------------------------------------------------------------");
								// console.log("resizeWidget2 ---------------------------->corre mousedown para o square "+xClass);//to display _N,_S,NE etc
								// console.log("resizeWidget2 ----------------------------------------------------------------------");
							 	this._onMouseDown(e);
							}));
						}
						DomStyle.set(node, item.style);
					}, this);			
				},
				clearResizeHandles: function() {
					this.setPositions();// to define the array 
					Array.forEach(this.positions, function(item) {
						// var class2Del=".resize_"+item.direction;// não esquecer o ponto !!!
						var class2Del=".resize_" + this.targetId + item.direction;// não esquecer o ponto !!!
						//console.log("------------->apaga "+class2Del);
						var nl=Query(class2Del);
						//alert("Numero elementos com "+class2Del+"="+nl.length);
						Query(class2Del).forEach(function(node){
							DomConstruct.destroy(node);
						});
						//console.log("----------------->left="+item.style.left+" - top="+item.style.top+" - right="+item.style.right+" - bottom="+item.style.bottom);
					}, this);	
				},
				setPositions: function() {
					//console.log("------------------------------------> setPositions---------------------------------------------");
					this.positions = [{
						"direction": "NW",
						"style": {
							"top": this.squareSizeHalfNegPx,
							"left": this.squareSizeHalfNegPx
						}},
					{
						"direction": "NE",
						"style": {
							"top": this.squareSizeHalfNegPx,
							"right": this.squareSizeHalfNegPx
						}},
					{
						"direction": "SE",
						"style": {
							"bottom": this.squareSizeHalfNegPx,
							"right": this.squareSizeHalfNegPx
						}},
					{
						"direction": "SW",
						"style": {
							"bottom": this.squareSizeHalfNegPx,
							"left": this.squareSizeHalfNegPx
						}},
					{
						"direction": "N",
						"style": {
							"top": this.squareSizeHalfNegPx,
							"left": ((DomGeom.getMarginBox(this.targetNode).w / 2) - this.squareSizeHalf) + "px"
						}},
					{
						"direction": "S",
						"style": {
							"bottom": this.squareSizeHalfNegPx,
							//"left": ((dojo.marginBox(this.targetNode).w / 2) - this.squareSizeHalf) + "px"
							"left": ((DomGeom.getMarginBox(this.targetNode).w / 2) - this.squareSizeHalf) + "px"
							//	var newBox = DomGeom.getMarginBox(dojo.byId("xDiv"));

						}},
					{
						"direction": "W",
						"style": {
							"left": this.squareSizeHalfNegPx,
							"top": ((DomGeom.getMarginBox(this.targetNode).h / 2)-0 - this.squareSizeHalf) + "px"
						}},
					{
						"direction": "E",
						"style": {
							"right": this.squareSizeHalfNegPx,
							"top": ((DomGeom.getMarginBox(this.targetNode).h / 2) -0 -this.squareSizeHalf) + "px"
						}}];					
				},//setPositions
				snapToGrid:function(xVal){ //transform the input number xVal into a number according to a gridPattern
					var xMod=xVal%this.gridPattern;
					if(xMod==0) //no transform
						return(xVal);
					if(xMod<this.gridPattern/2) //snap no inferior number
						return(xVal-xMod);
					return(xVal+(this.gridPattern-xMod));
				}//snapToGrid							
			});//end of Declacre class resizeWidget
		}//call back function
	); //end of require module 	resizeWidget
