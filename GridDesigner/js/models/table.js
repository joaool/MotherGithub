define(function(require){
	'use strict';
	var Fields = require("collections/fields");

	var Model = Backbone.Model.extend({
		initialize: function(){
			if (!this.get("fields")){
				this.set("fields",new Fields());
			}
		},
		addField: function(fieldModel){
			if (this.get("fields"))
				this.get("fields").add(fieldModel);
			else
				this.setFields(fieldModel);
		},
		setFields : function(fields){
			this.set("fields",new Fields(fields));
		},
		getField: function(fieldId) {
			return this.get("fields").get(fieldId);	
		}
	});
	return Model;
});