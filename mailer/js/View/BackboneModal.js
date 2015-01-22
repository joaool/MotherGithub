MailerTemplate.Views.ModalView = Backbone.View.extend({
    tagName: 'p',
    template: 'this is modal content',
	
	initialize : function(){
		this.bind("ok", this.okClicked);	
	},
	okClicked: function (modal) {
        console.log("Ok was clicked");
        modal.close();
		modal.preventClose();
		this.trigger(MailerTemplate.Views.ModalView.OkClicked,"");
    },
    render: function() {
        this.$el.html(this.template);
        return this;
    },
	setHtml : function(html){
		this.template = html
		this.render();
	}
});

MailerTemplate.Views.ModalView.OkClicked = "modalOkClicked";