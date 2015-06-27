FormDesigner.Views.MainView = Backbone.View.extend({
    entitiyModel : null,
    
    initialize: function(){
        this.m_Editor = new FormDesigner.Views.ElementHolder({el : "body"});
        this.entityModel = new FormDesigner.Models.EntityModel();    
    },
    loadJSON: function(data){
        
    },
    loadEntities: function(){
        this.entityModel.loadEntities();
    }
});