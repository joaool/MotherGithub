MailerTemplate.Views.PropertyPanel = Backbone.View.extend({
	m_TitlePanel : null,
	m_ImagePanel : null,
	m_activePanel : null,
	m_Model : null,
	
	
	initialize : function(){
		this.m_TitlePanel =  new MailerTemplate.Views.TitlePanel({el : "#propertyPanel"});
		this.m_ImagePanel =  new MailerTemplate.Views.ImagePanel({el : "#propertyPanel"});
		this.m_PropertyTab = $("#propertyTab");
		this.m_activePanel = this.m_TitlePanel;
		this.render();
	},
	events : {
		
	},
	setModel : function(model){
		this.m_Model = model;
	},
	getModel : function(){
		return this.m_Model;
	},
	events : {
		"click #saveProperties" : "onSaveClick"	
	},
	onSaveClick : function(){
		this.hide();
	},
	render : function(){
		this.m_TitlePanel.render();
	},
	clear : function(){
		this.m_Model  = null;
		this.m_activePanel.clear();
	},
	show : function(templateType, model){
		this.setModel(model);
		if (templateType == MailerTemplate.TemplateItems.TITLE)
		{
			this.changeActivePanel(this.m_TitlePanel);
		}
		else if (templateType == MailerTemplate.TemplateItems.IMAGE)
		{
			this.changeActivePanel(this.m_ImagePanel);
		}
		this.$el.show();
		this.m_activePanel.renderModel(this.m_Model);
		this.m_activePanel.show();
		
		var h = window.innerHeight - $("#propertyBody")[0].offsetTop;
		$("#propertyBody").parent().css({height:h+"px",overflow:"auto"});
		
		this.$el.animate({right:0},300);
	},
	changeActivePanel : function(currentPanel){
		this.m_activePanel.hide();
		this.m_activePanel = currentPanel;
	},
	hide : function(){
		this.$el.animate({right:-350},300);
		this.m_activePanel.hide();
	}
});