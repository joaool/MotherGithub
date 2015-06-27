FormDesigner.Models.EntityModel = Backbone.Model.extend({
    initialize: function(){
        FL.dd.init_t();
    },
    loadEntities: function(){
        var entities = FL.dd.t.entities.list();
        console.log(entities.length);
    }
});