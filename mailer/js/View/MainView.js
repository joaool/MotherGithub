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
	m_loadTemplate : null,
	
	initialize : function(expenses){
        // this.render();
        // this.$el.modal({'backdrop': 'static'});
        // var template = _.template($('#charge_dialog_template').html());
        // this.$el.html(template);


		this.m_jsonGenerator = new JsonGenerator();
		
		this.m_TemplateItems = new MailerTemplate.Views.TemplateItems({el : "#templateItems"});
		this.m_Editor = new MailerTemplate.Views.TemplateHolder({el : "#templateHolder"});
		this.listenTo(this.m_Editor,MailerTemplate.Views.TemplateHolder.DISPLAY_PROPERTYPANEL,this.ShowProptertyPanel);
		this.listenTo(this.m_Editor,MailerTemplate.Views.TemplateHolder.BINDMODEL, this.bindModelToPanel);
		
		this.m_PropertyPanel = new MailerTemplate.Views.PropertyPanel({el : "#propertyPanel"});
		
		this.m_saveTemplate = $("#saveTempalate");
		this.m_loadTemplate = $("#loadTemplate");
		
//		this.m_DesignTab = new MailerTemplate.Views.DesignTemplatePage({el : "#DesignPageDiv"}); 
//		this.m_DesignPageHeader = new MailerTemplate.Views.DesignTemplatePageHeader({el : "#DesignPageDiv"}); 
//		this.m_DesignPageBody = new MailerTemplate.Views.DesignTemplateBody({el : "#DesignPageDiv"}); 
//		this.m_DesignPageFooter = new MailerTemplate.Views.DesignTemplateFooter({el : "#DesignPageDiv"}); 
	},
	events : {
		"click #saveTempalate" : "OnSaveBtnClick",
		"click #loadTemplate" : "OnLoadTemplateBtnClick",
		"click #exitSaving" : "OnExitSaving",
		"click #exitNoSave" : "OnExitNoSave"
	},
	openModal: function() {
        var view = new MailerTemplate.Views.ModalView();
		view.setHtml("Do you sure you want to save this template ?");
		this.listenTo(view,MailerTemplate.Views.ModalView.OkClicked, this.onModalOkClicked);
        var modal = new Backbone.BootstrapModal({
            content: view,
            title: 'Save',
            animate: true
        });
		modal.open(function(){ console.log('clicked OK');});
    },
	onModalOkClicked : function(){
		window.open("TemplatePreview.html","_blank");
	},
	OnSaveBtnClick : function(evt){
		var modelData = this.m_Editor.generatePlainHtml();
		var jsonData = this.m_jsonGenerator.GenerateJson(modelData);
		var jsonString = JSON.stringify(jsonData);
		console.log(jsonString);
		this.openModal();
		window.jsonObject = jsonData;
		this.openModal();
		// alert("Preview will use json="+jsonString);
		// save this jsonString
		// window.open("./mailer/TemplatePreview.html","_blank");
	},
	OnLoadTemplateBtnClick : function(){
		// var temp = this;
		// $.ajax({
		// 	url : "TemplateSample.json",
		// 	type: 'get',
		// 	data : 'text',
		// 	success : function(data) { temp.LoadTemplate(data); },
		// 	error : this.OnError
		// });
		console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
		console.log("before loading templates->"+JSON.stringify(FL.login.token));
		// alert("before loading templates->"+JSON.stringify(FL.login.token));
		var spinner=FL.common.loaderAnimationON('spinnerDiv');
		var promise=FL.API.loadTable("_templates");
		promise.done(function(data){
			console.log("MainView.js -> _templates successfully loaded");
			spinner.stop();
			if( data.length == 0 ){
				FL.common.makeModalInfo('No templates available. Save your templates with Save button');
			}else{
				alert("_templates content="+JSON.stringify(data));
			}	
		});
		promise.fail(function(err){
			spinner.stop();
			alert("DefaultGridWithNewsLetterAndEditButtons Error="+err);
		});		
	},
	OnExitSaving: function(){
		var modelData = this.m_Editor.generatePlainHtml();
		var jsonData = this.m_jsonGenerator.GenerateJson(modelData);
		var jsonString = JSON.stringify(jsonData);
		alert("jsonString is:"+jsonString);
 	},
	OnExitNoSave: function(){
		alert("exitNoSave");
		window.close();
		// FL.API.disconnect()
		// .then(function(){console.log("DragNDrop->no save --> disconnect ok!");window.close();return;} 
		// 	,function(err){console.log("DragNDrop->no save -->failure on disconnect err ="+err);return;}
		// );
	},
	LoadTemplate : function(data){
		try{
			if(typeof data == 'string')
			{
				data = JSON.parse(data);
			}
			this.m_Editor.LoadJson(data);
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


