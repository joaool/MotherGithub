define(function(require){
	'use strict';
	var Form = require("models/form");

	var Collection = Backbone.Collection.extend({
		initialize: function(){
			
		},
		model : Form,
	});
	return Collection;
});