define(function(require){
	'use strict';

	var Field = require("views/new-field");
	var NewTableTemplate = require("text!templates/new-table.html");
	var FieldTemplate = require("text!templates/new-field.html");
	var TableModel = require("models/table");
	var DBUtil = require("db-util");

	var View = Backbone.View.extend({
		initialize: function(options){
			this.model = new TableModel({"id":options.id});
			this.fieldId = 0;
			this.fieldViews = [];
		},
		events: {
			"click #newField" : "onNewFieldBtnClick",
			"click #saveTable" : "onSaveTableClick",
			"click #cancelTable" : "onCancelTableClick"
		},
		clearModel: function(){
			this.model.clear();
		},
		render: function(){
			this.$el.html(Handlebars.compile(NewTableTemplate)(this.model.toJSON()));
			if (this.model.get("fields")){
				_.each(this.model.get("fields").models,(function(field){
					this.addField(field.toJSON());
				}).bind(this));
			}
		},
		show: function(){
			this.$el.show();
		},
		hide: function(){
			this.$el.hide();
		},
		onSaveTableClick: function(){
			var self = this;
			var tableName = this.$el.find("#tableName").val();
			var fields = this.$el.find(".resizable").toArray().map(function(field){
				var fieldId = $(field).data("id");
				return self.fieldViews[fieldId].getModel(); 
			});
			this.model.set({
				"tableName" : tableName,
				"description" : "Description for "+tableName
			});
			this.model.setFields(fields);

			if (!this.model.get("id")) {
				this.model = DBUtil.addEntity(this.model.toJSON());
			}
			else {
				DBUtil.updateEntity(this.model.toJSON());
			}
			DBUtil.saveToDb(this.model.get("id"),function(newECN){
				var oldModel = self.model.toJSON();
				self.model.set("id",newECN);
				self.trigger("TABLE_SAVED",self.model.toJSON());
				self.model.clear();
			});
		},
		onCancelTableClick: function(){
			this.trigger("CLOSE_NEW_TABLE");
			this.model.clear();
		},
		onNewFieldBtnClick: function(){
			var fieldData = {
				id : this.fieldId++,
				fieldName : "field name",
				description : "description for field",
				label : "label for field",
				inputType : "text",
				isNew : true
			};
			this.addField(fieldData);
		},
		addField: function(fieldData){
			var field = new Field({"el" : "#fieldsContainer"});
			field.setFieldData(fieldData);
			field.render();
			this.listenTo(field,"DELETE_FIELD",this.deleteField);
			this.fieldViews[fieldData.id] = field;
			Field.attachResizeEvent();
		},
		deleteField: function(fieldModel){
			if (!this.model.get("isNew") && !fieldModel.isNew) {
				DBUtil.removeField(this.model.toJSON(),fieldModel);
			}
			$("#field-"+fieldModel.id).remove();
		},
		setTableData: function(tableData){
			this.model.clear();
			this.model.set(tableData);
		},
		updateUI: function(){
			this.$el.find("#tableName").val(this.model.get("tableName"));
			this.$el.find("#fieldsContainer").html("");
			if (this.model.get("fields")){
				_.each(this.model.get("fields").models,(function(field){
					this.addField(field.toJSON());
				}).bind(this));
			}
		}
	});
	return View;
});