define(function(require){
	'use strict';

	var FieldModel = require("models/field");

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
			this.model.set("fieldName",this.$el.find("#fieldName").val());
		},
		onFieldResized: function(evt){
			this.model.set("width",$(evt.currentTarget).width());
		},
		onDeleteClick: function(evt){
			this.trigger("DELETE_FIELD",$(evt.currentTarget).data("id"));	
		},
		getModel : function(){
			return this.model;
		}
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