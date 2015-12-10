define(function(require){
	'use strict';
	var Tables = require("collections/tables");
	var Table = require("models/table");
	var Fields = require("collections/fields");
	var Field = require("models/field");

	var DBUtil = function(){

	};

	DBUtil.prototype.generateTablesFromEntities = function(entities){
		var tables = new Tables();
		$.each(entities,function(index,entity){
			var fields = new Fields();
			$.each(FL.dd.t.entities[entity.csingular].fieldList(),function(index,f){
				var field = new Field({
					"id" : f.fCN,
					"fieldName" : f.name,
					"width" : f.width || 150
				});
				fields.add(field);
			});
			var table = new Table({
				"id" : entity.csingular,
				"tableName" : entity.singular,
				"fields" : fields
			});
			tables.add(table);
		});
		return tables;
	}

	DBUtil.prototype.saveToDb = function(tables) {

	}

	DBUtil.removeField = function(table,field){

	}

	DBUtil.addField = function(table,field) {
		
	};

	DBUtil.updateField = function(table,field){

	}

	DBUtil.updateTable = function(table){
		
	}
	return DBUtil;
});