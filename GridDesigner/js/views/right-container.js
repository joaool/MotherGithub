define(function(require){
	'use strict';

	var NewTable = require("views/new-table");
	var Tables = require("collections/tables");

	var View = Backbone.View.extend({
		initialize: function(){
			this.tables = new Tables();
			this.tableId = 0;

			this.newTable = new NewTable({"el" : "#newTableContainer"});
			this.listenTo(this.newTable,"NEW_TABLE_CREATED",this.onTableCreated);
			this.listenTo(this.newTable,"CLOSE_NEW_TABLE",this.onTableCloseClick);
		},
		setNewTableView: function(){
			this.newTable.render();
			this.newTable.show();
		},
		editTable: function(id){
			var table = this.tables.get(id);
			this.newTable.setTableData(table.toJSON());
			this.setNewTableView();
		},
		onTableCloseClick: function(){
			this.newTable.hide();
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
			this.newTable.hide();
		},
	});
	return View;
});