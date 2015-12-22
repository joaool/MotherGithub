define(function(require){
	'use strict';

	var NewFormTemplate = require("text!templates/form-container.html");
	require("formMaker/js/loadJsFiles");

	var View = Backbone.View.extend({
		initialize: function(options){
			// this.model = new FormModel({"id":options.id});
			this.mainView = new FormDesigner.Views.MainView({el : "#formDesignerContainer"});
		},
		render : function() {
			this.$el.html(Handlebars.compile(NewFormTemplate)());
			this.loadJson();
		},
		loadJson: function(){
			this.mainView.loadJson();
		}
	});
	return View;
});