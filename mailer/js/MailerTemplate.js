var mainView;
var designView
$(document).ready(function(){
	$("#templates").load("HBTemplate.html",OnTemplatesLoaded);
});

function OnTemplatesLoaded()
{
	$("#sidebar-wrapper,#page-content-wrapper").css({"height":window.innerHeight});
	mainView = new MailerTemplate.Views.MainView({el : "#wrapper"});
	$('#sidebar-wrapper ul:first li label').click(function(){
		if($(this).text().trim() === "Content"){
			$('#templateDesign').css("display","none");
			$('#templateItems').css("display","block");
		}else{
			$('#templateItems').css("display","none");
			$('#templateDesign').css("display","block");
		}
	});
	$('#templateDesign').css("display","none");
}

Array.prototype.remove = function() {
	var what, a = arguments, L = a.length, ax;
	while (L && this.length) {
		what = a[--L];
		while ((ax = this.indexOf(what)) !== -1) {
			this.splice(ax, 1);
		}
	}
	return this;
};