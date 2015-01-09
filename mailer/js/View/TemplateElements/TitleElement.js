MailerTemplate.Views.Title = Backbone.View.extend({
	m_titleText : null,
	m_Model : null,
	m_CssStyleConnector : null,
	
	initialize : function(){
		this.m_CssStyleConnector = {};
		var temp = this;
		$.each(Object.keys($(MailerTemplate.CssStyleConnector)[0]), function(i,item) {
			temp.m_CssStyleConnector[item] = MailerTemplate.CssStyleConnector[item];
		});
	},
	
	setTitle : function(text){
		this.m_titleText = text;
		this.$el.html(text);
	},
	setModel : function(model){
		this.m_Model = model;
		this.setTitle(this.m_Model.getTitle());
		this.setAllStyleProperty(this.m_Model.getStyleProperty());
		this.listenTo(this.m_Model, MailerTemplate.Models.Title.TEXT_CHANGE, this.setTitle);
		this.listenTo(this.m_Model, MailerTemplate.Models.Title.PROPERTY_CHANGE, this.setStyleProperty);
		this.listenTo(this.m_Model, MailerTemplate.Models.Title.STYLE_OBJ_CHANGE, this.setAllStyleProperty);
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
