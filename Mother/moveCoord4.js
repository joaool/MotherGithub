define(["dojo",
		"dojo/_base/declare",
		"Mother/debug.js",
		"dojo/_base/event",
		"Mother/exchanger4.js",
		"dojo/dnd/Mover"],
	function(dojo,Declare,Dbg,Event,Exchanger,Mover){
		return Declare("moveCoord",Mover, {
			mouseUpCallback:null,
			order:null, //position in exchanger of callback pointer (0..4)
			coordinator:null,
			gridPattern:1,//null,
			exchange:null,
			constructor:function(){ //sets up return pointer
				//console.log("------>moveCoord.constructor --------CONSTRUCTOR !!! ------------");
				this.oDbg=new Dbg();
				this.oDbg.setThis("moveCoord4");
				//alert("moveCoord4 !!!");
				//it enters here when drag begins - if there is a mouseUp event pending in reiszeWidget it should be disarmed
				this.exchange= new Exchanger(); // SINGLETON 
				//this.gridPattern=exchange.gridPattern;
				//alert("moveCoord4 !!! with grid="+this.gridPattern);
/*
				this.coordinator=exchange.oPointer[1];
				this.gridPattern=exchange.getGridPattern();
*/
				if(this.oDbg.isDbg("constructor")) this.oDbg.display("Already got coordinator in exchange slot 1 with grid="+this.gridPattern);
				//console.log("------>moveCoord..constructor --------FIM DO CONSTRUCTOR !!! ------------");
			},
			setCoordinator:function(coordinator){
				this.coordinator=coordinator;
			},
			onMouseClick:function(e){
				alert("moveCoord2 onMouseClick -- CHECK IF THIS IS BEING USED....");
				if(this.oDbg.isDbg("onMouseClick")) this.oDbg.display("**************  Click  ******** isResize="+isResize);
				this.destroy();
				Event.stop(e);
			},
			onMouseMove: function(e){
				//this.coordinator.setStatus(false);//informs the coordinator that __isResize=false, ==>move status
				//console.log("moveCoord.onMouseMove THE COORDINATOR IS SET TO MOVE =>this.coordinator.setStatus(false)");
				this.gridPattern=this.exchange.getGridPattern();
				//alert("moveCoord4 grid="+this.gridPattern);
				console.log("moveCoord4 grid="+this.gridPattern);
				var x = this.snapToGrid(e.clientX);
				var y = this.snapToGrid(e.clientY); 
				/*
				var m = this.marginBox;
				if(e.ctrlKey){
				  this.host.onMove(this, {l: parseInt((m.l + e.pageX) /50) * 50, t: parseInt((m.t + e.pageY) / 50) * 50});
				}else{
				  //this.host.onMove(this, {l: m.l + e.pageX, t: m.t + e.pageY});
				  this.host.onMove(this, {l: this.snapToGrid(m.l + e.pageX), t: this.snapToGrid(m.t + e.pageY)});
				  //console.log("------>moveCoord2.onMouseMove with gridPattern="+this.gridPattern+" move to x="+e.pageX+" y="+e.pageY);
				}
				*/	
				this.host.onMove(this, {l: x, t: y});//I dont know exactly what I am doing but it works...
				Event.stop(e);
			},
			onMouseUp:function(e){
				//Event.stop(e);
				//var isResize=this.coordinator.getStatus();
				isResize=true;
				if(this.oDbg.isDbg("onMouseUp")) this.oDbg.display("**************  IS GOING TO LEAVE MOVE ******** isResize="+isResize);
				if(!isResize){
					//if(this.oDbg.isDbg("onMouseUp")) this.oDbg.display("-->execute MouseUp call back defined in ResizeMove");
					var exchange= new Exchanger(); // SINGLETON 
					this.mouseUpCallback=exchange.getPointer();//prepares mouseUpCallback with callback function set up in 2 levels up
					//console.log("--- --- -----------------------------moveCanvas.onMouseUp ........antes de destroy() !.........  MOUSE UP ! content de callback:"+this.mouseUpCallback);
					exchange.oPointer[4]=null; //cleans the signal to inhibit mouseUp event in resizeWidget
					if(this.oDbg.isDbg("onMouseUp")) this.oDbg.display("-->execute MouseUp call back defined in ResizeMove:"+this.mouseUpCallback.toString());
	
					Event.stop(e);
					//dojo.stopEvent(e);
					//console.log("--- ---moveCanvas.onMouseUp ........vai fazer destroy ");
					this.destroy();				
					//console.log("--- ---moveCanvas.onMouseUp ........vai fazer mouseUpCallback ");		
				//this.mouseUpCallback();
					//console.log("--- ---moveCanvas.onMouseUp ........vai fazer destroy em MOUSE UP !");
				};
			},
			snapToGrid:function(xVal){ //transform the input number xVal into a number according to a gridPattern
				var xMod=xVal%this.gridPattern;
				if(xMod==0) //no transform
					return(xVal);
				if(xMod<this.gridPattern/2) //snap no inferior number
					return(xVal-xMod);
				return(xVal+(this.gridPattern-xMod));
			}//snapToGrid			
		}); //end of classe moveCanvas
	}//call back function
); //end of require for module 	moveCanvas
