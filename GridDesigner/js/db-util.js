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
			$.each(FL.dd.t.entities[50].fieldList(),function(index,field){
				var field = new Field({
					"id" : field.fCN,
					"fieldName" : field.name,
					"width" : field.width || 150
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
	return DBUtil;
});