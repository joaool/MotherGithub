MailerTemplate.Views.MainView = Backbone.View.extend({
	m_Model : null,
	m_TemplateItems : null,
	m_Editor : null,
	m_PropertyPanel : null,
	m_DesignPage : null,
	m_DesignPageHeader : null,
	m_DesignPageBody : null,
	m_DesignPageFooter : null,
	m_saveTemplate : null,
	m_jsonGenerator : null,
	
	initialize : function(expenses){
		this.m_jsonGenerator = new JsonGenerator();
		
		this.m_TemplateItems = new MailerTemplate.Views.TemplateItems({el : "#templateItems"});
		this.m_Editor = new MailerTemplate.Views.TemplateHolder({el : "#templateHolder"});
		this.listenTo(this.m_Editor,MailerTemplate.Views.TemplateHolder.DISPLAY_PROPERTYPANEL,this.ShowProptertyPanel);
		this.listenTo(this.m_Editor,MailerTemplate.Views.TemplateHolder.BINDMODEL, this.bindModelToPanel);
		
		this.m_PropertyPanel = new MailerTemplate.Views.PropertyPanel({el : "#propertyPanel"});
		
		this.m_saveTemplate = $("#saveTempalate");
		
//		this.m_DesignTab = new MailerTemplate.Views.DesignTemplatePage({el : "#DesignPageDiv"}); 
//		this.m_DesignPageHeader = new MailerTemplate.Views.DesignTemplatePageHeader({el : "#DesignPageDiv"}); 
//		this.m_DesignPageBody = new MailerTemplate.Views.DesignTemplateBody({el : "#DesignPageDiv"}); 
//		this.m_DesignPageFooter = new MailerTemplate.Views.DesignTemplateFooter({el : "#DesignPageDiv"}); 
	},
	events : {
		"click #saveTempalate" : "OnSaveBtnClick"
	},
	OnSaveBtnClick : function(evt){
		alert("ZXZXZXZXZ");
		FL.common.makeModalInfo('Welcome to the Newsletter Editor...',function(){
			alert("XXX");
		});
		var modelData = this.m_Editor.generatePlainHtml();
		var jsonData = this.m_jsonGenerator.GenerateJson(modelData);
		window.jsonObject = jsonData;
		window.open("TemplatePreview.html","_blank");
	},
	ShowProptertyPanel: function(data){
		this.m_PropertyPanel.clear();
		this.m_PropertyPanel.show(data.type,data.model);
	},
	bindModelToPanel : function(model){
		this.m_PropertyPanel.setModel(model);
	}
});


