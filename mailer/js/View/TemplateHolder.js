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
	pageWidth : 500,
	headerBgColor: "white",
	bodyBgColor : "white",
	footerBgColor : "white",
	headerPaddingLeft : 0,
	headerPaddingRight : 0,
	bodyPaddingLeft : 0,
	bodyPaddingRight : 0,
	footerPaddingLeft : 0,
	footerPaddingRight : 0,

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
		
		this.m_CurrentTemplateViewObject = this.getTemplateObject($(currentElement).attr('type'),$(currentElement).attr('id'));
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
		
		this.m_CurrentTemplateViewObject = this.getTemplateObject($(copiedElement).attr('type'),$(copiedElement).attr('id'));
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
				
				droppingObject = $.parseHTML(this.getElementToDrop($(droppedObject).attr('type')));
				$(droppingObject).attr("id",$(droppedObject).attr('type')+(++this.m_objCnt));
				$(droppingObject).insertAfter(droppedObject);
				$(droppedObject).remove();
				
				this.m_CurrentTemplateViewObject = this.getTemplateObject($($(droppingObject).filter("div")).attr('type'),$($(droppingObject).filter("div")).attr('id'));
				newModel = this.getTemplateModel($($(droppingObject).filter("div")).attr('type'));
				
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
	getElementToDrop : function(type){
//		var type = $(droppedObject).attr('type');
		var childToAppend = $('#' + type + 'DroppedItem').html();
		return childToAppend;
	},
	OnTemplateItemDragged : function(draggedObject){
		
	},
	getNextIndex : function(type){
		if (type==MailerTemplate.TemplateItems.TITLE){
			
		}
	},
	getTemplateModel : function(type){
//		var type = $(object).attr('type');
		switch (type)
		{
			case MailerTemplate.TemplateItems.TITLE:
				return new MailerTemplate.Models.Title();
				break;
			case MailerTemplate.TemplateItems.IMAGE:
				return new MailerTemplate.Models.Image();
				break;
			case MailerTemplate.TemplateItems.SOCIALLINKS:
				return new MailerTemplate.Models.SocialLinks();
				break;
		}
	},
	getTemplateObject : function(type,id){
//		var type = $(object).attr('type');
		switch (type)
		{
			case MailerTemplate.TemplateItems.TITLE:
				return new MailerTemplate.Views.Title({el : "#"+id});
				break;
			case MailerTemplate.TemplateItems.IMAGE:
				return new MailerTemplate.Views.Image({el : "#"+id});
				break;
			case MailerTemplate.TemplateItems.SOCIALLINKS:
				return new MailerTemplate.Views.SocialLinks({el : "#"+id});
				break;
		}
	},
	getModelData : function(){
		var headerItemIds = $.map($( "#template_holder_header > .droppedObject" ),function(item){return $(item).attr("id"); } );
		var bodyItemIds = $.map($( "#template_holder_body > .droppedObject" ),function(item){return $(item).attr("id"); } );
		var footerItemIds = $.map($( "#template_holder_footer > .droppedObject" ),function(item){return $(item).attr("id"); } );
		
		var ids = {"header" : headerItemIds, "body" : bodyItemIds, "footer":footerItemIds};
		return {
				"ids" : ids,
				"models" : this.m_lstModel,
				"pageStyles" : {
					"pageWidth" 	: this.pageWidth,
					"headerBgColor" 	: this.headerBgColor,
					"bodyBgColor" 		: this.bodyBgColor,
					"footerBgColor" 	: this.footerBgColor,
					"headerPaddingLeft" : this.headerPaddingLeft,
					"headerPaddingRight" : this.headerPaddingRight,
					"bodyPaddingLeft" : this.bodyPaddingLeft,
					"bodyPaddingRight" : this.bodyPaddingRight,
					"footerPaddingLeft" : this.footerPaddingLeft,
					"footerPaddingRight" : this.footerPaddingRight
				}	
			};
	},
	ClearEditor : function(){
		this.m_Index= 0;
		this.m_lstModel	= [];
		this.m_TemplateHoderBody.html("");
		this.m_TemplateHoderHeader.html("");
		this.m_TemplateHoderFooter.html("");
	},
	LoadJson : function(json){
		var templateItems = json.templateItems;
		var header = templateItems.header;
		var body = templateItems.body;
		var footer = templateItems.footer;
		
		this.ClearEditor();
		this.AppendTemplate(header,this.m_TemplateHoderHeader);
		this.AppendTemplate(body,this.m_TemplateHoderBody);
		this.AppendTemplate(footer,this.m_TemplateHoderFooter);
		this.ApplyHoverEvent();
	},
	AppendTemplate : function(jsonObject, parentElement){
		var temp = this;
		$.each(jsonObject,function(i,item){
			var element = temp.getElementToDrop(item.type);
			element = $(element).filter("div");
			$(parentElement).append(element);
			$(element).prop("id","template"+(temp.m_Index++));
			var model = temp.getTemplateModel(item.type);
			model.fromJson(item);
			var elementView = temp.getTemplateObject(item.type,$(element).attr("id"));
			elementView.setModel(model);
			temp.m_lstModel[$(element).attr("id")] = model;
		});
	},
	setProperty : function(data){
		if (data.property == "width"){
			this.m_TemplateHoderBody.width(data.value+"px");
			this.m_TemplateHoderHeader.width(data.value+"px");
			this.m_TemplateHoderFooter.width(data.value+"px");
			this.pageWidth = data.value;
		}
		else if (data.property == "headerBgColor"){
			this.m_TemplateHoderHeader.css("background-color",data.value);
			this.headerBgColor = data.value;
		}
		else if (data.property == "bodyBgColor"){
			this.m_TemplateHoderBody.css("background-color",data.value);
			this.bodyBgColor = data.value;
		}
		else if (data.property == "footerBgColor"){
			this.m_TemplateHoderFooter.css("background-color",data.value);
			this.footerBgColor = data.value;
		}
		else if (data.property == "headerPaddingLeft"){
			this.m_TemplateHoderHeader.css("padding-left",data.value+"px");
			this.headerPaddingLeft = data.value;
		}
		else if (data.property == "headerPaddingRight"){
			this.m_TemplateHoderHeader.css("padding-right",data.value+"px");
			this.headerPaddingRight = data.value;
		}
		else if (data.property == "bodyPaddingLeft"){
			this.m_TemplateHoderBody.css("padding-left",data.value+"px");
			this.bodyPaddingLeft = data.value;
		}
		else if (data.property == "bodyPaddingRight"){
			this.m_TemplateHoderBody.css("padding-right",data.value+"px");
			this.bodyPaddingRight = data.value;
		}
		else if (data.property == "footerPaddingLeft"){
			this.m_TemplateHoderFooter.css("padding-left",data.value+"px");
			this.footerPaddingLeft = data.value;
		}
		else if (data.property == "footerPaddingRight"){
			this.m_TemplateHoderFooter.css("padding-right",data.value+"px");
			this.footerPaddingRight = data.value;
		}
	},
	setAllPageValues: function(data){
		this.pageWidth = data.pageWidth;
		this.headerBgColor = data.headerBgColor;
		this.bodyBgColor = data.bodyBgColor;
		this.footerBgColor = data.footerBgColor;
		this.headerPaddingLeft = data.headerPaddingLeft;
		this.headerPaddingRight = data.headerPaddingRight;
		this.bodyPaddingLeft = data.bodyPaddingLeft;
		this.bodyPaddingRight = data.bodyPaddingRight;
		this.footerPaddingLeft = data.footerPaddingLeft;
		this.footerPaddingRight = data.footerPaddingRight;
		
		this.m_TemplateHoderBody.width(data.pageWidth+"px");
		this.m_TemplateHoderHeader.width(data.pageWidth+"px");
		this.m_TemplateHoderFooter.width(data.pageWidth+"px");
		this.m_TemplateHoderHeader.css("background-color",data.headerBgColor);
		this.m_TemplateHoderBody.css("background-color",data.bodyBgColor);
		this.m_TemplateHoderFooter.css("background-color",data.footerBgColor);
		this.m_TemplateHoderHeader.css("padding-left",data.headerPaddingLeft+"px");
		this.m_TemplateHoderHeader.css("padding-right",data.headerPaddingRight+"px");
		this.m_TemplateHoderBody.css("padding-left",data.bodyPaddingLeft+"px");
		this.m_TemplateHoderBody.css("padding-right",data.bodyPaddingRight+"px");
		this.m_TemplateHoderFooter.css("padding-left",data.footerPaddingLeft+"px");
		this.m_TemplateHoderFooter.css("padding-right",data.footerPaddingRight+"px");
	}
});
MailerTemplate.Views.TemplateHolder.DISPLAY_PROPERTYPANEL = "displayPropertyPanel";
MailerTemplate.Views.TemplateHolder.BINDMODEL = "bindModel";