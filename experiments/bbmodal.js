var MainView = Backbone.View.extend({
    el: 'body',
    events: {
        'click #open': 'openModal'
    },
    template: '<a id="open" class="btn">open modal</a>',
    openModal: function() {
        var view = new ModalView();
        var modal = new Backbone.BootstrapModal({
            content: view,
            title: 'modal header',
            animate: true
        });
        modal.open(function(){ console.log('clicked OK') });
    },
    render: function() {
        this.$el.html(this.template);
        return this;
    }
});

var ModalView = Backbone.View.extend({
    tagName: 'p',
    template: 'this is modal content',
    render: function() {
        this.$el.html(this.template);
        return this;
    }
});

$(document).ready(function() {
    var mainView = new MainView();
    mainView.render();
});
