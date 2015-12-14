define(function(require){
	'use strict';

	var NewTable = require("views/new-table");
	var Tables = require("collections/tables");

	var View = Backbone.View.extend({
		initialize: function(){
			this.tables = new Tables();
			
			this.newTable = new NewTable({"el" : "#newTableContainer"});
			this.listenTo(this.newTable,"NEW_TABLE_CREATED",this.onTableCreated);
			this.listenTo(this.newTable,"CLOSE_NEW_TABLE",this.onTableCloseClick);
		},
		setTables: function(tables){
			this.tables = tables;
		},
		setNewTableView: function(){
			this.newTable.render();
			this.newTable.show();
		},
		addTable: function(table){
			this.tables.add(table);
		},
		editTable: function(id){
			var table = this.tables.get(id);
			this.newTable.setTableData(table.toJSON());
			this.setNewTableView();
		},
		onTableCloseClick: function(){
			this.newTable.hide();
		},
		onTableCreated: function(data){
			var table = this.tables.get(data.oldModel.id);
			table.set(data.newModel);
			this.trigger("TABLE_UPDATED",table.toJSON());
			this.newTable.hide();
		},
	});
	return View;
});