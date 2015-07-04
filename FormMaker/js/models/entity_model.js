FormDesigner.Models.EntityModel = Backbone.Model.extend({
    initialize: function(){
        window.entitiesLoaded = this.entitiesLoaded.bind(this);
    },
    loadEntities: function(){
    },
    entitiesLoaded: function(){
        var entities = FL.dd.t.entities.list();
        this.set("entities",entities);
        var initData = {};
        initData["typeUI"] = [];
        initData["type"] = [];
        $.each(entities,function(i,item){
            var attr = item.attributes;
            var arr = attr.reduce(function(prev,curr,index,array){
                if (prev.typeUI.indexOf(array[index].typeUI) == -1)
                    prev.typeUI.push(array[index].typeUI);
                
                if (prev.type.indexOf(array[index].type) == -1)
                    prev.type.push(array[index].type);
                
                return prev;
            },initData);
        })
        console.log(initData);
    }
});