MailerTemplate.Views.TemplateItems = Backbone.View.extend({
	m_lstTemplates : null,
	initialize : function(){
		this.m_lstTemplates = [];
		var temp =this;
		$.each($(MailerTemplate.Templates), function(i, item){
		var temple = _.template($("#"+item).html());
			temp.m_lstTemplates.push(temple);
		});
		this.render();
//		$(".draggable").draggable({start : function(){console.log("started");},containment:'body', helper:"clone"});
		oDragNDrop = DragNDrop.getInstance();
		oDragNDrop.setDraggableObject({draggableSelectors : [{
											   draggable : ".draggable",
											   droppable : ".droppable"
										  }],
										 helper : "clone",
										 helperCss : '',
										 revert : this.OnRevert,
										 OnStartCallBack : this.OnStart,
										 OnStopCallBack : this.OnStop
									  });
	},
	OnStart : function(){
		console.log("Drag Started");	
	},
	OnStop : function(){
		console.log("Drop End");
	},
	OnRevert : function(dropped){
		console.log(dropped);
		return dropped;
	},
	render : function(){
		var h = parseInt(this.$el.parent()[0].offsetHeight) - this.$el[0].offsetTop;
		this.$el.css({height:h+"px"});
		this.loadTemplates();
	},
	loadTemplates : function(){
		var temp = this;
		$.each(temp.m_lstTemplates, function(i,item){
			element = item({});
			temp.$el.append(element);
		});	
	}
});
