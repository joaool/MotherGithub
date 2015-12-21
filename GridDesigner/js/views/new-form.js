define(function(require){
	'use strict';

	var NewFormTemplate = require("text!templates/form-container.html");

	var View = Backbone.View.extend({
		initialize: function(options){
			// this.model = new FormModel({"id":options.id});
		},
		render : function() {
			this.$el.html(Handlebars.compile(NewFormTemplate)());
		}
	});
	return View;
});