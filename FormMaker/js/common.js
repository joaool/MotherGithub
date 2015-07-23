(function(){
	$(document).ready(function(){
		if (window.opener != null){
            $("#makeForm").hide();
        }
		OnTemplatesLoaded = function(){
			console.log("templates loaded");
            if (window.opener != null){
                var formData = window.opener.formData;
                     
                $.getJSON("defaultjson.json",function(data){
                    formMaker.loadValues(data);
                    formMaker.loadJSON(formData);  
                });
             }
		}
		$("#templates").load("Template.html",OnTemplatesLoaded);
        
        var formMaker = new FormMaker({el : "body"});
		
		$("#makeForm").click(function(evt){
			$.getJSON("Sample.json",function(data){
				formMaker.loadJSON(data);
			});
		});

        Handlebars.registerHelper('arrayToString', function(array, options) {
            if (array && typeof array == "object" && array.length >0){
                return array.toString();
            }
            return array;
        });
	});
})();