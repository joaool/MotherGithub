FormDesigner.Views.MainView = Backbone.View.extend({
    entityModel : null,
    entityTemplate : null,
    entitiesDropDown : null,
    fieldsTemplate : null,
    elementClickModel: null,
    labelIdCnt : 0,
    
    initialize: function(){
        this.m_Editor = new FormDesigner.Views.ElementHolder({el : "body"});
        this.listenTo(this.m_Editor, FormMaker.Events.ElementClick,this.onElementClick.bind(this));
        this.listenTo(this.m_Editor, FormMaker.Events.FormLoaded,this.onFormLoaded.bind(this));

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
        "click #Add" : "onAddClick",
        "click #editField" : "onEditBtnClick"
    },
    onAddClick: function(){
        if (!this.entityLoaded) {
            alert("Select a entity first");
            return;
        }
        var fCN = FL.dd.t.entities[this.entityLoaded.csingular]
            .addField( "TextField-"+this.labelIdCnt++,
                "Text Description",
                "label", 
                "text");
        //var fCN = FL.dd.t.entities[this.entityLoaded.csingular].getCName("TextField");
        var fieldData =  FL.dd.t.entities[this.entityLoaded.csingular].fields[fCN];
        fieldData["fCN"] = fCN;
        this.fieldsList.append(this.fieldsTempalate({"fields" : [fieldData]}));
        this.m_Editor.bindDraggableObject();
        //FL.dd.t.entities[this.entityLoaded.csingular].save();   
    },
    loadJson: function(jsonFile){
        if (!this.entityLoaded) {
            alert("Select a entity first");
            return;
        }
        jsonFile = jsonFile || this.jsonFile || "Sample.json";
        $.getJSON(jsonFile,(function(data){
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
        this.onEditBtnClick();
    },
    onFormLoaded: function(data){
        var fields = FL.dd.t.entities[data].fieldList();
        this.fieldsList.html(this.fieldsTempalate({"fields" : fields}));
        this.m_Editor.setEntity(FL.dd.t.entities[data]);
        this.entityLoaded = FL.dd.t.entities[data];
        this.m_Editor.bindDraggableObject();
    },
    onEditBtnClick: function(){
        if (this.elementClickModel.element == "TextLabel"){
            this.openLabelDialog();
            return;
        }
        var self = this;
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
                    //alert("You are entering the fields description.");
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
//        var mergeElement = [{"value": 1,"text": "no merge"}];
//        var self = this;
//        _.each(Object.keys(self.m_Editor.droppedElements), function (element) {
//            var value = self.m_Editor.droppedElements[element].model.get("leftLabel");
//            mergeElement.push({"value":element,"text":value});
//        });
        var dataItems = {
            master: {
                fieldLabel: FL.dd.t.entities[this.elementClickModel.entityName].fields[this.elementClickModel.fieldName].label,
                fieldName: this.elementClickModel.name,
                fieldDescription: FL.dd.t.entities[this.elementClickModel.entityName].fields[this.elementClickModel.fieldName].description,
                placeholder : "test",
                icon:"text",
//                mergeWith : "no merge",
//                mergeWith_options : mergeElement,
                userType: FL.dd.userType({type: "string", typeUI: FL.dd.t.entities[this.elementClickModel.entityName].fields[this.elementClickModel.fieldName].typeUI}),
                userType_options: arrOfObj
            }
        };
        var fieldEditorModal = new FL.modal.Box(" Field Editor", "fieldEdition", dataItems, boxOptions, function (result, data, changed) {
            if (result) {
                if (changed) {
                    console.log("fieldEditorModal Master  " ,data.master);
                    data.master.fCN = self.elementClickModel.fieldName;
                    self.m_Editor.updateElement(data.master);
                    
                }
            }
        });
        fieldEditorModal.show();
    },
    openLabelDialog: function () {
        var self = this;
        var titleOptions = {
            type: "primary",
            icon: "th-list",
            button1: "Cancel",
            button2: "Confirm title edition"
        };
        var titleItems = {
            master: {
                titleText: this.elementClickModel.leftLabel,
                fontSize: this.elementClickModel.fontSize || 12,
                fontColor: this.elementClickModel.fontColor || "black",
                titleAlignment : this.elementClickModel.textAlignment || "left",
                fontSize_options: [
                    {
                        "value": 1,
                        "text": 12
                    },
                    {
                        "value": 2,
                        "text": 14
                    },
                    {
                        "value": 3,
                        "text": 16
                    },
                    {
                        "value": 4,
                        "text": 18
                    }
                ],
                fontColor_options: [
                    {
                        "value": 1,
                        "text": "red"
                    },
                    {
                        "value": 2,
                        "text": "green"
                    },
                    {
                        "value": 3,
                        "text": "black"
                    }
                ],
                titleAlignment_options: [
                    {
                        "value": 1,
                        "text": "left"
                    },
                    {
                        "value": 2,
                        "text": "center"
                    },
                    {
                        "value": 3,
                        "text": "right"
                    }
                ]
            }
        };
        var titleModal = new FL.modal.Box(" Label Editor", "titleEdition", titleItems, titleOptions, function (result, data, changed) {
            if (result) {
                if (changed) {
                    console.log("titleModal Master  " ,data.master);
                    data.master.fieldName = self.elementClickModel.fieldName;
                    self.m_Editor.updateLabel(data.master);
                }
            }
        });
        titleModal.show();
    },
    onEntitiesLoaded: function(){
        console.log(this.entityModel.get("entities"));
        this.entityLoaded = this.entityModel.get("entities");
        this.entitiesDropDown.html(this.entityTempalate({"entities" : this.entityModel.get("entities")}));
        this.trigger("ENTITIES_LOADED",null);
    },
    onEntityClick: function(evt){
        var entityId = $(evt.target).attr("entity_id");
        this.$(".selectedOption").text($(evt.target).html());
        var fields = FL.dd.t.entities[entityId].fieldList();
        this.fieldsList.html(this.fieldsTempalate({"fields" : fields}));
        this.entityLoaded = FL.dd.t.entities[entityId];
        this.m_Editor.setEntity(this.entityLoaded);
        this.m_Editor.bindDraggableObject();
    },
    saveBtnClick: function(){
        if (!this.entityLoaded) {
            alert("Select a entity first");
            return;
        }
        var promise = FL.dd.t.entities[this.entityLoaded.csingular].save();
        var self = this;
        promise.done(function (eCN) {
            var entityName = FL.dd.getEntityByCName(eCN);
            FL.dd.t.entities.dumpToConsole();
            var formData = self.m_Editor.save();  
            window.formData = formData;
            window.open("formMaker.html","_blank");
        });
        promise.fail(function (err) {
            alert(err);
            alert("STOP");
        });
        
    },
    loadEntities: function(){
        this.entityModel.loadEntities();
    }
});