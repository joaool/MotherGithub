define(function(require){
	'use strict';

	var FieldModel = require("models/field");
	var FieldTemplate = require("text!templates/new-field.html");
	
	var View = Backbone.View.extend({
		initialize: function(options){
			this.model = new FieldModel(options);
		},
		events: {
			"keyup #fieldName" : "onFieldNameUpdate",
			"resizestop" : "onFieldResized",
			"click .delete-field" : "onDeleteClick"  
		},
		onFieldNameUpdate: function(){
			this.model.set("fieldName",this.$el.find("#fieldName[data-id='"+this.model.get("id")+"']").val());
		},
		onFieldResized: function(evt){
			this.model.set("width",$(evt.currentTarget).width());
		},
		onDeleteClick: function(evt){
			this.trigger("DELETE_FIELD",this.model.toJSON());	
		},
		getModel : function(){
			return this.model;
		},
		setModel : function(model){
			this.model = model;
		},
		setFieldData: function(data){
			this.model.clear();
			this.model.set(data);
		},
		render: function(){
			var fieldTemplate = Handlebars.compile(FieldTemplate)(this.model.toJSON());
			this.$el.append(fieldTemplate);
			this.setElement($("#field-"+this.model.get("id")));
		},
		show: function(){
			this.$el.show();
		},
		hide: function(){
			this.$el.hide();
		},
	});
	View.attachResizeEvent = function(){
		$('#fieldsContainer').sortable({
	        scroll: true,
	        placeholder: 'placeholder',
	        containment: 'parent'
	    });
	    $('#fieldsContainer').disableSelection();
	    $('.resizable').resizable({
	        handles: 'e'
	    });
	    $(".ui-resizable-handle").html("<i class=\"fa fa-fw fa-arrows-h\"></i>");
	}
	return View;
});