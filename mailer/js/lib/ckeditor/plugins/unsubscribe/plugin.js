CKEDITOR.plugins.add( 'unsubscribe', {
    
    init: function( editor ) {
        
        editor.ui.addButton( 'unsubscribe', {
            label: 'Insert Unsubscribe link',
            command: 'unsubscribe',
            toolbar: 'insert',
        });
		editor.addCommand( 'unsubscribe', {
			exec: function( editor ) {
				var unsub = MailerTemplate.UNSUBSCRIBELINK;
				editor.insertHtml("<a href="+unsub+">Unsubscribe</a>");
			}
		});
        
    }
});