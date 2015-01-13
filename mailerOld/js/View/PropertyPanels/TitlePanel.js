MailerTemplate.Views.TitlePanel = Backbone.View.extend({
	m_titleTemplate : null,
	m_propertyPanel : null,
	m_Model : null,
	bSupressChangeEvent : true,
	m_styleTab : null,
	m_titleBody : null,
	
	initialize : function(){
		this.m_propertyPanel = $("#propertyPanel");
		this.m_titleBody = $("#titleBody");
		this.m_titleBody.show();
		
		this.m_styleTab = new MailerTemplate.Views.StyleTab({el : "#styletab"});
		
	},
	
	render : function(){
		this.initCkEditor();
	},
	show : function(){
		//this.render();
		this.m_titleBody.show();
		this.m_styleTab.setTemplateType(MailerTemplate.TemplateItems.TITLE);
		this.listenTo(this.m_styleTab,MailerTemplate.Views.StyleTab.STYLE_PROPERTY_CHANGED,this.OnStylePropertyChanged);
		this.bSupressChangeEvent = false;
	},
	clear: function(){
		this.bSupressChangeEvent = true;
	},
	hide: function(){
		this.m_titleBody.hide();
		this.stopListening(this.m_styleTab);
	},
	initCkEditor : function(){
		var temp = this;
		CKEDITOR.replace( 'titleText' );
		CKEDITOR.instances["titleText"].on('change', function() {
			temp.onCKEditorChangeEvent();
		});
	},
	onCKEditorChangeEvent : function(){
		if (!this.bSupressChangeEvent)
		{
			var data = CKEDITOR.instances["titleText"].getData();
			if (this.m_Model != null)
				this.m_Model.setTitle(data);
		}

	},
	renderModel : function(model){
		this.m_Model = model;
		CKEDITOR.instances["titleText"].setData(model.getTitle());
		this.m_styleTab.setStyleProperty(model.getStyleProperty());
	},
	OnStylePropertyChanged : function(data){
		this.m_Model.setStyleProperty(data);

	}
})