define(function(require){
	'use strict';

	var NewFormTemplate = require("text!templates/form-container.html");
	require("formMaker/js/loadJsFiles");
	var templates = require("text!formMaker/Template.html");
	var View = Backbone.View.extend({
		initialize: function(options){
			// this.model = new FormModel({"id":options.id});
			this.mainView = new FormDesigner.Views.MainView({el : "#formDesignerContainer"});
			$("#templates").html(templates);
		},
		render : function() {
			this.$el.html(Handlebars.compile(NewFormTemplate)());
			this.loadJson();
		},
		loadJson: function(){
			//this.mainView.loadJson("../FormMaker/Sample.json");
		},
		setEntity: function(){
			
		}
	});
	return View;
});