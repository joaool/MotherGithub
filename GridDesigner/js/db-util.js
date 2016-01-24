define(function(require){
	'use strict';
	var Tables = require("collections/tables");
	var Table = require("models/table");
	var Fields = require("collections/fields");
	var Field = require("models/field");

	var DBUtil = function(){

	};
	DBUtil.getEntity = function(id){
		return FL.dd.t.entities[id];
	}
	DBUtil.generateTableDataFromGridData = function(entity,grid){
		var table = new Table();
		table.id = entity.fCN;
		var fields = new Fields();
		var entity = entity;
		$.each(grid.fields,function(i,field){
			var fieldData = FL.dd.t.entities[entity.csingular].fields[field.fCN];
			if (fieldData){
				fieldData.fCN = field.fCN;
				fieldData.width = field.width;
				var field = DBUtil.convertFieldToGridField(fieldData);
				fields.add(field);
			}
		});
		return DBUtil.convertEntityToTable(entity,fields);
	}
	DBUtil.generateTablesFromEntities = function(entities){
		var tables = new Tables();
		$.each(entities,function(index,entity){
			tables.add(DBUtil.generateTableFromEntity(entity));
		});
		return tables;
	}

	DBUtil.generateTableFromEntity = function(entity){
		var fields = new Fields();
		$.each(FL.dd.t.entities[entity.csingular].fieldList(),function(index,fieldData){
			var field = DBUtil.convertFieldToGridField(fieldData);
			if (field) {
				fields.add(field);
			}
		});
		return DBUtil.convertEntityToTable(entity,fields);
	}

	DBUtil.convertEntityToTable = function(entity,fields){
		return new Table({
			"id" : entity.csingular,
			"tableName" : entity.singular,
			"description" : entity.description,
			"fields" :fields || new Fields()
		});
	}
	
	DBUtil.convertFieldToGridField = function(fieldData){
		return new Field({
			"id" : fieldData.fCN,
			"fieldName" : fieldData.name,
			"width" : fieldData.width || 150,
			"label": fieldData.label || "label" ,
			"inputType" : fieldData.inputType || "text",
			"typeUI" : fieldData.typeUI || "text",
			"userType" : fieldData.typeUI || "text",
			"description" : fieldData.description
		});
	}

	DBUtil.saveToDb = function(tableId,callback) {
		var promise = FL.dd.t.entities[tableId].save();
        promise.done(function (eCN) {
            var entityName = FL.dd.getEntityByCName(eCN);
            FL.dd.t.entities.dumpToConsole();
            alert("entity saved");
            if (callback)
            	callback(eCN);
        });
        promise.fail(function (err) {
            alert(err);
            alert("save error");
        });
	}

	DBUtil.removeField = function(table,field){
		FL.dd.t.entities[table.id].removeField(field.fieldName);
	}

	DBUtil.addField = function(table,field) {
		var fCN = FL.dd.t.entities[table.id]
            .addField(field.fieldName,
                field.description,
                field.label, 
                field.inputType);
        var fieldData =  FL.dd.t.entities[table.id].fields[fCN];
        fieldData.fCN = fCN;
        return DBUtil.convertFieldToGridField(fieldData);
	};

	DBUtil.updateField = function(table,fieldData){
		FL.dd.t.entities[table.id].fields[fieldData.id].set({
            description: fieldData.description,
            label: fieldData.label,
            name: fieldData.fieldName,
            typeUI: fieldData.typeUI
        });
	}

	DBUtil.addEntity = function(table) {
		var eCN = FL.dd.t.entities.add(table.tableName,table.description);
		var entity = FL.dd.t.entities[eCN];
		table.id = eCN;
		$.each(table.fields.models,function(i,field){
        	DBUtil.addField(table,field.toJSON());
        });
		return DBUtil.convertEntityToTable(entity,table.fields);
	}

	DBUtil.updateEntity = function(table){
		var ret = FL.dd.t.entities[table.id].set({
            name: table.tableName
        });
        table.id = FL.dd.t.entities.getCName(table.tableName);
        $.each(table.fields.models,function(i,field){
        	if (FL.dd.t.entities[table.id].fields[field.get("id")]) {
        		DBUtil.updateField(table,field.toJSON());
        	}
        	else {
	        	DBUtil.addField(table,field.toJSON());
        	}
        });
        var entity = FL.dd.t.entities[table.id];
        return DBUtil.generateTableFromEntity(entity);
	}
	return DBUtil;
});