MailerTemplate.Models.Image = Backbone.Model.extend({
	m_ImageSource : null,
	m_styleProperty : null,
	
	initialize : function(){
		this.setSource("images/empty_image-72.png");
		this.setDefaultStyleProperties();
		this.set({type:MailerTemplate.TemplateItems.IMAGE});
	},
	setSource : function(source){
		this.m_ImageSource = source;
		this.set({source:this.m_ImageSource});
		this.trigger(MailerTemplate.Models.Image.IMAGE_CHANGE,this.m_ImageSource);
	},
	getSource : function(){
		return this.m_ImageSource;
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
		this.trigger(MailerTemplate.Models.Title.STYLE_OBJ_CHANGE,this.m_styleProperty);
	},
	CloneModel : function(){
		var newModel = new MailerTemplate.Models.Image();
		newModel.setSource(this.m_ImageSource);
		newModel.setStyleObject(this.m_styleProperty);
		return newModel;
	},
	fromJson : function(json){
		this.setSource(json.source);
		this.setStyleObject(json.style);
	}
});
MailerTemplate.Models.Image.IMAGE_CHANGE = "imageChange";
MailerTemplate.Models.Image.PROPERTY_CHANGE = "propertychange";
MailerTemplate.Models.Image.STYLE_OBJ_CHANGE = "styleObjchange";