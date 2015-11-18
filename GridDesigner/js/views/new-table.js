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
				"fields" : new Fields(fields)
			});
			this.trigger("NEW_TABLE_CREATED",this.model);
		},
		onCancelTableClick: function(){
			this.trigger("CLOSE_NEW_TABLE");
		},
		onNewFieldBtnClick: function(){
			var id = ++this.fieldsId;
			var fieldData = {
				"id" : id
			};
			this.addField(fieldData);
		},
		addField: function(fieldData){
			var fieldTemplate = Handlebars.compile(FieldTemplate)(fieldData);
			this.$el.find("#fieldsContainer").append(fieldTemplate);
			var field = new Field(_.extend({},fieldData,{"el" : "#field-"+fieldData.id}));
			this.listenTo(field,"DELETE_FIELD",this.deleteField);
			this.fields.add(field.getModel());
			Field.attachResizeEvent();
		},
		deleteField: function(fieldId){
			this.fields.remove(fieldId);
			$("#field-"+fieldId).remove();
		},
		setTableData: function(tableData){
			this.model.clear();
			this.model.set(tableData);
			this.updateUI();
			this.fieldsId = _.max(_.pluck(this.model.get("fields").models,"id"));
		},
		updateUI: function(){
			this.$el.find("#tableName").val(this.model.get("tableName"));
			if (this.model.get("fields")){
				_.each(this.model.get("fields").models,(function(field){
					this.addField(field.attributes);
				}).bind(this));
			}
		}
	});
	return View;
});