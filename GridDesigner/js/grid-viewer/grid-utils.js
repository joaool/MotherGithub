define(function(require){
	'use strict';
	
	var GridUtils = function(){

	};
	GridUtils.getEntity = function(id){
		return FL.dd.t.entities[id];
	}
	GridUtils.getUserTypes = function(){
		return FL.dd.arrOfUserTypesForDropdown();
	}
	GridUtils.generateGridViewerData = function(entity, gridData) {
		var columns = [];
		columns.push({
	        name: "select-column",
	        cell: "select-row",
	        headerCell: "select-all",
	        nesting: [],
            width: 20,
            resizeable: false,
            orderable: false
	    });
		$.each(gridData.fields,function(i,field){
			var fieldData = FL.dd.t.entities[entity.csingular].fields[field.fCN];
			if (fieldData){
				fieldData.width = field.width;
				fieldData.fCN = field.fCN;
				columns.push(GridUtils.generateGridViewerColumn(fieldData));
			}
		});
		return columns;
	}
	GridUtils.saveToDb = function(tableId,callback) {
		var promise = FL.dd.t.entities[tableId].save();
        promise.done(function (eCN) {
            var entityName = FL.dd.getEntityByCName(eCN);
            FL.dd.t.entities.dumpToConsole();
            alert("Changes saved to DB");
            if (callback)
            	callback(eCN);
        });
        promise.fail(function (err) {
            alert(err);
            alert("save error");
        });
	}
	GridUtils.generateGridViewerColumn = function(fieldData){
		return {
			"name": fieldData.label,
	        "cell": fieldData.inputType,
	        "filterType": fieldData.inputType,
	        "width": fieldData.width || "*",
	        orderable: true,
	        resizeable: true,
	        "fieldData" : fieldData
    	}
	}
	GridUtils.removeField = function(entity,field){
		FL.dd.t.entities[entity.csingular].removeField(field.name);
	}
	GridUtils.addField = function(entity,field) {
		var fCN = FL.dd.t.entities[entity.csingular]
            .addField(field.fieldName,
                field.fieldDescription,
                field.fieldLabel, 
                field.userType);
        var fieldData =  FL.dd.t.entities[entity.csingular].fields[fCN];
        fieldData.fCN = fCN;
        return fieldData;
	};

	GridUtils.updateField = function(entity,fieldData){
		FL.dd.t.entities[entity.csingular].fields[fieldData.id].set({
            description: fieldData.description,
            label: fieldData.label,
            name: fieldData.fieldName,
            typeUI: fieldData.typeUI
        });
	}
	return GridUtils;
});