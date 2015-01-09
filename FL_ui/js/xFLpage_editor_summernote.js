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
			var page = FL.common.getTag(fullUrl,"page","#");//FL.domain is globally defined - the last # is disregarded
			var connectionString = FL.common.getTag(fullUrl,"connectionString","#");//FL.domain is globally defined - the last # is disregarded
			var style = FL.common.getTag(fullUrl,"style","#");//FL.domain is globally defined - the last # is disregarded
			var font = FL.common.getTag(fullUrl,"font","#");//FL.domain is globally defined - the last # is disregarded
			$("#pageTitle").empty();
			$("#pageTitle").text("FrameLink - editing " + page +" page");
			// alert("Test getTag(fullUrl,'connectionString','#')="+FL.common.getTag(fullUrl,'connectionString','#'));
			// alert("Test getTag(fullUrl,'page','#')="+FL.common.getTag(fullUrl,'page','#'));
			// alert("Test getTag(fullUrl,'style','#')="+FL.common.getTag(fullUrl,'style','#'));
			// alert("Test getTag(fullUrl,'font','#')="+FL.common.getTag(fullUrl,'font','#'));

		
			FL.server.fa = new FL.server.fl.app();
			var myApp = JSON.parse(connectionString);
			FL.server.fl.setTraceClient(2);
			FL.server.fa.connect(myApp, function(err2, data2){
				if (err2){
					localStorage.connection = null;
					alert('FLpage_editor.js connect: err=' + JSON.stringify(err2));
					return;
				}
				FL.server.restorePage(page, function(err,data){
					if (err){
						alert('FLpage_editor.js FL.server.restorePage after connect: err=' + JSON.stringify(err2));
						return;
					}
					alert('FLpage_editor.js FL.server.restorePage after connect: PAGE RESTORED SUCCESSFULLY data=' + JSON.stringify(data));
					var htmlStr0 = data.d.html;
					// localStorage.connection = JSON.stringify(myApp);
					var htmlStr="<div class='jumbotron'>" + 
									"<h1>FrameLink Platform</h1>" + 
									"<p>This site has no functionality as it is. <strong>Sign In</strong> as a designer (upper right corner) to transform this site into the backend of your business. No need for email/password initially. Introduce them later on, to continue the design or give access to someone else.</p><p><strong>'Tour'</strong> will give you an idea how to redesign this site into your business information system.</p>" +
									"<p>" + 
										"<a href='#' class='btn btn-primary btn-large' onclick='FL.showTourStep0 = true; FL.tourIn();'>Tour</a>" +
									"</p>" + 
								"</div>";
					editPage(page,htmlStr);
				});
				// return connectServerCB(null);
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
			alert("continueFunction !!!! code to develop here !!! pageName="+pageName);
			// $('.summernote').summernote({
			// 	height: 300,                 // set editor height

			// 	minHeight: null,             // set minimum height of editor
			// 	maxHeight: null,             // set maximum height of editor

			// 	focus: true,                 // set focus to editable area after initializing summernote
			// });
			// alert("continueFunction !!!! saves !!!");

			// FL.server.offline = false;
			// FL.server.connect("Joao","oLiVeIrA",function(err){
			// 	console.log("connectServer connection is="+err);
			// 	if(err){
			// 		alert('FL_pageEditor FL.server.connect: ERROR err=' + JSON.stringify(err));
			// 		return ;
			// 	}else{
			// 		FL.server.savePage("about","<p>Hello about z test</>",function(err){//"43" must exist
			// 			if (err){
			// 				alert('FL_pageEditor FL.server.savePage: ERROR err=' + JSON.stringify(err));
			// 				return ;
			// 			}
			// 			alert('FL_pageEditor FL.server.savePage: page was successfully saved !!!');

			// 		});
			// 	}
			// });			
		// $('#summernote').summernote();
			$('.summernote').summernote({
					height: 400,                 // set editor height
					// tabsize: 2,
					// codemirror: {
					// 	theme: 'monokai'
					// }

					minHeight: null,	 // set minimum height of editor
					maxHeight: 400,	// set maximum height of editor

					focus: true	// set focus to editable area after initializing summernote
					// toolbar: [
					// 	['style', ['style']], // no style button
					// 	['style', ['bold', 'italic', 'underline', 'clear']],
					// 	['fontsize', ['fontsize']],
					// 	['color', ['color']],
					// 	['para', ['ul', 'ol', 'paragraph']],
					// 	['height', ['height']],
					// // 	['insert', ['picture', 'link']], // no insert buttons
					// // 	['table', ['table']], // no table button
					// // 	//['help', ['help']] //no help button
					//      ['view', ['fullscreen', 'codeview']]
					// ]	
			});
			console.log("-->"+htmlStr);
			// $('#summernote').code(htmlStr);
			$('#summernote').summernote({
				oninit: function() {
					// alert('Summernote is launched');
					$('#summernote').code(htmlStr);
					
					// -------- this code add to buttons to the beggining ---------------
					var openBtn = '<button id="openFileBtn" type="button" class="btn btn-default btn-sm btn-small" title="Open file" data-event="something" tabindex="-1"><i class="icon-edit"></i></button>';
					var saveBtn = '<button id="saveFileBtn" type="button" class="btn btn-default btn-sm btn-small" title="Save Template" data-event="something" tabindex="-1"><i class="icon-download-alt"></i></button>';
					var fileGroup = '<div class="note-file btn-group">' + openBtn + saveBtn + '</div>';
					$(fileGroup).prependTo($('.note-toolbar'));
					// Button tooltips
					$('#openFileBtn').tooltip({container: 'body', placement: 'bottom'});
					$('#saveFileBtn').tooltip({container: 'body', placement: 'bottom'});
					// Button events
					$('#openFileBtn').click(function(event) {
						//http://maxrohde.com/2014/03/28/insert-text-at-caret-position-in-summernote-editor-for-bootstrap/
						// loadContent(editor);
						// alert("openFileBtn");
						var selection = document.getSelection();
						var cursorPos = selection.anchorOffset;
						var oldContent = selection.anchorNode.nodeValue;
						// var toInsert = "<div class='form-actions'>" +
											// "<a href='javascript:exitSaving()' class='btn btn-primary'>Test</a>" +
										// "</div>";
						var toInsert = "%Button%";
						var newContent = oldContent.substring(0, cursorPos) + toInsert + oldContent.substring(cursorPos);
						selection.anchorNode.nodeValue = newContent;
						var sHTML = $('#summernote').code();
						// alert("--->"+sHTML);
						var newStrHTMLbefore = FL.common.stringBeforeLast(sHTML,toInsert);
						// alert("-before->"+newStrHTMLbefore);
						var newStrHTMLafter = FL.common.stringAfterLast(sHTML,toInsert);
						// alert("-after->"+newStrHTMLafter);
						var codeToInsert = "<div class='form-actions'>" +
												// "<a href='javascript:exitSaving()' class='btn btn-primary'>Test</a>" +
												"<a href='#1' class='btn btn-primary'>Test</a>" +
											"</div>";
						var newCodeContent = newStrHTMLbefore + codeToInsert + newStrHTMLafter;
						// alert("-newCodeContent->"+newCodeContent);

						$('#summernote').code(newCodeContent);
					

					});
					$('#saveFileBtn').click(function(event) {
						// saveContent(editor);
						alert("saveFileBtn");

					});
					//--------------------------------------------------------------------
				}
			});
			// $('.note-codable').remove();
			$('#summernote').summernote({
				onblur: function(e) {
					console.log('Editable area loses focus');
				}
			});
			$('#summernote').summernote({
				onkeyup: function(e) {
					$(".codeview").val($("#summernote").code());
				},
				height: 300,
			});
			$('#summernote').summernote({
				onImageUpload: function(files, editor, $editable) {
					console.log('image upload:', files, editor, $editable);
					alert("Image upload !!!");
				},
				height: 300,
			});			
		};
	});
	exitSaving = function(){
		var sHTML = $('#summernote').code();
		alert("exitSaving sHTML="+sHTML);
	};
	exitNoSave = function(){
		alert("exitNoSave");
	};
	console.log(document.title+"......  END..");
})();
