define(function(require){
	'use strict';
	var Table = require("models/table");

	var Collection = Backbone.Collection.extend({
		initialize: function(){
			
		},
		model : Table,
	});
	return Collection;
});