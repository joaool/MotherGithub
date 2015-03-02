DragNDrop = function(){
	
}

DragNDrop.getInstance = function(){
	if (!this.oDragNDrop)
	{
		this.oDragNDrop = new DragNDrop();
	}
	return this.oDragNDrop;
}

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