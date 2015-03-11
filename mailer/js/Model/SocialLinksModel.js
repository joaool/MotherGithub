MailerTemplate.Models.SocialLinks = Backbone.Model.extend({
	m_lstSocialLinksUsed : [],
	m_styleProperty : null,
	m_lstLinkData : {},
	
	initialize : function(){
		this.m_lstSocialLinksUsed = [];
		this.m_lstLinkData = {};
		var temp =this;
		$.each(MailerTemplate.SocialLinks, function(i, item){
			temp.m_lstSocialLinksUsed.push(item.type);
			var link = {url : item.defaultUrl, text : item.defaultText, enable : true};
			temp.m_lstLinkData[item.type] = link;
		});
		this.setLinkData(this.m_lstLinkData);
		this.setDefaultStyleProperties();
		this.set({type:MailerTemplate.TemplateItems.SOCIALLINKS});
	},
	setDefaultStyleProperties : function(){
		this.m_styleProperty = {};
		var temp = this;
		$.each(Object.keys($(MailerTemplate.StyleProperties)[0]), function(i,item) {
			temp.m_styleProperty[item] = MailerTemplate.StyleProperties[item];
		});
		this.set({style:this.m_styleProperty});
	},
	getStyleProperty : function(){
		return this.m_styleProperty;	
	},
	setStyleProperty : function(data){
		this.m_styleProperty[data.property] = data.value
		this.trigger(MailerTemplate.Models.Title.PROPERTY_CHANGE,data);
		this.set({style:this.m_styleProperty});
	},
	setStyleObject : function(styleObj){
		this.setDefaultStyleProperties();
		var obj = styleObj;
		var temp = this;
		$.each(Object.keys(styleObj),function(i,item){
			temp.m_styleProperty[item] = obj[item];
		});
		this.set({style:this.m_styleProperty});
		this.trigger(MailerTemplate.Models.Image.STYLE_OBJ_CHANGE,this.m_styleProperty);
	},
	CloneModel : function(){
		var newModel = new MailerTemplate.Models.Image();
		newModel.setSource(this.m_ImageSource);
		newModel.setStyleObject(this.m_styleProperty);
		$.each(this.m_lstLinkData,function(i,link){
			var type = link.type;
			newModel.setLinkUrl(link.url);
			newModel.setLinkText(link.text);
			if (this.m_lstLinkData.enable)
				newModel.EnableLink(type)
		});
		return newModel;
	},
	
	fromJson : function(json){
		this.setStyleObject(json.style);
		this.setLinkData(json.linksData);
	},
	setLinkData : function(linkData){
		this.m_lstLinkData = linkData;
		this.set({linksData:this.m_lstLinkData})
	},
	getLinkData : function(){
		return this.m_lstLinkData;	
	},
	updateLinkData : function(data){
		var type = data.type;
		switch (data.update)
		{
			case "enableLink":
				this.EnableLink(type);
				break;
			case "disableLink":
				this.DisableLink(type);
				break;
			case "linkUrl":
				this.setLinkUrl(type,data.url);
				break;
			case "linkText":
				this.setLinkText(type,data.text);
				break;
		}
	},
	EnableLink : function(type){
		this.m_lstSocialLinksUsed.push(type);
		this.trigger(MailerTemplate.Models.SocialLinks.ENABLE_LINK,type);
		var linkData = this.m_lstLinkData[type];
		linkData.enable = true;
		this.set({})
	},
	DisableLink : function(type){
		this.m_lstSocialLinksUsed.remove(type);
		this.trigger(MailerTemplate.Models.SocialLinks.DISABLE_LINK,type);
		var linkData = this.m_lstLinkData[type];
		linkData.enable = false;
	},
	setLinkUrl : function(type,url){
		this.m_lstLinkData[type].url = url;
		this.trigger(MailerTemplate.Models.SocialLinks.UPDATE_URL,{type:type,url:url});
	},
	setLinkText : function(type,text){
		this.m_lstLinkData[type].text = text;
		this.trigger(MailerTemplate.Models.SocialLinks.UPDATE_TEXT,{type:type,text:text});
	}
});
MailerTemplate.Models.SocialLinks.PROPERTY_CHANGE = "propertychange";
MailerTemplate.Models.SocialLinks.STYLE_OBJ_CHANGE = "styleObjchange";
MailerTemplate.Models.SocialLinks.ENABLE_LINK = "enableLink";
MailerTemplate.Models.SocialLinks.DISABLE_LINK = "disableLink";
MailerTemplate.Models.SocialLinks.UPDATE_TEXT = "updateText";
MailerTemplate.Models.SocialLinks.UPDATE_URL = "updateUrl";