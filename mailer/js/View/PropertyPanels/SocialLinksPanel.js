MailerTemplate.Views.SocialLinksPanel = Backbone.View.extend({
	m_propertyPanel : null,
	m_Model : null,
	bSupressChangeEvent : true,
	m_styleTab : null,
	m_SocialLinkBody : null,
	
	initialize : function(){
		this.m_propertyPanel = $("#propertyPanel");
		this.m_SocialLinkBody = $("#socialLinksBody");
		this.m_SocialLinkBody.show();
		
		this.m_styleTab = new MailerTemplate.Views.StyleTab({el : "#styletab"});
		
	},
	
	render : function(){
		this.initCkEditor();
	},
	show : function(){
		//this.render();
		this.m_SocialLinkBody.show();
		this.m_styleTab.setTemplateType(MailerTemplate.TemplateItems.SOCIALLINKS);
		this.listenTo(this.m_styleTab,MailerTemplate.Views.StyleTab.STYLE_PROPERTY_CHANGED,this.OnStylePropertyChanged);
		this.bSupressChangeEvent = false;
	},
	clear: function(){
		this.bSupressChangeEvent = true;
	},
	hide: function(){
		this.m_SocialLinkBody.hide();
		this.stopListening(this.m_styleTab);
	},
	
	renderModel : function(model){
		this.m_Model = model;
		
		this.m_styleTab.setStyleProperty(model.getStyleProperty());
	},
	OnStylePropertyChanged : function(data){
		this.m_Model.setStyleProperty(data);

	}
})