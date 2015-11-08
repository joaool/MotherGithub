ElementModel = Backbone.Model.extend({
    
    initialize: function(){

    },
    saveToDB: function(){
        FL.dd.t.entities[this.get("entityName")].
        fields[this.get("fieldName")].
        set({
                description: this.get("description"),
                enumerable: null,
                label: this.get("leftLabel"),
                name: this.get("name"),
                typeUI: this.get("typeUI")
            });
    }
})