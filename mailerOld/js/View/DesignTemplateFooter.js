MailerTemplate.Views.DesignTemplateFooter = Backbone.View.extend({
	m_DesignTemplates : null,
	initialize : function(){
		this.m_DesignTemplates = [];
		var temp =this;
		$.each($(MailerTemplate.DesignTemplate), function(i, item){
		var temple = _.template($("#"+item).html());
			temp.m_DesignTemplates.push(temple);
		});
	},
	loadTemplates : function(){
		var temp = this;
		$.each(temp.m_DesignTemplates, function(i,item){
			element = item({});
			temp.$el.append(element);
		});	
	}
});