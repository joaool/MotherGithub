define(function(require){
	'use strict';

	var NewTable = require("views/new-table");
	var NewTableTemplate = require("text!templates/new-table.html");
	
	var View = Backbone.View.extend({
		initialize: function(){
			
		},
		events: {
			
		},
		setNewTableView: function(){
			this.$el.html(NewTableTemplate);
			if (this.newTable)
				delete this.newTable;
			this.newTable = new NewTable({"el" : "#newTableTemplate"});
		}
	});
	return View;
});