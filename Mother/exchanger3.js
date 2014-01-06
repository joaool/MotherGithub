	define(["dojo",
			 "dojo/_base/declare",
			 "dojo/domReady!"], 
		function(dojo,Declare){	
			return Declare("exchanger",null, { // must be a SINGLETON
				//Exchanger2 passa a suportar 5 slots de pointers e o método setOrder para indicar qual é o slot que deve ser executado
				//  quando algum método fizer exchanger.getPointer();
				oPointer:[null,null,null,null,null],  //5 slots 0..4 for the time being
				gridPattern:[null],//a way to pass gridPattern to moveCoord2
				//static:{oPointer:null,id:null,handlesZone:null},
				constructor:function(){
					//console.log("2-exchanger -------------------------- CONSTRUCTOR !!! ---------------------");     
				},
				static:{order:null},
				setPointer: function( pointer,xOrder) {
					//this.static.oPointer= pointer;
					this.oPointer[xOrder]=pointer;
				},
				setOrder: function(xOrder) {
					//this.static.oPointer= pointer;
					//alert("exchanger vai fazer set com order="+xOrder);
					this.static.order=xOrder;
					//alert("exchanger -->registou order="+this.static.order);
				},
				getPointer: function() {
					//return this.static.oPointer;
					//alert("exchanger vai posicionar pointer de saida de canvas em "+this.static.order);
					return this.oPointer[this.static.order];
				},
				setGridPattern: function( nGridPattern) {
					this.gridPattern[0]=nGridPattern;
				},
				getGridPattern: function() {
					return this.gridPattern[0];
				},				
				destroy:function(){
					this.static.order=null;
					this.oPointer=[null,null,null,null,null];
					this.destroy();
				},
			}); //end of classe exchanger
		}//call back function
	); //end of require for module 	exchanger
