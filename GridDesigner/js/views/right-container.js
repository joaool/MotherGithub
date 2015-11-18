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
		editTable: function(id){
			var table = this.tables.get(id);
			this.setNewTableView();
			this.newTable.setTableData(table.toJSON());
		},
		onTableCloseClick: function(){
			this.$el.html("");
		},
		onTableCreated: function(newTable){
			if (!newTable.get("id")){
				newTable.set({
					"id": ++this.tableId
				});
				this.tables.add(newTable);
				this.trigger("NEW_TABLE_CREATED",newTable.toJSON());
			}
			else{
				var table = this.tables.get(newTable.get("id"));
				table.set(newTable.toJSON());
				this.trigger("TABLE_UPDATED",table.toJSON());
			}
			this.$el.html("");
		},
	});
	return View;
});