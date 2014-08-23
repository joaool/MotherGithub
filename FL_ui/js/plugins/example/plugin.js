/**
 * plugin.js
 *
 * Copyright, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/*jshint unused:false */
/*global tinymce:true */

/**
 * Example plugin that adds a toolbar button and menu item.
 */
tinymce.PluginManager.add('example', function(editor, url) {
	// Add a button that opens a window
	editor.addButton('example', {
		text: 'FrameLInk button',
		tooltip: 'Insert a Button',
		icon: false,
		onclick: function() {
			// Open window
			editor.windowManager.open({
				title: 'Framelink Example plugin',
				body: [
					{type: 'textbox', name: 'title', label: 'FL.Title'}
				],
				onsubmit: function(e) {
					// Insert content when the window form is submitted
					testFunc();
					var codeToInsert = "<div class='form-actions'>" +
											// "<a href='javascript:exitSaving()' class='btn btn-primary'>Test</a>" +
											"<a href='#1' class='btn btn-primary'>" + e.data.title + "</a>" +
										"</div>";
					var textarea = tinyMCE.get("my_editor").getContent();//gets the html content
					alert("ooooo=>"+textarea);
					// tinyMCE.get("my_editor").setContent(textarea + "***");
					tinyMCE.get("my_editor").setContent(textarea + codeToInsert);
					// editor.insertContent('Test FrameLink: ' + e.data.title);
				}	
			});
		}
	});
	var testFunc = function(){
		alert("testFunc");
	};
	// Adds a menu item to the tools menu
	editor.addMenuItem('example', {
		text: 'Example plugin',
		context: 'tools',
		onclick: function() {
			// Open window with a specific url
			editor.windowManager.open({
				title: 'Framelink & TinyMCE site',
				url: url + '/dialog.html',
				width: 600,
				height: 400,
				buttons: [
					{
						text: 'Insert',
						onclick: function() {
							// Top most window object
							var win = editor.windowManager.getWindows()[0];

							// Insert the contents of the dialog.html textarea into the editor
							editor.insertContent(win.getContentWindow().document.getElementById('content').value);

							// Close the window
							win.close();
						}
					},

					{text: 'Close', onclick: 'close'}
				]
			});
		}
	});
});