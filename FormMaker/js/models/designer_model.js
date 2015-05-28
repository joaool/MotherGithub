FormDesigner.Models.DesignerModel = Backbone.Model.extend({
    url : function(){
        return "Entities.json";
    },
    
    initialize: function(){
        this.loadJSON();
    },
    loadJSON: function(){
        this.fetch({
            url:this.url(),
            success: this.onSuccess.bind(this),
            error:this.onError.bind(this)
        });
    },
    onSuccess: function(obj,resp){
        var elements = resp["elements"];
        var elems = [];
        for(var i=0;i<elements.length;i++){
            var element = elements[i];
            elems[element.cname] = element;
        }
        this.set("elems",elems);
    },
    onError: function(obj,resp){
        
    },
    getElement: function(cname){
        return this.get("elems")[cname];
    }
});