define(function(require){
	'use strict';

	var NewField = require("views/new-field");
	var NewFieldTemplate = require("text!templates/new-field.html");
	
	var View = Backbone.View.extend({
		initialize: function(){
			this.fields = [];
			this.fieldsId = 0;
		},
		events: {
			"click #newField" : "onNewFieldBtnClick"
		},
		onNewFieldBtnClick: function(){
			var id = ++this.fieldsId;
			var fieldTemplate = Handlebars.compile(NewFieldTemplate)({"id":id});
			this.$el.find("#fieldsContainer").append(fieldTemplate);
			var field = new NewField({"el" : "#field-"+id});
			this.fields.push(field);
			NewField.attachResizeEvent();
		}
	});
	return View;
});