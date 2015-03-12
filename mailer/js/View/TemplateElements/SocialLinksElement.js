MailerTemplate.Views.SocialLinks = Backbone.View.extend({
	m_Model : null,
	m_CssStyleConnector : null,
	m_lstSocialLinks  : {},
	
	initialize : function(){
		this.m_CssStyleConnector = {};
		var temp = this;
		$.each(Object.keys($(MailerTemplate.CssStyleConnector)[0]), function(i,item) {
			temp.m_CssStyleConnector[item] = MailerTemplate.CssStyleConnector[item];
		});
		$.each(MailerTemplate.SocialLinks, function(i, item){
			var type = item.type;
			var link = {
				element : temp.$el.find("#share"+type),
				textElement : temp.$el.find("#"+type+"Text"),
				linkElement : temp.$el.find("#"+type+"Link")
			}
			temp.m_lstSocialLinks[type] = link;
		});
    },
	
	setModel : function(model){
		this.m_Model = model;
		
		this.setAllStyleProperty(this.m_Model.getStyleProperty());
		this.setLinkData(this.m_Model.getLinkData());
		this.listenTo(this.m_Model, MailerTemplate.Models.SocialLinks.PROPERTY_CHANGE, this.setStyleProperty);
		this.listenTo(this.m_Model, MailerTemplate.Models.SocialLinks.STYLE_OBJ_CHANGE, this.setAllStyleProperty);
		this.listenTo(this.m_Model, MailerTemplate.Models.SocialLinks.ENABLE_LINK, this.enableSocialLink);
		this.listenTo(this.m_Model, MailerTemplate.Models.SocialLinks.DISABLE_LINK, this.disableSocialLink);
		this.listenTo(this.m_Model, MailerTemplate.Models.SocialLinks.UPDATE_TEXT, this.updateText);
		this.listenTo(this.m_Model, MailerTemplate.Models.SocialLinks.UPDATE_URL, this.updateUrl);
	},
	updateText : function(data){
		var type = data.type;
		var linkElements = this.m_lstSocialLinks[type];
		$(linkElements.textElement).html(data.text);
	},
	updateUrl : function(data){
		var type = data.type;
		var linkElements = this.m_lstSocialLinks[type];
		$(linkElements.linkElement).attr("href",data.url);
	},
	enableSocialLink : function(type){
		
		var linkElements = this.m_lstSocialLinks[type];
		$(linkElements.element).show();
	},
	disableSocialLink : function(type){
		
		var linkElements = this.m_lstSocialLinks[type];
		$(linkElements.element).hide();
	},
	setAllStyleProperty : function(styles){
		var temp = this;
		var data = styles;
		$.each(Object.keys(styles),function(i,item){
			var prop = temp.m_CssStyleConnector[item];
			var value = data[item];
			temp.$el.css(prop , value);
		});
	},
	setStyleProperty : function(data){
		var prop = this.m_CssStyleConnector[data.property];
		this.$el.css(prop , data.value);
	},
	setLinkData : function(linkData){
		var temp = this;
		$.each(linkData, function(i,item){
			var type = i;
			var linkElements = temp.m_lstSocialLinks[type];
			$(linkElements.linkElement).attr("href",item.url);
			$(linkElements.textElement).html(item.text);
			if (item.enable)
			{
				$(linkElements.element).show();
			}
			else
			{
				$(linkElements.element).hide();
			}
		});
	}
});