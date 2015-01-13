MailerTemplate.Views.Image = Backbone.View.extend({
	m_ImageSource : null,
	m_Model : null,
	m_CssStyleConnector : null,
	m_ImageElement : null,
	m_previewBlock : null,
	
	initialize : function(){
		this.m_CssStyleConnector = {};
		var temp = this;
		$.each(Object.keys($(MailerTemplate.CssStyleConnector)[0]), function(i,item) {
			temp.m_CssStyleConnector[item] = MailerTemplate.CssStyleConnector[item];
		});
		this.m_ImageElement = $($(this.$el.children()[0]).children()[0]);
		this.m_previewBlock = $($(this.$el.children()[0]).children()[1]);
	},
	
	setSource : function(source){
		this.m_ImageSource = source;
		this.m_ImageElement[0].src = source;
		$(this.m_previewBlock).hide();
	},
	setModel : function(model){
		this.m_Model = model;
		this.setSource(this.m_Model.getSource());
		this.setAllStyleProperty(this.m_Model.getStyleProperty());
		this.listenTo(this.m_Model, MailerTemplate.Models.Image.IMAGE_CHANGE, this.setSource);
		this.listenTo(this.m_Model, MailerTemplate.Models.Image.PROPERTY_CHANGE, this.setStyleProperty);
		this.listenTo(this.m_Model, MailerTemplate.Models.Image.STYLE_OBJ_CHANGE, this.setAllStyleProperty);
	},
	setAllStyleProperty : function(styles){
		var temp = this;
		var data = styles;
		$.each(Object.keys(styles),function(i,item){
			var prop = temp.m_CssStyleConnector[item];
			var value = data[item];
			if (prop == "imageAlign")
			{
				temp.m_ImageElement.attr("align",value);	
			}
			else
			{
				temp.m_ImageElement.css(prop , value);
			}
		});
	},
	setStyleProperty : function(data){
		var prop = this.m_CssStyleConnector[data.property];
		if (prop == "imageAlign")
		{
			this.m_ImageElement.attr("align",data.value);	
		}
		else
		{
			this.m_ImageElement.css(prop , data.value);
		}
	}
});
