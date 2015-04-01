MailerTemplate.Views.MainView = Backbone.View.extend({
	m_Model : null,
	m_TemplateItems : null,
	m_Editor : null,
	m_PropertyPanel : null,
	m_DesignPage : null,
	
	m_saveTemplate : null,
	m_jsonGenerator : null,
	m_loadTemplate : null,
	
	initialize : function(expenses){
		this.m_jsonGenerator = new JsonGenerator();
		
		this.m_TemplateItems = new MailerTemplate.Views.TemplateItems({el : "#templateItems"});
		this.m_Editor = new MailerTemplate.Views.TemplateHolder({el : "#templateHolder"});
		this.listenTo(this.m_Editor,MailerTemplate.Views.TemplateHolder.DISPLAY_PROPERTYPANEL,this.ShowProptertyPanel);
		this.listenTo(this.m_Editor,MailerTemplate.Views.TemplateHolder.BINDMODEL, this.bindModelToPanel);
		
		this.m_PropertyPanel = new MailerTemplate.Views.PropertyPanel({el : "#propertyPanel"});
		
		this.m_saveTemplate = $("#saveTempalate");
		this.m_loadTemplate = $("#loadTemplate");
		
		this.m_DesignPage = new MailerTemplate.Views.PageDesign({el : "#templateDesign"});
		this.listenTo(this.m_DesignPage,MailerTemplate.Views.PageDesign.PROPERTY_CHANGE,this.OnPagePropertyChange);
		
		this.m_DesignPage.setValues(MailerTemplate.pageStyle);
		this.m_Editor.setAllPageValues(MailerTemplate.pageStyle);
	},
	events : {
		"click #saveTempalate" : "OnSaveBtnClick",
		"click #loadTemplate" : "OnLoadTemplateBtnClick"
	},
	OnPagePropertyChange: function(data){
		this.m_Editor.setProperty(data);
	},
	openModal: function() {
        var view = new MailerTemplate.Views.ModalView();
		view.setHtml("Do you sure you want to save this template ?")
		this.listenTo(view,MailerTemplate.Views.ModalView.OkClicked, this.onModalOkClicked);
        var modal = new Backbone.BootstrapModal({
            content: view,
            title: 'Save',
            animate: true
        });
        modal.open(function(){ console.log('clicked OK') });
    },
	onModalOkClicked : function(){
		window.open("TemplatePreview.html","_blank");
	},
	OnSaveBtnClick : function(evt){
		var modelData = this.m_Editor.getModelData();
		var jsonData = this.m_jsonGenerator.GenerateJson(modelData);
		var jsonString = JSON.stringify(jsonData);
		console.log(jsonString);
		// save this jsonString
		this.openModal();
		window.jsonObject = jsonData;
		//window.open("TemplatePreview.html","_blank");
	},
	OnLoadTemplateBtnClick : function(){
		var temp = this;
		$.ajax({
			url : "TemplateSample.json",
			type: 'get',
			data : 'text',
			success : function(data) { temp.LoadTemplate(data); },
			error : this.OnError
		});
	},
	LoadTemplate : function(data){
		try{
			if(typeof data == 'string')
			{
				data = JSON.parse(data);
			}
			this.m_Editor.LoadJson(data);
			if (data.pageStyles){
				this.m_DesignPage.setValues(data.pageStyles);
				this.m_Editor.setAllPageValues(data.pageStyles);
			}
		}
		catch(e)
		{
			console.log("Json parse Error")
		}
		
	},
	OnError : function(){
		console.log("Error loading template");
	},
	ShowProptertyPanel: function(data){
		this.m_PropertyPanel.clear();
		this.m_PropertyPanel.show(data.type,data.model);
	},
	bindModelToPanel : function(model){
		this.m_PropertyPanel.setModel(model);
	}
});


