FormDesigner.Views.MainView = Backbone.View.extend({
    entityModel : null,
    entityTemplate : null,
    entitiesDropDown : null,
    fieldsTemplate : null,
    
    initialize: function(){
        this.m_Editor = new FormDesigner.Views.ElementHolder({el : "body"});
        
        this.setEntityModel(new FormDesigner.Models.EntityModel());
        this.entityTempalate = Handlebars.compile($("#entityOption").html() );
        this.fieldsTempalate = Handlebars.compile($("#fieldsOption").html() );
        
        this.entitiesDropDown = this.$("#entities .options");
        this.fieldsList = this.$("#fields");
        
    },
    events: {
        "click .option.entity" : "onEntityClick",
        "click #save" : "saveBtnClick"
    },
    setEntityModel: function(entityModel){
        this.entityModel = entityModel
        this.listenTo(this.entityModel,"change:entities",this.onEntitiesLoaded.bind(this));
    },
    onEntitiesLoaded: function(){
        console.log(this.entityModel.get("entities"));
        this.entitiesDropDown.html(this.entityTempalate({"entities" : this.entityModel.get("entities")}));
    },
    onEntityClick: function(evt){
        var entityId = $(evt.target).attr("entity_id");
        this.$(".selectedOption").text($(evt.target).html());
        var fields = FL.dd.t.entities[entityId].fieldsList();
        this.fieldsList.html(this.fieldsTempalate({"fields" : fields}));
        this.m_Editor.setEntity(FL.dd.t.entities[entityId]);
        this.m_Editor.bindDraggableObject();
    },
    saveBtnClick: function(){
        this.m_Editor.save();  
    },
    loadJSON: function(data){
        
    },
    loadEntities: function(){
        this.entityModel.loadEntities();
    }
});