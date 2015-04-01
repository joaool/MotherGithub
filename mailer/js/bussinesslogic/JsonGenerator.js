 function JsonGenerator(){

}

JsonGenerator.prototype = {
	
	GenerateJson : function(modelData){
		if (!modelData.ids || !modelData.models)
			return null;
		var lstModels = modelData.models;
		var ids = modelData.ids;
		var jsonOutput = {};
		var templateItems = {};
		var headerItems = [];
		var bodyItems = [];
		var footerItems = [];
		$.each(ids.header,function(i,item){
			headerItems.push(lstModels[item].toJSON()); 
		});
		$.each(ids.body,function(i,item){
			bodyItems.push(lstModels[item].toJSON()); 
		});
		$.each(ids.footer,function(i,item){
			footerItems.push(lstModels[item].toJSON()); 
		});
		templateItems.header = headerItems;
		templateItems.body = bodyItems;
		templateItems.footer = footerItems;
		jsonOutput.templateItems = templateItems;
		jsonOutput.pageStyles = modelData.pageStyles;
		console.log(jsonOutput);
		//console.log(JSON.stringify(jsonOutput));
		return jsonOutput;
	}
}