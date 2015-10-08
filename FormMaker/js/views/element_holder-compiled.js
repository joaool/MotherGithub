"use strict";

FormDesigner.Views.ElementHolder = Backbone.View.extend({
    model: null,
    dragNDropHandler: null,
    propertiesPanel: null,
    currentHoverElement: null,
    elementCount: 0,
    droppedElements: [],
    entityLoaded: null,
    modelsCollection: null,

    initialize: function initialize() {
        this.propertiesPanel = new FormDesigner.Views.PropertyPanel({ el: "#properties" });
        this.listenTo(this.propertiesPanel, FormMaker.Events.PropertyChange, this.onPropertyChange);
        this.listenTo(this.propertiesPanel, FormMaker.Events.TypeChange, this.onTypeChange);

        this.model = new FormDesigner.Models.DesignerModel();
        $(".menuItem").on("click", this.onMenuItemClick.bind(this));

        this.modelsCollection = new Elements();
        // this.$("#fieldstemp").html((Handlebars.compile($("#tempTemplate").html()))());
        this.bindDraggableObject();
    },
    bindDraggableObject: function bindDraggableObject() {
        this.dragNDropHandler = new DragNDrop();
        var oDragNDrop = DragNDrop.getInstance();
        oDragNDrop.setDroppableObject({ droppableSelectors: [{
                droppable: ".ui-dropppable"
            }]
        });
        oDragNDrop.setDraggableObject({ draggableSelectors: [{
                draggable: ".ui-draggable"
            }],
            helper: "clone",
            helperCss: "",
            revert: this.OnRevert,
            OnStartCallBack: this.OnStart.bind(this),
            OnStopCallBack: this.OnStop.bind(this)
        });

        this.ApplySortingEvent();
    },
    onMenuItemClick: function onMenuItemClick(e) {
        if (e.currentTarget.id == "delete") {
            if (FormMaker.CurrentElement) {
                this.removeElement(FormMaker.CurrentElement);
            }
        }
    },
    OnStart: function OnStart(event, ui) {
        console.log("Drag Started");
    },
    OnStop: function OnStop(event, ui) {
        console.log("Drop End");
        //this.onDrop(event.target,ui.item[0]);
    },
    OnRevert: function OnRevert(dropped) {
        console.log(dropped);
        return dropped;
    },
    ApplySortingEvent: function ApplySortingEvent() {
        var temp = this;
        $(".sortable").sortable();
        $(".sortable").sortable("destroy");
        $(".sortable").sortable({
            connectWith: ".sortable",
            placeholder: "ui-state-highlight",
            tolerance: "pointer",
            stop: function stop(event, ui) {
                temp.onDrop(event.target, ui.item[0]);
            },
            beforeStop: function beforeStop(event, ui) {
                temp.DroppedObjectOnMove = ui.helper;
            },
            update: (function (event, ui) {
                var droppedObject = ui.item[0];
                var alignment = event.target.id == "designerCol1" ? "left" : "right";
                var cname = $(droppedObject).attr("id");
                if (cname) {
                    var element = this.modelsCollection.where({ "id": cname })[0];
                    element.set("alignment", alignment);
                }
            }).bind(this)
        });
        //$( ".sortable" ).disableSelection();
    },
    ApplyHoverEvent: function ApplyHoverEvent() {
        var temp = this;
        $(".droppedObject").hover(function (obj) {
            temp.OnHoverIn(obj.currentTarget);
        }, function (obj) {});
    },

    OnHoverIn: function OnHoverIn(obj) {
        var element = this.model.getElement($(obj).attr("cname"));
        this.currentHoverElement = obj;
        //this.m_PropertyToolbar.setElement(obj);
    },
    onDrop: function onDrop(target, droppedObject) {
        if ($(droppedObject).hasClass("dropped")) return;
        var cname = $(droppedObject).attr("cname");
        var elementType = FormMaker.DBElements[$(droppedObject).data("type")];
        var inputType = FormMaker.DBType[$(droppedObject).data("input-type")];
        var leftLabel = $(droppedObject).data("label");
        var name = $(droppedObject).data("name");
        var dropDownEnum = $(droppedObject).data("enum");
        var description = $(droppedObject).data("description");
        var id = this.getNextId();
        var fieldName = FL.dd.t.entities[this.entityLoaded.csingular].getFieldCName(name);
        var alignment = target.id == "designerCol1" ? "left" : "right";

        var element = {
            "element": elementType || FormMaker.Elements.Text,
            "leftLabel": leftLabel,
            "name": name,
            "type": inputType,
            "value": dropDownEnum,
            "id": id,
            "fieldName": fieldName
        };
        if (cname) {
            element = this.model.getElement(cname);
            element = jQuery.extend(true, {}, element);
            var id = this.getNextId();
            element.id = id;
            element.cname = cname;
        }
        element.entityName = this.entityLoaded.csingular;
        element.alignment = alignment;

        this.addElement(target.id, element);
        $(droppedObject).remove();
    },
    addElement: function addElement(id, element) {
        var obj = new FormMaker[element.element]({ el: "#" + id, model: element });
        this.listenTo(obj, FormMaker.Events.ElementClick, this.onElementClick.bind(this));
        this.listenTo(obj, FormMaker.Events.ValueChange, this.onValueChange.bind(this));
        obj.loadData(element);
        obj.setParent("#" + id);
        obj.render();
        this.droppedElements[element.id] = obj;
        this.modelsCollection.set(obj.getModel(), { remove: false });

        this.propertiesPanel.setElementProperties(element);
        this.setTypeField(element);
        $("body").css("cursor", "default");
    },
    onValueChange: function onValueChange(data) {
        this.propertiesPanel.setElementProperties(data);
    },
    onElementClick: function onElementClick(data) {
        this.propertiesPanel.setElementProperties(data);
        this.setTypeField(data);
    },
    onTypeChange: function onTypeChange(data) {
        var elementView = this.droppedElements[data.id];
        if (!elementView) return;
        var model = elementView.getModel();
        model.set("element", data.value);

        var obj = new FormMaker[data.value]({ el: elementView.getParentSelector(), model: model });
        this.listenTo(obj, FormMaker.Events.ElementClick, this.onElementClick.bind(this));
        this.listenTo(obj, FormMaker.Events.ValueChange, this.onValueChange.bind(this));
        obj.loadData(model.toJSON());
        obj.renderBefore(elementView);

        this.removeElement(elementView);
        this.droppedElements[data.id] = obj;
        this.modelsCollection.set(obj.getModel(), { remove: false });
        this.propertiesPanel.setElementProperties(model.toJSON());
    },
    setTypeField: function setTypeField(data) {
        this.$("#type #Type" + data.element).prop("checked", true);
    },
    removeElement: function removeElement(element) {
        element.remove();
        delete this.droppedElements[element.model.get("id")];
        this.modelsCollection.remove(element.model);
        this.propertiesPanel.setElementProperties({});
    },
    getNextId: function getNextId() {
        return "Element" + ++this.elementCount;
    },
    onPropertyChange: function onPropertyChange(data) {
        var elementView = this.droppedElements[data.id];
        if (elementView) elementView.update(data);
        this.modelsCollection.set(elementView.getModel(), { remove: false });
    },
    save: function save() {
        this.modelsCollection.saveToDB();
        var left = this.modelsCollection.where({ "alignment": "left" }).reduce(function (prev, curr) {
            var json = curr.toJSON();
            var jsonToSave = {
                fCN: json.fieldName,
                leftLabel: json.leftLabel,
                alignment: json.alignment
            };
            prev.push(jsonToSave);
            return prev;
        }, []);
        var right = this.modelsCollection.where({ "alignment": "right" }).reduce(function (prev, curr) {
            var json = curr.toJSON();
            var jsonToSave = {
                fCN: json.fieldName,
                leftLabel: json.leftLabel,
                alignment: json.alignment
            };
            prev.push(jsonToSave);
            return prev;
        }, []);
        var form = {
            "eCN": this.entityLoaded.csingular,
            "left": left,
            "right": right
        };
        return form;
    },
    setEntity: function setEntity(entity) {
        this.entityLoaded = entity;
    },
    loadJson: function loadJson(data) {
        var leftElements = data.left;
        var rightElements = data.right;
        $.each(leftElements, (function (i, element) {
            this.addElement("designerCol1", element);
        }).bind(this));
        $.each(rightElements, (function (i, element) {
            this.addElement("designerCol2", element);
        }).bind(this));
    }
});

//# sourceMappingURL=element_holder-compiled.js.map