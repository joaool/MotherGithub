define(function(require){
	'use strict';
	var Field = require("models/field");

	var Collection = Backbone.Collection.extend({
		initialize: function(){
			
		},
		model : Field,
	});
	return Collection;
});