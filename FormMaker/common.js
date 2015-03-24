(function(){
	$(document).ready(function(){
		$("#makeForm").click(function(evt){
			$.getJSON("Sample.json",function(data){
				var formMaker = new FormMaker();
				formMaker.loadJSON(data);
			});
		});
	});
})();