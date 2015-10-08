Elements = Backbone.Collection.extend({
    model : ElementModel,
    
    saveToDB : function(){
        this.models.forEach(function(model){
            if(model.get("element") != FormMaker.Elements.Label)
                model.saveToDB();
        });
    }
})