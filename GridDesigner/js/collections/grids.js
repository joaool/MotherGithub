define(function(require){
	'use strict';
	var Grid = require("models/grid");

	var Collection = Backbone.Collection.extend({
		initialize: function(){
			
		},
		model : Grid,
	});
	return Collection;
});