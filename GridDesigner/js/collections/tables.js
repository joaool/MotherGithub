define(function(require){
	'use strict';
	var Table = require("models/table");
	var Fields = require("collections/fields");
	var Field = require("models/field");

	var Collection = Backbone.Collection.extend({
		model : Table,
		initialize: function(){
			
		},
		generateTablesFromEntities : function(entities){
			var self = this;
			$.each(entities,function(index,entity){
				var fields = new Fields();
				$.each(FL.dd.t.entities[50].fieldList(),function(index,field){
					var field = new Field({
						"id" : field.fCN,
						"fieldName" : field.name,
						"width" : field.width || 100
					});
					fields.add(field);
				});
				var table = new Table({
					"id" : entity.csingular,
					"tableName" : entity.singular,
					"fields" : fields
				});
				self.add(table);
			});
		}
	});
	return Collection;
});