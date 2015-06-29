FormDesigner.Models.EntityModel = Backbone.Model.extend({
    initialize: function(){
        window.entitiesLoaded = this.entitiesLoaded.bind(this);
    },
    loadEntities: function(){
    },
    entitiesLoaded: function(){
        var entities = FL.dd.t.entities.list();
        this.set("entities",entities);
    }
});