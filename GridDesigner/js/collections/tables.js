define(function(require){
	'use strict';
	var Table = require("models/table");
	var Fields = require("collections/fields");
	var Field = require("models/field");

	var Collection = Backbone.Collection.extend({
		model : Table,
		initialize: function(){
			
		}
	});
	return Collection;
});