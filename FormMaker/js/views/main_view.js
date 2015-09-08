FormDesigner.Views.MainView = Backbone.View.extend({
    entityModel : null,
    entityTemplate : null,
    entitiesDropDown : null,
    fieldsTemplate : null,
    elementClickModel: null,
    
    initialize: function(){
        this.m_Editor = new FormDesigner.Views.ElementHolder({el : "body"});
        this.listenTo(this.m_Editor, FormMaker.Events.ElementClick,this.onElementClick.bind(this));

        this.setEntityModel(new FormDesigner.Models.EntityModel());
        this.entityTempalate = Handlebars.compile($("#entityOption").html() );
        this.fieldsTempalate = Handlebars.compile($("#fieldsOption").html() );
        $("#type").html(Handlebars.compile($("#typeTemplate").html())(FormMaker.TypeTemplate));
        
        this.entitiesDropDown = this.$("#entities .options");
        this.fieldsList = this.$("#fields");
        
    },
    events: {
        "click .option.entity" : "onEntityClick",
        "click #save" : "saveBtnClick",
        "click #load" : "loadJson",
        "click #editField" : "onEditBtnClick"
    },
    loadJson: function(){
        $.getJSON("Sample.json",(function(data){
            this.addJsonData(data);
        }).bind(this));
    },
    addJsonData: function(data){
        this.m_Editor.loadJson(data);  
    },
    setEntityModel: function(entityModel){
        this.entityModel = entityModel
        this.listenTo(this.entityModel,"change:entities",this.onEntitiesLoaded.bind(this));
    },
    onElementClick: function(data){
        this.elementClickModel = data;
        $("#editField").html(data.leftLabel); 
    },
    onEditBtnClick: function(){
        var boxOptions = {
            type: "primary",
            icon: "th-list",
            button1: "Cancel",
            button2: "Confirm field edition",
            posField: {
                fieldLabel: function (Box) {
                    //alert("You are leaving the column title field");
                },
                fieldName: function (Box) {
                    //alert("You are leaving the fieldName field");
                    //var singular = FL.dd.getEntityByCName(Box.data.eCN);
                    //Box.data.fCN = FL.dd.getFieldCompressedName(singular,Box.get("fieldName"));
                }
            },
            preField: {
                fieldDescription: function (Box) {
                    alert("You are entering the fields description.");
                }
            },
            option: {
                userType_options: function (Box, selected) {
                    //alert("You clicked in option " + selected.text);
                    FL.common.printToConsole("%%%%%%%%>user code typeUI_options --> content=" + JSON.stringify(selected), "modalIn");
                }
            }
        };
        var arrOfObj = FL.dd.arrOfUserTypesForDropdown();
        var dataItems = {
            master: {
                fieldLabel: FL.dd.t.entities[this.elementClickModel.entityName].fields[this.elementClickModel.fieldName].label,
                fieldName: this.elementClickModel.name,
                fieldDescription: a = FL.dd.t.entities[this.elementClickModel.entityName].fields[this.elementClickModel.fieldName].description,
                userType: FL.dd.userType({type: "string", typeUI: this.elementClickModel.typeUI}),
                userType_options: arrOfObj
            }
        };
        var fieldEditorModal = new FL.modal.Box("Field Editor", "fieldEdition", dataItems, boxOptions, function (result, data, changed) {
            if (result) {
                if (changed) {
                    alert("fieldEditorModal Master  " + JSON.stringify(data.master));
                }
            }
        });
        fieldEditorModal.show();
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
        
        var formData = this.m_Editor.save();  
        window.formData = formData;
        window.open("formMaker.html","_blank");
    },
    loadJSON: function(data){
        
    },
    loadEntities: function(){
        this.entityModel.loadEntities();
    }
});