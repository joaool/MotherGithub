define(function(require){
	'use strict';

	var Field = require("views/new-field");
	var Fields = require("collections/fields");
	var NewTableTemplate = require("text!templates/new-table.html");
	var FieldTemplate = require("text!templates/new-field.html");
	var TableModel = require("models/table");
	var DBUtil = require("db-util");

	var View = Backbone.View.extend({
		initialize: function(options){
			this.fields = new Fields();
			this.model = new TableModel({"id":options.id});
		},
		events: {
			"click #newField" : "onNewFieldBtnClick",
			"click #saveTable" : "onSaveTableClick",
			"click #cancelTable" : "onCancelTableClick"
		},
		render: function(){
			this.$el.html(Handlebars.compile(NewTableTemplate)(this.model.toJSON()));
			
			if (this.model.get("fields")){
				_.each(this.model.get("fields").models,(function(field){
					this.addField(field);
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
				return self.fields.get(fieldId); 
			});
			
			this.model.set({
				"tableName" : tableName,
				"description" : "Description for "+tableName,
				"fields" : new Fields(fields)
			});
			DBUtil.updateEntity(this.model.toJSON());
			
			DBUtil.saveToDb(this.model.get("id"),function(newECN){
				var oldModel = self.model.toJSON();
				self.model.set("id",newECN);
				self.trigger("NEW_TABLE_CREATED",{
					oldModel: oldModel,
					newModel : self.model.toJSON()
				});
			});
		},
		onCancelTableClick: function(){
			this.trigger("CLOSE_NEW_TABLE");
		},
		onNewFieldBtnClick: function(){
			var fieldData = {
				fieldName : "field name",
				description : "description for field",
				label : "label for field",
				inputType : "text"
			};
			var field = DBUtil.addField(this.model.toJSON(),fieldData);
			this.addField(field);
		},
		addField: function(fieldModel){
			var field = new Field({"el" : "#fieldsContainer"});
			field.setModel(fieldModel);
			field.render();
			this.listenTo(field,"DELETE_FIELD",this.deleteField);
			this.fields.add(field.getModel());
			Field.attachResizeEvent();
		},
		deleteField: function(fieldId){
			DBUtil.removeField(this.model.toJSON(),this.fields.get(fieldId));
			this.fields.remove(fieldId);
			$("#field-"+fieldId).remove();
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
					this.addField(field);
				}).bind(this));
			}
		}
	});
	return View;
});