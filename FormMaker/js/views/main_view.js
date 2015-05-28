FormDesigner.Views.MainView = Backbone.View.extend({
    
    initialize: function(){
        this.m_Editor = new FormDesigner.Views.ElementHolder({el : "body"});
        
    },
    loadJSON: function(data){
        
    }
});