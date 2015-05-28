(function(){
	$(document).ready(function(){
		
		OnTemplatesLoaded = function(){
			console.log("templates loaded");
		}
		$("#templates").load("Template.html",OnTemplatesLoaded);
		
		$("#makeForm").click(function(evt){
			$.getJSON("Sample.json",function(data){
				var formMaker = new FormMaker();
				formMaker.loadJSON(data);
			});
		});
       
	});
})();