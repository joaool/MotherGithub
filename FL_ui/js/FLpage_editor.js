// unconnected test http://localhost/pdojo/MotherGithub/page_editor.html?=cs#
var FL = FL || {};
(function() { //App is a name space.
	// http://jhollingworth.github.io/bootstrap-wysihtml5/ -- style change the whole line or nothing
	//		http://rcode5.wordpress.com/2012/11/01/custom-image-upload-modal-with-bootstrap-wysihtml5/
	// https://github.com/akzhan/jwysiwyg#web-site ---
	// http://www.wyzz.info/wysiwyg_page.html
	// http://wymeditor.github.io/wymeditor/dist/examples/01-basic.html
	// http://pietschsoft.com/demo/jHtmlArea/ -
	// http://imperavi.com/redactor/ ++ PAID PRODUCT poor documented  API
	// -->	http://premiumsoftware.net/cleditor/ 
	// http://hackerwins.github.io/summernote/ +++ bootstrap3
	//     http://jsfiddle.net/lesson8/2AeHs/show/
	//     http://bootstrapvalidator.com/examples/summernote/
	// ---> http://mindmup.github.io/bootstrap-wysiwyg/ 5Kb ++
	//		http://www.jsdb.io/view/bootstrap-wysiwyg
	// http://madebymany.github.io/sir-trevor-js/ saves json
	// https://github.com/daviferreira/medium-editor - for blogs - operations not revertible...
	// http://jejacks0n.github.io/mercury/
	// ---> http://www.tinymce.com/develop/develop.php ++++  
	//			http://wiki.servicenow.com/index.php?title=Using_HTML_Fields
	// ---> http://ckeditor.com/demo + supporfts extensions bootstrap button edition ++++++
	//		http://ckeditor.com/addon/ckeditorbootstraputils
	//		http://doksoft.com/soft/ckeditor-bootstrap/ckeditor-bootstrap-button-plugin.html
	// http://www.scriptiny.com/2010/02/javascript-wysiwyg-editor/ - this is tinyEditor -- 
	// http://xing.github.io/wysihtml5/
	// https://www.raptor-editor.com/
	// http://nicedit.com/ ++ can do plugins
	// http://www.aloha-editor.org/ ++
	// http://markitup.jaysalvat.com/home/ not a wysiwyg
	// http://innovastudio.com/BootstrapLiveEditor/index.html image galery no documented API !!!!

	// http://plugins.jquery.com/jquery.bootstrap-form-builder/
	// http://bootsnipp.com/forms?version=3 - form builder
	// http://www.userfox.com/transactional/
	// https://www.klaviyo.com/email-templates

	// https://github.com/hlxwell/mail-engine
	//http://www.invoicera.com/
	$(document).ready(function() {
		var fullUrl = window.location.href;
		if(fullUrl){//gets domain from url string ->http://localhost/pdojo/MotherGithub/test_menu13.html?d=myDomain1#
		// if(false){//gets domain from url string ->http://localhost/pdojo/MotherGithub/test_menu13.html?d=myDomain1#
			//ex. http://www.framelink.co/app?d=myDomain1 Nico's definition
			// isolate with http://localhost/pdojo/MotherGithub/page_editor.html?=cs#page=home
			//this is equivalent to  http://localhost/pdojo/MotherGithub/test_menu13.html?d=myDomain1
			//
			page = FL.common.getTag(fullUrl,"page","#");//FL.domain is globally defined - the last # is disregarded
			var connectionString = FL.common.getTag(fullUrl,"connectionString","#");//FL.domain is globally defined - the last # is disregarded
			var style = FL.common.getTag(fullUrl,"style","#");//FL.domain is globally defined - the last # is disregarded
			var font = FL.common.getTag(fullUrl,"font","#");//FL.domain is globally defined - the last # is disregarded
			$("#pageTitle").empty();
			$("#pageTitle").text("FrameLink - editing " + page +" page");
		
			// FL.server.fa = new FL.server.fl.app();
			// var myApp = JSON.parse(connectionString);
			// FL.server.fl.setTraceClient(2);
			// FL.server.fa.connect(myApp, function(err2, data2){
			// 	if (err2){
			// 		localStorage.connection = null;
			// 		alert('FLpage_editor.js connect: err=' + JSON.stringify(err2));
			// 		return;
			// 	}
			// 	FL.server.offline = false;
			// 	FL.server.restorePage(page, function(err,data){
			// 		if (err){
			// 			alert('FLpage_editor.js FL.server.restorePage after connect: err=' + JSON.stringify(err));
			// 			return;
			// 		}
			// 		alert('FLpage_editor.js FL.server.restorePage after connect: PAGE RESTORED SUCCESSFULLY data=' + JSON.stringify(data));
			// 		var htmlStr = data.d.html;
			// 		// localStorage.connection = JSON.stringify(myApp);
			// 		// var htmlStr="<div class='jumbotron'>" + 
			// 		// 				"<h1>FrameLink Platform</h1>" + 
			// 		// 				"<p>This site has no functionality as it is. <strong>Sign In</strong> as a designer (upper right corner) to transform this site into the backend of your business. No need for email/password initially. Introduce them later on, to continue the design or give access to someone else.</p><p><strong>'Tour'</strong> will give you an idea how to redesign this site into your business information system.</p>" +
			// 		// 				"<p>" + 
			// 		// 					"<a href='#' class='btn btn-primary btn-large' onclick='FL.showTourStep0 = true; FL.tourIn();'>Tour</a>" +
			// 		// 				"</p>" + 
			// 		// 			"</div>";
			// 		editPage(page,htmlStr);
			// 	});
			// 	// return connectServerCB(null);
			// });

			alert("before calling FL.server.restorePageFromConnectionString()");
			FL.server.restorePageFromConnectionString(page,connectionString,function(err,htmlStr){
				if (err){
					alert('FLpage_editor.js FL.server.restorePageFromConnectionString() after ERROR restoring ' + page +' page err=' + JSON.stringify(err));
				}
				// alert("STEP 0");
				editPage(page,htmlStr);
			});
			
			/*
			//Things to do:
			// 1 - I have an error in FL.server.savePage() line 595 fd.update("43", {"query":{"_id":pagNo},"update":{d: htmlContent}}, function(err, data){ is wrong format !!!
			// 2 - I do not know how to connect with connection string only - to substitute FL.server.connect("Joao","oLiVeIrA",function(err){
			FL.server.offline = false;
			FL.server.connect("Joao","oLiVeIrA",function(err){
				console.log("connectServer connection is="+err);
				if(err){
					alert('FL_pageEditor FL.server.connect: ERROR err=' + JSON.stringify(err));
					return ;
				}else{
					alert('FL_pageEditor FL.server.connect: CONNECTED !!!');
					FL.server.savePage(page,"<p>Hello 2 test</>",function(err){//"43" must exist
						if (err){
							alert('FL_pageEditor FL.server.savePage: ERROR err=' + JSON.stringify(err));
							return ;
						}
						alert('FL_pageEditor FL.server.savePage: page was successfully saved !!!');

					});
				}
			});
			*/

		}
		var editPage = function(pageName,htmlStr){
			// alert("continueFunction !!!! code to develop here !!! pageName="+pageName);
			tinymce.init({
				mode : "textareas",
				selector: "textarea",
				// language : "es", 
				theme : "modern",
				menubar:false,
				// theme : "advanced",
				convert_urls : false,
				relative_urls : false,
				height:300,
				plugins:[
					"advlist autolink  link  print preview",
					"searchreplace wordcount visualchars code fullscreen",
					"media save contextmenu",
					"paste textcolor bdesk_photo framelink"
				],
				toolbar: " undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link bdesk_photo  | forecolor backcolor | framelink | print code",
				forced_root_block : "", //all these necessary to prevent injection fo <p> and </p>
				force_br_newlines : true,
				force_p_newlines : false,
				content_css : "./FL_ui/css/FLreadable.css",
				setup : function(ed) {
					ed.on("init",function(ed) {
						tinyMCE.get('my_editor').setContent(htmlStr);
						tinyMCE.execCommand('mceRepaint');
					});
				}
			});
			console.log("-->"+htmlStr);
			// tinymce.activeEditor.setContent(htmlStr);
			// $('#summernote').code(htmlStr);
		};
	});
	exitSaving = function(){
		sHTML = tinyMCE.get('my_editor').getContent();
		// alert("exitSaving page="+page+" sHTML="+sHTML);
		FL.server.savePage(page,sHTML,function(err){//"43" must exist
			if (err){
				alert('FL_pageEditor FL.server.savePage: ERROR err=' + JSON.stringify(err));
				return ;
			}
			// alert('FL_pageEditor FL.server.savePage: page was successfully saved !!!');
			FL.server.disconnect();
		});
		closeWindows();
	};
	exitNoSave = function(){
		// alert("exitNoSave");
		console.log("exitNoSave ");
		// window.close();
		// open(location, '_self').close();
		// window.open('','_self').close();
		FL.server.disconnect();
		closeWindows();
	};
	window.onbeforeunload = function (e) {//works for close tab - and for close browser because:
		// TESTED Chrome 36 -try to close all tabs on by one, so it will fall back in this code. OK
		// TESTED FireFox 31 - try to close all tabs on by one, so it will fall back in this code. OK
		// TESTED IE 11 - try to close all tabs on by one, so it will fall back in this code. OK
		// TESTED Opera 9.80 - NOT WORKING - It is supported only after version 15 (Feb 2013 - In house Presto was phased ouyt in favour of WebKit)
		//TESTED Safari 5.1.7 - try to close all tabs on by one, so it will fall back in this code. OK
		// http://smallbusiness.chron.com/detecting-browser-windows-closing-firefox-49700.html
		//Chrome - detect tab close event ok - disconnect message ok - exiting message ok.
		//Firefox - detect tab close event ok - disconnect message ok - exiting message NOT OK. 
		//IE - detect tab close event ok - disconnect message ok - exiting message ok.
		//Safari - detect tab close event ok - disconnect message ok - exiting message ok.
		//OPERA 9.80 - Not working see comment above
		e = e || window.event;
		if (e) {
			console.log("disconnect here");
			FL.server.disconnect();
			e.returnValue = 'test returnValue...';
		}
		return 'You are exiting FrameLink page editor...';
	};
	console.log(document.title+"......  END..");
})();
