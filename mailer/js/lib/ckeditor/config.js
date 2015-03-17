/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';
	
	// Toolbar configuration generated automatically by the editor based on config.toolbarGroups.
	config.toolbar = [
//		{ name: 'clipboard', groups: [ 'clipboard', 'undo' ], items: [ 'Cut', 'Copy', 'Paste', '-', 'Undo', 'Redo' ] },
//		{ name: 'editing', groups: [ 'find', 'selection', 'spellchecker' ], items: [ 'Find', 'Replace', '-', 'SelectAll', '-', 'Scayt' ] },
//		{ name: 'forms', items: [ 'Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField' ] },
//		'/',
		{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup'], items: [ 'Bold', 'Italic', 'Underline', '-', 'Strike', 'Subscript','Superscript'] },
		{name : 'textStyles', items : ['TextColor', 'BGColor']},
		{name : 'link', items : ['Link']},
		{ name: 'paragraph', items: [ 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock' ] },
		
//		{ name: 'textStyles', items: ['TextColor', 'BGColor', '-', 'Link' ] },
//		{ name: 'insert', items: [ 'Image', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe' ] },
//		'/',
		{ name: 'styles', items: [ 'FontSize' ,  'Font' ] },
//		{ name: 'colors', items: [ 'TextColor', 'BGColor' ] },
//		{ name: 'tools', items: [ 'Maximize', 'ShowBlocks' ] },
//		{ name: 'others', items: [ '-' ] },
//		{ name: 'about', items: [ 'About' ] }
		{ name: 'insert', items: [ 'unsubscribe' ] },
	];

	// Toolbar groups configuration.
	config.toolbarGroups = [
//		{ name: 'document', groups: [ 'mode', 'document', 'doctools' ] },
//		{ name: 'clipboard', groups: [ 'clipboard', 'undo' ] },
//		{ name: 'editing', groups: [ 'find', 'selection', 'spellchecker' ] },
//		{ name: 'forms' },
//		'/',
		{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup'] },
//		{ name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ] },
//		{ name: 'textStyles', groups: ['textStyles'] },
		{ name: 'insert' },
//		'/',
//		{ name: 'styles' },
//		{ name: 'colors' },
//		{ name: 'tools' },
//		{ name: 'others' },
//		{ name: 'about' }
	];
	config.extraPlugins = 'unsubscribe';
};
