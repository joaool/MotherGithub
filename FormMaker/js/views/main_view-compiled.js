"use strict";

FormDesigner.Views.MainView = Backbone.View.extend({
    entityModel: null,
    entityTemplate: null,
    entitiesDropDown: null,
    fieldsTemplate: null,

    initialize: function initialize() {
        this.m_Editor = new FormDesigner.Views.ElementHolder({ el: "body" });

        this.setEntityModel(new FormDesigner.Models.EntityModel());
        this.entityTempalate = Handlebars.compile($("#entityOption").html());
        this.fieldsTempalate = Handlebars.compile($("#fieldsOption").html());

        this.entitiesDropDown = this.$("#entities .options");
        this.fieldsList = this.$("#fields");
    },
    events: {
        "click .option.entity": "onEntityClick",
        "click #save": "saveBtnClick",
        "click #load": "loadJson"
    },
    loadJson: function loadJson() {
        $.getJSON("Sample.json", (function (data) {
            this.addJsonData(data);
        }).bind(this));
    },
    addJsonData: function addJsonData(data) {
        this.m_Editor.loadJson(data);
    },
    setEntityModel: function setEntityModel(entityModel) {
        this.entityModel = entityModel;
        this.listenTo(this.entityModel, "change:entities", this.onEntitiesLoaded.bind(this));
    },
    onEntitiesLoaded: function onEntitiesLoaded() {
        console.log(this.entityModel.get("entities"));
        this.entitiesDropDown.html(this.entityTempalate({ "entities": this.entityModel.get("entities") }));
    },
    onEntityClick: function onEntityClick(evt) {
        var entityId = $(evt.target).attr("entity_id");
        this.$(".selectedOption").text($(evt.target).html());
        var fields = FL.dd.t.entities[entityId].fieldsList();
        this.fieldsList.html(this.fieldsTempalate({ "fields": fields }));
        this.m_Editor.setEntity(FL.dd.t.entities[entityId]);
        this.m_Editor.bindDraggableObject();
    },
    saveBtnClick: function saveBtnClick() {

        var formData = this.m_Editor.save();
        window.formData = formData;
        window.open("formMaker.html", "_blank");
    },
    loadJSON: function loadJSON(data) {},
    loadEntities: function loadEntities() {
        this.entityModel.loadEntities();
    }
});

//# sourceMappingURL=main_view-compiled.js.map