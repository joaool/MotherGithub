MailerTemplate.Models.Title = Backbone.Model.extend({
	m_titleText : null,
	m_styleProperty : null,
	
	initialize : function(){
		this.setTitle("Put your text here.");
		this.setDefaultStyleProperties();
		this.set({type:MailerTemplate.TemplateItems.TITLE});
	},
	setDefaultStyleProperties : function(){
		this.m_styleProperty = {};
		var temp = this;
		$.each(Object.keys($(MailerTemplate.StyleProperties)[0]), function(i,item) {
			temp.m_styleProperty[item] = MailerTemplate.StyleProperties[item];
		});
		this.set({style:this.m_styleProperty});
	},
	setTitle : function(text){
		this.set({title : text});
		this.m_titleText = text;
		this.trigger(MailerTemplate.Models.Title.TEXT_CHANGE,this.m_titleText);
	},
	getTitle : function(){
		return this.m_titleText;
	},
	getStyleProperty : function(){
		return this.m_styleProperty;	
	},
	setStyleProperty : function(data){
		this.m_styleProperty[data.property] = data.value
		this.set({style:this.m_styleProperty});
		this.trigger(MailerTemplate.Models.Title.PROPERTY_CHANGE,data);
	},
	setStyleObject : function(styleObj){
		this.setDefaultStyleProperties();
		var obj = styleObj;
		var temp = this;
		$.each(Object.keys(styleObj),function(i,item){
			temp.m_styleProperty[item] = obj[item];
		});
		this.set({style:this.m_styleProperty});
		this.trigger(MailerTemplate.Models.Title.STYLE_OBJ_CHANGE,this.m_styleProperty);
	},
	CloneModel : function(){
		var newModel = new MailerTemplate.Models.Title();
		newModel.setTitle(this.m_titleText);
		newModel.setStyleObject(this.m_styleProperty);
		return newModel;
	},
	fromJson : function(json){
		this.setTitle(json.title);
		this.setStyleObject(json.style);
	}
});

MailerTemplate.Models.Title.TEXT_CHANGE = "titleTextchange";
MailerTemplate.Models.Title.PROPERTY_CHANGE = "propertychange";
MailerTemplate.Models.Title.STYLE_OBJ_CHANGE = "styleObjchange";