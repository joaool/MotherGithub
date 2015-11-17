define(function(require){
	'use strict';

	var Field = require("views/new-field");
	var Fields = require("collections/fields");
	var FieldTemplate = require("text!templates/new-field.html");
	var TableModel = require("models/table");

	var View = Backbone.View.extend({
		initialize: function(options){
			this.fields = new Fields();
			this.fieldsId = 0;
			this.model = new TableModel({"id":options.id});
		},
		events: {
			"click #newField" : "onNewFieldBtnClick",
			"click #saveTable" : "onSaveTableClick",
			"click #cancelTable" : "onCancelTableClick"
		},
		onSaveTableClick: function(){
			var self = this;
			var tableName = this.$el.find("#tableName").val();
			var fields = this.$el.find(".resizable").toArray().map(function(field){
				var fieldId = $(field).data("id");
				return self.fields.get(fieldId); 
			});
			this.model.set({
				"tableName" : tableName,
				"fields" : fields
			});
			this.trigger("NEW_TABLE_CREATED",this.model);
		},
		onCancelTableClick: function(){
			this.trigger("CLOSE_NEW_TABLE");
		},
		onNewFieldBtnClick: function(){
			var id = ++this.fieldsId;
			var fieldTemplate = Handlebars.compile(FieldTemplate)({"id":id});
			this.$el.find("#fieldsContainer").append(fieldTemplate);
			var field = new Field({"el" : "#field-"+id});
			this.fields.add(field.getModel());
			Field.attachResizeEvent();
		}
	});
	return View;
});