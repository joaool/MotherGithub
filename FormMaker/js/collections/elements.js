Elements = Backbone.Collection.extend({
    model : ElementModel,
    
    saveToDB : function(){
        this.models.forEach(function(model){
            model.saveToDB(); 
        });
    }
})