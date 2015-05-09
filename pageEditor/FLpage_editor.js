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
		// alert("inside FLpage_editor");
		var fullUrl = window.location.href;
		var API_key = null;
		// alert(fullUrl);
		if(fullUrl){//gets domain from url string ->http://localhost/pdojo/MotherGithub/test_menu13.html?d=myDomain1#
			page = FL.common.getTag(fullUrl,"page","#");//FL.domain is globally defined - the last # is disregarded
			var style = FL.common.getTag(fullUrl,"style","#");//FL.domain is globally defined - the last # is disregarded
			var font = FL.common.getTag(fullUrl,"font","#");//FL.domain is globally defined - the last # is disregarded
			FL.common.setStyleAndFont(style,font);			//Now we will restore the style and font
			
			API_key = FL.common.getTag(fullUrl,"API_key","#");//FL.domain is globally defined - the last # is disregarded
			
			var loginObject = JSON.parse( FL.common.enc(API_key,-1) );//to remove...only for FL.common.printToConsole
			
			FL.API.debug = false;
			FL.API.debugFiltersToShow = ["xAPI","login","peditor","dd"];//note that "dump" is a reserved word for FL.dd.displayEntities()
			FL.API.fl.setTraceClient(2);

			FL.common.printToConsole("FLpage_editor.js fullUrl="+fullUrl,"peditor");
			FL.common.printToConsole("FLpage_editor.js ** login="+JSON.stringify(loginObject),"peditor");//to remove...
			FL.common.printToConsole("FLpage_editor.js style="+style,"peditor");
			FL.common.printToConsole("FLpage_editor.js font="+font,"peditor");
			
			var fl = new flMain();//only place where this must exist !!!!
			FL.fl = fl; //new flMain();
			fl.serverName(FL.common.getServerName());
		}else{
			alert("inside FLpage_editor - ERROR fullUrl is empty");
		}
		var loadDefaultAppPromise = FL.API.loadDefaultAppByAPI_Key(API_key)
			.then(function(menuData,homeHTML){
				var templateHTML = $('#pageEditorTemplate').html();
				FL.domInject("_placeHolder",templateHTML );
				//-------- Replace headers
				$("#pageTitle").empty();
				$("#pageTitle").text("FrameLink - editing " + page +" page");
				// --------
				editPage("home",homeHTML);
			},function(err){
				alert("FLpage_editor -> ERROR ->"+err.code+" - "+err.message);
				return;
			});

		/* working code - replaced because of new method FL.API.loadDefaultApp(loginObject)
		FL.API.connectUserToDefaultApp(loginObject.email,loginObject.password)
		.then(function(){
				FL.common.printToConsole("FLpage_editor -> success connecting to default app - Now we extract application data");
				var loadAppPromise=FL.API.loadAppDataForSignInUser2();//gets data dictionary + main menu + style + fontFamily + home page
				loadAppPromise.done(function(menuData,homeHTML){
					FL.common.printToConsole("appSetup ---> homeHTML=" + homeHTML);
					// FL.common.printToConsole("appSetup --------------------------------------------->first menu=" + menuData.oMenu.menu[0].title);
					// $('#pageEditorTemplate');
					var templateHTML = $('#pageEditorTemplate').html();
					FL.domInject("_placeHolder",templateHTML );
					//-------- Replace headers
					$("#pageTitle").empty();
					$("#pageTitle").text("FrameLink - editing " + page +" page");
					// --------
					editPage("home",homeHTML);
				});
				loadAppPromise.fail(function(err){
					alert("FLpage_editor ->  --> after successfull connectUserToDefaultApp FAILURE in loadAppDataForSignInUser2 <<<<< error="+err);
				});
			},function(err){
				FL.common.printToConsole("FLpage_editor -> failure connecting to default app  err="+err);
			});
		*/

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
				height:400,
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
				content_css : "./FL_ui/css/FL" + style + ".css",
				setup : function(ed) {
					ed.on("init",function(ed) {
						tinyMCE.get('my_editor').setContent(htmlStr);
						tinyMCE.execCommand('mceRepaint');
					});
				}
			});
			FL.common.printToConsole("-->"+htmlStr);
		};
	});
	exitSaving = function(){
		sHTML = tinyMCE.get('my_editor').getContent();
		FL.API.saveHomePage(sHTML)
		.then(function(){
					FL.common.printToConsole("FLpage_editor ->saved ok!");
					FL.API.disconnect()
					.then(function(){FL.common.printToConsole("FLpage_editor->after sucessfull saveHomePage --> disconnect ok!");closeWindows();return;} 
						,function(err){FL.common.printToConsole("FLpage_editor->after sucessfull saveHomePage -->failure on disconnect err ="+err);return;}
					);
				}
			,function(err){FL.common.printToConsole("FLpage_editor -> failure saving page err="+err);FL.API.disconnect();});
	};
	exitNoSave = function(){
		// alert("exitNoSave");
		FL.common.printToConsole("exitNoSave ");
		FL.API.disconnect()
		.then(function(){FL.common.printToConsole("FLpage_editor->no save --> disconnect ok!");closeWindows();return;} 
			,function(err){FL.common.printToConsole("FLpage_editor->no save -->failure on disconnect err ="+err);return;}
		);
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
			FL.common.printToConsole("disconnect here");
			// FL.server.disconnect();
			e.returnValue = 'test returnValue...';
		}
		return 'You are exiting FrameLink page editor...';
	};
	FL.common.printToConsole(document.title+"......  END..");
})();
