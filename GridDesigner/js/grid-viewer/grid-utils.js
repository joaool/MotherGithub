define(function(require){
	'use strict';
	
	var GridUtils = function(){

	};
	GridUtils.getEntity = function(id){
		return FL.dd.t.entities[id];
	}
	GridUtils.generateGridViewerData = function(entity, gridData) {
		var columns = [];
		columns.push({
	        name: "select-column",
	        cell: "select-row",
	        headerCell: "select-all",
	        nesting: [],
            width: "*",
            resizeable: false,
            orderable: false
	    });
		$.each(gridData.fields,function(i,field){
			var fieldData = FL.dd.t.entities[entity.csingular].fields[field.fCN];
			columns.push({
				"name": fieldData.label,
		        "cell": fieldData.inputType,
		        "filterType": fieldData.inputType,
		        "width": field.width,
		        "orderable": true,
		        "fieldData" : fieldData,
		        resizeable: true,
	    	});
		});
		return columns;
	}

	return GridUtils;
});