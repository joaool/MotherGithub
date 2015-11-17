define(function(require){
	'use strict';

	var NewTable = require("views/new-table");
	var NewTableTemplate = require("text!templates/new-table.html");
	var Tables = require("collections/tables");

	var View = Backbone.View.extend({
		initialize: function(){
			this.tables = new Tables();
			this.tableId = 0;
		},
		events: {
			
		},
		setNewTableView: function(){
			this.$el.html(NewTableTemplate);
			if (this.newTable)
				delete this.newTable;
			this.newTable = new NewTable({"el" : "#newTableTemplate"});
			this.listenTo(this.newTable,"NEW_TABLE_CREATED",this.onTableCreated);
			this.listenTo(this.newTable,"CLOSE_NEW_TABLE",this.onTableCloseClick);
		},
		setEditTableView: function(id){
			var table = this.tables.get(id);
			this.$el.html("Table "+table.get("tableName")+" Clicked.");
		},
		onTableCloseClick: function(){
			this.$el.html("");
		},
		onTableCreated: function(table){
			table.set({
				"id": ++this.tableId
			});
			this.tables.add(table);
			this.trigger("NEW_TABLE_CREATED",table.toJSON());
			this.$el.html("");
		}
	});
	return View;
});