ElementModel = Backbone.Model.extend({
    
    saveToDB: function(){
        FL.dd.t.entities[this.get("entityName")].
        fields[this.get("fieldName")].
        setField({
                description: this.get("description"),
                enumerable: null,
                label: this.get("leftLabel"),
                name: this.get("name"),
                typeUI: this.get("typeUI")
            });
    }
})