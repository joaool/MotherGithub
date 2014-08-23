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
tinymce.PluginManager.add('framelink', function(editor, url) {
	editor.on('click', function(e) {
		// editor.selection.select(e.target);
		// alert(tinymce.activeEditor.selection.getContent());
		console.log("ON click !!! selection-->"+editor.selection.getContent());
		console.log("ON click !!! select-->"+editor.selection.getNode().nodeName);
		var titleValue = editor.selection.getNode().innerText;
		var hashValue = editor.selection.getNode().hash;
		var classValue = editor.selection.getNode().className;
		var idValue = editor.selection.getNode().id;
		var is_button = false;
		var pos = classValue.indexOf('btn');
		if(pos >= 0)
			is_button = true;//to prevent confusion with links
		var zz = editor.selection.getNode();
		var htmlTag = editor.selection.getNode().nodeName;
		if(is_button && htmlTag == "A"){//we clicked an <a> anchor tag
			editor.windowManager.open({
				title: 'Framelink Button Edition',
				body: [
					{type: 'textbox', name: 'title', label: 'Button title:', value:titleValue},
					{type: 'textbox', name: 'href', label: 'Call:', value:hashValue}
				],
				onsubmit: function(e) {
					// Insert content when the window form is submitted - we have access to the values by e.data.<name>
					var next = getNextId();
					var href = getHrefById(idValue);
					// setValuesOnHTML(idValue,{title:e.data.title, href:e.data.href});
					setInnerHTML(idValue,e.data.title);

					setValueOnHTML(idValue,"href",e.data.href);
					// alert("Input: title="+ e.data.title + " call=" +e.data.href + " Id=" + idValue);
				}
			});
		}
	});
	// Add a button that opens a window
	editor.addButton('framelink', {
		text: 'Button',
		tooltip: 'Insert a Button',
		image: 'img/spinner.gif',
		// icon: 'image',//false,
		// onclick : function() {
		//	ed.dom.setOuterHTML(ed.selection.getNode(),'<div class="red9">'+ed.dom.getOuterHTML(ed.selection.getNode())+'</div>'); 
		// }
		onclick: function() {
			// Open window
			editor.windowManager.open({
				title: 'Insert Button',
				body: [
					{type: 'textbox', name: 'title', label: 'Button title'}
				],
				onsubmit: function(e) {
					// editor.dom.setOuterHTML(editor.selection.getNode(),'<div class="red9">'+editor.dom.getOuterHTML(editor.selection.getNode())+'</div>'); 

					// Insert content when the window form is submitted
					editor.insertContent('%_%');//insert in current position
					var nextId = getNextId();
					var textarea = tinyMCE.get("my_editor").getContent();//gets the html content after inserting tag
					var pos = textarea.indexOf('%_%');
					//this works but injects </p> before <p>..</p> + <p>
					// editor.execCommand('mceInsertContent', false, '<span class="marker">my_node_content</span>');
					// editor.execCommand('mceInsertRawHTML', false, '<span class="marker">my_node_content</span>');
					// editor.execCommand('mceInsertRawHTML', false, "<div class='form-actions'>jojo</div>");
					// editor.execCommand('mceInsertContent', false, "<a class='btn btn-primary' href='javascript:FL.tourIn()'>" + e.data.title + "</a>");
					insertButton(e,textarea,nextId,pos);
					// editor.insertContent('Test FrameLink: ' + e.data.title);
				}
			});
		}
	});
	var insertButton = function(e,htmlContent,nextId,positionInsideHTML){

		// var codeToInsert = "<a class='btn btn-primary' href='javascript:FL.tourIn()'>" + e.data.title + "</a>";
		var codeToInsert = "<a id='" + nextId + "' class='btn btn-primary' href='#FL.tourIn()'>" + e.data.title + "</a>";

		// editor.execCommand('mceInsertContent', false, "<a class='btn btn-primary' href='javascript:FL.tourIn()'>" + e.data.title + "</a>");
		var htmlBefore = htmlContent.substring(0,positionInsideHTML);
		var htmlAfter = htmlContent.substring(positionInsideHTML+3);

		// // tinyMCE.get("my_editor").setContent(textarea + codeToInsert);
		var textarea= tinyMCE.get("my_editor").setContent(htmlBefore + codeToInsert + htmlAfter,{format:"raw"});
		// var textarea = tinyMCE.get("my_editor").getContent();//gets the html content after inserting tag
		var z=32;
	};
	window.getNextId = function() {
		var tx = editor.getContent({format: 'raw'});
		var lastPos = tx.length;
		var idContent = null;
		var idSpacePosition = null;
		var lastId = 0;
		var pos = 0;
		var k=0;
		while(pos >= 0){
			tx = tx.substring(pos);
			pos = tx.indexOf(' id=');
			if( pos >= 0 ){
				btnContent = tx.substring(pos+5,pos+15); //" id='12345678' " it will never exceed 8 digits....
				idSpacePosition = btnContent.indexOf(' ') - 1;
				lastId = btnContent.substring(0,idSpacePosition);
				pos = pos + 5 + idSpacePosition;
			}
			k++;
			if(k>5000)
				break;
		}
		var xRet = parseInt(lastId,10)+1;
		return xRet;
	};
	window.getHrefById = function(id) {
		var tx = editor.getContent({format: 'raw'});
		var xRet = null;
		var target = ' id="' + id + '" ';
		var pos = tx.indexOf(target);
		if( pos >= 0 ){ //id exists
			var targetContent = tx.substring(pos);
			var targetEndPos = targetContent.indexOf('</a>');
			if( targetEndPos >=0 ) { //otherwise is a malformed element (does not close)
				targetContent = targetContent.substring(0,targetEndPos);
				var hrefPos = targetContent.indexOf('href="');
				if( hrefPos >= 0 ){ //href exists inside <a> element
					var hrefContent = targetContent.substring( hrefPos + 6 );
					var hrefEndPos = hrefContent.indexOf('"');
					if(hrefEndPos >= 0){// otherwise href=" does not have closing "
						xRet = hrefContent.substring(0,hrefEndPos);
					}
				}
			}
		}
		return xRet;
	};
	window.setInnerHTML = function(id,value) {
		// example setInnerHTML(idValue,e.data.title);
		// setValueOnHTML(idValue,"href",e.data.href);
		var tx = editor.getContent({format: 'raw'});
		var target = ' id="' + id + '" ';
		var pos = tx.indexOf(target);
		if( pos >= 0 ){ //id exists
			var beforeTarget = tx.substring(0,pos);
			var targetContent = tx.substring(pos);
			var targetEndPos = targetContent.indexOf('</a>');
			if( targetEndPos >=0 ) { //otherwise is a malformed element (does not close)
				var afterTarget = targetContent.substring(targetEndPos);//begins with </a> until the end
				targetContent = targetContent.substring(0,targetEndPos);
				var beginOfInnerHTMLPos = targetContent.lastIndexOf('>');
				if (beginOfInnerHTMLPos >=0 ){//innertHTML as a begin
					beforeTarget = tx.substring(0,pos + beginOfInnerHTMLPos + 1);//we extend beforeTarget including the correct ">" 
					var newTextarea = beforeTarget + value + afterTarget;
					var textarea= tinyMCE.get("my_editor").setContent(newTextarea,{format:"raw"});
				}
				var z= 32;
			}
		}
	};	
	window.setValueOnHTML = function(id,valueName,value) {
		// example setValuesOnHTML(id,"title"{title:e.data.title, href:e.data.href});
		// setValueOnHTML(idValue,"href",e.data.href);
		var tx = editor.getContent({format: 'raw'});
		var target = ' id="' + id + '" ';
		var pos = tx.indexOf(target);
		if( pos >= 0 ){ //id exists
			var beforeTarget = tx.substring(0,pos);
			var targetContent = tx.substring(pos);
			var targetEndPos = targetContent.indexOf('</a>');
			if( targetEndPos >=0 ) { //otherwise is a malformed element (does not close)
				var afterTarget = targetContent.substring(targetEndPos);//begins with </a> until the end
				targetContent = targetContent.substring(0,targetEndPos);
				var newTarget = placeValueOnString(targetContent,valueName,value);
				var newTextarea = beforeTarget + newTarget + afterTarget;
				var textarea= tinyMCE.get("my_editor").setContent(newTextarea,{format:"raw"});
				var z= 32;
			}
		}
	};
	var placeValueOnString = function(targetStr,valueName,value) {//on targetStr places <valueName>=<value>
		// returns the same input string but with  <valueName>=<value>
		//example: placeValueOnString(" class='btn btn-primary' href='#FL.tourIn()'>Joao","href","abc()");
		var xRet = null;
		var pos = targetStr.indexOf(valueName+'="');
		if( pos >= 0 ){ //valueName exists
			var valueNameLen = valueName.length;
			var afterTarget = targetStr.substring(pos + valueNameLen +2);//begins with <oldValueContent>+'"' until the end
			var terminatorPos = afterTarget.indexOf('"');
			if( terminatorPos >=0 ) { //otherwise valueName as not terminator '"'
				xRet = targetStr.substring(0,pos) + valueName+'="' + value + afterTarget.substring(terminatorPos);
			}
		}
		return xRet;
	};
	// Adds a menu item to the tools menu
	editor.addMenuItem('framelink', {
		text: 'FrameLink Example plugin',
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