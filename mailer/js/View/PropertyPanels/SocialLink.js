MailerTemplate.Views.SocialLink = Backbone.View.extend({
	m_LinkType : "",
	m_LinkCheckbox : null,
	m_LinkText : "",
	m_LinkUrl : "",
	
	initialize : function(data){
		this.m_LinkType = data.type;
		this.m_LinkCheckbox = $(data.checkboxId);
		this.m_LinkText = $(data.textId);
		this.m_LinkUrl =$(data.pageId);
		
		this.m_LinkCheckbox.bind("change", this.onLinkCheckboxChange.bind(this));
		this.m_LinkText.bind("change keyup", this.onLinkTextChange.bind(this));
		this.m_LinkUrl.bind("change keyup", this.onLinkUrlChange.bind(this));
	},
	onLinkCheckboxChange : function(evt){
		var data = {};
		data.update = $(this.m_LinkCheckbox).prop("checked") ? "enableLink" : "disableLink";
		data.type = this.m_LinkType;
		this.trigger(MailerTemplate.Views.SocialLink.LINK_DATA_CHANGE,data);
	},
	onLinkTextChange : function(evt){
		var data = {};
		data.type = this.m_LinkType;
		data.update = "linkText";
		data.text = $(this.m_LinkText).val();
		this.trigger(MailerTemplate.Views.SocialLink.LINK_DATA_CHANGE,data);
	},
	onLinkUrlChange : function(evt){
		var data = {};
		data.type = this.m_LinkType;
		data.update = "linkUrl";
		data.url = $(this.m_LinkUrl).val();
		this.trigger(MailerTemplate.Views.SocialLink.LINK_DATA_CHANGE,data);
	},
	EnableLink : function(){
		$(this.m_LinkCheckbox).prop("checked",true);
	},
	DisableLink : function(){
		$(this.m_LinkCheckbox).prop("checked",false);
	},
	setLinkUrl : function(url){
		this.m_LinkUrl.val(url)
	},
	setLinkText : function(text){
		this.m_LinkText.val(text);
	}
});
MailerTemplate.Views.SocialLink.LINK_DATA_CHANGE = "linkDataChange";