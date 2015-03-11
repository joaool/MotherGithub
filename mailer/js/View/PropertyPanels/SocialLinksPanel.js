MailerTemplate.Views.SocialLinksPanel = Backbone.View.extend({
	m_propertyPanel : null,
	m_Model : null,
	bSupressChangeEvent : true,
	m_styleTab : null,
	m_SocialLinkBody : null,
	m_lstLinks : {},
	
	initialize : function(){
		this.m_propertyPanel = $("#propertyPanel");
		this.m_SocialLinkBody = $("#socialLinksBody");
		this.m_SocialLinkBody.show();
		this.m_lstLinks = {};
		var temp = this;
		$.each(MailerTemplate.SocialLinks, function(i, item){
			var link =  new MailerTemplate.Views.SocialLink({ type : item.type, checkboxId : "#use"+item.type+"Link", pageId : "#"+item.type+"PageUrl",textId : "#"+item.type+"LinkText"});
			temp.listenTo(link,MailerTemplate.Views.SocialLink.LINK_DATA_CHANGE,temp.LinkDataChange);
			temp.m_lstLinks[item.type] = link;
		});
		
		this.m_styleTab = new MailerTemplate.Views.StyleTab({el : "#styletab"});
		
	},
	
	render : function(){
		
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
		var temp = this;
		$.each(model.getLinkData(),function(i,link){
			var type = i;
			var linkElement = temp.m_lstLinks[type];
			linkElement.setLinkUrl(link.url);
			linkElement.setLinkText(link.text);
			if (link.enable)
				linkElement.EnableLink()
			else
				linkElement.DisableLink()
		});
	},
	OnStylePropertyChanged : function(data){
		this.m_Model.setStyleProperty(data);
	},
	LinkDataChange : function(data){
		this.m_Model.updateLinkData(data);
	}
	
})