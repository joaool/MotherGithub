define(function(require){
	'use strict';

	var View = Backbone.View.extend({
		initialize: function(){
			
		},
		events: {
			
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