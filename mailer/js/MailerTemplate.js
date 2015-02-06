var mainView;
var designView
$(document).ready(function(){
	$("#templates").load("HBTemplate.html",OnTemplatesLoaded);
});

function OnTemplatesLoaded(){
	// alert("entry point !!!");
	var promise=FL.API.getFLContextFromBrowserLocationBar();
	promise.done(function(data){
		console.log("MailerTemplate.js OnTemplatesLoaded ->getFLContextFromBrowserLocationBar SUCCESS <<<<< ");
		var loadAppPromise=FL.API.loadAppDataForSignInUser2();//gets data dictionary + main menu + style + fontFamily + home page
		loadAppPromise.done(function(menuData,homeHTML){
			console.log("appSetup ---> homeHTML=" + homeHTML);
			console.log("appSetup ---> menudata=" + JSON.stringify(menuData));
			var templatePromise=FL.API.createTemplates_ifNotExisting();
			templatePromise.done(function(){
				instantiateMainView();
				return;
			});
			templatePromise.fail(function(err){
				alert("MailerTemplate.js after getFLContextFromBrowserLocationBar ->FAILURE with createTemplates_ifNotExisting err="+err);
				return;
			});
		});
		loadAppPromise.fail(function(err){
			alert("MailerTemplate.js OnTemplatesLoaded  --> loginAccess appSetup FAILURE in loadAppDataForSignInUser2 <<<<< error="+err);
			// return loginAccessCB(err,loginObject);
			return def.reject("MailerTemplate.js OnTemplatesLoaded  --> loginAccess appSetup FAILURE in loadAppDataForSignInUser2 <<<<< error="+err);
		});
	});
	promise.fail(function(err){alert("MailerTemplate.js OnTemplatesLoaded  getFLContextFromBrowserLocationBar FAILURE <<<<<"+err);return;});

	
}
function instantiateMainView(){
	//--------------- Kartik code -----------------------------------------------
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
	//--------------------------------------------------------------------
}
window.onbeforeunload = function (e) {//works for close tab - and for close browser because:
	e = e || window.event;
	if (e) {
		console.log("xxx disconnect here");
		// FL.server.disconnect();
		e.returnValue = 'test returnValue...';
	}
	return 'You are exiting FrameLink newsletterpage editor...';
};


