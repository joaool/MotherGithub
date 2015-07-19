"use strict";

var mainView;
var designView;
$(document).ready(function () {
	// alert("MailerTemplate.js entry point");
	$("#templates").load("HBTemplate.html", OnTemplatesLoaded);
});

function OnTemplatesLoaded() {
	// --------------------code to connect to Framelink Database --------------------
	// alert("MailerTemplate.js ->begins connection with FrameLink");
	FL.API.debug = false;
	FL.API.debugFiltersToShow = ["API", "checkServerCall"];
	FL.API.fl.setTraceClient(2);

	var promise = FL.API.getFLContextFromBrowserLocationBar();
	promise.done(function (data) {
		FL.common.printToConsole("MailerTemplate.js OnTemplatesLoaded ->getFLContextFromBrowserLocationBar SUCCESS <<<<< ");
		var loadAppPromise = FL.API.loadAppDataForSignInUser2(); //gets data dictionary + main menu + style + fontFamily + home page
		loadAppPromise.done(function (menuData, homeHTML) {
			FL.common.printToConsole("appSetup ---> homeHTML=" + homeHTML);
			FL.common.printToConsole("appSetup ---> menudata=" + JSON.stringify(menuData));
			var templatePromise = FL.API.createTemplates_ifNotExisting();
			templatePromise.done(function () {
				instantiateMainView(); //Kartik code originally the only code in OnTemplatesLoaded()
				return;
			});
			templatePromise.fail(function (err) {
				alert("MailerTemplate.js after getFLContextFromBrowserLocationBar ->FAILURE with createTemplates_ifNotExisting err=" + err);
				return;
			});
		});
		loadAppPromise.fail(function (err) {
			alert("MailerTemplate.js OnTemplatesLoaded  --> loginAccess appSetup FAILURE in loadAppDataForSignInUser2 <<<<< error=" + err);
			// return loginAccessCB(err,loginObject);
			return def.reject("MailerTemplate.js OnTemplatesLoaded  --> loginAccess appSetup FAILURE in loadAppDataForSignInUser2 <<<<< error=" + err);
		});
	});
	promise.fail(function (err) {
		alert("MailerTemplate.js OnTemplatesLoaded  getFLContextFromBrowserLocationBar FAILURE <<<<<" + err);return;
	});
	// --------------------END OF code to connect to Framelink Database -------------
}
function instantiateMainView() {
	//--------------- Kartik code -----------------------------------------------
	$("#sidebar-wrapper,#page-content-wrapper").css({ "height": window.innerHeight });
	mainView = new MailerTemplate.Views.MainView({ el: "#wrapper" });
	$("#sidebar-wrapper ul:first li label").click(function () {
		if ($(this).text().trim() === "Content") {
			$("#templateDesign").css("display", "none");
			$("#templateItems").css("display", "block");
		} else {
			$("#templateItems").css("display", "none");
			$("#templateDesign").css("display", "block");
		}
	});
	$("#templateDesign").css("display", "none");
	//--------------------------------------------------------------------
}
window.onbeforeunload = function (e) {
	//works for close tab - and for close browser because:
	e = e || window.event;
	if (e) {
		FL.common.printToConsole("xxx disconnect here");
		// FL.server.disconnect();
		e.returnValue = "test returnValue...";
	}
	return "You are exiting FrameLink newsletterpage editor...";
};
Array.prototype.remove = function () {
	var what,
	    a = arguments,
	    L = a.length,
	    ax;
	while (L && this.length) {
		what = a[--L];
		while ((ax = this.indexOf(what)) !== -1) {
			this.splice(ax, 1);
		}
	}
	return this;
};

//# sourceMappingURL=MailerTemplate-compiled.js.map