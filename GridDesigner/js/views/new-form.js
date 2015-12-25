define(function(require){
	'use strict';

	var NewFormTemplate = require("text!templates/form-container.html");
	require("formMaker/js/loadJsFiles");
	var templates = require("text!formMaker/Template.html");
	var DBUtil = require("db-util");

	var View = Backbone.View.extend({
		initialize: function(options){
			// this.model = new FormModel({"id":options.id});
			this.mainView = new FormDesigner.Views.MainView({el : "#formDesignerContainer"});
		},
		events: {
			
		},
		render : function() {
			this.$el.html(Handlebars.compile(NewFormTemplate)());
			$("#templates").html(templates);
			
		},
		loadJson: function(){
			this.mainView.loadJson("../FormMaker/Sample.json");
		},
		setEntity: function(entity){
			this.mainView.setEntity(entity);
			this.loadJson();
		},
		hideEntityList: function(){
			this.mainView.hideEntityList();
		}
	});
	return View;
});