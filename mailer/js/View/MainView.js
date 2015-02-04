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
		"click #previewTemplate" : "OnPreview",
		"click #loadTemplate" : "OnLoadTemplateBtnClick",
		"click #saveTemplate" : "OnSaveTemplate",
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
	OnPreview : function(evt){
		var modelData = this.m_Editor.generatePlainHtml();
		var jsonData = this.m_jsonGenerator.GenerateJson(modelData);
		var jsonString = JSON.stringify(jsonData);
		console.log(jsonString);
		// this.openModal();
		window.jsonObject = jsonData;
		// this.openModal();
		window.open("./mailer/TemplatePreview.html","_blank");
	},
	OnLoadTemplateBtnClick : function(){
		this.loadTemplateUI(this)
	},
	OnSaveTemplate: function(){
		var modelData = this.m_Editor.generatePlainHtml();
		var jsonData = this.m_jsonGenerator.GenerateJson(modelData);
		this.storeTemplateUI(this,jsonData);
	},
	OnExitNoSave: function(){
		// alert("exitNoSave");
		FL.common.makeModalInfo('You will leave....');
		window.close();
		// FL.API.disconnect()
		// .then(function(){console.log("MainView.js ->no save --> disconnect ok!");window.close();return;} 
		// 	,function(err){console.log("MainView.js->no save -->failure on disconnect err ="+err);return;}
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
	},
	isTemplateEmpty: function(templateObj){
		return (templateObj.templateItems.header.length == 0 && templateObj.templateItems.body.length == 0 && templateObj.templateItems.footer.length == 0);
	},
	storeTemplateUI: function(context,jsonData){
		var spinner=FL.common.loaderAnimationON('spinnerDiv');
		var thiz=context;
		var promise=FL.API.loadTableId("_templates");
		promise.done(function(data){
			spinner.stop();
			var arrOfObj = thiz.convertsIdsToArrOfObj(data); //converts templateOptionsArr to arrOfObjects
			//ex:arrOfObj=[{value:1,text: "t 115",template:"dfdfdg"},{value:2,text: "t 116",template:"dfgd"}]
			thiz.storeTemplateForm(jsonData,arrOfObj);
		});
		promise.fail(function(err){
			spinner.stop();
			alert("OnSaveTemplate unable to load templates Error="+err);
			return;
		});
	},
	storeTemplateForm: function(jsonData,arrOfObj){//store jsonData on server eventually overlaping one of existing arrOfObj
		var jsonString = JSON.stringify(jsonData);
		var selectedTemplateName = null;
		if (this.isTemplateEmpty(jsonData)){
			FL.common.makeModalInfo('No template to save. Build a template before saving it.');
		}else{
			var masterDetailItems = {
				master:{name:""},
				detail:{}
			};
			var options = {
				type:"primary",
				icon:"pencil",
				button1:"Cancel",
				button2:"Save this template",
				dropdown:{
					"_templateForm_template":{
						arr:arrOfObj,//titles,
						default:"Not overwriting any template",
						onSelect:function(objSelected){
							// alert("Template selected =>"+JSON.stringify(objSelected));
							selectedTemplateName = objSelected.text;
							$("#_templateForm_name").val('');//if user wants to overwrite, name is cleared
						}
					}
				}
			};
			FL.common.editMasterDetail("B"," Save the current template","_templateForm",masterDetailItems,options,function(result){
				if(result){
					var name = $("#_templateForm_name").val();
					// var template = $("#_templateForm_template ul").text();
					if(selectedTemplateName)
						name = selectedTemplateName;
					var record = {jsonTemplate:jsonString};
					var promise = FL.API.upsertByKey(name,"_templates",record);//"_id"yField,keyFieldValue,entityName,record
					promise.done(function(){
						console.log("OnSaveTemplate storeTemplateInterface upsertByKey SUCCESS !");
					});
					promise.fail(function(err){
						alert("OnSaveTemplate storeTemplateInterface upsertByKey	FAILURE");
					});
				}else{
					// alert("-->Nope");//the user select close
					FL.common.makeModalInfo('Nothing was saved');
				}
			});
		}
	},
	loadTemplateUI: function(context){
		var spinner=FL.common.loaderAnimationON('spinnerDiv');
		var thiz=context;
		var promise=FL.API.loadTableId("_templates","jsonTemplate");
		promise.done(function(data){
			spinner.stop();
			if( data.length === 0 ){
				FL.common.makeModalInfo('No templates available. You must have at least one template saved.');
			}else{
				var selectedTemplatePromise = thiz.loadTemplateForm(data);
				selectedTemplatePromise.done(function(selectedTemplate){
					console.log(">>>>>OnLoadTemplateBtnClick selectedTemplatePromise SUCCESS <<<<< ");
					data = JSON.parse(selectedTemplate);
					thiz.m_Editor.LoadJson(data);
					return;
				});
				selectedTemplatePromise.fail(function(err){console.log(">>>>>OnLoadTemplateBtnClick selectedTemplatePromise FAILURE <<<<<"+err);return def.reject(err);});
			}
		});
		promise.fail(function(err){
			spinner.stop();
			alert("DefaultGridWithNewsLetterAndEditButtons Error="+err);
		});
	},
	loadTemplateForm: function(templateOptionsArr){//returns a promise
		var def = $.Deferred();
		var arrOfObj = this.convertsToArrOfObj(templateOptionsArr); //converts templateOptionsArr to arrOfObjects
		//ex:arrOfObj=[{value:1,text: "t 115",template:"dfdfdg"},{value:2,text: "t 116",template:"dfgd"}]

		var selectedTemplate = null;
		var masterDetailItems = {
			master:{name:""},
			detail:{}
		};
		var options = {
			type:"primary",
			icon:"cloud-download",
			button1:"Cancel",
			button2:"Ok to Load",
			dropdown:{
				"_loadTemplateForm_name":{
					arr:arrOfObj,//titles,
					default:"No template",
					onSelect:function(objSelected){
						// alert("Template selected =>"+JSON.stringify(objSelected));
						selectedTemplate = objSelected.template;
					}
				}
			}
		};
		FL.common.editMasterDetail("B"," Load an existing template","_loadTemplateForm",masterDetailItems,options,function(result){
			if(result){
				var template = $("#_loadTemplateForm_option").text();
				if(template.trim() == "No template"){
					FL.common.makeModalInfo('No template was loaded.');
					return def.resolve(null);
				}else{
					// alert("loadTemplateInterface template="+template);
					return 	def.resolve(selectedTemplate);
				}
			}else{
				// alert("-->Nope");//the user select close
				return def.resolve(null);
			}
		});
		return def.promise();
	},
	convertsToArrOfObj: function(templateOptionsArr){
		//receives [{"_id": "t 115",jsonTemplate:"dfdfdg"},{"_id": "t 116",jsonTemplate:"dfgd"}] and returns [{value:1,text: "t 115",template:"dfdfdg"},{value:2,text: "t 116",template:"dfgd"}]
		return _.map(templateOptionsArr, function(el,index){ return {"value":index+1,"text":el._id,"template":el.jsonTemplate}; });
	},
	convertsIdsToArrOfObj: function(templateOptionsArr){
		//receives [{"_id": "t 115"},{"_id": "t 116"}] and returns [{value:1,text: "t 115"},{value:2,text: "t 116"}]
		return _.map(templateOptionsArr, function(el,index){ return {"value":index+1,"text":el._id}; });
	}	
});


