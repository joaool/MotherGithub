ModalView = Backbone.View.extend({
    tagName: 'p',
    template: 'this is modal content',
    render: function() {
        this.$el.html(this.template);
        return this;
    }
});