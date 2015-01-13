DragNDrop = function(){
	var fullUrl = window.location.href;
	var connectionString = FL.common.getTag(fullUrl,"connectionString","#");//FL.domain is globally defined - the last # is disregarded
	connectionString = FL.common.enc(connectionString,-1);
	var loginObject = JSON.parse(connectionString);//ex {"email":"toto114@toto.com","userName":"","password":"123"}
	FL.common.makeModalInfo('Hello ' + FL.common.shortEmailName(loginObject.email) + ' !!!. Welcome to the Newsletter Editor...<br>' +
		'This is a dummy version (only for the dev team) it is not yet operational.');
};
exitSaving = function(){
	// alert("exitNoSave");
	FL.common.makeModalInfo('To be implemented');
};
exitNoSave = function(){
	// alert("exitNoSave");
	window.close();
	// FL.API.disconnect()
	// .then(function(){console.log("FLpage_editor->no save --> disconnect ok!");closeWindows();return;} 
	// 	,function(err){console.log("FLpage_editor->no save -->failure on disconnect err ="+err);return;}
	// );
};
window.onbeforeunload = function (e) {//works for close tab - and for close browser because:
	e = e || window.event;
	if (e) {
		console.log("disconnect here");
		// FL.server.disconnect();
		e.returnValue = 'test returnValue...';
	}
	return 'You are exiting FrameLink newsletterpage editor...';
};
DragNDrop.getInstance = function(){
	if (!this.oDragNDrop)
	{
		this.oDragNDrop = new DragNDrop();
	}
	return this.oDragNDrop;
};

DragNDrop.prototype = {
	draggableSelectors : [],
	droppableSelectors : [],
	helperElement : "clone",
	revert : "invalid",
	onDropCallBack : null,
	onStartCallBack : null,
	onStopCallBack : null,
	helperCss : "",
	draggListener : null,
	
	setDraggableObject : function(options){
		if (!options || !options.draggableSelectors)
			return;
		this.draggableSelectors = options.draggableSelectors;
		
		if (options.helper && options.helper == "clone")
			this.helperElement = options.helper;
		if (options.helperCss)
			this.helperCss = options.helperCss;
		if (options.revert)
			this.revert = options.revert;
		if (options.OnStartCallBack)
			this.onStartCallBack = options.OnStartCallBack;
		if (options.OnStopCallBack)
			this.onStopCallBack = options.OnStopCallBack;
		
		this.addDraggableListener();
	},
	addDraggableListener : function(){
		var temp = this;
		$.each(this.draggableSelectors,function(i,item){
			var dragSelector = item.draggable;
			var dropSelector = item.droppable;
			$(dragSelector).draggable({
				connectToSortable: ".sortable",
				helper : temp.helperElement,
				containment : 'document',
				appendTo : "body",
				cursor: "move",
				zIndex : 10000000000,
				stack : temp.droppableSelectors,
				revertDuration: 100,
				revert: "invalid",
				scroll : true,
				start : function(event, ui){
					if (temp.helperCss)
						$(ui.helper).css(temp.helperCss);
					if (temp.onStartCallBack)
				  		temp.onStartCallBack();
				},
				stop : function(event, ui){
					if (temp.onStopCallBack)
				  		temp.onStopCallBack();
				},
				drag : function(event, ui){
					if (temp.draggListener)
						temp.draggListener.OnTemplateItemDragged(ui);
				}
			});
		});
	},
	setDroppableObject : function(options){
		if (!options || !options.droppableSelectors)
		this.droppableSelectors = options.droppableSelectors;
		this.onDropCallBack = options.onDropCallBack;
		this.addDroppableListener();
	},
	addDroppableListener : function(){
		var temp = this;
		$.each(this.draggableSelectors,function(i,item){
			var dropSelector = item.droppable;
			$(dropSelector).droppable({
			  drop: function( event, ui ) {
				 /* element = $(ui.draggable).clone();
				  element.css('display','block');
				 // $(this).append(element);
				  if (temp.onDropCallBack)
					  temp.onDropCallBack.onDrop(this,element);
					  */
			  }
			});
		});
	},
	listenToDrag : function(CallBackOnDrag){
		this.draggListener = CallBackOnDrag;
	
	}
}