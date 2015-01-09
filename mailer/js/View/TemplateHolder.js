MailerTemplate.Views.TemplateHolder = Backbone.View.extend({
	
	m_lstTemplates : null,
	m_PropertyToolbar : null,
	bToolbarVisible : false,
	currentHoverElement : null,
	propertyDroppableObject : null,
	propertydroppedObject : null,
	DroppedObjectOnMove : null,
	m_currentEditableObject : null,
	m_CurrentTemplateViewObject : null,
	m_lstModel : [],
	dragNDropHandler : null,
	
	initialize : function(){
		
		this.m_objCnt=0;
		this.m_TemplateHoderBody = $("#template_holder_body");
		this.m_TemplateHoderHeader = $("#template_holder_header");
		this.m_TemplateHoderFooter = $("#template_holder_footer");
		
		this.dragNDropHandler = new DragNDrop({dragSelector : ".draggable", dropSelector : ".droppable"});
		this.ApplySortingEvent();
		this.m_PropertyToolbar = new MailerTemplate.Views.PropertyToolbar({el : "#propertyToolbar"});
		this.listenTo(this.m_PropertyToolbar,MailerTemplate.Views.PropertyToolbar.EDIT_BTN_CLICKED,this.OnEditBtnClicked);
		this.listenTo(this.m_PropertyToolbar,MailerTemplate.Views.PropertyToolbar.COPY_BTN_CLICKED,this.OnCopyBtnClicked);
		this.listenTo(this.m_PropertyToolbar,MailerTemplate.Views.PropertyToolbar.DELETE_BTN_CLICKED,this.OnDeleteBtnClicked);
		this.render();
		
		oDragNDrop = DragNDrop.getInstance();
		oDragNDrop.setDroppableObject({droppableSelectors : [{
											droppable : ".dropppable"
											}],
									  });		
	},
	OnEditBtnClicked : function(currentElement){
		
		this.m_currentEditableObject = currentElement;
		
		this.m_CurrentTemplateViewObject = this.getTemplateObject(currentElement);
		if (this.m_CurrentTemplateViewObject)
		{
			var model = this.m_lstModel[$(this.m_currentEditableObject).attr("id")];
			this.m_CurrentTemplateViewObject.setModel(model);
			var data = {
				type : $(currentElement).attr('type'),
				model : model
			}
			this.trigger(MailerTemplate.Views.TemplateHolder.DISPLAY_PROPERTYPANEL, data);	
		}
	},
	OnCopyBtnClicked : function(currentElement){
		var model = this.m_lstModel[$(currentElement).attr("id")];
		
		var copiedElement = $(currentElement).clone();
		$(copiedElement).attr("id",$(copiedElement).attr('type')+(++this.m_objCnt));
		$(copiedElement).insertAfter(currentElement);
		
		newModel = model.CloneModel();
		this.m_lstModel[$(copiedElement).attr("id")] = newModel;
		
		this.m_CurrentTemplateViewObject = this.getTemplateObject($(copiedElement));
		if (this.m_CurrentTemplateViewObject)
			this.m_CurrentTemplateViewObject.setModel(newModel);
		
		this.ApplyHoverEvent();
	},
	OnDeleteBtnClicked : function(currentElement){
		var model = this.m_lstModel[$(currentElement).attr("id")];
		var index = this.m_lstModel.indexOf(model);
		this.m_lstModel.splice(index,1);
		$(currentElement).remove();
	},
	ApplySortingEvent : function(){
		var temp = this;
		$( ".sortable" ).sortable({
			connectWith : ".sortable",
		 	placeholder: "ui-state-highlight",
			tolerance: "pointer",
			stop : function(event, ui){
				temp.onDrop(ui.item[0]);
			},
			beforeStop : function(event, ui){
				temp.DroppedObjectOnMove = ui.helper;	
			}
		});
		$( ".sortable" ).disableSelection();
	},
	
	ApplyHoverEvent : function(){
		var temp = this;
		$(".droppedObject").hover(function(obj){
								temp.OnHoverIn(obj.currentTarget)
							},function(obj){});
	},
	
	OnHoverIn : function(obj){
		this.currentHoverElement = obj;
		this.m_PropertyToolbar.show(obj);
	},
	render : function(){
		
	},
	onDrop : function(droppedObject){
		//Create a instance of view and model for the dropped object;
		if($(droppedObject).hasClass("ui-draggable"))
		{
			if ($(droppedObject).hasClass("moveable"))
			{
				$(this.DroppedObjectOnMove).insertAfter(droppedObject);
				$(this.DroppedObjectOnMove).css({"position":"relative",
												 "left":"0px",
												 "top":"0px",
												 "width":"100%",
												 "height":"auto"});
				$(droppedObject).remove();
			}
			else
			{
				droppingObject = $.parseHTML(this.getElementToDrop(droppedObject));
				$(droppingObject).attr("id",$(droppedObject).attr('type')+(++this.m_objCnt));
				$(droppingObject).insertAfter(droppedObject);
				$(droppedObject).remove();
				
				this.m_CurrentTemplateViewObject = this.getTemplateObject($(droppingObject).filter("div"));
				newModel = this.getTemplateModel($(droppingObject).filter("div"));
				
				if (this.m_CurrentTemplateViewObject)
				{
					this.m_lstModel[$(droppingObject).filter("div").attr("id")] = newModel;
					this.m_CurrentTemplateViewObject.setModel(newModel);
				}
					
			}
		}
		this.ApplyHoverEvent();
		//$(droppableObject).children().filter("#tmp").css({"display":"none"});	
	},
	getElementToDrop : function(droppedObject){
		var type = $(droppedObject).attr('type');
		var childToAppend = $('#' + type + 'DroppedItem').html();
		return childToAppend;
	},
	OnTemplateItemDragged : function(draggedObject){
		
	},
	getNextIndex : function(type){
		if (type==MailerTemplate.TemplateItems.TITLE){
			
		}
	},
	getTemplateModel : function(object){
		var type = $(object).attr('type');
		switch (type)
		{
			case MailerTemplate.TemplateItems.TITLE:
				return new MailerTemplate.Models.Title();
				break;
			case MailerTemplate.TemplateItems.IMAGE:
				return new MailerTemplate.Models.Image();
				break;
		}
	},
	getTemplateObject : function(object){
		var type = $(object).attr('type');
		switch (type)
		{
			case MailerTemplate.TemplateItems.TITLE:
				return new MailerTemplate.Views.Title({el : "#"+$(object).attr("id")});
				break;
			case MailerTemplate.TemplateItems.IMAGE:
				return new MailerTemplate.Views.Image({el : "#"+$(object).attr("id")});
				break;
		}
	},
	generatePlainHtml : function(){
		var headerItemIds = $.map($( "#template_holder_header > .droppedObject" ),function(item){return $(item).attr("id"); } );
		var bodyItemIds = $.map($( "#template_holder_body > .droppedObject" ),function(item){return $(item).attr("id"); } );
		var footerItemIds = $.map($( "#template_holder_footer > .droppedObject" ),function(item){return $(item).attr("id"); } );
		
		var ids = {"header" : headerItemIds, "body" : bodyItemIds, "footer":footerItemIds};
		return { "ids" : ids,
				 "models" : this.m_lstModel};
	}
});
MailerTemplate.Views.TemplateHolder.DISPLAY_PROPERTYPANEL = "displayPropertyPanel";
MailerTemplate.Views.TemplateHolder.BINDMODEL = "bindModel";