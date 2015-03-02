MailerTemplate.Views.SocialLinks = Backbone.View.extend({
	m_Model : null,
	m_CssStyleConnector : null,
	
	initialize : function(){
		this.m_CssStyleConnector = {};
		var temp = this;
		$.each(Object.keys($(MailerTemplate.CssStyleConnector)[0]), function(i,item) {
			temp.m_CssStyleConnector[item] = MailerTemplate.CssStyleConnector[item];
		});
		this.m_ImageElement = this.$el.find("img");
		this.m_previewBlock = this.$el.find("#previewBlock");
		this.m_Link = this.$el.find("a");
	},
	setModel : function(model){
		this.m_Model = model;
		
		this.setAllStyleProperty(this.m_Model.getStyleProperty());
		
		this.listenTo(this.m_Model, MailerTemplate.Models.Image.PROPERTY_CHANGE, this.setStyleProperty);
		this.listenTo(this.m_Model, MailerTemplate.Models.Image.STYLE_OBJ_CHANGE, this.setAllStyleProperty);
		
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
	}
});