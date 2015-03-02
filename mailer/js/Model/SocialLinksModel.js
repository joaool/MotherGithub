MailerTemplate.Models.SocialLinks = Backbone.Model.extend({
	m_lstSocialLinksUsed : [],
	m_styleProperty : null,
	m_lstLinkData : [],
	
	initialize : function(){
		this.m_lstSocialLinks = [];
		var temp =this;
		$.each($(MailerTemplate.SocialLinks), function(i, item){
			temp.m_lstSocialLinksUsed.push(item);
		});
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
		newModel.setLink(this.m_Link);
		return newModel;
	},
	toJson : function(){
		// TODO : generate JSON;
	},
	fromJson : function(json){
		this.setSource(json.source);
		this.setStyleObject(json.style);
		this.setLink(json.link);
	},
	EnableLink : function(type){
		this.m_lstSocialLinksUsed.push(type);
		this.trigger(MailerTemplate.Models.Image.ENABLE_LINK,type);
	},
	DisableLink : function(type){
		this.m_lstSocialLinksUsed.remove(type);
		this.trigger(MailerTemplate.Models.Image.DISABLE_LINK,type);
	},
	setLinkUrl : function(type,url){
		m_lstLinkData[type].url = url;
	},
	setLinkText : function(type,text){
		m_lstLinkData[type].text = text;
	}
});
MailerTemplate.Models.Image.ENABLE_LINK = "enableLink";
MailerTemplate.Models.Image.DISABLE_LINK = "disableLink";