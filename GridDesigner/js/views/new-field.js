define(function(require){
	'use strict';

	var FieldModel = require("models/field");

	var View = Backbone.View.extend({
		initialize: function(){
			this.model = new FieldModel();
		},
		events: {
			"keyup #fieldName" : "onFieldNameUpdate"	
		},
		onFieldNameUpdate: function(){
			this.model.set("fieldName",this.$el.find("#fieldName").val());
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